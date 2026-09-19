import logging
from datetime import datetime
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

import threading

logger = logging.getLogger(__name__)


def _send_async(msg, recipient=""):
    """
    Sends email in a background daemon thread so HTTP requests never block.
    """
    def _worker():
        try:
            msg.send()
            logger.info(f"Email dispatched to {recipient}")
        except Exception as exc:
            logger.error(f"Failed to dispatch email to {recipient}: {exc}")

    thread = threading.Thread(target=_worker, daemon=True)
    thread.start()


def _get_base_url(request=None) -> str:
    if request is not None:
        return request.build_absolute_uri("/").rstrip("/")
    return getattr(settings, "BACKEND_BASE_URL", "http://localhost:8000")


def send_verification_email(user, token: str, request=None) -> bool:
    """
    Sends 24-hour cryptographic email verification link.
    Non-blocking background dispatch.
    """
    try:
        base_url = _get_base_url(request)
        verification_url = f"{base_url}/accounts/verify-email/{token}/"
        student_name = user.get_full_name() or user.username

        context = {
            "student_name": student_name,
            "verification_url": verification_url,
            "base_url": base_url,
        }
        html_content = render_to_string("emails/verify_email.html", context)
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            subject="Confirm your Riverside Academy email address",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        _send_async(msg, user.email)
        return True
    except Exception as exc:
        logger.error(f"Failed to prepare verification email for {user.email}: {exc}")
        return False


def send_login_notification(user, request=None) -> bool:
    """
    Sends non-blocking login notification security email.
    """
    try:
        ip_address = "Unknown"
        device = "Unknown browser/device"
        if request is not None:
            forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
            ip_address = (
                forwarded.split(",")[0].strip()
                if forwarded
                else request.META.get("REMOTE_ADDR", "Unknown")
            )
            device = request.META.get("HTTP_USER_AGENT", "Unknown browser/device")

        login_time = datetime.now().strftime("%d %B %Y, %I:%M %p")
        user_name = user.get_full_name() or user.username

        context = {
            "user_name": user_name,
            "login_time": login_time,
            "ip_address": ip_address,
            "device": device,
        }
        html_content = render_to_string("emails/login_notification.html", context)
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            subject="New login to your Riverside Academy account",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        _send_async(msg, user.email)
        return True
    except Exception as exc:
        logger.error(f"Failed to prepare login notification for {user.email}: {exc}")
        return False


def send_payment_notification(application, amount, due_date=None, request=None) -> bool:
    """
    Dispatches payment request notification for approved applicant.
    """
    try:
        base_url = _get_base_url(request)
        payment_url = f"{base_url}/admissions/apply"
        portal_url = f"{base_url}/portal"
        student_name = (
            f"{application.student_first_name} {application.student_last_name}"
        )

        context = {
            "student_name": student_name,
            "guardian_name": application.guardian_full_name,
            "reference": application.reference,
            "class_applying_for": application.class_applying_for,
            "academic_session": application.academic_session,
            "amount": amount,
            "due_date": due_date,
            "payment_url": payment_url,
            "portal_url": portal_url,
        }
        html_content = render_to_string("emails/payment_notification.html", context)
        text_content = strip_tags(html_content)

        to_emails = [application.guardian_email]
        if (
            application.student_email
            and application.student_email != application.guardian_email
        ):
            to_emails.append(application.student_email)

        msg = EmailMultiAlternatives(
            subject="Your Riverside Academy admission – payment required",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        msg.attach_alternative(html_content, "text/html")
        _send_async(msg, ", ".join(to_emails))
        return True
    except Exception as exc:
        logger.error(
            f"Failed to prepare payment notification for {application.reference}: {exc}"
        )
        return False


def send_admission_approved_notification(application, request=None) -> bool:
    """
    Dispatches admission approval notice.
    """
    try:
        base_url = _get_base_url(request)
        portal_url = f"{base_url}/admissions/status"
        student_name = (
            f"{application.student_first_name} {application.student_last_name}"
        )

        context = {
            "student_name": student_name,
            "reference": application.reference,
            "portal_url": portal_url,
        }
        html_content = render_to_string("emails/admission_approved.html", context)
        text_content = strip_tags(html_content)

        to_emails = [application.guardian_email]
        if application.student_email:
            to_emails.append(application.student_email)

        msg = EmailMultiAlternatives(
            subject="Your Riverside Academy admission application has been approved",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        msg.attach_alternative(html_content, "text/html")
        _send_async(msg, ", ".join(to_emails))
        return True
    except Exception as exc:
        logger.error(
            f"Failed to prepare approval email for {application.reference}: {exc}"
        )
        return False


def send_payment_confirmed_notification(application, request=None) -> bool:
    """
    Dispatches payment confirmed notice to applicant and guardian.
    """
    try:
        base_url = _get_base_url(request)
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        status_url = f"{frontend_url}/admissions/status"
        student_name = f"{application.student_first_name} {application.student_last_name}"

        subject = f"Payment Confirmed - Riverside Academy Admission ({application.reference})"
        body = (
            f"Dear {application.guardian_full_name} and {student_name},\n\n"
            f"We are pleased to inform you that your admission fee payment for application {application.reference} "
            f"has been confirmed and verified by the administration.\n\n"
            f"Your admission offer letter is now being processed. You can check your progress anytime here:\n"
            f"{status_url}\n\n"
            f"Warm regards,\n"
            f"Riverside Academy Admissions Office"
        )

        to_emails = [application.guardian_email]
        if application.student_email and application.student_email != application.guardian_email:
            to_emails.append(application.student_email)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        _send_async(msg, ", ".join(to_emails))
        return True
    except Exception as exc:
        logger.error(f"Failed to prepare payment confirmed email for {application.reference}: {exc}")
        return False


def send_offer_letter_notification(application, request=None) -> bool:
    """
    Dispatches admission offer letter notification.
    """
    try:
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        status_url = f"{frontend_url}/admissions/status"
        student_name = f"{application.student_first_name} {application.student_last_name}"

        subject = f"Official Admission Offer Letter - Riverside Academy ({application.reference})"
        body = (
            f"Dear {application.guardian_full_name} and {student_name},\n\n"
            f"Congratulations! We are delighted to formally offer {student_name} provisional admission "
            f"to {application.class_applying_for} at Riverside Academy for the {application.academic_session} academic session.\n\n"
            f"You can view and print your Official Letter of Admission Offer on the admissions tracker:\n"
            f"{status_url}\n\n"
            f"Next step: The administration will finalize your enrollment and issue your student and parent portal login credentials.\n\n"
            f"Warm regards,\n"
            f"Admissions Committee, Riverside Academy"
        )

        to_emails = [application.guardian_email]
        if application.student_email and application.student_email != application.guardian_email:
            to_emails.append(application.student_email)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        _send_async(msg, ", ".join(to_emails))
        return True
    except Exception as exc:
        logger.error(f"Failed to prepare offer letter notification for {application.reference}: {exc}")
        return False


def send_credentials_email(email, password, role="student", name="", portal_url=None, request=None, recipient_email=None) -> bool:
    """
    Sends generated login credentials (email & password) to student, parent, or staff.
    """
    try:
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        login_url = portal_url or f"{frontend_url}/portal"
        greeting_name = name or email

        subject = f"Your Riverside Academy {role.capitalize()} Portal Login Credentials"
        body = (
            f"Dear {greeting_name},\n\n"
            f"An administrator has provisioned your {role} account for Riverside Academy School Management Portal.\n\n"
            f"Here are your login credentials:\n"
            f"-----------------------------------------\n"
            f"Portal URL: {login_url}\n"
            f"Username / School Email: {email}\n"
            f"Temporary Password: {password}\n"
            f"Role: {role.capitalize()}\n"
            f"-----------------------------------------\n\n"
            f"Please log in using your official school email ({email}) and change your password at your earliest convenience.\n\n"
            f"Warm regards,\n"
            f"Riverside Academy Administration"
        )

        to_emails = [email]
        if recipient_email and recipient_email.lower() != email.lower() and recipient_email not in to_emails:
            to_emails.append(recipient_email)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        _send_async(msg, ", ".join(to_emails))
        return True
    except Exception as exc:
        logger.error(f"Failed to send credentials email to {email}: {exc}")
        return False

