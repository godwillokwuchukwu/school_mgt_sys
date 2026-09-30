import React from 'react'

export function StudentAttendance({
  attendanceRecords = [],
  student,
  minAttendance = 85,
  settings = null,
}) {
  const effectiveMin = settings?.academic_form?.minAttendance ?? minAttendance
  const currentTerm = settings?.academic_form?.currentTerm || student?.semester || 'First Semester'
  const currentSession = settings?.academic_form?.currentSession || student?.academicYear || '2025/2026'

  const rawPercent = student?.attendancePercent !== undefined ? student.attendancePercent : 96
  const overallRate = `${rawPercent}%`
  const sessionsCount = attendanceRecords.length > 0 ? attendanceRecords.length : 46
  const isEligible = rawPercent >= effectiveMin

  const courseAttendance = [
    { code: 'CRS-101', title: 'Calculus & Analytics', attended: 19, total: 20, rate: 95, status: 95 >= effectiveMin ? 'Eligible' : 'Warning' },
    { code: 'CRS-102', title: 'University Physics', attended: 9, total: 10, rate: 90, status: 90 >= effectiveMin ? 'Eligible' : 'Warning' },
    { code: 'CRS-103', title: 'Organic Chemistry', attended: 8, total: 8, rate: 100, status: 'Eligible' },
    { code: 'CRS-104', title: 'Computer Science', attended: 11, total: 12, rate: 92, status: 92 >= effectiveMin ? 'Eligible' : 'Warning' },
  ]

  const recentLogs = attendanceRecords.length > 0
    ? attendanceRecords.map((a, i) => ({
        id: a.id || i + 1,
        date: a.date || '2026-09-28',
        course: a.class_name || a.subject_name || `Course #${i + 1}`,
        session: 'Lecture',
        status: (a.status || 'present').charAt(0).toUpperCase() + (a.status || 'present').slice(1).toLowerCase(),
      }))
    : [
        { id: 1, date: 'Sep 28, 2026', course: 'Advanced Calculus', session: 'Lecture', status: 'Present' },
        { id: 2, date: 'Sep 27, 2026', course: 'University Physics', session: 'Lab Session', status: 'Present' },
        { id: 3, date: 'Sep 26, 2026', course: 'Organic Chemistry', session: 'Lecture', status: 'Present' },
      ]

  return (
    <div className="student-attendance-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Attendance Tracking</h1>
          <p className="student-page-subtitle">
            {currentTerm} {currentSession} &bull; Mandatory {effectiveMin}% Examination Attendance Threshold
          </p>
        </div>
        <div className="student-page-actions">
          <span className={`student-badge student-badge-${isEligible ? 'success' : 'warning'}`} style={{ padding: '6px 12px', fontSize: 13 }}>
            {isEligible ? `Exam Eligible (${overallRate} Overall)` : `Attendance Warning (${overallRate})`}
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="student-kpi-grid">
        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Overall Attendance</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#0f766e' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: '#0f766e' }}>{overallRate}</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            Good Academic Standing
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Sessions Recorded</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">{sessionsCount} Sessions</div>
          <div className="student-kpi-meta" style={{ color: '#64748b' }}>
            Total 50 lecture & lab hours
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Missed Classes</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: '#dc2626' }}>4 Classes</div>
          <div className="student-kpi-meta" style={{ color: '#64748b' }}>
            2 Excused / 2 Unexcused
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Clearance Status</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: '#059669', fontSize: 20 }}>Fully Cleared</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            No penalties recorded
          </div>
        </div>
      </div>

      {/* Course Breakdown */}
      <div className="student-card" style={{ marginBottom: 24 }}>
        <div className="student-card-header">
          <h3 className="student-card-title">
            Attendance Rate by Course
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {courseAttendance.map((item) => (
            <div key={item.code}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.code}: {item.title}</span>
                  <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                    ({item.attended}/{item.total} sessions)
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: item.rate >= 90 ? '#0f766e' : '#d97706' }}>
                  {item.rate}%
                </div>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 999 }}>
                <div
                  style={{
                    width: `${item.rate}%`,
                    height: '100%',
                    backgroundColor: item.rate >= 90 ? '#0f766e' : '#d97706',
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance Logs Table */}
      <div className="student-card">
        <div className="student-card-header">
          <h3 className="student-card-title">
            Recent Attendance Roll Call Logs
          </h3>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Session Type</th>
                <th>Verification Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 500 }}>{log.date}</td>
                  <td><span style={{ fontWeight: 700, color: '#0f766e' }}>{log.course}</span></td>
                  <td>{log.session}</td>
                  <td style={{ color: '#64748b' }}>Biometric QR Scanner</td>
                  <td>
                    <span className={`student-badge student-badge-${log.status === 'Present' ? 'success' : 'danger'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default StudentAttendance
