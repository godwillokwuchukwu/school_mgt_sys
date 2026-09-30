import React, { useState } from 'react'
import { LATEST_NOTICES } from '../parentData'

export default function ParentNotices({
  notices = LATEST_NOTICES,
  selectedChild,
  onOpenAddNote,
}) {
  const [activeTab, setActiveTab] = useState('All')

  // Detailed notices seed
  const fullNotices = [
    {
      id: 'not-1',
      title: 'School Holiday Announcement: Mid-Term Break',
      date: 'Sep 20, 2025',
      category: 'Holiday',
      urgent: true,
      body: 'Riverside College will be closed for the official Mid-Term break on October 14, 2025. Academic activities and boarding hostel check-in will resume on October 16, 2025 at 08:00 AM promptly.',
      author: 'Principal’s Office',
    },
    {
      id: 'not-2',
      title: 'Updated Fee Schedule & Early Payment Rebate for 2025/2026',
      date: 'Sep 18, 2025',
      category: 'Finance',
      urgent: false,
      body: 'The Board of Governors has approved the updated financial schedule for the forthcoming academic term. Parents who settle term dues prior to October 01 receive a 5% early settlement rebate.',
      author: 'Bursary & Accounts Directorate',
    },
    {
      id: 'not-3',
      title: 'Annual Parent Satisfaction Survey - We Value Your Guidance',
      date: 'Sep 15, 2025',
      category: 'Survey',
      urgent: false,
      body: 'In our continued pursuit of academic excellence, we invite all parents and guardians to complete the 5-minute Riverside digital survey evaluating classroom infrastructure and faculty engagement.',
      author: 'Quality Assurance Board',
    },
    {
      id: 'not-4',
      title: 'Science Fair & Robotics Exhibition Participation Guidelines',
      date: 'Sep 10, 2025',
      category: 'Academic',
      urgent: false,
      body: 'Students in Grades 8 through 12 are encouraged to submit their STEM exhibition proposals to their respective science department leads by Friday, September 26.',
      author: 'Department of STEM & Sciences',
    },
  ]

  const childNotes = selectedChild?.notes || [
    { id: 'n1', title: 'Parent-Teacher Conference', date: 'Sep 14, 2025', content: "Meeting with Mr. Davis on Sep 25 at 10:00 AM regarding math progress." },
    { id: 'n2', title: 'Science Project Due Date', date: 'Sep 13, 2025', content: 'Robotics sensor experiment report due on Oct 14.' },
  ]

  const filteredNotices = fullNotices.filter((n) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Academic') return n.category === 'Academic'
    if (activeTab === 'Finance') return n.category === 'Finance'
    if (activeTab === 'Holiday') return n.category === 'Holiday'
    return true
  })

  return (
    <div className="parent-notices-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Notices & Announcements</h1>
          <p className="parent-page-subtitle">
            Official institutional circulars, administrative alerts, and private parental reminders.
          </p>
        </div>

        <button
          type="button"
          className="parent-btn-primary"
          onClick={onOpenAddNote}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Personal Note
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="parent-subtabs" style={{ marginBottom: 20 }}>
        {['All', 'Academic', 'Finance', 'Holiday', 'My Notes'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`parent-subtab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'All' ? 'All Notices' : tab === 'My Notes' ? 'My Personal Notes' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'My Notes' ? (
        /* Personal Notes View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {childNotes.map((note) => (
            <div
              key={note.id}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 12,
                padding: '20px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <strong style={{ fontSize: 15, color: '#92400e' }}>{note.title}</strong>
                <span style={{ fontSize: 11, color: '#b45309' }}>{note.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
                {note.content}
              </p>
            </div>
          ))}

          <div
            onClick={onOpenAddNote}
            style={{
              background: '#ffffff',
              border: '2px dashed #cbd5e1',
              borderRadius: 12,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: 140,
            }}
          >
            <div style={{ fontSize: 24, color: '#10b981', marginBottom: 6 }}>+</div>
            <strong style={{ fontSize: 14, color: '#09261d' }}>Create New Reminder Note</strong>
            <span style={{ fontSize: 12, color: '#64748b' }}>Store personal reminders and dates</span>
          </div>
        </div>
      ) : (
        /* Official School Notices View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              style={{
                background: '#ffffff',
                border: notice.urgent ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          notice.category === 'Holiday'
                            ? '#fee2e2'
                            : notice.category === 'Finance'
                            ? '#eff6ff'
                            : '#ecfdf5',
                        color:
                          notice.category === 'Holiday'
                            ? '#b91c1c'
                            : notice.category === 'Finance'
                            ? '#1d4ed8'
                            : '#047857',
                      }}
                    >
                      {notice.category}
                    </span>
                    {notice.urgent && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#dc2626',
                          background: '#fff1f2',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        ● High Priority
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{notice.date}</span>
                  </div>

                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    {notice.title}
                  </h3>
                </div>

                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                  Issued by: {notice.author}
                </span>
              </div>

              <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#334155', lineHeight: 1.6 }}>
                {notice.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
