import React, { useState } from 'react'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminCalendarDashboard({ events = [] }) {
  const { longDate, monthYear } = useLiveDateTime()
  const [currentMonth, setCurrentMonth] = useState(monthYear || 'September 2026')
  const [eventTypeFilter, setEventTypeFilter] = useState('All')
  const [addEventModal, setAddEventModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calendar Events
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, day: 2, title: 'Entrance Exams', category: 'Exam', color: '#8b5cf6' },
    { id: 2, day: 3, title: 'Staff Faculty Meeting', category: 'Staff', color: '#3b82f6' },
    { id: 3, day: 9, title: 'PTA Executive Meeting', category: 'Parent', color: '#ec4899' },
    { id: 4, day: 14, title: 'All-School Assembly', category: 'Assembly', color: '#10b981' },
    { id: 5, day: 16, title: 'STEM Project Submissions', category: 'Academic', color: '#f59e0b' },
    { id: 6, day: 20, title: 'Term 1 Fee Deadline', category: 'Financial', color: '#ef4444' },
    { id: 7, day: 21, title: 'Public Holiday', category: 'Holiday', color: '#ef4444' },
    { id: 8, day: 22, title: 'Midterm Examination', category: 'Exam', color: '#3b82f6' },
    { id: 9, day: 23, title: 'Inter-House Sports Heat', category: 'Sports', color: '#f59e0b' },
    { id: 10, day: 28, title: 'Parent-Teacher Consultations', category: 'Parent', color: '#ec4899' },
    { id: 11, day: 30, title: 'Staff Development Workshop', category: 'Staff', color: '#8b5cf6' },
  ])

  // Upcoming Event Highlights
  const upcomingEvents = [
    { date: 'SEP 22', title: 'Midterm Examination', time: '8:00 AM – 10:00 AM', loc: 'Hall A & B', type: 'Exam', color: '#3b82f6' },
    { date: 'SEP 23', title: 'Inter-House Sports Heat', time: '1:00 PM – 4:00 PM', loc: 'Sports Complex', type: 'Sports', color: '#f59e0b' },
    { date: 'SEP 28', title: 'Parent-Teacher Meeting', time: '2:00 PM – 5:00 PM', loc: 'Assembly Hall', type: 'Parent', color: '#ec4899' },
    { date: 'SEP 30', title: 'Staff Development Workshop', time: '9:00 AM – 1:00 PM', loc: 'Board Room', type: 'Staff', color: '#8b5cf6' },
  ]

  const [newEvent, setNewEvent] = useState({
    title: '',
    day: 25,
    category: 'Exam',
    color: '#3b82f6',
  })

  const handleAddEvent = async (e) => {
    e.preventDefault()
    const item = {
      id: Date.now(),
      day: Number(newEvent.day),
      title: newEvent.title,
      category: newEvent.category,
      color: newEvent.color,
    }
    setCalendarEvents([
      ...calendarEvents,
      item,
    ])
    setAddEventModal(false)
    showToast(`Event "${newEvent.title}" added to ${monthYear} calendar!`)
    setNewEvent({ title: '', day: 25, category: 'Exam', color: '#3b82f6' })

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calendar.event_created',
          description: `Scheduled calendar event: "${item.title}" (${item.category}) for September ${item.day}`,
          details: item
        })
      })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    } catch (err) {
      console.error(err)
    }
  }

  // Days matrix for September 2026 (Starts on Tuesday, Sept 1)
  const calendarDays = [
    null, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, null, null, null, null,
  ]

  return (
    <div className="admin-page-content">
      {/* 1. Page Header (Gold Standard) */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">School Calendar</h1>
          <p className="admin-page-subtitle">
            Manage academic term milestones, examinations, holidays, PTA meetings, and institutional scheduling.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={() => showToast('Calendar exported to iCal & PDF!')}>
            <span>Export Calendar</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setAddEventModal(true)}>
            <span>+ Add Event</span>
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
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Events This Month</span>
          </div>
          <div className="admin-kpi-number">{calendarEvents.length} Events</div>
          <div className="admin-kpi-trend up">
            <span>{monthYear}</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>calendar</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Examinations</span>
          </div>
          <div className="admin-kpi-number">2 Assessments</div>
          <div className="admin-kpi-trend up">
            <span>Midterm 22–26 Sep</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>ongoing</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">PTA & Parent Meets</span>
          </div>
          <div className="admin-kpi-number">2 Meetings</div>
          <div className="admin-kpi-trend neutral">
            <span>Consultations</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>scheduled</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box admissions">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Campus Holidays</span>
          </div>
          <div className="admin-kpi-number">1 Day</div>
          <div className="admin-kpi-trend neutral">
            <span>21 September</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>observed</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Row */}
      <div className="admin-filter-row">
        <select className="admin-select" value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
          <option value={monthYear}>Month: {monthYear}</option>
          <option value="October 2026">Month: October 2026</option>
          <option value="November 2026">Month: November 2026</option>
        </select>

        <select className="admin-select" value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
          <option value="All">Event Category: All</option>
          <option value="Exam">Examinations</option>
          <option value="Parent">Parent & PTA</option>
          <option value="Staff">Staff & Faculty</option>
          <option value="Holiday">Holidays</option>
        </select>

        <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
          <span>Today: {longDate}</span>
        </div>
      </div>

      {/* 4. Main Two-Column Calendar Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Calendar Grid */}
        <div className="admin-table-panel">
          <div className="admin-table-top-bar">
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentMonth}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="admin-btn-outline" style={{ padding: '3px 8px', fontSize: 11 }}>‹ Prev</button>
              <button className="admin-btn-outline" style={{ padding: '3px 8px', fontSize: 11 }}>Today</button>
              <button className="admin-btn-outline" style={{ padding: '3px 8px', fontSize: 11 }}>Next ›</button>
            </div>
          </div>

          <div style={{ padding: 14 }}>
            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', paddingBottom: 10, borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 11.5, color: '#64748b' }}>
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>

            {/* Days Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 10 }}>
              {calendarDays.map((dayNum, idx) => {
                if (dayNum === null) {
                  return <div key={`empty-${idx}`} style={{ minHeight: 80, background: '#fafafa', borderRadius: 8, opacity: 0.3 }} />
                }
                const isToday = dayNum === new Date().getDate()
                const dayEvents = calendarEvents.filter((e) => e.day === dayNum && (eventTypeFilter === 'All' || e.category === eventTypeFilter))

                return (
                  <div
                    key={dayNum}
                    style={{
                      minHeight: 82,
                      background: isToday ? '#f0fdf4' : '#ffffff',
                      border: isToday ? '2px solid #10b981' : '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: isToday ? 800 : 600,
                          color: isToday ? '#10b981' : '#1e293b',
                          background: isToday ? '#dcfce7' : 'transparent',
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '1px 5px', borderRadius: 4 }}>
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Events on this day */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: `${ev.color}18`,
                            color: ev.color,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="admin-table-panel" style={{ padding: 18 }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
            Upcoming Milestones
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingEvents.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid #f1f5f9',
                  background: '#fbfdfc',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: '#f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: '#64748b' }}>{item.date.split(' ')[0]}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{item.date.split(' ')[1]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{item.time}</div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 1 }}>{item.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Event */}
      {addEventModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Schedule Calendar Event</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Add an academic, parental, or examination event to {monthYear}.
            </p>

            <form onSubmit={handleAddEvent}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Fair Exhibition"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Day of September
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newEvent.day}
                    onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    <option value="Exam">Exam</option>
                    <option value="Staff">Staff</option>
                    <option value="Parent">Parent</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Assembly">Assembly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setAddEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
