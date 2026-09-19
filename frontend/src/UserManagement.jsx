import { useState, useEffect, useCallback } from 'react'
import { api, API_URL } from './api'

function generatePassword(prefix = 'Teacher') {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}2026!${rand}`
}

function formatSchoolEmail(firstName, lastName, role = 'staff') {
  const cleanFirst = (firstName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = (lastName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${cleanFirst}${cleanLast}`;
  if (!base) return '';
  const subdomain = (role === 'teacher' || role === 'staff' || role === 'admin') ? 'staff' : role;
  return `${base}@${subdomain}.riversideacademy.com`;
}

export default function UserManagement({ roleFilter, onBack }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [provisionEmail, setProvisionEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [provisionLoading, setProvisionLoading] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState(null)
  const [copied, setCopied] = useState(false)

  const roleValue = roleFilter === 'Staff' ? 'admin' : roleFilter.toLowerCase().replace(/s$/, '')

  function handleFirstNameChange(val) {
    setFirstName(val)
    if (!provisionEmail || provisionEmail.endsWith('.riversideacademy.com')) {
      const generated = formatSchoolEmail(val, lastName, roleValue)
      if (generated) setProvisionEmail(generated)
    }
  }

  function handleLastNameChange(val) {
    setLastName(val)
    if (!provisionEmail || provisionEmail.endsWith('.riversideacademy.com')) {
      const generated = formatSchoolEmail(firstName, val, roleValue)
      if (generated) setProvisionEmail(generated)
    }
  }

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/accounts/profiles/?role=${roleValue}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch profiles')
      const data = await response.json()
      setProfiles(data.results || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [roleValue])

  useEffect(() => {
    void fetchProfiles()
    setPassword(generatePassword(roleValue.charAt(0).toUpperCase() + roleValue.slice(1)))
  }, [fetchProfiles, roleValue])

  async function handleProvision(e) {
    e.preventDefault()
    if (!provisionEmail) return
    setProvisionLoading(true)
    try {
      const res = await api.adminProvisionAccount({
        email: provisionEmail,
        role: roleValue,
        first_name: firstName,
        last_name: lastName,
        password: password || undefined,
      })
      setCreatedCredentials({
        role: roleFilter,
        email: provisionEmail,
        password: res.password || password,
        name: `${firstName} ${lastName}`.trim() || provisionEmail,
      })
      setProvisionEmail('')
      setFirstName('')
      setLastName('')
      setPassword(generatePassword(roleValue.charAt(0).toUpperCase() + roleValue.slice(1)))
      fetchProfiles()
    } catch (err) {
      alert(`Error provisioning: ${err.message}`)
    } finally {
      setProvisionLoading(false)
    }
  }

  function copyCredentials() {
    if (!createdCredentials) return
    const text = `Riverside Academy Login Credentials:\nRole: ${createdCredentials.role}\nName: ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  async function toggleSuspend(profile) {
    const isActive = profile.user?.is_active ?? profile.is_active ?? true
    const isSuspended = !isActive
    const action = isSuspended ? 'reactivate' : 'suspend'
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return

    try {
      if (isSuspended) {
        await api.adminReactivateProfile(profile.id)
      } else {
        await api.adminSuspendProfile(profile.id)
      }
      fetchProfiles()
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <>
      <div className="content-heading">
        <div>
          <p className="eyebrow">USER MANAGEMENT</p>
          <h1>{roleFilter}</h1>
          <p className="muted">Manage and provision {roleFilter.toLowerCase()} accounts with immediate credentials generation.</p>
        </div>
        {onBack && (
          <button className="secondary-button" onClick={onBack}>
            ← Overview
          </button>
        )}
      </div>

      {/* Generated Credentials Success Card */}
      {createdCredentials && (
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ✓ Account Provisioned & Logins Generated
            </span>
            <div style={{ marginTop: '6px', fontSize: '13px', color: '#14532d' }}>
              <div><b>Name:</b> {createdCredentials.name} ({createdCredentials.role})</div>
              <div><b>Email / Username:</b> {createdCredentials.email}</div>
              <div><b>Generated Password:</b> <code style={{ background: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>{createdCredentials.password}</code></div>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#15803d' }}>
              Credentials have been dispatched to {createdCredentials.email}. The user can log in immediately.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="primary-button"
              style={{ background: '#15803d', fontSize: '11.5px' }}
              onClick={copyCredentials}
            >
              {copied ? '✓ Copied!' : 'Copy Credentials'}
            </button>
            <button
              className="secondary-button"
              style={{ fontSize: '11.5px' }}
              onClick={() => setCreatedCredentials(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Provision Form */}
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Provision New {roleFilter}</h2>
            <p className="muted">Specify email, name, and login password. Account is activated immediately upon creation.</p>
          </div>
        </div>
        <form onSubmit={handleProvision} style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <label style={{ fontSize: '11px', fontWeight: 600 }}>
            First Name
            <input 
              type="text" 
              value={firstName} 
              onChange={e => handleFirstNameChange(e.target.value)} 
              placeholder="e.g. Blessing"
              style={{ width: '100%', marginTop: '4px', padding: '8px 10px', fontSize: '12px' }}
            />
          </label>
          <label style={{ fontSize: '11px', fontWeight: 600 }}>
            Last Name
            <input 
              type="text" 
              value={lastName} 
              onChange={e => handleLastNameChange(e.target.value)} 
              placeholder="e.g. John"
              style={{ width: '100%', marginTop: '4px', padding: '8px 10px', fontSize: '12px' }}
            />
          </label>
          <label style={{ fontSize: '11px', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>School Email (@staff.riversideacademy.com) *</span>
              <a
                href="#gen-email"
                onClick={(e) => {
                  e.preventDefault();
                  const gen = formatSchoolEmail(firstName || 'blessing', lastName || 'john', roleValue);
                  if (gen) setProvisionEmail(gen);
                }}
                style={{ color: '#2563eb', fontSize: '10.5px', textDecoration: 'none' }}
              >
                🔄 Auto-generate
              </a>
            </div>
            <input 
              type="email" 
              value={provisionEmail} 
              onChange={e => setProvisionEmail(e.target.value)} 
              required 
              placeholder="e.g. blessingjohn@staff.riversideacademy.com"
              style={{ width: '100%', marginTop: '4px', padding: '8px 10px', fontSize: '12px', fontFamily: 'monospace' }}
            />
          </label>
          <label style={{ fontSize: '11px', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Login Password</span>
              <a
                href="#generate"
                onClick={(e) => {
                  e.preventDefault();
                  setPassword(generatePassword(roleValue.charAt(0).toUpperCase() + roleValue.slice(1)));
                }}
                style={{ color: '#2563eb', fontSize: '10.5px', textDecoration: 'none' }}
              >
                🔄 Auto-generate
              </a>
            </div>
            <input 
              type="text" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', marginTop: '4px', padding: '8px 10px', fontSize: '12px', fontFamily: 'monospace' }}
            />
          </label>
          <div>
            <button
              className="primary-button"
              type="submit"
              disabled={provisionLoading}
              style={{ width: '100%', padding: '10px' }}
            >
              {provisionLoading ? 'Provisioning...' : `Provision & Generate Login`}
            </button>
          </div>
        </form>
      </section>

      {/* Profiles List */}
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Active Profiles ({profiles.length})</h2>
          </div>
        </div>
        
        {loading && <p style={{ padding: '1rem' }}>Loading profiles...</p>}
        {error && <p className="form-error" style={{ padding: '1rem' }}>{error}</p>}
        
        {!loading && !error && profiles.length === 0 && (
          <div className="empty-state">
            <strong>No profiles</strong>
            <span>There are no {roleFilter.toLowerCase()} profiles found.</span>
          </div>
        )}

        {!loading && !error && profiles.map((profile) => {
          const isActive = profile.user?.is_active ?? profile.is_active ?? true
          return (
            <div
              key={profile.id}
              className="attention-item"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}
            >
              <div>
                <b>{profile.first_name} {profile.last_name}</b>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', alignItems: 'center' }}>
                  <span className="muted">{profile.email}</span>
                  <span className={`status ${!isActive ? 'urgent' : 'upcoming'}`} style={{ fontSize: '10px' }}>
                    {isActive ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
              </div>
              <button className="secondary-button" onClick={() => toggleSuspend(profile)} style={{ fontSize: '11px' }}>
                {isActive ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          );
        })}
      </section>
    </>
  )
}
