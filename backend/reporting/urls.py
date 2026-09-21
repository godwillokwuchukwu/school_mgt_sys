from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnalyticsDescriptiveView,
    AnalyticsDiagnosticView,
    AnalyticsExportView,
    AnalyticsModelsView,
    AnalyticsOverviewView,
    AnalyticsPredictiveView,
    AnalyticsPrescriptiveView,
    AnalyticsSimulatorView,
    ReportViewSet,
)

router = DefaultRouter()
router.register(r"reports", ReportViewSet, basename="report")

urlpatterns = [
    path("", include(router.urls)),
    path("analytics/overview/", AnalyticsOverviewView.as_view(), name="analytics-overview"),
    path("analytics/descriptive/", AnalyticsDescriptiveView.as_view(), name="analytics-descriptive"),
    path("analytics/diagnostic/", AnalyticsDiagnosticView.as_view(), name="analytics-diagnostic"),
    path("analytics/predictive/", AnalyticsPredictiveView.as_view(), name="analytics-predictive"),
    path("analytics/prescriptive/", AnalyticsPrescriptiveView.as_view(), name="analytics-prescriptive"),
    path("analytics/models/", AnalyticsModelsView.as_view(), name="analytics-models"),
    path("analytics/simulate/", AnalyticsSimulatorView.as_view(), name="analytics-simulate"),
    path("analytics/export/", AnalyticsExportView.as_view(), name="analytics-export"),
]
