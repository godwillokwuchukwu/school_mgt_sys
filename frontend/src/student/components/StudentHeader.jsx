import React, { useState, useRef, useEffect } from 'react'

export function StudentHeader({
  activePage,
  setActivePage,
  student,
  notifications = [],
  onLogout,
  onSwitchRole,
  isMobileOpen,
  setIsMobileOpen,
  searchQuery,
  setSearchQuery,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length || 3

  const getBreadcrumbTitle = () => {
    if (activePage === 'Overview' || activePage === 'Dashboard') return 'Overview'
    return activePage
  }

  const initials = student?.fullName
    ? student.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CO'

  return (
    <header className="student-header">
      {/* Left side: Hamburger + Breadcrumbs */}
      <div className="student-header-left">
        <button
          className="student-mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="student-breadcrumbs">
          <span>Dashboard</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="student-crumb-active">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Right side: Search, Notifications, Profile Dropdown */}
      <div className="student-header-right">
        {/* Search input */}
        <div className="student-search-box">
          <svg className="student-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="student-search-input"
            placeholder="Search courses, assignments, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notifications Icon Button */}
        <button
          className="student-notif-btn"
          title="Notifications"
          onClick={() => setActivePage('Notifications')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && <span className="student-notif-dot" />}
        </button>

        {/* Profile Pill & Dropdown */}
        <div className="student-profile-wrapper" ref={dropdownRef}>
          <button
            className="student-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="student-avatar">{initials}</div>
            <div className="student-profile-info">
              <span className="student-profile-name">{student?.fullName || 'Chinedu Okafor'}</span>
              <span className="student-profile-role">
                Student &bull; {student?.studentId || 'CS2024'}
              </span>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4, color: '#94a3b8' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="student-dropdown-menu">
              <button
                className="student-dropdown-item"
                onClick={() => {
                  setActivePage('Profile')
                  setDropdownOpen(false)
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>View Profile</span>
              </button>

              <button
                className="student-dropdown-item"
                onClick={() => {
                  setActivePage('Settings')
                  setDropdownOpen(false)
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Account Settings</span>
              </button>

              <button
                className="student-dropdown-item"
                onClick={() => {
                  setActivePage('Settings')
                  setDropdownOpen(false)
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Help and Support</span>
              </button>

              {onSwitchRole && (
                <>
                  <div className="student-dropdown-divider" />
                  <button
                    className="student-dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false)
                      onSwitchRole('admin')
                    }}
                    style={{ color: '#0f766e', fontWeight: 600 }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Switch to Admin Portal</span>
                  </button>
                </>
              )}

              <div className="student-dropdown-divider" />

              <button
                className="student-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false)
                  if (onLogout) onLogout()
                  else window.location.href = '/portal'
                }}
                style={{ color: '#ef4444' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default StudentHeader
