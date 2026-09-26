from django.db import models
from django.utils.text import slugify


class School(models.Model):
    """
    Tenant root. Stage 1 runs a single-school deployment, but every
    school-owned model going forward should carry a FK to this table (see
    GAP_ANALYSIS_AND_ROADMAP.md item #69 / Stage 13.5) so multi-tenancy is
    a matter of *enabling* isolation later, not retrofitting it.

    `is_default` marks the school used when a request/record doesn't
    otherwise specify one -- true multi-tenant routing (subdomain/tenant
    middleware) is explicitly out of scope until Stage 13.
    """

    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    domain = models.CharField(
        max_length=200, blank=True, help_text="Reserved for future subdomain routing."
    )
    is_default = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:100]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @classmethod
    def get_default(cls):
        school = cls.objects.filter(is_default=True).first()
        if school:
            return school
        return cls.objects.create(name="Riverside Academy", is_default=True)


class SystemSetting(models.Model):
    """
    Stores system-wide configuration for Riverside Academy:
    School Settings, Academic Settings, Users & Permissions, Notification Settings, Security Settings.
    """
    school_name = models.CharField(max_length=255, default="Riverside Academy")
    address = models.CharField(max_length=255, default="12, Riverside Road, Lagos")
    phone = models.CharField(max_length=50, default="+234 803 123 4567")
    email = models.EmailField(default="info@riversideacademy.ng")
    website = models.CharField(max_length=255, default="www.riversideacademy.ng")
    motto = models.CharField(max_length=255, default="Knowledge, Character, Excellence")
    academic_year = models.CharField(max_length=50, default="2025/2026")
    school_code = models.CharField(max_length=50, default="RA-LOS-0042")
    currency = models.CharField(max_length=50, default="NGN (₦)")
    logo_data = models.TextField(blank=True, default="")
    theme_palette = models.CharField(max_length=50, default="emerald_gold")

    # Academic Settings
    current_session = models.CharField(max_length=50, default="2025/2026")
    current_term = models.CharField(max_length=50, default="1st Term")
    term_start = models.CharField(max_length=50, default="2026-09-08")
    term_end = models.CharField(max_length=50, default="2026-12-18")
    midterm_start = models.CharField(max_length=50, default="2026-10-26")
    midterm_end = models.CharField(max_length=50, default="2026-10-30")
    min_attendance = models.IntegerField(default=85)
    pass_mark = models.IntegerField(default=50)
    ca1_weight = models.IntegerField(default=20)
    ca2_weight = models.IntegerField(default=20)
    test_weight = models.IntegerField(default=20)
    exam_weight = models.IntegerField(default=40)

    # Notification Settings
    email_alerts = models.BooleanField(default=True)
    sms_alerts = models.BooleanField(default=True)
    fee_reminders = models.BooleanField(default=True)
    absence_alerts = models.BooleanField(default=True)
    exam_published_notice = models.BooleanField(default=True)
    sms_sender_id = models.CharField(max_length=50, default="RIVERSIDE")
    daily_attendance_cutoff = models.CharField(max_length=50, default="10:00 AM")

    # Security Settings
    enforce_2fa = models.BooleanField(default=True)
    session_timeout = models.CharField(max_length=50, default="30")
    password_expiry_days = models.CharField(max_length=50, default="90")
    require_special_char = models.BooleanField(default=True)
    ip_whitelisting = models.BooleanField(default=False)
    max_failed_attempts = models.IntegerField(default=5)

    # Roles and Permissions JSON
    roles_config = models.JSONField(default=list, blank=True)
    backups_history = models.JSONField(default=list, blank=True)

    # Dynamic Website and Portal Layout & Content Configurations
    public_layout_config = models.JSONField(default=dict, blank=True)
    portal_layout_config = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.school_name} System Settings"

    @classmethod
    def get_settings(cls):
        obj = cls.objects.first()
        if not obj:
            default_roles = [
                {"id": 1, "role": "Super Administrator", "users": 2, "view": True, "edit": True, "delete": True, "export": True, "admin": True},
                {"id": 2, "role": "Principal / Headmaster", "users": 1, "view": True, "edit": True, "delete": False, "export": True, "admin": True},
                {"id": 3, "role": "Teacher / Instructor", "users": 48, "view": True, "edit": True, "delete": False, "export": True, "admin": False},
                {"id": 4, "role": "Bursar / Accountant", "users": 3, "view": True, "edit": True, "delete": False, "export": True, "admin": False},
                {"id": 5, "role": "Admissions Officer", "users": 2, "view": True, "edit": True, "delete": False, "export": True, "admin": False},
                {"id": 6, "role": "Parent / Guardian", "users": 540, "view": True, "edit": False, "delete": False, "export": False, "admin": False},
                {"id": 7, "role": "Student", "users": 842, "view": True, "edit": False, "delete": False, "export": False, "admin": False},
            ]
            default_backups = [
                {"id": 1, "name": "riverside_full_backup_2026_09_23.sql.gz", "size": "42.8 MB", "date": "23 Sep 2026 03:00 AM", "type": "Automated"},
                {"id": 2, "name": "riverside_full_backup_2026_09_22.sql.gz", "size": "42.6 MB", "date": "22 Sep 2026 03:00 AM", "type": "Automated"},
                {"id": 3, "name": "riverside_full_backup_2026_09_21.sql.gz", "size": "42.4 MB", "date": "21 Sep 2026 03:00 AM", "type": "Automated"},
            ]
            obj = cls.objects.create(roles_config=default_roles, backups_history=default_backups)
        return obj

    def to_dict(self):
        return {
            "school_form": {
                "schoolName": self.school_name,
                "address": self.address,
                "phone": self.phone,
                "email": self.email,
                "website": self.website,
                "motto": self.motto,
                "academicYear": self.academic_year,
                "schoolCode": self.school_code,
                "currency": self.currency,
                "logo": self.logo_data,
                "themePalette": self.theme_palette,
                "theme_palette": self.theme_palette,
            },
            "academic_form": {
                "currentSession": self.current_session,
                "currentTerm": self.current_term,
                "termStart": self.term_start,
                "termEnd": self.term_end,
                "midtermStart": self.midterm_start,
                "midtermEnd": self.midterm_end,
                "minAttendance": self.min_attendance,
                "passMark": self.pass_mark,
                "ca1Weight": self.ca1_weight,
                "ca2Weight": self.ca2_weight,
                "testWeight": self.test_weight,
                "examWeight": self.exam_weight,
            },
            "notif_form": {
                "emailAlerts": self.email_alerts,
                "smsAlerts": self.sms_alerts,
                "feeReminders": self.fee_reminders,
                "absenceAlerts": self.absence_alerts,
                "examPublishedNotice": self.exam_published_notice,
                "smsSenderId": self.sms_sender_id,
                "dailyAttendanceCutoff": self.daily_attendance_cutoff,
            },
            "security_form": {
                "enforce2FA": self.enforce_2fa,
                "sessionTimeout": self.session_timeout,
                "passwordExpiryDays": self.password_expiry_days,
                "requireSpecialChar": self.require_special_char,
                "ipWhitelisting": self.ip_whitelisting,
                "maxFailedAttempts": self.max_failed_attempts,
            },
            "roles": self.roles_config or [],
            "backups": self.backups_history or [],
            "school_name": self.school_name,
            "schoolName": self.school_name,
            "school_logo": self.logo_data,
            "logo": self.logo_data,
            "logo_data": self.logo_data,
            "motto": self.motto,
            "address": self.address,
            "phone": self.phone,
            "email": self.email,
            "website": self.website,
            "academic_year": self.academic_year,
            "academicYear": self.academic_year,
            "school_code": self.school_code,
            "schoolCode": self.school_code,
            "currency": self.currency,
            "current_session": self.current_session,
            "current_term": self.current_term,
            "theme_palette": self.theme_palette,
            "themePalette": self.theme_palette,
            "public_layout_config": self.public_layout_config or {},
            "portal_layout_config": self.portal_layout_config or {},
        }


import os
from django.conf import settings
from django.core.exceptions import ValidationError


def validate_file_size(value):
    limit = 10 * 1024 * 1024  # 10 MB
    if value.size > limit:
        raise ValidationError("File too large. Size should not exceed 10 MiB.")


def malware_scan_stub(file):
    # Stubbed malware scanner
    # A real implementation would send the file to an AV engine (e.g. ClamAV)
    return True


class DocumentCategory(models.TextChoices):
    ADMISSION = "admission", "Admission"
    STUDENT_RECORD = "student_record", "Student Record"
    TEACHER_RECORD = "teacher_record", "Teacher Record"
    POLICY = "policy", "Policy"
    REPORT_CARD = "report_card", "Report Card"
    INVOICE = "invoice", "Invoice"
    RECEIPT = "receipt", "Receipt"
    OTHER = "other", "Other"


class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(
        upload_to="documents/%Y/%m/", validators=[validate_file_size]
    )
    category = models.CharField(
        max_length=20, choices=DocumentCategory.choices, default=DocumentCategory.OTHER
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_documents",
        null=True,
        blank=True,
    )
    mime_type = models.CharField(max_length=100, blank=True)
    is_archived = models.BooleanField(default=False)
    version = models.PositiveIntegerField(default=1)

    # Permission scoping
    is_public = models.BooleanField(
        default=False, help_text="Can be accessed by anyone with a signed URL"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} (v{self.version})"

    def clean(self):
        super().clean()
        if self.file:
            # Extension validation
            valid_extensions = [
                ".pdf",
                ".doc",
                ".docx",
                ".png",
                ".jpg",
                ".jpeg",
                ".txt",
            ]
            ext = os.path.splitext(self.file.name)[1].lower()
            if ext not in valid_extensions:
                raise ValidationError(
                    f"Unsupported file extension. Allowed: {', '.join(valid_extensions)}"
                )

            # Malware scanning stub
            if not malware_scan_stub(self.file):
                raise ValidationError("File failed malware scan.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
