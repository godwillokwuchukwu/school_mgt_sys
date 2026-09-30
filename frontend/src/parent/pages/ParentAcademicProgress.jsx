import React from 'react'

export default function ParentAcademicProgress({
  children = [],
  selectedChild,
  onSelectChild,
}) {
  const child = selectedChild || children[0]
  if (!child) return null

  const subjects = child.subjects || []
  const topSubject = [...subjects].sort((a, b) => b.score - a.score)[0]

  return (
    <div className="parent-progress-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Academic Progress</h1>
          <p className="parent-page-subtitle">
            Track performance analytics, subject masteries, and GPA trajectory for <strong>{child.name}</strong>.
          </p>
        </div>

        {/* Child Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Select Child:</label>
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
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="parent-kpi-grid">
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Cumulative GPA</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{child.gpa?.toFixed(2)}</span>
            <span className="parent-kpi-trend up">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {child.gpaTrend || '+0.2'}
            </span>
          </div>
          <span className="parent-kpi-sub">Out of 4.00 Scale</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Highest Subject</span>
            <div className="parent-kpi-icon-wrap blue">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val" style={{ fontSize: 20 }}>{topSubject ? topSubject.name : 'N/A'}</span>
          </div>
          <span className="parent-kpi-sub">
            {topSubject ? `${topSubject.score}% (${topSubject.grade})` : 'No data'}
          </span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Class Standing</span>
            <div className="parent-kpi-icon-wrap purple">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">Top 5%</span>
          </div>
          <span className="parent-kpi-sub">Principal's Honor List</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Credits Completed</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">{child.completedCredits} / {child.totalCredits}</span>
          </div>
          <span className="parent-kpi-sub">All requirements met</span>
        </div>
      </div>

      {/* Main Grid: Subject Mastery Breakdown & GPA Progression */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Subject Mastery Breakdown */}
        <div className="parent-panel-card">
          <div className="parent-panel-header">
            <div className="parent-panel-title-wrap">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <div>
                <div className="parent-panel-title">Subject Mastery & Course Breakdown</div>
                <span className="parent-panel-subtitle">Term 3 continuous assessment & exam benchmarks</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {subjects.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '14px 18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 14.5, color: '#0f172a' }}>{s.name}</strong>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>({s.code})</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      Teacher: {s.teacher} &bull; {s.room} &bull; {s.credits} Credit
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#09261d' }}>{s.score}%</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: s.grade.startsWith('A') ? '#ecfdf5' : '#eff6ff',
                          color: s.grade.startsWith('A') ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {s.grade}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>{s.status}</span>
                  </div>
                </div>

                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${s.score}%`,
                      height: '100%',
                      background: s.score >= 90 ? '#10b981' : s.score >= 80 ? '#3b82f6' : '#f59e0b',
                      borderRadius: 9999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Progression & Observations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* GPA Progression Chart */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <div>
                  <div className="parent-panel-title">GPA Progression Trend</div>
                  <span className="parent-panel-subtitle">Term-over-term growth</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, margin: '20px 0 10px' }}>
              {(child.gradeTrends || [
                { term: 'Term 1', gpa: 3.4 },
                { term: 'Term 2', gpa: 3.6 },
                { term: 'Term 3', gpa: child.gpa || 3.8 },
              ]).map((trend, i, arr) => (
                <div
                  key={trend.term}
                  style={{
                    flex: 1,
                    background: i === arr.length - 1 ? '#ecfdf5' : '#f8fafc',
                    border: i === arr.length - 1 ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '16px 12px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>{trend.term}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#09261d', margin: '6px 0 4px' }}>
                    {trend.gpa.toFixed(2)}
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: i === 0 ? '#64748b' : '#059669',
                      background: i === 0 ? '#f1f5f9' : '#d1fae5',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {i === 0 ? 'Baseline' : `+${(trend.gpa - arr[i - 1].gpa).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', margin: '8px 0 0' }}>
              Consistently climbing GPA demonstrates strong study discipline and comprehension.
            </p>
          </div>

          {/* Teacher Observations */}
          <div className="parent-panel-card">
            <div className="parent-panel-header">
              <div className="parent-panel-title-wrap">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <div>
                  <div className="parent-panel-title">Faculty Observations</div>
                  <span className="parent-panel-subtitle">Term 3 Teacher remarks</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
                <strong style={{ fontSize: 12.5, color: '#0f172a' }}>Mr. James Davis &bull; Mathematics</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
                  "{child.firstName} shows great analytical clarity in problem-solving. Encouraged to take advanced problem set assignments."
                </p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #3b82f6' }}>
                <strong style={{ fontSize: 12.5, color: '#0f172a' }}>Mr. Akinola &bull; Computer Science</strong>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
                  "Demonstrates natural aptitude for algorithms and programming fundamentals. Highly focused during lab sessions."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
