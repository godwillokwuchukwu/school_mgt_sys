from rest_framework import serializers

from .models import AttendanceRecord


class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = [
            "id",
            "student",
            "date",
            "status",
            "notes",
            "marked_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["marked_by", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["marked_by"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context["request"]
        validated_data["marked_by"] = request.user
        return super().update(instance, validated_data)


from .models import StaffAttendanceRecord


class StaffAttendanceRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="user.get_full_name", read_only=True)
    employee_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = StaffAttendanceRecord
        fields = [
            "id",
            "user",
            "employee_name",
            "employee_email",
            "employee_type",
            "department",
            "date",
            "check_in_time",
            "check_out_time",
            "hours_worked",
            "status",
            "late_minutes",
            "leave_status",
            "marked_by",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["marked_by", "created_at", "updated_at"]
