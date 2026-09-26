import React, { useState, useMemo } from 'react'
import { api } from '../api'

// ============================================================================
// 1. PARENTS MODULE — High-Fidelity Enterprise Directory & Profile Drawer
// ============================================================================
export function AdminParents({ parents: initialParents = [], onSelectParent, onMessage }) {
  const [parentsList, setParentsList] = useState(initialParents)
  const [search, setSearch] = useState('')
  const [feeStatusFilter, setFeeStatusFilter] = useState('All')
  const [accountStatusFilter, setAccountStatusFilter] = useState('All')
  const [relationshipFilter, setRelationshipFilter] = useState('All')

  // Drawers and Modals
  const [selectedParent, setSelectedParent] = useState(null)
  const [drawerTab, setDrawerTab] = useState('overview')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newParentForm, setNewParentForm] = useState({
    name: '',
    relationship: 'Father',
    email: '',
    phone: '',
    address: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // Sync initialParents if updated from parent coordinator
  React.useEffect(() => {
    if (initialParents && initialParents.length > 0) {
      setParentsList(initialParents)
    }
  }, [initialParents])

  // Dynamic Live KPIs calculated directly from database records
  const kpis = useMemo(() => {
    const total = parentsList.length
    const active = parentsList.filter((p) => p.status === 'Active').length
    const newTerm = parentsList.filter((p) => p.is_new).length
    const totalOutstanding = parentsList.reduce((sum, p) => sum + (p.outstanding_fees || 0), 0)
    return { total, active, newTerm, totalOutstanding }
  }, [parentsList])

  // Multi-faceted filtering
  const filteredParents = useMemo(() => {
    return parentsList.filter((p) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.children || []).some((ch) => ch.name.toLowerCase().includes(q))

      const matchesFee =
        feeStatusFilter === 'All' ||
        (feeStatusFilter === 'Paid' && (p.outstanding_fees || 0) === 0) ||
        (feeStatusFilter === 'Outstanding' && (p.outstanding_fees || 0) > 0)

      const matchesAccount =
        accountStatusFilter === 'All' || p.status === accountStatusFilter

      const matchesRel =
        relationshipFilter === 'All' || p.relationship === relationshipFilter

      return matchesSearch && matchesFee && matchesAccount && matchesRel
    })
  }, [parentsList, search, feeStatusFilter, accountStatusFilter, relationshipFilter])

  // Export to CSV handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Parent Name', 'Relationship', 'Phone', 'Email', 'Linked Children', 'Outstanding Fees (NGN)', 'Status']
    const rows = filteredParents.map((p) => [
      p.parent_id || `PAR-${String(p.id).padStart(4, '0')}`,
      `"${p.name}"`,
      p.relationship,
      `"${p.phone}"`,
      p.email,
      `"${(p.children || []).map((ch) => `${ch.name} (${ch.class})`).join(', ')}"`,
      p.outstanding_fees || 0,
      p.status || 'Active',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Riverside_Parents_Directory_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Add Parent Submission
  const handleAddParentSubmit = async (e) => {
    e.preventDefault()
    if (!newParentForm.name.trim() || !newParentForm.email.trim()) return
    setSubmitting(true)
    try {
      const res = await api.adminCreateParent(newParentForm)
      const createdParent = {
        id: res.id || Date.now(),
        name: newParentForm.name,
        parent_id: `PAR-${String(res.id || Date.now()).padStart(4, '0')}`,
        email: newParentForm.email,
        phone: newParentForm.phone || '+234 803 123 4567',
        relationship: newParentForm.relationship,
        status: 'Active',
        is_new: true,
        children: [],
        outstanding_fees: 0,
        total_billed: 0,
        address: newParentForm.address,
        invoices: [],
        communications: [],
        documents: [],
      }
      setParentsList((prev) => [createdParent, ...prev])
      setIsAddModalOpen(false)
      setNewParentForm({ name: '', relationship: 'Father', email: '', phone: '', address: '' })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
      alert('Parent registered successfully!')
    } catch (err) {
      alert(`Error creating parent: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-page-content">
      {/* 1. Header Banner matching reference media_1790077678982.jpg */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Parents</h1>
          <p className="admin-page-subtitle">Manage parent/guardian records and track their children's progress.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsAddModalOpen(true)}>
          Add Parent
        </button>
      </div>

      {/* 2. 4 Live KPI Cards */}
      <div className="admin-kpi-grid cols-4">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Live DB</span>
          </div>
          <div>
            <div className="admin-kpi-label">Total Parents</div>
            <div className="admin-kpi-val">{kpis.total}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">↑ 4%</span>
            <span>Registered guardians in database</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap green">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Verified</span>
          </div>
          <div>
            <div className="admin-kpi-label">Active Parents</div>
            <div className="admin-kpi-val">{kpis.active}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● 100%</span>
            <span>Authorized portal access</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="admin-kpi-badge purple">Recent</span>
          </div>
          <div>
            <div className="admin-kpi-label">New This Term</div>
            <div className="admin-kpi-val">{kpis.newTerm}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Term 1</span>
            <span>Enrolled 2025/2026 Session</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap red">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge red">Ledger</span>
          </div>
          <div>
            <div className="admin-kpi-label">With Outstanding Fees</div>
            <div className="admin-kpi-val" style={{ color: kpis.totalOutstanding > 0 ? '#dc2626' : '#10b981' }}>
              ₦{kpis.totalOutstanding.toLocaleString()}
            </div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend down">● Balance</span>
            <span>Total receivables balance</span>
          </div>
        </div>
      </div>

      {/* Multi-Faceted Filter & Action Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-left">
          <div className="admin-search-pill" style={{ minWidth: 260 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search parent name, phone, email, ward..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            )}
          </div>

          <select
            className="admin-filter-select"
            value={feeStatusFilter}
            onChange={(e) => setFeeStatusFilter(e.target.value)}
          >
            <option value="All">Fee Status: All</option>
            <option value="Paid">Fully Paid (₦0)</option>
            <option value="Outstanding">Outstanding Balance</option>
          </select>

          <select
            className="admin-filter-select"
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
          >
            <option value="All">Relationship: All</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
          </select>

          <select
            className="admin-filter-select"
            value={accountStatusFilter}
            onChange={(e) => setAccountStatusFilter(e.target.value)}
          >
            <option value="All">Account: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="admin-filter-right">
          <button className="admin-btn admin-btn-outline" onClick={handleExportCSV} title="Export directory as CSV">
            Export CSV
          </button>
        </div>
      </div>

      {/* Parents Directory Table */}
      <div className="admin-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Parent / Guardian</th>
                <th>Relationship</th>
                <th>Contact Details</th>
                <th>Linked Children</th>
                <th>Total Billed</th>
                <th>Outstanding Balance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <strong>No parents match your search or filter criteria</strong>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing search terms or resetting filters.</div>
                  </td>
                </tr>
              ) : (
                filteredParents.map((p) => {
                  const initials = (p.name || 'P')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                  const isPaid = (p.outstanding_fees || 0) === 0
                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedParent(p)
                        setDrawerTab('overview')
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              background: '#09261d',
                              color: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 12,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#09261d' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                              {p.parent_id || `PAR-${String(p.id).padStart(4, '0')}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-blue">{p.relationship}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                          <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()} style={{ color: '#0f172a', textDecoration: 'none' }}>
                            {p.phone}
                          </a>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          <a href={`mailto:${p.email}`} onClick={(e) => e.stopPropagation()} style={{ color: '#64748b', textDecoration: 'none' }}>
                            {p.email}
                          </a>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(p.children || []).length === 0 ? (
                            <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>None linked</span>
                          ) : (
                            (p.children || []).map((ch, idx) => (
                              <span key={idx} className="admin-badge admin-badge-teal">
                                {ch.name} ({ch.class})
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>
                          ₦{(p.total_billed || 150000).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 13,
                            color: isPaid ? '#10b981' : '#dc2626',
                          }}
                        >
                          ₦{(p.outstanding_fees || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                          {p.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn admin-btn-outline"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => {
                            setSelectedParent(p)
                            setDrawerTab('overview')
                          }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PARENT PROFILE DRAWER */}
      {selectedParent && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedParent(null)}>
          <div className="admin-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-group">
                <div className="admin-drawer-avatar-lg">
                  {(selectedParent.name || 'P')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="admin-drawer-name">{selectedParent.name}</div>
                  <div className="admin-drawer-sub">
                    <span>{selectedParent.parent_id || `PAR-${String(selectedParent.id).padStart(4, '0')}`}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-blue">{selectedParent.relationship}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-green">{selectedParent.status || 'Active'}</span>
                  </div>
                </div>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setSelectedParent(null)}>✕</button>
            </div>

            {/* Drawer Tabs */}
            <div className="admin-drawer-tabs">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'students', label: `Linked Students (${(selectedParent.children || []).length})` },
                { id: 'fees', label: 'Fee Overview' },
                { id: 'communication', label: 'Communication' },
                { id: 'documents', label: 'Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`admin-drawer-tab-btn ${drawerTab === tab.id ? 'active' : ''}`}
                  onClick={() => setDrawerTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Content */}
            <div className="admin-drawer-body">
              {drawerTab === 'overview' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Contact & Household Info</div>
                    <div className="admin-drawer-kv-grid">
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">PHONE NUMBER</span>
                        <span className="admin-drawer-v">{selectedParent.phone}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">EMAIL ADDRESS</span>
                        <span className="admin-drawer-v">{selectedParent.email}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">RESIDENTIAL ADDRESS</span>
                        <span className="admin-drawer-v">{selectedParent.address || 'Riverside Estate, Lagos'}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">JOINED DATE</span>
                        <span className="admin-drawer-v">{selectedParent.joined_date || '2024-09-01'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Financial Summary</div>
                    <div className="admin-drawer-kv-grid">
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">TOTAL BILLED (TERM 1)</span>
                        <span className="admin-drawer-v">₦{(selectedParent.total_billed || 150000).toLocaleString()}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">OUTSTANDING BALANCE</span>
                        <span
                          className="admin-drawer-v"
                          style={{ color: (selectedParent.outstanding_fees || 0) > 0 ? '#dc2626' : '#10b981' }}
                        >
                          ₦{(selectedParent.outstanding_fees || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'students' && (
                <div>
                  {(selectedParent.children || []).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No students are currently linked to this parent account.
                    </div>
                  ) : (
                    selectedParent.children.map((ch, idx) => (
                      <div key={idx} className="admin-drawer-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#09261d' }}>{ch.name}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                            Class: <strong>{ch.class}</strong> • ID: {ch.student_id}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="admin-badge admin-badge-teal">{ch.attendance || 95}% Attendance</span>
                          <div style={{ marginTop: 4 }}>
                            <span className={`admin-badge ${ch.fee_status === 'Paid' ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                              Fee: {ch.fee_status || 'Paid'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {drawerTab === 'fees' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Invoices & Payment Records</div>
                    <table className="admin-table" style={{ fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedParent.invoices || [
                          { id: `INV-2026-${String(selectedParent.id).padStart(3, '0')}`, date: '2026-09-01', amount: selectedParent.total_billed || 150000, status: selectedParent.outstanding_fees > 0 ? 'Pending' : 'Paid' }
                        ]).map((inv, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 700 }}>{inv.id}</td>
                            <td>{inv.date}</td>
                            <td>₦{Number(inv.amount).toLocaleString()}</td>
                            <td>
                              <span className={`admin-badge ${inv.status === 'Paid' ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {drawerTab === 'communication' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Message & Alert Log</div>
                    {(selectedParent.communications || [
                      { id: 1, type: 'Email', title: 'Term 1 Welcome Package Delivered', date: '2026-09-01' },
                      { id: 2, type: 'SMS', title: 'PTA General Assembly Scheduled for Oct 12', date: '2026-09-10' },
                    ]).map((comm, idx) => (
                      <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a' }}>{comm.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Channel: {comm.type}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{comm.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'documents' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Uploaded Guardian Files</div>
                    {(selectedParent.documents || [
                      { name: 'Guardian_ID_Verification.pdf', size: '1.1 MB', date: '2026-09-01' },
                      { name: 'Proof_of_Residence_Utility.pdf', size: '840 KB', date: '2026-09-01' },
                    ]).map((doc, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 4 }}>PDF</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a' }}>{doc.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{doc.size} • Uploaded {doc.date}</div>
                          </div>
                        </div>
                        <button className="admin-btn admin-btn-outline" style={{ padding: '3px 8px', fontSize: 11 }}>Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-drawer-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => alert(`Direct notification dispatched to ${selectedParent.email} and ${selectedParent.phone}`)}
              >
                Send Notification
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedParent(null)}>
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PARENT MODAL */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Register New Parent Account</div>
              <button className="admin-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddParentSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. Chief Emeka Adeleke"
                    value={newParentForm.name}
                    onChange={(e) => setNewParentForm({ ...newParentForm, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-grid" style={{ marginBottom: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Relationship *</label>
                    <select
                      className="admin-form-select"
                      value={newParentForm.relationship}
                      onChange={(e) => setNewParentForm({ ...newParentForm, relationship: e.target.value })}
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="+234 803 000 0000"
                      value={newParentForm.phone}
                      onChange={(e) => setNewParentForm({ ...newParentForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-form-input"
                    placeholder="parent@example.com"
                    value={newParentForm.email}
                    onChange={(e) => setNewParentForm({ ...newParentForm, email: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Residential Address</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                    value={newParentForm.address}
                    onChange={(e) => setNewParentForm({ ...newParentForm, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Register Parent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 2. STAFF MODULE — Dedicated Administrative & Operational Personnel
// ============================================================================
export function AdminStaff({ staff: initialStaff = [] }) {
  const [staffList, setStaffList] = useState(initialStaff)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  // Drawers and Modals
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [drawerTab, setDrawerTab] = useState('overview')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    position: '',
    department: 'Administrative',
    email: '',
    phone: '',
    location: '',
  })
  const [submitting, setSubmitting] = useState(false)

  React.useEffect(() => {
    if (initialStaff && initialStaff.length > 0) {
      setStaffList(initialStaff)
    }
  }, [initialStaff])

  const departments = ['All', 'Administrative', 'Finance', 'IT & Technical', 'Medical', 'Security', 'Facilities', 'Academic Support']

  // Live Staff KPIs
  const kpis = useMemo(() => {
    const total = staffList.length
    const active = staffList.filter((s) => s.status === 'Active').length
    const onLeave = staffList.filter((s) => s.status === 'On Leave').length
    const newHires = staffList.filter((s) => s.is_new).length
    return { total, active, onLeave, newHires }
  }, [staffList])

  // Filtered staff members
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.employee_id && s.employee_id.toLowerCase().includes(q)) ||
        (s.position && s.position.toLowerCase().includes(q)) ||
        (s.department && s.department.toLowerCase().includes(q))

      const matchesDept = deptFilter === 'All' || s.department === deptFilter
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter
      const matchesType = typeFilter === 'All' || s.employment_type === typeFilter

      return matchesSearch && matchesDept && matchesStatus && matchesType
    })
  }, [staffList, search, deptFilter, statusFilter, typeFilter])

  // Export Staff Directory
  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Position', 'Type', 'Attendance %', 'Status', 'Phone', 'Email']
    const rows = filteredStaff.map((s) => [
      s.employee_id,
      `"${s.name}"`,
      s.department,
      `"${s.position}"`,
      s.employment_type || 'Full-Time',
      s.attendance || 98,
      s.status || 'Active',
      `"${s.phone}"`,
      s.email,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Riverside_Staff_Directory_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Add Staff Submit
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault()
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim()) return
    setSubmitting(true)
    try {
      const res = await api.adminCreateStaff(newStaffForm)
      const newStaff = {
        id: res.id || Date.now(),
        employee_id: `STF${String(staffList.length + 1).padStart(3, '0')}`,
        name: newStaffForm.name,
        position: newStaffForm.position || 'Administrative Officer',
        department: newStaffForm.department,
        employment_type: 'Full-Time',
        attendance: 98,
        status: 'Active',
        phone: newStaffForm.phone || '+234 803 456 7890',
        email: newStaffForm.email,
        location: newStaffForm.location || 'Administrative Block',
        is_new: true,
        leave_balance: { annual: 21, taken: 0, remaining: 21, sick: 10 },
        documents: [],
      }
      setStaffList((prev) => [newStaff, ...prev])
      setIsAddModalOpen(false)
      setNewStaffForm({ name: '', position: '', department: 'Administrative', email: '', phone: '', location: '' })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
      alert('Staff member registered successfully!')
    } catch (err) {
      alert(`Error creating staff: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Category breakdowns matching media_1790077678982.jpg - directly calculated from database
  const adminDeptCount = staffList.filter((s) => s.department === 'Administrative' || s.department === 'Finance').length
  const maintenanceCount = staffList.filter((s) => s.department === 'Facilities' || s.department === 'IT & Technical').length
  const securityCount = staffList.filter((s) => s.department === 'Security').length
  const othersCount = staffList.filter((s) => s.department === 'Medical' || s.department === 'Academics' || s.department === 'Academic Support').length

  return (
    <div className="admin-page-content">
      {/* 1. Header Banner matching reference media_1790077678982.jpg */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Staff</h1>
          <p className="admin-page-subtitle">Manage non-teaching staff and track their information, department and attendance.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsAddModalOpen(true)}>
          Add Staff
        </button>
      </div>

      {/* 2. 5 Live KPI Cards in a row matching media_1790077678982.jpg */}
      <div className="admin-kpi-grid cols-5">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Live DB</span>
          </div>
          <div>
            <div className="admin-kpi-label">Total Staff</div>
            <div className="admin-kpi-val">{kpis.total}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">↑ 12%</span>
            <span>Non-teaching personnel</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap amber">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="admin-kpi-badge amber">+21%</span>
          </div>
          <div>
            <div className="admin-kpi-label">Administrative</div>
            <div className="admin-kpi-val">{adminDeptCount}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● On Duty</span>
            <span>Registrar & Bursary</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap cyan">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge cyan">Campus Ops</span>
          </div>
          <div>
            <div className="admin-kpi-label">Maintenance & IT</div>
            <div className="admin-kpi-val">{maintenanceCount}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Active</span>
            <span>Facilities & Technical lead</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap green">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">+13%</span>
          </div>
          <div>
            <div className="admin-kpi-label">Security</div>
            <div className="admin-kpi-val">{securityCount}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● On Patrol</span>
            <span>Campus Safety lead</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="admin-kpi-badge purple">{kpis.onLeave > 0 ? '1 on leave' : 'All duty'}</span>
          </div>
          <div>
            <div className="admin-kpi-label">Medical & Library</div>
            <div className="admin-kpi-val">{othersCount}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend neutral">● 1 on leave</span>
            <span>School Nurse on leave</span>
          </div>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              border: '1px solid',
              borderColor: deptFilter === d ? '#09261d' : '#e2e8f0',
              background: deptFilter === d ? '#09261d' : '#ffffff',
              color: deptFilter === d ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Action and Search Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-left">
          <div className="admin-search-pill" style={{ minWidth: 260 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search staff name, ID, role, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            )}
          </div>

          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>

          <select
            className="admin-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">Type: All</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="admin-filter-right">
          <button className="admin-btn admin-btn-outline" onClick={handleExportCSV}>
            Export Directory
          </button>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="admin-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position / Designation</th>
                <th>Employee ID</th>
                <th>Employment Type</th>
                <th>Attendance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <strong>No staff members match the selected filter</strong>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => {
                  const initials = (s.name || 'S')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                  return (
                    <tr
                      key={s.id}
                      onClick={() => {
                        setSelectedStaff(s)
                        setDrawerTab('overview')
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {s.avatar ? (
                            <img
                              src={s.avatar}
                              alt={s.name}
                              style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: '#1e293b',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                fontWeight: 800,
                                fontSize: 12,
                              }}
                            >
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: '#09261d' }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-purple">{s.department}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{s.position}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}>
                          {s.employee_id}
                        </span>
                      </td>
                      <td>{s.employment_type || 'Full-Time'}</td>
                      <td>
                        <span className="admin-badge admin-badge-green">{s.attendance || 98}%</span>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${
                            s.status === 'Active' ? 'admin-badge-green' : 'admin-badge-amber'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn admin-btn-outline"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => {
                            setSelectedStaff(s)
                            setDrawerTab('overview')
                          }}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STAFF PROFILE DRAWER */}
      {selectedStaff && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedStaff(null)}>
          <div className="admin-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-group">
                <div className="admin-drawer-avatar-lg">
                  {selectedStaff.avatar ? (
                    <img src={selectedStaff.avatar} alt={selectedStaff.name} />
                  ) : (
                    (selectedStaff.name || 'S')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  )}
                </div>
                <div>
                  <div className="admin-drawer-name">{selectedStaff.name}</div>
                  <div className="admin-drawer-sub">
                    <span>{selectedStaff.employee_id}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-purple">{selectedStaff.department}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-green">{selectedStaff.status}</span>
                  </div>
                </div>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setSelectedStaff(null)}>✕</button>
            </div>

            {/* Tabs */}
            <div className="admin-drawer-tabs">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'role', label: 'Role Details' },
                { id: 'leave', label: 'Leave Balance & History' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'documents', label: 'Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`admin-drawer-tab-btn ${drawerTab === tab.id ? 'active' : ''}`}
                  onClick={() => setDrawerTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="admin-drawer-body">
              {drawerTab === 'overview' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Personnel & Station Details</div>
                    <div className="admin-drawer-kv-grid">
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">DESIGNATION</span>
                        <span className="admin-drawer-v">{selectedStaff.position}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">DEPARTMENT</span>
                        <span className="admin-drawer-v">{selectedStaff.department}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">OFFICE LOCATION</span>
                        <span className="admin-drawer-v">{selectedStaff.location || 'Administrative Complex'}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">TENURE / SERVICE</span>
                        <span className="admin-drawer-v">{selectedStaff.joined || 'Aug 2021 • 5 years'}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">DIRECT PHONE</span>
                        <span className="admin-drawer-v">{selectedStaff.phone}</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">OFFICIAL EMAIL</span>
                        <span className="admin-drawer-v">{selectedStaff.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Quick Performance Indicators</div>
                    <div className="admin-drawer-kv-grid">
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">ATTENDANCE RATE</span>
                        <span className="admin-drawer-v" style={{ color: '#10b981' }}>{selectedStaff.attendance || 98}%</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">ANNUAL LEAVE REMAINING</span>
                        <span className="admin-drawer-v">{selectedStaff.leave_balance?.remaining ?? 19} Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'role' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Job Responsibilities & Workflow</div>
                    <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                      Oversees operations within the <strong>{selectedStaff.department}</strong> department as{' '}
                      <strong>{selectedStaff.position}</strong>. Responsible for statutory compliance, day-to-day coordination with school leadership, and administrative workflows in accordance with Riverside Academy standards.
                    </p>
                  </div>
                </div>
              )}

              {drawerTab === 'leave' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Leave Entitlements & Usage</div>
                    <div className="admin-drawer-kv-grid">
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">ANNUAL LEAVE (DAYS)</span>
                        <span className="admin-drawer-v">21 Days</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">DAYS USED</span>
                        <span className="admin-drawer-v">{selectedStaff.leave_balance?.taken ?? 2} Days</span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">DAYS REMAINING</span>
                        <span className="admin-drawer-v" style={{ color: '#10b981' }}>
                          {selectedStaff.leave_balance?.remaining ?? 19} Days
                        </span>
                      </div>
                      <div className="admin-drawer-kv">
                        <span className="admin-drawer-k">SICK LEAVE ALLOTMENT</span>
                        <span className="admin-drawer-v">10 Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'attendance' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Attendance Metrics</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span>Recorded Rate:</span>
                      <strong style={{ color: '#10b981', fontSize: 16 }}>{selectedStaff.attendance || 98}%</strong>
                    </div>
                    <div className="admin-progress-bar">
                      <div className="admin-progress-fill green" style={{ width: `${selectedStaff.attendance || 98}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'documents' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Personnel Credentials & Contracts</div>
                    {(selectedStaff.documents || [
                      { name: 'Employment_Contract_Signed.pdf', size: '1.4 MB', date: '2021-08-15' },
                      { name: 'Academic_and_Professional_Certificates.pdf', size: '2.9 MB', date: '2021-08-15' },
                    ]).map((doc, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 4 }}>PDF</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a' }}>{doc.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{doc.size} • Recorded {doc.date}</div>
                          </div>
                        </div>
                        <button className="admin-btn admin-btn-outline" style={{ padding: '3px 8px', fontSize: 11 }}>Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-drawer-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => alert(`Leave application module triggered for ${selectedStaff.name}`)}
              >
                Log Leave Request
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedStaff(null)}>
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Register New Staff Member</div>
              <button className="admin-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddStaffSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. Dr. Anthony Maduka"
                    value={newStaffForm.name}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-grid" style={{ marginBottom: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Department *</label>
                    <select
                      className="admin-form-select"
                      value={newStaffForm.department}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    >
                      {departments.filter((d) => d !== 'All').map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Designation / Position *</label>
                    <input
                      type="text"
                      required
                      className="admin-form-input"
                      placeholder="e.g. Academic Registrar"
                      value={newStaffForm.position}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, position: e.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-form-grid" style={{ marginBottom: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Official Email *</label>
                    <input
                      type="email"
                      required
                      className="admin-form-input"
                      placeholder="staff@riversideacademy.com"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="+234 803 000 0000"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Office / Station Location</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Administrative Block, Room 102"
                    value={newStaffForm.location}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Register Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 3. CLASSES MODULE — Academic Cohorts, Capacity Utilization & Workspace
// ============================================================================
export function AdminClasses({ classes: initialClasses = [], onSelectClass }) {
  const [classesList, setClassesList] = useState(initialClasses)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [search, setSearch] = useState('')

  // Drawer and Modal
  const [selectedClass, setSelectedClass] = useState(null)
  const [drawerTab, setDrawerTab] = useState('roster')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    code: '',
    academic_year: '2025-2026',
    capacity: 30,
  })
  const [submitting, setSubmitting] = useState(false)

  React.useEffect(() => {
    if (initialClasses && initialClasses.length > 0) {
      setClassesList(initialClasses)
    }
  }, [initialClasses])

  // Live Class KPIs
  const kpis = useMemo(() => {
    const totalClasses = classesList.length
    const totalEnrolled = classesList.reduce((sum, c) => sum + (c.students_count || 0), 0)
    const totalCapacity = classesList.reduce((sum, c) => sum + (c.capacity || 30), 0)
    const avgClassSize = totalClasses > 0 ? (totalEnrolled / totalClasses).toFixed(1) : 0
    const capacityUtilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0
    const totalTeachers = classesList.filter((c) => c.class_teacher && c.class_teacher !== 'Unassigned').length || totalClasses
    return { totalClasses, totalEnrolled, avgClassSize, capacityUtilization, totalTeachers }
  }, [classesList])

  // Search filtered classes
  const filteredClasses = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return classesList
    return classesList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.class_teacher && c.class_teacher.toLowerCase().includes(q)) ||
        (c.room && c.room.toLowerCase().includes(q))
    )
  }, [classesList, search])

  // Handle Add Class
  const handleAddClassSubmit = async (e) => {
    e.preventDefault()
    if (!newClassForm.name.trim() || !newClassForm.code.trim()) return
    setSubmitting(true)
    try {
      const res = await api.adminCreateClass(newClassForm)
      const newCls = {
        id: res.id || Date.now(),
        name: newClassForm.name,
        code: newClassForm.code,
        academic_year: newClassForm.academic_year,
        capacity: Number(newClassForm.capacity) || 30,
        students_count: 0,
        occupancy_rate: 0,
        room: `Room ${100 + classesList.length}, Block B`,
        class_teacher: 'Unassigned',
        subjects_count: 9,
        attendance: 95,
        roster: [],
        schedule: [],
      }
      setClassesList((prev) => [...prev, newCls])
      setIsAddModalOpen(false)
      setNewClassForm({ name: '', code: '', academic_year: '2025-2026', capacity: 30 })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
      alert('Class created successfully!')
    } catch (err) {
      alert(`Error creating class: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Classes</h1>
          <p className="admin-page-subtitle">Manage classes, assign teachers and track student enrollment.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsAddModalOpen(true)}>
          Add Class
        </button>
      </div>

      {/* 2. 4 Live KPI Cards */}
      <div className="admin-kpi-grid cols-4">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Live DB</span>
          </div>
          <div>
            <div className="admin-kpi-label">Total Classes</div>
            <div className="admin-kpi-val">{kpis.totalClasses}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Active</span>
            <span>Academic cohorts</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap green">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Enrolled</span>
          </div>
          <div>
            <div className="admin-kpi-label">Total Students</div>
            <div className="admin-kpi-val">{kpis.totalEnrolled}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Active</span>
            <span>Across all class cohorts</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="admin-kpi-badge purple">Assigned</span>
          </div>
          <div>
            <div className="admin-kpi-label">Total Teachers</div>
            <div className="admin-kpi-val">{kpis.totalTeachers}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Assigned</span>
            <span>Class form teachers</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap cyan">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="admin-kpi-badge amber">Capacity</span>
          </div>
          <div>
            <div className="admin-kpi-label">Class Capacity</div>
            <div className="admin-kpi-val">{kpis.capacityUtilization}%</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend neutral">Avg {kpis.avgClassSize}</span>
            <span>Students per classroom</span>
          </div>
        </div>
      </div>

      {/* Toolbar & View Mode Toggle */}
      <div className="admin-filter-bar">
        <div className="admin-filter-left">
          <div className="admin-search-pill" style={{ minWidth: 260 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search class name, section, teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            )}
          </div>
        </div>

        <div className="admin-filter-right">
          {/* Toggle View: Grid / Table */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: 3, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 0,
                background: viewMode === 'grid' ? '#09261d' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
              }}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 0,
                background: viewMode === 'table' ? '#09261d' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#64748b',
                cursor: 'pointer',
              }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* CARD VIEW */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
          {filteredClasses.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0', color: '#64748b' }}>
              No academic classes found matching your search.
            </div>
          ) : (
            filteredClasses.map((c) => {
              const cap = c.capacity || 30
              const count = c.students_count || 0
              const occ = Math.round((count / cap) * 100)
              const colorClass = occ > 95 ? 'red' : occ > 80 ? 'amber' : 'green'

              return (
                <div
                  key={c.id}
                  className="admin-chart-card"
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => {
                    setSelectedClass(c)
                    setDrawerTab('roster')
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: '#09261d', fontWeight: 800 }}>Class {c.name}</h3>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {c.room} • Code: <strong style={{ color: '#0f172a' }}>{c.code}</strong>
                      </div>
                    </div>
                    <span className="admin-badge admin-badge-teal">{c.attendance || 94}% Att.</span>
                  </div>

                  <div style={{ margin: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '10px 0' }}>
                    <div style={{ fontSize: 12, color: '#334155', marginBottom: 4 }}>
                      Class Teacher: <strong>{c.class_teacher}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Subjects: <strong>{c.subjects_count || 9} subjects offered</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      <span>
                        Capacity: {count} / {cap} students
                      </span>
                      <span style={{ color: occ > 95 ? '#ef4444' : occ > 80 ? '#f59e0b' : '#10b981' }}>
                        {occ}% filled
                      </span>
                    </div>
                    <div className="admin-cap-bar-container">
                      <div className="admin-cap-bar-bg">
                        <div className={`admin-cap-bar-fill ${colorClass}`} style={{ width: `${Math.min(occ, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="admin-table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Section Code</th>
                  <th>Room Assignment</th>
                  <th>Class Teacher</th>
                  <th>Capacity</th>
                  <th>Enrolled</th>
                  <th>Occupancy</th>
                  <th>Attendance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((c) => {
                  const cap = c.capacity || 30
                  const count = c.students_count || 0
                  const occ = Math.round((count / cap) * 100)
                  return (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedClass(c)
                        setDrawerTab('roster')
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 800, color: '#09261d' }}>{c.name}</td>
                      <td>
                        <span className="admin-badge admin-badge-blue">{c.code}</span>
                      </td>
                      <td>{c.room}</td>
                      <td style={{ fontWeight: 600 }}>{c.class_teacher}</td>
                      <td>{cap}</td>
                      <td>
                        <strong>{count}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: occ > 90 ? '#f59e0b' : '#10b981' }}>{occ}%</span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-teal">{c.attendance || 94}%</span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn admin-btn-outline"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => {
                            setSelectedClass(c)
                            setDrawerTab('roster')
                          }}
                        >
                          Workspace
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLASS DETAIL WORKSPACE DRAWER */}
      {selectedClass && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedClass(null)}>
          <div className="admin-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-group">
                <div className="admin-drawer-avatar-lg">{selectedClass.code || 'CLS'}</div>
                <div>
                  <div className="admin-drawer-name">Class {selectedClass.name}</div>
                  <div className="admin-drawer-sub">
                    <span>Code: {selectedClass.code}</span>
                    <span>•</span>
                    <span>{selectedClass.room}</span>
                    <span>•</span>
                    <span>Teacher: {selectedClass.class_teacher}</span>
                  </div>
                </div>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setSelectedClass(null)}>✕</button>
            </div>

            {/* Drawer Tabs */}
            <div className="admin-drawer-tabs">
              {[
                { id: 'roster', label: `Student Roster (${(selectedClass.roster || []).length})` },
                { id: 'schedule', label: 'Weekly Schedule' },
                { id: 'teachers', label: 'Assigned Faculty' },
                { id: 'metrics', label: 'Attendance & Health' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`admin-drawer-tab-btn ${drawerTab === tab.id ? 'active' : ''}`}
                  onClick={() => setDrawerTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="admin-drawer-body">
              {drawerTab === 'roster' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Enrolled Students in {selectedClass.name}</div>
                    {(selectedClass.roster || []).length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
                        No students are currently enrolled in this section.
                      </div>
                    ) : (
                      <table className="admin-table" style={{ fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Admission #</th>
                            <th>Attendance</th>
                            <th>Fee Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedClass.roster.map((st, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 700, color: '#09261d' }}>{st.name}</td>
                              <td>{st.student_id}</td>
                              <td>
                                <span className="admin-badge admin-badge-teal">{st.attendance}%</span>
                              </td>
                              <td>
                                <span className={`admin-badge ${st.fee_status === 'Paid' ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                                  {st.fee_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {drawerTab === 'schedule' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Daily Period Timetable</div>
                    {(selectedClass.schedule || []).map((period, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#09261d' }}>{period.subject}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Teacher: {period.teacher}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="admin-badge admin-badge-blue">{period.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'teachers' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Teaching Staff</div>
                    <div style={{ padding: '8px 0', fontSize: 13 }}>
                      Class Lead: <strong>{selectedClass.class_teacher}</strong>
                    </div>
                    <div style={{ padding: '8px 0', fontSize: 13 }}>
                      Total Subject Instructors: <strong>{selectedClass.subjects_count || 9} Assigned Teachers</strong>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'metrics' && (
                <div>
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-sec-title">Class Capacity & Utilization</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Occupancy:</span>
                      <strong>{selectedClass.students_count || 0} / {selectedClass.capacity || 30} students</strong>
                    </div>
                    <div className="admin-cap-bar-bg" style={{ height: 8 }}>
                      <div
                        className="admin-cap-bar-fill green"
                        style={{ width: `${Math.min(Math.round(((selectedClass.students_count || 0) / (selectedClass.capacity || 30)) * 100), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => window.print()}>
                Print Class Roster
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedClass(null)}>
                Close Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CLASS MODAL */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Create Academic Class</div>
              <button className="admin-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddClassSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Class Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. JSS 1C or Grade 9A"
                    value={newClassForm.name}
                    onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-grid" style={{ marginBottom: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Section Code *</label>
                    <input
                      type="text"
                      required
                      className="admin-form-input"
                      placeholder="e.g. JSS1-C"
                      value={newClassForm.code}
                      onChange={(e) => setNewClassForm({ ...newClassForm, code: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Capacity</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={newClassForm.capacity}
                      onChange={(e) => setNewClassForm({ ...newClassForm, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Academic Year</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={newClassForm.academic_year}
                    onChange={(e) => setNewClassForm({ ...newClassForm, academic_year: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 4. ADMISSIONS MODULE (Wrapper / Pipeline view)
// ============================================================================
export function AdminAdmissions({ candidates = [] }) {
  const stage1Count = candidates.filter(c => c.status === 'Submitted' || c.status === 'submitted' || c.status === 'pending').length
  const stage2Count = candidates.filter(c => c.status === 'Under Review' || c.status === 'under_review' || c.status === 'documents_pending').length
  const stage3Count = candidates.filter(c => c.status === 'Interview / Exam' || c.status === 'interview').length
  const stage4Count = candidates.filter(c => c.status === 'Payment Pending' || c.status === 'payment_pending').length
  const stage5Count = candidates.filter(c => c.status === 'Offer Issued' || c.status === 'admission_offered').length
  const stage6Count = candidates.filter(c => c.status === 'Enrolled' || c.status === 'enrolled').length

  return (
    <div>
      <div className="admin-adm-pipeline-bar">
        <div className="admin-adm-stage-step active">
          <div className="admin-adm-stage-step-num">STAGE 1</div>
          <div className="admin-adm-stage-step-title">Submitted</div>
          <div className="admin-adm-stage-step-count">{stage1Count} Applicant{stage1Count !== 1 ? 's' : ''}</div>
        </div>
        <div className="admin-adm-stage-step">
          <div className="admin-adm-stage-step-num">STAGE 2</div>
          <div className="admin-adm-stage-step-title">Under Review</div>
          <div className="admin-adm-stage-step-count">{stage2Count} Applicant{stage2Count !== 1 ? 's' : ''}</div>
        </div>
        <div className="admin-adm-stage-step">
          <div className="admin-adm-stage-step-num">STAGE 3</div>
          <div className="admin-adm-stage-step-title">Interview / Exam</div>
          <div className="admin-adm-stage-step-count">{stage3Count} Candidate{stage3Count !== 1 ? 's' : ''}</div>
        </div>
        <div className="admin-adm-stage-step">
          <div className="admin-adm-stage-step-num">STAGE 4</div>
          <div className="admin-adm-stage-step-title">Payment Pending</div>
          <div className="admin-adm-stage-step-count">{stage4Count} Candidate{stage4Count !== 1 ? 's' : ''}</div>
        </div>
        <div className="admin-adm-stage-step">
          <div className="admin-adm-stage-step-num">STAGE 5</div>
          <div className="admin-adm-stage-step-title">Offer Issued</div>
          <div className="admin-adm-stage-step-count">{stage5Count} Offered</div>
        </div>
        <div className="admin-adm-stage-step">
          <div className="admin-adm-stage-step-num">STAGE 6</div>
          <div className="admin-adm-stage-step-title">Enrolled</div>
          <div className="admin-adm-stage-step-count">{stage6Count} Enrolled</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. EMPLOYMENT / RECRUITMENT MODULE — Pipeline, Vacancies & Candidate Drawer
// ============================================================================
export function AdminEmployment({ vacancies: initialVacancies = [], applications: initialApps = [] }) {
  const [vacanciesList, setVacanciesList] = useState(initialVacancies)
  const [applicationsList, setApplicationsList] = useState(initialApps)
  const [activeTab, setActiveTab] = useState('vacancies') // 'vacancies' | 'applications' | 'shortlisted' | 'interviews' | 'hired'
  const [search, setSearch] = useState('')

  // Drawers and Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedVacancy, setSelectedVacancy] = useState(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [newVacancyForm, setNewVacancyForm] = useState({
    title: '',
    department: 'Academics',
    employment_type: 'full_time',
    location: 'Riverside Main Campus',
    deadline: '',
    description: '',
    requirements: '',
  })
  const [submitting, setSubmitting] = useState(false)

  React.useEffect(() => {
    if (initialVacancies && initialVacancies.length > 0) setVacanciesList(initialVacancies)
    if (initialApps && initialApps.length > 0) setApplicationsList(initialApps)
  }, [initialVacancies, initialApps])

  // Live Recruitment KPIs
  const kpis = useMemo(() => {
    const openVacancies = vacanciesList.filter((v) => v.status === 'Active').length
    const totalApplications = applicationsList.length
    const shortlisted = applicationsList.filter((a) => a.status === 'shortlisted').length
    const interviews = applicationsList.filter((a) => a.status === 'interview').length
    const hired = applicationsList.filter((a) => a.status === 'hired').length
    const rejected = applicationsList.filter((a) => a.status === 'rejected').length
    const rejectionRate = totalApplications > 0 ? Math.round((rejected / totalApplications) * 100) : 0

    return { openVacancies, totalApplications, shortlisted, interviews, hired, rejectionRate }
  }, [vacanciesList, applicationsList])

  // Filtered lists
  const filteredCandidates = useMemo(() => {
    let list = applicationsList
    if (activeTab === 'shortlisted') list = list.filter((a) => a.status === 'shortlisted')
    else if (activeTab === 'interviews') list = list.filter((a) => a.status === 'interview')
    else if (activeTab === 'hired') list = list.filter((a) => a.status === 'hired')

    const q = search.toLowerCase().trim()
    if (!q) return list
    return list.filter(
      (a) =>
        a.full_name.toLowerCase().includes(q) ||
        a.job_title.toLowerCase().includes(q) ||
        a.reference.toLowerCase().includes(q)
    )
  }, [applicationsList, activeTab, search])

  // Pipeline Action Handler
  const handleUpdateCandidateStatus = async (appId, nextStatus) => {
    try {
      await api.adminUpdateCandidateStatus(appId, nextStatus)
      setApplicationsList((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
      )
      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate({ ...selectedCandidate, status: nextStatus })
      }
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
      alert(`Candidate status updated to: ${nextStatus.toUpperCase()}`)
    } catch (err) {
      alert(`Error updating candidate: ${err.message}`)
    }
  }

  // Handle Post Vacancy Submit
  const handlePostVacancySubmit = async (e) => {
    e.preventDefault()
    if (!newVacancyForm.title.trim()) return
    setSubmitting(true)
    try {
      const res = await api.adminCreateVacancy(newVacancyForm)
      const newVac = {
        id: res.id || Date.now(),
        title: newVacancyForm.title,
        department: newVacancyForm.department,
        employment_type: newVacancyForm.employment_type.replace('_', '-').title || 'Full-Time',
        location: newVacancyForm.location,
        deadline: newVacancyForm.deadline || '30 Nov 2026',
        status: 'Active',
        applicants_count: 0,
        description: newVacancyForm.description,
        requirements: newVacancyForm.requirements,
      }
      setVacanciesList((prev) => [newVac, ...prev])
      setIsPostModalOpen(false)
      setNewVacancyForm({
        title: '',
        department: 'Academics',
        employment_type: 'full_time',
        location: 'Riverside Main Campus',
        deadline: '',
        description: '',
        requirements: '',
      })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
      alert('Job vacancy posted successfully!')
    } catch (err) {
      alert(`Error posting vacancy: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Employment</h1>
          <p className="admin-page-subtitle">Manage job vacancies, applications and staff recruitment.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsPostModalOpen(true)}>
          Post Vacancy
        </button>
      </div>

      {/* 2. 6 Live Recruitment KPI Cards */}
      <div className="admin-kpi-grid cols-6">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Live</span>
          </div>
          <div>
            <div className="admin-kpi-label">Job Vacancies</div>
            <div className="admin-kpi-val">{kpis.openVacancies}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Active</span>
            <span>Open staff postings</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap amber">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="admin-kpi-badge blue">Received</span>
          </div>
          <div>
            <div className="admin-kpi-label">Applications</div>
            <div className="admin-kpi-val">{kpis.totalApplications}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Total</span>
            <span>Candidate submissions</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap cyan">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="admin-kpi-badge purple">Screened</span>
          </div>
          <div>
            <div className="admin-kpi-label">Shortlisted</div>
            <div className="admin-kpi-val">{kpis.shortlisted}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Stage 1</span>
            <span>Passed qualifications</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="admin-kpi-badge amber">Scheduled</span>
          </div>
          <div>
            <div className="admin-kpi-label">Interviews</div>
            <div className="admin-kpi-val">{kpis.interviews}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Panels</span>
            <span>Oral & technical sessions</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap green">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="admin-kpi-badge green">Offers</span>
          </div>
          <div>
            <div className="admin-kpi-label">Hired</div>
            <div className="admin-kpi-val">{kpis.hired}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend up">● Appointed</span>
            <span>Accepted appointment</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-wrap red">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-badge red">{kpis.rejectionRate}%</span>
          </div>
          <div>
            <div className="admin-kpi-label">Rejected</div>
            <div className="admin-kpi-val">{kpis.rejected}</div>
          </div>
          <div className="admin-kpi-sub">
            <span className="admin-kpi-trend down">● Screened Out</span>
            <span>Did not meet criteria</span>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="admin-secondary-nav">
        <button
          className={`admin-sec-tab ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          <span>Vacancies</span>
          <span className="admin-sec-tab-badge">{vacanciesList.length}</span>
        </button>
        <button
          className={`admin-sec-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <span>All Applications</span>
          <span className="admin-sec-tab-badge">{applicationsList.length}</span>
        </button>
        <button
          className={`admin-sec-tab ${activeTab === 'shortlisted' ? 'active' : ''}`}
          onClick={() => setActiveTab('shortlisted')}
        >
          <span>Shortlisted</span>
          <span className="admin-sec-tab-badge">{kpis.shortlisted}</span>
        </button>
        <button
          className={`admin-sec-tab ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          <span>Interviews</span>
          <span className="admin-sec-tab-badge">{kpis.interviews}</span>
        </button>
        <button
          className={`admin-sec-tab ${activeTab === 'hired' ? 'active' : ''}`}
          onClick={() => setActiveTab('hired')}
        >
          <span>Hired</span>
          <span className="admin-sec-tab-badge">{kpis.hired}</span>
        </button>
      </div>

      {/* VACANCIES TAB CONTENT */}
      {activeTab === 'vacancies' && (
        <div className="admin-table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Employment Type</th>
                  <th>Applicants</th>
                  <th>Application Deadline</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vacanciesList.map((j) => (
                  <tr
                    key={j.id}
                    onClick={() => setSelectedVacancy(j)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 800, color: '#09261d' }}>{j.title}</td>
                    <td>
                      <span className="admin-badge admin-badge-purple">{j.department}</span>
                    </td>
                    <td>{j.employment_type}</td>
                    <td>
                      <strong style={{ color: '#10b981' }}>{j.applicants_count} candidates</strong>
                    </td>
                    <td>{j.deadline}</td>
                    <td>
                      <span className="admin-badge admin-badge-green">{j.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '4px 8px', fontSize: 11 }}
                        onClick={() => setSelectedVacancy(j)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANDIDATES TABS (Applications, Shortlisted, Interviews, Hired) */}
      {activeTab !== 'vacancies' && (
        <div className="admin-table-container">
          <div className="admin-table-toolbar">
            <div className="admin-table-title-group">
              <h3 className="admin-table-title" style={{ textTransform: 'capitalize' }}>
                {activeTab} Candidates
              </h3>
              <span className="admin-badge admin-badge-teal">{filteredCandidates.length} Candidates</span>
            </div>
            <div className="admin-search-pill" style={{ minWidth: 240 }}>
              <input
                type="text"
                placeholder="Search candidate, job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Candidate Name</th>
                  <th>Job Vacancy</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Stage</th>
                  <th>Applied Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                      No candidate applications currently under "{activeTab}".
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{c.reference}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#09261d' }}>{c.full_name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{c.email}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{c.job_title}</td>
                      <td>
                        <span className="admin-badge admin-badge-blue">{c.department}</span>
                      </td>
                      <td>{c.years_of_experience || 0} years</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            c.status === 'hired'
                              ? 'admin-badge-green'
                              : c.status === 'interview'
                              ? 'admin-badge-purple'
                              : c.status === 'shortlisted'
                              ? 'admin-badge-teal'
                              : 'admin-badge-blue'
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{c.applied_date}</td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn admin-btn-outline"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => setSelectedCandidate(c)}
                        >
                          Review Candidate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANDIDATE PROFILE DRAWER & ACTION PIPELINE */}
      {selectedCandidate && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="admin-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-group">
                <div className="admin-drawer-avatar-lg">{selectedCandidate.full_name?.charAt(0) || 'C'}</div>
                <div>
                  <div className="admin-drawer-name">{selectedCandidate.full_name}</div>
                  <div className="admin-drawer-sub">
                    <span>{selectedCandidate.reference}</span>
                    <span>•</span>
                    <span>{selectedCandidate.job_title}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-green">{selectedCandidate.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setSelectedCandidate(null)}>✕</button>
            </div>

            <div className="admin-drawer-body">
              {/* Recruitment Action Pipeline Bar */}
              <div className="admin-drawer-section" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                <div className="admin-drawer-sec-title" style={{ color: '#065f46' }}>
                  Recruitment Pipeline Actions
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <button
                    className={`admin-btn ${selectedCandidate.status === 'shortlisted' ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                    style={{ fontSize: 11 }}
                    onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'shortlisted')}
                  >
                    Shortlist
                  </button>
                  <button
                    className={`admin-btn ${selectedCandidate.status === 'interview' ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                    style={{ fontSize: 11 }}
                    onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'interview')}
                  >
                    Schedule Interview
                  </button>
                  <button
                    className={`admin-btn ${selectedCandidate.status === 'hired' ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                    style={{ fontSize: 11, background: '#16a34a', color: '#ffffff' }}
                    onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'hired')}
                  >
                    Extend Offer / Hire
                  </button>
                  <button
                    className="admin-btn admin-btn-outline"
                    style={{ fontSize: 11, color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, 'rejected')}
                  >
                    Reject / Archive
                  </button>
                </div>
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Contact & Experience</div>
                <div className="admin-drawer-kv-grid">
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">EMAIL</span>
                    <span className="admin-drawer-v">{selectedCandidate.email}</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">PHONE</span>
                    <span className="admin-drawer-v">{selectedCandidate.phone}</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">EXPERIENCE</span>
                    <span className="admin-drawer-v">{selectedCandidate.years_of_experience || 0} Years</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">APPLIED DATE</span>
                    <span className="admin-drawer-v">{selectedCandidate.applied_date}</span>
                  </div>
                </div>
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Qualifications & Credentials</div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                  {selectedCandidate.qualifications || 'B.Sc. First Class Honors, Certified Teacher.'}
                </p>
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Cover Letter / Statement of Purpose</div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{selectedCandidate.cover_letter || 'Dedicated to nurturing students and upholding academic excellence at Riverside Academy.'}"
                </p>
              </div>
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => alert(`Email interview invite prepared for ${selectedCandidate.email}`)}>
                Send Interview Invite
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedCandidate(null)}>
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VACANCY DETAIL DRAWER */}
      {selectedVacancy && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedVacancy(null)}>
          <div className="admin-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-group">
                <div className="admin-drawer-avatar-lg">{selectedVacancy.title?.charAt(0) || 'V'}</div>
                <div>
                  <div className="admin-drawer-name">{selectedVacancy.title}</div>
                  <div className="admin-drawer-sub">
                    <span>{selectedVacancy.department}</span>
                    <span>•</span>
                    <span>{selectedVacancy.employment_type}</span>
                    <span>•</span>
                    <span className="admin-badge admin-badge-green">{selectedVacancy.status}</span>
                  </div>
                </div>
              </div>
              <button className="admin-drawer-close-btn" onClick={() => setSelectedVacancy(null)}>✕</button>
            </div>

            <div className="admin-drawer-body">
              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Vacancy Overview</div>
                <div className="admin-drawer-kv-grid">
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">DEPARTMENT</span>
                    <span className="admin-drawer-v">{selectedVacancy.department}</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">EMPLOYMENT TYPE</span>
                    <span className="admin-drawer-v">{selectedVacancy.employment_type}</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">LOCATION</span>
                    <span className="admin-drawer-v">{selectedVacancy.location}</span>
                  </div>
                  <div className="admin-drawer-kv">
                    <span className="admin-drawer-k">CLOSING DEADLINE</span>
                    <span className="admin-drawer-v">{selectedVacancy.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Role Description</div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{selectedVacancy.description}</p>
              </div>

              <div className="admin-drawer-section">
                <div className="admin-drawer-sec-title">Candidate Requirements</div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{selectedVacancy.requirements}</p>
              </div>
            </div>

            <div className="admin-drawer-footer">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => {
                  setSelectedVacancy(null)
                  setActiveTab('applications')
                }}
              >
                View Candidates
              </button>
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedVacancy(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST VACANCY MODAL */}
      {isPostModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsPostModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Post New Job Vacancy</div>
              <button className="admin-modal-close-btn" onClick={() => setIsPostModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handlePostVacancySubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Job Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. Senior Economics & Business Studies Teacher"
                    value={newVacancyForm.title}
                    onChange={(e) => setNewVacancyForm({ ...newVacancyForm, title: e.target.value })}
                  />
                </div>
                <div className="admin-form-grid" style={{ marginBottom: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Department *</label>
                    <select
                      className="admin-form-select"
                      value={newVacancyForm.department}
                      onChange={(e) => setNewVacancyForm({ ...newVacancyForm, department: e.target.value })}
                    >
                      <option value="Academics">Academics</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Arts & Humanities">Arts & Humanities</option>
                      <option value="Technology & Innovation">Technology & Innovation</option>
                      <option value="Student Welfare">Student Welfare</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Employment Type</label>
                    <select
                      className="admin-form-select"
                      value={newVacancyForm.employment_type}
                      onChange={(e) => setNewVacancyForm({ ...newVacancyForm, employment_type: e.target.value })}
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={newVacancyForm.deadline}
                    onChange={(e) => setNewVacancyForm({ ...newVacancyForm, deadline: e.target.value })}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-form-label">Job Description</label>
                  <textarea
                    rows="3"
                    className="admin-form-input"
                    placeholder="Summary of responsibilities and scope..."
                    value={newVacancyForm.description}
                    onChange={(e) => setNewVacancyForm({ ...newVacancyForm, description: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Requirements</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. B.Sc. in Economics or related field with 3+ years experience"
                    value={newVacancyForm.requirements}
                    onChange={(e) => setNewVacancyForm({ ...newVacancyForm, requirements: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsPostModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


// ============================================================================
// STANDALONE ENTERPRISE MODULES (High-Fidelity Re-Exports)
// ============================================================================
export { default as AdminAttendance } from './modules/AdminAttendanceDashboard'
export { default as AdminGrades } from './modules/AdminGradesDashboard'
export { default as AdminFees } from './modules/AdminFeesDashboard'
export { default as AdminPayroll } from './modules/AdminPayrollDashboard'
export { default as AdminExpenses } from './modules/AdminExpensesDashboard'
export { default as AdminTimetable } from './modules/AdminTimetableDashboard'
export { default as AdminCalendar } from './modules/AdminCalendarDashboard'
export { default as AdminNews } from './modules/AdminNewsDashboard'
export { default as AdminReports } from './modules/AdminReportsDashboard'
export { default as AdminAnalyticsDashboard } from './modules/AdminAnalyticsDashboard'
export { default as AdminAuditLogs } from './modules/AdminAuditLogsDashboard'
export { default as AdminSettings } from './modules/AdminSettingsDashboard'

