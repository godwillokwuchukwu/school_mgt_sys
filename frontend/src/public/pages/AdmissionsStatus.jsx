import { useState } from 'react'
import { Link } from 'react-router-dom'
import { publicApi } from '../api'
import { ErrorBanner, PageHero } from '../ui'
import { formatDate } from '../formatters'

const STATUS_ORDER = [
  'submitted',
  'payment_pending',
  'payment_confirmed',
  'admission_offered',
  'enrolled',
]

const STATUS_LABEL = {
  started: 'Application Started',
  submitted: 'Application Submitted',
  under_review: 'Under Review',
  documents_pending: 'Documents Pending',
  payment_pending: 'Payment Pending',
  payment_confirmed: 'Payment Confirmed',
  admission_offered: 'Admission Offered',
  enrolled: 'Officially Enrolled',
  rejected: 'Admission Declined (Ended)',
}

export default function AdmissionsStatus() {
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [showOfferLetter, setShowOfferLetter] = useState(false)

  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptUploadSuccess, setReceiptUploadSuccess] = useState(null)
  const [receiptUploadError, setReceiptUploadError] = useState('')

  const handleReceiptUpload = async (e) => {
    e.preventDefault()
    if (!receiptFile || !reference.trim()) return
    setUploadingReceipt(true)
    setReceiptUploadError('')
    try {
      const formData = new FormData()
      formData.append('file', receiptFile)
      const res = await publicApi.uploadPaymentReceipt(reference.trim(), formData)
      setReceiptUploadSuccess(res)
      setResult(prev => ({
        ...prev,
        data: {
          ...prev.data,
          payment_receipt: res
        }
      }))
    } catch (err) {
      setReceiptUploadError(err.message || 'Failed to upload payment slip. Please try again.')
    } finally {
      setUploadingReceipt(false)
    }
  }

  const lookup = async (event) => {
    event.preventDefault()
    if (!reference.trim()) return
    setError('')
    setResult(null)
    setShowOfferLetter(false)
    setReceiptUploadSuccess(null)
    setReceiptUploadError('')
    setLoading(true)
    try {
      const data = await publicApi.applicationStatus(reference.trim())
      setResult({ kind: 'application', data })
    } catch {
      try {
        const data = await publicApi.admissionEnquiryStatus(reference.trim())
        setResult({ kind: 'enquiry', data })
      } catch {
        setError('No application or enquiry found with that reference. Double-check the reference number and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const appStatus = result?.data?.status
  const isRejected = appStatus === 'rejected'
  const isPaymentPending = appStatus === 'payment_pending'
  const isPaymentConfirmed = appStatus === 'payment_confirmed'
  const isAdmissionOffered = appStatus === 'admission_offered'
  const isEnrolled = appStatus === 'enrolled'

  // Determine active step index
  let currentIndex = -1
  if (['submitted', 'under_review', 'documents_pending'].includes(appStatus)) {
    currentIndex = 0
  } else if (isPaymentPending) {
    currentIndex = 1
  } else if (isPaymentConfirmed) {
    currentIndex = 2
  } else if (isAdmissionOffered) {
    currentIndex = 3
  } else if (isEnrolled) {
    currentIndex = 4
  }

  const studentFullName = result?.data?.student_first_name
    ? `${result.data.student_first_name} ${result.data.student_last_name}`
    : result?.data?.student_name || 'Applicant'

  return (
    <>
      <PageHero
        crumb="Admissions"
        title="Track your application"
        detail="Enter the reference number you received upon registration to check your admission progress."
      />

      <section className="bfa-section">
        <div className="bfa-container" style={{ maxWidth: 680 }}>
          <form className="bfa-form" onSubmit={lookup} style={{ marginBottom: 30 }}>
            <ErrorBanner message={error} />
            <label className="bfa-field">
              Reference number
              <input
                required
                placeholder="e.g. BFA-2026-000184"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </label>
            <button className="bfa-btn bfa-btn-navy" disabled={loading}>
              {loading ? 'Searching…' : 'Check status'}
            </button>
          </form>

          {result && (
            <div className="bfa-card" style={{ padding: '2rem' }}>
              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span
                  className="bfa-status-pill"
                  style={{
                    backgroundColor: isRejected ? '#fee2e2' : isEnrolled ? '#dcfce7' : isAdmissionOffered ? '#ede9fe' : '#fef3c7',
                    color: isRejected ? '#dc2626' : isEnrolled ? '#16a34a' : isAdmissionOffered ? '#7c3aed' : '#d97706',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                  }}
                >
                  {STATUS_LABEL[appStatus] || appStatus}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--bfa-muted)' }}>
                  Ref: <strong>{result.data.reference}</strong>
                </span>
              </div>

              <h2 style={{ marginTop: 16, marginBottom: 4, color: '#0e3d2f', fontSize: '22px' }}>
                {studentFullName}
              </h2>
              <p style={{ margin: '0 0 16px', color: '#4b5563', fontSize: '13px' }}>
                Applying for: <strong>{result.data.class_applying_for}</strong>
                {result.data.academic_session && <span> • Session: {result.data.academic_session}</span>}
              </p>

              {/* Progress Stepper for Applications (Hidden if rejected) */}
              {result.kind === 'application' && !isRejected && (
                <ul className="bfa-timeline" style={{ marginTop: 24, marginBottom: 28 }}>
                  {STATUS_ORDER.map((stepKey, index) => {
                    const isDone = index < currentIndex
                    const isCurrent = index === currentIndex
                    return (
                      <li
                        key={stepKey}
                        className={isDone ? 'done' : isCurrent ? 'current' : ''}
                      >
                        <span className="bfa-timeline-dot" />
                        <div>
                          <strong>{STATUS_LABEL[stepKey]}</strong>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* REJECTED / DECLINED NOTICE */}
              {isRejected && (
                <div style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginTop: '1rem',
                  color: '#991b1b',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <strong style={{ fontSize: '15px' }}>Admission Application Declined</strong>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    We regret to inform you that your application for admission has been declined by the Admissions Board.
                    The admission process for this application reference has concluded. If you have questions, please contact the admissions office.
                  </p>
                </div>
              )}

              {/* PAYMENT PENDING INSTRUCTIONS & RECEIPT UPLOAD */}
              {isPaymentPending && (
                <div style={{
                  background: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  borderRadius: '8px',
                  padding: '1.75rem',
                  marginTop: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px' }}>💳</span>
                    <strong style={{ fontSize: '16px', color: '#92400e' }}>
                      Documentation Accepted — School Bank Payment Required
                    </strong>
                  </div>
                  
                  <p style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.6, margin: '0 0 14px' }}>
                    Congratulations! Your application and registration documents have been accepted by the Admissions Board.
                    To move forward to the next stage and receive your <strong>Official Admission Offer Letter</strong>, please make payment to the school bank account details below:
                  </p>

                  <div style={{
                    background: '#fff',
                    border: '1.5px solid #fcd34d',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '13px',
                    color: '#1f2937',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div><span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Bank Name</span><strong>First Bank of Nigeria</strong></div>
                      <div><span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Account Name</span><strong>Riverside Academy Admissions</strong></div>
                      <div><span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Account Number</span><strong style={{ fontSize: '15px', color: '#0e3d2f' }}>1029384756</strong></div>
                      <div><span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Amount Due</span><strong style={{ fontSize: '15px', color: '#b45309' }}>₦150,000.00</strong></div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Payment Narration / Reference</span>
                        <code style={{ background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{result.data.reference}</code>
                      </div>
                    </div>
                  </div>

                  {/* UPLOAD RECEIPT / SLIP SECTION */}
                  <div style={{
                    marginTop: '18px',
                    paddingTop: '16px',
                    borderTop: '1px solid #fde68a'
                  }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13.5px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📄</span> Upload Payment Receipt / Bank Transfer Slip
                    </h4>
                    <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#78350f' }}>
                      After making payment, please upload your deposit slip, teller, or mobile transfer receipt so the school administration can verify it against the bank account.
                    </p>

                    {(result.data.payment_receipt || receiptUploadSuccess) ? (
                      <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div>
                          <strong style={{ color: '#166534', fontSize: '12.5px' }}>✓ Payment Slip Uploaded & Submitted</strong>
                          <span style={{ display: 'block', fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                            The admin has been notified and will confirm your payment shortly.
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a
                            href={(result.data.payment_receipt || receiptUploadSuccess).file}
                            target="_blank"
                            rel="noreferrer"
                            className="bfa-btn bfa-btn-navy"
                            style={{ fontSize: '11px', padding: '5px 12px', textDecoration: 'none' }}
                          >
                            👁 View Receipt
                          </a>
                          <button
                            type="button"
                            className="bfa-btn"
                            style={{ fontSize: '11px', padding: '5px 10px', background: '#fff', border: '1px solid #86efac', color: '#166534' }}
                            onClick={() => {
                              setReceiptUploadSuccess(null)
                              setResult(prev => ({
                                ...prev,
                                data: { ...prev.data, payment_receipt: null }
                              }))
                            }}
                          >
                            Upload New Slip
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleReceiptUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          required
                          onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                          style={{
                            fontSize: '12px',
                            padding: '6px',
                            background: '#fff',
                            border: '1px solid #fcd34d',
                            borderRadius: '6px',
                            flex: '1 1 240px'
                          }}
                        />
                        <button
                          type="submit"
                          className="bfa-btn bfa-btn-navy"
                          disabled={uploadingReceipt || !receiptFile}
                          style={{ fontSize: '12px', padding: '8px 16px' }}
                        >
                          {uploadingReceipt ? 'Uploading Slip...' : 'Upload Payment Slip →'}
                        </button>
                      </form>
                    )}

                    {receiptUploadError && (
                      <p style={{ color: '#dc2626', fontSize: '11.5px', marginTop: '8px' }}>
                        {receiptUploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENT CONFIRMED NOTICE */}
              {isPaymentConfirmed && (
                <div style={{
                  background: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  color: '#1e40af',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>✓</span>
                    <strong style={{ fontSize: '15px' }}>Payment Confirmed & Verified</strong>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    Your admission fee payment has been confirmed by the school administration.
                    Your Official Admission Offer Letter is currently being issued and will appear here shortly.
                  </p>
                </div>
              )}

              {/* ADMISSION OFFERED (OFFER LETTER READY) */}
              {isAdmissionOffered && (
                <div style={{
                  background: '#faf5ff',
                  border: '1.5px solid #e9d5ff',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📜</span>
                    <strong style={{ fontSize: '15px', color: '#6b21a8' }}>Admission Offer Letter Issued!</strong>
                  </div>
                  <p style={{ fontSize: '13px', color: '#581c87', lineHeight: 1.6, margin: '0 0 14px' }}>
                    Riverside Academy has formally issued your Provisional Admission Offer Letter. You can view, download, and print your official letter below.
                  </p>
                  <button
                    className="bfa-btn bfa-btn-navy"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                    onClick={() => setShowOfferLetter(!showOfferLetter)}
                  >
                    {showOfferLetter ? 'Hide Offer Letter ▲' : 'View & Print Admission Offer Letter ▼'}
                  </button>
                </div>
              )}

              {/* ENROLLED NOTICE */}
              {isEnrolled && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px' }}>🎓</span>
                    <strong style={{ fontSize: '16px', color: '#166534' }}>
                      Congratulations! Officially Enrolled at Riverside Academy
                    </strong>
                  </div>
                  <p style={{ fontSize: '13px', color: '#14532d', lineHeight: 1.6, margin: '0 0 14px' }}>
                    You are officially enrolled! The school administration has generated portal login credentials for both the <strong>Student</strong> and <strong>Parent</strong>.
                    These have been dispatched to your registered email addresses. You can now log into the portal to commence studies.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link
                      to="/portal"
                      className="bfa-btn bfa-btn-navy"
                      style={{ fontSize: '12px', padding: '8px 16px', textDecoration: 'none' }}
                    >
                      Go to Portal Login →
                    </Link>
                    <button
                      className="bfa-btn"
                      style={{ fontSize: '12px', padding: '8px 16px', background: '#fff', border: '1px solid #166534', color: '#166534' }}
                      onClick={() => setShowOfferLetter(!showOfferLetter)}
                    >
                      {showOfferLetter ? 'Hide Offer Letter' : 'View Admission Offer Letter'}
                    </button>
                  </div>
                </div>
              )}

              {/* EMBEDDED OFFICIAL ADMISSION OFFER LETTER */}
              {showOfferLetter && (
                <div style={{
                  marginTop: '2rem',
                  border: '2px solid #0e3d2f',
                  padding: '2rem',
                  borderRadius: '8px',
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  color: '#1a2f26'
                }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #b5883e', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', color: '#0e3d2f', margin: '0 0 4px', fontSize: '24px' }}>
                      RIVERSIDE ACADEMY
                    </h2>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#b5883e', fontWeight: 700, letterSpacing: '1.5px' }}>
                      EXCELLENCE • INTEGRITY • LEADERSHIP
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                      Plot 12, Academic Crescent, Victoria Island, Lagos | admissions@riverside.edu.ng
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1.5rem' }}>
                    <div>
                      <strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                      <strong>Reference:</strong> {result.data.reference}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong>Academic Session:</strong> {result.data.academic_session || '2026/2027'}
                    </div>
                  </div>

                  <h3 style={{ textAlign: 'center', fontSize: '15px', color: '#0e3d2f', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1.25rem' }}>
                    OFFICIAL LETTER OF PROVISIONAL ADMISSION OFFER
                  </h3>

                  <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                    Dear <strong>{studentFullName}</strong> and Parent/Guardian,
                  </p>

                  <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                    Following the comprehensive review of your application and verification of submitted documents, the Admissions Board of <strong>Riverside Academy</strong> is delighted to formally offer you provisional admission into <strong>{result.data.class_applying_for}</strong> for the <strong>{result.data.academic_session || '2026/2027'}</strong> academic session.
                  </p>

                  <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                    Riverside Academy prides itself on academic excellence, character development, and modern innovation. We look forward to welcoming you into our student body.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e0d5' }}>
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block' }}>Dr. Eleanor Vance</strong>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>Head of Admissions</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '12px', display: 'block' }}>Prof. Marcus Sterling</strong>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>Principal / Head of School</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button
                      className="bfa-btn bfa-btn-navy"
                      style={{ fontSize: '11px', padding: '6px 14px' }}
                      onClick={() => window.print()}
                    >
                      🖨 Print Letter
                    </button>
                  </div>
                </div>
              )}

              {result.data.submitted_at && (
                <p style={{ fontSize: 12, color: 'var(--bfa-muted)', marginTop: 20 }}>
                  Submitted on {formatDate(result.data.submitted_at)}
                </p>
              )}

              {result.kind === 'enquiry' && (
                <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--bfa-muted)' }}>
                  This is a preliminary enquiry. Ready to move forward?{' '}
                  <Link to="/admissions/apply">Start the full application →</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
