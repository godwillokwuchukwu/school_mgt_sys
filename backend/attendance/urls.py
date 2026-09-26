from rest_framework.routers import DefaultRouter

from .views import AttendanceRecordViewSet, StaffAttendanceRecordViewSet

router = DefaultRouter()
router.register("records", AttendanceRecordViewSet, basename="attendance-record")
router.register("staff-records", StaffAttendanceRecordViewSet, basename="staff-attendance-record")

urlpatterns = router.urls
