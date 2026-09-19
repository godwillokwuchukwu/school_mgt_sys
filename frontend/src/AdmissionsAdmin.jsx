import { useState, useEffect, useCallback } from 'react'
import { api, API_URL } from './api'

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: '#b5883e', bg: '#fff4db' },
  under_review: { label: 'Under Review', color: '#b5883e', bg: '#fff4db' },
  documents_pending: { label: 'Docs Pending', color: '#b5883e', bg: '#fff4db' },
  payment_pending: { label: 'Payment Pending', color: '#d97706', bg: '#fef3c7' },
  payment_confirmed: { label: 'Payment Confirmed', color: '#2563eb', bg: '#dbeafe' },
  admission_offered: { label: 'Offer Issued', color: '#7c3aed', bg: '#ede9fe' },
  enrolled: { label: 'Enrolled', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Declined (Ended)', color: '#dc2626', bg: '#fee2e2' },
}

function generatePassword(prefix = 'User') {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}2026!${rand}`
}

function formatSchoolEmail(firstName, lastName, role = 'student') {
  const cleanFirst = (firstName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = (lastName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${cleanFirst}${cleanLast}` || 'user';
  const subdomain = (role === 'teacher' || role === 'staff' || role === 'admin') ? 'staff' : role;
  return `${base}@${subdomain}.riversideacademy.com`;
}

export default function AdmissionsAdmin({ onBack }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Modals state
  const [selectedApp, setSelectedApp] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Enrollment modal
  const [enrollModalApp, setEnrollModalApp] = useState(null)
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPassword, setParentPassword] = useState('')

  // Credentials success modal
  const [credentialsModal, setCredentialsModal] = useState(null)

  // Offer letter view modal
  const [offerLetterApp, setOfferLetterApp] = useState(null)

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState('')

  const fetchApplications = useCallback(async () => {
    try {
      const data = await api.admissionsApplications()
      setApplications(data.results || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  async function openDetail(app) {
    setDetailLoading(true)
    setSelectedApp(app)
    try {
      const fullData = await api.admissionsApplicationDetail(app.id)
      setSelectedApp(fullData)
    } catch {
      // Keep app
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleApprove(appId) {
    const amountStr = window.prompt("Enter required admission fee amount (₦):", "150000");
    if (amountStr === null) return;
    const amount = parseFloat(amountStr) || 150000;
    setActionLoading(true);
    try {
      const updated = await api.admissionsApprove(appId, amount)
      setSelectedApp(updated);
      alert("Application approved! Status moved to Payment Pending.");
      fetchApplications();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDecline(appId) {
    const reason = window.prompt("Enter reason for declining admission (Admission will end):", "Application requirements not met");
    if (reason === null) return;
    if (!window.confirm("Are you sure you want to decline this application? This ends the admission process.")) return;

    setActionLoading(true);
    try {
      const updated = await api.admissionsDecline(appId, reason)
      setSelectedApp(updated);
      alert("Admission declined. Process ended.");
      fetchApplications();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmPayment(appId) {
    if (!window.confirm("Confirm that admission payment has been verified?")) return;
    setActionLoading(true);
    try {
      const updated = await api.admissionsConfirmPayment(appId, "Payment verified by administrator.")
      setSelectedApp(updated);
      alert("Payment confirmed! You can now issue the Official Admission Offer Letter.");
      fetchApplications();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleOfferAdmission(appId) {
    if (!window.confirm("Issue official Admission Offer Letter for this student?")) return;
    setActionLoading(true);
    try {
      const updated = await api.admissionsOfferAdmission(appId, "Admission offer letter issued.")
      setSelectedApp(updated);
      alert("Official Admission Offer Letter issued! The applicant can now view it on the portal.");
      fetchApplications();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  function startEnrollment(app) {
    setEnrollModalApp(app);
    const defaultStudentEmail = formatSchoolEmail(app.student_first_name, app.student_last_name, 'student');
    const guardianParts = (app.guardian_full_name || '').trim().split(/\s+/);
    const guardianFirst = guardianParts[0] || 'parent';
    const guardianLast = guardianParts.slice(1).join('') || '';
    const defaultParentEmail = formatSchoolEmail(guardianFirst, guardianLast, 'parent');

    setStudentEmail(defaultStudentEmail);
    setStudentPassword(generatePassword('Student'));
    setParentEmail(defaultParentEmail);
    setParentPassword(generatePassword('Parent'));
  }

  async function submitEnrollment(e) {
    e.preventDefault();
    if (!enrollModalApp) return;
    setActionLoading(true);
    try {
      const result = await api.admissionsEnroll(enrollModalApp.id, {
        student_email: studentEmail,
        student_password: studentPassword,
        parent_email: parentEmail,
        parent_password: parentPassword,
      })

      setEnrollModalApp(null);
      if (selectedApp && selectedApp.id === enrollModalApp.id) {
        setSelectedApp(prev => ({ ...prev, status: 'enrolled' }));
      }
      setCredentialsModal(result);
      fetchApplications();
    } catch (err) {
      alert(`Enrollment Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  }

  function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  }

  // Filtered applications
  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'review' && !['submitted', 'under_review', 'documents_pending'].includes(app.status)) return false;
      if (statusFilter !== 'review' && app.status !== statusFilter) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRef = app.reference?.toLowerCase().includes(q);
      const matchName = `${app.student_first_name} ${app.student_last_name}`.toLowerCase().includes(q);
      const matchClass = app.class_applying_for?.toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchClass) return false;
    }
    return true;
  });

  return (
    <>
      <div className="content-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Admissions Management</h1>
          <p className="muted">Review registration documents, approve applications, confirm payments, and provision student & parent portal logins.</p>
        </div>
        {onBack && (
          <button className="secondary-button" onClick={onBack}>
            ← Overview
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="panel page-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'review', label: 'Pending Review' },
              { id: 'payment_pending', label: 'Payment Pending' },
              { id: 'payment_confirmed', label: 'Payment Confirmed' },
              { id: 'admission_offered', label: 'Offer Issued' },
              { id: 'enrolled', label: 'Enrolled' },
              { id: 'rejected', label: 'Declined' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={statusFilter === tab.id ? 'primary-button' : 'secondary-button'}
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '240px', flex: '0 1 300px' }}>
            <input
              type="search"
              placeholder="Search reference, name, class..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #dce3eb',
                fontSize: '12px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Applications ({filteredApps.length})</h2>
            <p className="muted">Click "Review & Process" to view student details, uploaded certificates, and progress the admission.</p>
          </div>
        </div>

        {loading && <p style={{ padding: '1.5rem' }}>Loading applications...</p>}
        {error && <p className="form-error" style={{ padding: '1.5rem' }}>{error}</p>}

        {!loading && !error && filteredApps.length === 0 && (
          <div className="empty-state">
            <strong>No applications found</strong>
            <span>No admission applications match the current filter.</span>
          </div>
        )}

        {!loading && !error && filteredApps.map(app => {
          const cfg = STATUS_CONFIG[app.status] || { label: app.status, color: '#4b5563', bg: '#f3f4f6' };
          return (
            <div
              key={app.id}
              className="attention-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem',
                borderBottom: '1px solid var(--border-light)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                  <b style={{ fontSize: '14px', color: '#111827' }}>
                    {app.student_first_name} {app.student_last_name}
                  </b>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      color: cfg.color,
                      background: cfg.bg,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {cfg.label}
                  </span>
                  {app.has_payment_receipt && (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        color: '#166534',
                        background: '#dcfce7',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      💳 Slip Uploaded
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#6b7280', fontSize: '11.5px' }}>
                  <span>Ref: <strong>{app.reference}</strong></span>
                  <span>Class: <strong>{app.class_applying_for}</strong></span>
                  {app.academic_session && <span>Session: {app.academic_session}</span>}
                  {app.submitted_at && <span>Submitted: {new Date(app.submitted_at).toLocaleDateString()}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="secondary-button"
                  onClick={() => openDetail(app)}
                  style={{ fontSize: '11px', padding: '7px 14px' }}
                >
                  Review & Process →
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Review & Process Modal */}
      {selectedApp && (
        <div className="modal-backdrop" onClick={() => setSelectedApp(null)}>
          <div
            className="modal"
            style={{ width: 'min(780px, 95vw)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedApp(null)}>✕</button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>ADMISSION REVIEW</p>
                <h2 style={{ margin: '4px 0', fontSize: '20px' }}>
                  {selectedApp.student_first_name} {selectedApp.student_middle_name || ''} {selectedApp.student_last_name}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '12px' }}>
                  <span>Reference: <b>{selectedApp.reference}</b></span>
                  <span>Applying For: <b>{selectedApp.class_applying_for}</b></span>
                </div>
              </div>
              <div>
                {(() => {
                  const cfg = STATUS_CONFIG[selectedApp.status] || { label: selectedApp.status, color: '#374151', bg: '#f3f4f6' };
                  return (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '11px',
                      color: cfg.color,
                      background: cfg.bg
                    }}>
                      {cfg.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {detailLoading && <p style={{ padding: '1rem' }}>Loading full registration details & documents...</p>}

            {!detailLoading && (
              <>
                {/* 2-Column Info: Student & Guardian */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* Student Info */}
                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '13px', margin: '0 0 10px', color: '#0e3d2f' }}>Student Information</h3>
                    <div style={{ display: 'grid', gap: '6px', fontSize: '12px', color: '#374151' }}>
                      <div><b>DOB:</b> {selectedApp.student_dob || 'N/A'}</div>
                      <div><b>Gender:</b> {selectedApp.student_gender || 'N/A'}</div>
                      <div><b>Nationality:</b> {selectedApp.student_nationality || 'N/A'}</div>
                      <div><b>Student Email:</b> {selectedApp.student_email || 'Not provided'}</div>
                      <div><b>Student Phone:</b> {selectedApp.student_phone || 'Not provided'}</div>
                      <div><b>Residential Address:</b> {selectedApp.student_address || 'N/A'}</div>
                      <div><b>Previous School:</b> {selectedApp.previous_school || 'N/A'}</div>
                      <div><b>Previous Class:</b> {selectedApp.previous_class || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Guardian Info */}
                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '13px', margin: '0 0 10px', color: '#0e3d2f' }}>Guardian Information</h3>
                    <div style={{ display: 'grid', gap: '6px', fontSize: '12px', color: '#374151' }}>
                      <div><b>Full Name:</b> {selectedApp.guardian_full_name}</div>
                      <div><b>Relationship:</b> {selectedApp.guardian_relationship || 'Parent/Guardian'}</div>
                      <div><b>Email:</b> {selectedApp.guardian_email}</div>
                      <div><b>Phone:</b> {selectedApp.guardian_phone}</div>
                      <div><b>Address:</b> {selectedApp.guardian_address || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents Section */}
                <div style={{ marginBottom: '1.5rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                  <h3 style={{ fontSize: '13px', margin: '0 0 10px', color: '#0e3d2f' }}>
                    Uploaded Documents ({selectedApp.documents?.length || 0})
                  </h3>
                  {(!selectedApp.documents || selectedApp.documents.length === 0) ? (
                    <p className="muted" style={{ fontSize: '12px', margin: 0 }}>No documents uploaded by applicant.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedApp.documents.map(doc => (
                        <div
                          key={doc.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: doc.document_type === 'payment_receipt' ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '6px',
                            border: `1px solid ${doc.document_type === 'payment_receipt' ? '#86efac' : '#e2e8f0'}`,
                            fontSize: '12px'
                          }}
                        >
                          <div>
                            <strong style={{
                              textTransform: 'capitalize',
                              color: doc.document_type === 'payment_receipt' ? '#166534' : 'inherit'
                            }}>
                              {doc.document_type === 'payment_receipt' ? '💳 Payment Receipt / Transfer Slip' : doc.document_type.replace(/_/g, ' ')}
                            </strong>
                            {doc.uploaded_at && (
                              <span style={{ color: '#94a3b8', marginLeft: '10px', fontSize: '11px' }}>
                                ({new Date(doc.uploaded_at).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noreferrer"
                            className="secondary-button"
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              textDecoration: 'none',
                              borderColor: doc.document_type === 'payment_receipt' ? '#86efac' : '#e2e8f0',
                              color: doc.document_type === 'payment_receipt' ? '#166534' : 'inherit'
                            }}
                          >
                            📄 View / Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dedicated Payment Receipt Verification Card */}
                {(() => {
                  const paymentDoc = selectedApp.documents?.find(d => d.document_type === 'payment_receipt');
                  if (!['payment_pending', 'payment_confirmed', 'admission_offered', 'enrolled'].includes(selectedApp.status)) return null;

                  return (
                    <div style={{
                      marginBottom: '1.5rem',
                      background: paymentDoc ? '#f0fdf4' : '#fffbeb',
                      border: `1.5px solid ${paymentDoc ? '#86efac' : '#fde68a'}`,
                      borderRadius: '8px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '13.5px', color: paymentDoc ? '#166534' : '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{paymentDoc ? '✓' : '⚠️'}</span>
                            <span>{paymentDoc ? 'Payment Receipt / Bank Slip Submitted' : 'Payment Slip Not Yet Uploaded'}</span>
                          </h4>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: paymentDoc ? '#15803d' : '#78350f' }}>
                            {paymentDoc
                              ? `Uploaded by applicant on ${new Date(paymentDoc.uploaded_at).toLocaleDateString()}. Verify that funds reflect in the school bank account before confirming payment.`
                              : 'The applicant has not yet uploaded proof of payment / bank transfer slip for this application.'}
                          </p>
                        </div>
                        {paymentDoc && (
                          <a
                            href={paymentDoc.file}
                            target="_blank"
                            rel="noreferrer"
                            className="primary-button"
                            style={{ background: '#166534', fontSize: '11px', textDecoration: 'none', padding: '6px 14px' }}
                          >
                            👁 View Payment Slip
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Status-specific Action Bar */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem', marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                    Admission Decision & Progression Actions
                  </h3>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Stage 1: Review -> Approve or Decline */}
                    {['submitted', 'under_review', 'documents_pending'].includes(selectedApp.status) && (
                      <>
                        <button
                          className="primary-button"
                          style={{ background: '#15803d' }}
                          disabled={actionLoading}
                          onClick={() => handleApprove(selectedApp.id)}
                        >
                          ✓ Approve & Request Payment
                        </button>
                        <button
                          className="secondary-button"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          disabled={actionLoading}
                          onClick={() => handleDecline(selectedApp.id)}
                        >
                          ✕ Decline Admission
                        </button>
                      </>
                    )}

                    {/* Stage 2: Payment Pending -> Confirm Payment */}
                    {selectedApp.status === 'payment_pending' && (
                      <>
                        <button
                          className="primary-button"
                          style={{ background: '#2563eb' }}
                          disabled={actionLoading}
                          onClick={() => handleConfirmPayment(selectedApp.id)}
                        >
                          💳 Confirm Payment Received
                        </button>
                        <button
                          className="secondary-button"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          disabled={actionLoading}
                          onClick={() => handleDecline(selectedApp.id)}
                        >
                          ✕ Decline Admission
                        </button>
                      </>
                    )}

                    {/* Stage 3: Payment Confirmed -> Issue Offer Letter */}
                    {selectedApp.status === 'payment_confirmed' && (
                      <>
                        <button
                          className="primary-button"
                          style={{ background: '#7c3aed' }}
                          disabled={actionLoading}
                          onClick={() => handleOfferAdmission(selectedApp.id)}
                        >
                          📜 Issue Admission Offer Letter
                        </button>
                        <button
                          className="secondary-button"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          disabled={actionLoading}
                          onClick={() => handleDecline(selectedApp.id)}
                        >
                          ✕ Decline Admission
                        </button>
                      </>
                    )}

                    {/* Stage 4: Offer Issued -> Enroll & Generate Logins */}
                    {selectedApp.status === 'admission_offered' && (
                      <>
                        <button
                          className="primary-button"
                          style={{ background: '#0e3d2f' }}
                          disabled={actionLoading}
                          onClick={() => startEnrollment(selectedApp)}
                        >
                          🎓 Enroll Student & Generate Logins
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() => setOfferLetterApp(selectedApp)}
                        >
                          👁 Preview Offer Letter
                        </button>
                      </>
                    )}

                    {/* Stage 5: Enrolled */}
                    {selectedApp.status === 'enrolled' && (
                      <>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>
                          ✓ Officially Enrolled & Provisioned
                        </span>
                        <button
                          className="secondary-button"
                          onClick={() => setOfferLetterApp(selectedApp)}
                        >
                          👁 View Offer Letter
                        </button>
                      </>
                    )}

                    {/* Stage: Rejected */}
                    {selectedApp.status === 'rejected' && (
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '13px' }}>
                        ✕ Admission Declined (Admission Ended)
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Enrollment & Credentials Modal */}
      {enrollModalApp && (
        <div className="modal-backdrop" onClick={() => setEnrollModalApp(null)}>
          <div
            className="modal"
            style={{ width: 'min(580px, 95vw)' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setEnrollModalApp(null)}>✕</button>

            <p className="eyebrow">FINAL ENROLLMENT & CREDENTIALS</p>
            <h2 style={{ fontSize: '18px', margin: '4px 0 12px' }}>
              Generate Logins for {enrollModalApp.student_first_name} & Parent
            </h2>
            <p className="muted" style={{ fontSize: '12px', marginBottom: '16px' }}>
              The admin generates email and password logins so the student can commence studies and the parent can monitor progress.
            </p>

            <form onSubmit={submitEnrollment} style={{ display: 'grid', gap: '16px' }}>
              {/* Student Credentials */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '12px', color: '#0e3d2f' }}>Student Portal Login</h4>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ fontSize: '10.5px', padding: '2px 8px' }}
                    onClick={() => setStudentEmail(formatSchoolEmail(enrollModalApp.student_first_name, enrollModalApp.student_last_name, 'student'))}
                  >
                    🔄 Reset Domain Email
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>
                    Official School Email (@student.riversideacademy.com)
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '3px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 400, display: 'block', marginTop: '2px' }}>
                      Official student username. Login details will also be dispatched to personal email: <b>{enrollModalApp.student_email || 'None provided'}</b>
                    </span>
                  </label>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>
                    Student Password
                    <input
                      type="text"
                      required
                      value={studentPassword}
                      onChange={e => setStudentPassword(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '3px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                  </label>
                </div>
              </div>

              {/* Parent Credentials */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '12px', color: '#0e3d2f' }}>Parent Portal Login</h4>
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ fontSize: '10.5px', padding: '2px 8px' }}
                    onClick={() => {
                      const gParts = (enrollModalApp.guardian_full_name || '').trim().split(/\s+/);
                      setParentEmail(formatSchoolEmail(gParts[0] || 'parent', gParts.slice(1).join(''), 'parent'));
                    }}
                  >
                    🔄 Reset Domain Email
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>
                    Official School Email (@parent.riversideacademy.com)
                    <input
                      type="email"
                      required
                      value={parentEmail}
                      onChange={e => setParentEmail(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '3px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 400, display: 'block', marginTop: '2px' }}>
                      Official parent username. Login details will also be dispatched to personal email: <b>{enrollModalApp.guardian_email || 'None provided'}</b>
                    </span>
                  </label>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>
                    Parent Password
                    <input
                      type="text"
                      required
                      value={parentPassword}
                      onChange={e => setParentPassword(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '3px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setStudentPassword(generatePassword('Student'));
                    setParentPassword(generatePassword('Parent'));
                  }}
                  style={{ fontSize: '11px' }}
                >
                  🔄 Regenerate Passwords
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={actionLoading}
                  style={{ background: '#0e3d2f' }}
                >
                  {actionLoading ? 'Enrolling & Activating...' : 'Confirm Enrollment & Activate Logins'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Display Modal */}
      {credentialsModal && (
        <div className="modal-backdrop" onClick={() => setCredentialsModal(null)}>
          <div
            className="modal"
            style={{ width: 'min(560px, 95vw)' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setCredentialsModal(null)}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px' }}>🎉</span>
              <h2 style={{ fontSize: '20px', margin: '8px 0 4px', color: '#0e3d2f' }}>
                Enrollment Complete & Logins Active!
              </h2>
              <p className="muted" style={{ fontSize: '12px' }}>
                Accounts have been activated immediately and credentials sent to their respective email addresses.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              {/* Student Creds */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: '#166534', fontSize: '13px' }}>
                    🎓 Student: {credentialsModal.student.name}
                  </strong>
                  <button
                    className="secondary-button"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => copyToClipboard(`Email: ${credentialsModal.student.email}\nPassword: ${credentialsModal.student.password}`, 'student')}
                  >
                    {copiedKey === 'student' ? '✓ Copied!' : 'Copy Login'}
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#1f2937' }}>
                  <div><b>Email:</b> {credentialsModal.student.email}</div>
                  <div><b>Password:</b> <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{credentialsModal.student.password}</code></div>
                  <div><b>Admission No:</b> {credentialsModal.student.admission_number}</div>
                </div>
              </div>

              {/* Parent Creds */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: '#1e40af', fontSize: '13px' }}>
                    👨‍👩‍👧 Parent: {credentialsModal.parent.name}
                  </strong>
                  <button
                    className="secondary-button"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => copyToClipboard(`Email: ${credentialsModal.parent.email}\nPassword: ${credentialsModal.parent.password}`, 'parent')}
                  >
                    {copiedKey === 'parent' ? '✓ Copied!' : 'Copy Login'}
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#1f2937' }}>
                  <div><b>Email:</b> {credentialsModal.parent.email}</div>
                  <div><b>Password:</b> <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{credentialsModal.parent.password}</code></div>
                </div>
              </div>
            </div>

            <button
              className="primary-button"
              style={{ width: '100%', textAlign: 'center' }}
              onClick={() => setCredentialsModal(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Printable Admission Offer Letter Modal */}
      {offerLetterApp && (
        <div className="modal-backdrop" onClick={() => setOfferLetterApp(null)}>
          <div
            className="modal"
            style={{ width: 'min(720px, 95vw)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setOfferLetterApp(null)}>✕</button>

            <div style={{ border: '2px solid #0e3d2f', padding: '2rem', borderRadius: '6px', background: '#fff', color: '#1a2f26' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #b5883e', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'Georgia, serif', color: '#0e3d2f', margin: '0 0 4px', fontSize: '26px', letterSpacing: '0.5px' }}>
                  RIVERSIDE ACADEMY
                </h1>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#b5883e', fontWeight: 700, letterSpacing: '1px' }}>
                  EXCELLENCE • INTEGRITY • LEADERSHIP
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                  Plot 12, Academic Crescent, Victoria Island, Lagos | admissions@riverside.edu.ng
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                  <strong>Reference:</strong> {offerLetterApp.reference}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Academic Session:</strong> {offerLetterApp.academic_session || '2026/2027'}
                </div>
              </div>

              <h2 style={{ textAlign: 'center', fontSize: '16px', color: '#0e3d2f', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1.5rem' }}>
                OFFICIAL LETTER OF PROVISIONAL ADMISSION OFFER
              </h2>

              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Dear <strong>{offerLetterApp.guardian_full_name}</strong> and <strong>{offerLetterApp.student_first_name} {offerLetterApp.student_last_name}</strong>,
              </p>

              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Following the review of your application and verification of requirements, the Admissions Board of <strong>Riverside Academy</strong> is delighted to formally offer <strong>{offerLetterApp.student_first_name} {offerLetterApp.student_last_name}</strong> provisional admission into <strong>{offerLetterApp.class_applying_for}</strong> for the <strong>{offerLetterApp.academic_session || '2026/2027'}</strong> academic session.
              </p>

              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Riverside Academy prides itself on academic excellence, strong moral foundation, and holistic development. We are confident that {offerLetterApp.student_first_name} will thrive in our learning community.
              </p>

              <div style={{ background: '#fdfbf7', border: '1px solid #e5e0d5', padding: '1rem', borderRadius: '6px', margin: '1.5rem 0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '12px', color: '#0e3d2f' }}>Next Steps for Final Enrollment:</h4>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', lineHeight: 1.7, color: '#4b5563' }}>
                  <li>The administration will finalize enrollment in the school portal.</li>
                  <li>Personalized Student & Parent portal credentials will be generated and dispatched.</li>
                  <li>Log in to access your orientation schedule, curriculum overview, and academic timetable.</li>
                </ol>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1rem' }}>
                <div>
                  <div style={{ width: '140px', borderBottom: '1px solid #0e3d2f', marginBottom: '4px' }}></div>
                  <strong style={{ fontSize: '12px', display: 'block' }}>Dr. Eleanor Vance</strong>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Head of Admissions</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ width: '140px', borderBottom: '1px solid #0e3d2f', marginBottom: '4px', marginLeft: 'auto' }}></div>
                  <strong style={{ fontSize: '12px', display: 'block' }}>Prof. Marcus Sterling</strong>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Principal / Head of School</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="secondary-button" onClick={() => window.print()}>
                🖨 Print Offer Letter
              </button>
              <button className="primary-button" onClick={() => setOfferLetterApp(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
