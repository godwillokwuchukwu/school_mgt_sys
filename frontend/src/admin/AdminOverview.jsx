import React from 'react'

export function AdminOverview({
  kpis,
  enrollmentByClass,
  attendanceTrend,
  events,
  activities,
  alerts,
  onNavigate,
  onOpenAddStudent,
  onOpenAddTeacher,
}) {
  const studentsCount = kpis?.students?.count ?? 13
  const teachersCount = kpis?.teachers?.count ?? 12
  const parentsCount = kpis?.parents?.count ?? 7
  const classesCount = kpis?.classes?.count ?? 13
  const attendanceRate = kpis?.attendance?.rate || '94.3%'
  const feesCollected = kpis?.fees_collected?.formatted || '₦1,050,000'
  const admissionsCount = kpis?.admissions?.count ?? 9

  const enrollmentData =
    enrollmentByClass && enrollmentByClass.length > 0
      ? enrollmentByClass
      : [
          { level: 'JSS 1', count: 2 },
          { level: 'JSS 2', count: 2 },
          { level: 'JSS 3', count: 2 },
          { level: 'SS 1', count: 2 },
          { level: 'SS 2', count: 2 },
          { level: 'SS 3', count: 1 },
        ]

  const trendData =
    attendanceTrend && attendanceTrend.length > 0
      ? attendanceTrend
      : [
          { day: 'Sep 10', rate: 100 },
          { day: 'Sep 11', rate: 100 },
          { day: 'Sep 12', rate: 100 },
          { day: 'Sep 13', rate: 100 },
          { day: 'Sep 14', rate: 100 },
          { day: 'Sep 15', rate: 80 },
          { day: 'Sep 16', rate: 80 },
        ]

  // Dynamic SVG points for attendance trend line chart
  const chartPoints = trendData.map((item, idx) => {
    const x = 70 + idx * 64
    const clampedRate = Math.min(Math.max(item.rate, 60), 100)
    const y = 160 - ((clampedRate - 60) / 40) * 140
    return { x, y, day: item.day, rate: item.rate }
  })
  const polylinePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(' ')
  const polygonPoints = `${polylinePoints} ${chartPoints[chartPoints.length - 1]?.x || 454},160 ${chartPoints[0]?.x || 70},160`
  const maxEnrollment = Math.max(...enrollmentData.map((d) => d.count), 3)

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
          { id: 1, type: 'user-green', title: 'New student admitted', sub: 'Chinedu Okafor (JSS 1)', time: '2 hours ago' },
          { id: 2, type: 'fee-green', title: 'Fee payment received', sub: 'Adaeze Eze (SS 2) – ₦45,000', time: '3 hours ago' },
          { id: 3, type: 'att-blue', title: 'Attendance updated', sub: 'JSS 3A – 94.3% present', time: '4 hours ago' },
          { id: 4, type: 'tch-purple', title: 'New teacher added', sub: 'Mr. James Okafor (Mathematics)', time: '5 hours ago' },
          { id: 5, type: 'par-pink', title: 'Parent registered', sub: 'Mrs. Ngozi Chukwuma', time: '6 hours ago' },
        ]

  const systemAlerts =
    alerts && alerts.length > 0
      ? alerts
      : [
          { id: 1, type: 'red', title: 'Low attendance in JSS 2B', sub: '78% attendance rate (below 85%)', time: '1 hour ago' },
          { id: 2, type: 'yellow', title: 'Fee payment pending', sub: '5 students have outstanding term fees', time: '3 hours ago' },
          { id: 3, type: 'blue', title: 'New admission applications', sub: '9 applications currently logged in database', time: '4 hours ago' },
          { id: 4, type: 'green', title: 'System backup completed', sub: 'All PostgreSQL tables backed up successfully', time: '6 hours ago' },
        ]

  return (
    <div className="admin-page-content">
      {/* 1. Page Header Banner */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-header-tag">ADMIN OVERVIEW</div>
          <h1 className="admin-page-title">Good afternoon, Admin 👋</h1>
          <p className="admin-page-subtitle">
            Here's what's happening at Riverside Academy today. Stay informed and keep everything running smoothly.
          </p>
        </div>
        <div>
          <div className="admin-date-badge">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#475569">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Mon, 16 Sep 2025</span>
          </div>
          <div className="admin-academic-year-sub">Academic Year 2025/2026</div>
        </div>
      </div>

      {/* 2. 7 KPI Cards in One Row (media_1789920743391.png) */}
      <div className="admin-7kpi-grid">
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
        </div>

        {/* Card 2: Teachers */}
        <div className="admin-kpi-box" onClick={() => onNavigate('Teachers')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Teachers</span>
          </div>
          <div className="admin-kpi-number">{teachersCount}</div>
          <div className="admin-kpi-trend up">
            <span>↑ 6%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last month</span>
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
        </div>
      </div>

      {/* 3. Row 2: Attendance Trend, Enrollment by Class, Upcoming Events */}
      <div className="admin-charts-grid-row2">
        {/* Attendance Trend Area Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="admin-card-title">Attendance Trend</h3>
                <p className="admin-card-subtitle">Overall attendance rate for the last 7 days</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>{attendanceRate}</span>
              <span className="admin-pill active" style={{ fontSize: 10, padding: '2px 6px' }}>Latest</span>
            </div>
          </div>

          <div className="admin-attendance-chart-wrap">
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="24" fontSize="10" fill="#94a3b8">100%</text>

              <line x1="40" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="59" fontSize="10" fill="#94a3b8">90%</text>

              <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="94" fontSize="10" fill="#94a3b8">80%</text>

              <line x1="40" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="129" fontSize="10" fill="#94a3b8">70%</text>

              <line x1="40" y1="160" x2="480" y2="160" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="164" fontSize="10" fill="#94a3b8">60%</text>

              {/* Area & Line */}
              <polygon
                points={polygonPoints}
                fill="url(#attGrad)"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
              {/* Data points */}
              {chartPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5">
                  <title>{`${p.day}: ${p.rate}%`}</title>
                </circle>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 30px', fontSize: 10.5, color: '#94a3b8', marginTop: 4 }}>
              {chartPoints.map((p, i) => (
                <span key={i}>{p.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment by Class Vertical Bar Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="admin-card-title">Enrollment by Class</h3>
                <p className="admin-card-subtitle">Total students per class</p>
              </div>
            </div>
          </div>

          <div className="admin-vertical-bars-container">
            {enrollmentData.map((item, idx) => {
              const barHeightPct = Math.max(Math.round((item.count / maxEnrollment) * 85), 18)
              return (
                <div key={idx} className="admin-bar-col">
                  <span className="admin-bar-num">{item.count}</span>
                  <div className="admin-bar-fill" style={{ height: `${barHeightPct}%` }} />
                  <span className="admin-bar-label">{item.level}</span>
                </div>
              )
            })}
          </div>
        </div>

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
            {upcomingEvents.map((ev) => (
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
      </div>

      {/* 4. Row 3: Recent Activity, Alerts & Notifications, Quick Actions */}
      <div className="admin-feed-grid-row3">
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
            {recentActivities.map((act) => (
              <div key={act.id} className="admin-activity-item">
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
            {systemAlerts.map((al) => (
              <div key={al.id} className="admin-alert-item">
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

          <div className="admin-quick-actions-grid">
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

            <button className="admin-action-btn" onClick={() => onNavigate('Attendance')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Record Attendance</span>
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
          </div>

          {/* Need Help Card */}
          <div className="admin-need-help-card">
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
    </div>
  )
}
