import React, { useState } from 'react'

export default function ParentSettings({
  parentProfile,
  children = [],
  onUpdateProfile,
  onOpenAddChild,
}) {
  const [formData, setFormData] = useState({
    firstName: parentProfile?.firstName || 'Sarah',
    lastName: parentProfile?.lastName || 'Johnson',
    email: parentProfile?.email || 'mrs.johnson@parent.riversideacademy.com',
    phone: parentProfile?.phone || '+1 (555) 234-5678',
    address: parentProfile?.address || '742 Evergreen Terrace, Riverside Metro District',
  })

  const [notifications, setNotifications] = useState({
    gradeAlerts: true,
    attendanceAlerts: true,
    feeReminders: true,
    weeklyDigest: true,
  })

  const [twoFactor, setTwoFactor] = useState(true)
  const [savedMessage, setSavedMessage] = useState(false)

  const handleSubmitProfile = (e) => {
    e.preventDefault()
    if (onUpdateProfile) {
      onUpdateProfile(formData)
    }
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    alert('Security credentials updated successfully.')
  }

  return (
    <div className="parent-settings-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Parent Account Settings</h1>
          <p className="parent-page-subtitle">
            Manage your personal profile, notification preferences, verified student links, and authentication credentials.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div
          style={{
            padding: '12px 18px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 8,
            color: '#065f46',
            fontWeight: 600,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Account profile information has been saved successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* Left Column: Personal Information Form */}
        <div className="parent-panel-card">
          <div className="parent-panel-header">
            <div className="parent-panel-title-wrap">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div>
                <div className="parent-panel-title">Profile Information</div>
                <span className="parent-panel-subtitle">Primary parent / guardian contact info</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <img
                src={parentProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
                alt="Parent Avatar"
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
              />
              <div>
                <button
                  type="button"
                  onClick={() => alert('Change profile photo dialog')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Change Photo
                </button>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>JPG, GIF or PNG. Max size 2MB</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="parent-form-group">
                <label className="parent-form-label">First Name</label>
                <input
                  type="text"
                  className="parent-form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="parent-form-group">
                <label className="parent-form-label">Last Name</label>
                <input
                  type="text"
                  className="parent-form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Email Address (Official Portal Sign-In)</label>
              <input
                type="email"
                className="parent-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Phone Number (SMS Notifications)</label>
              <input
                type="text"
                className="parent-form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Residential Address</label>
              <textarea
                rows={2}
                className="parent-form-textarea"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <button type="submit" className="parent-btn-primary">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Right Column: Linked Students & Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Linked Children */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <div className="parent-panel-title">Linked Student Profiles</div>
              </div>
              <button
                type="button"
                className="parent-btn-primary"
                style={{ padding: '4px 10px', fontSize: 11.5 }}
                onClick={onOpenAddChild}
              >
                + Link Child
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {children.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={c.avatar}
                      alt={c.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{c.name}</strong>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>
                        {c.grade} &bull; ID: {c.studentId}
                      </div>
                    </div>
                  </div>
                  <span className="parent-status-badge active">Verified Link</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <div className="parent-panel-title">Alert & Notification Channels</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Term Grades & Report Cards</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>Email alerts whenever exam grades are released</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.gradeAlerts}
                  onChange={(e) => setNotifications({ ...notifications, gradeAlerts: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#10b981' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Instant Absence & Attendance SMS</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>Immediate text message if child is flagged absent</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.attendanceAlerts}
                  onChange={(e) => setNotifications({ ...notifications, attendanceAlerts: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#10b981' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Tuition & Fee Payment Reminders</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>Notifications before payment due dates</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.feeReminders}
                  onChange={(e) => setNotifications({ ...notifications, feeReminders: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#10b981' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Weekly Academic Digest</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>Comprehensive summary sent every Friday evening</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#10b981' }}
                />
              </label>
            </div>
          </div>

          {/* Security Credentials */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div className="parent-panel-title">Security & Password</div>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate}>
              <div className="parent-form-group">
                <label className="parent-form-label">New Password</label>
                <input
                  type="password"
                  className="parent-form-input"
                  placeholder="••••••••••••"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0' }}>
                <div>
                  <strong style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>Two-Factor Authentication (2FA)</strong>
                  <span style={{ fontSize: 11.5, color: '#64748b' }}>Require SMS verification code on login</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: twoFactor ? '#ecfdf5' : '#f1f5f9',
                    color: twoFactor ? '#047857' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {twoFactor ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <button type="submit" className="parent-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Update Password & Security
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
