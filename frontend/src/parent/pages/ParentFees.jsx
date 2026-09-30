import React from 'react'

export default function ParentFees({
  children = [],
  selectedChild,
  onSelectChild,
  onOpenPayment,
}) {
  const child = selectedChild || children[0]
  if (!child) return null

  const fees = child.feesBreakdown || []
  const totalBilled = child.feesTotal || 4500
  const totalPaid = child.feesPaid || (totalBilled - (child.feesDue || 0))
  const balance = child.feesDue || 0

  const handleDownloadReceipt = (id) => {
    alert(`Downloading verified Bursary Receipt for invoice #${id} (PDF)...`)
  }

  return (
    <div className="parent-fees-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Fees & Payment Center</h1>
          <p className="parent-page-subtitle">
            Manage tuition dues, itemized levies, and verified payment transactions for <strong>{child.name}</strong>.
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
            onClick={onOpenPayment}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            Make Payment Now
          </button>
        </div>
      </div>

      {/* 4 Financial KPIs */}
      <div className="parent-kpi-grid">
        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Total Invoiced (Term 3)</span>
            <div className="parent-kpi-icon-wrap blue">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val">${totalBilled.toLocaleString()}</span>
          </div>
          <span className="parent-kpi-sub">Official institutional assessment</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Total Paid & Cleared</span>
            <div className="parent-kpi-icon-wrap green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val" style={{ color: '#047857' }}>${totalPaid.toLocaleString()}</span>
          </div>
          <span className="parent-kpi-sub">Verified by Bursary Office</span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Outstanding Balance</span>
            <div className="parent-kpi-icon-wrap coral">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val" style={{ color: balance > 0 ? '#b91c1c' : '#059669' }}>
              ${balance.toLocaleString()}
            </span>
          </div>
          <span className="parent-kpi-sub">
            {balance > 0 ? 'Due before examination clearance' : 'Account in good standing'}
          </span>
        </div>

        <div className="parent-kpi-card">
          <div className="parent-kpi-top">
            <span className="parent-kpi-label">Next Payment Due</span>
            <div className="parent-kpi-icon-wrap purple">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="parent-kpi-val-row">
            <span className="parent-kpi-val" style={{ fontSize: 20 }}>Oct 15, 2025</span>
          </div>
          <span className="parent-kpi-sub">15 Days remaining</span>
        </div>
      </div>

      {/* Itemized Fee Invoices Table */}
      <div className="parent-panel-card" style={{ marginBottom: 24 }}>
        <div className="parent-panel-header">
          <div className="parent-panel-title-wrap">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
            </svg>
            <div>
              <div className="parent-panel-title">Itemized Fee Invoices & Levies</div>
              <span className="parent-panel-subtitle">Term 3 billing breakdown</span>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: 11.5 }}>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>DESCRIPTION</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>AMOUNT</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>DUE DATE</th>
                <th style={{ padding: '12px 10px', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 10px' }}>
                    <strong style={{ color: '#0f172a', display: 'block', fontSize: 13.5 }}>{item.description}</strong>
                    <span style={{ fontSize: 11.5, color: '#94a3b8' }}>ID: {item.id}</span>
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: 700, color: '#09261d', fontSize: 14 }}>
                    ${item.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#64748b' }}>{item.dueDate}</td>
                  <td style={{ padding: '14px 10px' }}>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: item.status === 'Paid' ? '#ecfdf5' : '#fee2e2',
                        color: item.status === 'Paid' ? '#047857' : '#b91c1c',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    {item.status === 'Paid' ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(item.id)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '5px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        Receipt &darr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenPayment}
                        className="parent-btn-primary"
                        style={{ padding: '5px 14px', fontSize: 12 }}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bursary Direct Transfer Details */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <strong style={{ fontSize: 14, color: '#09261d', display: 'block' }}>
            Direct Institutional Bank Transfer Instructions
          </strong>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b' }}>
            Account Name: <strong>Riverside College Bursary</strong> &bull; Bank: <strong>First National Trust Bank</strong> &bull; Account: <strong>0192837465</strong>
          </p>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Payment Reference: Please quote Student ID <code>{child.studentId}</code> when making wire transfers.
          </span>
        </div>

        <button
          type="button"
          onClick={() => alert(`Copied Bursary Account: 0192837465 (${child.studentId})`)}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Copy Account Details
        </button>
      </div>
    </div>
  )
}
