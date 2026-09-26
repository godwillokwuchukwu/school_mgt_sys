import React, { useState, useMemo } from 'react'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminReportsDashboard() {
  const { longDate, shortDate, monthYear } = useLiveDateTime()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [selectedIds, setSelectedIds] = useState([])
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [newReport, setNewReport] = useState({
    name: 'JSS 2A Academic Performance Summary',
    category: 'Academic',
    format: 'PDF',
    class: 'JSS 2A',
    term: '1st Term 2025/2026',
  })

  // Generated Report Vault
  const [reportHistory, setReportHistory] = useState([
    { id: 1, name: 'JSS 2A Terminal Academic Performance Report', category: 'Academic', date: '20 Sep 2026', format: 'PDF', size: '2.4 MB', status: 'Ready' },
    { id: 2, name: 'Term 1 Fee Collections & Bursary Reconciliation', category: 'Financial', date: '18 Sep 2026', format: 'Excel', size: '1.8 MB', status: 'Ready' },
    { id: 3, name: 'Whole-School Institutional Attendance Log', category: 'Attendance', date: '15 Sep 2026', format: 'PDF', size: '3.1 MB', status: 'Ready' },
    { id: 4, name: `${monthYear} Staff Payroll & Tax Disbursals`, category: 'Payroll', date: shortDate, format: 'Excel', size: '1.2 MB', status: 'Ready' },
    { id: 5, name: 'Q3 Campus Operating Expenses Audit', category: 'Expenses', date: '22 Sep 2026', format: 'PDF', size: '4.5 MB', status: 'Ready' },
    { id: 6, name: '2025/2026 Admissions Pipeline & Conversion', category: 'Admissions', date: '12 Sep 2026', format: 'PDF', size: '1.6 MB', status: 'Ready' },
    { id: 7, name: 'Faculty Workload & Staff Duty Schedule Audit', category: 'HR', date: '10 Sep 2026', format: 'Excel', size: '950 KB', status: 'Ready' },
  ])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredReports = useMemo(() => {
    return reportHistory.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase())
      const matchTab = activeTab === 'All' || r.category === activeTab
      const matchFormat = formatFilter === 'All' || r.format === formatFilter
      return matchSearch && matchTab && matchFormat
    })
  }, [reportHistory, search, activeTab, formatFilter])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize))
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredReports.slice(start, start + pageSize)
  }, [filteredReports, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedReports.length && paginatedReports.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedReports.map((r) => r.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    const created = {
      id: Date.now(),
      name: newReport.name,
      category: newReport.category,
      date: shortDate,
      format: newReport.format,
      size: '2.1 MB',
      status: 'Ready',
    }
    setReportHistory([created, ...reportHistory])
    setGenerating(false)
    setGenerateModalOpen(false)
    showToast(`Generated report: "${created.name}"!`)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'report.generated',
          description: `Generated institutional report "${created.name}" (${created.category}, ${created.format})`,
          details: created
        })
      })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    } catch (err) {
      console.error(err)
    }
  }

  const startEntry = filteredReports.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredReports.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header (Gold Standard) */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reports & Archives</h1>
          <p className="admin-page-subtitle">
            Compile, generate and download institutional audit reports across student academics, finance, roll call, and payroll.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={() => showToast('Batch download started for selected reports!')}>
            <span>Batch Download</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setGenerateModalOpen(true)}>
            <span>+ Generate Report</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
          <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#065f46', fontSize: 14 }} onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* 2. Sub-tabs Navigation */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        {['All', 'Academic', 'Financial', 'Attendance', 'Payroll', 'Expenses', 'Admissions'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setCurrentPage(1)
            }}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 600,
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === tab ? '2.5px solid #09261d' : '2.5px solid transparent',
              color: activeTab === tab ? '#09261d' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* 3. 4-KPI Grid (Matching Gold Standard) */}
      <div className="admin-4kpi-grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Archived Reports</span>
          </div>
          <div className="admin-kpi-number">{reportHistory.length} Files</div>
          <div className="admin-kpi-trend up">
            <span>Verified</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>official dossiers</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="admin-kpi-title">Academic Scorecards</span>
          </div>
          <div className="admin-kpi-number">6 Cohorts</div>
          <div className="admin-kpi-trend up">
            <span>Terminal Sheets</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>ready</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box fees">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Financial Audit</span>
          </div>
          <div className="admin-kpi-number">100% Balanced</div>
          <div className="admin-kpi-trend up">
            <span>Reconciled</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>fees vs expenses</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="admin-kpi-title">Format Support</span>
          </div>
          <div className="admin-kpi-number">PDF • XLS • CSV</div>
          <div className="admin-kpi-trend neutral">
            <span>Instant</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>generation</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Row */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search report title, department, format..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)}>
          <option value="All">Format: All Formats</option>
          <option value="PDF">PDF Documents</option>
          <option value="Excel">Excel Spreadsheets</option>
        </select>

        <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
          <span>{longDate}</span>
        </div>
      </div>

      {/* 4. Table Panel */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedIds.length === paginatedReports.length && paginatedReports.length > 0}
                onChange={handleSelectAll}
              />
              <span>Bulk actions ▼</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#64748b' }}>
            Official Institutional Report Dossiers
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedReports.length && paginatedReports.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 40 }}>#</th>
                <th>Report Title</th>
                <th>Category</th>
                <th>Generated On</th>
                <th>Format</th>
                <th>File Size</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: 40 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <strong>No reports match your search criteria</strong>
                  </td>
                </tr>
              ) : (
                paginatedReports.map((r, idx) => {
                  const isSelected = selectedIds.includes(r.id)
                  const displayNum = (currentPage - 1) * pageSize + idx + 1
                  return (
                    <tr
                      key={r.id}
                      style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(r.id)}
                        />
                      </td>
                      <td style={{ color: '#64748b' }}>{displayNum}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#09261d' }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Riverside Academy Certified Export</div>
                      </td>
                      <td>
                        <span className="admin-pill class-ss">{r.category}</span>
                      </td>
                      <td style={{ color: '#475569' }}>{r.date}</td>
                      <td>
                        <span className="admin-pill class-jss">{r.format}</span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: 12 }}>{r.size}</td>
                      <td>
                        <span className="admin-pill paid">● {r.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn-outline"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => showToast(`Downloaded "${r.name}" (${r.format})!`)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
          <div>Showing {startEntry} to {endEntry} of {filteredReports.length} reports</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              className="admin-btn-outline"
              style={{ padding: '4px 8px', fontSize: 11, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum
              return (
                <button
                  key={pageNum}
                  style={{
                    padding: '4px 9px',
                    fontSize: 11.5,
                    fontWeight: isActive ? 800 : 500,
                    borderRadius: 6,
                    background: isActive ? '#09261d' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    border: isActive ? '1px solid #09261d' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              className="admin-btn-outline"
              style={{ padding: '4px 8px', fontSize: 11, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Generate Report */}
      {generateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 460, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Generate Institutional Report</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Compile live database records into a certified PDF or Excel document.
            </p>

            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Report Title
                </label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newReport.category}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Financial">Financial</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Expenses">Expenses</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Target Format
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newReport.format}
                    onChange={(e) => setNewReport({ ...newReport, format: e.target.value })}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Excel">Excel Spreadsheet</option>
                    <option value="CSV">Raw CSV</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setGenerateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={generating}>
                  {generating ? 'Compiling Dossier...' : 'Generate & Download'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
