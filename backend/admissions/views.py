from django.db import transaction
from django.utils import timezone
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts import audit
from accounts.permissions import IsAdmin, IsApplicant

from .models import (
    AdmissionApplication,
    AdmissionDocument,
    ApplicationStatus,
    ParentRelationshipRequest,
    ParentRelationshipStatus,
)
from .permissions import IsApplicationOwner
from .serializers import (
    AdmissionApplicationAdminListSerializer,
    AdmissionApplicationDecisionSerializer,
    AdmissionApplicationDetailSerializer,
    AdmissionApplicationPublicStatusSerializer,
    AdmissionApplicationWriteSerializer,
    AdmissionDocumentSerializer,
    ParentRelationshipRequestAdminSerializer,
    ParentRelationshipRequestCreateSerializer,
    ParentRelationshipRequestDecisionSerializer,
)


class AdmissionApplicationViewSet(viewsets.ModelViewSet):
    """
    /api/admissions/applications/ -- an applicant's OWN admission
    applications. A single applicant account can have more than one (e.g.
    a parent applying for two children), each independently trackable.
    """

    queryset = AdmissionApplication.objects.all()
    permission_classes = [IsApplicant, IsApplicationOwner]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return AdmissionApplication.objects.none()
        return AdmissionApplication.objects.filter(
            applicant=self.request.user
        ).prefetch_related("documents")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AdmissionApplicationDetailSerializer
        return AdmissionApplicationWriteSerializer

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.status != ApplicationStatus.STARTED:
            raise PermissionDenied(
                "This application has already been submitted and can no longer be edited directly."
            )
        serializer.save()

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """POST /api/admissions/applications/<id>/submit/ -- Section 19's
        review-and-submit step: locks the draft, generates the BFA-YYYY-NNNNNN
        reference number, and moves status to Submitted."""
        application = self.get_object()
        if application.status != ApplicationStatus.STARTED:
            return Response(
                {"detail": "This application has already been submitted."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        required_fields = [
            application.student_first_name,
            application.student_last_name,
            application.student_dob,
            application.class_applying_for,
            application.academic_session,
            application.guardian_full_name,
            application.guardian_phone,
            application.guardian_email,
        ]
        if not all(required_fields):
            return Response(
                {
                    "detail": "Complete the student and guardian sections before submitting."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            application.reference = application.generate_reference()
            application.status = ApplicationStatus.SUBMITTED
            application.submitted_at = timezone.now()
            application.save(update_fields=["reference", "status", "submitted_at"])

            from services import notification_service
            from accounts.models import AdminNotificationType

            notification_service.notify_admin(
                title=f"New Admission Application: {application.reference}",
                message=f"{application.student_first_name} {application.student_last_name} submitted application for {application.class_applying_for}.",
                notification_type=AdminNotificationType.APPLICATION_SUBMITTED,
                object_instance=application,
                user=request.user,
            )
        return Response(
            AdmissionApplicationDetailSerializer(application).data,
            status=status.HTTP_200_OK,
        )


class ApplicationDocumentListCreateView(generics.ListCreateAPIView):
    """/api/admissions/applications/<application_id>/documents/"""

    serializer_class = AdmissionDocumentSerializer
    permission_classes = [IsApplicant]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def _get_application(self):
        application = generics.get_object_or_404(
            AdmissionApplication.objects.all(), pk=self.kwargs["application_id"]
        )
        is_admin = (
            getattr(self.request.user, "profile", None)
            and self.request.user.profile.role == "admin"
        )
        if not is_admin and application.applicant_id != self.request.user.id:
            raise PermissionDenied("This is not your application.")
        return application

    def get_queryset(self):
        return AdmissionDocument.objects.filter(application=self._get_application())

    def perform_create(self, serializer):
        app = self._get_application()
        doc = serializer.save(application=app)
        try:
            from services import notification_service
            from accounts.models import AdminNotificationType

            notification_service.notify_admin(
                title=f"Document Uploaded: {app.reference or app.id}",
                message=f"Document ({doc.get_document_type_display()}) uploaded for {app.student_first_name} {app.student_last_name}.",
                notification_type=AdminNotificationType.DOCUMENT_UPLOADED,
                object_instance=app,
                user=self.request.user,
            )
        except Exception:
            pass


class AdmissionApplicationPublicStatusView(generics.RetrieveAPIView):
    """GET /api/admissions/status/<reference>/ -- public, unauthenticated
    reference lookup for the full application (Section 20), separate from
    public_site's AdmissionEnquiry status lookup."""

    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationPublicStatusSerializer
    permission_classes = [AllowAny]
    lookup_field = "reference"
    lookup_url_kwarg = "reference"


class AdmissionApplicationReceiptUploadView(generics.CreateAPIView):
    """
    POST /api/admissions/status/<reference>/upload-receipt/
    Allows an applicant to upload their payment receipt / bank transfer slip.
    Publicly accessible with valid application reference.
    """

    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, reference):
        from .models import DocumentType, AdmissionDocument, MAX_DOCUMENT_SIZE_MB

        application = generics.get_object_or_404(
            AdmissionApplication.objects.all(), reference=reference
        )

        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response(
                {"detail": "No file uploaded. Please select your payment receipt or transfer slip."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if uploaded_file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024:
            return Response(
                {"detail": f"File must be smaller than {MAX_DOCUMENT_SIZE_MB}MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        doc = AdmissionDocument.objects.create(
            application=application,
            document_type=DocumentType.PAYMENT_RECEIPT,
            file=uploaded_file,
        )

        try:
            from services import notification_service
            from accounts.models import AdminNotificationType

            notification_service.notify_admin(
                title=f"Payment Receipt Uploaded: {application.reference}",
                message=f"Payment receipt uploaded for {application.student_first_name} {application.student_last_name}. Please verify payment.",
                notification_type=AdminNotificationType.DOCUMENT_UPLOADED,
                object_instance=application,
            )
        except Exception:
            pass

        return Response(
            {
                "detail": "Payment receipt uploaded successfully.",
                "id": doc.id,
                "file": doc.file.url if hasattr(doc.file, "url") else str(doc.file),
                "uploaded_at": doc.uploaded_at,
            },
            status=status.HTTP_201_CREATED,
        )



class AdmissionApplicationAdminViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        from services import admission_service

        application = self.get_object()
        amount = float(request.data.get("amount", 150000.0))
        due_date = request.data.get("due_date", None)
        notes = request.data.get("notes", "")

        updated = admission_service.move_to_payment(
            application=application,
            admin_user=request.user,
            amount=amount,
            due_date=due_date,
            notes=notes,
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(updated).data)

    @action(detail=True, methods=["post"])
    def decline(self, request, pk=None):
        from services import admission_service

        application = self.get_object()
        notes = request.data.get("notes", "")

        updated = admission_service.reject_application(
            application=application,
            admin_user=request.user,
            notes=notes,
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(updated).data)

    @action(detail=True, methods=["post"])
    def confirm_payment(self, request, pk=None):
        from services import admission_service

        application = self.get_object()
        notes = request.data.get("notes", "")

        updated = admission_service.confirm_payment(
            application=application,
            admin_user=request.user,
            notes=notes,
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(updated).data)

    @action(detail=True, methods=["post"])
    def offer_admission(self, request, pk=None):
        from services import admission_service

        application = self.get_object()
        notes = request.data.get("notes", "")

        updated = admission_service.offer_admission(
            application=application,
            admin_user=request.user,
            notes=notes,
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(updated).data)

    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        import secrets
        import string
        from services import admission_service

        application = self.get_object()

        def gen_pwd(prefix="Riverside"):
            chars = string.ascii_letters + string.digits
            rand = "".join(secrets.choice(chars) for _ in range(5))
            return f"{prefix}2026!{rand}"

        import re

        names = (application.guardian_full_name or "").strip().split()
        guardian_first = names[0].lower() if names else "parent"
        guardian_last = "".join(names[1:]).lower() if len(names) > 1 else ""
        guardian_clean = re.sub(r"[^a-z0-9]", "", f"{guardian_first}{guardian_last}") or "parent"

        student_clean = re.sub(
            r"[^a-z0-9]",
            "",
            f"{(application.student_first_name or '').lower()}{(application.student_last_name or '').lower()}",
        ) or application.reference.lower().replace("-", "")

        default_student_email = f"{student_clean}@student.riversideacademy.com"
        default_parent_email = f"{guardian_clean}@parent.riversideacademy.com"

        student_email = request.data.get("student_email") or default_student_email
        student_password = request.data.get("student_password") or gen_pwd("Student")

        parent_email = request.data.get("parent_email") or default_parent_email
        parent_password = request.data.get("parent_password") or gen_pwd("Parent")
        notes = request.data.get("notes", "")

        result = admission_service.enroll_and_provision(
            application=application,
            admin_user=request.user,
            student_email=student_email,
            student_password=student_password,
            parent_email=parent_email,
            parent_password=parent_password,
            notes=notes,
            request=request,
        )
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def provision(self, request, pk=None):
        return self.enroll(request, pk)

    permission_classes = [IsAdmin]
    queryset = AdmissionApplication.objects.exclude(
        status=ApplicationStatus.STARTED
    ).prefetch_related("documents")
    filterset_fields = ["status", "academic_session", "class_applying_for"]
    search_fields = [
        "reference",
        "student_first_name",
        "student_last_name",
        "guardian_email",
    ]

    def get_serializer_class(self):
        return (
            AdmissionApplicationDetailSerializer
            if self.action == "retrieve"
            else AdmissionApplicationAdminListSerializer
        )

    @action(detail=True, methods=["post"])
    def decide(self, request, pk=None):
        application = self.get_object()
        serializer = AdmissionApplicationDecisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = application.status
        application.status = serializer.validated_data["status"]
        application.decision_notes = serializer.validated_data.get(
            "decision_notes", application.decision_notes
        )
        application.reviewed_by = request.user
        application.save(
            update_fields=["status", "decision_notes", "reviewed_by", "updated_at"]
        )

        audit.record(
            actor=request.user,
            action="admission_application.status_change",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": application.status},
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(application).data)

    @action(detail=True, methods=["post"])
    def move_to_payment(self, request, pk=None):
        from services import admission_service

        application = self.get_object()
        amount = float(request.data.get("amount", 150000.0))
        due_date = request.data.get("due_date", None)
        notes = request.data.get("notes", "")

        updated = admission_service.move_to_payment(
            application=application,
            admin_user=request.user,
            amount=amount,
            due_date=due_date,
            notes=notes,
            request=request,
        )
        return Response(AdmissionApplicationDetailSerializer(updated).data)


class ParentRelationshipRequestViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    /api/admissions/parent-relationships/ -- Section 2.6 / 23: a parent
    registers publicly identifying the student they claim to be guardian
    of. This is create/list/retrieve only for the applicant -- no edit,
    since changing the claimed student after submission should go through
    a fresh request rather than mutating one an admin may already be
    reviewing.
    """

    queryset = ParentRelationshipRequest.objects.all()
    permission_classes = [IsApplicant, IsApplicationOwner]
    serializer_class = ParentRelationshipRequestCreateSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return ParentRelationshipRequest.objects.none()
        return ParentRelationshipRequest.objects.filter(applicant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)


class ParentRelationshipRequestAdminViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """/api/admissions/admin/parent-relationships/ -- staff verification queue."""

    permission_classes = [IsAdmin]
    queryset = ParentRelationshipRequest.objects.all()
    serializer_class = ParentRelationshipRequestAdminSerializer
    filterset_fields = ["status"]
    search_fields = [
        "reference",
        "child_full_name",
        "student_admission_number",
        "email",
    ]

    @action(detail=True, methods=["post"])
    def decide(self, request, pk=None):
        """
        Marking a request VERIFIED here does NOT by itself provision a
        Parent account or link the student -- that's Stage 3's
        admin-provisioning step, which should treat a verified request as
        its input. Keeping verification and provisioning as two distinct,
        separately-audited actions means a verified relationship can be
        reviewed before an account is actually created.
        """
        relationship_request = self.get_object()
        serializer = ParentRelationshipRequestDecisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = relationship_request.status
        relationship_request.status = serializer.validated_data["status"]
        relationship_request.decision_notes = serializer.validated_data.get(
            "decision_notes", relationship_request.decision_notes
        )
        relationship_request.reviewed_by = request.user
        relationship_request.save(
            update_fields=["status", "decision_notes", "reviewed_by", "updated_at"]
        )

        audit.record(
            actor=request.user,
            action="parent_relationship_request.status_change",
            instance=relationship_request,
            old_value={"status": old_status},
            new_value={"status": relationship_request.status},
            request=request,
        )
        return Response(
            ParentRelationshipRequestAdminSerializer(relationship_request).data
        )
