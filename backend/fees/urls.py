from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FeeViewSet,
    PaymentWebhookView,
    ExpenseCategoryViewSet,
    ExpenseViewSet,
    SalaryProfileViewSet,
    PayrollPeriodViewSet,
    SalaryPaymentViewSet,
)

router = DefaultRouter()
router.register(r"fees", FeeViewSet, basename="fee")
router.register(r"expense-categories", ExpenseCategoryViewSet, basename="expense-category")
router.register(r"expenses", ExpenseViewSet, basename="expense")
router.register(r"payroll-profiles", SalaryProfileViewSet, basename="payroll-profile")
router.register(r"salary-profiles", SalaryProfileViewSet, basename="salary-profile")
router.register(r"payroll-periods", PayrollPeriodViewSet, basename="payroll-period")
router.register(r"salary-payments", SalaryPaymentViewSet, basename="salary-payment")

urlpatterns = [
    path("webhook/", PaymentWebhookView.as_view(), name="payment-webhook"),
    path("", include(router.urls)),
]
