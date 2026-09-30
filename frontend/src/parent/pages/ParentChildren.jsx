import React from 'react'

export default function ParentChildren({
  children = [],
  selectedChild,
  onSelectChild,
  onNavigate,
  onOpenAddChild,
  onOpenPayment,
}) {
  return (
    <div className="parent-children-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">My Children</h1>
          <p className="parent-page-subtitle">
            Comprehensive profiles and enrolled academic records for all students linked to your parent account.
          </p>
        </div>
        <button
          type="button"
          className="parent-btn-primary"
          onClick={onOpenAddChild}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Link Another Child
        </button>
      </div>

      {/* Children Directory Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
        {children.map((child) => {
          const isSelected = selectedChild?.id === child.id
          return (
            <div
              key={child.id}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 16,
                  paddingBottom: 20,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <img
                    src={child.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={child.name}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #ecfdf5',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#09261d', margin: 0 }}>
                        {child.name}
                      </h2>
                      <span className="parent-status-badge active">{child.status || 'Active'}</span>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#059669',
                            background: '#ecfdf5',
                            padding: '2px 8px',
                            borderRadius: 9999,
                          }}
                        >
                          Currently Selected
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#475569', marginTop: 4, fontWeight: 500 }}>
                      <strong>{child.grade}</strong> &bull; {child.department}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                      Student ID: <code style={{ color: '#0f172a', fontWeight: 600 }}>{child.studentId}</code> &bull; Class Teacher: <span style={{ color: '#334155' }}>{child.classTeacher}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectChild(child.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: isSelected ? '#ecfdf5' : '#f8fafc',
                    color: isSelected ? '#047857' : '#334155',
                    border: isSelected ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  {isSelected ? '✓ Selected Child' : 'Select as Primary'}
                </button>
              </div>

              {/* 4 Metrics Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 16,
                  padding: '18px 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>CUMULATIVE GPA</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#09261d' }}>{child.gpa?.toFixed(2)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{child.gpaTrend || '+0.2'}</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>ATTENDANCE RATE</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#09261d' }}>{child.attendanceRate}%</span>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>({child.daysPresent} Present)</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>TERM CREDITS</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#09261d' }}>{child.completedCredits} / {child.totalCredits}</span>
                    <span style={{ fontSize: 11.5, color: '#10b981', fontWeight: 600 }}>100%</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>FEES BALANCE</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: child.feesDue > 0 ? '#b91c1c' : '#059669' }}>
                      ${child.feesDue?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {child.feesDue > 0 ? 'Pending' : 'Cleared'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses Chips */}
              <div style={{ paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, letterSpacing: '0.02em' }}>
                  ENROLLED SUBJECTS & CURRENT PERFORMANCE:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                  {(child.subjects || []).map((sub) => (
                    <div
                      key={sub.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{sub.name}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: sub.grade.startsWith('A') ? '#ecfdf5' : '#eff6ff',
                          color: sub.grade.startsWith('A') ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {sub.grade}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subpage Links Navigation */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button
                    type="button"
                    className="parent-action-btn"
                    style={{ flex: 1, minWidth: 150 }}
                    onClick={() => {
                      onSelectChild(child.id)
                      onNavigate('Progress')
                    }}
                  >
                    <div className="parent-action-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    </div>
                    <div className="parent-action-texts">
                      <div>Academic Progress</div>
                      <div>Mastery & charts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="parent-action-btn"
                    style={{ flex: 1, minWidth: 150 }}
                    onClick={() => {
                      onSelectChild(child.id)
                      onNavigate('Attendance')
                    }}
                  >
                    <div className="parent-action-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                      </svg>
                    </div>
                    <div className="parent-action-texts">
                      <div>Attendance Log</div>
                      <div>Monthly calendar</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="parent-action-btn"
                    style={{ flex: 1, minWidth: 150 }}
                    onClick={() => {
                      onSelectChild(child.id)
                      onNavigate('Timetable')
                    }}
                  >
                    <div className="parent-action-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="10" x2="10" y1="14" y2="18" />
                      </svg>
                    </div>
                    <div className="parent-action-texts">
                      <div>Class Timetable</div>
                      <div>Weekly schedule</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="parent-action-btn"
                    style={{ flex: 1, minWidth: 150 }}
                    onClick={() => {
                      onSelectChild(child.id)
                      if (child.feesDue > 0) {
                        onOpenPayment()
                      } else {
                        onNavigate('Fees')
                      }
                    }}
                  >
                    <div className="parent-action-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div className="parent-action-texts">
                      <div>Fees & Ledger</div>
                      <div>{child.feesDue > 0 ? `Pay $${child.feesDue}` : 'Statements'}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Student Milestones */}
      <div className="parent-panel-card">
        <div className="parent-panel-header">
          <div className="parent-panel-title-wrap">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <div>
              <div className="parent-panel-title">Recent Academic Milestones & Activities</div>
              <span className="parent-panel-subtitle">Recorded verified institutional highlights</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 13.5, color: '#0f172a' }}>Daniel Johnson &bull; Computer Science Practical Quiz</strong>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Sep 22, 2025</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#475569' }}>
                Scored 95% on Algorithm Complexity lab assessment. Commended by Mr. Akinola for excellent algorithmic design.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 13.5, color: '#0f172a' }}>Emily Johnson &bull; English Department Debate Competition</strong>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Sep 21, 2025</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#475569' }}>
                Awarded Outstanding Orator badge in the Inter-Junior Secondary literary contest with 94/100 points.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', marginTop: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 13.5, color: '#0f172a' }}>Daniel Johnson &bull; Science Practical Safety Certification</strong>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Sep 19, 2025</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#475569' }}>
                Passed all lab protocol certifications required for Senior Secondary chemistry practicals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
