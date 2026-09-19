import logging
from django.utils import timezone

logger = logging.getLogger(__name__)


def build_school_context(user, prompt: str) -> dict:
    """
    Builds automated, role-aware context from the database and public site.
    Enforces strict role-based data insulation:
      - Admin: Full access to school-wide metrics, admissions data, counts, financials.
      - Teacher: Access to assigned classes, subjects, pedagogical tools. Denied admin metrics.
      - Student: Access to personal subjects, academic tutoring, homework/project help. Denied admin metrics.
      - Parent: Access to linked children info, calendar, policies. Denied admin metrics.
    """
    role = getattr(getattr(user, "profile", None), "role", "student")
    user_name = user.get_full_name() or user.username

    # 1. Base Public School Information (available to all)
    school_info = _get_public_school_info()

    # 2. Role-specific context & security guardrails
    role_context = ""
    guardrails = ""

    if role == "admin":
        role_context = _get_admin_database_context()
        guardrails = (
            "USER ROLE: [ADMINISTRATOR]\n"
            "You are speaking with a verified School Administrator. "
            "You have full authorization to provide school-wide analytics, admission application statistics, "
            "student enrollment counts, teacher rosters, and operational insights from the database."
        )
    elif role == "teacher":
        role_context = _get_teacher_context(user)
        guardrails = (
            "USER ROLE: [TEACHER]\n"
            "You are speaking with a Riverside Academy Faculty/Teacher. "
            "Help them with lesson planning, quiz creation, grading rubrics, assignment design, and pedagogical guidance.\n"
            "SECURITY BLOCKAGE: If this user asks for administrative-only data (such as total admission application statistics, "
            "financial revenue/fees collected, system audit logs, or school-wide management metrics), politely inform them that "
            "such metrics are restricted to school administrators."
        )
    elif role == "student":
        role_context = _get_student_context(user)
        guardrails = (
            "USER ROLE: [STUDENT]\n"
            "You are speaking with an enrolled Riverside Academy Student. "
            "Act as their expert academic tutor and problem solver (just like Gemini). "
            "Help them understand concepts, solve homework and assignment problems step-by-step, brainstorm science/history/arts "
            "projects, outline essays, and study effectively.\n"
            "SECURITY BLOCKAGE: If this student asks for administrative or school-management information (such as how many students "
            "have registered for admission, school revenue/fee collection, confidential teacher notes, or other students' private data/grades), "
            "you MUST refuse to answer that question and politely explain: 'This information is restricted to school administrators. "
            "As your Riverside Academy academic assistant, I am here to help you with your studies, assignments, and school projects!'"
        )
    elif role == "parent":
        role_context = _get_parent_context(user)
        guardrails = (
            "USER ROLE: [PARENT/GUARDIAN]\n"
            "You are speaking with a parent/guardian of Riverside Academy students. "
            "Provide helpful information about their children's school activities, calendar, and general policies.\n"
            "SECURITY BLOCKAGE: Do not disclose administrative metrics (such as admission application statistics, other families' data, "
            "or school-wide finances). Politely direct them to contact the administration office for administrative inquiries."
        )
    else:
        guardrails = (
            "USER ROLE: [GUEST/STAFF]\n"
            "Provide general school information and decline requests for confidential administrative data."
        )

    system_instruction = (
        "You are the official Riverside Academy AI Assistant & School Problem Solver.\n"
        "Riverside Academy is an elite institution dedicated to academic excellence, integrity, and innovation.\n"
        f"User: {user_name} (Role: {role.upper()})\n\n"
        f"{guardrails}\n\n"
        "GUIDELINES:\n"
        "1. Be accurate, polite, professional, and encouraging.\n"
        "2. For academic questions, provide detailed, step-by-step explanations, formulas, or code as needed.\n"
        "3. Use the provided Live School Data to answer questions regarding Riverside Academy facts, events, and metrics.\n"
        "4. Always uphold Riverside Academy's standards of academic honesty and data privacy.\n"
        "5. CRITICAL: NEVER guess, estimate, approximate, or round up numbers. Always state the EXACT, precise figures retrieved from the database context (e.g. if the database records show 6 students, state exactly 6; if 3 admission applications, state exactly 3). If a metric is not recorded in the database, explicitly state that it is not available rather than guessing."
    )

    full_context = f"=== LIVE RIVERSIDE ACADEMY DATA ===\n{school_info}\n\n{role_context}"

    return {
        "role": role,
        "system_instruction": system_instruction,
        "context": full_context,
    }


def _get_public_school_info() -> str:
    """Fetches public website content: profile, programs, events, and news."""
    lines = []
    try:
        from public_site.models import SchoolProfile, Program, Event, NewsArticle

        # School Profile
        profile = SchoolProfile.load()
        if profile:
            lines.append(f"School Name: {profile.name}")
            lines.append(f"Tagline: {profile.tagline}")
            if profile.mission:
                lines.append(f"Mission: {profile.mission}")
            if profile.vision:
                lines.append(f"Vision: {profile.vision}")
            lines.append(f"Contact Email: {profile.email} | Phone: {profile.phone}")
            lines.append(f"Address: {profile.address}")
            lines.append(f"Office Hours: {profile.office_hours}")

        # Academic Programs
        programs = Program.objects.all()[:6]
        if programs.exists():
            lines.append("\nPrograms Offered:")
            for p in programs:
                lines.append(f"- {p.title}: {p.description[:100]}")

        # Upcoming Events
        now = timezone.now()
        events = Event.objects.filter(start_date__gte=now.date()).order_by("start_date")[:4]
        if events.exists():
            lines.append("\nUpcoming School Events:")
            for e in events:
                lines.append(f"- {e.title} on {e.start_date}: {e.location or 'Main Campus'}")

        # Recent News
        news = NewsArticle.objects.filter(is_published=True).order_by("-published_at")[:3]
        if news.exists():
            lines.append("\nLatest News & Announcements:")
            for n in news:
                lines.append(f"- {n.title} ({n.published_at.strftime('%b %d, %Y') if n.published_at else ''})")

    except Exception as exc:
        logger.warning(f"Error fetching public school info: {exc}")
        lines.append("Riverside Academy: Learning with purpose. Preparing students for a changing world.")

    return "\n".join(lines)


def _get_admin_database_context() -> str:
    """
    Fetches real-time database metrics for Administrators:
    - Registered students count
    - Admission applications count and status breakdown
    - Staff/Teacher counts
    - Recent applicants list
    """
    lines = ["=== ADMINISTRATOR DATABASE METRICS ==="]
    try:
        from django.contrib.auth import get_user_model
        from accounts.models import Profile, Role
        from admissions.models import AdmissionApplication, ApplicationStatus
        from students.models import Student
        from academics.models import Subject, Class

        User = get_user_model()

        # Student metrics
        total_students = Student.objects.count()
        registered_student_users = Profile.objects.filter(role=Role.STUDENT).count()
        lines.append(f"Total Student Records: {total_students}")
        lines.append(f"Registered Student User Accounts: {registered_student_users}")

        # Admission Application metrics
        total_applications = AdmissionApplication.objects.count()
        lines.append(f"\nTotal Admission Applications: {total_applications}")

        # Breakdown by status
        status_counts = []
        for status_code, status_label in ApplicationStatus.choices:
            cnt = AdmissionApplication.objects.filter(status=status_code).count()
            if cnt > 0:
                status_counts.append(f"{status_label}: {cnt}")
        if status_counts:
            lines.append("Admission Applications Breakdown: " + ", ".join(status_counts))

        # Recent applications
        recent_apps = AdmissionApplication.objects.order_by("-created_at")[:5]
        if recent_apps.exists():
            lines.append("\nRecent Admission Applications:")
            for app in recent_apps:
                lines.append(
                    f"- Ref: {app.reference}, Student: {app.student_first_name} {app.student_last_name}, "
                    f"Class: {app.class_applying_for}, Status: {app.status.upper()}, Date: {app.created_at.strftime('%Y-%m-%d')}"
                )

        # Staff and Faculty
        teacher_count = Profile.objects.filter(role=Role.TEACHER).count()
        admin_count = Profile.objects.filter(role=Role.ADMIN).count()
        lines.append(f"\nFaculty & Staff: {teacher_count} Teachers, {admin_count} Administrators")

        # Academic structure
        total_classes = Class.objects.count()
        total_subjects = Subject.objects.count()
        lines.append(f"Academics: {total_classes} Classes, {total_subjects} Subjects offered")

    except Exception as exc:
        logger.error(f"Error fetching admin database context: {exc}")
        lines.append("Administrative database statistics are currently unavailable.")

    return "\n".join(lines)


def _get_teacher_context(user) -> str:
    """Fetches classes and subjects assigned to this teacher."""
    lines = ["=== FACULTY CONTEXT ==="]
    try:
        from academics.models import Class

        teaching_subjects = user.profile.teaching_subjects.all() if hasattr(user, "profile") else []
        if teaching_subjects:
            subjects_list = ", ".join([f"{s.name} ({s.code})" for s in teaching_subjects])
            lines.append(f"Your Assigned Subjects: {subjects_list}")

        classes_led = Class.objects.filter(class_teacher=user)
        if classes_led.exists():
            classes_list = ", ".join([f"{c.name} ({c.academic_year})" for c in classes_led])
            lines.append(f"Classes You Lead: {classes_list}")

    except Exception as exc:
        logger.warning(f"Error fetching teacher context: {exc}")

    return "\n".join(lines)


def _get_student_context(user) -> str:
    """Fetches student details and enrolled classes."""
    lines = ["=== STUDENT ACADEMIC CONTEXT ==="]
    try:
        from students.models import Student
        from academics.models import Enrollment

        student = Student.objects.filter(profile__user=user).first()
        if student:
            lines.append(f"Student Admission Number: {student.admission_number}")
            enrollments = Enrollment.objects.filter(student=student)
            if enrollments.exists():
                classes = [f"{e.school_class.name} ({e.academic_year})" for e in enrollments]
                lines.append(f"Enrolled In: {', '.join(classes)}")
    except Exception as exc:
        logger.warning(f"Error fetching student context: {exc}")

    lines.append("Role: Academic Learner. You can ask for help with homework, essays, math, science, and projects.")
    return "\n".join(lines)


def _get_parent_context(user) -> str:
    """Fetches linked children for the parent."""
    lines = ["=== PARENT CONTEXT ==="]
    try:
        from students.models import Student

        if hasattr(user, "profile"):
            children = Student.objects.filter(parents=user.profile)
            if children.exists():
                child_names = [
                    f"{c.profile.user.get_full_name() or c.profile.user.username} (Adm: {c.admission_number})"
                    for c in children
                ]
                lines.append(f"Your Linked Children: {', '.join(child_names)}")
    except Exception as exc:
        logger.warning(f"Error fetching parent context: {exc}")

    return "\n".join(lines)
