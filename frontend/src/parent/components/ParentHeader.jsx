import React, { useState, useRef, useEffect } from 'react'

export function ParentHeader({
  parentProfile,
  searchQuery,
  setSearchQuery,
  onLogout,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sampleNotifications = [
    { id: 1, title: 'Parent-Teacher Conference confirmed', time: '10 mins ago', unread: true },
    { id: 2, title: 'Midterm Grade Report published for Daniel', time: '2 hours ago', unread: true },
    { id: 3, title: 'Term Fee receipt issued ($3,250.00)', time: 'Yesterday', unread: false },
  ]

  return (
    <header className="parent-header">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="parent-bell-btn mobile-menu-btn"
        style={{ display: 'none' }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Navigation"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search Input */}
      <div className="parent-header-search">
        <svg className="parent-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="parent-search-input"
          placeholder="Search students, courses, events, etc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Header Right Actions */}
      <div className="parent-header-right">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="parent-bell-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifications"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="parent-bell-badge">3</span>
          </button>

          {isNotifOpen && (
            <div className="parent-dropdown-menu" style={{ width: 300, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Notifications</span>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
              </div>
              {sampleNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    backgroundColor: n.unread ? '#f0fdf4' : 'transparent',
                    marginBottom: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsNotifOpen(false)}
                >
                  <div style={{ fontSize: 12.5, fontWeight: n.unread ? 700 : 500, color: '#1e293b' }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            type="button"
            className="parent-user-menu"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <img
              src={parentProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
              alt={parentProfile?.displayName || 'Mrs. Johnson'}
              className="parent-user-avatar"
            />
            <div className="parent-user-info">
              <span className="parent-user-name">{parentProfile?.displayName || 'Mrs. Johnson'}</span>
              <span className="parent-user-role">{parentProfile?.role || 'Parent'}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#64748b' }}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="parent-dropdown-menu">
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{parentProfile?.fullName || 'Mrs. Sarah Johnson'}</div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>{parentProfile?.email || 'mrs.johnson@parent.riversideacademy.com'}</div>
              </div>

              <button
                type="button"
                className="parent-dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  if (onNavigate) onNavigate('Settings')
                }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile & Settings</span>
              </button>

              <button
                type="button"
                className="parent-dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  if (onNavigate) onNavigate('Fees')
                }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Fee Payments</span>
              </button>

              {onSwitchRole && (
                <>
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <button
                    type="button"
                    className="parent-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      onSwitchRole('admin')
                    }}
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Switch to Admin Portal</span>
                  </button>

                  <button
                    type="button"
                    className="parent-dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      onSwitchRole('student')
                    }}
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span>Switch to Student Portal</span>
                  </button>
                </>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

              <button
                type="button"
                className="parent-dropdown-item danger"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  if (onLogout) onLogout()
                }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
