import React, { useState } from 'react'

export function AddChildModal({ isOpen, onClose, onAddChild, existingStudents = [] }) {
  const [admissionNo, setAdmissionNo] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [relationship, setRelationship] = useState('Mother')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!admissionNo.trim()) {
      setError('Please enter your child’s Admission Number or Student ID.')
      return
    }

    setSubmitting(true)
    setError(null)

    setTimeout(() => {
      onAddChild({
        admissionNo: admissionNo.trim(),
        dateOfBirth,
        relationship,
      })
      setSubmitting(false)
      onClose()
    }, 500)
  }

  return (
    <div className="parent-modal-overlay" onClick={onClose}>
      <div className="parent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="parent-modal-header">
          <h2 className="parent-modal-title">Link / Add a Child</h2>
          <button type="button" className="parent-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="parent-modal-body">
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>
              Connect your child’s student profile to your parent portal account using their official school admission number.
            </p>

            {error && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div className="parent-form-group">
              <label className="parent-form-label">Student Admission Number / ID *</label>
              <input
                type="text"
                className="parent-form-input"
                placeholder="e.g. RS-2025-104 or STU-0012"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                required
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Student Date of Birth</label>
              <input
                type="date"
                className="parent-form-input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Your Relationship to Student</label>
              <select
                className="parent-form-select"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Relative / Sponsor">Relative / Sponsor</option>
              </select>
            </div>
          </div>

          <div className="parent-modal-footer">
            <button type="button" className="parent-subtab-btn" onClick={onClose} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="parent-btn-primary" disabled={submitting}>
              {submitting ? 'Verifying...' : 'Link Student Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function MakePaymentModal({ isOpen, onClose, child, onPaymentSuccess }) {
  const [feeItem, setFeeItem] = useState(child?.feesBreakdown?.find(f => f.status === 'Pending') || child?.feesBreakdown?.[0])
  const [amount, setAmount] = useState(child?.feesDue || 450)
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)

  if (!isOpen) return null

  const handlePay = (e) => {
    e.preventDefault()
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onPaymentSuccess({
        childName: child?.name,
        amount: Number(amount),
        description: feeItem?.description || 'School Fees',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
      onClose()
    }, 600)
  }

  return (
    <div className="parent-modal-overlay" onClick={onClose}>
      <div className="parent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="parent-modal-header">
          <h2 className="parent-modal-title">Make a Fee Payment</h2>
          <button type="button" className="parent-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handlePay}>
          <div className="parent-modal-body">
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#64748b' }}>Paying for:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{child?.name} ({child?.grade})</div>
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 2 }}>Outstanding Balance: ${child?.feesDue || 0}.00</div>
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Payment Purpose</label>
              <select
                className="parent-form-select"
                value={feeItem?.id || ''}
                onChange={(e) => {
                  const item = (child?.feesBreakdown || []).find(f => f.id === e.target.value)
                  setFeeItem(item)
                  if (item?.amount) setAmount(item.amount)
                }}
              >
                {(child?.feesBreakdown || []).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.description} (${f.amount}.00) - {f.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Amount to Pay ($ USD)</label>
              <input
                type="number"
                className="parent-form-input"
                min="10"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {['card', 'transfer', 'portal'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      border: method === m ? '2px solid #10b981' : '1px solid #cbd5e1',
                      background: method === m ? '#ecfdf5' : '#ffffff',
                      color: method === m ? '#047857' : '#334155',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                    onClick={() => setMethod(m)}
                  >
                    {m === 'card' ? '💳 Debit Card' : m === 'transfer' ? '🏦 Wire Transfer' : '📱 Mobile Pay'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="parent-modal-footer">
            <button type="button" className="parent-subtab-btn" onClick={onClose} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="parent-btn-primary" disabled={processing}>
              {processing ? 'Processing Securely...' : `Pay $${amount}.00`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function NewMessageModal({ isOpen, onClose, onSend, teachers = [] }) {
  const [recipient, setRecipient] = useState(teachers[0]?.name || 'Teacher - Mr. Davis (Math)')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleSend = (e) => {
    e.preventDefault()
    onSend({
      recipient,
      subject,
      message,
      time: 'Just now',
    })
    onClose()
  }

  return (
    <div className="parent-modal-overlay" onClick={onClose}>
      <div className="parent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="parent-modal-header">
          <h2 className="parent-modal-title">Compose Message to School / Faculty</h2>
          <button type="button" className="parent-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSend}>
          <div className="parent-modal-body">
            <div className="parent-form-group">
              <label className="parent-form-label">Recipient</label>
              <select
                className="parent-form-select"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Teacher - Mr. Davis (Math)">Mr. Davis (Mathematics Faculty)</option>
                <option value="Teacher - Ms. Carter (Science)">Ms. Carter (Science Teacher)</option>
                <option value="Ms. Patel (English Teacher)">Ms. Patel (English Faculty)</option>
                <option value="Mrs. Wilson (History Teacher)">Mrs. Wilson (History Faculty)</option>
                <option value="School Administration">School Administration / Principal</option>
                <option value="Finance Office">Finance & Bursary Office</option>
              </select>
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Subject</label>
              <input
                type="text"
                className="parent-form-input"
                placeholder="e.g. Inquiry regarding class project"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Message</label>
              <textarea
                className="parent-form-textarea"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="parent-modal-footer">
            <button type="button" className="parent-subtab-btn" onClick={onClose} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="parent-btn-primary">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AddNoteModal({ isOpen, onClose, onAddNote, children = [] }) {
  const [childId, setChildId] = useState(children[0]?.id || '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddNote({
      childId,
      title,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })
    onClose()
  }

  return (
    <div className="parent-modal-overlay" onClick={onClose}>
      <div className="parent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="parent-modal-header">
          <h2 className="parent-modal-title">Add Note or Reminder</h2>
          <button type="button" className="parent-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="parent-modal-body">
            <div className="parent-form-group">
              <label className="parent-form-label">Related Child</label>
              <select
                className="parent-form-select"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
                ))}
              </select>
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Title</label>
              <input
                type="text"
                className="parent-form-input"
                placeholder="e.g. Science Fair Project Submission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="parent-form-group">
              <label className="parent-form-label">Note Details</label>
              <textarea
                className="parent-form-textarea"
                rows="3"
                placeholder="Write reminder details..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="parent-modal-footer">
            <button type="button" className="parent-subtab-btn" onClick={onClose} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" className="parent-btn-primary">
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
