import React, { useState } from 'react'

export function StudentClasses({ courses = [] }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  return (
    <div className="student-classes-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Enrolled Classes</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 &bull; Total Registered Credits: 18 Units
          </p>
        </div>
        <div className="student-page-actions">
          <span className="student-badge student-badge-success" style={{ padding: '6px 12px', fontSize: 13 }}>
            Registration Verified & Approved
          </span>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {courses.map((course) => (
          <div key={course.code} className="student-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#0f766e',
                    fontWeight: 700,
                    fontSize: 12,
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1px solid #a7f3d0',
                  }}
                >
                  {course.code}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '8px 0 2px' }}>
                  {course.title}
                </h3>
              </div>
              <span className="student-badge student-badge-neutral">{course.credits} Credits</span>
            </div>

            <div style={{ fontSize: 13, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, margin: '10px 0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Lecturer: <strong>{course.instructor}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Schedule: {course.schedule}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Venue: {course.room}</span>
              </div>
            </div>

            {/* Course completion progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Syllabus Covered</span>
                <span style={{ fontWeight: 700, color: '#0f766e' }}>{course.attendanceRate || '90%'}</span>
              </div>
              <div style={{ width: '100%', height: 6, backgroundColor: '#e2e8f0', borderRadius: 999 }}>
                <div
                  style={{
                    width: course.attendanceRate || '90%',
                    height: '100%',
                    backgroundColor: '#0f766e',
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
              <button
                className="student-btn student-btn-secondary"
                style={{ flex: 1, fontSize: 12.5, padding: '7px 10px' }}
                onClick={() => setSelectedCourse(course)}
              >
                View Syllabus
              </button>
              <a
                href={`mailto:${course.instructor?.toLowerCase().replace(/[^a-z]/g, '') || 'lecturer'}@riverside.edu.ng`}
                className="student-btn student-btn-ghost-sm"
                style={{ color: '#0f766e', borderColor: '#cbd5e1', fontSize: 12.5 }}
                title="Email Lecturer"
              >
                Contact
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <div className="student-modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="student-modal-header">
              <h3 className="student-card-title">
                {selectedCourse.code} &mdash; Course Syllabus
              </h3>
              <button className="student-btn-ghost-sm" onClick={() => setSelectedCourse(null)}>
                &times;
              </button>
            </div>
            <div className="student-modal-body">
              <h4 style={{ margin: '0 0 6px 0', fontSize: 15, color: '#0f172a' }}>{selectedCourse.title}</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                This foundational course provides rigorous theoretical and laboratory experience. Topics include core paradigms, practical implementations, algorithmic analysis, and hands-on laboratory exercises.
              </p>
              <div style={{ marginTop: 12, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Key Modules:</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
                  <li>Week 1-3: Foundations, syntax, and memory models</li>
                  <li>Week 4-7: Core algorithms, complexity, and performance</li>
                  <li>Week 8: Mid-semester assessment & evaluation</li>
                  <li>Week 9-12: Advanced topics, laboratory project implementations</li>
                  <li>Week 13-14: Revision, review sessions, and semester examination</li>
                </ul>
              </div>
            </div>
            <div className="student-modal-footer">
              <button className="student-btn student-btn-primary" onClick={() => setSelectedCourse(null)}>
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default StudentClasses
