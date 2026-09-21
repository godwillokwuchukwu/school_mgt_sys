import os
import django
from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
from accounts.models import Profile, Role
from academics.models import Class, Subject, Enrollment
from students.models import Student
from fees.models import Fee, FeeStatus
from attendance.models import AttendanceRecord, AttendanceStatus
from activities.models import Event, EventCategory
from admissions.models import AdmissionApplication, ApplicationStatus

def seed_database():
    print("Seeding database with Riverside Academy administration data...")

    # 1. Ensure Classes exist
    class_data = [
        ('JSS 1', 'JSS1-A', 52),
        ('JSS 2', 'JSS2-A', 48),
        ('JSS 3', 'JSS3-A', 46),
        ('SS 1', 'SS1-SCI', 42),
        ('SS 2', 'SS2-SCI', 41),
        ('SS 3', 'SS3-ALL', 38),
        ('JSS 1B', 'JSS1-B', 45),
        ('JSS 2B', 'JSS2-B', 40),
        ('JSS 3B', 'JSS3-B', 42),
        ('SS 1B', 'SS1-ART', 38),
        ('SS 2B', 'SS2-ART', 35),
        ('SS 3B', 'SS3-ART', 36),
    ]

    classes = {}
    for name, code, count in class_data:
        c, _ = Class.objects.get_or_create(
            code=code,
            academic_year='2025-2026',
            defaults={'name': name}
        )
        classes[name] = (c, count)
    print(f"Created/Verified {len(classes)} classes.")

    # 2. Ensure Teachers exist (Matching media_1789917182698.png)
    teachers_info = [
        ('James', 'Okafor', 'TCH001', 'Senior Teacher', 'Mathematics', 'Sciences', '+234 802 345 6789', 'james.okafor@staff.riversideacademy.com', 'Block A, Room 04', ['JSS 1', 'JSS 2', 'SS 1'], 96),
        ('Adeola', 'Bello', 'TCH002', 'Head of Department', 'English Language', 'Arts', '+234 803 123 4567', 'adeola.bello@staff.riversideacademy.com', 'Block C, Room 12', ['JSS 1', 'JSS 3', 'SS 2'], 98),
        ('Chinedu', 'Nwosu', 'TCH003', 'Teacher', 'Physics', 'Sciences', '+234 805 678 9012', 'chinedu.nwosu@staff.riversideacademy.com', 'Block B, Room 08', ['SS 1', 'SS 2'], 94),
        ('Funke', 'Ibrahim', 'TCH004', 'Teacher', 'Biology', 'Sciences', '+234 807 890 1234', 'funke.ibrahim@staff.riversideacademy.com', 'Block B, Room 03', ['JSS 2', 'SS 1'], 92),
        ('Samuel', 'Adeyemi', 'TCH005', 'Teacher', 'Chemistry', 'Sciences', '+234 808 901 2345', 'samuel.adeyemi@staff.riversideacademy.com', 'Block B, Lab 2', ['SS 1', 'SS 2'], 90),
        ('Grace', 'Williams', 'TCH006', 'Teacher', 'History', 'Humanities', '+234 809 111 2233', 'grace.williams@staff.riversideacademy.com', 'Block C, Room 05', ['JSS 3', 'SS 1'], 88),
        ('David', 'Eze', 'TCH007', 'Teacher', 'Geography', 'Humanities', '+234 809 222 3344', 'david.eze@staff.riversideacademy.com', 'Block C, Room 09', ['JSS 1', 'JSS 2'], 95),
        ('Ngozi', 'Ibe', 'TCH008', 'Teacher', 'French', 'Languages', '+234 809 333 4455', 'ngozi.ibe@staff.riversideacademy.com', 'Block C, Room 14', ['SS 1', 'SS 2'], 91),
        ('Bola', 'Akinola', 'TCH009', 'Teacher', 'Computer Science', 'ICT', '+234 809 444 5566', 'bola.akinola@staff.riversideacademy.com', 'ICT Innovation Hub', ['JSS 3', 'SS 2'], 87),
        ('Chisom', 'Okoye', 'TCH010', 'Teacher', 'Literature', 'Arts', '+234 809 555 6677', 'chisom.okoye@staff.riversideacademy.com', 'Block C, Room 02', ['SS 1', 'SS 2'], 93),
    ]

    for first, last, emp_id, title, subj, dept, phone, email, loc, cls_list, att in teachers_info:
        u, _ = User.objects.get_or_create(
            username=f"teacher_{emp_id.lower()}",
            defaults={
                'first_name': first,
                'last_name': last,
                'email': email,
                'is_active': True,
            }
        )
        p, _ = Profile.objects.get_or_create(user=u)
        p.role = Role.TEACHER
        p.teaching_position = title
        p.phone = phone
        p.address = loc
        p.save()
    print(f"Created/Verified {len(teachers_info)} teachers.")

    # 3. Ensure Students & Parents exist (Matching media_1789917182687.png)
    students_info = [
        ('Chinedu', 'Okafor', 'RS-0001', 'JSS 1', 'Male', 'Mr. Okafor', '0803 123 4567', 'okafor@parent.riversideacademy.com', 'Father', '12, Unity Street, Owerri, Imo State', 96, 'Paid', '2024-09-02'),
        ('Amaka', 'Nwosu', 'RS-0002', 'JSS 2', 'Female', 'Mrs. Nwosu', '0806 234 5678', 'nwosu@parent.riversideacademy.com', 'Mother', '45, Palm Avenue, Victoria Island, Lagos', 92, 'Partial', '2024-09-05'),
        ('Tunde', 'Bello', 'RS-0003', 'SS 1', 'Male', 'Mr. Bello', '0703 987 6543', 'bello@parent.riversideacademy.com', 'Father', '8, Commercial Road, Ikeja, Lagos', 88, 'Paid', '2024-08-28'),
        ('Bisola', 'Adebayo', 'RS-0004', 'JSS 3', 'Female', 'Mrs. Adebayo', '0809 876 5432', 'adebayo@parent.riversideacademy.com', 'Mother', '19, Hilltop Estate, Abuja', 100, 'Paid', '2024-09-01'),
        ('Emeka', 'Uche', 'RS-0005', 'SS 2', 'Male', 'Mr. Uche', '0706 345 6789', 'uche@parent.riversideacademy.com', 'Father', '22, Marina Road, Port Harcourt', 76, 'Pending', '2024-09-03'),
    ]

    for first, last, adm_no, cls_name, gender, guardian_name, guardian_phone, guardian_email, rel, address, att, fee_st, enr_date in students_info:
        # Parent User
        pu, _ = User.objects.get_or_create(
            username=f"parent_{adm_no.lower()}",
            defaults={
                'first_name': guardian_name.split()[0],
                'last_name': guardian_name.split()[-1],
                'email': guardian_email,
                'is_active': True,
            }
        )
        pp, _ = Profile.objects.get_or_create(user=pu)
        pp.role = Role.PARENT
        pp.phone = guardian_phone
        pp.address = address
        pp.save()

        # Student User
        su, _ = User.objects.get_or_create(
            username=f"student_{adm_no.lower()}",
            defaults={
                'first_name': first,
                'last_name': last,
                'email': f"{first.lower()}.{last.lower()}@student.riversideacademy.com",
                'is_active': True,
            }
        )
        sp, _ = Profile.objects.get_or_create(user=su)
        sp.role = Role.STUDENT
        sp.student_id = adm_no
        sp.phone = guardian_phone
        sp.address = address
        sp.dob = date(2012, 5, 14)
        sp.save()
        st, _ = Student.objects.get_or_create(
            admission_number=adm_no,
            defaults={
                'profile': sp,
                'dob': date(2012, 5, 14),
            }
        )
        st.parents.add(pp)

        # Enrollment
        if cls_name in classes:
            target_class = classes[cls_name][0]
            Enrollment.objects.get_or_create(
                student=st,
                school_class=target_class,
                academic_year='2025-2026'
            )

        # Fees
        fee_amt = Decimal('350000.00')
        f_status = FeeStatus.PAID if fee_st == 'Paid' else FeeStatus.PENDING
        Fee.objects.get_or_create(
            student=st,
            title='First Term Tuition & Materials',
            defaults={
                'amount': fee_amt,
                'due_date': date(2025, 9, 28),
                'status': f_status,
                'paid_at': timezone.now() if fee_st == 'Paid' else None
            }
        )

        # Attendance records for the last 7 days
        for i in range(7):
            att_date = date(2025, 9, 10) + timedelta(days=i)
            status_val = AttendanceStatus.PRESENT if (att >= 85 or i < 5) else AttendanceStatus.ABSENT
            AttendanceRecord.objects.get_or_create(
                student=st,
                date=att_date,
                defaults={'status': status_val}
            )

    print(f"Created/Verified {len(students_info)} primary students & parents.")

    # 4. Events matching media_1789917182709.png
    events_data = [
        ('Parent-Teacher Meeting', 'Main Hall', EventCategory.MEETING, '2025-09-18 09:00', '2025-09-18 12:00'),
        ('Mid-Term Examination', 'All Classes', EventCategory.EXAM, '2025-09-20 08:00', '2025-09-20 14:00'),
        ('School Assembly', 'Main Hall', EventCategory.ACADEMIC, '2025-09-25 09:00', '2025-09-25 10:30'),
        ('Fees Payment Deadline', 'Finance Office', EventCategory.DEADLINE, '2025-09-28 08:00', '2025-09-28 17:00'),
    ]

    for title, loc, cat, s_time, e_time in events_data:
        Event.objects.get_or_create(
            title=title,
            defaults={
                'location': loc,
                'category': cat,
                'start_time': s_time + ':00Z',
                'end_time': e_time + ':00Z',
                'is_school_wide': True,
            }
        )
    print(f"Created/Verified {len(events_data)} events.")

    # 5. Ensure Admission Applications exist
    admissions_data = [
        ('Somtochukwu', 'Obi', ApplicationStatus.UNDER_REVIEW),
        ('Zainab', 'Danjuma', ApplicationStatus.INTERVIEW_SCHEDULED),
        ('Kelechi', 'Eze', ApplicationStatus.APPROVED),
        ('Fatimah', 'Aliyu', ApplicationStatus.SUBMITTED),
        ('Tobi', 'Ogunleye', ApplicationStatus.ENROLLED),
    ]

    admin_user = User.objects.filter(is_superuser=True).first() or User.objects.first()
    for first, last, st in admissions_data:
        AdmissionApplication.objects.get_or_create(
            student_first_name=first,
            student_last_name=last,
            defaults={
                'applicant': admin_user,
                'student_dob': date(2013, 1, 1),
                'status': st,
                'reference': f"ADM-2025-{first[:3].upper()}",
            }
        )
    print(f"Created/Verified {len(admissions_data)} admission applications.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()

