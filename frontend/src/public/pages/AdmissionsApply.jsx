import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicApi } from '../api'
import { ErrorBanner, Loading, PageHero, SuccessBanner } from '../ui'
import { formatDate } from '../formatters'
import '../../auth/StudentAuth.css'

const EMPTY_APPLICATION = {
  student_first_name: '', student_middle_name: '', student_last_name: '', student_dob: '',
  student_gender: '', student_nationality: '', student_phone: '', student_email: '', student_address: '',
  previous_school: '', previous_class: '', class_applying_for: '', academic_session: '2026/2027',
  guardian_full_name: '', guardian_relationship: '', guardian_phone: '', guardian_email: '', guardian_address: '',
}

const DOCUMENT_TYPES = [
  ['birth_certificate', 'Birth Certificate'],
  ['previous_report', 'Previous School Report'],
  ['passport_photo', 'Passport Photograph'],
  ['identification', 'Identification Document'],
  ['medical', 'Medical Document'],
  ['other', 'Other Supporting Document'],
]

function ApplicantAuth({ onSignedIn, defaultMode = 'register' }) {
  const [activeMode, setActiveMode] = useState(defaultMode) // 'register' | 'login' | 'forgot'

  // --- Login State ---
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // --- Register State ---
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    matricNo: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')

  // --- Forgot Password State ---
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotError, setForgotError] = useState('')

  // --- Password Strength & Checklist ---
  const hasLength = regForm.password.length >= 10
  const hasUpper = /[A-Z]/.test(regForm.password)
  const hasLower = /[a-z]/.test(regForm.password)
  const hasNumber = /[0-9]/.test(regForm.password)
  const hasSpecial = /[^A-Za-z0-9]/.test(regForm.password)

  const metCount = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  let strengthBars = 0
  let strengthLabel = ''
  let strengthColor = ''

  if (regForm.password) {
    if (metCount <= 2) {
      strengthBars = 1
      strengthLabel = 'Weak'
      strengthColor = '#B42318'
    } else if (metCount === 3) {
      strengthBars = 2
      strengthLabel = 'Fair'
      strengthColor = '#D97706'
    } else if (metCount === 4) {
      strengthBars = 3
      strengthLabel = 'Good'
      strengthColor = '#2563EB'
    } else {
      strengthBars = 4
      strengthLabel = 'Strong'
      strengthColor = '#18794E'
    }
  }

  const passwordsMatch = regForm.confirmPassword && regForm.password === regForm.confirmPassword
  const passwordsMismatch = regForm.confirmPassword && regForm.password !== regForm.confirmPassword

  const updateReg = (field, value) => {
    setRegForm((prev) => ({ ...prev, [field]: value }))
  }

  // --- Submit Login ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      await publicApi.login(loginEmail.trim(), loginPassword)
      onSignedIn()
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please check your credentials and try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  // --- Submit Register ---
  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')

    if (regForm.password.length < 10) {
      setRegError('Password must be at least 10 characters long.')
      return
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.')
      return
    }
    if (!regForm.agreeTerms) {
      setRegError('You must agree to the Terms of Service and Privacy Policy to register.')
      return
    }

    setRegLoading(true)
    try {
      await publicApi.studentRegister({
        first_name: regForm.firstName.trim(),
        last_name: regForm.lastName.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim(),
        dob: regForm.dob || '2008-01-01',
        student_id: regForm.matricNo ? regForm.matricNo.trim() : undefined,
        password: regForm.password,
        confirm_password: regForm.confirmPassword,
        agree_terms: regForm.agreeTerms,
      })
      await publicApi.login(regForm.email.trim(), regForm.password)
      onSignedIn({
        student_first_name: regForm.firstName.trim(),
        student_last_name: regForm.lastName.trim(),
        student_email: regForm.email.trim(),
        student_phone: regForm.phone.trim(),
        student_dob: regForm.dob,
      })
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please review your details and try again.')
    } finally {
      setRegLoading(false)
    }
  }

  // --- Submit Forgot Password ---
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.')
      return
    }
    setForgotLoading(true)
    try {
      await publicApi.requestPasswordReset(forgotEmail.trim())
      setForgotSent(true)
    } catch {
      setForgotSent(true)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="ra-auth-page">
      {/* ========================================================
          LEFT COLUMN: BRANDING & CAMPUS SCENE (approx 48% on desktop)
          ======================================================== */}
      <div className="ra-auth-left">
        <div className="ra-auth-left-top">
          {/* Return link to main website */}
          <Link to="/" className="ra-auth-back-link" title="Return to Riverside Academy Website">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Return to Website</span>
          </Link>

          {/* School Crest */}
          <Link to="/" title="Riverside Academy Homepage">
            <img
              src="/school-crest.png"
              alt="Riverside Academy Crest"
              className="ra-auth-crest"
            />
          </Link>

          {/* School Name & Tagline */}
          <h2 className="ra-auth-school-title">Riverside Academy</h2>
          <p className="ra-auth-school-tagline">Knowledge &nbsp;•&nbsp; Character &nbsp;•&nbsp; Excellence</p>
          <div className="ra-auth-gold-divider" />

          {/* Left-Side Message */}
          {activeMode === 'register' && (
            <>
              <h1 className="ra-auth-left-heading">
                Create Your <span className="gold">Student Account</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Join Riverside Academy and take the next step in your academic journey. Fill in the details below to get started.
              </p>
            </>
          )}

          {activeMode === 'login' && (
            <>
              <h1 className="ra-auth-left-heading">
                Welcome Back to <span className="gold">Riverside Academy</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Access your admissions portal to view, manage, and track your active enrollment applications and academic documents.
              </p>
            </>
          )}

          {activeMode === 'forgot' && (
            <>
              <h1 className="ra-auth-left-heading">
                Account <span className="gold">Recovery</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Reset your password securely to regain access to your admissions portal and application details.
              </p>
            </>
          )}
        </div>

        {/* Bottom Decorative Wave Text */}
        <div className="ra-auth-left-motto">
          Learn • Grow • Succeed
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: AUTHENTICATION FORM (approx 52% on desktop)
          ======================================================== */}
      <div className="ra-auth-right">
        <div className="ra-auth-card">
          {activeMode === 'register' ? (
            /* ==========================================
               REGISTRATION FORM
               ========================================== */
            <>
              <span className="ra-auth-eyebrow">STUDENT REGISTRATION</span>
              <h1 className="ra-auth-title">Create Account</h1>
              <p className="ra-auth-subtitle">Fill in your details to create your student account.</p>

              {regError && (
                <div className="ra-auth-alert ra-auth-alert-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="ra-auth-grid-2">
                  {/* First Name */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      First Name <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        required
                        className="ra-auth-input"
                        placeholder="Enter your first name"
                        value={regForm.firstName}
                        onChange={(e) => updateReg('firstName', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Last Name <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        required
                        className="ra-auth-input"
                        placeholder="Enter your last name"
                        value={regForm.lastName}
                        onChange={(e) => updateReg('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <input
                        type="email"
                        required
                        className="ra-auth-input"
                        placeholder="Enter your email address"
                        value={regForm.email}
                        onChange={(e) => updateReg('email', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Phone Number <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        type="tel"
                        required
                        className="ra-auth-input"
                        placeholder="Enter your phone number"
                        value={regForm.phone}
                        onChange={(e) => updateReg('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Date of Birth <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <input
                        type="date"
                        required
                        className="ra-auth-input"
                        placeholder="Select your date of birth"
                        value={regForm.dob}
                        onChange={(e) => updateReg('dob', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Matric No / Student ID (Optional) */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Matric No <span className="opt">(Optional)</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                      <input
                        type="text"
                        className="ra-auth-input"
                        placeholder="Enter your matric number"
                        value={regForm.matricNo}
                        onChange={(e) => updateReg('matricNo', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Password <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={10}
                        className="ra-auth-input ra-auth-input-pw"
                        placeholder="Enter your password"
                        value={regForm.password}
                        onChange={(e) => updateReg('password', e.target.value)}
                      />
                      <button
                        type="button"
                        className="ra-auth-eye-btn"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showRegPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Confirm Password <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={10}
                        className="ra-auth-input ra-auth-input-pw"
                        placeholder="Confirm your password"
                        value={regForm.confirmPassword}
                        onChange={(e) => updateReg('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        className="ra-auth-eye-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Match Status */}
                {passwordsMatch && (
                  <span className="ra-auth-match-hint matched">
                    <svg width="13" height="13" viewBox="0 0 16 16"><path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                    Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="ra-auth-match-hint mismatched">
                    <svg width="13" height="13" viewBox="0 0 16 16"><path fill="currentColor" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    Passwords do not match
                  </span>
                )}

                {/* Password Strength Meter & Checklist */}
                <div className="ra-auth-pw-box">
                  <div className="ra-auth-pw-col">
                    <div className="ra-auth-pw-header">
                      <span>Password strength</span>
                      {strengthLabel && (
                        <span className="ra-auth-pw-score-label" style={{ color: strengthColor }}>
                          {strengthLabel}
                        </span>
                      )}
                    </div>
                    <div className="ra-auth-pw-meter">
                      <div className={`ra-auth-pw-bar ${strengthBars >= 1 ? 'filled' : ''}`} />
                      <div className={`ra-auth-pw-bar ${strengthBars >= 2 ? 'filled' : ''}`} />
                      <div className={`ra-auth-pw-bar ${strengthBars >= 3 ? 'filled' : ''}`} />
                      <div className={`ra-auth-pw-bar ${strengthBars >= 4 ? 'filled' : ''}`} />
                    </div>
                  </div>

                  <div className="ra-auth-pw-col">
                    <div className="ra-auth-pw-header">
                      <span>Password must contain:</span>
                    </div>
                    <ul className="ra-auth-pw-rules">
                      <li className={`ra-auth-pw-rule-item ${hasLength ? 'met' : ''}`}>
                        <svg className="ra-auth-pw-icon" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        At least 10 characters
                      </li>
                      <li className={`ra-auth-pw-rule-item ${hasUpper ? 'met' : ''}`}>
                        <svg className="ra-auth-pw-icon" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        One uppercase letter
                      </li>
                      <li className={`ra-auth-pw-rule-item ${hasLower ? 'met' : ''}`}>
                        <svg className="ra-auth-pw-icon" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        One lowercase letter
                      </li>
                      <li className={`ra-auth-pw-rule-item ${hasNumber ? 'met' : ''}`}>
                        <svg className="ra-auth-pw-icon" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        One number
                      </li>
                      <li className={`ra-auth-pw-rule-item ${hasSpecial ? 'met' : ''}`}>
                        <svg className="ra-auth-pw-icon" viewBox="0 0 16 16">
                          <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Terms and Privacy Agreement */}
                <div className="ra-auth-agree-row">
                  <input
                    type="checkbox"
                    id="raAdmissionsAgreeTerms"
                    required
                    className="ra-auth-checkbox"
                    checked={regForm.agreeTerms}
                    onChange={(e) => updateReg('agreeTerms', e.target.checked)}
                  />
                  <label htmlFor="raAdmissionsAgreeTerms">
                    I agree to the <Link to="/terms" className="ra-auth-agree-link">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="ra-auth-agree-link">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={regLoading}
                  className="ra-auth-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>{regLoading ? 'Creating account…' : 'Register'}</span>
                </button>
              </form>

              {/* Switch to Login */}
              <div className="ra-auth-switch">
                <span className="ra-auth-switch-line" />
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="ra-auth-switch-btn"
                    onClick={() => setActiveMode('login')}
                  >
                    Log in
                  </button>
                </span>
                <span className="ra-auth-switch-line" />
              </div>
            </>
          ) : activeMode === 'login' ? (
            /* ==========================================
               LOGIN FORM
               ========================================== */
            <>
              <span className="ra-auth-eyebrow">ADMISSIONS SIGN IN</span>
              <h1 className="ra-auth-title">Welcome Back</h1>
              <p className="ra-auth-subtitle">Enter your credentials to access your admissions account.</p>

              {loginError && (
                <div className="ra-auth-alert ra-auth-alert-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email Address */}
                <div className="ra-auth-field">
                  <label className="ra-auth-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <div className="ra-auth-input-wrap">
                    <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="text"
                      required
                      className="ra-auth-input"
                      placeholder="Enter your email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="ra-auth-field">
                  <label className="ra-auth-label">
                    Password <span className="req">*</span>
                  </label>
                  <div className="ra-auth-input-wrap">
                    <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      className="ra-auth-input ra-auth-input-pw"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="ra-auth-eye-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Options Row */}
                <div className="ra-auth-options">
                  <label className="ra-auth-agree-row" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      className="ra-auth-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="ra-auth-forgot-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => setActiveMode('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="ra-auth-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>{loginLoading ? 'Signing in…' : 'Log In'}</span>
                </button>
              </form>

              {/* Switch to Register */}
              <div className="ra-auth-switch">
                <span className="ra-auth-switch-line" />
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="ra-auth-switch-btn"
                    onClick={() => setActiveMode('register')}
                  >
                    Create one
                  </button>
                </span>
                <span className="ra-auth-switch-line" />
              </div>
            </>
          ) : (
            /* ==========================================
               FORGOT PASSWORD FORM
               ========================================== */
            <>
              <span className="ra-auth-eyebrow">PASSWORD RECOVERY</span>
              <h1 className="ra-auth-title">Reset Password</h1>
              <p className="ra-auth-subtitle">
                Enter your registered email address to receive password reset instructions.
              </p>

              {forgotSent ? (
                <div className="ra-auth-alert ra-auth-alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <strong>Instructions Sent</strong>
                  <span>If an account exists with that email address, we've sent instructions to reset your password.</span>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  {forgotError && (
                    <div className="ra-auth-alert ra-auth-alert-error">
                      <span>{forgotError}</span>
                    </div>
                  )}
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <input
                        type="email"
                        required
                        className="ra-auth-input"
                        placeholder="Enter your email address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="ra-auth-btn"
                  >
                    <span>{forgotLoading ? 'Sending…' : 'Send Reset Link'}</span>
                  </button>
                </form>
              )}

              {/* Back to Login */}
              <div className="ra-auth-switch">
                <span className="ra-auth-switch-line" />
                <span>
                  Remember your password?{' '}
                  <button
                    type="button"
                    className="ra-auth-switch-btn"
                    onClick={() => setActiveMode('login')}
                  >
                    Log in
                  </button>
                </span>
                <span className="ra-auth-switch-line" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ApplicationForm({ application, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_APPLICATION, ...application })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (field, value) => setForm({ ...form, [field]: value })

  const save = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form }
      delete payload.id; delete payload.reference; delete payload.status; delete payload.submitted_at; delete payload.created_at
      const saved = application.id
        ? await publicApi.updateApplication(application.id, payload)
        : await publicApi.createApplication(payload)
      onSaved(saved)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bfa-card" style={{ maxWidth: 840, margin: '0 auto' }}>
      <form className="bfa-form" onSubmit={save} style={{ maxWidth: '100%' }}>
        <ErrorBanner message={error} />
        <h3 style={{ margin: '0 0 4px', color: 'var(--bfa-navy)', fontSize: 22 }}>Student Information</h3>
        <p style={{ color: 'var(--bfa-muted)', fontSize: 13, margin: '0 0 16px' }}>
          Personal and background details for the applicant child.
        </p>

        <div className="bfa-form-row">
          <label className="bfa-field">FIRST NAME<input required value={form.student_first_name} onChange={(e) => update('student_first_name', e.target.value)} /></label>
          <label className="bfa-field">LAST NAME<input required value={form.student_last_name} onChange={(e) => update('student_last_name', e.target.value)} /></label>
        </div>
        <div className="bfa-form-row">
          <label className="bfa-field">MIDDLE NAME<input value={form.student_middle_name} onChange={(e) => update('student_middle_name', e.target.value)} /></label>
          <label className="bfa-field">DATE OF BIRTH<input required type="date" value={form.student_dob} onChange={(e) => update('student_dob', e.target.value)} /></label>
        </div>
        <div className="bfa-form-row">
          <label className="bfa-field">GENDER
            <select value={form.student_gender} onChange={(e) => update('student_gender', e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="bfa-field">NATIONALITY<input value={form.student_nationality} placeholder="e.g. Nigerian" onChange={(e) => update('student_nationality', e.target.value)} /></label>
        </div>
        <div className="bfa-form-row">
          <label className="bfa-field">CLASS APPLYING FOR
            <select required value={form.class_applying_for} onChange={(e) => update('class_applying_for', e.target.value)}>
              <option value="">Select Class</option>
              <option value="Creche">Creche</option>
              <option value="Nursery 1">Nursery 1</option>
              <option value="Nursery 2">Nursery 2</option>
              <option value="Primary 1">Primary 1</option>
              <option value="Primary 2">Primary 2</option>
              <option value="Primary 3">Primary 3</option>
              <option value="Primary 4">Primary 4</option>
              <option value="Primary 5">Primary 5</option>
              <option value="JSS 1">JSS 1</option>
              <option value="JSS 2">JSS 2</option>
              <option value="JSS 3">JSS 3</option>
              <option value="SSS 1">SSS 1</option>
              <option value="SSS 2">SSS 2</option>
              <option value="SSS 3">SSS 3</option>
            </select>
          </label>
          <label className="bfa-field">ACADEMIC SESSION<input required value={form.academic_session} onChange={(e) => update('academic_session', e.target.value)} /></label>
        </div>
        <div className="bfa-form-row">
          <label className="bfa-field">PREVIOUS SCHOOL<input value={form.previous_school} placeholder="School name" onChange={(e) => update('previous_school', e.target.value)} /></label>
          <label className="bfa-field">PREVIOUS CLASS<input value={form.previous_class} placeholder="e.g. Primary 4" onChange={(e) => update('previous_class', e.target.value)} /></label>
        </div>
        <label className="bfa-field">RESIDENTIAL ADDRESS<input value={form.student_address} placeholder="Street address, City, State" onChange={(e) => update('student_address', e.target.value)} /></label>

        <p className="bfa-form-section-title">Parent / Guardian Information</p>
        <div className="bfa-form-row">
          <label className="bfa-field">FULL NAME<input required value={form.guardian_full_name} onChange={(e) => update('guardian_full_name', e.target.value)} /></label>
          <label className="bfa-field">RELATIONSHIP<input required placeholder="Father, Mother, Legal Guardian" value={form.guardian_relationship} onChange={(e) => update('guardian_relationship', e.target.value)} /></label>
        </div>
        <div className="bfa-form-row">
          <label className="bfa-field">PHONE NUMBER<input required value={form.guardian_phone} onChange={(e) => update('guardian_phone', e.target.value)} /></label>
          <label className="bfa-field">EMAIL ADDRESS<input required type="email" value={form.guardian_email} onChange={(e) => update('guardian_email', e.target.value)} /></label>
        </div>
        <label className="bfa-field">GUARDIAN RESIDENTIAL ADDRESS<input value={form.guardian_address} onChange={(e) => update('guardian_address', e.target.value)} /></label>

        <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
          <button className="bfa-btn bfa-btn-navy" disabled={saving}>
            {saving ? 'Saving…' : 'Save Application Draft'}
          </button>
        </div>
      </form>
    </div>
  )
}

function DocumentUploader({ application, onUploaded }) {
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0][0])
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const upload = async (event) => {
    event.preventDefault()
    if (!file) { setError('Choose a file first.'); return }
    setError('')
    setSaving(true)
    try {
      const body = new FormData()
      body.append('document_type', docType)
      body.append('file', file)
      const doc = await publicApi.uploadApplicationDocument(application.id, body)
      onUploaded(doc)
      setFile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={upload} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 14 }}>
      <ErrorBanner message={error} />
      <label className="bfa-field" style={{ minWidth: 220 }}>DOCUMENT TYPE
        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          {DOCUMENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="bfa-field">FILE
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <button className="bfa-btn bfa-btn-outline" disabled={saving}>{saving ? 'Uploading…' : 'Upload File'}</button>
    </form>
  )
}

function ApplicationDetail({ application, onBack, onUpdated }) {
  const [current, setCurrent] = useState(application)
  const [documents, setDocuments] = useState(Array.isArray(application?.documents) ? application.documents : [])
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const editable = current?.status === 'started'

  useEffect(() => {
    if (!current?.id) return
    publicApi.applicationDocuments(current.id)
      .then((data) => setDocuments(Array.isArray(data) ? data : data?.results || []))
      .catch(() => {})
  }, [current?.id])

  const submit = async () => {
    if (!window.confirm('Are you sure you are ready to submit? Once submitted, your application cannot be edited.')) return
    setSubmitError('')
    setSubmitMessage('')
    setSubmitting(true)
    try {
      const res = await publicApi.submitApplication(current.id)
      setSubmitMessage(`Application submitted successfully! Your application reference number is ${res.reference}.`)
      const refreshed = await publicApi.application(current.id)
      setCurrent(refreshed)
      onUpdated(refreshed)
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit application. Please verify all required fields and documents.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="bfa-btn bfa-btn-outline" onClick={onBack}>← Back to My Applications</button>
        <span className="bfa-badge bfa-badge-gold" style={{ fontSize: 13, textTransform: 'capitalize' }}>
          Status: {current.status ? current.status.replace(/_/g, ' ') : 'Draft'}
        </span>
      </div>

      <SuccessBanner message={submitMessage} />
      <ErrorBanner message={submitError} />

      {editable ? (
        <ApplicationForm
          application={current}
          onSaved={(saved) => {
            setCurrent(saved)
            onUpdated(saved)
          }}
        />
      ) : (
        <div className="bfa-card" style={{ marginBottom: 24 }}>
          <h3 style={{ color: 'var(--bfa-navy)', fontSize: 20 }}>
            {current.student_first_name} {current.student_last_name}
            {current.reference ? ` · Ref: ${current.reference}` : ''}
          </h3>
          <p style={{ color: 'var(--bfa-muted)', fontSize: 14 }}>
            Applying for <strong>{current.class_applying_for}</strong> ({current.academic_session})
          </p>
          <div className="bfa-form-row" style={{ marginTop: 16 }}>
            <div><strong style={{ color: 'var(--bfa-navy)' }}>Guardian:</strong> {current.guardian_full_name}</div>
            <div><strong style={{ color: 'var(--bfa-navy)' }}>Contact:</strong> {current.guardian_phone} | {current.guardian_email}</div>
          </div>
        </div>
      )}

      {current.id && (
        <div className="bfa-card" style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--bfa-navy)', fontSize: 20, marginBottom: 8 }}>Supporting Documents</h3>
          <p style={{ color: 'var(--bfa-muted)', fontSize: 13, marginBottom: 16 }}>
            Upload birth certificates, passport photographs, and previous academic transcripts.
          </p>
          {documents.length === 0 ? (
            <p style={{ color: 'var(--bfa-muted)', fontStyle: 'italic' }}>No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div className="bfa-list-row" key={doc.id}>
                <div>
                  <h4>{doc.document_type ? doc.document_type.replace(/_/g, ' ').toUpperCase() : 'DOCUMENT'}</h4>
                  <p>{formatDate(doc.uploaded_at)}</p>
                </div>
                {doc.verified ? (
                  <span className="bfa-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Verified</span>
                ) : (
                  <span className="bfa-badge">Pending Review</span>
                )}
              </div>
            ))
          )}

          {editable && (
            <DocumentUploader
              application={current}
              onUploaded={(doc) => setDocuments((prev) => [...prev, doc])}
            />
          )}

          {editable && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--bfa-border)' }}>
              <button
                className="bfa-btn bfa-btn-gold"
                style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px 24px' }}
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? 'Submitting Application…' : 'Submit Final Application →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdmissionsApply({ defaultMode = 'register' }) {
  const [signedIn, setSignedIn] = useState(publicApi.isAuthenticated())
  const [applications, setApplications] = useState(null)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [initialProfile, setInitialProfile] = useState(null)

  useEffect(() => { document.title = 'Apply — Riverside Academy Admissions' }, [])

  const loadApplications = () => {
    publicApi
      .myApplications()
      .then((data) => setApplications(data.results || data || []))
      .catch((err) => {
        if (err.status === 401 || !publicApi.isAuthenticated()) {
          setSignedIn(false)
        } else {
          setError(err.message)
        }
      })
  }

  useEffect(() => { if (signedIn) loadApplications() }, [signedIn])

  if (!signedIn) {
    return (
      <ApplicantAuth
        defaultMode={defaultMode}
        onSignedIn={(profile) => {
          if (profile) setInitialProfile(profile)
          setSignedIn(true)
        }}
      />
    )
  }

  if (selected) {
    return (
      <>
        <PageHero crumb="Admissions · Apply" title="Admission Application" detail="Manage your application details and uploaded documents." />
        <section className="bfa-section">
          <div className="bfa-container">
            <ApplicationDetail
              application={selected}
              onBack={() => { setSelected(null); loadApplications() }}
              onUpdated={(updated) => setSelected(updated)}
            />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero crumb="Admissions · Apply" title="My Applications" detail="Start a new admission application, or continue one you have already started." />
      <section className="bfa-section">
        <div className="bfa-container" style={{ maxWidth: 840 }}>
          <ErrorBanner message={error} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <button
              className="bfa-btn bfa-btn-gold"
              onClick={() => setSelected({ ...EMPTY_APPLICATION, ...(initialProfile || {}), status: 'started', documents: [] })}
            >
              + Start a New Application
            </button>
            <button
              className="bfa-btn bfa-btn-outline"
              onClick={() => {
                publicApi.logout()
                setSignedIn(false)
              }}
            >
              Sign Out
            </button>
          </div>
          {applications === null ? (
            <Loading />
          ) : applications.length === 0 ? (
            <div className="bfa-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <h3 style={{ color: 'var(--bfa-navy)', fontSize: 20 }}>No Active Applications</h3>
              <p style={{ color: 'var(--bfa-muted)', margin: '8px 0 20px' }}>
                You have not started an application yet. Click below to begin your child's enrollment application.
              </p>
              <button
                className="bfa-btn bfa-btn-gold"
                onClick={() => setSelected({ ...EMPTY_APPLICATION, ...(initialProfile || {}), status: 'started', documents: [] })}
              >
                + Start an Application
              </button>
            </div>
          ) : (
            (Array.isArray(applications) ? applications : []).map((app) => (
              <div
                className="bfa-card"
                key={app.id}
                style={{ cursor: 'pointer', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => publicApi.application(app.id).then(setSelected)}
              >
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 18, color: 'var(--bfa-navy)', fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {app.student_first_name} {app.student_last_name}{app.reference ? ` · Ref: ${app.reference}` : ''}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--bfa-muted)', fontSize: 14 }}>
                    Class: <strong>{app.class_applying_for}</strong> | Session: <strong>{app.academic_session}</strong>
                  </p>
                </div>
                <span className="bfa-badge bfa-badge-gold" style={{ textTransform: 'capitalize', fontSize: 12 }}>
                  {app.status ? app.status.replace(/_/g, ' ') : 'Draft'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
