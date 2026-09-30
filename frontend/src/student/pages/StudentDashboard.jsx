import React from 'react'

export function StudentDashboard({
  student,
  courses = [],
  todaySchedule = [],
  upcomingAssignments = [],
  recentGrades = [],
  announcements = [],
  financialData,
  onNavigate,
  onOpenSubmitAssignment,
  onOpenMakePayment,
  onOpenUploadDocument,
  schoolName = 'Riverside College',
  academicYear = '2025/2026',
  semester = '1st Term',
}) {
  return (
    <div className="student-dashboard-page">
      {/* 1. Welcome Banner */}
      <div className="student-banner-card">
        <div className="student-banner-content">
          <div className="student-semester-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {student?.semester || semester} {student?.academicYear || academicYear} &bull; {student?.level || 'Senior Division'}
          </div>
          <h1 className="student-banner-title">
            Good morning, {student?.firstName || 'Student'}!
          </h1>
          <p className="student-banner-desc">
            Welcome back to {schoolName}. Here’s your academic overview and what’s happening with your studies today.
          </p>
        </div>

        {/* Motivational quote widget from reference image */}
        <div className="student-quote-widget">
          <p className="student-quote-text">
            &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
          </p>
          <div className="student-quote-author">&mdash; B.B. King</div>
        </div>
      </div>

      {/* 2. Four KPI Cards */}
      <div className="student-kpi-grid">
        {/* Card 1: Courses */}
        <div className="student-kpi-card" onClick={() => onNavigate('Classes')} style={{ cursor: 'pointer' }}>
          <div className="student-kpi-top">
            <span className="student-kpi-label">Current Courses</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#0f766e' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">{courses.length || 0}</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            <span>&bull;</span> Enrolled this semester ({(courses.length || 0) * 3} Credits)
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="student-kpi-card" onClick={() => onNavigate('Attendance')} style={{ cursor: 'pointer' }}>
          <div className="student-kpi-top">
            <span className="student-kpi-label">Attendance Rate</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">{student?.attendancePercent ? `${student.attendancePercent}%` : '96%'}</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            <span>&bull;</span> Good Academic Standing
          </div>
        </div>

        {/* Card 3: GPA */}
        <div className="student-kpi-card" onClick={() => onNavigate('Grades')} style={{ cursor: 'pointer' }}>
          <div className="student-kpi-top">
            <span className="student-kpi-label">Current GPA</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">{student?.gpa || '3.85'}</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            <span>&bull;</span> Top 10% in Class
          </div>
        </div>

        {/* Card 4: Outstanding Fees */}
        <div className="student-kpi-card" onClick={() => onNavigate('Payments')} style={{ cursor: 'pointer' }}>
          <div className="student-kpi-top">
            <span className="student-kpi-label">Outstanding Fees</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: financialData?.outstanding > 0 ? '#dc2626' : '#059669' }}>
            {financialData?.outstandingFormatted || '$0.00'}
          </div>
          <div className="student-kpi-meta" style={{ color: financialData?.outstanding > 0 ? '#d97706' : '#059669' }}>
            <span>&bull;</span> {financialData?.outstanding > 0 ? 'Payment Due' : 'All Fees Cleared'}
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Dashboard Grid */}
      <div className="student-dashboard-layout">
        {/* Left Column (2fr): Today's Schedule & Assignments & Grades */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Today's Schedule */}
          <div className="student-card">
            <div className="student-card-header">
              <h2 className="student-card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0f766e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Today’s Schedule
              </h2>
              <button
                className="student-btn-ghost-sm"
                onClick={() => onNavigate('Timetable')}
                style={{ color: '#0f766e', borderColor: '#a7f3d0' }}
              >
                View Full Timetable &rarr;
              </button>
            </div>

            <div className="student-schedule-list">
              {todaySchedule.map((item) => (
                <div key={item.id} className="student-schedule-item">
                  <div className="student-schedule-time">{item.time}</div>
                  <div className="student-schedule-info">
                    <div className="student-schedule-title">
                      {item.code}: {item.title}
                    </div>
                    <div className="student-schedule-meta">
                      {item.room} &bull; Lecturer: {item.instructor}
                    </div>
                  </div>
                  <span className={`student-badge student-badge-${item.status === 'Ongoing' ? 'warning' : 'neutral'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments & Recent Grades in a 2-col nested split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Upcoming Assignments */}
            <div className="student-card">
              <div className="student-card-header">
                <h3 className="student-card-title" style={{ fontSize: 15 }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f766e" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Upcoming Assignments
                </h3>
                <button
                  className="student-btn-ghost-sm"
                  onClick={() => onNavigate('Assignments')}
                  style={{ color: '#0f766e' }}
                >
                  All ({upcomingAssignments.length})
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcomingAssignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    style={{
                      padding: '12px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{asg.title}</span>
                      <span
                        className={`student-badge student-badge-${
                          asg.status === 'Submitted' ? 'success' : 'warning'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                      {asg.course} &bull; Due: {asg.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Grades */}
            <div className="student-card">
              <div className="student-card-header">
                <h3 className="student-card-title" style={{ fontSize: 15 }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f766e" strokeWidth="2">
                    <path d="M18 20V10" />
                    <path d="M12 20V4" />
                    <path d="M6 20v-6" />
                  </svg>
                  Recent Grades
                </h3>
                <button
                  className="student-btn-ghost-sm"
                  onClick={() => onNavigate('Grades')}
                  style={{ color: '#0f766e' }}
                >
                  Full Report
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentGrades.slice(0, 3).map((grd) => (
                  <div
                    key={grd.id}
                    style={{
                      padding: '12px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{grd.assessment}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{grd.course}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          fontWeight: 700,
                          fontSize: 13,
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        {grd.grade} ({grd.score}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1fr): Announcements & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Announcements */}
          <div className="student-card">
            <div className="student-card-header">
              <h3 className="student-card-title" style={{ fontSize: 15 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f766e" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                </svg>
                Announcements
              </h3>
              <button
                className="student-btn-ghost-sm"
                onClick={() => onNavigate('Notifications')}
                style={{ color: '#0f766e' }}
              >
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    paddingBottom: 12,
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="student-badge student-badge-info" style={{ fontSize: 10 }}>
                      {ann.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{ann.date}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                    {ann.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                    {ann.snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions (6 Actions) */}
          <div className="student-card">
            <div className="student-card-header">
              <h3 className="student-card-title" style={{ fontSize: 15 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f766e" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Quick Actions
              </h3>
            </div>

            <div className="student-quick-actions-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button className="student-quick-action-btn" onClick={() => onNavigate('Classes')}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                </svg>
                <span className="student-qa-label">View Classes</span>
              </button>

              <button className="student-quick-action-btn" onClick={onOpenSubmitAssignment}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="student-qa-label">Submit Assignment</span>
              </button>

              <button className="student-quick-action-btn" onClick={() => onNavigate('Grades')}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
                <span className="student-qa-label">Check Grades</span>
              </button>

              <button className="student-quick-action-btn" onClick={() => onNavigate('Timetable')}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                </svg>
                <span className="student-qa-label">View Timetable</span>
              </button>

              <button className="student-quick-action-btn" onClick={onOpenMakePayment}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span className="student-qa-label">Make Payment</span>
              </button>

              <button className="student-quick-action-btn" onClick={onOpenUploadDocument}>
                <svg className="student-qa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="student-qa-label">Upload Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentDashboard
