import React from 'react'

export function StudentGrades({ courses = [], student }) {
  const gradesList = [
    { code: 'CS101', title: 'Introduction to Computer Science', credits: 3, grade: 'A', score: 88, points: 15.0, status: 'Passed' },
    { code: 'MAT201', title: 'Calculus II', credits: 4, grade: 'A', score: 92, points: 20.0, status: 'Passed' },
    { code: 'ENG102', title: 'Technical Communication', credits: 2, grade: 'B+', score: 85, points: 8.0, status: 'Passed' },
    { code: 'PHY101', title: 'Physics for Engineers', credits: 4, grade: 'A-', score: 82, points: 18.0, status: 'Passed' },
    { code: 'CS201', title: 'Data Structures & Algorithms', credits: 4, grade: 'A', score: 90, points: 20.0, status: 'Passed' },
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="student-grades-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Academic Grades & Performance</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 &bull; Cumulative Grade Point Average (CGPA)
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-secondary" onClick={handlePrint}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Statement of Results
          </button>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="student-kpi-grid" style={{ marginBottom: 24 }}>
        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Current Semester GPA</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#0f766e' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: '#0f766e' }}>{student?.gpa || '3.62'}</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            Out of 4.00 (First Class Standing)
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Total Credits Completed</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">17 Units</div>
          <div className="student-kpi-meta" style={{ color: '#64748b' }}>
            5 Registered Courses
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Average Score</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">87.4%</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            Exceeds departmental mean (74%)
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Academic Standing</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ fontSize: 20, color: '#059669' }}>Honours List</div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            Dean's Honours Roll Award
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="student-card" style={{ marginBottom: 24 }}>
        <div className="student-card-header">
          <h3 className="student-card-title">
            First Semester Official Course Grades
          </h3>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credit Units</th>
                <th>Final Score</th>
                <th>Letter Grade</th>
                <th>Grade Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {gradesList.map((g) => (
                <tr key={g.code}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f766e' }}>{g.code}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{g.title}</td>
                  <td>{g.credits} Units</td>
                  <td style={{ fontWeight: 700 }}>{g.score}%</td>
                  <td>
                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      {g.grade}
                    </span>
                  </td>
                  <td>{g.points.toFixed(1)}</td>
                  <td>
                    <span className="student-badge student-badge-success">{g.status}</span>
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
export default StudentGrades
