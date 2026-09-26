import React, { useState } from 'react'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminTimetableDashboard({ classes = [], teachers = [] }) {
  const { longDate } = useLiveDateTime()
  const [activeTab, setActiveTab] = useState('class') // 'class' | 'teacher' | 'room'
  const [academicYear, setAcademicYear] = useState('2025/2026')
  const [selectedClass, setSelectedClass] = useState('JSS 2A')
  const [selectedWeek, setSelectedWeek] = useState('Week 3 (15 – 21 Sep 2026)')
  const [addLessonModal, setAddLessonModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Periods timeline
  const timeSlots = [
    '8:00 – 9:00',
    '9:00 – 10:00',
    '10:00 – 11:00',
    '11:00 – 12:00',
    '12:00 – 1:00',
    '1:00 – 2:00',
    '2:00 – 3:00',
  ]

  // Lesson schedule grid matching Riverside Academy Curriculum
  const [schedule, setSchedule] = useState({
    '8:00 – 9:00': {
      mon: { subject: 'Mathematics', teacher: 'Mr. James Okafor', room: 'Rm 204', color: 'blue' },
      tue: { subject: 'English Language', teacher: 'Mrs. Adeola Bello', room: 'Rm 204', color: 'purple' },
      wed: { subject: 'Basic Science', teacher: 'Mrs. Funke Ibrahim', room: 'Rm 205', color: 'green' },
      thu: { subject: 'Social Studies', teacher: 'Mr. Tunde Bakare', room: 'Rm 204', color: 'amber' },
      fri: { subject: 'ICT & Coding', teacher: 'Mr. Samuel Adeyemi', room: 'Lab 102', color: 'cyan' },
    },
    '9:00 – 10:00': {
      mon: { subject: 'English Language', teacher: 'Mrs. Adeola Bello', room: 'Rm 204', color: 'purple' },
      tue: { subject: 'Basic Science', teacher: 'Mrs. Funke Ibrahim', room: 'Rm 205', color: 'green' },
      wed: { subject: 'Mathematics', teacher: 'Mr. James Okafor', room: 'Rm 204', color: 'blue' },
      thu: { subject: 'Basic Science', teacher: 'Mrs. Funke Ibrahim', room: 'Rm 205', color: 'green' },
      fri: { subject: 'Social Studies', teacher: 'Mr. Tunde Bakare', room: 'Rm 204', color: 'amber' },
    },
    '10:00 – 11:00': {
      mon: { subject: 'History', teacher: 'Mrs. Grace Eke', room: 'Rm 204', color: 'amber' },
      tue: { subject: 'Library Studies', teacher: 'Mrs. Chucks', room: 'Library', color: 'teal' },
      wed: { subject: 'Physical Education', teacher: 'Coach Alexis', room: 'Field', color: 'green' },
      thu: { subject: 'Mathematics', teacher: 'Mr. James Okafor', room: 'Rm 204', color: 'blue' },
      fri: { subject: 'Basic Science', teacher: 'Mrs. Funke Ibrahim', room: 'Rm 205', color: 'green' },
    },
    '11:00 – 12:00': {
      mon: { subject: 'Recess & Lunch', teacher: 'Supervised', room: 'Cafeteria', color: 'gray' },
      tue: { subject: 'Recess & Lunch', teacher: 'Supervised', room: 'Cafeteria', color: 'gray' },
      wed: { subject: 'Recess & Lunch', teacher: 'Supervised', room: 'Cafeteria', color: 'gray' },
      thu: { subject: 'Recess & Lunch', teacher: 'Supervised', room: 'Cafeteria', color: 'gray' },
      fri: { subject: 'Recess & Lunch', teacher: 'Supervised', room: 'Cafeteria', color: 'gray' },
    },
    '12:00 – 1:00': {
      mon: { subject: 'Basic Science', teacher: 'Mrs. Funke Ibrahim', room: 'Lab 2', color: 'green' },
      tue: { subject: 'Mathematics', teacher: 'Mr. James Okafor', room: 'Rm 204', color: 'blue' },
      wed: { subject: 'English Language', teacher: 'Mrs. Adeola Bello', room: 'Rm 204', color: 'purple' },
      thu: { subject: 'ICT & Coding', teacher: 'Mr. Samuel Adeyemi', room: 'Lab 102', color: 'cyan' },
      fri: { subject: 'Fine Arts', teacher: 'Mrs. Joy Nnamdi', room: 'Art Studio', color: 'rose' },
    },
    '1:00 – 2:00': {
      mon: { subject: 'Fine Arts', teacher: 'Mrs. Joy Nnamdi', room: 'Art Studio', color: 'rose' },
      tue: { subject: 'Social Studies', teacher: 'Mr. Tunde Bakare', room: 'Rm 204', color: 'amber' },
      wed: { subject: 'Creative Writing', teacher: 'Mrs. Adeola Bello', room: 'Rm 204', color: 'purple' },
      thu: { subject: 'English Language', teacher: 'Mrs. Adeola Bello', room: 'Rm 204', color: 'purple' },
      fri: { subject: 'Mathematics', teacher: 'Mr. James Okafor', room: 'Rm 204', color: 'blue' },
    },
    '2:00 – 3:00': {
      mon: { subject: 'Sports & Athletics', teacher: 'Coach Alexis', room: 'Sports Complex', color: 'teal' },
      tue: { subject: 'Music & Choir', teacher: 'Mr. David Adeleke', room: 'Music Hall', color: 'rose' },
      wed: { subject: 'Sports & Athletics', teacher: 'Coach Alexis', room: 'Sports Complex', color: 'teal' },
      thu: { subject: 'Clubs & Societies', teacher: 'Patrons', room: 'Campus Hall', color: 'teal' },
      fri: { subject: 'Assembly & Prep', teacher: 'Class Teacher', room: 'Assembly Ground', color: 'teal' },
    },
  })

  // New Lesson State
  const [newLesson, setNewLesson] = useState({
    timeSlot: '8:00 – 9:00',
    day: 'mon',
    subject: 'Mathematics',
    teacher: 'Mr. James Okafor',
    room: 'JSS 2A - Rm 204',
    color: 'blue',
  })

  const getCardStyle = (color) => {
    switch (color) {
      case 'blue':
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', teacher: '#3b82f6' }
      case 'amber':
        return { bg: '#fffbeb', border: '#fde68a', text: '#92400e', teacher: '#d97706' }
      case 'green':
        return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', teacher: '#15803d' }
      case 'purple':
        return { bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8', teacher: '#8b5cf6' }
      case 'cyan':
        return { bg: '#ecfeff', border: '#a5f3fc', text: '#155e75', teacher: '#06b6d4' }
      case 'rose':
        return { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', teacher: '#f43f5e' }
      case 'teal':
        return { bg: '#f0fdfa', border: '#99f6e4', text: '#115e59', teacher: '#0d9488' }
      default:
        return { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', teacher: '#64748b' }
    }
  }

  const handleAddLesson = async (e) => {
    e.preventDefault()
    setSchedule({
      ...schedule,
      [newLesson.timeSlot]: {
        ...schedule[newLesson.timeSlot],
        [newLesson.day]: {
          subject: newLesson.subject,
          teacher: newLesson.teacher,
          room: newLesson.room,
          color: newLesson.color,
        },
      },
    })
    setAddLessonModal(false)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'timetable.lesson_scheduled',
          model_name: 'Timetable',
          object_id: `${selectedClass}-${newLesson.timeSlot}`,
          description: `Scheduled ${newLesson.subject} lesson with ${newLesson.teacher} for ${selectedClass} (${newLesson.timeSlot}).`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    showToast(`Lesson assigned to ${newLesson.timeSlot}!`)
  }

  const exportTimetable = () => {
    showToast(`Exported ${selectedClass} timetable to PDF!`)
  }

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Class Timetable</h1>
          <p className="admin-page-subtitle">
            Manage weekly instructional periods, teacher room schedules, subject allocations and conflict-free lesson timetables.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={exportTimetable}>
            <span>Export Timetable</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setAddLessonModal(true)}>
            <span>+ Schedule Lesson</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
          <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#065f46', fontSize: 14 }} onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* 2. 4-KPI Grid (Matching Gold Standard) */}
      <div className="admin-4kpi-grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box classes">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Daily Instructional Slots</span>
          </div>
          <div className="admin-kpi-number">7 Periods</div>
          <div className="admin-kpi-trend neutral">
            <span>8:00 AM – 3:00 PM</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>daily</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="admin-kpi-title">Active Timetables</span>
          </div>
          <div className="admin-kpi-number">{classes.length || 6} Cohorts</div>
          <div className="admin-kpi-trend up">
            <span>JSS 1 to SS 3</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>synchronized</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Faculty Utilization</span>
          </div>
          <div className="admin-kpi-number">96.5%</div>
          <div className="admin-kpi-trend up">
            <span>12 Teachers</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>optimally loaded</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Schedule Conflicts</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#059669' }}>0 Detected</div>
          <div className="admin-kpi-trend up">
            <span>Conflict-Free</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>clean timetable</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Row */}
      <div className="admin-filter-row">
        <select className="admin-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="JSS 2A">Class: JSS 2A</option>
          <option value="JSS 1">Class: JSS 1</option>
          <option value="JSS 3">Class: JSS 3</option>
          <option value="SS 1">Class: SS 1</option>
          <option value="SS 2">Class: SS 2</option>
          <option value="SS 3">Class: SS 3</option>
        </select>

        <select className="admin-select" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="Week 3 (15 – 21 Sep 2026)">Week 3 (15 – 21 Sep 2026)</option>
          <option value="Week 4 (22 – 28 Sep 2026)">Week 4 (22 – 28 Sep 2026)</option>
          <option value="Week 5 (29 Sep – 05 Oct 2026)">Week 5 (29 Sep – 05 Oct 2026)</option>
        </select>

        <select className="admin-select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
          <option value="2025/2026">Academic Year: 2025/2026</option>
          <option value="2024/2025">Academic Year: 2024/2025</option>
        </select>

        <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
          <span>{longDate}</span>
        </div>
      </div>

      {/* 4. Main Timetable Panel */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            Weekly Class Schedule: {selectedClass} • Term 1
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Monday through Friday • Standard 60-min periods
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Time Slot</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => {
                const row = schedule[slot] || {}
                const isBreak = slot === '11:00 – 12:00'
                return (
                  <tr key={slot} style={{ background: isBreak ? '#f8fafc' : 'transparent' }}>
                    <td style={{ fontWeight: 700, color: '#09261d', whiteSpace: 'nowrap', fontSize: 12 }}>
                      {slot}
                    </td>

                    {['mon', 'tue', 'wed', 'thu', 'fri'].map((day) => {
                      const lesson = row[day]
                      if (!lesson) {
                        return (
                          <td key={day} style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 11 }}>
                            Free Period
                          </td>
                        )
                      }
                      if (isBreak) {
                        return (
                          <td key={day} style={{ background: '#f1f5f9', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 12 }}>
                            ☕ Recess / Lunch
                          </td>
                        )
                      }

                      const style = getCardStyle(lesson.color)
                      return (
                        <td key={day} style={{ padding: '8px' }}>
                          <div
                            style={{
                              background: style.bg,
                              border: `1px solid ${style.border}`,
                              borderRadius: 8,
                              padding: '8px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: style.text }}>
                              {lesson.subject}
                            </div>
                            <div style={{ fontSize: 11, color: style.teacher, fontWeight: 500 }}>
                              {lesson.teacher}
                            </div>
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                              📍 {lesson.room}
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Lesson */}
      {addLessonModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Schedule Lesson</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Assign a subject, teacher, and classroom period for {selectedClass}.
            </p>

            <form onSubmit={handleAddLesson}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Day of Week
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newLesson.day}
                    onChange={(e) => setNewLesson({ ...newLesson, day: e.target.value })}
                  >
                    <option value="mon">Monday</option>
                    <option value="tue">Tuesday</option>
                    <option value="wed">Wednesday</option>
                    <option value="thu">Thursday</option>
                    <option value="fri">Friday</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Period Slot
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newLesson.timeSlot}
                    onChange={(e) => setNewLesson({ ...newLesson, timeSlot: e.target.value })}
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newLesson.subject}
                  onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Assigned Teacher
                </label>
                <input
                  type="text"
                  value={newLesson.teacher}
                  onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setAddLessonModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
