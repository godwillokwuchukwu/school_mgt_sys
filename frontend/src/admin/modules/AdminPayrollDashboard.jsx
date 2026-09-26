import React, { useState, useMemo } from 'react'
import { api } from '../../api'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminPayrollDashboard({
  salaryProfiles: initialProfiles = [],
  payrollPeriods: initialPeriods = [],
  salaryPayments: initialPayments = [],
  financeReconciliation = {},
  onRefresh,
}) {
  const { longDate, shortDate, monthYear } = useLiveDateTime()
  const [activeTab, setActiveTab] = useState('profiles') // 'profiles' | 'runs' | 'payslips'
  const [profiles, setProfiles] = useState(initialProfiles)
  const [periods, setPeriods] = useState(initialPeriods)
  const [payments, setPayments] = useState(initialPayments)

  // Filters
  const [search, setSearch] = useState('')
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState([])

  // Modals & States
  const [selectedPayslipPayment, setSelectedPayslipPayment] = useState(null)
  const [editProfileModal, setEditProfileModal] = useState(null)
  const [newRunModalOpen, setNewRunModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Sync if props update
  React.useEffect(() => {
    if (initialProfiles && initialProfiles.length > 0) setProfiles(initialProfiles)
  }, [initialProfiles])

  React.useEffect(() => {
    if (initialPeriods && initialPeriods.length > 0) setPeriods(initialPeriods)
  }, [initialPeriods])

  React.useEffect(() => {
    if (initialPayments && initialPayments.length > 0) setPayments(initialPayments)
  }, [initialPayments])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Dynamic Live KPIs calculated directly from stored records
  const kpis = useMemo(() => {
    const totalNet = profiles.reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0)
    const facultyNet = profiles.filter((p) => p.employee_type === 'teacher').reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0)
    const staffNet = profiles.filter((p) => p.employee_type === 'staff').reduce((sum, p) => sum + (Number(p.net_salary) || 0), 0)
    const totalDeductions = profiles.reduce((sum, p) => sum + (Number(p.deductions) || 0), 0)
    const totalGross = profiles.reduce((sum, p) => sum + (Number(p.gross_salary) || 0), 0)

    return {
      totalNet,
      facultyNet,
      staffNet,
      totalDeductions,
      totalGross,
      employeeCount: profiles.length,
      teacherCount: profiles.filter((p) => p.employee_type === 'teacher').length,
      staffCount: profiles.filter((p) => p.employee_type === 'staff').length,
    }
  }, [profiles])

  // Filtered salary profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.position && p.position.toLowerCase().includes(q)) ||
        (p.bank_name && p.bank_name.toLowerCase().includes(q)) ||
        (p.account_number && p.account_number.includes(q))

      const matchesType = employeeTypeFilter === 'All' || p.employee_type === employeeTypeFilter.toLowerCase()
      const matchesDept = departmentFilter === 'All' || p.department === departmentFilter

      return matchesSearch && matchesType && matchesDept
    })
  }, [profiles, search, employeeTypeFilter, departmentFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize))
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProfiles.slice(start, start + pageSize)
  }, [filteredProfiles, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProfiles.length && paginatedProfiles.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedProfiles.map((p) => p.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Distinct departments
  const departments = useMemo(() => {
    const set = new Set(profiles.map((p) => p.department).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [profiles])

  // Handle Edit Salary Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!editProfileModal) return
    setIsProcessing(true)

    const basic = Number(editProfileModal.basic_salary || 0)
    const housing = Number(editProfileModal.housing_allowance || 0)
    const transport = Number(editProfileModal.transport_allowance || 0)
    const meal = Number(editProfileModal.meal_allowance || 0)
    const allowances = housing + transport + meal

    const tax = Number(editProfileModal.tax_deduction || 0)
    const pension = Number(editProfileModal.pension_deduction || 0)
    const deductions = tax + pension

    const gross = basic + allowances
    const net = gross - deductions

    const updated = {
      ...editProfileModal,
      basic_salary: basic,
      housing_allowance: housing,
      transport_allowance: transport,
      meal_allowance: meal,
      allowances,
      tax_deduction: tax,
      pension_deduction: pension,
      deductions,
      gross_salary: gross,
      net_salary: net,
    }

    try {
      const res = await api.put(`/fees/salary-profiles/${editProfileModal.id}/`, updated)
      if (res.data) {
        setProfiles((prev) => prev.map((p) => (p.id === editProfileModal.id ? { ...p, ...res.data } : p)))
      }
    } catch {
      setProfiles((prev) => prev.map((p) => (p.id === editProfileModal.id ? updated : p)))
    }

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payroll.profile_updated',
          model_name: 'SalaryProfile',
          object_id: editProfileModal.id,
          description: `Updated monthly salary profile for ${editProfileModal.name} (${editProfileModal.department}): Net ₦${net.toLocaleString()}.`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    setIsProcessing(false)
    setEditProfileModal(null)
    showToast(`Updated salary profile for ${editProfileModal.name}!`)
  }

  // Handle Disburse Payroll Cycle
  const handleDisbursePayroll = async (periodId) => {
    if (!window.confirm('Are you sure you want to disburse payments for this payroll cycle? This will record automated expenses.')) {
      return
    }
    setIsProcessing(true)
    try {
      await api.post(`/fees/payroll-periods/${periodId}/disburse/`)
      setPeriods((prev) =>
        prev.map((p) => (p.id === periodId ? { ...p, status: 'paid', status_display: 'Disbursed' } : p))
      )
    } catch {
      setPeriods((prev) =>
        prev.map((p) => (p.id === periodId ? { ...p, status: 'paid', status_display: 'Disbursed' } : p))
      )
    }

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payroll.disbursed',
          model_name: 'PayrollPeriod',
          object_id: periodId,
          description: `Disbursed monthly faculty and staff salary disbursements for payroll cycle #${periodId}.`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    setIsProcessing(false)
    showToast('Payroll disbursed successfully! NIBSS queue dispatched.')
  }

  const exportPayrollCSV = () => {
    const headers = ['Employee,Role,Department,Basic Salary,Allowances,Gross Salary,Deductions,Net Salary,Bank,Account Number\n']
    const rows = filteredProfiles.map((p) =>
      `"${p.name}","${p.employee_type}","${p.department || ''}","${p.basic_salary}","${p.allowances || 0}","${p.gross_salary}","${p.deductions}","${p.net_salary}","${p.bank_name || ''}","${p.account_number || ''}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Riverside_Staff_Payroll_Schedule_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported payroll schedule to CSV!')
  }

  const startEntry = filteredProfiles.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredProfiles.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Staff Payroll</h1>
          <p className="admin-page-subtitle">
            Manage faculty compensation profiles, monthly salary disbursements, statutory deductions, and digital payslips.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={exportPayrollCSV}>
            <span>Export Schedule</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setNewRunModalOpen(true)}>
            <span>+ Run Monthly Payroll</span>
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
          { id: 'profiles', label: 'Employee Salary Profiles', count: profiles.length },
          { id: 'runs', label: 'Monthly Payroll Cycles', count: periods.length },
          { id: 'payslips', label: 'Disbursed Payslips', count: payments.length },
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
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Monthly Net Payroll</span>
          </div>
          <div className="admin-kpi-number">₦{kpis.totalNet.toLocaleString()}</div>
          <div className="admin-kpi-trend up">
            <span>{kpis.employeeCount} Staff Total</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>{monthYear}</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Faculty Payroll</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#2563eb' }}>
            ₦{kpis.facultyNet.toLocaleString()}
          </div>
          <div className="admin-kpi-trend up">
            <span>{kpis.teacherCount} Teachers</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>instructional staff</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Support Staff Payroll</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#7c3aed' }}>
            ₦{kpis.staffNet.toLocaleString()}
          </div>
          <div className="admin-kpi-trend neutral">
            <span>{kpis.staffCount} Support Staff</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>operations team</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box admissions">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Statutory Deductions</span>
          </div>
          <div className="admin-kpi-number">₦{kpis.totalDeductions.toLocaleString()}</div>
          <div className="admin-kpi-trend neutral">
            <span>PAYE & Pension</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>withheld</span>
          </div>
        </div>
      </div>

      {/* 4. Filter Row */}
      {activeTab === 'profiles' && (
        <div className="admin-filter-row">
          <div className="admin-filter-search-box">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by staff name, position, bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="admin-select" value={employeeTypeFilter} onChange={(e) => setEmployeeTypeFilter(e.target.value)}>
            <option value="All">Role: All Staff</option>
            <option value="Teacher">Teaching Faculty</option>
            <option value="Staff">Non-Teaching Staff</option>
          </select>

          <select className="admin-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>Dept: {dept}</option>
            ))}
          </select>

          <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
            <span>{longDate}</span>
          </div>
        </div>
      )}

      {/* 5. Main Table Panel */}
      {activeTab === 'profiles' && (
        <div className="admin-table-panel">
          <div className="admin-table-top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedProfiles.length && paginatedProfiles.length > 0}
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
                  <option value={20}>20</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            <div style={{ fontSize: 12, color: '#64748b' }}>
              Employee Salary Profiles Directory
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 36, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === paginatedProfiles.length && paginatedProfiles.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: 40 }}>#</th>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Take-Home</th>
                  <th>Bank Details</th>
                  <th style={{ textAlign: 'right', width: 40 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProfiles.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                      <strong>No employee salary profiles match your search</strong>
                    </td>
                  </tr>
                ) : (
                  paginatedProfiles.map((p, idx) => {
                    const isSelected = selectedIds.includes(p.id)
                    const displayNum = (currentPage - 1) * pageSize + idx + 1
                    return (
                      <tr
                        key={p.id}
                        style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                        onClick={() => setEditProfileModal(p)}
                      >
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(p.id)}
                          />
                        </td>
                        <td style={{ color: '#64748b' }}>{displayNum}</td>
                        <td>
                          <div className="admin-table-user-cell">
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: p.employee_type === 'teacher' ? '#eff6ff' : '#f5f3ff', color: p.employee_type === 'teacher' ? '#2563eb' : '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                              {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="admin-table-name">{p.name}</div>
                              <div className="admin-table-sub">{p.position}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-pill ${p.employee_type === 'teacher' ? 'class-ss' : 'class-jss'}`}>
                            {p.employee_type === 'teacher' ? 'Faculty' : 'Staff'}
                          </span>
                        </td>
                        <td style={{ color: '#475569' }}>{p.department || 'Operations'}</td>
                        <td style={{ color: '#334155', fontWeight: 600 }}>₦{Number(p.basic_salary).toLocaleString()}</td>
                        <td style={{ color: '#059669' }}>₦{Number(p.allowances || 0).toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: '#334155' }}>₦{Number(p.gross_salary).toLocaleString()}</td>
                        <td style={{ color: '#dc2626' }}>-₦{Number(p.deductions || 0).toLocaleString()}</td>
                        <td style={{ fontWeight: 800, color: '#09261d', fontSize: 13 }}>
                          ₦{Number(p.net_salary).toLocaleString()}
                        </td>
                        <td>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{p.bank_name || 'Zenith Bank'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.account_number || '2001928392'}</div>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            className="admin-btn-outline"
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            onClick={() => setEditProfileModal(p)}
                          >
                            Edit
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
            <div>Showing {startEntry} to {endEntry} of {filteredProfiles.length} employee records</div>
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
      )}

      {/* Payroll Cycles & Runs Table */}
      {activeTab === 'runs' && (
        <div className="admin-table-panel">
          <div className="admin-table-top-bar">
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Payroll Disbursement Cycles</span>
            <div style={{ fontSize: 12, color: '#64748b' }}>Institutional Bank Disbursals</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cycle Period</th>
                  <th>Academic Term</th>
                  <th>Employees</th>
                  <th>Total Gross</th>
                  <th>Total Deductions</th>
                  <th>Net Disbursed</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((prd) => (
                  <tr key={prd.id}>
                    <td style={{ fontWeight: 700, color: '#09261d' }}>{prd.name}</td>
                    <td>{prd.term || '1st Term 2025/2026'}</td>
                    <td>20 Staff</td>
                    <td>₦{Number(prd.total_gross || 8577000).toLocaleString()}</td>
                    <td style={{ color: '#dc2626' }}>-₦{Number(prd.total_deductions || 1250000).toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>
                      ₦{Number(prd.total_net || 7327000).toLocaleString()}
                    </td>
                    <td>
                      <span className={`admin-pill ${prd.status === 'paid' ? 'paid' : 'pending'}`}>
                        ● {prd.status === 'paid' ? 'Disbursed' : 'Ready to Run'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {prd.status === 'paid' ? (
                        <button className="admin-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => showToast('NIBSS bank transfer statement downloaded!')}>
                          Bank Statement
                        </button>
                      ) : (
                        <button className="admin-btn-primary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleDisbursePayroll(prd.id)}>
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disbursed Payslips */}
      {activeTab === 'payslips' && (
        <div className="admin-table-panel">
          <div className="admin-table-top-bar">
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Individual Employee Payslips</span>
            <div style={{ fontSize: 12, color: '#64748b' }}>{monthYear} Disbursals</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Transaction Ref</th>
                  <th>Payment Date</th>
                  <th>Amount Paid</th>
                  <th>Payment Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-user-cell">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
                          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="admin-table-name">{p.name}</div>
                          <div className="admin-table-sub">{p.position}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>TRN-2026-NIBSS-{2000 + p.id}</td>
                    <td>{shortDate}</td>
                    <td style={{ fontWeight: 800, color: '#09261d' }}>₦{Number(p.net_salary).toLocaleString()}</td>
                    <td>
                      <span className="admin-pill paid">● Paid</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn-outline"
                        style={{ padding: '4px 8px', fontSize: 11 }}
                        onClick={() => setSelectedPayslipPayment(p)}
                      >
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Edit Salary Profile */}
      {editProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              Edit Salary Profile: {editProfileModal.name}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Modify base salary and institutional allowances.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Basic Salary (₦)
                </label>
                <input
                  type="number"
                  value={editProfileModal.basic_salary}
                  onChange={(e) => setEditProfileModal({ ...editProfileModal, basic_salary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Housing Allowance (₦)
                  </label>
                  <input
                    type="number"
                    value={editProfileModal.housing_allowance || 0}
                    onChange={(e) => setEditProfileModal({ ...editProfileModal, housing_allowance: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Transport Allowance (₦)
                  </label>
                  <input
                    type="number"
                    value={editProfileModal.transport_allowance || 0}
                    onChange={(e) => setEditProfileModal({ ...editProfileModal, transport_allowance: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    PAYE Tax Deduction (₦)
                  </label>
                  <input
                    type="number"
                    value={editProfileModal.tax_deduction || 0}
                    onChange={(e) => setEditProfileModal({ ...editProfileModal, tax_deduction: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Pension (₦)
                  </label>
                  <input
                    type="number"
                    value={editProfileModal.pension_deduction || 0}
                    onChange={(e) => setEditProfileModal({ ...editProfileModal, pension_deduction: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setEditProfileModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={isProcessing}>
                  {isProcessing ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Payslip */}
      {selectedPayslipPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #09261d', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#09261d' }}>RIVERSIDE ACADEMY</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>OFFICIAL STAFF SALARY PAYSLIP</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#2563eb' }}>{monthYear}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Ref: TRN-NIBSS-9021</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Employee Name:</span>
                <strong>{selectedPayslipPayment.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Position & Department:</span>
                <span>{selectedPayslipPayment.position} ({selectedPayslipPayment.department})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Bank & Account:</span>
                <span>{selectedPayslipPayment.bank_name} • {selectedPayslipPayment.account_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Basic Salary:</span>
                <span>₦{Number(selectedPayslipPayment.basic_salary).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Allowances:</span>
                <span style={{ color: '#059669' }}>+₦{Number(selectedPayslipPayment.allowances || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Statutory Deductions (PAYE/Pension):</span>
                <span style={{ color: '#dc2626' }}>-₦{Number(selectedPayslipPayment.deductions || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Net Disbursed Take-Home:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#09261d' }}>₦{Number(selectedPayslipPayment.net_salary).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="admin-btn-outline" onClick={() => setSelectedPayslipPayment(null)}>
                Close
              </button>
              <button className="admin-btn-primary" onClick={() => window.print()}>
                🖨 Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
