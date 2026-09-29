import React, { useState } from 'react'

export function StudentDocuments({ documents = [], onOpenUploadModal, showToast }) {
  const [filter, setFilter] = useState('All')

  const filteredDocs = documents.filter((doc) => {
    if (filter === 'All') return true
    return (doc.category || '').toLowerCase() === filter.toLowerCase()
  })

  const handleDownload = (docName) => {
    if (showToast) showToast(`Downloading ${docName}... ✓`)
    else alert(`Downloading ${docName}`)
  }

  return (
    <div className="student-documents-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Official Documents & Credentials</h1>
          <p className="student-page-subtitle">
            Access, download, and manage your institutional academic certificates and records.
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-primary" onClick={onOpenUploadModal}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Document
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['All', 'Academic', 'Identification', 'Financial', 'Medical'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`student-btn ${filter === cat ? 'student-btn-primary' : 'student-btn-secondary'}`}
            style={{ fontSize: 13, padding: '7px 14px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>Date Issued</th>
              <th>File Size</th>
              <th>Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 6,
                        backgroundColor: '#f1f5f9',
                        color: '#0f766e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{doc.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>Riverside College Registry Verified</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="student-badge student-badge-neutral">{doc.category}</span>
                </td>
                <td>{doc.date}</td>
                <td>{doc.size}</td>
                <td>
                  <span className="student-badge student-badge-success">{doc.status || 'Verified'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="student-btn student-btn-secondary"
                      style={{ fontSize: 12, padding: '5px 10px' }}
                      onClick={() => handleDownload(doc.name)}
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default StudentDocuments
