from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class FeeStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PAID = "paid", "Paid"
    OVERDUE = "overdue", "Overdue"


class Fee(models.Model):
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="fees"
    )
    title = models.CharField(max_length=200)
    # Business rule: a fee owed can't be negative, enforced at DB level and
    # in the serializer (mirrors Grade.score's pattern in academics/models.py).
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    due_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=FeeStatus.choices, default=FeeStatus.PENDING
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="fees_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["status", "due_date", "title"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(amount__gte=0), name="fee_amount_non_negative"
            ),
        ]

    def __str__(self):
        return f"{self.title} for {self.student}"


class FeeSchedule(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    academic_year = models.CharField(max_length=9)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-due_date"]

    def __str__(self):
        return f"{self.title} ({self.academic_year})"


class Payment(models.Model):
    fee = models.ForeignKey(Fee, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    transaction_ref = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default="success")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment of {self.amount} for {self.fee} (Ref: {self.transaction_ref})"


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    monthly_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ExpenseStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    SUBMITTED = "submitted", "Submitted"
    PENDING_APPROVAL = "pending_approval", "Pending Approval"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"
    PAID = "paid", "Paid"
    CANCELLED = "cancelled", "Cancelled"


class Expense(models.Model):
    expense_id = models.CharField(max_length=30, unique=True, blank=True)
    title = models.CharField(max_length=250)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name="expenses")
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=10, default="NGN")
    date_incurred = models.DateField(default=timezone.now)
    academic_year = models.CharField(max_length=20, default="2025/2026")
    term = models.CharField(max_length=30, default="1st Term")
    department = models.CharField(max_length=100, default="Administrative")
    vendor = models.CharField(max_length=200, blank=True)
    payment_method = models.CharField(max_length=50, default="Bank Transfer")
    supporting_receipt = models.CharField(max_length=500, blank=True, help_text="Receipt URL or filename")
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="expenses_submitted")
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="expenses_approved")
    status = models.CharField(max_length=25, choices=ExpenseStatus.choices, default=ExpenseStatus.PENDING_APPROVAL)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_incurred", "-id"]

    def save(self, *args, **kwargs):
        if not self.expense_id:
            super().save(*args, **kwargs)
            self.expense_id = f"EXP-2026-{str(self.id).zfill(4)}"
            super().save(update_fields=["expense_id"])
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.expense_id} - {self.title} (₦{self.amount:,.2f})"


class SalaryProfile(models.Model):
    class EmployeeType(models.TextChoices):
        TEACHER = "teacher", "Teacher"
        STAFF = "staff", "Staff"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="salary_profile")
    employee_type = models.CharField(max_length=20, choices=EmployeeType.choices, default=EmployeeType.TEACHER)
    department = models.CharField(max_length=100, default="Academics")
    position = models.CharField(max_length=150, default="Teacher")
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    housing_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    transport_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    meal_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    other_allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    tax_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    pension_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    other_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    bank_name = models.CharField(max_length=100, default="First Bank of Nigeria")
    account_number = models.CharField(max_length=30, default="0123456789")
    account_name = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def gross_salary(self):
        return self.basic_salary + self.housing_allowance + self.transport_allowance + self.meal_allowance + self.other_allowances

    @property
    def total_deductions(self):
        return self.tax_deduction + self.pension_deduction + self.other_deductions

    @property
    def net_salary(self):
        return self.gross_salary - self.total_deductions

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.position}) - Net: ₦{self.net_salary:,.2f}"


class PayrollPeriod(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        CALCULATED = "calculated", "Calculated"
        PENDING_APPROVAL = "pending_approval", "Pending Approval"
        APPROVED = "approved", "Approved"
        PAID = "paid", "Paid"
        CANCELLED = "cancelled", "Cancelled"

    name = models.CharField(max_length=100, help_text="e.g. September 2026")
    code = models.CharField(max_length=20, unique=True, help_text="e.g. 2026-09")
    academic_year = models.CharField(max_length=20, default="2025/2026")
    term = models.CharField(max_length=30, default="1st Term")
    pay_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.DRAFT)
    total_gross = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="payroll_approvals")
    approved_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-code"]

    def __str__(self):
        return f"Payroll {self.name} [{self.status}] - Total: ₦{self.total_net:,.2f}"


class SalaryPayment(models.Model):
    payroll_period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name="payments")
    salary_profile = models.ForeignKey(SalaryProfile, on_delete=models.PROTECT, related_name="payments")
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="salary_payments")
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, default="Bank Transfer")
    transaction_ref = models.CharField(max_length=100, unique=True, blank=True)
    status = models.CharField(max_length=20, default="paid")
    expense_record = models.OneToOneField(Expense, on_delete=models.SET_NULL, null=True, blank=True, related_name="salary_payment")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.transaction_ref:
            import uuid
            self.transaction_ref = f"PAY-2026-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.payroll_period.name} - ₦{self.net_salary:,.2f}"
