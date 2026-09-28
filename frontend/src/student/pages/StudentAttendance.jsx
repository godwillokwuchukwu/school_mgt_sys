import React from 'react'

export function StudentAttendance({ attendanceRecords = [] }) {
  const courseAttendance = [
    { code: 'CS101', title: 'Intro to Computer Science', attended: 19, total: 20, rate: 95, status: 'Eligible' },
    { code: 'MAT201', title: 'Calculus II', attended: 9, total: 10, rate: 90, status: 'Eligible' },
    { code: 'ENG102', title: 'Technical Communication', attended: 8, total: 8, rate: 100, status: 'Eligible' },
    { code: 'PHY101', title: 'Physics for Engineers', attended: 11, total: 13, rate: 85, status: 'Eligible' },
    { code: 'CS201', title: 'Data Structures & Algorithms', attended: 11, total: 12, rate: 92, status: 'Eligible' },
  ]

  const recentLogs = [
    { id: 1, date: 'Sep 22, 2025', course: 'CS101', session: 'Lecture', status: 'Present' },
    { id: 2, date: 'Sep 21, 2025', course: 'MAT201', session: 'Tutorial', status: 'Present' },
    { id: 3, date: 'Sep 19, 2025', course: 'PHY101', session: 'Practical Lab', status: 'Absent' },
    { id: 4, date: 'Sep 18, 2025', course: 'CS201', session: 'Lab Session', status: 'Present' },
    { id: 5, date: 'Sep 16, 2025', course: 'ENG102', session: 'Seminar', status: 'Present' },
  ]

  return (
    <div className="student-attendance-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Attendance Tracking</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 &bull; Mandatory 75% Examination Attendance Threshold
          </p>
        </div>
        <div className="student-page-actions">
          <span className="student-badge student-badge-success" style={{ padding: '6px 12px', fontSize: 13 }}>
            Exam Eligible (92% Overall)
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
          <div className="student-kpi-val" style={{ color: '#0f766e' }}>92.0%</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            +17% above 75% threshold
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Sessions Attended</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">46 Sessions</div>
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
