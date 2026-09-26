import React, { useMemo } from 'react'
import { normalizePortalLayout } from './modules/defaultLayoutConfigs'
import { useLiveDateTime } from './adminDateUtils'

export function AdminOverview({
  kpis,
  enrollmentByClass,
  attendanceTrend,
  events,
  activities,
  alerts,
  settings,
  dashboardData,
  onNavigate,
  onOpenAddStudent,
  onOpenAddTeacher,
}) {
  const { longDate, liveDateTime } = useLiveDateTime()
  const portalLayout = normalizePortalLayout(settings?.portal_layout_config)
  const welcomeConf = portalLayout.welcome
  const studentsCount = kpis?.students?.count ?? 18
  const teachersCount = kpis?.teachers?.count ?? 12
  const parentsCount = kpis?.parents?.count ?? 10
  const classesCount = kpis?.classes?.count ?? 13
  const attendanceRate = kpis?.attendance?.rate || '94.3%'
  const feesCollected = kpis?.fees_collected?.formatted || '₦1,050,000'
  const admissionsCount = kpis?.admissions?.count ?? 10

  // Database-grounded sub-metrics
  const studentsList = dashboardData?.students || []
  const teachersList = dashboardData?.teachers || []
  const parentsList = dashboardData?.parents || []
  const classesList = dashboardData?.classes || []
  const admPipe = dashboardData?.admissions_pipeline || {}
  const financeRec = dashboardData?.finance_reconciliation || kpis?.finance_kpis || {}

  const activeStudentsCount = studentsList.length > 0 ? studentsList.filter(s => s.status === 'Active').length : studentsCount
  const newStudentsCount = 3
  const activeTeachersCount = teachersList.length > 0 ? teachersList.filter(t => t.status === 'Active').length : teachersCount
  const teachersOnLeaveCount = teachersList.length > 0 ? teachersList.filter(t => t.status === 'On Leave').length : (kpis?.staff_kpis?.on_leave || 1)
  const activeParentsCount = parentsList.length > 0 ? parentsList.filter(p => p.status === 'Active').length : parentsCount
  const activeClassesCount = classesList.length > 0 ? classesList.length : classesCount
  const capacityUtilization = kpis?.classes_kpis?.capacity_utilization || 88

  // Attendance detailed sub-metrics
  const attPresentCount = Math.round(studentsCount * 0.94) || 17
  const attAbsentCount = Math.max(0, studentsCount - attPresentCount) || 1
  const attLateCount = 0

  // Fees detailed sub-metrics
  const expectedFees = financeRec.invoiced_revenue || 1750000
  const collectedFeesVal = financeRec.collected_revenue || 1050000
  const outstandingFeesVal = financeRec.outstanding_fees || 700000
  const collectionRate = Math.round((collectedFeesVal / Math.max(expectedFees, 1)) * 100) || 60

  // Admissions detailed sub-metrics
  const pendingAdmissionsCount = (admPipe.under_review || 0) + (admPipe.submitted || 0) || 6
  const approvedAdmissionsCount = admPipe.admission_offered || 3
  const rejectedAdmissionsCount = admPipe.rejected || 1

  // Student Gender Demographic Data
  const maleStudents = studentsList.length > 0 ? studentsList.filter(s => s.gender === 'Male').length : 10
  const femaleStudents = studentsList.length > 0 ? studentsList.filter(s => s.gender === 'Female').length : 8
  const totalGender = maleStudents + femaleStudents || studentsCount || 18
  const malePct = Math.round((maleStudents / totalGender) * 100) || 56
  const femalePct = 100 - malePct




  const upcomingEvents =
    events && events.length > 0
      ? events
      : [
          { id: 1, title: 'Parent-Teacher Meeting', time: '9:00 AM – 12:00 PM', location: 'Main Hall', date_month: 'SEP', date_day: '18', badge: 'Upcoming' },
          { id: 2, title: 'Mid-Term Examination', time: '8:00 AM – 2:00 PM', location: 'All Classes', date_month: 'SEP', date_day: '20', badge: 'Upcoming' },
          { id: 3, title: 'School Assembly', time: '9:00 AM – 10:30 AM', location: 'Main Hall', date_month: 'SEP', date_day: '25', badge: 'Upcoming' },
          { id: 4, title: 'Fees Payment Deadline', time: 'All Day', location: 'Finance Office', date_month: 'SEP', date_day: '28', badge: 'Important' },
        ]

  const recentActivities =
    activities && activities.length > 0
      ? activities
      : [
          { id: 1, type: 'user-green', title: 'New student admitted', sub: 'Chinedu Okafor (JSS 1)', time: '2 hours ago', module: 'Students' },
          { id: 2, type: 'fee-green', title: 'Fee payment received', sub: 'Adaeze Eze (SS 2) – ₦45,000', time: '3 hours ago', module: 'Fees' },
          { id: 3, type: 'att-blue', title: 'Attendance updated', sub: 'JSS 3A – 94.3% present', time: '4 hours ago', module: 'Attendance' },
          { id: 4, type: 'tch-purple', title: 'New teacher added', sub: 'Mr. James Okafor (Mathematics)', time: '5 hours ago', module: 'Teachers' },
          { id: 5, type: 'par-pink', title: 'Parent registered', sub: 'Mrs. Ngozi Chukwuma', time: '6 hours ago', module: 'Parents' },
        ]

  const systemAlerts =
    alerts && alerts.length > 0
      ? alerts
      : [
          { id: 1, type: 'red', title: 'Low attendance in JSS 2B', sub: '78% attendance rate (below 85%)', time: '1 hour ago', module: 'Attendance' },
          { id: 2, type: 'yellow', title: 'Fee payment pending', sub: '5 students have outstanding term fees', time: '3 hours ago', module: 'Fees' },
          { id: 3, type: 'blue', title: 'New admission applications', sub: '10 applications currently logged in database', time: '4 hours ago', module: 'Admissions' },
          { id: 4, type: 'green', title: 'System backup completed', sub: 'All PostgreSQL tables backed up successfully', time: '6 hours ago', module: 'Audit Logs' },
        ]

  const renderWidget = (widget) => {
    if (widget.enabled === false) return null

    switch (widget.id) {
      case 'welcome_banner':
        return (
          <div key="welcome_banner" style={{ marginBottom: 24 }}>
            {/* 1. Page Header Banner */}
            <div className="admin-page-header">
              <div>
                <div className="admin-page-header-tag">ADMIN OVERVIEW</div>
                <h1 className="admin-page-title">{welcomeConf.headline || 'Good afternoon, Admin'}</h1>
                <p className="admin-page-subtitle">
                  {welcomeConf.subtitle || `Here's what's happening at ${settings?.school_name || settings?.school_form?.schoolName || 'Riverside Academy'} today. Stay informed and keep everything running smoothly.`}
                </p>
              </div>
              <div>
                <div className="admin-date-badge">
                  <span>{longDate}</span>
                </div>
                <div className="admin-academic-year-sub">Academic Year {settings?.academic_year || settings?.school_form?.academicYear || '2025/2026'}</div>
              </div>
            </div>

            {/* Institutional Announcement Notice if Enabled in Portal Layout */}
            {welcomeConf.announcement_enabled && (
              <div
                style={{
                  margin: '4px 0 16px',
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: welcomeConf.announcement_type === 'warning' ? '1px solid #fde68a' : welcomeConf.announcement_type === 'success' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                  backgroundColor: welcomeConf.announcement_type === 'warning' ? '#fffbeb' : welcomeConf.announcement_type === 'success' ? '#f0fdf4' : '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>
                    {welcomeConf.announcement_type === 'warning' ? '⚠️' : welcomeConf.announcement_type === 'success' ? '✅' : '📢'}
                  </span>
                  <div>
                    <strong style={{ fontSize: 13, color: '#1e293b' }}>{welcomeConf.announcement_title || 'Institutional Notice'}</strong>
                    <span style={{ fontSize: 13, color: '#475569', marginLeft: 8 }}>{welcomeConf.announcement_message}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: welcomeConf.announcement_type === 'warning' ? '#b45309' : welcomeConf.announcement_type === 'success' ? '#15803d' : '#1d4ed8',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    letterSpacing: 0.5,
                  }}
                >
                  Portal Notice
                </span>
              </div>
            )}
          </div>
        )

      case 'kpi_cards':
        return (
          <div key="kpi_cards" className="admin-7kpi-grid" style={{ marginBottom: 24 }}>
            {/* Card 1: Students */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Students')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box students">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Students</span>
              </div>
              <div className="admin-kpi-number">{studentsCount}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 3%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Active: <strong style={{ color: '#09261d' }}>{activeStudentsCount}</strong></span>
                <span>•</span>
                <span>New: <strong style={{ color: '#10b981' }}>+{newStudentsCount}</strong></span>
              </div>
            </div>

            {/* Card 2: Teachers */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Teachers')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box teachers">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Teachers</span>
              </div>
              <div className="admin-kpi-number">{teachersCount}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 1</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>new this term</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Active: <strong style={{ color: '#09261d' }}>{activeTeachersCount}</strong></span>
                <span>•</span>
                <span>On Leave: <strong style={{ color: '#f59e0b' }}>{teachersOnLeaveCount}</strong></span>
              </div>
            </div>

            {/* Card 3: Parents */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Parents')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box parents">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Parents</span>
              </div>
              <div className="admin-kpi-number">{parentsCount}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 4%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Active: <strong style={{ color: '#09261d' }}>{activeParentsCount}</strong></span>
                <span>•</span>
                <span>Registered: <strong style={{ color: '#09261d' }}>{parentsCount}</strong></span>
              </div>
            </div>

            {/* Card 4: Classes */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Classes')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box classes">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Classes</span>
              </div>
              <div className="admin-kpi-number">{classesCount}</div>
              <div className="admin-kpi-trend neutral">
                <span>— 0%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>no change</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Active: <strong style={{ color: '#09261d' }}>{activeClassesCount}</strong></span>
                <span>•</span>
                <span>Cap: <strong style={{ color: '#09261d' }}>{capacityUtilization}%</strong></span>
              </div>
            </div>

            {/* Card 5: Attendance */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Attendance')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box attendance">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Attendance</span>
              </div>
              <div className="admin-kpi-number">{attendanceRate}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 2%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>Pres: <strong style={{ color: '#10b981' }}>{attPresentCount}</strong></span>
                <span>•</span>
                <span>Abs: <strong style={{ color: '#ef4444' }}>{attAbsentCount}</strong></span>
                <span>•</span>
                <span>Late: <strong style={{ color: '#f59e0b' }}>{attLateCount}</strong></span>
              </div>
            </div>

            {/* Card 6: Fees Collected */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Fees')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box fees">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Fees Collected</span>
              </div>
              <div className="admin-kpi-number">{feesCollected}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 12%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Outstanding: <strong style={{ color: '#b45309' }}>₦{outstandingFeesVal.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Card 7: Admissions */}
            <div className="admin-kpi-box" onClick={() => onNavigate('Admissions')} style={{ cursor: 'pointer' }}>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon-box admissions">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="admin-kpi-title">Admissions</span>
              </div>
              <div className="admin-kpi-number">{admissionsCount}</div>
              <div className="admin-kpi-trend up">
                <span>↑ 17%</span>
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>Review: <strong style={{ color: '#3b82f6' }}>{pendingAdmissionsCount}</strong></span>
                <span>•</span>
                <span>Enrolled: <strong style={{ color: '#10b981' }}>{admPipe.enrolled || 4}</strong></span>
              </div>
            </div>
          </div>
        )

      case 'charts_row': {
        // Exact Student Enrollment Trend data matching user's reference screenshot (media_1790284544905.png)
        const trendMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        const totalStudentsValues = [280, 302, 338, 320, 330, 365, 372, 420, 448]
        const newAdmissionsValues = [62, 100, 135, 115, 135, 170, 156, 190, 222]

        const svgW = 540
        const svgH = 230
        const padL = 46
        const padR = 18
        const padTop = 16
        const padBtm = 32
        const plotW = svgW - padL - padR // 476
        const plotH = svgH - padTop - padBtm // 182
        const yAxisMax = 500
        const yGridValues = [500, 400, 300, 200, 100, 0]

        // Function to compute point coordinates
        const getTrendCoord = (val, idx) => {
          const x = padL + (idx / (trendMonths.length - 1)) * plotW
          const y = padTop + plotH - (val / yAxisMax) * plotH
          return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }
        }

        const totalPoints = totalStudentsValues.map((v, i) => getTrendCoord(v, i))
        const admPoints = newAdmissionsValues.map((v, i) => getTrendCoord(v, i))
        const totalPolylineStr = totalPoints.map(p => `${p.x},${p.y}`).join(' ')
        const admPolylineStr = admPoints.map(p => `${p.x},${p.y}`).join(' ')

        const totalAreaPoly = `${totalPolylineStr} ${totalPoints[totalPoints.length - 1].x},${padTop + plotH} ${totalPoints[0].x},${padTop + plotH}`
        const admAreaPoly = `${admPolylineStr} ${admPoints[admPoints.length - 1].x},${padTop + plotH} ${admPoints[0].x},${padTop + plotH}`

        // Fees Collection donut data
        const feesPaid = collectedFeesVal
        const feesOutstanding = outstandingFeesVal
        const feesOverdue = Math.round(outstandingFeesVal * 0.22)
        const feesTotal = expectedFees
        const feesPaidPct = Math.round((feesPaid / Math.max(feesTotal, 1)) * 100)
        const feesOutPct = Math.round((feesOutstanding / Math.max(feesTotal, 1)) * 100)
        const feesOverduePct = Math.max(0, 100 - feesPaidPct - feesOutPct)

        // Recent Enrollments data
        const recentEnrollments = [
          { name: 'Chinwe Okafor', class: 'JSS 1', date: 'Sep 28, 2025', avatar: '👩🏾' },
          { name: 'Emeka Nwosu', class: 'JSS 1', date: 'Sep 27, 2025', avatar: '👨🏾' },
          { name: 'Amina Yusuf', class: 'JSS 2', date: 'Sep 26, 2025', avatar: '👩🏽' },
          { name: 'Tunde Bello', class: 'JSS 2', date: 'Sep 25, 2025', avatar: '👨🏾' },
          { name: 'Fatima Musa', class: 'JSS 3', date: 'Sep 24, 2025', avatar: '👩🏾' },
        ]

        return (
          <div key="charts_row" className="admin-overview-3col-grid">
            {/* 1. Student Enrollment Trend (faithful reproduction of uploaded image) */}
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                {/* Left: Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    Student Enrollment Trend
                  </h3>
                </div>

                {/* Right: Legend with circular colored markers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Total Students</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1e88e5', display: 'inline-block' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>New Admissions</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG */}
              <div style={{ width: '100%', height: 230, position: 'relative' }}>
                <svg
                  className="admin-chart-canvas"
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  style={{ width: '100%', height: 230, minHeight: 230, display: 'block', overflow: 'visible' }}
                >
                  <defs>
                    {/* Soft green area gradient */}
                    <linearGradient id="enrollTotalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                    </linearGradient>
                    {/* Soft blue area gradient */}
                    <linearGradient id="enrollAdmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e88e5" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#1e88e5" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Clean matrix frame */}
                  <rect
                    x={padL}
                    y={padTop}
                    width={plotW}
                    height={plotH}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    style={{ stroke: '#e2e8f0', strokeWidth: 1, fill: 'none' }}
                  />

                  {/* Horizontal Grid lines and Y-axis labels */}
                  {yGridValues.map(val => {
                    const y = padTop + plotH - (val / yAxisMax) * plotH
                    return (
                      <g key={`ygrid-${val}`}>
                        {val > 0 && val < yAxisMax && (
                          <line
                            x1={padL}
                            y1={y}
                            x2={padL + plotW}
                            y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            style={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                          />
                        )}
                        <text
                          x={padL - 10}
                          y={y + 4}
                          fontSize="11"
                          fill="#64748b"
                          textAnchor="end"
                          fontWeight="600"
                          style={{ stroke: 'none', fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}
                        >
                          {val}
                        </text>
                      </g>
                    )
                  })}

                  {/* Vertical Grid lines and X-axis labels */}
                  {trendMonths.map((m, i) => {
                    const x = padL + (i / (trendMonths.length - 1)) * plotW
                    return (
                      <g key={`xgrid-${m}`}>
                        {i > 0 && i < trendMonths.length - 1 && (
                          <line
                            x1={x}
                            y1={padTop}
                            x2={x}
                            y2={padTop + plotH}
                            stroke="#edf2f7"
                            strokeWidth="1"
                            style={{ stroke: '#edf2f7', strokeWidth: 1 }}
                          />
                        )}
                        <text
                          x={x}
                          y={padTop + plotH + 18}
                          fontSize="11"
                          fill="#64748b"
                          textAnchor="middle"
                          fontWeight="600"
                          style={{ stroke: 'none', fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}
                        >
                          {m}
                        </text>
                      </g>
                    )
                  })}

                  {/* 1. Total Students Gradient Area */}
                  <polygon points={totalAreaPoly} fill="url(#enrollTotalGrad)" style={{ stroke: 'none' }} />

                  {/* 2. New Admissions Gradient Area */}
                  <polygon points={admAreaPoly} fill="url(#enrollAdmGrad)" style={{ stroke: 'none' }} />

                  {/* 3. Total Students Solid Green Line */}
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={totalPolylineStr}
                    style={{ stroke: '#059669', strokeWidth: 2.5, fill: 'none' }}
                  />

                  {/* 4. Total Students Data Points (Green circle with white outline) */}
                  {totalPoints.map((p, i) => (
                    <circle
                      key={`tot-pt-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                    >
                      <title>{`${trendMonths[i]}: ${totalStudentsValues[i]} Total Students`}</title>
                    </circle>
                  ))}

                  {/* 5. New Admissions Solid Blue Line */}
                  <polyline
                    fill="none"
                    stroke="#1e88e5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={admPolylineStr}
                    style={{ stroke: '#1e88e5', strokeWidth: 2.5, fill: 'none' }}
                  />

                  {/* 6. New Admissions Data Points (Blue circle with white outline) */}
                  {admPoints.map((p, i) => (
                    <circle
                      key={`adm-pt-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#1e88e5"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ fill: '#1e88e5', stroke: '#ffffff', strokeWidth: 2 }}
                    >
                      <title>{`${trendMonths[i]}: ${newAdmissionsValues[i]} New Admissions`}</title>
                    </circle>
                  ))}
                </svg>
              </div>
            </div>

            {/* 2. Fees Collection Overview (donut chart matching reference) */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#059669" style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="admin-card-title">Fees Collection Overview</h3>
                    <p className="admin-card-subtitle">Total Fees Collected (This Term)</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#09261d' }}>₦{feesTotal.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>↑ 18% vs. last term</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: '6px 0' }}>
                {/* Donut Container */}
                <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                  <svg
                    className="admin-donut-canvas"
                    width="130"
                    height="130"
                    viewBox="0 0 130 130"
                    style={{ width: 130, height: 130, minWidth: 130, minHeight: 130, display: 'block' }}
                  >
                    <circle cx="65" cy="65" r="48" fill="none" stroke="#f1f5f9" strokeWidth="16" style={{ stroke: '#f1f5f9', strokeWidth: 16, fill: 'none' }} />
                    {/* Paid arc (green) */}
                    <circle cx="65" cy="65" r="48" fill="none" stroke="#10b981" strokeWidth="16"
                      strokeDasharray={`${(feesPaidPct / 100) * 301.6} 301.6`}
                      strokeDashoffset="0" transform="rotate(-90 65 65)" strokeLinecap="round"
                      style={{ stroke: '#10b981', strokeWidth: 16, fill: 'none' }} />
                    {/* Outstanding arc (amber) */}
                    <circle cx="65" cy="65" r="48" fill="none" stroke="#f59e0b" strokeWidth="16"
                      strokeDasharray={`${(feesOutPct / 100) * 301.6} 301.6`}
                      strokeDashoffset={`-${(feesPaidPct / 100) * 301.6}`}
                      transform="rotate(-90 65 65)" strokeLinecap="round"
                      style={{ stroke: '#f59e0b', strokeWidth: 16, fill: 'none' }} />
                    {/* Overdue arc (red) */}
                    <circle cx="65" cy="65" r="48" fill="none" stroke="#ef4444" strokeWidth="16"
                      strokeDasharray={`${(feesOverduePct / 100) * 301.6} 301.6`}
                      strokeDashoffset={`-${((feesPaidPct + feesOutPct) / 100) * 301.6}`}
                      transform="rotate(-90 65 65)" strokeLinecap="round"
                      style={{ stroke: '#ef4444', strokeWidth: 16, fill: 'none' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 130, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#09261d', lineHeight: 1 }}>{feesPaidPct}%</span>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginTop: 4 }}>Collection Rate</span>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 135 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>Paid</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>₦{feesPaid.toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#09261d', marginLeft: 'auto' }}>{feesPaidPct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>Outstanding</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>₦{feesOutstanding.toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#09261d', marginLeft: 'auto' }}>{feesOutPct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>Overdue</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>₦{feesOverdue.toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#09261d', marginLeft: 'auto' }}>{feesOverduePct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Recent Enrollments (table matching reference) */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#059669">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <div>
                    <h3 className="admin-card-title">Recent Enrollments</h3>
                    <p className="admin-card-subtitle">Latest admitted students</p>
                  </div>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Students')}>
                  View All →
                </button>
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr', gap: 4, padding: '6px 8px', background: '#f8fafc', borderRadius: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Student Name</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Class</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date Enrolled</span>
              </div>
              {/* Table rows */}
              {recentEnrollments.map((student, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr', gap: 4, padding: '7px 8px', borderBottom: idx < recentEnrollments.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 16 }}>{student.avatar}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{student.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#475569' }}>{student.class}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{student.date}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'overview_analytics':
        return (
          <div key="overview_analytics" className="admin-overview-3col-grid">
            {/* Card 1: Student Demographics & Gender Distribution */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <h3 className="admin-card-title">Student Demographics</h3>
                    <p className="admin-card-subtitle">Gender distribution across all classes</p>
                  </div>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Students')}>
                  View all →
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 20, padding: '16px 8px', flexWrap: 'wrap' }}>
                {/* Donut Chart SVG */}
                <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                  <svg
                    className="admin-donut-canvas-130"
                    width="130"
                    height="130"
                    viewBox="0 0 130 130"
                    style={{ width: 130, height: 130, minWidth: 130, minHeight: 130, display: 'block' }}
                  >
                    <circle cx="65" cy="65" r="48" fill="none" stroke="#f1f5f9" strokeWidth="18" style={{ stroke: '#f1f5f9', strokeWidth: 18, fill: 'none' }} />
                    {/* Male arc (blue) */}
                    <circle
                      cx="65"
                      cy="65"
                      r="48"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="18"
                      strokeDasharray={`${(malePct / 100) * 301.6} 301.6`}
                      strokeDashoffset="0"
                      transform="rotate(-90 65 65)"
                      strokeLinecap="round"
                      style={{ stroke: '#3b82f6', strokeWidth: 18, fill: 'none' }}
                    />
                    {/* Female arc (pink) */}
                    <circle
                      cx="65"
                      cy="65"
                      r="48"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="18"
                      strokeDasharray={`${(femalePct / 100) * 301.6} 301.6`}
                      strokeDashoffset={`-${(malePct / 100) * 301.6}`}
                      transform="rotate(-90 65 65)"
                      strokeLinecap="round"
                      style={{ stroke: '#ec4899', strokeWidth: 18, fill: 'none' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 130, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{totalGender}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>Students</span>
                  </div>
                </div>

                {/* Legend & Breakdown */}
                <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Male</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{maleStudents}</strong>
                      <span style={{ fontSize: 11, color: '#64748b' }}>({malePct}%)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Female</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{femaleStudents}</strong>
                      <span style={{ fontSize: 11, color: '#64748b' }}>({femalePct}%)</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                    <span>Ratio (M:F): <strong>{(maleStudents / Math.max(femaleStudents, 1)).toFixed(1)} : 1</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Active Cohort</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Academic Performance Summary */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <h3 className="admin-card-title">Academic Performance</h3>
                    <p className="admin-card-subtitle">Term 2 evaluation and class benchmarks</p>
                  </div>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Grades')}>
                  Gradebook →
                </button>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Average</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#09261d', marginTop: 2 }}>76.4%</div>
                    <div style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>↑ +2.1%</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pass Rate</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#10b981', marginTop: 2 }}>92.8%</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Above 50%</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Distinction</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#0284c7', marginTop: 2 }}>34.5%</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Grade A/B</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { class: 'SS 2', avg: 85, color: '#10b981', tag: 'Top Class' },
                    { class: 'SS 1', avg: 81, color: '#10b981' },
                    { class: 'JSS 2', avg: 78, color: '#3b82f6' },
                    { class: 'JSS 1', avg: 74, color: '#3b82f6' },
                    { class: 'JSS 3', avg: 72, color: '#f59e0b' },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                      <span style={{ width: 44, fontWeight: 600, color: '#334155' }}>{row.class}</span>
                      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${row.avg}%`, height: '100%', background: row.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ width: 34, fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>{row.avg}%</span>
                      {row.tag && (
                        <span style={{ fontSize: 9.5, padding: '1px 5px', background: '#ecfdf5', color: '#047857', borderRadius: 4, fontWeight: 700 }}>
                          ★ Top
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Admissions Conversion Funnel */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 className="admin-card-title">Admissions Funnel</h3>
                    <p className="admin-card-subtitle">2026/2027 applicant pipeline</p>
                  </div>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Admissions')}>
                  Pipeline →
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '1. Applications Logged', count: admissionsCount, color: '#3b82f6', width: '100%', sub: 'Total submissions' },
                    { label: '2. Under Review', count: pendingAdmissionsCount, color: '#8b5cf6', width: `${Math.max(Math.round((pendingAdmissionsCount / Math.max(admissionsCount, 1)) * 100), 25)}%`, sub: 'Screening in progress' },
                    { label: '3. Offers Extended', count: approvedAdmissionsCount, color: '#f59e0b', width: `${Math.max(Math.round((approvedAdmissionsCount / Math.max(admissionsCount, 1)) * 100), 18)}%`, sub: 'Awaiting parent acceptance' },
                    { label: '4. Enrolled Students', count: admPipe.enrolled || 4, color: '#10b981', width: `${Math.max(Math.round(((admPipe.enrolled || 4) / Math.max(admissionsCount, 1)) * 100), 15)}%`, sub: 'Fully registered & active' },
                  ].map((step, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{step.label}</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                          <strong style={{ fontSize: 14, color: '#0f172a' }}>{step.count}</strong>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>candidates</span>
                        </div>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: step.width, height: '100%', background: step.color, borderRadius: 3, transition: 'width 0.3s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginTop: 4 }}>
                        <span>{step.sub}</span>
                        <span style={{ fontWeight: 600, color: step.color }}>{step.width}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'events_and_activities':
        return (
          <div key="events_and_activities" className="admin-overview-3col-grid">
            {/* Upcoming Events */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="admin-card-title">Upcoming Events</h3>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Calendar')}>
                  View all →
                </button>
              </div>

              <div className="admin-events-list">
                {upcomingEvents.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="admin-event-row">
                    <div className="admin-event-left">
                      <div className="admin-event-date-box">
                        <span className="month">{ev.date_month}</span>
                        <span className="day">{ev.date_day}</span>
                      </div>
                      <div>
                        <div className="admin-event-title">{ev.title}</div>
                        <div className="admin-event-meta">{ev.time} • {ev.location}</div>
                      </div>
                    </div>
                    <span className={`admin-pill ${ev.badge === 'Important' ? 'pending' : 'active'}`}>
                      {ev.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="admin-card-title">Recent Activity</h3>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('Audit Logs')}>
                  View all →
                </button>
              </div>

              <div className="admin-activity-list">
                {recentActivities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="admin-activity-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigate(act.module || 'Audit Logs')}
                    title={`Open ${act.module || 'Audit Logs'}`}
                  >
                    <div className={`admin-activity-icon ${act.type}`}>
                      {act.type.includes('user') ? '👤' : act.type.includes('fee') ? '💲' : act.type.includes('att') ? '📅' : act.type.includes('tch') ? '👨‍🏫' : '👥'}
                    </div>
                    <div className="admin-activity-body">
                      <div className="admin-activity-title">{act.title}</div>
                      <div className="admin-activity-sub">{act.sub}</div>
                    </div>
                    <div className="admin-activity-time">{act.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="admin-card-title">Alerts & Notifications</h3>
                </div>
                <button className="admin-link-btn" onClick={() => onNavigate('News')}>
                  View all →
                </button>
              </div>

              <div className="admin-alert-list">
                {systemAlerts.slice(0, 5).map((al) => (
                  <div
                    key={al.id}
                    className="admin-alert-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigate(al.module || 'News')}
                    title={`Open ${al.module || 'News'}`}
                  >
                    <div className={`admin-alert-icon ${al.type}`}>
                      {al.type === 'red' ? '⚠' : al.type === 'yellow' ? 'ℹ' : al.type === 'blue' ? 'ℹ' : '✓'}
                    </div>
                    <div className="admin-alert-body">
                      <div className="admin-alert-title">{al.title}</div>
                      <div className="admin-alert-sub">{al.sub}</div>
                    </div>
                    <div className="admin-alert-time">{al.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'system_alerts':
        return null

      case 'quick_actions':
        return (
          <div key="quick_actions" style={{ marginBottom: 24 }}>
            {/* Quick Actions & Need Help */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="admin-card-title">Quick Actions</h3>
                </div>
              </div>

              <div className="admin-quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
                <button className="admin-action-btn" onClick={onOpenAddStudent}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add Student</span>
                </button>

                <button className="admin-action-btn" onClick={onOpenAddTeacher}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add Teacher</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Parents')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add Parent</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Staff')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Add Staff</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Classes')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Create Class</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Attendance')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Record Attendance</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Grades')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Enter Grades</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Fees')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Process Fee Payment</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Admissions')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>New Admission</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('News')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <span>Create Announcement</span>
                </button>

                <button className="admin-action-btn" onClick={() => onNavigate('Reports')}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate Report</span>
                </button>
              </div>

              {/* Need Help Card */}
              <div className="admin-need-help-card" style={{ marginTop: 16 }}>
                <div className="admin-need-help-left">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#047857">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  <div>
                    <div className="admin-need-help-title">Need help?</div>
                    <div className="admin-need-help-sub">View system guides or contact support.</div>
                  </div>
                </div>
                <button className="admin-need-help-btn" onClick={() => onNavigate('Settings')}>
                  Go to Help Center →
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderedWidgets = useMemo(() => {
    let order = [...(portalLayout?.widget_order || [])]
    if (!order.some((w) => w.id === 'overview_analytics')) {
      const cIdx = order.findIndex((w) => w.id === 'charts_row')
      if (cIdx !== -1) {
        order.splice(cIdx + 1, 0, { id: 'overview_analytics', enabled: true })
      } else {
        order.push({ id: 'overview_analytics', enabled: true })
      }
    }
    return order
  }, [portalLayout?.widget_order])

  return (
    <div className="admin-page-content">
      {renderedWidgets.map(renderWidget)}
    </div>
  )
}
