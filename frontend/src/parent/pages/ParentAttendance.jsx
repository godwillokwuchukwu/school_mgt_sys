import React, { useState } from 'react'

export default function ParentAttendance({
  children = [],
  selectedChild,
  onSelectChild,
  onOpenNote,
}) {
  const child = selectedChild || children[0]
  const [selectedMonth, setSelectedMonth] = useState('September 2025')
  if (!child) return null

  // Calendar matrix calculation for September 2025 (Starts on Monday, 30 days)
  // September 1, 2025 was a Monday.
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1)
  const absentDays = child.id === 'child-1' ? [10, 18] : [12]

  return (
    <div className="parent-attendance-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Attendance & Punctuality</h1>
          <p className="parent-page-subtitle">
            Daily attendance records, arrival logs, and absence monitoring for <strong>{child.name}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="parent-child-dropdown-select"
            value={child.id}
            onChange={(e) => onSelectChild(e.target.value)}
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="parent-btn-primary"
            onClick={onOpenNote}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Submit Excuse Note
          </button>
        </div>
      </div>

      {/* 4 Attendance Metrics */}
      <div className="parent-kpi-grid">
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Attendance Rate</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{child.attendanceRate}%</span>
            <span className="parent-kpi-trend up" style={{ color: '#10b981' }}>Good</span>
          </div>
          <span className="parent-kpi-sub">Requirement: 85%+</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Days Present</span>
            <div className="parent-kpi-icon-wrap blue">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{child.daysPresent}</span>
            <span className="parent-kpi-sub" style={{ marginLeft: 4 }}>Days</span>
          </div>
          <span className="parent-kpi-sub">Total school sessions: 20</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Days Absent</span>
            <div className="parent-kpi-icon-wrap coral">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val" style={{ color: child.daysAbsent > 0 ? '#dc2626' : '#059669' }}>
              {child.daysAbsent}
            </span>
            <span className="parent-kpi-sub" style={{ marginLeft: 4 }}>Days</span>
          </div>
          <span className="parent-kpi-sub">All medical excused</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Late Arrivals</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{child.daysLate || 0}</span>
            <span className="parent-kpi-sub" style={{ marginLeft: 4 }}>Times</span>
          </div>
          <span className="parent-kpi-sub">Perfect punctuality record</span>
        </div>
      </div>

      {/* Main Grid: Calendar View & Attendance Log Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, marginBottom: 24 }}>
        {/* Calendar Matrix Card */}
        <div className="parent-calendar-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <strong style={{ fontSize: 15, color: '#09261d' }}>{selectedMonth}</strong>
            <span style={{ fontSize: 12, color: '#64748b' }}>Term 3 Tracking</span>
          </div>

          <div className="parent-calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="parent-calendar-day-header">
                {d}
              </div>
            ))}

            {daysInMonth.map((dayNum) => {
              // Day 1 was Monday, so day 1 maps to column 1
              const dayOfWeek = (dayNum - 1) % 7 // 0=Mon, 4=Fri, 5=Sat, 6=Sun
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
              const isAbsent = absentDays.includes(dayNum)
              const isPastSchoolDay = !isWeekend && dayNum <= 22

              return (
                <div
                  key={dayNum}
                  className={`parent-calendar-cell ${isPastSchoolDay ? 'has-event' : ''}`}
                  style={{
                    opacity: isWeekend ? 0.35 : 1,
                    background: isAbsent ? '#fef2f2' : isPastSchoolDay ? '#f0fdf4' : '#f8fafc',
                  }}
                >
                  <span>{dayNum}</span>
                  {isPastSchoolDay && (
                    <div
                      className={`parent-cell-dot ${isAbsent ? 'absent' : 'present'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18, fontSize: 11.5, color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span>Present</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
              <span>Absent (Excused)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              <span>Late Arrival</span>
            </div>
          </div>
        </div>

        {/* Detailed Attendance Log Table */}
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
                <div className="parent-panel-title">Detailed Attendance Log</div>
                <span className="parent-panel-subtitle">Official daily check-in logs</span>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: 11.5 }}>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>DATE</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>ARRIVAL TIME</th>
                  <th style={{ padding: '10px 8px', fontWeight: 600 }}>REMARKS / NOTES</th>
                </tr>
              </thead>
              <tbody>
                {(child.attendanceRecords || []).map((rec, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600, color: '#1e293b' }}>{rec.date}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: rec.status === 'Present' ? '#ecfdf5' : '#fee2e2',
                          color: rec.status === 'Present' ? '#047857' : '#b91c1c',
                        }}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#475569' }}>
                      {rec.status === 'Present' ? '07:48 AM' : '—'}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#64748b', fontSize: 12.5 }}>
                      {rec.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
