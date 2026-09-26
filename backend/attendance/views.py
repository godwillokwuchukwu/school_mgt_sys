from django.db import transaction
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdminOrTeacher

from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.select_related(
        "student__profile__user", "marked_by"
    ).all()
    serializer_class = AttendanceRecordSerializer
    filterset_fields = ["student", "date", "status"]
    search_fields = ["notes"]

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsAdminOrTeacher()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        profile = getattr(self.request.user, "profile", None)
        role = getattr(profile, "role", None)
        if role == "student":
            return queryset.filter(student__profile=self.request.user.profile)
        if role == "parent":
            return queryset.filter(student__parents=profile)
        if role in ("admin", "teacher"):
            return queryset
        return queryset.none()

    @action(detail=False, methods=["post"], permission_classes=[IsAdminOrTeacher])
    def bulk_mark(self, request):
        records = request.data.get("records", [])
        if not isinstance(records, list) or not records:
            return Response(
                {"records": "Provide a non-empty list of attendance records."},
                status=400,
            )
        marked = []
        with transaction.atomic():
            for record in records:
                if "status" in record:
                    record["status"] = str(record["status"]).lower()
                serializer = self.get_serializer(data=record)
                serializer.is_valid(raise_exception=True)
                values = serializer.validated_data
                instance, _ = AttendanceRecord.objects.update_or_create(
                    student=values["student"],
                    date=values["date"],
                    defaults={
                        "status": values["status"],
                        "notes": values.get("notes", ""),
                        "marked_by": request.user,
                    },
                )
                marked.append(instance)
        return Response(self.get_serializer(marked, many=True).data)


from rest_framework.permissions import AllowAny
from .models import StaffAttendanceRecord
from .serializers import StaffAttendanceRecordSerializer


class StaffAttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendanceRecord.objects.select_related("user", "marked_by").all()
    serializer_class = StaffAttendanceRecordSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["employee_type", "department", "date", "status"]
    search_fields = ["user__first_name", "user__last_name", "notes"]

    @action(detail=False, methods=["post"])
    def bulk_mark(self, request):
        records = request.data.get("records", [])
        if not isinstance(records, list) or not records:
            return Response({"records": "Provide a non-empty list of staff attendance records."}, status=400)
        marked = []
        with transaction.atomic():
            for record in records:
                user_id = record.get("user")
                date_val = record.get("date")
                status_val = str(record.get("status", "present")).lower()
                inst, _ = StaffAttendanceRecord.objects.update_or_create(
                    user_id=user_id,
                    date=date_val,
                    defaults={
                        "employee_type": record.get("employee_type", "teacher"),
                        "department": record.get("department", "Academics"),
                        "check_in_time": record.get("check_in_time", "07:45 AM"),
                        "check_out_time": record.get("check_out_time", "03:00 PM"),
                        "hours_worked": record.get("hours_worked", 7.5),
                        "status": status_val,
                        "late_minutes": record.get("late_minutes", 0),
                        "leave_status": record.get("leave_status", ""),
                        "notes": record.get("notes", ""),
                        "marked_by": request.user if request.user.is_authenticated else None,
                    }
                )
                marked.append(inst)
        return Response(self.get_serializer(marked, many=True).data)

