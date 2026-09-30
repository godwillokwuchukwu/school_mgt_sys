import React, { useState } from 'react'

export default function ParentDocuments({
  children = [],
  selectedChild,
  onSelectChild,
}) {
  const child = selectedChild || children[0]
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  if (!child) return null

  const docs = child.documents || []
  const filteredDocs = docs.filter((doc) => {
    const matchesTab = activeTab === 'All' || doc.type === activeTab
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleDownload = (name) => {
    alert(`Downloading ${name}...`)
  }

  const handleUploadClick = () => {
    const file = prompt('Enter document name to upload (e.g. Immunization_Update.pdf):')
    if (file && file.trim()) {
      docs.unshift({
        id: `doc-${Date.now()}`,
        name: file.trim(),
        type: 'Medical',
        date: 'Today',
        size: '1.4 MB',
      })
      alert(`File "${file.trim()}" uploaded successfully. Verified by Registrar office.`)
    }
  }

  return (
    <div className="parent-documents-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Student Documents & Records</h1>
          <p className="parent-page-subtitle">
            Access institutional transcripts, receipts, medical records, and permissions for <strong>{child.name}</strong>.
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

          <button
            type="button"
            className="parent-btn-primary"
            onClick={handleUploadClick}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Upload Parent Document
          </button>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div className="parent-subtabs" style={{ margin: 0 }}>
          {['All', 'Academic', 'Financial', 'Medical', 'Others'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`parent-subtab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'All Documents' : tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            className="parent-form-input"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 34, height: 38 }}
          />
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: 12 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Documents Table */}
      <div className="parent-panel-card" style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: 11.5 }}>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>DOCUMENT NAME</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>CATEGORY</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>STUDENT</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>DATE ADDED</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>SIZE</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                    No matching documents found in this category.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 6,
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a', display: 'block', fontSize: 13.5 }}>{doc.name}</strong>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>PDF Document &bull; Verified</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background:
                            doc.type === 'Academic'
                              ? '#ecfdf5'
                              : doc.type === 'Financial'
                              ? '#eff6ff'
                              : doc.type === 'Medical'
                              ? '#fef2f2'
                              : '#f1f5f9',
                          color:
                            doc.type === 'Academic'
                              ? '#047857'
                              : doc.type === 'Financial'
                              ? '#1d4ed8'
                              : doc.type === 'Medical'
                              ? '#b91c1c'
                              : '#475569',
                        }}
                      >
                        {doc.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', color: '#475569' }}>{child.name}</td>
                    <td style={{ padding: '14px 10px', color: '#64748b' }}>{doc.date}</td>
                    <td style={{ padding: '14px 10px', color: '#64748b' }}>{doc.size}</td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDownload(doc.name)}
                        style={{
                          background: '#09261d',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Download &darr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Drop Zone Box */}
      <div
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: 14,
          padding: '32px 20px',
          textAlign: 'center',
          background: '#ffffff',
          cursor: 'pointer',
        }}
        onClick={handleUploadClick}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>
        <strong style={{ fontSize: 15, color: '#09261d', display: 'block' }}>
          Upload Medical Certificates, Leave Excuses, or Consent Forms
        </strong>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b' }}>
          Drag and drop files here, or click to browse. Max size: 10MB (PDF, DOCX, PNG, JPG).
        </p>
      </div>
    </div>
  )
}
