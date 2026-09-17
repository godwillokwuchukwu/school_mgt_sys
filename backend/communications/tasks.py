from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_email_notification(subject, message, recipient_list):
    """
    Background job to send email notifications (e.g. account invitation, payment receipt).
    """
    # Just print the outcome to console during local dev
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
        )
    except Exception:
        pass
    return True
