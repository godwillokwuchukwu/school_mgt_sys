# Riverside Academy — Gap Analysis & Roadmap

Per the master prompt's own methodology (Section 93: *inspect before rewriting*), here is
what I found inspecting `school-management-system-fixed.zip`, compared against the
97-section spec, and a realistic phased plan to close the gaps.

**Why this document first, not a rewrite:** the master prompt describes a multi-month,
multi-engineer platform (public marketing site, admissions/recruitment pipelines, pluggable
payment gateways, JWT session management, Celery, Docker, CI/CD, audit logging, messaging,
timetabling, analytics...). Generating all of that as unreviewed code in one shot would
produce something that *looks* complete but isn't actually wired, tested, or safe —
exactly what the prompt calls out as unacceptable in Section 96. So: gap analysis first,
then we build in the order you pick.

---

## 1. What already exists (real, working)

- **Django 6.1 + DRF backend**, dockerized (`docker-compose.yml`, `Dockerfile`), Celery +
  Celery Beat wired into `config/celery.py`, Redis, PostgreSQL via `django-environ`.
- **Apps present**: `accounts`, `academics`, `students`, `attendance`, `activities`,
  `communications`, `reporting`, `fees` — each with models, serializers, views, urls,
  migrations, and admin registration.
- **Auth**: `djangorestframework-simplejwt` login/refresh, password reset via Django's
  token generator, `ScopedRateThrottle` on auth endpoints (100/hr).
- **RBAC**: single `Profile` model (1:1 with `User`) carrying `role` ∈
  {admin, teacher, student, parent}; permission classes (`IsAdmin`, `IsTeacher`,
  `IsOwnerOrAdmin`, etc.) centralized in `accounts/permissions.py`.
- **Audit log**: generic `AuditLog` model + `accounts/audit.py` helper, used by grade
  and attendance mutations.
- **Business-rule enforcement at two layers** (DB constraint + serializer validation) for
  grade scores, unique enrollment, unique class codes — a good pattern, worth keeping.
- **Tests**: `pytest` + `pytest-django` + `factory_boy`, `tests/` covers auth, students,
  attendance, activities.
- **Frontend**: single Vite + React app (`frontend/src/App.jsx`, `AuthFlow.jsx`,
  `ParentWorkspace.jsx`) — role-aware dashboard shell (student/teacher/parent/admin views
  switch inside one component tree), talks to the DRF API via `api.js`.
- **API docs**: `drf-spectacular` → Swagger (`/api/docs/`) and ReDoc (`/api/redoc/`).

This is a legitimate, working Phase-1 scaffold — not fake auth or hardcoded dashboards.
It should be **preserved and extended**, not thrown away.

## 2. Critical gap — violates the prompt's own non-negotiable rules

**Public registration currently grants full portal access instantly**, for any of
student/teacher/parent, with no admissions review, no employment approval, no admin
provisioning step:

- `POST /api/auth/register/` (`accounts/views.py::RegisterView`) is `AllowAny` and creates
  a real `User` + `Profile` with the client-supplied role in one call.
- The React registration form (`App.jsx::AuthScreen`) even lists **"Administrator"** as a
  selectable account type in the dropdown (the backend does correctly reject
  `role=admin` server-side in `RegisterSerializer.validate()` — so this isn't an actual
  privilege-escalation bug — but it's misleading UX for a rule the spec treats as sacred).
- There is no `AdmissionApplication`, `EmploymentApplication`, or `ApplicantProfile`
  concept anywhere in the codebase. A "student" registering today is immediately a fully
  functional portal account with no human review in between.

This directly contradicts Section 89, rules #1–#6 of the master prompt. **This is the
single highest-priority item** if we're following the prompt's own "fix critical issues
first" instruction (Section 93, Step 3) rather than layering new features on a broken
foundation.

## 3. Missing product: the public marketing website (Product A)

Nothing in `frontend/src` implements Sections 9–17 (homepage, about, academics, programs,
news, events, careers, contact, FAQ). `PublicSite` is referenced in `App.jsx` but the
current build is a single combined app, not two separated experiences (Section 3's
architectural requirement — separate routes/layouts/nav/UX for public vs. portal). There's
also no `public_site` Django app serving public content (news, events, programs) via
`/api/v1/public/*`.

## 4. Missing apps / domains (backend)

| Spec section | Required app/domain | Status |
|---|---|---|
| §18–24 | `admissions` (applications, status workflow, reference numbers) | **Missing** |
| §22 | `recruitment` (employment applications, HR pipeline) | **Missing** |
| §47–54 | `payments` (invoices, gateway abstraction, webhooks, receipts, reconciliation) | **Missing** — `fees` app is a simple owed/paid record, no transactions, no gateway, no webhook verification |
| §57 | `notifications` (in-app/email/SMS delivery, preferences) | **Missing** — Celery is wired but has no notification tasks yet |
| §68 | dedicated `audit_logs` app | Partial — generic `AuditLog` exists in `accounts`, not yet centralized/immutable/admin-restricted per spec |
| §69 | `School` / tenant model | **Missing** — no multi-school-ready `school_id` on any model |
| §41 | Report card PDF generation | **Missing** |
| §59 | Timetable | **Missing** |
| §60 | Parent-teacher meeting scheduling | **Missing** |
| §61 | Leave management | **Missing** |
| §62 | Document management w/ signed URLs | **Missing** — `Profile.photo` uses a plain `ImageField`, no general document model |
| §67 | Server-side filtering/pagination | Not yet visible across viewsets — needs audit |

## 5. Frontend architecture gap

Section 8 asks for a feature-oriented `src/` tree (`pages/public`, `pages/{student,
teacher,parent,admin}`, `features/*`, `services/`, `api/`, `routes/`, protected/role-aware
routing via React Router). Today it's 4 files with everything — public site, auth, and all
four dashboards — implemented as inline JSX inside one 700+-line `App.jsx`. Functional,
but not the separated, componentized architecture the spec requires, and it will get
unmaintainable fast as admissions/payments/messaging get added.

## 6. Security items to verify/harden once we're building

- MFA (§30) — not implemented (spec requires it mandatory for admins).
- Session/device tracking, "logout all devices" (§25, §77) — not present; only
  simplejwt's standard rotation/blacklist.
- File upload validation (MIME/size/extension) — only `Pillow`-backed `ImageField`, no
  general validated upload pipeline.
- Rate limits beyond auth (messaging, public applications, admin actions) — only the
  auth scope is throttled today.

---

## 7. Proposed build order

Following the prompt's own Section 94 ordering, adapted to *this* codebase's actual state:

1. **Fix the critical gap** (Section 2): gate self-registration behind an
   `ApplicantProfile` + admin-approval step; stop issuing portal accounts on public
   `POST /register/`.
2. **`School` model + `school_id`** on existing models (cheap now, expensive to retrofit
   later — every subsequent app should FK to it from day one).
3. **`admissions` app**: `AdmissionApplication`, status workflow, reference numbers,
   document upload, admin review → provisions `Student` + `Profile` + `User` only on
   approval.
4. **`recruitment` app**: same pattern for teacher/staff employment.
5. **Account provisioning flow**: admin-only endpoint that creates the user + sends a
   secure activation link (rather than self-service register creating live accounts).
6. **`payments` app**: `Invoice`, `PaymentTransaction`, pluggable gateway interface,
   webhook endpoint with signature verification, receipts — replacing/extending `fees`.
7. **Public website** (frontend): `pages/public/*` + `public_site` Django app for
   news/events/programs content, cleanly separated from the portal shell.
8. **Frontend restructure**: split the monolithic `App.jsx` into the feature-oriented
   layout from Section 8, with real route guarding.
9. Remaining domains (notifications, timetable, report cards, documents, audit-log
   hardening, MFA) in the order listed in Section 94.

---

## 7a. Progress log

**Stage 0 (Discovery)** — done (this document).

**Stage 1 (Foundation/Auth/RBAC)** — done: closed the open self-registration hole, added
admin-only provisioning (audited), restored the orphaned `RegistrationInvitation` model
for Stage 3, added `core.School`, and locked down an RBAC gap discovered while adding the
new `applicant` role (several viewsets defaulted to "full access" for any non-student/parent
role instead of an explicit allow-list).

**Stage 2 (Public Website & Applicant Workflows)** — done: full public frontend
(`frontend/src/public/`) with its own routes/layout/brand, separated from `/portal/*`;
`public_site` app (news/events/programs/testimonials/FAQ/careers listings + contact);
`admissions` app with the full multi-part student application (draft → documents → submit
→ admin review, `BFA-YYYY-NNNNNN` references, public status lookup with PII stripped);
employment application status tracking; and `ParentRelationshipRequest` for Section 2.6/23's
pending (never automatic) parent-student linkage, with its own admin verification queue.
31/31 backend tests passing, frontend builds clean.

## 8. What I'd like from you

This is realistically a multi-week build even scoped tightly. Rather than guess, tell me
where to start and I'll build that module now — real models, migrations, serializers,
views, tests, and the matching frontend pieces (not a mockup).
