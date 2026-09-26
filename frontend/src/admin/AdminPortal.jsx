import React, { useState, useEffect, useMemo } from 'react'
import './admin.css'
import { AdminOverview } from './AdminOverview'
import { AdminStudents } from './AdminStudents'
import { AdminTeachers } from './AdminTeachers'
import { StudentProfileDrawer, TeacherProfileDrawer } from './AdminDrawers'
import {
  AdminParents,
  AdminStaff,
  AdminClasses,
  AdminEmployment,
  AdminAttendance,
  AdminGrades,
  AdminFees,
  AdminPayroll,
  AdminExpenses,
  AdminTimetable,
  AdminCalendar,
  AdminNews,
  AdminReports,
  AdminAnalyticsDashboard,
  AdminAuditLogs,
  AdminSettings,
} from './AdminModules'
import AdmissionsAdmin from '../AdmissionsAdmin'
import DataAnalystPortal from '../DataAnalystPortal'
import { AdminAIAssistant } from './AdminAIAssistant'
import { useLiveDateTime } from './adminDateUtils'

export default function AdminPortal({ onLogout }) {
  const { liveDateTime, longDate } = useLiveDateTime()
  const [activeModule, setActiveModule] = useState('Overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [portalSettings, setPortalSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('riverside_school_settings')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  const notificationsList = [
    { id: 1, type: 'red', title: 'Low attendance in JSS 2B', desc: '78% attendance rate (below 85% threshold)', time: '1 hour ago' },
    { id: 2, type: 'yellow', title: 'Fee payment pending', desc: '5 students have outstanding term fees', time: '3 hours ago' },
    { id: 3, type: 'blue', title: 'New admission applications', desc: '9 applications currently logged in database', time: '4 hours ago' },
    { id: 4, type: 'green', title: 'System backup completed', desc: 'All PostgreSQL tables backed up successfully', time: '6 hours ago' },
  ]

  // Drawer states
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false)

  // Fetch real data from the database with live automatic sync
  const fetchDashboardData = React.useCallback((isBackground = false) => {
    if (!isBackground) setLoading(true)
    fetch('/api/core/admin/dashboard/')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setDashboardData(data)
        if (data?.settings) {
          setPortalSettings(data.settings)
          try {
            localStorage.setItem('riverside_school_settings', JSON.stringify(data.settings))
            const sName = data.settings.school_name || data.settings.school_form?.schoolName
            if (sName) localStorage.setItem('riverside_school_name', sName)
            const sLogo = data.settings.logo_data || data.settings.school_logo || data.settings.school_form?.logo
            if (sLogo) localStorage.setItem('riverside_school_logo', sLogo)
          } catch {}
        }
        if (!isBackground) setLoading(false)
      })
      .catch((err) => {
        console.warn('Using database fallback cache:', err)
        if (!isBackground) setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchDashboardData()

    const handleDataRefresh = () => {
      fetchDashboardData(true)
    }

    const handleSettingsUpdate = () => {
      try {
        const cached = localStorage.getItem('riverside_school_settings')
        if (cached) {
          const parsed = JSON.parse(cached)
          setPortalSettings(parsed)
          setDashboardData((prev) => (prev ? { ...prev, settings: parsed } : prev))
        }
      } catch {}
    }

    window.addEventListener('school-settings-updated', handleSettingsUpdate)
    window.addEventListener('admin-refresh-data', handleDataRefresh)
    window.addEventListener('admin-activity-occurred', handleDataRefresh)

    // Immediate card automation: periodic live background sync every 8 seconds
    const pollInterval = setInterval(() => {
      fetchDashboardData(true)
    }, 8000)

    return () => {
      window.removeEventListener('school-settings-updated', handleSettingsUpdate)
      window.removeEventListener('admin-refresh-data', handleDataRefresh)
      window.removeEventListener('admin-activity-occurred', handleDataRefresh)
      clearInterval(pollInterval)
    }
  }, [fetchDashboardData])

  const handleSaveSettings = (newSettings) => {
    setPortalSettings(newSettings)
    setDashboardData((prev) => (prev ? { ...prev, settings: newSettings } : prev))
    try {
      localStorage.setItem('riverside_school_settings', JSON.stringify(newSettings))
      const sName = newSettings.school_name || newSettings.school_form?.schoolName
      if (sName) {
        localStorage.setItem('riverside_school_name', sName)
        document.title = `${sName} — Administration Portal`
      }
      const sLogo = newSettings.logo_data || newSettings.school_logo || newSettings.school_form?.logo
      if (sLogo) {
        localStorage.setItem('riverside_school_logo', sLogo)
      }
      window.dispatchEvent(new Event('school-settings-updated'))
    } catch {}
  }

  const currentSchoolName =
    portalSettings?.school_name ||
    portalSettings?.school_form?.schoolName ||
    (typeof window !== 'undefined' ? localStorage.getItem('riverside_school_name') : null) ||
    'Riverside Academy'

  const currentSchoolLogo =
    portalSettings?.logo_data ||
    portalSettings?.school_logo ||
    portalSettings?.school_form?.logo ||
    (typeof window !== 'undefined' ? localStorage.getItem('riverside_school_logo') : null) ||
    null

  const currentSchoolMotto =
    portalSettings?.motto ||
    portalSettings?.school_form?.motto ||
    'Knowledge, Character, Excellence'

  useEffect(() => {
    if (currentSchoolName) {
      document.title = `${currentSchoolName} — Administration Portal`
    }
  }, [currentSchoolName])

  // 18 Navigation Items matching media_1789917182709.png
  const navItems = [
    { id: 'Overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'Students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'Teachers', label: 'Teachers', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'Parents', label: 'Parents', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'Staff', label: 'Staff', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'Classes', label: 'Classes', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'Admissions', label: 'Admissions', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
    { id: 'Employment', label: 'Employment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'AI Assistant', label: 'AI Assistant', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'Attendance', label: 'Attendance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'Grades', label: 'Grades', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'Fees', label: 'Fees', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'Payroll', label: 'Payroll', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'Expenses', label: 'Expenses', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z' },
    { id: 'Timetable', label: 'Timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'Calendar', label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'News', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'Reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'Data Analytics', label: 'Data Analytics', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'Audit Logs', label: 'Audit Logs', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'Settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  const kpis = dashboardData?.kpis
  const students = dashboardData?.students || []
  const teachers = dashboardData?.teachers || []
  const enrollmentByClass = dashboardData?.enrollment_by_class || []
  const events = dashboardData?.upcoming_events || []

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { modules: [], students: [], teachers: [], classes: [], parents: [], staff: [] }
    const q = searchQuery.toLowerCase().trim()
    const matchingModules = navItems.filter((item) => item.label.toLowerCase().includes(q))
    const matchingStudents = (dashboardData?.students || []).filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.student_id && s.student_id.toLowerCase().includes(q)) ||
        (s.class && s.class.toLowerCase().includes(q))
    )
    const matchingTeachers = (dashboardData?.teachers || []).filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.employee_id && t.employee_id.toLowerCase().includes(q))
    )
    const matchingClasses = (dashboardData?.classes || []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.class_teacher && c.class_teacher.toLowerCase().includes(q))
    )
    const matchingParents = (dashboardData?.parents || []).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.children || []).some((ch) => ch.name.toLowerCase().includes(q))
    )
    const matchingStaff = (dashboardData?.staff || []).filter(
      (st) =>
        st.name.toLowerCase().includes(q) ||
        (st.position && st.position.toLowerCase().includes(q)) ||
        (st.department && st.department.toLowerCase().includes(q)) ||
        (st.employee_id && st.employee_id.toLowerCase().includes(q))
    )
    return {
      modules: matchingModules.slice(0, 4),
      students: matchingStudents.slice(0, 4),
      teachers: matchingTeachers.slice(0, 4),
      classes: matchingClasses.slice(0, 4),
      parents: matchingParents.slice(0, 4),
      staff: matchingStaff.slice(0, 4),
    }
  }, [searchQuery, navItems, dashboardData])

  const hasSearchResults =
    searchResults.modules.length > 0 ||
    searchResults.students.length > 0 ||
    searchResults.teachers.length > 0 ||
    searchResults.classes.length > 0 ||
    searchResults.parents.length > 0 ||
    searchResults.staff.length > 0

  return (
    <div className="admin-portal-wrapper">
      {/* 1. PERSISTENT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            {currentSchoolLogo ? (
              <img
                src={currentSchoolLogo}
                alt={currentSchoolName}
                className="admin-brand-crest"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  objectFit: 'contain',
                  backgroundColor: '#ffffff',
                  padding: 2,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              />
            ) : (
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" className="admin-brand-crest">
                <rect x="1.5" y="1.5" width="37" height="37" rx="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <polygon
                  points="20,7.5 31,13.8 31,26.2 20,32.5 9,26.2 9,13.8"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="20" r="3.2" fill="#ffffff" />
              </svg>
            )}
            <div className="admin-brand-title">{currentSchoolName}</div>
          </div>

          <div className="admin-school-switcher">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span className="admin-school-dot" style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSchoolName}</span>
            </div>
            <span style={{ fontSize: 10, flexShrink: 0 }}>▼</span>
          </div>
        </div>

        <div className="admin-nav-section-label">ADMIN WORKSPACE</div>

        <div className="admin-nav-list">
          {navItems
            .filter((item) => {
              if (item.id === 'Settings') return true
              const vis = portalSettings?.portal_layout_config?.module_visibility
              if (!vis || typeof vis !== 'object') return true
              return vis[item.id] !== false
            })
            .map((item) => (
            <button
              key={item.id}
              className={`admin-nav-btn ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-sidebar-footer">
          {currentSchoolLogo ? (
            <img
              src={currentSchoolLogo}
              alt={currentSchoolName}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                objectFit: 'contain',
                backgroundColor: '#ffffff',
                padding: 2,
                flexShrink: 0,
              }}
            />
          ) : (
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#10b981" />
              <path d="M20 8L31 14V26L20 32L9 26V14L20 8Z" fill="#09261d" />
              <path d="M20 12L28 16.5V23.5L20 28L12 23.5V16.5L20 12Z" fill="#10b981" />
            </svg>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="admin-sidebar-footer-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSchoolName}</div>
            <div className="admin-sidebar-footer-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSchoolMotto}</div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-top-bar">
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-parent">Workspace</span>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">
              {activeModule === 'Overview' ? 'Admin Overview' : activeModule}
            </span>
          </div>

          <div className="admin-top-actions">
            {/* Live Automated Date & Time Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0', fontSize: 12, color: '#334155', fontWeight: 600 }}>
              <span>{liveDateTime}</span>
            </div>

            {/* Functional Search Pill with Dropdown */}
            <div style={{ position: 'relative' }}>
              <div className="admin-search-pill">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search records, students, classes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearchOpen(true)
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setIsSearchOpen(false)
                    }}
                    style={{ background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: 13 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="admin-search-dropdown">
                  {!hasSearchResults && (
                    <div className="admin-search-empty">No records found for "{searchQuery}"</div>
                  )}

                  {searchResults.modules.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">MODULES</div>
                      {searchResults.modules.map((m) => (
                        <div
                          key={m.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule(m.id)
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">📁</span>
                          <span className="admin-search-item-title">{m.label}</span>
                          <span className="admin-search-item-badge">Module</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.students.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">STUDENTS</div>
                      {searchResults.students.map((s) => (
                        <div
                          key={s.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule('Students')
                            setSelectedStudent(s)
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">👤</span>
                          <div>
                            <div className="admin-search-item-title">{s.name}</div>
                            <div className="admin-search-item-sub">{s.student_id} • {s.class}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.teachers.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">TEACHERS</div>
                      {searchResults.teachers.map((t) => (
                        <div
                          key={t.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule('Teachers')
                            setSelectedTeacher(t)
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">👨‍🏫</span>
                          <div>
                            <div className="admin-search-item-title">{t.name}</div>
                            <div className="admin-search-item-sub">{t.employee_id} • {t.subject}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.classes.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">CLASSES</div>
                      {searchResults.classes.map((c) => (
                        <div
                          key={c.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule('Classes')
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">🏫</span>
                          <div>
                            <div className="admin-search-item-title">{c.name}</div>
                            <div className="admin-search-item-sub">{c.code} • Teacher: {c.class_teacher || 'Assigned'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.parents.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">PARENTS & GUARDIANS</div>
                      {searchResults.parents.map((p) => (
                        <div
                          key={p.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule('Parents')
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">👪</span>
                          <div>
                            <div className="admin-search-item-title">{p.name} ({p.relationship})</div>
                            <div className="admin-search-item-sub">{p.phone} • {p.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.staff.length > 0 && (
                    <div className="admin-search-section">
                      <div className="admin-search-section-label">STAFF DIRECTORY</div>
                      {searchResults.staff.map((st) => (
                        <div
                          key={st.id}
                          className="admin-search-item"
                          onClick={() => {
                            setActiveModule('Staff')
                            setIsSearchOpen(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className="admin-search-item-icon">💼</span>
                          <div>
                            <div className="admin-search-item-title">{st.name}</div>
                            <div className="admin-search-item-sub">{st.employee_id} • {st.position} ({st.department})</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bell & Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="admin-bell-btn"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="System Notifications & Alerts"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && <span className="admin-bell-badge">{unreadCount}</span>}
              </button>

              {isNotificationsOpen && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <div className="admin-notif-title">Notifications & System Alerts</div>
                    <button
                      className="admin-notif-mark-read"
                      onClick={() => setUnreadCount(0)}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="admin-notif-list">
                    {notificationsList.map((n) => (
                      <div
                        key={n.id}
                        className="admin-notif-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (n.module) setActiveModule(n.module)
                          setIsNotificationsOpen(false)
                        }}
                      >
                        <div className={`admin-notif-icon ${n.type}`}>
                          {n.type === 'red' ? '⚠' : n.type === 'yellow' ? 'ℹ' : n.type === 'blue' ? 'ℹ' : '✓'}
                        </div>
                        <div className="admin-notif-content">
                          <div className="admin-notif-item-title">{n.title}</div>
                          <div className="admin-notif-item-desc">{n.desc}</div>
                          <div className="admin-notif-item-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="admin-notif-footer">
                    <button
                      className="admin-notif-view-all"
                      onClick={() => {
                        setIsNotificationsOpen(false)
                        setActiveModule('News')
                      }}
                    >
                      View All Alerts in News →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="admin-user-chip" onClick={onLogout} title="Click to Logout">
              <div className="admin-user-avatar-circle">AA</div>
              <div className="admin-user-info">
                <span className="admin-user-name">Admin</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        {activeModule === 'Overview' && (
          <AdminOverview
            kpis={kpis}
            enrollmentByClass={enrollmentByClass}
            attendanceTrend={dashboardData?.attendance_trend}
            events={events}
            activities={dashboardData?.audit_logs}
            settings={portalSettings || dashboardData?.settings}
            dashboardData={dashboardData}
            onNavigate={(mod) => setActiveModule(mod)}
            onRefresh={() => fetchDashboardData(true)}
            onOpenAddStudent={() => {
              setActiveModule('Students')
              setIsAddStudentOpen(true)
            }}
            onOpenAddTeacher={() => {
              setActiveModule('Teachers')
              setIsAddTeacherOpen(true)
            }}
          />
        )}

        {activeModule === 'Students' && (
          <AdminStudents
            students={students}
            onSelectStudent={(s) => setSelectedStudent(s)}
            onAddStudent={() => {}}
            onRefresh={() => fetchDashboardData(true)}
            isAddModalOpen={isAddStudentOpen}
            setIsAddModalOpen={setIsAddStudentOpen}
          />
        )}

        {activeModule === 'Teachers' && (
          <AdminTeachers
            teachers={teachers}
            onSelectTeacher={(t) => setSelectedTeacher(t)}
            onAddTeacher={() => {}}
            onRefresh={() => fetchDashboardData(true)}
            isAddModalOpen={isAddTeacherOpen}
            setIsAddModalOpen={setIsAddTeacherOpen}
          />
        )}

        {activeModule === 'Parents' && (
          <AdminParents
            parents={dashboardData?.parents}
            onSelectParent={() => {}}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Staff' && (
          <AdminStaff
            staff={dashboardData?.staff}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Classes' && (
          <AdminClasses
            classes={dashboardData?.classes}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Admissions' && (
          <div style={{ flex: 1, minWidth: 0, padding: 0 }}>
            <AdmissionsAdmin
              onBack={() => setActiveModule('Overview')}
              onRefresh={() => fetchDashboardData(true)}
            />
          </div>
        )}

        {activeModule === 'Employment' && (
          <AdminEmployment
            vacancies={dashboardData?.vacancies}
            applications={dashboardData?.employment_applications}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'AI Assistant' && (
          <AdminAIAssistant
            isFullPage={true}
            dashboardData={dashboardData}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        )}

        {activeModule === 'Attendance' && (
          <AdminAttendance
            students={students}
            classes={dashboardData?.classes}
            teachers={teachers}
            teacherAttendance={dashboardData?.teacher_attendance}
            staffAttendance={dashboardData?.staff_attendance}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Grades' && <AdminGrades students={students} onRefresh={() => fetchDashboardData(true)} />}

        {activeModule === 'Fees' && (
          <AdminFees
            invoices={dashboardData?.invoices}
            financeReconciliation={dashboardData?.finance_reconciliation}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Payroll' && (
          <AdminPayroll
            salaryProfiles={dashboardData?.salary_profiles}
            payrollPeriods={dashboardData?.payroll_periods}
            salaryPayments={dashboardData?.salary_payments}
            financeReconciliation={dashboardData?.finance_reconciliation}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Expenses' && (
          <AdminExpenses
            expenses={dashboardData?.expenses}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}

        {activeModule === 'Timetable' && (
          <AdminTimetable
            classes={dashboardData?.classes}
            teachers={teachers}
          />
        )}

        {activeModule === 'Calendar' && <AdminCalendar events={events} />}
        {activeModule === 'News' && <AdminNews news={dashboardData?.news} />}
        {activeModule === 'Reports' && <AdminReports />}
        {activeModule === 'Data Analytics' && (
          <AdminAnalyticsDashboard
            dashboardData={dashboardData}
            onLaunchSimulator={() => {}}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}
        {activeModule === 'Audit Logs' && (
          <AdminAuditLogs
            logs={dashboardData?.audit_logs}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}
        {activeModule === 'Settings' && (
          <AdminSettings
            settings={portalSettings || dashboardData?.settings}
            onSave={handleSaveSettings}
            onRefresh={() => fetchDashboardData(true)}
          />
        )}
      </main>

      {/* 3. PROFILE DRAWERS */}
      {selectedStudent && (
        <StudentProfileDrawer
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {selectedTeacher && (
        <TeacherProfileDrawer
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  )
}
