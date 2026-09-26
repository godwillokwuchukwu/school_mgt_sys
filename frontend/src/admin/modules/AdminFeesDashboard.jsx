import React, { useState, useMemo } from 'react'
import { api } from '../../api'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminFeesDashboard({
  invoices: initialInvoices = [],
  financeReconciliation = {},
  onRefresh,
}) {
  const { longDate, shortDate } = useLiveDateTime()
  const [activeTab, setActiveTab] = useState('ledger') // 'ledger' | 'invoices' | 'structures'
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState([])
  const [createInvoiceModal, setCreateInvoiceModal] = useState(false)
  const [recordPaymentModal, setRecordPaymentModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  // Seeded / Prop-driven invoices and payments
  const [invoicesList, setInvoicesList] = useState(() => {
    if (initialInvoices && initialInvoices.length > 0) return initialInvoices
    return [
      { id: 1, invoice_no: 'INV-2026-001', student: 'Chinedu Okafor', student_id: 'RS-0001', category: 'Tuition & Development', amount: 350000, due_date: '28 Sep 2026', status: 'Paid', statusCode: 'paid', paid_at: '20 Sep 2026', receipt: '#RCA-001', method: 'Bank Transfer', transaction_ref: 'TRN-2026-NIBSS-1001' },
      { id: 2, invoice_no: 'INV-2026-002', student: 'Amina Bello', student_id: 'RS-0002', category: 'Tuition & Development', amount: 350000, due_date: '28 Sep 2026', status: 'Pending', statusCode: 'pending', paid_at: null, receipt: null, method: '-', transaction_ref: null },
      { id: 3, invoice_no: 'INV-2026-003', student: 'Emeka Nwosu', student_id: 'RS-0003', category: 'Tuition & Development', amount: 350000, due_date: '28 Sep 2026', status: 'Paid', statusCode: 'paid', paid_at: '19 Sep 2026', receipt: '#RCA-002', method: 'Card', transaction_ref: 'TRN-2026-NIBSS-1002' },
      { id: 4, invoice_no: 'INV-2026-004', student: 'Zainab Abubakar', student_id: 'RS-0004', category: 'Tuition & Development', amount: 350000, due_date: '28 Sep 2026', status: 'Paid', statusCode: 'paid', paid_at: '21 Sep 2026', receipt: '#RCA-003', method: 'Online', transaction_ref: 'TRN-2026-NIBSS-1003' },
      { id: 5, invoice_no: 'INV-2026-005', student: 'David Adeleke', student_id: 'RS-0005', category: 'Tuition & Development', amount: 350000, due_date: '28 Sep 2026', status: 'Pending', statusCode: 'pending', paid_at: null, receipt: null, method: '-', transaction_ref: null },
    ]
  })

  // Sync if initialInvoices updates
  React.useEffect(() => {
    if (initialInvoices && initialInvoices.length > 0) {
      setInvoicesList(initialInvoices)
    }
  }, [initialInvoices])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Live KPI calculations directly from database records
  const kpis = useMemo(() => {
    const totalExpected = invoicesList.reduce((sum, i) => sum + Number(i.amount || 0), 0)
    const totalCollected = invoicesList
      .filter((i) => i.status === 'Paid' || i.statusCode === 'paid')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0)
    const totalOutstanding = totalExpected - totalCollected
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0

    return {
      totalExpected,
      totalCollected,
      totalOutstanding,
      collectionRate,
      paidCount: invoicesList.filter((i) => i.status === 'Paid' || i.statusCode === 'paid').length,
      pendingCount: invoicesList.filter((i) => i.status !== 'Paid' && i.statusCode !== 'paid').length,
    }
  }, [invoicesList])

  // Multi-faceted filtering
  const filteredInvoices = useMemo(() => {
    return invoicesList.filter((i) => {
      const matchSearch =
        !search ||
        i.student.toLowerCase().includes(search.toLowerCase()) ||
        (i.invoice_no && i.invoice_no.toLowerCase().includes(search.toLowerCase())) ||
        (i.receipt && i.receipt.toLowerCase().includes(search.toLowerCase()))
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Paid' && (i.status === 'Paid' || i.statusCode === 'paid')) ||
        (statusFilter === 'Pending' && (i.status === 'Pending' || i.statusCode === 'pending'))

      if (activeTab === 'ledger') {
        return matchSearch && matchStatus && (i.status === 'Paid' || i.statusCode === 'paid')
      }
      return matchSearch && matchStatus
    })
  }, [invoicesList, search, statusFilter, activeTab])

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredInvoices.slice(start, start + pageSize)
  }, [filteredInvoices, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedInvoices.map((i) => i.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    studentName: '',
    category: 'Tuition & Development',
    amount: '350000',
    dueDate: '2026-10-15',
    type: 'enrolled',
  })

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '350000',
    method: 'Bank Transfer',
    transactionRef: '',
  })

  const handleCreateInvoice = async (e) => {
    e.preventDefault()
    const newId = invoicesList.length + 1
    const newInv = {
      id: newId,
      invoice_no: `INV-2026-${String(newId).padStart(3, '0')}`,
      category: invoiceForm.category,
      student: invoiceForm.studentName || 'New Student',
      student_id: invoiceForm.type === 'admission' ? `ADM-2026-00${newId}` : `RS-00${newId}`,
      amount: Number(invoiceForm.amount),
      due_date: invoiceForm.dueDate,
      status: 'Pending',
      statusCode: 'pending',
      paid_at: null,
      receipt: null,
      method: '-',
      transaction_ref: null,
    }

    setInvoicesList([newInv, ...invoicesList])
    setCreateInvoiceModal(false)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fee.invoice_created',
          model_name: 'Fee',
          object_id: newInv.invoice_no,
          description: `Generated tuition fee invoice #${newInv.invoice_no} for ${newInv.student} (${newInv.student_id}) — ₦${Number(invoiceForm.amount).toLocaleString()}.`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    showToast(`Invoice #${newInv.invoice_no} created for ₦${Number(invoiceForm.amount).toLocaleString()}!`)
  }

  const handleRecordPayment = async (e) => {
    e.preventDefault()
    setSaving(true)
    const inv = invoicesList.find((i) => i.id === Number(paymentForm.invoiceId)) || invoicesList[1]
    if (!inv) return

    const receiptNo = `#RCA-00${invoicesList.filter((i) => i.receipt).length + 1}`
    const txRef = paymentForm.transactionRef || `TRN-2026-NIBSS-${Math.floor(1000 + Math.random() * 9000)}`

    const updated = {
      ...inv,
      status: 'Paid',
      statusCode: 'paid',
      paid_at: shortDate,
      receipt: receiptNo,
      method: paymentForm.method,
      transaction_ref: txRef,
    }

    setInvoicesList((prev) => prev.map((i) => (i.id === inv.id ? updated : i)))
    setRecordPaymentModal(false)
    setSaving(false)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fee.payment_received',
          model_name: 'Fee',
          object_id: inv.invoice_no,
          description: `Received and reconciled fee payment of ₦${Number(inv.amount).toLocaleString()} for ${inv.student} via ${paymentForm.method} (Receipt ${receiptNo}).`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    showToast(`Payment of ₦${Number(inv.amount).toLocaleString()} confirmed! Generated receipt ${receiptNo}.`)
    setSelectedReceipt(updated)
  }

  const exportFeesCSV = () => {
    const headers = ['Invoice No,Student,Student ID,Amount (NGN),Due Date,Status,Paid Date,Receipt,Method\n']
    const rows = filteredInvoices.map((i) =>
      `"${i.invoice_no}","${i.student}","${i.student_id || ''}","${i.amount}","${i.due_date}","${i.status}","${i.paid_at || '-'}","${i.receipt || '-'}","${i.method || '-'}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Riverside_Fees_Ledger_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported fee invoices and ledger to CSV!')
  }

  const startEntry = filteredInvoices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredInvoices.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Fees & Revenue</h1>
          <p className="admin-page-subtitle">
            Manage student fee billings, admission transactions, payment receipts and bursary reconciliations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={exportFeesCSV}>
            <span>Export Ledger</span>
          </button>

          <button className="admin-btn-outline" onClick={() => setCreateInvoiceModal(true)}>
            <span>+ Create Invoice</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setRecordPaymentModal(true)}>
            <span>Record Payment</span>
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
        {[
          { id: 'ledger', label: 'Settled Payments Ledger', count: kpis.paidCount },
          { id: 'invoices', label: 'All Invoices Directory', count: invoicesList.length },
          { id: 'structures', label: 'Approved Fee Structures', count: 3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setCurrentPage(1)
            }}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 600,
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === tab.id ? '2.5px solid #09261d' : '2.5px solid transparent',
              color: activeTab === tab.id ? '#09261d' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                style={{
                  background: activeTab === tab.id ? '#ecfdf5' : '#f1f5f9',
                  color: activeTab === tab.id ? '#047857' : '#64748b',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. 4-KPI Grid (Matching Gold Standard) */}
      <div className="admin-4kpi-grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box fees">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Expected Revenue</span>
          </div>
          <div className="admin-kpi-number">₦{kpis.totalExpected.toLocaleString()}</div>
          <div className="admin-kpi-trend neutral">
            <span>{invoicesList.length} Invoices</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>issued this term</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Collected Revenue</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#059669' }}>
            ₦{kpis.totalCollected.toLocaleString()}
          </div>
          <div className="admin-kpi-trend up">
            <span>↑ {kpis.collectionRate}%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>collection rate</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box admissions">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Outstanding Receivables</span>
          </div>
          <div className="admin-kpi-number" style={{ color: kpis.totalOutstanding > 0 ? '#dc2626' : '#059669' }}>
            ₦{kpis.totalOutstanding.toLocaleString()}
          </div>
          <div className="admin-kpi-trend down">
            <span style={{ color: '#dc2626' }}>● {kpis.pendingCount} unpaid</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>students</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Settled Invoices</span>
          </div>
          <div className="admin-kpi-number">{kpis.paidCount} / {invoicesList.length}</div>
          <div className="admin-kpi-trend up">
            <span>Verified</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>bank transfers</span>
          </div>
        </div>
      </div>

      {/* 4. Filter Row (Matching Students & Teachers) */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by student name, invoice no, receipt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">Payment Status: All</option>
          <option value="Paid">Fully Paid (Settled)</option>
          <option value="Pending">Pending Payment</option>
        </select>

        <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
          <span>{longDate}</span>
        </div>
      </div>

      {/* 5. Main Table Panel */}
      {activeTab !== 'structures' ? (
        <div className="admin-table-panel">
          <div className="admin-table-top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0}
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
              Showing {activeTab === 'ledger' ? 'Settled Payment Receipts' : 'All Student Bill Invoices'}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: 40 }}>#</th>
                  <th>Invoice No</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Amount (₦)</th>
                  <th>Due Date</th>
                  <th>Paid At</th>
                  <th>Receipt</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: 40 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                      <strong>No invoice or payment records match your search</strong>
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv, idx) => {
                    const isSelected = selectedIds.includes(inv.id)
                    const displayNum = (currentPage - 1) * pageSize + idx + 1
                    const isPaid = inv.status === 'Paid' || inv.statusCode === 'paid'
                    return (
                      <tr
                        key={inv.id}
                        style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                        onClick={() => {
                          if (isPaid) setSelectedReceipt(inv)
                        }}
                      >
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(inv.id)}
                          />
                        </td>
                        <td style={{ color: '#64748b' }}>{displayNum}</td>
                        <td style={{ fontWeight: 700, color: '#09261d' }}>{inv.invoice_no}</td>
                        <td>
                          <div className="admin-table-user-cell">
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
                              {inv.student.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="admin-table-name">{inv.student}</div>
                              <div className="admin-table-sub">{inv.student_id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#475569' }}>{inv.category || 'Tuition & Development'}</td>
                        <td style={{ fontWeight: 800, color: '#09261d' }}>
                          ₦{Number(inv.amount).toLocaleString()}
                        </td>
                        <td style={{ color: '#64748b' }}>{inv.due_date}</td>
                        <td style={{ color: inv.paid_at ? '#059669' : '#94a3b8', fontWeight: inv.paid_at ? 600 : 400 }}>
                          {inv.paid_at || '-'}
                        </td>
                        <td>
                          {inv.receipt ? (
                            <span style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>
                              {inv.receipt}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td style={{ color: '#475569' }}>{inv.method || '-'}</td>
                        <td>
                          <span className={`admin-pill ${isPaid ? 'paid' : 'pending'}`}>
                            ● {inv.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          {isPaid ? (
                            <button
                              className="admin-btn-outline"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => setSelectedReceipt(inv)}
                            >
                              Receipt
                            </button>
                          ) : (
                            <button
                              className="admin-btn-primary"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => {
                                setPaymentForm({ ...paymentForm, invoiceId: inv.id, amount: inv.amount })
                                setRecordPaymentModal(true)
                              }}
                            >
                              Pay
                            </button>
                          )}
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
            <div>Showing {startEntry} to {endEntry} of {filteredInvoices.length} invoices</div>
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { level: 'Junior Secondary (JSS 1 - 3)', tuition: 250000, dev: 50000, ict: 30000, sports: 20000, total: 350000 },
            { level: 'Senior Secondary (SS 1 - 2)', tuition: 300000, dev: 60000, ict: 40000, sports: 20000, total: 420000 },
            { level: 'Final Year / Examination (SS 3)', tuition: 350000, dev: 70000, ict: 50000, sports: 30000, total: 500000 },
          ].map((item, idx) => (
            <div key={idx} className="admin-table-panel" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                APPROVED 2025/2026
              </div>
              <h3 style={{ margin: '6px 0 14px', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                {item.level}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Tuition Fee:</span>
                  <strong>₦{item.tuition.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Development Levy:</span>
                  <strong>₦{item.dev.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>ICT & STEM Labs:</span>
                  <strong>₦{item.ict.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Sports & Clubs:</span>
                  <strong>₦{item.sports.toLocaleString()}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Total Per Term:</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#09261d' }}>₦{item.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Invoice */}
      {createInvoiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Create Billing Invoice</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Generate an official school fee debit note for a student.
            </p>

            <form onSubmit={handleCreateInvoice}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ebube Okafor"
                  value={invoiceForm.studentName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Fee Category
                </label>
                <select
                  value={invoiceForm.category}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, category: e.target.value })}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  <option value="Tuition & Development">Tuition & Development</option>
                  <option value="Examination & Portal Fee">Examination & Portal Fee</option>
                  <option value="Admission & Acceptance Fee">Admission & Acceptance Fee</option>
                  <option value="Boarding House & Meals">Boarding House & Meals</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setCreateInvoiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Payment */}
      {recordPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Record Fee Payment</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Confirm bank transfer or card receipt and mark invoice as settled.
            </p>

            <form onSubmit={handleRecordPayment}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Select Invoice
                </label>
                <select
                  value={paymentForm.invoiceId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
                  className="admin-select"
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">Select outstanding invoice...</option>
                  {invoicesList.filter((i) => i.status !== 'Paid').map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_no} — {inv.student} (₦{Number(inv.amount).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  <option value="Bank Transfer">Bank Transfer (NIBSS / NIP)</option>
                  <option value="Card">Debit Card (POS / Web)</option>
                  <option value="Direct Deposit">Bank Branch Cash Deposit</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Transaction / NIBSS Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRN-2026-NIBSS-9821"
                  value={paymentForm.transactionRef}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setRecordPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Receipt Preview */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #09261d', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#09261d' }}>RIVERSIDE ACADEMY</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>OFFICIAL PAYMENT RECEIPT</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#059669' }}>{selectedReceipt.receipt}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{selectedReceipt.paid_at || shortDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payer / Student:</span>
                <strong>{selectedReceipt.student}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Student ID:</span>
                <span>{selectedReceipt.student_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Invoice Ref:</span>
                <span>{selectedReceipt.invoice_no}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <span>{selectedReceipt.category || 'Tuition & Development'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Method:</span>
                <span>{selectedReceipt.method || 'Bank Transfer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Amount Settled:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>₦{Number(selectedReceipt.amount).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="admin-btn-outline" onClick={() => setSelectedReceipt(null)}>
                Close
              </button>
              <button className="admin-btn-primary" onClick={() => window.print()}>
                🖨 Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
