from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminOrTeacher
from services import analytics_service

from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.select_related(
        "student__profile__user", "school_class", "generated_by"
    ).all()
    serializer_class = ReportSerializer
    filterset_fields = ["report_type", "student", "school_class"]
    search_fields = ["title"]

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsAdminOrTeacher()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter reports based on user role."""
        user = self.request.user
        if not user or not user.is_authenticated:
            return Report.objects.none()

        profile = getattr(user, "profile", None)
        if not profile:
            return Report.objects.none()

        # Admins/teachers see all reports
        if profile.role in ["admin", "teacher"]:
            return Report.objects.all()

        # Students see only their own reports
        if profile.role == "student":
            student = getattr(profile, "student", None)
            if student:
                return Report.objects.filter(student=student)
            return Report.objects.none()

        if profile.role == "parent":
            return Report.objects.filter(student__in=profile.children.all())

        return Report.objects.none()


class AnalyticsOverviewView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_executive_overview()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsDescriptiveView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_descriptive_analytics()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsDiagnosticView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_diagnostic_analytics()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsPredictiveView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_predictive_analytics()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsPrescriptiveView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_prescriptive_analytics()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsModelsView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        data = analytics_service.get_ml_and_deep_learning_models()
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsSimulatorView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def post(self, request):
        try:
            att = float(request.data.get("attendance_pct", 85.0))
            ca = float(request.data.get("ca_score", 70.0))
            hw = float(request.data.get("assignment_pct", 80.0))
            hours = float(request.data.get("study_hours", 10.0))
            result = analytics_service.simulate_student_outcome(att, ca, hw, hours)
            return Response(result, status=status.HTTP_200_OK)
        except (TypeError, ValueError) as e:
            return Response({"detail": f"Invalid numerical inputs: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class AnalyticsExportView(APIView):
    permission_classes = [IsAdminOrTeacher]

    def get(self, request):
        dataset_type = request.query_params.get("type", "students").lower()
        if dataset_type not in ["students", "grades", "attendance", "fees"]:
            return Response({"detail": "Invalid dataset type. Must be students, grades, attendance, or fees."}, status=status.HTTP_400_BAD_REQUEST)

        csv_content = analytics_service.export_dataset_csv(dataset_type)
        response = HttpResponse(csv_content, content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="riverside_{dataset_type}_dataset.csv"'
        return response
