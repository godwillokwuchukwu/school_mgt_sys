import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { publicApi } from '../public/api'
import './StudentAuth.css'

export default function StudentAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  // Detect mode based on current URL path or user toggle
  const isLoginRoute = location.pathname.includes('login')
  const [overrideMode, setOverrideMode] = useState(null) // null | 'register' | 'login' | 'forgot'
  const activeMode = overrideMode || (isLoginRoute ? 'login' : 'register')

  const changeMode = (mode, route) => {
    setOverrideMode(mode)
    if (route) navigate(route)
  }

  // --- Login State ---
  const [loginIdentifier, setLoginIdentifier] = useState('')
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
    password: '',
    confirmPassword: '',
    studentId: '',
    agreeTerms: false,
  })
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendStatus, setResendStatus] = useState('')

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
      const data = await publicApi.login(loginIdentifier.trim(), loginPassword)
      const role = data.role
      if (role === 'student' || role === 'admin' || role === 'teacher' || role === 'parent') {
        navigate('/portal')
      } else {
        navigate('/admissions/apply')
      }
    } catch (err) {
      setLoginError(err.message || "We couldn't sign you in with those credentials. Please check your details and try again.")
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
        dob: regForm.dob,
        password: regForm.password,
        confirm_password: regForm.confirmPassword,
        student_id: regForm.studentId.trim() || undefined,
        agree_terms: regForm.agreeTerms,
      })

      setRegisteredEmail(regForm.email.trim())
      setIsSuccess(true)
    } catch (err) {
      setRegError(err.message || 'Registration could not be completed. Please review your details and try again.')
    } finally {
      setRegLoading(false)
    }
  }

  // --- Handle Resend Email Verification ---
  const handleResendVerification = () => {
    setResendStatus('A new verification email has been sent. Please check your inbox.')
    setTimeout(() => setResendStatus(''), 6000)
  }

  // --- Submit Forgot Password ---
  const handleForgotPassword = (e) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail) {
      setForgotError('Please enter your registered email address.')
      return
    }
    setForgotLoading(true)
    setTimeout(() => {
      setForgotLoading(false)
      setForgotSent(true)
    }, 600)
  }

  return (
    <div className="ra-auth-page">
      {/* ========================================================
          LEFT COLUMN: BRANDING & CAMPUS SCENE (approx 48% on desktop)
          ======================================================== */}
      <div className="ra-auth-left">
        <div className="ra-auth-left-top">
          {/* Logo / Crest */}
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
          {activeMode === 'register' && !isSuccess && (
            <>
              <h1 className="ra-auth-left-heading">
                Create Your <span className="gold">Student Account</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Join Riverside Academy and take the next step in your academic journey. Fill in the details below to get started.
              </p>
            </>
          )}

          {(activeMode === 'login' || isSuccess) && (
            <>
              <h1 className="ra-auth-left-heading">
                Welcome Back to <span className="gold">Riverside Academy</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Access your student portal to view courses, grades, announcements, and academic records.
              </p>
            </>
          )}

          {activeMode === 'forgot' && (
            <>
              <h1 className="ra-auth-left-heading">
                Account <span className="gold">Recovery</span>
              </h1>
              <p className="ra-auth-left-subtext">
                Reset your password securely to regain access to your Riverside Academy student account.
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
          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="ra-auth-success-card">
              <div className="ra-auth-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="ra-auth-success-title">Account Created</h2>
              <p className="ra-auth-success-text">
                Your Riverside Academy student account has been created successfully.<br />
                We've sent a verification email to: <strong>{registeredEmail}</strong>.<br />
                Please check your inbox and verify your email address before signing in.
              </p>

              {resendStatus && (
                <div className="ra-auth-alert ra-auth-alert-success" style={{ justifyContent: 'center' }}>
                  <span>{resendStatus}</span>
                </div>
              )}

              <div className="ra-auth-success-actions">
                <button
                  type="button"
                  className="ra-auth-btn"
                  style={{ width: 'auto', padding: '0 28px' }}
                  onClick={() => {
                    setIsSuccess(false)
                    changeMode('login', '/login')
                  }}
                >
                  Open Login Page
                </button>
                <button
                  type="button"
                  className="ra-auth-btn"
                  style={{
                    width: 'auto',
                    padding: '0 24px',
                    background: '#ffffff',
                    color: 'var(--riverside-green)',
                    border: '1px solid var(--riverside-border)',
                  }}
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          ) : activeMode === 'register' ? (
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
                {/* Row 1: First Name & Last Name */}
                <div className="ra-auth-grid-2">
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
                </div>

                {/* Row 2: Email Address & Phone Number */}
                <div className="ra-auth-grid-2">
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
                </div>

                {/* Row 3: Date of Birth & Student ID / Matric No */}
                <div className="ra-auth-grid-2">
                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Date of Birth <span className="req">*</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <input
                        type="date"
                        required
                        className="ra-auth-input"
                        value={regForm.dob}
                        onChange={(e) => updateReg('dob', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="ra-auth-field">
                    <label className="ra-auth-label">
                      Student ID <span className="opt">(Optional)</span>
                    </label>
                    <div className="ra-auth-input-wrap">
                      <svg className="ra-auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                      <input
                        type="text"
                        className="ra-auth-input"
                        placeholder="Enter your student ID"
                        value={regForm.studentId}
                        onChange={(e) => updateReg('studentId', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Password & Confirm Password */}
                <div className="ra-auth-grid-2">
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
                        className="ra-auth-input ra-auth-input-pw"
                        placeholder="Confirm your password"
                        value={regForm.confirmPassword}
                        onChange={(e) => updateReg('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        className="ra-auth-eye-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>

                    {/* Immediate Client-Side Password Match Feedback */}
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
                  </div>
                </div>

                {/* Password Strength Meter & Requirements Checklist */}
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

                {/* Terms of Service & Privacy Policy Agreement */}
                <div className="ra-auth-agree-row">
                  <input
                    type="checkbox"
                    id="raAgreeTerms"
                    required
                    className="ra-auth-checkbox"
                    checked={regForm.agreeTerms}
                    onChange={(e) => updateReg('agreeTerms', e.target.checked)}
                  />
                  <label htmlFor="raAgreeTerms">
                    I agree to the <Link to="/terms" target="_blank" className="ra-auth-agree-link">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="ra-auth-agree-link">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Register Button */}
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
                    onClick={() => changeMode('login', '/login')}
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
              <span className="ra-auth-eyebrow">STUDENT SIGN IN</span>
              <h1 className="ra-auth-title">Welcome Back</h1>
              <p className="ra-auth-subtitle">Enter your credentials to access your student account.</p>

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
                {/* Email Address or Student ID */}
                <div className="ra-auth-field">
                  <label className="ra-auth-label">
                    Email Address or Student ID <span className="req">*</span>
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
                      placeholder="Enter your email or student ID"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
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
                    onClick={() => changeMode('forgot')}
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
                    onClick={() => changeMode('register', '/register')}
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
                    onClick={() => changeMode('login', '/login')}
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
