import React, { useState } from 'react'
import { TIMETABLE_DATA } from '../parentData'

export default function ParentTimetable({
  children = [],
  selectedChild,
  onSelectChild,
}) {
  const child = selectedChild || children[0]
  const [selectedDay, setSelectedDay] = useState('All')

  if (!child) return null

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const timeSlots = [
    '08:00 - 09:00 AM',
    '09:30 - 10:30 AM',
    '11:00 - 12:00 PM',
    '01:00 - 02:00 PM',
    '02:30 - 03:30 PM',
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="parent-timetable-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Class Timetable & Schedule</h1>
          <p className="parent-page-subtitle">
            Weekly classroom periods, subject schedule, and room assignments for <strong>{child.name}</strong> ({child.grade}).
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
            onClick={handlePrint}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect width="12" height="8" x="6" y="14" />
            </svg>
            Print Timetable
          </button>
        </div>
      </div>

      {/* Today's Schedule Banner */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: '#047857',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <strong style={{ fontSize: 14.5, color: '#09261d' }}>Today's Classes & Periods:</strong>
            <div style={{ fontSize: 12.5, color: '#065f46' }}>
              Mathematics (Room 101) &bull; English (Room 203) &bull; Computer Science (Lab 1) &bull; Science Practical
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            background: '#ffffff',
            padding: '4px 10px',
            borderRadius: 6,
            color: '#047857',
            border: '1px solid #a7f3d0',
          }}
        >
          School Hours: 08:00 AM - 03:30 PM
        </span>
      </div>

      {/* Day Filter Subtabs */}
      <div className="parent-subtabs" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`parent-subtab-btn ${selectedDay === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedDay('All')}
        >
          Full Week (Mon - Fri)
        </button>
        {days.map((d) => (
          <button
            key={d}
            type="button"
            className={`parent-subtab-btn ${selectedDay === d ? 'active' : ''}`}
            onClick={() => setSelectedDay(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timetable Weekly Matrix */}
      {selectedDay === 'All' ? (
        <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
          <div style={{ minWidth: 700 }}>
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px repeat(5, 1fr)',
                gap: 10,
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: 12,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textAlign: 'left', paddingLeft: 6 }}>TIME</div>
              {days.map((d) => (
                <div key={d} style={{ fontSize: 13, fontWeight: 800, color: '#09261d' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Time Slot Rows */}
            {timeSlots.map((slot) => (
              <div
                key={slot}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px repeat(5, 1fr)',
                  gap: 10,
                  marginBottom: 10,
                  alignItems: 'stretch',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #f1f5f9',
                  }}
                >
                  {slot}
                </div>

                {days.map((day) => {
                  const scheduleForDay = TIMETABLE_DATA[day] || []
                  const period = scheduleForDay.find((p) => p.time === slot)

                  if (!period) {
                    return (
                      <div
                        key={day}
                        style={{
                          background: '#f8fafc',
                          borderRadius: 6,
                          border: '1px dashed #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: '#94a3b8',
                          minHeight: 64,
                        }}
                      >
                        Study Period / Recess
                      </div>
                    )
                  }

                  const colorClass = period.color || 'blue'
                  return (
                    <div
                      key={day}
                      className={`parent-schedule-block ${colorClass}`}
                      style={{ minHeight: 64 }}
                    >
                      <div className="parent-schedule-title">{period.subject}</div>
                      <div className="parent-schedule-room">{period.room} &bull; {period.teacher}</div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Single Day Detailed View */
        <div className="parent-panel-card">
          <div className="parent-panel-header">
            <div className="parent-panel-title">Classes for {selectedDay}</div>
            <span style={{ fontSize: 12, color: '#64748b' }}>{child.name} &bull; {child.grade}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(TIMETABLE_DATA[selectedDay] || []).map((period, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 120, fontSize: 12.5, fontWeight: 700, color: '#09261d' }}>
                    {period.time}
                  </div>
                  <div>
                    <strong style={{ fontSize: 14.5, color: '#0f172a' }}>{period.subject}</strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Teacher: {period.teacher} &bull; Location: {period.room}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                  }}
                >
                  Period {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
