/**
 * Riverside Academy - Default Layout & Content Configurations
 * Provides complete fallback models and normalization helpers for:
 * 1. Public Website Sections (Order, Visibility, Write-ups, Feature cards)
 * 2. Portal Dashboard Widgets (Order, Visibility, Announcements, Module toggles)
 */

export const DEFAULT_PUBLIC_SECTIONS = [
  { id: 'hero', name: 'Hero Banner & Quick Stats', desc: 'Main title, admissions call-to-action, and at-a-glance metrics', enabled: true },
  { id: 'features', name: 'Why Choose Us (Core Features)', desc: 'Grid of institutional strengths, academic standards, and facilities', enabled: true },
  { id: 'about_teaser', name: 'About Our School Teaser', desc: 'Campus imagery, mission narrative, and institutional highlights', enabled: true },
  { id: 'programs', name: 'Academic & Co-Curricular Programs', desc: 'Dynamic showcase of academic curricula, clubs, and sports', enabled: true },
  { id: 'stats_band', name: 'Key Statistics Band', desc: 'Full-width ribbon highlighting total students, faculty, and pass rates', enabled: true },
  { id: 'testimonials', name: 'Community Testimonials', desc: 'Endorsements from parents, students, and education leaders', enabled: true },
  { id: 'news_events', name: 'Latest News & Upcoming Events', desc: 'Two-column live feed of school bulletins and calendar dates', enabled: true },
  { id: 'cta_banner', name: 'Admissions Call-to-Action Banner', desc: 'Prominent final registration invitation band with apply button', enabled: true },
]

export const DEFAULT_PUBLIC_LAYOUT = {
  section_order: DEFAULT_PUBLIC_SECTIONS,
  hero: {
    eyebrow: 'EXCELLENCE IN LEARNING · NURTURING CHARACTER',
    heading: 'Where Ambition Meets Opportunity.',
    subtext: 'Where every learner is seen, challenged, and prepared to make a meaningful difference in the world.',
    primary_cta_text: 'Enroll Now →',
    primary_cta_link: '/admissions/apply',
    secondary_cta_text: 'Learn More',
    secondary_cta_link: '/about',
    stats_title: 'AT A GLANCE',
  },
  features: {
    eyebrow: 'WHY CHOOSE US',
    title: 'Everything your child needs to thrive',
    items: [
      { id: 1, title: 'Academic Excellence', detail: 'A rigorous, well-rounded curriculum guided by experienced educators.', icon: 'star' },
      { id: 2, title: 'Experienced Teachers', detail: 'Passionate, qualified staff who know every learner by name.', icon: 'teacher' },
      { id: 3, title: 'Modern Facilities', detail: 'Science labs, libraries, sports fields, and creative studios.', icon: 'facility' },
      { id: 4, title: 'Holistic Development', detail: 'Sport, arts, leadership, and community service alongside academics.', icon: 'holistic' },
    ],
  },
  about_teaser: {
    eyebrow: 'ABOUT OUR SCHOOL',
    title: 'A tradition of excellence, an eye on the future',
    description: 'At Riverside Academy, we believe every student deserves an education that challenges them academically while nurturing their character and leadership skills. Our dedicated faculty and modern facilities ensure an enriching environment.',
    badge_text: 'Excellence in Education',
    highlights: [
      'Rigorous Academic Tracks',
      'Dedicated Faculty Mentors',
      'Modern STEM & Arts Labs',
      'Athletics & Leadership',
    ],
    cta_text: 'Learn More About Us →',
    cta_link: '/about',
  },
  stats_band: {
    students_label: 'Total students',
    teachers_label: 'Total teachers',
    years_label: 'Years of excellence',
    grad_rate_label: 'Graduation success rate',
  },
  cta_banner: {
    eyebrow: 'JOIN OUR NEXT CHAPTER',
    heading: 'Admissions are open for 2026/2027.',
    subtext: 'Come and see what your child can become at our academy.',
    button_text: 'Start an application →',
    button_link: '/admissions/apply',
  },
}

export const DEFAULT_PORTAL_WIDGETS = [
  { id: 'welcome_banner', name: 'Welcome Banner & Announcement', desc: 'Personalized greeting, date banner, and critical administrative notice', enabled: true },
  { id: 'kpi_cards', name: 'Primary KPI Metrics Grid', desc: 'Total Students, Active Teachers, Attendance Rate, and Term Fees Collected', enabled: true },
  { id: 'quick_actions', name: 'Operational Quick Actions', desc: 'Shortcuts to Add Student, Add Teacher, Record Attendance, and Run Backup', enabled: true },
  { id: 'charts_row', name: 'Enrollment & Attendance Charts', desc: 'Cohort bar chart distribution and 7-day attendance trend line chart', enabled: true },
  { id: 'overview_analytics', name: 'Academic, Gender, Fees & Admissions Analytics', desc: 'Student gender distribution donut, academic performance benchmarks, fee collection ratio, and admissions conversion funnel', enabled: true },
  { id: 'events_and_activities', name: 'Events & Real-Time Activity Feed', desc: 'Upcoming calendar dates and operational audit log stream', enabled: true },
  { id: 'system_alerts', name: 'System & Policy Alerts', desc: 'Compliance reminders, low attendance notices, and pending approvals', enabled: true },
]

export const DEFAULT_PORTAL_LAYOUT = {
  widget_order: DEFAULT_PORTAL_WIDGETS,
  welcome: {
    headline: 'Good afternoon, Admin 👋',
    subtitle: 'Here is what is happening today. Stay informed and keep everything running smoothly.',
    announcement_enabled: true,
    announcement_title: 'Institutional Notice: Term 2 Policy Active',
    announcement_message: 'Continuous assessment records, CA2 submissions, and bursary reconciliations are currently open.',
    announcement_type: 'info', // 'info' | 'success' | 'warning'
  },
  module_visibility: {
    Overview: true,
    Admissions: true,
    Students: true,
    Teachers: true,
    Parents: true,
    Staff: true,
    Classes: true,
    Academics: true,
    Attendance: true,
    Grades: true,
    Fees: true,
    Payroll: true,
    Expenses: true,
    Timetable: true,
    Calendar: true,
    News: true,
    Reports: true,
    Analytics: true,
    'Audit Logs': true,
    Settings: true,
  },
}

/**
 * Normalizes user-stored public layout JSON with standard defaults
 */
export function normalizePublicLayout(stored) {
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_PUBLIC_LAYOUT }

  const storedSections = Array.isArray(stored.section_order) ? stored.section_order : []
  // Merge order with defaults to ensure any missing sections are added
  const sectionMap = new Map(storedSections.map((s) => [s.id, s]))
  const mergedSections = DEFAULT_PUBLIC_SECTIONS.map((def) => {
    const existing = sectionMap.get(def.id)
    return existing ? { ...def, ...existing } : { ...def }
  })

  // Retain user order if valid
  const orderedIds = storedSections.map((s) => s.id)
  const sortedSections = [...mergedSections].sort((a, b) => {
    const idxA = orderedIds.indexOf(a.id)
    const idxB = orderedIds.indexOf(b.id)
    if (idxA === -1 && idxB === -1) return 0
    if (idxA === -1) return 1
    if (idxB === -1) return -1
    return idxA - idxB
  })

  return {
    section_order: sortedSections,
    hero: { ...DEFAULT_PUBLIC_LAYOUT.hero, ...(stored.hero || {}) },
    features: {
      ...DEFAULT_PUBLIC_LAYOUT.features,
      ...(stored.features || {}),
      items: Array.isArray(stored.features?.items) && stored.features.items.length === 4
        ? stored.features.items
        : DEFAULT_PUBLIC_LAYOUT.features.items,
    },
    about_teaser: {
      ...DEFAULT_PUBLIC_LAYOUT.about_teaser,
      ...(stored.about_teaser || {}),
      highlights: Array.isArray(stored.about_teaser?.highlights)
        ? stored.about_teaser.highlights
        : DEFAULT_PUBLIC_LAYOUT.about_teaser.highlights,
    },
    stats_band: { ...DEFAULT_PUBLIC_LAYOUT.stats_band, ...(stored.stats_band || {}) },
    cta_banner: { ...DEFAULT_PUBLIC_LAYOUT.cta_banner, ...(stored.cta_banner || {}) },
  }
}

/**
 * Normalizes user-stored portal layout JSON with standard defaults
 */
export function normalizePortalLayout(stored) {
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_PORTAL_LAYOUT }

  const storedWidgets = Array.isArray(stored.widget_order) ? stored.widget_order : []
  const widgetMap = new Map(storedWidgets.map((w) => [w.id, w]))
  const mergedWidgets = DEFAULT_PORTAL_WIDGETS.map((def) => {
    const existing = widgetMap.get(def.id)
    return existing ? { ...def, ...existing } : { ...def }
  })

  const orderedIds = storedWidgets.map((w) => w.id)
  if (!orderedIds.includes('overview_analytics')) {
    const chartsIdx = orderedIds.indexOf('charts_row')
    if (chartsIdx !== -1) {
      orderedIds.splice(chartsIdx + 1, 0, 'overview_analytics')
    }
  }
  const sortedWidgets = [...mergedWidgets].sort((a, b) => {
    const idxA = orderedIds.indexOf(a.id)
    const idxB = orderedIds.indexOf(b.id)
    if (idxA === -1 && idxB === -1) return 0
    if (idxA === -1) return 1
    if (idxB === -1) return -1
    return idxA - idxB
  })

  return {
    widget_order: sortedWidgets,
    welcome: { ...DEFAULT_PORTAL_LAYOUT.welcome, ...(stored.welcome || {}) },
    module_visibility: { ...DEFAULT_PORTAL_LAYOUT.module_visibility, ...(stored.module_visibility || {}) },
  }
}

