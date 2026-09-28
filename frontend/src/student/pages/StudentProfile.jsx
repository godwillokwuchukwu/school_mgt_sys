import React, { useState } from 'react'

export function StudentProfile({ student, onUpdateProfile, showToast }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [formData, setFormData] = useState({
    fullName: student?.fullName || 'Chinedu Okafor',
    phone: student?.phone || '+234 803 123 4567',
    email: student?.email || 'chinedu.okafor@riverside.edu.ng',
    address: student?.address || 'Block B, Hall 4, Riverside Campus, Lagos',
    emergencyName: student?.emergencyContact?.name || 'Emeka Okafor',
    emergencyPhone: student?.emergencyContact?.phone || '+234 802 987 6543',
    emergencyEmail: student?.emergencyContact?.email || 'emeka.okafor@gmail.com',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onUpdateProfile) {
      onUpdateProfile(formData)
    }
    setIsEditing(false)
    if (showToast) showToast('Profile details updated successfully! ✓')
  }

  const initials = student?.fullName
    ? student.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CO'

  return (
    <div className="student-profile-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">My Profile</h1>
          <p className="student-page-subtitle">
            View and manage your personal information and academic records.
          </p>
        </div>
        <div className="student-page-actions">
          <button
            className={`student-btn ${isEditing ? 'student-btn-secondary' : 'student-btn-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <div
        className="student-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: 24,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f766e, #065f46)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {student?.fullName || 'Chinedu Okafor'}
            </h2>
            <span className="student-badge student-badge-success">Active Enrolled</span>
          </div>
          <div style={{ fontSize: 13.5, color: '#475569', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span><strong>Student ID:</strong> {student?.studentId || 'CS2024'}</span>
            <span>&bull;</span>
            <span><strong>Department:</strong> {student?.department || 'Computer Science'}</span>
            <span>&bull;</span>
            <span><strong>Level:</strong> {student?.level || '100 Level'}</span>
            <span>&bull;</span>
            <span><strong>Session:</strong> {student?.session || '2025/2026'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        {[
          { id: 'personal', label: 'Personal Information' },
          { id: 'academic', label: 'Academic Details' },
          { id: 'contact', label: 'Contact & Address' },
          { id: 'emergency', label: 'Emergency Contact' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #0f766e' : '2px solid transparent',
              color: activeTab === tab.id ? '#0f766e' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Details or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="student-card" style={{ padding: 24 }}>
          <h3 className="student-card-title" style={{ marginBottom: 20 }}>
            Edit Contact & Profile Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginBottom: 24 }}>
            <div className="student-form-group">
              <label className="student-form-label">Full Name</label>
              <input
                type="text"
                className="student-form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Phone Number</label>
              <input
                type="text"
                className="student-form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Email Address</label>
              <input
                type="email"
                className="student-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Residential Address</label>
              <input
                type="text"
                className="student-form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Emergency Contact Name</label>
              <input
                type="text"
                className="student-form-input"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Emergency Contact Phone</label>
              <input
                type="text"
                className="student-form-input"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="student-btn student-btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="student-btn student-btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="student-card" style={{ padding: 24 }}>
          {activeTab === 'personal' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Full Legal Name</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Date of Birth</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.dob || 'May 14, 2004'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Gender</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.gender || 'Male'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Nationality</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>Nigerian</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>State of Origin</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>Anambra State</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Blood Group / Genotype</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>O+ / AA</div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Department</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.department}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Faculty</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>School of Computing & Information Tech</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Academic Advisor</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.advisor || 'Dr. K. Adeyemi'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Matriculation / Student ID</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.studentId}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Current Level</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.level}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Enrollment Session</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>2025/2026 Academic Session</div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Institutional Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Phone Number</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.phone}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>Campus / Residential Address</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{student?.address}</div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Next of Kin / Contact Name</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>
                  {student?.emergencyContact?.name || 'Emeka Okafor'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Relationship</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>
                  {student?.emergencyContact?.relationship || 'Father'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Emergency Phone</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>
                  {student?.emergencyContact?.phone || '+234 802 987 6543'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Emergency Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>
                  {student?.emergencyContact?.email || 'emeka.okafor@gmail.com'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default StudentProfile
