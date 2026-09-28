import React from 'react'

export function StudentExams({ exams = [], showToast }) {
  const examTimetable = [
    { code: 'CS101', title: 'Intro to Computer Science', date: 'Nov 10, 2025', time: '09:00 AM - 12:00 PM', hall: 'CBT Complex A', seat: 'Seat A-42', invigilator: 'Dr. Adeyemi' },
    { code: 'MAT201', title: 'Calculus II', date: 'Nov 12, 2025', time: '01:00 PM - 04:00 PM', hall: 'Main Auditorium', seat: 'Seat AUD-118', invigilator: 'Prof. Balogun' },
    { code: 'ENG102', title: 'Technical Communication', date: 'Nov 15, 2025', time: '09:00 AM - 11:00 AM', hall: 'New Exam Hall', seat: 'Seat NEH-89', invigilator: 'Dr. Eze' },
    { code: 'PHY101', title: 'Physics for Engineers', date: 'Nov 18, 2025', time: '09:00 AM - 12:00 PM', hall: 'Science Complex LT', seat: 'Seat SC-34', invigilator: 'Dr. Bello' },
    { code: 'CS201', title: 'Data Structures & Algorithms', date: 'Nov 21, 2025', time: '01:00 PM - 04:00 PM', hall: 'CBT Complex B', seat: 'Seat B-12', invigilator: 'Engr. Williams' },
  ]

  const handleDownloadDocket = () => {
    if (showToast) showToast('Official Examination Docket downloaded! (PDF) ✓')
    else alert('Official Examination Docket downloaded!')
  }

  return (
    <div className="student-exams-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Examinations & Assessments</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 Official Exam Timetable & Clearance Pass
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-primary" onClick={handleDownloadDocket}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Exam Docket
          </button>
        </div>
      </div>

      {/* Clearance Banner */}
      <div
        className="student-card"
        style={{
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#16a34a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#14532d' }}>
              Examination Clearance Verified
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#166534' }}>
              Student ID CS2024 is cleared for First Semester Examinations. Bring your laminated docket and student ID card to all exam venues.
            </p>
          </div>
        </div>
        <span className="student-badge student-badge-success" style={{ padding: '6px 12px' }}>
          Pass Issued
        </span>
      </div>

      {/* Exam Timetable Card */}
      <div className="student-card" style={{ marginBottom: 24 }}>
        <div className="student-card-header">
          <h3 className="student-card-title">
            First Semester Examination Schedule
          </h3>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Exam Date</th>
                <th>Time Window</th>
                <th>Examination Hall</th>
                <th>Assigned Seat</th>
                <th>Chief Proctor</th>
              </tr>
            </thead>
            <tbody>
              {examTimetable.map((item) => (
                <tr key={item.code}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.code}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{item.title}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f766e' }}>{item.date}</td>
                  <td>{item.time}</td>
                  <td>
                    <span className="student-badge student-badge-neutral">{item.hall}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.seat}</td>
                  <td style={{ color: '#475569' }}>{item.invigilator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules and Regulations */}
      <div className="student-card">
        <h3 className="student-card-title" style={{ marginBottom: 12 }}>
          Institutional Examination Guidelines
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
          <li>Candidates must arrive at the examination hall at least 30 minutes before the scheduled commencement.</li>
          <li>Possession of mobile phones, smartwatches, or unauthorized electronic memory devices inside the examination hall is strictly prohibited.</li>
          <li>Ensure your official photo examination docket and matriculation ID are clearly placed on your assigned desk throughout the duration.</li>
        </ul>
      </div>
    </div>
  )
}
export default StudentExams
