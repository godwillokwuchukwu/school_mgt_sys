import logging
from django.db import transaction
from django.utils import timezone
from accounts import audit
from accounts.models import AdminNotificationType
from admissions.models import AdmissionApplication, ApplicationStatus
from services import email_service, notification_service, sms

logger = logging.getLogger(__name__)


def approve_application(
    application: AdmissionApplication, admin_user, notes: str = "", request=None
):
    """
    Approves an admission application, logs the audit, and notifies the applicant.
    """
    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.APPROVED
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = notes
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        audit.record(
            actor=admin_user,
            action="admission.approve",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.APPROVED},
            description=f"Application {application.reference} approved by {admin_user.username}",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Application Approved",
            message=f"Congratulations! Your application {application.reference} has been approved.",
            notification_type="admission",
            link=f"/admissions/status",
        )

    email_service.send_admission_approved_notification(application, request=request)
    return application


def move_to_payment(
    application: AdmissionApplication,
    admin_user,
    amount: float = 150000.0,
    due_date=None,
    notes: str = "",
    request=None,
):
    """
    Moves an approved admission application to Payment Pending (Section 22).
    Dispatches payment email, optional SMS, creates internal notifications and audit trail.
    """
    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.PAYMENT_PENDING
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = (
                f"{application.decision_notes}\n[Payment Requested] {notes}".strip()
            )
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        audit.record(
            actor=admin_user,
            action="admission.move_to_payment",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.PAYMENT_PENDING, "amount": amount},
            description=f"Moved {application.reference} to payment pending (Amount: {amount})",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Admission Fee Payment Required",
            message=f"Your admission application ({application.reference}) is approved! Please proceed with payment of ₦{amount:,.2f}.",
            notification_type="payment",
            link="/admissions/apply",
        )

        notification_service.notify_admin(
            title=f"Payment Requested for {application.reference}",
            message=f"Admin {admin_user.username} moved application {application.reference} to payment pending (₦{amount:,.2f}).",
            notification_type=AdminNotificationType.INFO,
            object_instance=application,
            user=admin_user,
        )

    # Dispatches outside transaction so network calls don't hold the DB transaction lock
    email_service.send_payment_notification(
        application, amount=amount, due_date=due_date, request=request
    )

    phone = application.guardian_phone or application.student_phone
    if phone:
        sms_msg = (
            f"Hello {application.student_first_name}, your Riverside Academy admission ({application.reference}) "
            f"has reached the payment stage. Please check your email or portal for instructions."
        )
        sms.send_sms(phone, sms_msg)

    return application


def reject_application(
    application: AdmissionApplication, admin_user, notes: str = "", request=None
):
    """
    Rejects an admission application with decision notes.
    """
    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.REJECTED
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = notes
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        audit.record(
            actor=admin_user,
            action="admission.reject",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.REJECTED},
            description=f"Application {application.reference} rejected by {admin_user.username}",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Admission Decision",
            message=f"An update is available on your admission application {application.reference}.",
            notification_type="admission",
            link="/admissions/status",
        )

    return application


def confirm_payment(
    application: AdmissionApplication, admin_user, notes: str = "", request=None
):
    """
    Confirms admission payment received from applicant, moving status to PAYMENT_CONFIRMED.
    """
    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.PAYMENT_CONFIRMED
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = (
                f"{application.decision_notes}\n[Payment Confirmed] {notes}".strip()
            )
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        audit.record(
            actor=admin_user,
            action="admission.confirm_payment",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.PAYMENT_CONFIRMED},
            description=f"Payment for {application.reference} confirmed by {admin_user.username}",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Admission Fee Payment Confirmed",
            message=f"Your admission fee payment for {application.reference} has been confirmed. Your offer letter is being generated.",
            notification_type="payment",
            link="/admissions/status",
        )

    email_service.send_payment_confirmed_notification(application, request=request)
    return application


def offer_admission(
    application: AdmissionApplication, admin_user, notes: str = "", request=None
):
    """
    Issues official Admission Offer Letter, moving status to ADMISSION_OFFERED.
    """
    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.ADMISSION_OFFERED
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = (
                f"{application.decision_notes}\n[Admission Offered] {notes}".strip()
            )
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        audit.record(
            actor=admin_user,
            action="admission.offer_admission",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.ADMISSION_OFFERED},
            description=f"Admission offer letter issued for {application.reference} by {admin_user.username}",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Admission Offer Letter Issued",
            message=f"Congratulations! Your Official Admission Offer Letter for {application.reference} is now available.",
            notification_type="admission",
            link="/admissions/status",
        )

    email_service.send_offer_letter_notification(application, request=request)
    return application


def enroll_and_provision(
    application: AdmissionApplication,
    admin_user,
    student_email: str,
    student_password: str,
    parent_email: str,
    parent_password: str,
    notes: str = "",
    request=None,
):
    """
    Finalizes enrollment, marks application as ENROLLED, creates and activates
    User & Profile for Student and Parent with the specified/generated credentials,
    and dispatches credentials to both.
    """
    from django.contrib.auth import get_user_model
    from accounts.models import Profile
    from students.models import Student

    User = get_user_model()

    with transaction.atomic():
        old_status = application.status
        application.status = ApplicationStatus.ENROLLED
        application.reviewed_by = admin_user
        if notes:
            application.decision_notes = (
                f"{application.decision_notes}\n[Enrolled] {notes}".strip()
            )
        application.save(
            update_fields=["status", "reviewed_by", "decision_notes", "updated_at"]
        )

        # 1. Provision / Activate Student User
        student_user, _ = User.objects.get_or_create(
            username=student_email,
            defaults={
                "email": student_email,
                "first_name": application.student_first_name,
                "last_name": application.student_last_name,
                "is_active": True,
            },
        )
        student_user.first_name = application.student_first_name
        student_user.last_name = application.student_last_name
        student_user.email = student_email
        student_user.is_active = True
        student_user.set_password(student_password)
        student_user.save()

        student_profile = student_user.profile
        student_profile.role = "student"
        student_profile.save(update_fields=["role"])

        student, _ = Student.objects.get_or_create(
            profile=student_profile,
            defaults={
                "admission_number": application.reference,
                "dob": application.student_dob,
            },
        )
        student.admission_number = application.reference
        student.dob = application.student_dob
        student.save()

        # 2. Provision / Activate Parent User
        names = application.guardian_full_name.split()
        p_first = names[0] if names else "Parent"
        p_last = " ".join(names[1:]) if len(names) > 1 else ""

        parent_user, _ = User.objects.get_or_create(
            username=parent_email,
            defaults={
                "email": parent_email,
                "first_name": p_first,
                "last_name": p_last,
                "is_active": True,
            },
        )
        parent_user.first_name = p_first
        parent_user.last_name = p_last
        parent_user.email = parent_email
        parent_user.is_active = True
        parent_user.set_password(parent_password)
        parent_user.save()

        parent_profile = parent_user.profile
        parent_profile.role = "parent"
        parent_profile.save(update_fields=["role"])

        # Link Parent to Student
        student.parents.add(parent_profile)

        audit.record(
            actor=admin_user,
            action="admission.enrolled_and_provisioned",
            instance=application,
            old_value={"status": old_status},
            new_value={"status": ApplicationStatus.ENROLLED},
            description=f"Student {student_email} and Parent {parent_email} enrolled and provisioned by {admin_user.username}",
            request=request,
        )

        notification_service.notify_student(
            user=application.applicant,
            title="Officially Enrolled!",
            message=f"Congratulations! You are officially enrolled at Riverside Academy. Your portal credentials have been issued.",
            notification_type="admission",
            link="/portal",
        )

    # Dispatch credentials emails asynchronously
    email_service.send_credentials_email(
        email=student_email,
        password=student_password,
        role="student",
        name=f"{application.student_first_name} {application.student_last_name}",
        request=request,
        recipient_email=application.student_email,
    )

    email_service.send_credentials_email(
        email=parent_email,
        password=parent_password,
        role="parent",
        name=application.guardian_full_name,
        request=request,
        recipient_email=application.guardian_email,
    )

    return {
        "status": "success",
        "detail": f"Student and Parent enrolled and provisioned successfully.",
        "application_reference": application.reference,
        "student": {
            "name": f"{application.student_first_name} {application.student_last_name}",
            "email": student_email,
            "password": student_password,
            "admission_number": application.reference,
        },
        "parent": {
            "name": application.guardian_full_name,
            "email": parent_email,
            "password": parent_password,
        },
    }

