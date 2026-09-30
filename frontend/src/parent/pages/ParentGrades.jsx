import React, { useState } from 'react'

export default function ParentGrades({
  children = [],
  selectedChild,
  onSelectChild,
}) {
  const child = selectedChild || children[0]
  const [selectedTerm, setSelectedTerm] = useState('Term 3 - 2024/2025')
  if (!child) return null

  const handleDownloadReport = () => {
    alert(`Downloading official Term 3 Report Card for ${child.name} (PDF)...`)
  }

  return (
    <div className="parent-grades-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Grades & Assessment</h1>
          <p className="parent-page-subtitle">
            Comprehensive examination records, test scores, and term report cards for <strong>{child.name}</strong>.
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

          <select
            className="parent-child-dropdown-select"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="Term 3 - 2024/2025">Term 3 - 2024/2025 (Current)</option>
            <option value="Term 2 - 2024/2025">Term 2 - 2024/2025</option>
            <option value="Term 1 - 2024/2025">Term 1 - 2024/2025</option>
          </select>

          <button
            type="button"
            className="parent-btn-primary"
            onClick={handleDownloadReport}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download Report Card (PDF)
          </button>
        </div>
      </div>

      {/* Term Standing Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #09261d 0%, #134e3c 100%)',
          color: '#ffffff',
          borderRadius: 14,
          padding: '24px 28px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Academic Term Summary &bull; {selectedTerm}
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px', color: '#ffffff' }}>
            {child.name} &bull; {child.grade}
          </h2>
          <div style={{ fontSize: 13.5, color: '#cbd5e1' }}>
            Standing: <strong style={{ color: '#34d399' }}>Principal’s Honor Roll (Distinction)</strong> &bull; Class Rank: <strong>3rd of 38</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11.5, color: '#94a3b8', textTransform: 'uppercase' }}>TERM GPA</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {child.gpa?.toFixed(2)}
            </div>
            <span style={{ fontSize: 11, color: '#10b981' }}>Scale 4.00</span>
          </div>

          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 24 }}>
            <div style={{ fontSize: 11.5, color: '#94a3b8', textTransform: 'uppercase' }}>TOTAL CREDITS</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {child.completedCredits}
            </div>
            <span style={{ fontSize: 11, color: '#34d399' }}>All 6 Earned</span>
          </div>
        </div>
      </div>

      {/* Full Grades Table */}
      <div className="parent-panel-card" style={{ marginBottom: 24 }}>
        <div className="parent-panel-header">
          <div className="parent-panel-title-wrap">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
            <div>
              <div className="parent-panel-title">Itemized Subject Marks & Scores</div>
              <span className="parent-panel-subtitle">Calculated using 40% Continuous Assessment (CA) + 60% Final Examination</span>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: 11.5 }}>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>CODE</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>COURSE TITLE</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>TEACHER</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'center' }}>CR</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'center' }}>CA (40%)</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'center' }}>EXAM (60%)</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'center' }}>TOTAL</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'center' }}>GRADE</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {(child.subjects || []).map((sub) => {
                const caScore = Math.round(sub.score * 0.38)
                const examScore = sub.score - caScore
                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#0f172a' }}>{sub.code}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1e293b' }}>{sub.name}</td>
                    <td style={{ padding: '12px 10px', color: '#64748b' }}>{sub.teacher}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: '#64748b' }}>{sub.credits || 1}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: '#334155' }}>{caScore}/40</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', color: '#334155' }}>{examScore}/60</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 800, color: '#09261d', fontSize: 14 }}>
                      {sub.score}%
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 800,
                          background: sub.grade.startsWith('A') ? '#ecfdf5' : '#eff6ff',
                          color: sub.grade.startsWith('A') ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                        {sub.status || 'Excellent'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Scale Legend */}
      <div className="parent-panel-card">
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
          Standard Riverside College Grading & GPA Scale Reference:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#047857', fontSize: 14 }}>A (90 - 100%)</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>4.00 Grade Points &bull; Distinction</div>
          </div>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#059669', fontSize: 14 }}>A- (85 - 89%)</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>3.70 Grade Points &bull; Excellent</div>
          </div>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#2563eb', fontSize: 14 }}>B+ (80 - 84%)</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>3.30 Grade Points &bull; Very Good</div>
          </div>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#475569', fontSize: 14 }}>B (75 - 79%)</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>3.00 Grade Points &bull; Good</div>
          </div>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#d97706', fontSize: 14 }}>C (65 - 74%)</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>2.00 Grade Points &bull; Credit Pass</div>
          </div>
        </div>
      </div>
    </div>
  )
}
