import React, { useState } from 'react'

export function StudentNotifications({ notifications = [], showToast }) {
  const [filter, setFilter] = useState('All')
  const [notifList, setNotifList] = useState(
    notifications.length > 0
      ? notifications
      : [
          { id: 1, title: 'Midterm Examination Schedule Published', category: 'Academic', date: '2 hours ago', read: false, message: 'The First Semester 2025/2026 examination timetable has been posted. Verify your examination halls.' },
          { id: 2, title: 'Tuition Balance Reminder (Due Oct 15)', category: 'Financial', date: 'Yesterday', read: false, message: 'Please ensure your outstanding balance of ₦1,250,000 is settled to secure exam clearance.' },
          { id: 3, title: 'CS201 Assignment 1 Graded', category: 'Academic', date: 'Sep 21, 2025', read: true, message: 'Engr. Williams has graded your assignment: 90/100 (A). Excellent implementation.' },
          { id: 4, title: 'Riverside ICT Portal Scheduled Upgrade', category: 'General', date: 'Sep 19, 2025', read: true, message: 'Campus WiFi and student portal will undergo maintenance this Sunday from 2 AM to 4 AM.' },
        ]
  )

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })))
    if (showToast) showToast('All notifications marked as read! ✓')
  }

  const filtered = notifList.filter((n) => {
    if (filter === 'All') return true
    return n.category.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="student-notifications-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Notifications & Campus Alerts</h1>
          <p className="student-page-subtitle">
            Stay updated with academic bulletins, deadlines, and departmental announcements.
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-secondary" onClick={handleMarkAllRead}>
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['All', 'Academic', 'Financial', 'General'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`student-btn ${filter === cat ? 'student-btn-primary' : 'student-btn-secondary'}`}
            style={{ fontSize: 13, padding: '7px 14px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="student-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '16px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              backgroundColor: item.read ? '#ffffff' : '#f0fdf4',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              borderLeft: item.read ? '4px solid #cbd5e1' : '4px solid #0f766e',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: item.read ? '#f1f5f9' : '#ecfdf5',
                color: item.read ? '#64748b' : '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{item.title}</span>
                  {!item.read && <span className="student-badge student-badge-success" style={{ fontSize: 10 }}>New</span>}
                </div>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{item.date}</span>
              </div>
              <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                {item.message}
              </p>
              <span className="student-badge student-badge-neutral" style={{ fontSize: 11 }}>
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default StudentNotifications
