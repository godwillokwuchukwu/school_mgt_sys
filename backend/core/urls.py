from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, AdminDashboardStatsView

router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="document")

urlpatterns = [
    path("admin/dashboard/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("", include(router.urls)),
]
