import React, { useState } from 'react'

export function StudentAssignments({ assignments = [], onOpenSubmitModal }) {
  const [filter, setFilter] = useState('All')

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'All') return true
    return a.status.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="student-assignments-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Course Assignments</h1>
          <p className="student-page-subtitle">
            Track deadlines, submit deliverables, and review lecturer feedback.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['All', 'Pending', 'Submitted', 'Graded'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`student-btn ${filter === status ? 'student-btn-primary' : 'student-btn-secondary'}`}
            style={{ fontSize: 13, padding: '7px 14px' }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Assignments Table */}
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Max Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((asg) => (
              <tr key={asg.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{asg.title}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>{asg.description || 'Lab report and code implementation'}</div>
                </td>
                <td>
                  <span
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#0f766e',
                      fontWeight: 700,
                      fontSize: 12,
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {asg.course}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{asg.dueDate}</td>
                <td>{asg.points || '100 pts'}</td>
                <td>
                  <span
                    className={`student-badge student-badge-${
                      asg.status === 'Submitted'
                        ? 'info'
                        : asg.status === 'Graded'
                        ? 'success'
                        : 'warning'
                    }`}
                  >
                    {asg.status}
                  </span>
                </td>
                <td>
                  {asg.status === 'Pending' ? (
                    <button
                      className="student-btn student-btn-primary"
                      style={{ fontSize: 12, padding: '6px 12px' }}
                      onClick={() => onOpenSubmitModal(asg)}
                    >
                      Submit Now
                    </button>
                  ) : (
                    <button
                      className="student-btn student-btn-secondary"
                      style={{ fontSize: 12, padding: '6px 12px' }}
                      onClick={() => alert(`Submission File: assignment_${asg.id}.pdf\nStatus: ${asg.status}`)}
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default StudentAssignments
