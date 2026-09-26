from django.utils import timezone
from rest_framework import serializers

from .models import Fee, FeeStatus


class FeeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.profile.user.get_full_name", read_only=True
    )

    class Meta:
        model = Fee
        fields = [
            "id",
            "student",
            "student_name",
            "title",
            "amount",
            "due_date",
            "status",
            "paid_at",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at", "paid_at"]

    def update(self, instance, validated_data):
        if (
            validated_data.get("status") == FeeStatus.PAID
            and instance.status != FeeStatus.PAID
        ):
            validated_data["paid_at"] = timezone.now()
        return super().update(instance, validated_data)


from .models import (
    ExpenseCategory,
    Expense,
    SalaryProfile,
    PayrollPeriod,
    SalaryPayment,
)


class ExpenseCategorySerializer(serializers.ModelSerializer):
    expenses_count = serializers.IntegerField(source="expenses.count", read_only=True)

    class Meta:
        model = ExpenseCategory
        fields = [
            "id",
            "name",
            "code",
            "description",
            "monthly_budget",
            "expenses_count",
            "created_at",
        ]


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    submitted_by_name = serializers.CharField(source="submitted_by.get_full_name", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id",
            "expense_id",
            "title",
            "category",
            "category_name",
            "description",
            "amount",
            "currency",
            "date_incurred",
            "academic_year",
            "term",
            "department",
            "vendor",
            "payment_method",
            "supporting_receipt",
            "submitted_by",
            "submitted_by_name",
            "approved_by",
            "approved_by_name",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["expense_id", "created_at", "updated_at"]


class SalaryProfileSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="user.get_full_name", read_only=True)
    employee_email = serializers.EmailField(source="user.email", read_only=True)
    gross_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_deductions = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = SalaryProfile
        fields = [
            "id",
            "user",
            "employee_name",
            "employee_email",
            "employee_type",
            "department",
            "position",
            "basic_salary",
            "housing_allowance",
            "transport_allowance",
            "meal_allowance",
            "other_allowances",
            "tax_deduction",
            "pension_deduction",
            "other_deductions",
            "gross_salary",
            "total_deductions",
            "net_salary",
            "bank_name",
            "account_number",
            "account_name",
            "is_active",
            "created_at",
            "updated_at",
        ]


class SalaryPaymentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.get_full_name", read_only=True)
    position = serializers.CharField(source="salary_profile.position", read_only=True)
    department = serializers.CharField(source="salary_profile.department", read_only=True)
    bank_name = serializers.CharField(source="salary_profile.bank_name", read_only=True)
    account_number = serializers.CharField(source="salary_profile.account_number", read_only=True)

    class Meta:
        model = SalaryPayment
        fields = [
            "id",
            "payroll_period",
            "salary_profile",
            "employee",
            "employee_name",
            "position",
            "department",
            "basic_salary",
            "allowances",
            "deductions",
            "net_salary",
            "payment_date",
            "payment_method",
            "transaction_ref",
            "status",
            "bank_name",
            "account_number",
            "created_at",
        ]


class PayrollPeriodSerializer(serializers.ModelSerializer):
    payments_count = serializers.IntegerField(source="payments.count", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)

    class Meta:
        model = PayrollPeriod
        fields = [
            "id",
            "name",
            "code",
            "academic_year",
            "term",
            "pay_date",
            "status",
            "total_gross",
            "total_deductions",
            "total_net",
            "payments_count",
            "approved_by",
            "approved_by_name",
            "approved_at",
            "notes",
            "created_at",
            "updated_at",
        ]
