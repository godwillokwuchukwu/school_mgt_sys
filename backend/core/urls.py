from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    DocumentViewSet,
    AdminDashboardStatsView,
    AdminCandidateStatusView,
    AdminVacancyCreateView,
    AdminParentCreateView,
    AdminStaffCreateView,
    AdminClassCreateView,
    AdminSettingsView,
    AdminBackupView,
    AdminLogActivityView,
)

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="document")

urlpatterns = [
    path("admin/dashboard/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("admin/log-activity/", AdminLogActivityView.as_view(), name="admin-log-activity"),
    path("admin/settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path("admin/settings/backup/", AdminBackupView.as_view(), name="admin-settings-backup"),
    path("admin/candidates/<int:pk>/status/", AdminCandidateStatusView.as_view(), name="admin-candidate-status"),
    path("admin/vacancies/create/", AdminVacancyCreateView.as_view(), name="admin-vacancy-create"),
    path("admin/parents/create/", AdminParentCreateView.as_view(), name="admin-parent-create"),
    path("admin/staff/create/", AdminStaffCreateView.as_view(), name="admin-staff-create"),
    path("admin/classes/create/", AdminClassCreateView.as_view(), name="admin-class-create"),
    path("", include(router.urls)),
]

