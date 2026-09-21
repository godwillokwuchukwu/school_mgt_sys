import React, { useState } from 'react'

export function StudentProfileDrawer({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('Overview')

  if (!student) return null

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-profile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-drawer-header">
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Student Profile</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="admin-pill active">{student.status || 'Active'}</span>
            <button className="admin-drawer-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Hero */}
        <div className="admin-drawer-hero">
          <img
            src={student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
            alt={student.name}
            className="admin-drawer-hero-avatar"
          />
          <h2 className="admin-drawer-name">{student.name}</h2>
          <div className="admin-drawer-sub">{student.student_id || 'RS-0001'}</div>
          <div style={{ fontSize: 11.5, color: '#64748b' }}>
            {student.class} • {student.gender || 'Male'} • Age {student.age || 12}
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="admin-drawer-nav">
          {['Overview', 'Academic', 'Attendance', 'Fees'].map((tab) => (
            <div
              key={tab}
              className={`admin-drawer-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="admin-drawer-body">
          {activeTab === 'Overview' && (
            <>
              {/* Guardian Information */}
              <div className="admin-drawer-section-title">
                <span>👤</span> Guardian Information
              </div>
              <div className="admin-drawer-info-grid">
                <div className="admin-drawer-label">Name</div>
                <div className="admin-drawer-val">{student.guardian?.name || 'Mr. Okafor'}</div>
                <div className="admin-drawer-label">Phone</div>
                <div className="admin-drawer-val">{student.guardian?.phone || '0803 123 4567'}</div>
                <div className="admin-drawer-label">Relationship</div>
                <div className="admin-drawer-val">{student.guardian?.relationship || 'Father'}</div>
                <div className="admin-drawer-label">Address</div>
                <div className="admin-drawer-val">{student.guardian?.address || '12, Unity Street, Owerri, Imo State'}</div>
              </div>

              {/* Recent Activity */}
              <div className="admin-drawer-section-title">
                <span>⏱</span> Recent Activity
              </div>
              <div className="admin-drawer-info-grid">
                <div className="admin-drawer-label">Attendance (Today)</div>
                <div className="admin-drawer-val" style={{ color: '#10b981' }}>● Present</div>
                <div className="admin-drawer-label">Fee Status</div>
                <div className="admin-drawer-val" style={{ color: '#10b981' }}>● {student.fee_status || 'Paid'}</div>
                <div className="admin-drawer-label">Last Enrolled</div>
                <div className="admin-drawer-val">{student.enrolled_on || '2024-09-02'}</div>
              </div>
            </>
          )}

          {activeTab === 'Academic' && (
            <div>
              <div className="admin-drawer-section-title">Term Performance</div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span>Class Position:</span>
                  <strong>2nd of 48</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span>Term Average:</span>
                  <strong style={{ color: '#10b981' }}>89.4%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>Overall Status:</span>
                  <strong style={{ color: '#10b981' }}>Distinction</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Attendance' && (
            <div>
              <div className="admin-drawer-section-title">Attendance Rate</div>
              <div style={{ background: '#ecfdf5', padding: 16, borderRadius: 8, textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#047857' }}>{student.attendance || 96}%</div>
                <div style={{ fontSize: 11, color: '#047857' }}>Present: 64 days • Absent: 2 days • Late: 1 day</div>
              </div>
            </div>
          )}

          {activeTab === 'Fees' && (
            <div>
              <div className="admin-drawer-section-title">Fee Summary</div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span>Term Tuition Billed:</span>
                  <strong>₦350,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span>Total Paid:</span>
                  <strong style={{ color: '#10b981' }}>
                    {student.fee_status === 'Paid' ? '₦350,000' : student.fee_status === 'Partial' ? '₦200,000' : '₦0'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>Outstanding:</span>
                  <strong style={{ color: student.fee_status === 'Paid' ? '#10b981' : '#ef4444' }}>
                    {student.fee_status === 'Paid' ? '₦0' : student.fee_status === 'Partial' ? '₦150,000' : '₦350,000'}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <button
            className="admin-btn-primary"
            style={{ width: '100%', marginTop: 24, justifyContent: 'center', padding: '10px 0' }}
            onClick={() => alert(`Opening full comprehensive record for ${student.name}`)}
          >
            View Full Profile ↗
          </button>
        </div>
      </div>
    </div>
  )
}

export function TeacherProfileDrawer({ teacher, onClose }) {
  if (!teacher) return null

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-profile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-drawer-header" style={{ justifyContent: 'flex-end' }}>
          <button className="admin-drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* Hero */}
        <div className="admin-drawer-hero">
          <img
            src={teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={teacher.name}
            className="admin-drawer-hero-avatar"
            style={{ width: 84, height: 84 }}
          />
          <h2 className="admin-drawer-name">{teacher.name}</h2>
          <div className="admin-drawer-sub">
            {teacher.title || 'Head of Department'} • {teacher.subject || 'English Language'}
          </div>
          <span className="admin-pill active" style={{ marginTop: 4 }}>
            ● Active
          </span>
        </div>

        {/* Contact info list */}
        <div style={{ padding: '0 24px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
            <span>📞</span> {teacher.phone || '+234 803 123 4567'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
            <span>✉</span> {teacher.email || 'adeola.bello@riversideacademy.edu.ng'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
            <span>📍</span> {teacher.location || 'Block C, Room 12'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
            <span>📅</span> {teacher.joined || 'Joined: Aug 12, 2019 • 5 years'}
          </div>
        </div>

        {/* Body */}
        <div className="admin-drawer-body">
          {/* Subjects Taught */}
          <div className="admin-drawer-section-title">
            <span>📖</span> Subjects Taught
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            <span className="admin-pill" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              {teacher.subject || 'English Language'}
            </span>
            <span className="admin-pill" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              Literature
            </span>
          </div>

          {/* Assigned Classes */}
          <div className="admin-drawer-section-title">
            <span>👥</span> Assigned Classes
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {(teacher.classes || ['JSS 1', 'JSS 3', 'SS 2']).map((c, i) => (
              <span key={i} className="admin-pill" style={{ background: '#ecfdf5', color: '#047857' }}>
                {c}
              </span>
            ))}
          </div>

          {/* Weekly Schedule */}
          <div className="admin-drawer-section-title">
            <span>📅</span> Weekly Schedule
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, marginBottom: 18 }}>
            {(teacher.schedule || [
              { day: 'Mon', time: '8:00 – 10:00', class: 'JSS 1 (English)' },
              { day: 'Tue', time: '10:30 – 12:30', class: 'SS 2 (Literature)' },
              { day: 'Wed', time: '8:00 – 10:00', class: 'JSS 3 (English)' },
              { day: 'Thu', time: '10:30 – 12:30', class: 'SS 2 (Literature)' },
              { day: 'Fri', time: '8:00 – 10:00', class: 'JSS 1 (English)' },
            ]).map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
                <strong style={{ width: 40, color: '#0f172a' }}>{s.day}</strong>
                <span style={{ color: '#64748b' }}>{s.time}</span>
                <span style={{ fontWeight: 600, color: '#09261d' }}>{s.class}</span>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="admin-drawer-section-title">
            <span>⏱</span> Recent Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
            <div style={{ color: '#475569' }}>
              <strong>Attendance marked</strong> • 2 hours ago<br />
              <span style={{ color: '#94a3b8' }}>JSS 3 – 92%</span>
            </div>
            <div style={{ color: '#475569' }}>
              <strong>Submitted assignment</strong> • 4 hours ago<br />
              <span style={{ color: '#94a3b8' }}>Literature – Week 4</span>
            </div>
            <div style={{ color: '#475569' }}>
              <strong>Updated class results</strong> • 1 day ago<br />
              <span style={{ color: '#94a3b8' }}>SS 2 – Term 1</span>
            </div>
            <div style={{ color: '#475569' }}>
              <strong>Profile updated</strong> • 3 days ago<br />
              <span style={{ color: '#94a3b8' }}>Contact information</span>
            </div>
          </div>

          <button
            className="admin-btn-primary"
            style={{ width: '100%', marginTop: 24, justifyContent: 'center', padding: '10px 0' }}
            onClick={() => alert(`Opening comprehensive faculty profile for ${teacher.name}`)}
          >
            <span>👁 View Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
