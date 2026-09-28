import React, { useState } from 'react'

export function StudentTimetable({ timetableWeek = {} }) {
  const [selectedDay, setSelectedDay] = useState('Monday')

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const defaultSchedule = {
    Monday: [
      { time: '09:00 - 10:30 AM', code: 'CS101', title: 'Intro to Computer Science', room: 'Computer Lab 2', instructor: 'Dr. Adeyemi', type: 'Lecture' },
      { time: '11:00 - 01:00 PM', code: 'PHY101', title: 'Physics for Engineers', room: 'Science Complex', instructor: 'Dr. Bello', type: 'Lab' },
      { time: '02:00 - 03:30 PM', code: 'MAT201', title: 'Calculus II', room: 'Lecture Theatre 1', instructor: 'Prof. Balogun', type: 'Lecture' },
    ],
    Tuesday: [
      { time: '09:00 - 10:30 AM', code: 'CS201', title: 'Data Structures & Algorithms', room: 'Computer Lab 1', instructor: 'Engr. Williams', type: 'Lecture' },
      { time: '11:00 - 12:30 PM', code: 'ENG102', title: 'Technical Communication', room: 'Hall B', instructor: 'Dr. Mrs. Eze', type: 'Seminar' },
    ],
    Wednesday: [
      { time: '09:00 - 10:30 AM', code: 'CS101', title: 'Intro to Computer Science', room: 'Computer Lab 2', instructor: 'Dr. Adeyemi', type: 'Practical' },
      { time: '01:00 - 03:00 PM', code: 'ENG102', title: 'Technical Communication', room: 'Hall B', instructor: 'Dr. Mrs. Eze', type: 'Workshop' },
    ],
    Thursday: [
      { time: '09:00 - 10:30 AM', code: 'CS201', title: 'Data Structures & Algorithms', room: 'Computer Lab 1', instructor: 'Engr. Williams', type: 'Lab' },
      { time: '11:00 - 12:30 PM', code: 'MAT201', title: 'Calculus II (Tutorial)', room: 'Lecture Theatre 1', instructor: 'Prof. Balogun', type: 'Tutorial' },
    ],
    Friday: [
      { time: '09:00 - 11:00 AM', code: 'PHY101', title: 'Physics Lab Experiments', room: 'Physics Lab 3', instructor: 'Dr. Bello', type: 'Practical' },
      { time: '02:00 - 04:00 PM', code: 'CS201', title: 'Coding Bootcamp / Project Review', room: 'Software Dev Studio', instructor: 'Engr. Williams', type: 'Review' },
    ],
  }

  const activeDayList = timetableWeek[selectedDay] || defaultSchedule[selectedDay] || []

  return (
    <div className="student-timetable-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Weekly Lecture Timetable</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 Academic Calendar &bull; Monday through Friday
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-secondary" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Timetable
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`student-btn ${selectedDay === day ? 'student-btn-primary' : 'student-btn-secondary'}`}
            style={{ fontSize: 13, padding: '8px 18px' }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Cards for Selected Day */}
      <div className="student-card">
        <div className="student-card-header">
          <h3 className="student-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0f766e" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
            {selectedDay} Schedule ({activeDayList.length} Sessions)
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeDayList.map((slot, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                borderLeft: '4px solid #0f766e',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div
                  style={{
                    minWidth: 120,
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#0f766e',
                    backgroundColor: '#ecfdf5',
                    padding: '8px 12px',
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  {slot.time}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                    {slot.code}: {slot.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 3 }}>
                    Venue: <strong>{slot.room}</strong> &bull; Lecturer: {slot.instructor}
                  </div>
                </div>
              </div>

              <span className="student-badge student-badge-info">{slot.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default StudentTimetable
