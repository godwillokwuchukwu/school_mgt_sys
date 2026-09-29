import React from 'react'

export function StudentPayments({ financialData, onOpenMakePayment, showToast }) {
  const handleDownloadReceipt = (txnId) => {
    if (showToast) showToast(`Payment receipt for ${txnId} downloaded! (PDF) ✓`)
    else alert(`Payment receipt for ${txnId} downloaded!`)
  }

  return (
    <div className="student-payments-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Tuition & Fee Payments</h1>
          <p className="student-page-subtitle">
            First Semester 2025/2026 Academic Session &bull; Bursary Financial Record
          </p>
        </div>
        <div className="student-page-actions">
          <button className="student-btn student-btn-primary" onClick={onOpenMakePayment}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Make Payment Now
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="student-kpi-grid">
        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Total Session Bill</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val">{financialData?.totalFeesFormatted || '$2,000.00'}</div>
          <div className="student-kpi-meta" style={{ color: '#64748b' }}>
            Academic Session 2026/2027
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Total Amount Paid</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#0f766e' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: '#0f766e' }}>
            {financialData?.paidFormatted || '$2,000.00'}
          </div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            {financialData?.progressPercent || 100}% of total fees settled
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Outstanding Balance</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ color: financialData?.outstanding > 0 ? '#dc2626' : '#059669' }}>
            {financialData?.outstandingFormatted || '$0.00'}
          </div>
          <div className="student-kpi-meta" style={{ color: financialData?.outstanding > 0 ? '#d97706' : '#059669' }}>
            {financialData?.outstanding > 0 ? 'Due prior to semester exam' : 'All Bursary Accounts Cleared'}
          </div>
        </div>

        <div className="student-kpi-card">
          <div className="student-kpi-top">
            <span className="student-kpi-label">Payment Status</span>
            <div className="student-kpi-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 14 14" />
              </svg>
            </div>
          </div>
          <div className="student-kpi-val" style={{ fontSize: 20, color: '#0f766e' }}>
            {financialData?.outstanding > 0 ? 'Partial Settlement' : '100% Cleared'}
          </div>
          <div className="student-kpi-meta" style={{ color: '#059669' }}>
            Official Bursary Standing Verified
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="student-card" style={{ marginBottom: 24, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
            Tuition Fee Payment Progress
          </span>
          <span style={{ fontWeight: 700, color: '#0f766e' }}>
            {financialData?.progressPercent || 50}%
          </span>
        </div>
        <div style={{ width: '100%', height: 10, backgroundColor: '#e2e8f0', borderRadius: 999 }}>
          <div
            style={{
              width: `${financialData?.progressPercent || 50}%`,
              height: '100%',
              backgroundColor: '#0f766e',
              borderRadius: 999,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="student-card" style={{ marginBottom: 24 }}>
        <div className="student-card-header">
          <h3 className="student-card-title">Schedule of Fees Breakdown</h3>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Fee Item</th>
                <th>Total Invoiced</th>
                <th>Amount Paid</th>
                <th>Balance Outstanding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(financialData?.feeBreakdown || []).map((fee, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{fee.item}</td>
                  <td>{fee.total}</td>
                  <td style={{ color: '#0f766e', fontWeight: 600 }}>{fee.paid}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>{fee.balance}</td>
                  <td>
                    <span className={`student-badge student-badge-${fee.statusClass || 'warning'}`}>
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="student-card">
        <div className="student-card-header">
          <h3 className="student-card-title">Verified Payment History</h3>
        </div>

        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Receipt / Transaction ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount Paid</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(financialData?.paymentHistory || []).map((txn) => (
                <tr key={txn.id}>
                  <td style={{ fontWeight: 700, color: '#0f766e' }}>{txn.id}</td>
                  <td>{txn.date}</td>
                  <td style={{ fontWeight: 500 }}>{txn.description}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{txn.amount}</td>
                  <td style={{ color: '#64748b' }}>{txn.method}</td>
                  <td>
                    <span className="student-badge student-badge-success">{txn.status}</span>
                  </td>
                  <td>
                    <button
                      className="student-btn student-btn-secondary"
                      style={{ fontSize: 12, padding: '5px 10px' }}
                      onClick={() => handleDownloadReceipt(txn.id)}
                    >
                      Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default StudentPayments
