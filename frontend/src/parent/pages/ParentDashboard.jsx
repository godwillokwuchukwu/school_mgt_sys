import React, { useState } from 'react'

export default function ParentDashboard({
  parentProfile,
  children = [],
  selectedChild,
  onSelectChild,
  onNavigate,
  onOpenAddChild,
  onOpenPayment,
  onOpenMessage,
  upcomingEvents = [],
  latestNotices = [],
  recentMessages = [],
}) {
  const [progTab, setProgTab] = useState('All')
  const [attTab, setAttTab] = useState(selectedChild?.id || (children[0]?.id ?? ''))

  // Calculate aggregates
  const avgGpa = children.length
    ? (children.reduce((acc, c) => acc + (c.gpa || 0), 0) / children.length).toFixed(2)
    : '0.00'

  const overallAtt = children.length
    ? Math.round(children.reduce((acc, c) => acc + (c.attendanceRate || 0), 0) / children.length)
    : 0

  const totalDue = children.reduce((acc, c) => acc + (c.feesDue || 0), 0)

  const unreadCount = recentMessages.filter((m) => m.unread > 0).length

  const attTargetChild = children.find((c) => c.id === attTab) || selectedChild || children[0]

  return (
    <div className="parent-dashboard-page">
      {/* 1. Hero Section & Quote Banner */}
      <section className="parent-hero-section">
        <div className="parent-welcome-heading">
          <h1>Welcome back, {parentProfile?.displayName || parentProfile?.fullName || 'Mrs. Johnson'}!</h1>
          <p>
            Here’s what’s happening with your children today. (<strong>{children.length} {children.length === 1 ? 'Child' : 'Children'} Enrolled</strong>)
          </p>
        </div>

        <div className="parent-quote-card">
          <div className="parent-quote-icon">“</div>
          <div className="parent-quote-body">
            <p className="parent-quote-text">
              Education is the most powerful weapon which you can use to change the world.
            </p>
            <span className="parent-quote-author">— Nelson Mandela</span>
          </div>
        </div>

        <div className="parent-banner-graphic">
          <div className="parent-graphic-badge">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Excellence in Learning</span>
          </div>
        </div>
      </section>

      {/* 2. Children Quick Selector Cards Row */}
      <div className="parent-children-row">
        {children.map((child) => {
          const isSelected = selectedChild?.id === child.id
          return (
            <div
              key={child.id}
              className={`parent-child-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectChild(child.id)}
              role="button"
              tabIndex={0}
            >
              <div className="parent-child-card-left">
                <img
                  src={child.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt={child.name}
                  className="parent-child-avatar"
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{child.name}</strong>
                    <span className="parent-status-badge active">{child.status || 'Active'}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{child.grade}</div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8' }}>ID: {child.studentId}</div>
                </div>
              </div>

              <div className="parent-child-quick-stats">
                <div className="parent-cstat">
                  <span>GPA</span>
                  <strong>{child.gpa?.toFixed(2)}</strong>
                </div>
                <div className="parent-cstat">
                  <span>Att</span>
                  <strong>{child.attendanceRate}%</strong>
                </div>
                <div className="parent-cstat">
                  <span>Score</span>
                  <strong>{child.averageScore}%</strong>
                </div>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          className="parent-child-add-card"
          onClick={onOpenAddChild}
          title="Connect another child"
        >
          <div className="parent-child-add-icon">+</div>
          <span>Link Another Child</span>
        </button>
      </div>

      {/* 3. 4-KPI Overview Row */}
      <div className="parent-kpi-grid">
        {/* KPI 1: Average GPA */}
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Average GPA</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{avgGpa}</span>
            <span className="parent-kpi-trend up">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              +0.15
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="parent-kpi-sub">vs last semester</span>
            <span className="parent-kpi-link" onClick={() => onNavigate('Grades')}>
              View Detailed Grades &rarr;
            </span>
          </div>
        </div>

        {/* KPI 2: Overall Attendance */}
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Overall Attendance</span>
            <div className="parent-kpi-icon-wrap blue">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{overallAtt}%</span>
            <span className="parent-kpi-sub" style={{ marginLeft: 4 }}>
              (37 Present | 3 Absent)
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="parent-kpi-sub">Current Academic Term</span>
            <span className="parent-kpi-link" onClick={() => onNavigate('Attendance')}>
              View Full Attendance &rarr;
            </span>
          </div>
        </div>

        {/* KPI 3: Pending Fees */}
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Pending Fees</span>
            <div className="parent-kpi-icon-wrap coral">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">${totalDue.toLocaleString()}</span>
            <span className="parent-kpi-badge due" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
              Due in 15 days
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="parent-kpi-sub">Term 3 Invoices</span>
            <span className="parent-kpi-link" onClick={onOpenPayment}>
              Pay Fees Now &rarr;
            </span>
          </div>
        </div>

        {/* KPI 4: Unread Messages */}
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Unread Messages</span>
            <div className="parent-kpi-icon-wrap purple">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{unreadCount}</span>
            <span className="parent-kpi-sub" style={{ marginLeft: 4 }}>
              New teacher notes
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="parent-kpi-sub">Faculty communications</span>
            <span className="parent-kpi-link" onClick={() => onNavigate('Messages')}>
              Open Messages &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* 4. 3-Column Dashboard Matrix */}
      <div className="parent-dashboard-matrix">
        {/* ================= COLUMN 1 ================= */}
        <div className="parent-col-stack">
          {/* Academic Progress */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
                <div>
                  <div className="parent-panel-title">Academic Progress</div>
                  <span className="parent-panel-subtitle">Term 3 Subject Performance</span>
                </div>
              </div>
              <span className="parent-panel-link" onClick={() => onNavigate('Progress')}>
                Full Report &rarr;
              </span>
            </div>

            <div className="parent-subtabs">
              <button
                type="button"
                className={`parent-subtab-btn ${progTab === 'All' ? 'active' : ''}`}
                onClick={() => setProgTab('All')}
              >
                All Children
              </button>
              {children.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`parent-subtab-btn ${progTab === c.id ? 'active' : ''}`}
                  onClick={() => setProgTab(c.id)}
                >
                  {c.firstName}
                </button>
              ))}
            </div>

            {progTab === 'All' ? (
              <div className="parent-prog-list">
                {children.map((child) => (
                  <div key={child.id} className="parent-prog-child" onClick={() => onSelectChild(child.id)}>
                    <div className="parent-prog-child-left">
                      <img src={child.avatar} alt={child.name} className="parent-prog-child-avatar" />
                      <div>
                        <div className="parent-prog-child-name">{child.name}</div>
                        <div className="parent-prog-child-grade">{child.grade}</div>
                      </div>
                    </div>
                    <div className="parent-prog-child-stats">
                      <div className="parent-prog-stat-block">
                        <div className="parent-prog-stat-label">GPA</div>
                        <div className="parent-prog-stat-val">{child.gpa?.toFixed(2)}</div>
                      </div>
                      <div className="parent-prog-stat-block">
                        <div className="parent-prog-stat-label">Avg Score</div>
                        <div className="parent-prog-stat-val">{child.averageScore}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="parent-subject-progress-stack">
                {(() => {
                  const target = children.find((c) => c.id === progTab) || selectedChild
                  return (target?.subjects || []).slice(0, 5).map((s) => (
                    <div key={s.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{s.name}</span>
                        <span style={{ fontWeight: 700, color: '#09261d' }}>
                          {s.score}% <span style={{ color: '#059669', marginLeft: 4 }}>({s.grade})</span>
                        </span>
                      </div>
                      <div style={{ height: 7, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${s.score}%`,
                            height: '100%',
                            background: s.score >= 90 ? '#10b981' : s.score >= 80 ? '#3b82f6' : '#f59e0b',
                            borderRadius: 9999,
                          }}
                        />
                      </div>
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>

          {/* Recent Grades */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                </svg>
                <div>
                  <div className="parent-panel-title">Recent Grades</div>
                  <span className="parent-panel-subtitle">Latest graded assessments</span>
                </div>
              </div>
              <span className="parent-panel-link" onClick={() => onNavigate('Grades')}>
                All Grades &rarr;
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: 11.5 }}>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>SUBJECT</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>STUDENT</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600 }}>SCORE</th>
                    <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>GRADE</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedChild?.subjects || []).slice(0, 4).map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 6px', fontWeight: 600, color: '#1e293b' }}>{sub.name}</td>
                      <td style={{ padding: '10px 6px', color: '#64748b' }}>{selectedChild.firstName}</td>
                      <td style={{ padding: '10px 6px', fontWeight: 700, color: '#09261d' }}>{sub.score}%</td>
                      <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background: sub.grade.startsWith('A') ? '#ecfdf5' : '#eff6ff',
                            color: sub.grade.startsWith('A') ? '#047857' : '#1d4ed8',
                          }}
                        >
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="parent-col-stack">
          {/* Attendance Overview */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <div>
                  <div className="parent-panel-title">Attendance Overview</div>
                  <span className="parent-panel-subtitle">Current Month Tracking</span>
                </div>
              </div>
              <span className="parent-panel-link" onClick={() => onNavigate('Attendance')}>
                Log &rarr;
              </span>
            </div>

            <div className="parent-subtabs">
              {children.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`parent-subtab-btn ${attTab === c.id ? 'active' : ''}`}
                  onClick={() => setAttTab(c.id)}
                >
                  {c.firstName}
                </button>
              ))}
            </div>

            <div className="parent-att-card" style={{ padding: '16px 12px' }}>
              <div className="parent-gauge-wrap">
                <svg viewBox="0 0 36 36" width="80" height="80">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={`${attTargetChild?.attendanceRate || 93}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#09261d' }}>
                    {attTargetChild?.attendanceRate || 93}%
                  </div>
                </div>
              </div>

              <span className="parent-att-status-badge">Excellent Regular Attendance</span>

              <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#64748b' }}>Present: </span>
                  <strong style={{ color: '#059669' }}>{attTargetChild?.daysPresent || 18}d</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Absent: </span>
                  <strong style={{ color: '#dc2626' }}>{attTargetChild?.daysAbsent || 2}d</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Late: </span>
                  <strong style={{ color: '#d97706' }}>{attTargetChild?.daysLate || 0}d</strong>
                </div>
              </div>

              {/* Weekly Mini Bars */}
              <div style={{ marginTop: 16, width: '100%' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>PAST 5 DAYS ATTENDANCE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, height: 36, alignItems: 'flex-end' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
                    const heightVal = [32, 34, 30, 36, 32][idx]
                    return (
                      <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: '100%', height: heightVal, background: '#10b981', borderRadius: 3, opacity: 0.85 }} />
                        <span style={{ fontSize: 10, color: '#64748b' }}>{day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div>
                  <div className="parent-panel-title">Recent Messages</div>
                  <span className="parent-panel-subtitle">Direct communications</span>
                </div>
              </div>
              <button
                type="button"
                className="parent-btn-primary"
                style={{ padding: '4px 10px', fontSize: 11.5 }}
                onClick={onOpenMessage}
              >
                + New
              </button>
            </div>

            <div className="parent-msg-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentMessages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: msg.unread ? '#f0fdf4' : '#f8fafc',
                    border: msg.unread ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 10,
                  }}
                  onClick={() => onNavigate('Messages')}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 12.5, color: '#0f172a' }}>{msg.sender}</strong>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{msg.time}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.snippet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="parent-col-stack">
          {/* Upcoming Events */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <div>
                  <div className="parent-panel-title">Upcoming Events</div>
                  <span className="parent-panel-subtitle">School Academic Calendar</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: '#09261d',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', color: '#10b981' }}>{ev.month}</span>
                    <strong style={{ fontSize: 15, lineHeight: 1 }}>{ev.day}</strong>
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>{ev.title}</strong>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Notices */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <div>
                  <div className="parent-panel-title">Latest Notices</div>
                  <span className="parent-panel-subtitle">Official Announcements</span>
                </div>
              </div>
              <span className="parent-panel-link" onClick={() => onNavigate('Notices')}>
                All &rarr;
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {latestNotices.slice(0, 3).map((not) => (
                <div
                  key={not.id}
                  style={{ padding: '8px 10px', borderRadius: 6, background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer' }}
                  onClick={() => onNavigate('Notices')}
                >
                  <strong style={{ fontSize: 12.5, color: '#1e293b', display: 'block' }}>{not.title}</strong>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{not.date} &bull; {not.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions (2x3 Grid) */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <div className="parent-panel-title">Quick Actions</div>
              </div>
            </div>

            <div className="parent-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="parent-action-btn" onClick={onOpenPayment}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Pay Fees</div>
                  <div>Direct Bursary</div>
                </div>
              </div>

              <div className="parent-action-btn" onClick={onOpenMessage}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Message</div>
                  <div>Contact Faculty</div>
                </div>
              </div>

              <div className="parent-action-btn" onClick={() => onNavigate('Grades')}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Report Cards</div>
                  <div>Term Results</div>
                </div>
              </div>

              <div className="parent-action-btn" onClick={() => onNavigate('Timetable')}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Timetable</div>
                  <div>Class Schedule</div>
                </div>
              </div>

              <div className="parent-action-btn" onClick={() => onNavigate('Attendance')}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 12 2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Attendance</div>
                  <div>Absence Log</div>
                </div>
              </div>

              <div className="parent-action-btn" onClick={onOpenAddChild}>
                <div className="parent-action-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                </div>
                <div className="parent-action-texts">
                  <div>Link Child</div>
                  <div>Add Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
