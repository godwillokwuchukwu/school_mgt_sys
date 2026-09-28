import React, { useState } from 'react'

/**
 * 1. Submit Assignment Modal
 */
export function SubmitAssignmentModal({ assignment, onClose, onSubmitSuccess }) {
  const [comment, setComment] = useState('')
  const [fileName, setFileName] = useState('assignment_chinedu_cs2024.pdf')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (onSubmitSuccess) {
        onSubmitSuccess({
          assignmentId: assignment.id,
          content: comment,
          fileName,
        })
      }
      onClose()
    }, 700)
  }

  return (
    <div className="student-modal-backdrop" onClick={onClose}>
      <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header">
          <h3 className="student-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Submit Assignment
          </h3>
          <button className="student-btn-ghost-sm" onClick={onClose} style={{ color: '#64748b' }}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="student-modal-body">
            <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{assignment?.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {assignment?.course} &bull; Due: {assignment?.dueDate} &bull; Max Points: 100
              </div>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Attach Submission File (PDF, DOCX, ZIP)</label>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 8,
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const name = prompt('Enter your submission filename:', fileName)
                  if (name) setFileName(name)
                }}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0f766e" strokeWidth="2" style={{ margin: '0 auto 8px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  Selected: <span style={{ color: '#0f766e' }}>{fileName}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  Click to choose a different file (Max: 25MB)
                </div>
              </div>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Submission Comments / Notes (Optional)</label>
              <textarea
                className="student-form-textarea"
                rows="3"
                placeholder="Include any notes or references for your lecturer..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="student-modal-footer">
            <button type="button" className="student-btn student-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="student-btn student-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * 2. Make Payment Modal
 */
export function MakePaymentModal({ financialData, onClose, onPaymentSuccess }) {
  const [selectedFee, setSelectedFee] = useState('Tuition Fee (Balance)')
  const [amount, setAmount] = useState('1250000')
  const [paymentMethod, setPaymentMethod] = useState('Card (Paystack / Interswitch)')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePay = (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const numericAmount = parseInt(amount, 10) || 500000
      if (onPaymentSuccess) {
        onPaymentSuccess({
          txnId: `RC-TXN-${Date.now().toString().slice(-6)}`,
          fee: selectedFee,
          amount: numericAmount,
          amountFormatted: `₦${numericAmount.toLocaleString()}.00`,
          method: paymentMethod,
        })
      }
      onClose()
    }, 900)
  }

  return (
    <div className="student-modal-backdrop" onClick={onClose}>
      <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header">
          <h3 className="student-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Make School Fee Payment
          </h3>
          <button className="student-btn-ghost-sm" onClick={onClose} style={{ color: '#64748b' }}>
            &times;
          </button>
        </div>

        <form onSubmit={handlePay}>
          <div className="student-modal-body">
            <div style={{ backgroundColor: '#ecfdf5', padding: 14, borderRadius: 8, border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>Total Outstanding Balance</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#064e3b', marginTop: 2 }}>
                {financialData?.outstandingFormatted || '₦1,250,000.00'}
              </div>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Select Payment Item</label>
              <select
                className="student-form-select"
                value={selectedFee}
                onChange={(e) => {
                  setSelectedFee(e.target.value)
                  if (e.target.value.includes('Tuition')) setAmount('1250000')
                  else if (e.target.value.includes('ICT')) setAmount('150000')
                  else setAmount('100000')
                }}
              >
                <option value="Tuition Fee (Balance)">Tuition Fee (First Semester Balance) - ₦1,250,000</option>
                <option value="ICT & Science Lab Fee">Departmental Science & ICT Lab Levy - ₦150,000</option>
                <option value="Medical & Exam Clearance">Medical Insurance & Exam Clearance - ₦100,000</option>
              </select>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Payment Amount (₦)</label>
              <input
                type="number"
                className="student-form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Payment Gateway</label>
              <select
                className="student-form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Debit Card (Paystack / Interswitch)">Debit Card (Mastercard / Visa / Verve)</option>
                <option value="Direct Bank Transfer (Access Bank)">Direct Bank Transfer (Instant Verification)</option>
                <option value="Riverside College Remita Gateway">Remita RRR Electronic Payment</option>
              </select>
            </div>
          </div>

          <div className="student-modal-footer">
            <button type="button" className="student-btn student-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="student-btn student-btn-primary" disabled={isProcessing}>
              {isProcessing ? 'Processing Transaction...' : `Pay ₦${parseInt(amount || '0', 10).toLocaleString()} Now`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * 3. Upload Document Modal
 */
export function UploadDocumentModal({ onClose, onUploadSuccess }) {
  const [docName, setDocName] = useState('')
  const [category, setCategory] = useState('Academic')
  const [fileName, setFileName] = useState('official_document.pdf')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = (e) => {
    e.preventDefault()
    if (!docName.trim()) return
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      if (onUploadSuccess) {
        onUploadSuccess({
          name: docName,
          category,
          date: 'Sep 23, 2025',
          size: '1.8 MB',
          type: 'PDF',
          status: 'Verified',
        })
      }
      onClose()
    }, 700)
  }

  return (
    <div className="student-modal-backdrop" onClick={onClose}>
      <div className="student-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="student-modal-header">
          <h3 className="student-card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Official Student Document
          </h3>
          <button className="student-btn-ghost-sm" onClick={onClose} style={{ color: '#64748b' }}>
            &times;
          </button>
        </div>

        <form onSubmit={handleUpload}>
          <div className="student-modal-body">
            <div className="student-form-group">
              <label className="student-form-label">Document Title</label>
              <input
                type="text"
                className="student-form-input"
                placeholder="e.g., Medical Fitness Certificate, O'Level Certificate"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                required
              />
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Document Category</label>
              <select
                className="student-form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Academic">Academic (Certificates, Transcripts)</option>
                <option value="Identification">Identification (Birth Cert, NIN, National ID)</option>
                <option value="Medical">Medical Clearance & Fitness</option>
                <option value="Financial">Financial Clearance & Receipts</option>
              </select>
            </div>

            <div className="student-form-group">
              <label className="student-form-label">Select File (PDF, JPG, PNG)</label>
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 8,
                  padding: '18px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const custom = prompt('Enter document file name:', fileName)
                  if (custom) setFileName(custom)
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f766e' }}>
                  {fileName}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  Click to rename or simulate new file selection
                </div>
              </div>
            </div>
          </div>

          <div className="student-modal-footer">
            <button type="button" className="student-btn student-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="student-btn student-btn-primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Save & Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
