import os
import django
from decimal import Decimal
from datetime import date
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Profile, Role
from fees.models import (
    ExpenseCategory, Expense, ExpenseStatus,
    SalaryProfile, PayrollPeriod, SalaryPayment
)
from attendance.models import StaffAttendanceRecord

User = get_user_model()

def seed_erp():
    print("Beginning seeding of Expenses, Payroll, and Staff Attendance...")

    admin_user = User.objects.filter(is_superuser=True).first() or User.objects.first()

    # 1. Expense Categories
    categories = [
        ("Utilities & Power", "UTIL", "Electricity, municipal water, and diesel generators", Decimal("1800000")),
        ("Classroom & Academic Materials", "ACAD", "Stationery, science lab consumables, and teaching aids", Decimal("1200000")),
        ("Building Maintenance & Estate", "MAINT", "Structural repairs, painting, and plumbing works", Decimal("2000000")),
        ("Transportation & Fleet", "TRANS", "School bus maintenance, fueling, and vehicle licensing", Decimal("1500000")),
        ("ICT & Digital Infrastructure", "TECH", "High-speed internet, cloud servers, and computer lab upgrades", Decimal("1400000")),
        ("Security & Campus Safety", "SEC", "CCTV maintenance, safety equipment, and access control", Decimal("800000")),
        ("Staff Welfare & Medical", "WELF", "First aid clinic supplies, staff refreshments, and health insurance", Decimal("900000")),
        ("Examination Materials & Print", "EXAM", "Term test papers, answer booklets, and examination printing", Decimal("750000")),
        ("Sports & Extracurricular", "SPORT", "Athletics gear, football pitch maintenance, and club materials", Decimal("600000")),
        ("Teacher & Staff Payroll", "PAYROLL", "Monthly salaries and faculty payroll disbursements", Decimal("15000000")),
    ]

    cat_objs = {}
    for name, code, desc, budget in categories:
        cat, _ = ExpenseCategory.objects.get_or_create(
            code=code,
            defaults={"name": name, "description": desc, "monthly_budget": budget}
        )
        cat_objs[code] = cat
    print(f"Verified {len(cat_objs)} expense categories.")

    # 2. Expenses Records
    sample_expenses = [
        ("Diesel Supply for Main Campus Generators", "UTIL", Decimal("850000"), "2026-09-18", "Administrative", "TotalEnergies Nigeria", "Bank Transfer", "Approved", "PAID"),
        ("Fiber Optic Internet Annual Subscription", "TECH", Decimal("450000"), "2026-09-15", "IT & Technical", "MainOne Broadband", "Bank Transfer", "Approved", "PAID"),
        ("Physics & Chemistry Laboratory Reagents", "ACAD", Decimal("320000"), "2026-09-19", "Academics", "SciTech Educational Ltd", "Bank Transfer", "Approved", "PAID"),
        ("School Bus #3 Brake & Engine Overhaul", "TRANS", Decimal("185000"), "2026-09-20", "Facilities", "Mandilas Motors Lagos", "Bank Transfer", "Approved", "PAID"),
        ("Campus Clinic First Aid Restock", "WELF", Decimal("95000"), "2026-09-21", "Medical", "HealthPlus Pharmacy", "Debit Card", "Approved", "PAID"),
        ("1st Term CA Assessment Booklets Printing", "EXAM", Decimal("240000"), "2026-09-22", "Academics", "Apex Press & Publishing", "Bank Transfer", "Pending Approval", "APPROVED"),
        ("Classroom Block B Air Conditioner Servicing", "MAINT", Decimal("165000"), "2026-09-22", "Facilities", "CoolBreeze Technical Services", "Bank Transfer", "Pending Approval", "PENDING_APPROVAL"),
        ("Inter-House Sports Trophies & Medals", "SPORT", Decimal("140000"), "2026-09-23", "Sports", "Victory Awards Lagos", "Bank Transfer", "Draft", "PENDING_APPROVAL"),
    ]

    for title, cat_code, amount, dt, dept, vendor, method, notes, st in sample_expenses:
        status_val = getattr(ExpenseStatus, st, ExpenseStatus.APPROVED)
        Expense.objects.get_or_create(
            title=title,
            category=cat_objs[cat_code],
            defaults={
                "description": f"{title} for Riverside Academy 2025/2026 academic session.",
                "amount": amount,
                "currency": "NGN",
                "date_incurred": dt,
                "academic_year": "2025/2026",
                "term": "1st Term",
                "department": dept,
                "vendor": vendor,
                "payment_method": method,
                "supporting_receipt": f"receipt_{cat_code.lower()}_2026.pdf",
                "submitted_by": admin_user,
                "approved_by": admin_user if st == "PAID" else None,
                "status": status_val,
                "notes": notes,
            }
        )
    print("Verified expense records.")

    # 3. Salary Profiles for Teachers & Staff
    teachers = list(Profile.objects.filter(role=Role.TEACHER).select_related('user'))
    staff = list(Profile.objects.filter(role=Role.ADMIN).exclude(user__username='admin@school.example.com').select_related('user'))

    teacher_salaries = [
        (Decimal("280000"), Decimal("70000"), Decimal("40000"), Decimal("25000"), Decimal("22000"), Decimal("20000")),
        (Decimal("250000"), Decimal("60000"), Decimal("35000"), Decimal("20000"), Decimal("18000"), Decimal("18000")),
        (Decimal("320000"), Decimal("80000"), Decimal("45000"), Decimal("30000"), Decimal("28000"), Decimal("25000")),
    ]

    for idx, t in enumerate(teachers):
        u = t.user
        basic, house, trans, meal, tax, pen = teacher_salaries[idx % len(teacher_salaries)]
        SalaryProfile.objects.get_or_create(
            user=u,
            defaults={
                "employee_type": SalaryProfile.EmployeeType.TEACHER,
                "department": "Academics",
                "position": t.teaching_position or "Senior Teacher",
                "basic_salary": basic,
                "housing_allowance": house,
                "transport_allowance": trans,
                "meal_allowance": meal,
                "other_allowances": Decimal("10000"),
                "tax_deduction": tax,
                "pension_deduction": pen,
                "other_deductions": Decimal("5000"),
                "bank_name": "Zenith Bank PLC" if idx % 2 == 0 else "GTBank PLC",
                "account_number": f"20{idx+1}08492{idx}",
                "account_name": u.get_full_name(),
                "is_active": True,
            }
        )

    staff_salaries = [
        (Decimal("350000"), Decimal("85000"), Decimal("50000"), Decimal("30000"), Decimal("32000"), Decimal("28000")),
        (Decimal("220000"), Decimal("50000"), Decimal("30000"), Decimal("20000"), Decimal("15000"), Decimal("15000")),
        (Decimal("180000"), Decimal("40000"), Decimal("25000"), Decimal("15000"), Decimal("12000"), Decimal("12000")),
    ]

    for idx, s in enumerate(staff):
        u = s.user
        basic, house, trans, meal, tax, pen = staff_salaries[idx % len(staff_salaries)]
        SalaryProfile.objects.get_or_create(
            user=u,
            defaults={
                "employee_type": SalaryProfile.EmployeeType.STAFF,
                "department": "Administration" if idx in [0, 6] else "Finance" if idx == 1 else "IT & Technical" if idx == 2 else "Medical" if idx == 3 else "Security",
                "position": s.teaching_position or "Administrative Officer",
                "basic_salary": basic,
                "housing_allowance": house,
                "transport_allowance": trans,
                "meal_allowance": meal,
                "other_allowances": Decimal("8000"),
                "tax_deduction": tax,
                "pension_deduction": pen,
                "other_deductions": Decimal("0"),
                "bank_name": "First Bank of Nigeria" if idx % 2 == 0 else "Access Bank PLC",
                "account_number": f"01{idx+2}74918{idx}",
                "account_name": u.get_full_name(),
                "is_active": True,
            }
        )
    print("Verified Salary Profiles for Teachers and Staff.")

    # 4. September 2026 Payroll Period & Payments
    payroll, _ = PayrollPeriod.objects.get_or_create(
        code="2026-09",
        defaults={
            "name": "September 2026",
            "academic_year": "2025/2026",
            "term": "1st Term",
            "pay_date": "2026-09-23",
            "status": PayrollPeriod.Status.PAID,
            "approved_by": admin_user,
            "approved_at": timezone.now(),
            "notes": "Regular monthly salary disbursement for all faculty and operational personnel.",
        }
    )

    all_profiles = SalaryProfile.objects.filter(is_active=True).select_related('user')
    tot_gross = Decimal("0")
    tot_ded = Decimal("0")
    tot_net = Decimal("0")

    for prof in all_profiles:
        gross = prof.gross_salary
        ded = prof.total_deductions
        net = prof.net_salary
        tot_gross += gross
        tot_ded += ded
        tot_net += net

        SalaryPayment.objects.get_or_create(
            payroll_period=payroll,
            salary_profile=prof,
            defaults={
                "employee": prof.user,
                "basic_salary": prof.basic_salary,
                "allowances": prof.housing_allowance + prof.transport_allowance + prof.meal_allowance + prof.other_allowances,
                "deductions": ded,
                "net_salary": net,
                "payment_date": "2026-09-23",
                "payment_method": "Bank Transfer",
                "status": "paid",
            }
        )

    payroll.total_gross = tot_gross
    payroll.total_deductions = tot_ded
    payroll.total_net = tot_net
    payroll.status = PayrollPeriod.Status.PAID
    payroll.save()
    print(f"Verified Payroll for {payroll.name}: Gross NGN {tot_gross:,.2f}, Net NGN {tot_net:,.2f}.")

    # 5. Staff Attendance Records for 23 September 2026
    att_date = date(2026, 9, 23)
    all_users = [t.user for t in teachers] + [s.user for s in staff]
    for idx, u in enumerate(all_users):
        emp_type = StaffAttendanceRecord.EmployeeType.TEACHER if idx < len(teachers) else StaffAttendanceRecord.EmployeeType.STAFF
        dept = "Academics" if emp_type == StaffAttendanceRecord.EmployeeType.TEACHER else "Administration"

        # Realistic status distribution
        if idx in [3, 11]:
            st = StaffAttendanceRecord.Status.LATE
            cin = "08:15 AM"
            cout = "03:15 PM"
            late_min = 30
            hours = Decimal("7.0")
            notes = "Traffic delay on Lekki-Epe expressway"
        elif idx == 8:
            st = StaffAttendanceRecord.Status.ON_LEAVE
            cin = "-"
            cout = "-"
            late_min = 0
            hours = Decimal("0.0")
            notes = "Approved annual leave"
        else:
            st = StaffAttendanceRecord.Status.PRESENT
            cin = "07:42 AM" if idx % 2 == 0 else "07:50 AM"
            cout = "03:05 PM"
            late_min = 0
            hours = Decimal("7.5")
            notes = "Punctual check-in"

        StaffAttendanceRecord.objects.update_or_create(
            user=u,
            date=att_date,
            defaults={
                "employee_type": emp_type,
                "department": dept,
                "check_in_time": cin,
                "check_out_time": cout,
                "hours_worked": hours,
                "status": st,
                "late_minutes": late_min,
                "marked_by": admin_user,
                "notes": notes,
            }
        )
    print("Verified 23 September 2026 staff attendance records.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_erp()
