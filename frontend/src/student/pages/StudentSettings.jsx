import React, { useState } from 'react'

export function StudentSettings({ student, showToast }) {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [twoFactor, setTwoFactor] = useState(true)

  const handleSaveSecurity = (e) => {
    e.preventDefault()
    if (showToast) showToast('Security settings and password updated successfully! ✓')
    else alert('Security settings updated!')
  }

  return (
    <div className="student-settings-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Account Settings & Security</h1>
          <p className="student-page-subtitle">
            Manage your student portal authentication, notification preferences, and privacy.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Security & Password Card */}
        <div className="student-card">
          <div className="student-card-header">
            <h3 className="student-card-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0f766e" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Change Student Portal Password
            </h3>
          </div>

          <form onSubmit={handleSaveSecurity} style={{ maxWidth: 540 }}>
            <div className="student-form-group" style={{ marginBottom: 14 }}>
              <label className="student-form-label">Current Password</label>
              <input type="password" required className="student-form-input" placeholder="••••••••" />
            </div>

            <div className="student-form-group" style={{ marginBottom: 14 }}>
              <label className="student-form-label">New Password (Min. 8 characters)</label>
              <input type="password" required className="student-form-input" placeholder="••••••••" />
            </div>

            <div className="student-form-group" style={{ marginBottom: 18 }}>
              <label className="student-form-label">Confirm New Password</label>
              <input type="password" required className="student-form-input" placeholder="••••••••" />
            </div>

            <button type="submit" className="student-btn student-btn-primary">
              Update Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication & Preferences */}
        <div className="student-card">
          <div className="student-card-header">
            <h3 className="student-card-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0f766e" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Multi-Factor Authentication & Notifications
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Two-Factor Authentication (2FA)</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Require OTP confirmation on login from unrecognized browsers.</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#0f766e', cursor: 'pointer' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Email Course & Assignment Notifications</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Receive instant email summaries when new assignments or grades are posted.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#0f766e', cursor: 'pointer' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>SMS Alerts for Examination and Bursary Deadlines</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Send critical SMS alerts to {student?.phone || '+234 803 123 4567'}.</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#0f766e', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Support & Help Desk */}
        <div className="student-card" style={{ backgroundColor: '#f8fafc' }}>
          <h3 className="student-card-title" style={{ marginBottom: 8 }}>
            Need Support or Technical Assistance?
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px 0' }}>
            Riverside College ICT Support is available Monday to Friday, 8:00 AM – 5:00 PM.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#0f172a' }}>
            <div><strong>Email:</strong> helpdesk@riverside.edu.ng</div>
            <div>&bull;</div>
            <div><strong>Hotline:</strong> +234 1 234 5678</div>
            <div>&bull;</div>
            <div><strong>Location:</strong> ICT Centre, Ground Floor, Senate Building</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentSettings
