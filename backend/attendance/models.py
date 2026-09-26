from django.conf import settings
from django.db import models

from students.models import Student


class AttendanceStatus(models.TextChoices):
    PRESENT = "present", "Present"
    ABSENT = "absent", "Absent"
    LATE = "late", "Late"
    EXCUSED = "excused", "Excused"


class AttendanceRecord(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="attendance_records"
    )
    date = models.DateField()
    status = models.CharField(max_length=20, choices=AttendanceStatus.choices)
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attendance_marked",
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "student__id"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "date"], name="uniq_attendance_student_day"
            )
        ]

    def __str__(self):
        return f"{self.student} — {self.date}: {self.status}"


class StaffAttendanceRecord(models.Model):
    class EmployeeType(models.TextChoices):
        TEACHER = "teacher", "Teacher"
        STAFF = "staff", "Staff"

    class Status(models.TextChoices):
        PRESENT = "present", "Present"
        ABSENT = "absent", "Absent"
        LATE = "late", "Late"
        ON_LEAVE = "on_leave", "On Leave"
        HALF_DAY = "half_day", "Half Day"
        REMOTE = "remote", "Remote"
        EXCUSED = "excused", "Excused"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="staff_attendance_records")
    employee_type = models.CharField(max_length=20, choices=EmployeeType.choices, default=EmployeeType.TEACHER)
    department = models.CharField(max_length=100, default="Academics")
    date = models.DateField()
    check_in_time = models.CharField(max_length=20, default="07:45 AM")
    check_out_time = models.CharField(max_length=20, default="03:00 PM")
    hours_worked = models.DecimalField(max_digits=4, decimal_places=2, default=7.5)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PRESENT)
    late_minutes = models.IntegerField(default=0)
    leave_status = models.CharField(max_length=50, blank=True)
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="staff_attendance_marked")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "user__id"]
        constraints = [
            models.UniqueConstraint(fields=["user", "date"], name="uniq_staff_attendance_user_day")
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_type}) — {self.date}: {self.status}"
