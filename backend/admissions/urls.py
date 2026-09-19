from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdmissionApplicationAdminViewSet,
    AdmissionApplicationPublicStatusView,
    AdmissionApplicationReceiptUploadView,
    AdmissionApplicationViewSet,
    ApplicationDocumentListCreateView,
    ParentRelationshipRequestAdminViewSet,
    ParentRelationshipRequestViewSet,
)

router = DefaultRouter()
router.register(
    "applications", AdmissionApplicationViewSet, basename="admission-application"
)
router.register(
    "admin/applications",
    AdmissionApplicationAdminViewSet,
    basename="admission-application-admin",
)
router.register(
    "parent-relationships",
    ParentRelationshipRequestViewSet,
    basename="parent-relationship",
)
router.register(
    "admin/parent-relationships",
    ParentRelationshipRequestAdminViewSet,
    basename="parent-relationship-admin",
)

urlpatterns = [
    path(
        "applications/<int:application_id>/documents/",
        ApplicationDocumentListCreateView.as_view(),
        name="admission-application-documents",
    ),
    path(
        "status/<str:reference>/",
        AdmissionApplicationPublicStatusView.as_view(),
        name="admission-application-status",
    ),
    path(
        "status/<str:reference>/upload-receipt/",
        AdmissionApplicationReceiptUploadView.as_view(),
        name="admission-application-receipt-upload",
    ),
] + router.urls

