import React, { useState, useMemo } from 'react'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminExpensesDashboard({ expenses: initialExpenses = [], onRefresh }) {
  const { longDate, monthYear } = useLiveDateTime()
  const [expenses, setExpenses] = useState(initialExpenses)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [receiptModalExpense, setReceiptModalExpense] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Sync if initialExpenses updates
  React.useEffect(() => {
    if (initialExpenses && initialExpenses.length > 0) {
      setExpenses(initialExpenses)
    }
  }, [initialExpenses])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Live KPI calculations
  const kpis = useMemo(() => {
    const totalIncurred = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const totalPaid = expenses
      .filter((e) => e.status === 'Paid' || e.statusCode === 'paid')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const pendingApproval = expenses
      .filter((e) => e.status === 'Pending Approval' || e.statusCode === 'pending_approval')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const budgetVariance = 12000000 - totalIncurred

    return {
      totalIncurred,
      totalPaid,
      pendingApproval,
      budgetVariance,
    }
  }, [expenses])

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.expense_id && e.expense_id.toLowerCase().includes(q)) ||
        (e.vendor && e.vendor.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q))

      const matchesCat = selectedCategory === 'All' || e.category === selectedCategory
      const matchesDept = selectedDepartment === 'All' || e.department === selectedDepartment
      const matchesStatus =
        selectedStatus === 'All' ||
        e.status === selectedStatus ||
        e.statusCode === selectedStatus.toLowerCase()

      return matchesSearch && matchesCat && matchesDept && matchesStatus
    })
  }, [expenses, search, selectedCategory, selectedDepartment, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / pageSize))
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredExpenses.slice(start, start + pageSize)
  }, [filteredExpenses, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedExpenses.length && paginatedExpenses.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedExpenses.map((e) => e.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Form State for Add Expense
  const [formData, setFormData] = useState({
    title: '',
    category: 'Utilities & Power',
    department: 'Administrative',
    amount: '',
    vendor: '',
    date: '2026-09-23',
    paymentMethod: 'Bank Transfer',
    description: '',
  })

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.amount) {
      alert('Please fill in title and amount.')
      return
    }

    const newExp = {
      id: Date.now(),
      expense_id: `EXP-2026-${String(expenses.length + 1).padStart(4, '0')}`,
      title: formData.title,
      category: formData.category,
      department: formData.department,
      amount: Number(formData.amount),
      date: formData.date,
      vendor: formData.vendor || 'Approved Vendor',
      method: formData.paymentMethod,
      status: 'Pending Approval',
      statusCode: 'pending_approval',
      receipt: 'invoice_doc.pdf',
      description: formData.description,
    }

    setExpenses([newExp, ...expenses])
    setIsAddModalOpen(false)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'expense.recorded',
          model_name: 'Expense',
          object_id: newExp.expense_id,
          description: `Logged operational disbursement voucher #${newExp.expense_id} for "${newExp.title}" (₦${newExp.amount.toLocaleString()}) — ${newExp.department}.`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))

    setFormData({
      title: '',
      category: 'Utilities & Power',
      department: 'Administrative',
      amount: '',
      vendor: '',
      date: '2026-09-23',
      paymentMethod: 'Bank Transfer',
      description: '',
    })
    showToast(`Expense ${newExp.expense_id} submitted for bursary approval!`)
  }

  const exportExpensesCSV = () => {
    const headers = ['Expense ID,Title,Category,Department,Vendor,Amount (NGN),Date,Payment Method,Status\n']
    const rows = filteredExpenses.map((e) =>
      `"${e.expense_id}","${e.title}","${e.category}","${e.department || ''}","${e.vendor || ''}","${e.amount}","${e.date}","${e.method || 'Bank Transfer'}","${e.status}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Riverside_Expense_Ledger_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported expense ledger to CSV!')
  }

  const startEntry = filteredExpenses.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredExpenses.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">School Expenses</h1>
          <p className="admin-page-subtitle">
            Monitor operational disbursements, vendor payments, facilities maintenance and institutional procurement vouchers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={exportExpensesCSV}>
            <span>Export Expenses</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <span>+ Record Expense</span>
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

      {/* 2. 4-KPI Grid (Matching Gold Standard) */}
      <div className="admin-4kpi-grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box admissions">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Total Incurred</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#0f172a' }}>
            ₦{kpis.totalIncurred.toLocaleString()}
          </div>
          <div className="admin-kpi-trend neutral">
            <span>{expenses.length} Vouchers</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>{monthYear}</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="admin-kpi-title">Settled / Paid</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#059669' }}>
            ₦{kpis.totalPaid.toLocaleString()}
          </div>
          <div className="admin-kpi-trend up">
            <span>Disbursed</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>verified transfers</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Pending Approval</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#b45309' }}>
            ₦{kpis.pendingApproval.toLocaleString()}
          </div>
          <div className="admin-kpi-trend down">
            <span style={{ color: '#b45309' }}>Awaiting Sign-off</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>bursar queue</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box fees">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Remaining Budget</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#09261d' }}>
            ₦{kpis.budgetVariance.toLocaleString()}
          </div>
          <div className="admin-kpi-trend up">
            <span>Within Threshold</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>monthly ceiling</span>
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
            placeholder="Search by expense title, ID, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">Category: All</option>
          <option value="Utilities & Power">Utilities & Power</option>
          <option value="Classroom & Academic Materials">Academic Materials</option>
          <option value="Building Maintenance & Estate">Building Maintenance</option>
          <option value="Transportation & Fleet">Transportation</option>
          <option value="ICT & Digital Infrastructure">ICT Infrastructure</option>
        </select>

        <select className="admin-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Paid">Paid</option>
          <option value="Pending Approval">Pending Approval</option>
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
                checked={selectedIds.length === paginatedExpenses.length && paginatedExpenses.length > 0}
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
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#64748b' }}>
            Authorized Institutional Expense Ledger
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedExpenses.length && paginatedExpenses.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 40 }}>#</th>
                <th>Expense ID</th>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Department</th>
                <th>Vendor</th>
                <th>Amount (₦)</th>
                <th>Date Incurred</th>
                <th>Method</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: 40 }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                    <strong>No expense items match your criteria</strong>
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((e, idx) => {
                  const isSelected = selectedIds.includes(e.id)
                  const displayNum = (currentPage - 1) * pageSize + idx + 1
                  const isPaid = e.status === 'Paid' || e.statusCode === 'paid'
                  return (
                    <tr
                      key={e.id}
                      style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                      onClick={() => setReceiptModalExpense(e)}
                    >
                      <td style={{ textAlign: 'center' }} onClick={(ev) => ev.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(e.id)}
                        />
                      </td>
                      <td style={{ color: '#64748b' }}>{displayNum}</td>
                      <td style={{ fontWeight: 700, color: '#09261d' }}>{e.expense_id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{e.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{e.description || 'Institutional expenditure'}</div>
                      </td>
                      <td>
                        <span className="admin-pill class-jss">{e.category}</span>
                      </td>
                      <td style={{ color: '#475569' }}>{e.department || 'Operations'}</td>
                      <td style={{ color: '#334155', fontWeight: 500 }}>{e.vendor || 'Approved Contractor'}</td>
                      <td style={{ fontWeight: 800, color: '#09261d' }}>
                        ₦{Number(e.amount).toLocaleString()}
                      </td>
                      <td style={{ color: '#64748b' }}>{e.date}</td>
                      <td style={{ color: '#475569' }}>{e.method || 'Bank Transfer'}</td>
                      <td>
                        <span className={`admin-pill ${isPaid ? 'paid' : 'partial'}`}>
                          ● {e.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(ev) => ev.stopPropagation()}>
                        <button
                          className="admin-btn-outline"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => setReceiptModalExpense(e)}
                        >
                          Invoice
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
          <div>Showing {startEntry} to {endEntry} of {filteredExpenses.length} expense items</div>
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

      {/* Modal: Record Expense */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 460, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Record School Expense</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Create an institutional procurement debit voucher.
            </p>

            <form onSubmit={handleAddExpense}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Item / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Laboratory Reagents & Glassware"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Utilities & Power">Utilities & Power</option>
                    <option value="Classroom & Academic Materials">Academic Materials</option>
                    <option value="Building Maintenance & Estate">Building Maintenance</option>
                    <option value="Transportation & Fleet">Transportation</option>
                    <option value="ICT & Digital Infrastructure">ICT Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Department
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Administrative">Administrative</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Operations">Operations</option>
                    <option value="IT Department">IT Department</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 450000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Vendor / Payee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eko Electric Plc"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Submit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receipt Preview */}
      {receiptModalExpense && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 460, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              Expense Voucher: {receiptModalExpense.expense_id}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
              Official procurement audit record.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Item Title:</span>
                <strong>{receiptModalExpense.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <span>{receiptModalExpense.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Vendor:</span>
                <span>{receiptModalExpense.vendor || 'Approved Contractor'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount:</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#dc2626' }}>₦{Number(receiptModalExpense.amount).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status:</span>
                <span className="admin-pill paid">● {receiptModalExpense.status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="admin-btn-outline" onClick={() => setReceiptModalExpense(null)}>
                Close
              </button>
              <button className="admin-btn-primary" onClick={() => window.print()}>
                🖨 Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
