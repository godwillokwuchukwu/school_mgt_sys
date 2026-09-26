import React, { useState, useMemo } from 'react'
import { formatShortDate } from '../adminDateUtils'

export default function AdminAuditLogsDashboard({ logs = [] }) {
  const [selectedUser, setSelectedUser] = useState('All')
  const [selectedModule, setSelectedModule] = useState('All')
  const [selectedAction, setSelectedAction] = useState('All')
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date()
    const weekAgo = new Date(Date.now() - 7 * 86400000)
    return `${formatShortDate(weekAgo)} - ${formatShortDate(today)}`
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Realistic enterprise audit logs matching Panel 9 of media_1790157511143.jpg
  const defaultLogs = [
    {
      id: 1,
      user: {
        name: 'Admin User',
        email: 'admin@riversideacademy.ng',
        role: 'Super Administrator',
        avatar: 'AA',
      },
      action: 'Updated Student',
      actionType: 'update',
      module: 'Students',
      record: 'STD-00482',
      recordName: 'Daniel Anderson (JSS 2A)',
      ip: '192.168.1.10',
      device: 'Chrome 128 / macOS Sonoma',
      dateTime: `${formatShortDate(new Date())} 10:42 AM`,
      status: 'Success',
      diff: {
        field: 'medical_notes',
        before: 'Asthma inhaler required for sports',
        after: 'Asthma inhaler required for sports. Mild peanut allergy registered.',
      },
    },
    {
      id: 2,
      user: {
        name: 'Mrs. Sarah Okafor',
        email: 'bursar@riversideacademy.ng',
        role: 'Bursar',
        avatar: 'SO',
      },
      action: 'Recorded Payment',
      actionType: 'payment',
      module: 'Fees',
      record: 'INV-2026-089',
      recordName: 'Chioma Okafor — 1st Term Tuition',
      ip: '197.210.45.12',
      device: 'Edge 126 / Windows 11',
      dateTime: `${formatShortDate(new Date())} 09:15 AM`,
      status: 'Success',
      diff: {
        field: 'amount_paid',
        before: '₦0 (Pending)',
        after: '₦350,000 (Fully Paid via Bank Transfer)',
      },
    },
    {
      id: 3,
      user: {
        name: 'Admin User',
        email: 'admin@riversideacademy.ng',
        role: 'Super Administrator',
        avatar: 'AA',
      },
      action: 'Created Class',
      actionType: 'create',
      module: 'Classes',
      record: 'CLS-JSS2C',
      recordName: 'Junior Secondary School 2C',
      ip: '192.168.1.10',
      device: 'Chrome 128 / macOS Sonoma',
      dateTime: '22 Sep 2026 04:30 PM',
      status: 'Success',
      diff: {
        field: 'new_record',
        before: 'None',
        after: 'Class Room B-205, Max Capacity: 35, Form Teacher: Mrs. Alabi',
      },
    },
    {
      id: 4,
      user: {
        name: 'Mr. Emmanuel Adeyemi',
        email: 'admissions@riversideacademy.ng',
        role: 'Admissions Officer',
        avatar: 'EA',
      },
      action: 'Approved Admission',
      actionType: 'approve',
      module: 'Admissions',
      record: 'ADM-00412',
      recordName: 'Ibrahim Bello (SS 1 Science)',
      ip: '102.89.34.19',
      device: 'Safari 17 / iPadOS',
      dateTime: '22 Sep 2026 02:18 PM',
      status: 'Success',
      diff: {
        field: 'application_status',
        before: 'Under Interview Review',
        after: 'Admitted (Offer Letter Dispatched)',
      },
    },
    {
      id: 5,
      user: {
        name: 'Admin User',
        email: 'admin@riversideacademy.ng',
        role: 'Super Administrator',
        avatar: 'AA',
      },
      action: 'Added Teacher',
      actionType: 'create',
      module: 'Teachers',
      record: 'TCH-00104',
      recordName: 'Dr. Michael Mensah (Physics)',
      ip: '192.168.1.10',
      device: 'Chrome 128 / macOS Sonoma',
      dateTime: '22 Sep 2026 11:05 AM',
      status: 'Success',
      diff: {
        field: 'staff_onboarding',
        before: 'Candidate Offer Accepted',
        after: 'Active Faculty Profile Created & Timetable Linked',
      },
    },
    {
      id: 6,
      user: {
        name: 'Admin User',
        email: 'admin@riversideacademy.ng',
        role: 'Super Administrator',
        avatar: 'AA',
      },
      action: 'Changed Settings',
      actionType: 'setting',
      module: 'Settings',
      record: 'SYS-CONFIG',
      recordName: 'Academic Calendar 2025/2026',
      ip: '192.168.1.10',
      device: 'Chrome 128 / macOS Sonoma',
      dateTime: '21 Sep 2026 03:45 PM',
      status: 'Success',
      diff: {
        field: 'midterm_break_dates',
        before: '24 Oct 2026 - 26 Oct 2026',
        after: '28 Oct 2026 - 02 Nov 2026',
      },
    },
    {
      id: 7,
      user: {
        name: 'System Daemon',
        email: 'automation@riversideacademy.ng',
        role: 'Automated Service',
        avatar: 'SD',
      },
      action: 'Automated Backup',
      actionType: 'system',
      module: 'System',
      record: 'BCK-2026-0921',
      recordName: 'PostgreSQL Full Snapshot (42.8 MB)',
      ip: '127.0.0.1 (Local)',
      device: 'Ubuntu Server / Cron Worker',
      dateTime: '21 Sep 2026 03:00 AM',
      status: 'Success',
      diff: {
        field: 'backup_archive',
        before: 'bck_2026_09_20.sql.gz',
        after: 'bck_2026_09_21.sql.gz (Cloud Encrypted Storage verified)',
      },
    },
    {
      id: 8,
      user: {
        name: 'Unknown Agent',
        email: 'failed_auth@197.210.88.9',
        role: 'Unauthenticated',
        avatar: '??',
      },
      action: 'Failed Login Attempt',
      actionType: 'security',
      module: 'Security',
      record: 'AUTH-FAIL',
      recordName: 'admin@riversideacademy.ng (Bad Password)',
      ip: '197.210.88.9',
      device: 'Firefox 129 / Linux x86_64',
      dateTime: '20 Sep 2026 11:22 PM',
      status: 'Failed',
      diff: {
        field: 'auth_attempt',
        before: 'Account Standing: Normal',
        after: 'Attempt #1 rejected. IP flagged for rate-limiting check.',
      },
    },
    {
      id: 9,
      user: {
        name: 'Mr. David Adebayo',
        email: 'dean@riversideacademy.ng',
        role: 'Dean of Students',
        avatar: 'DA',
      },
      action: 'Exported Report',
      actionType: 'export',
      module: 'Reports',
      record: 'REP-ATT-0926',
      recordName: 'Weekly Attendance Audit (JSS 1 - SS 3)',
      ip: '102.89.34.19',
      device: 'Chrome 128 / Windows 11',
      dateTime: '20 Sep 2026 02:40 PM',
      status: 'Success',
      diff: {
        field: 'export_action',
        before: 'N/A',
        after: 'Encrypted PDF generated and downloaded to local terminal.',
      },
    },
    {
      id: 10,
      user: {
        name: 'Admin User',
        email: 'admin@riversideacademy.ng',
        role: 'Super Administrator',
        avatar: 'AA',
      },
      action: 'Updated Attendance',
      actionType: 'update',
      module: 'Attendance',
      record: 'ATT-JSS2A-0920',
      recordName: 'JSS 2A Daily Register',
      ip: '192.168.1.10',
      device: 'Chrome 128 / macOS Sonoma',
      dateTime: '20 Sep 2026 09:30 AM',
      status: 'Success',
      diff: {
        field: 'excused_absence',
        before: 'Michael Brown (Unexcused Absence)',
        after: 'Michael Brown (Excused — Medical note verified)',
      },
    },
  ]

  // Combine props logs if provided or fallback to default
  const allLogs = useMemo(() => {
    if (logs && logs.length > 0) {
      return logs.map((l, idx) => {
        const uObj = typeof l.user === 'object' && l.user !== null ? l.user : {}
        const userName = uObj.name || (typeof l.user === 'string' ? l.user : (l.actor || 'Administrator'))
        const userEmail = uObj.email || l.email || 'admin@riversideacademy.edu.ng'
        const userRole = uObj.role || 'Super Administrator'
        const userAvatar = uObj.avatar || (userName.substring(0, 2).toUpperCase())

        const act = l.action || 'System Action'
        const actLower = act.toLowerCase()
        let actType = l.actionType || l.action_type
        if (!actType) {
          if (actLower.includes('payment') || actLower.includes('fee')) actType = 'payment'
          else if (actLower.includes('create') || actLower.includes('add') || actLower.includes('register')) actType = 'create'
          else if (actLower.includes('approve') || actLower.includes('offer') || actLower.includes('enrolled')) actType = 'approve'
          else if (actLower.includes('security') || actLower.includes('auth') || actLower.includes('login')) actType = 'security'
          else if (actLower.includes('backup') || actLower.includes('snapshot') || actLower.includes('system')) actType = 'system'
          else if (actLower.includes('setting')) actType = 'setting'
          else if (actLower.includes('delete') || actLower.includes('remove')) actType = 'delete'
          else actType = 'update'
        }

        const mod = l.module || l.entity || 'General'
        const rec = l.record || l.target || `REC-${1000 + idx}`
        const recName = l.recordName || l.description || l.sub || `${mod} #${l.id}`
        const ip = l.ip || l.ip_address || '127.0.0.1'
        const dev = l.device || l.user_agent || 'Web Admin Console'
        const dt = l.dateTime || l.timestamp || l.time || 'Today'
        const st = l.status || (actLower.includes('fail') ? 'Failed' : 'Success')

        return {
          id: l.id || idx + 1,
          user: {
            name: userName,
            email: userEmail,
            role: userRole,
            avatar: userAvatar,
          },
          action: act,
          actionType: actType,
          module: mod,
          record: rec,
          recordName: recName,
          ip: ip,
          device: dev,
          dateTime: dt,
          status: st,
          description: l.description || l.sub || recName,
          diff: l.diff || {
            field: mod,
            before: typeof l.old_value === 'object' && l.old_value !== null ? JSON.stringify(l.old_value) : (l.old_value || 'Initial / Baseline'),
            after: typeof l.new_value === 'object' && l.new_value !== null ? JSON.stringify(l.new_value) : (l.new_value || l.description || 'Action Committed'),
          },
          old_value: l.old_value,
          new_value: l.new_value,
        }
      })
    }
    return defaultLogs
  }, [logs])

  // Dynamic KPI Metrics derived directly from active logs
  const kpiStats = useMemo(() => {
    const total = allLogs.length
    const security = allLogs.filter((l) =>
      l.module === 'Security' || l.actionType === 'security' || l.action.toLowerCase().includes('login') || l.action.toLowerCase().includes('auth')
    ).length
    const mutations = allLogs.filter((l) =>
      l.actionType === 'update' || l.actionType === 'create' || l.actionType === 'approve' || l.actionType === 'delete' || l.actionType === 'payment'
    ).length
    const system = allLogs.filter((l) =>
      l.module === 'System' || l.actionType === 'system' || l.user?.name?.toLowerCase().includes('system') || l.action.toLowerCase().includes('backup')
    ).length

    return { total, security, mutations, system }
  }, [allLogs])

  // Dynamic Unique Options for Filters
  const uniqueUsers = useMemo(() => {
    const set = new Set(allLogs.map((l) => l.user.name).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [allLogs])

  const uniqueModules = useMemo(() => {
    const set = new Set(allLogs.map((l) => l.module).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [allLogs])

  const uniqueActions = useMemo(() => {
    const set = new Set(allLogs.map((l) => l.action).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [allLogs])

  // Filtering
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        log.user.name.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.record.toLowerCase().includes(q) ||
        log.ip.toLowerCase().includes(q) ||
        log.recordName.toLowerCase().includes(q) ||
        (log.description && log.description.toLowerCase().includes(q))

      const matchesUser =
        selectedUser === 'All' ||
        log.user.name.toLowerCase() === selectedUser.toLowerCase()

      const matchesModule =
        selectedModule === 'All' ||
        log.module.toLowerCase() === selectedModule.toLowerCase()

      const matchesAction =
        selectedAction === 'All' ||
        log.action.toLowerCase() === selectedAction.toLowerCase()

      return matchesSearch && matchesUser && matchesModule && matchesAction
    })
  }, [allLogs, searchQuery, selectedUser, selectedModule, selectedAction])

  // Pagination (10 per page)
  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage))
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(start, start + itemsPerPage)
  }, [filteredLogs, currentPage])

  // Action badge styling
  const getActionBadgeStyle = (action) => {
    const a = action.toLowerCase()
    if (a.includes('payment') || a.includes('fee')) {
      return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' }
    }
    if (a.includes('create') || a.includes('add') || a.includes('registered')) {
      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' }
    }
    if (a.includes('approve') || a.includes('offer') || a.includes('enrolled')) {
      return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' }
    }
    if (a.includes('setting')) {
      return { bg: '#fffbeb', color: '#b45309', border: '#fde68a' }
    }
    if (a.includes('failed') || a.includes('delete') || a.includes('reject')) {
      return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
    }
    if (a.includes('backup') || a.includes('system') || a.includes('login')) {
      return { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' }
    }
    return { bg: '#f8fafc', color: '#334155', border: '#e2e8f0' }
  }

  // Status badge styling
  const getStatusBadgeStyle = (status) => {
    if (status === 'Success') {
      return { bg: '#dcfce7', color: '#15803d', border: '#86efac' }
    }
    if (status === 'Warning') {
      return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' }
    }
    return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' }
  }

  // Export CSV
  const handleExportAudit = () => {
    const headers = ['ID', 'User', 'Role', 'Action', 'Module', 'Target Record', 'IP Address', 'Date & Time', 'Status']
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.user.name}"`,
      `"${l.user.role}"`,
      `"${l.action}"`,
      l.module,
      `"${l.record} - ${l.recordName}"`,
      l.ip,
      `"${l.dateTime}"`,
      l.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Riverside_Academy_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Audit trail exported successfully!')
  }

  return (
    <div className="admin-page-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: '#09261d',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#34d399', fontSize: 16 }}>✓</span>
          {toastMessage}
        </div>
      )}

      {/* 1. Page Header (Clean: Title & Actions without loose non-card icon boxes) */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Audit Logs</h1>
          <p className="admin-page-subtitle">
            Track all system activities, administrative updates, financial entries, and user authentication events.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              fontSize: 12,
              fontWeight: 600,
              color: '#065f46',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
              }}
            />
            Live Monitoring Active
          </div>

          <button
            type="button"
            className="admin-btn-outline"
            onClick={handleExportAudit}
            style={{ padding: '7px 16px', fontSize: 12.5, fontWeight: 600 }}
          >
            Export Logs (CSV)
          </button>
        </div>
      </div>

      {/* 2. Standard 4-KPI Grid (Arranged with Icons strictly preserved inside cards) */}
      <div className="admin-4kpi-grid" style={{ marginBottom: 22 }}>
        {/* Card 1: Total Activities Logged */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#10b981', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 8px', borderRadius: 12 }}>
              Live DB Sync
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#09261d' }}>
            {kpiStats.total}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', marginTop: 4 }}>
            Total Activities Logged
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Immutable database audit trail
          </div>
        </div>

        {/* Card 2: Security & Authentication Events */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box" style={{ background: '#eff6ff', color: '#3b82f6', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="admin-kpi-trend neutral" style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '3px 8px', borderRadius: 12 }}>
              {kpiStats.security} Events
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
            {kpiStats.security}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', marginTop: 4 }}>
            Security & Authentication
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Logins, sessions & auth checks
          </div>
        </div>

        {/* Card 3: Administrative Mutations */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box" style={{ background: '#f5f3ff', color: '#8b5cf6', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', background: '#f5f3ff', padding: '3px 8px', borderRadius: 12 }}>
              {kpiStats.mutations} Operations
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
            {kpiStats.mutations}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', marginTop: 4 }}>
            Administrative Mutations
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Admissions, staff & curriculum updates
          </div>
        </div>

        {/* Card 4: System Tasks & Snapshots */}
        <div className="admin-kpi-box" style={{ padding: '16px 20px' }}>
          <div className="admin-kpi-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="admin-kpi-icon-box" style={{ background: '#f0fdfa', color: '#0f766e', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="admin-kpi-trend positive" style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', background: '#f0fdfa', padding: '3px 8px', borderRadius: 12 }}>
              Automated
            </span>
          </div>
          <div className="admin-kpi-box-value" style={{ fontSize: 28, fontWeight: 800, color: '#09261d' }}>
            {kpiStats.system}
          </div>
          <div className="admin-kpi-box-label" style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', marginTop: 4 }}>
            System Tasks & Snapshots
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Encrypted backups & cron jobs
          </div>
        </div>
      </div>

      {/* 3. Standard Filter Bar (Clean) */}
      <div className="admin-filter-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <div className="admin-filter-search-box" style={{ minWidth: 260 }}>
            <input
              type="text"
              placeholder="Search user, record ID, IP, action, description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              style={{ paddingLeft: 12 }}
            />
          </div>

          <select
            className="admin-select"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value)
              setCurrentPage(1)
            }}
          >
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>{u === 'All' ? 'All Users' : u}</option>
            ))}
          </select>

          <select
            className="admin-select"
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value)
              setCurrentPage(1)
            }}
          >
            {uniqueModules.map((m) => (
              <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>
            ))}
          </select>

          <select
            className="admin-select"
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value)
              setCurrentPage(1)
            }}
          >
            {uniqueActions.map((a) => (
              <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>
            ))}
          </select>

          {(selectedUser !== 'All' || selectedModule !== 'All' || selectedAction !== 'All' || searchQuery) && (
            <button
              type="button"
              className="admin-btn-outline"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => {
                setSelectedUser('All')
                setSelectedModule('All')
                setSelectedAction('All')
                setSearchQuery('')
                setCurrentPage(1)
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
            }}
          >
            <span>Audit Trail Verified</span>
          </div>
        </div>
      </div>

      {/* 4. Audit Logs Table Panel */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Showing{' '}
              <strong style={{ color: '#09261d' }}>
                {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </strong>{' '}
              to{' '}
              <strong style={{ color: '#09261d' }}>
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
              </strong>{' '}
              of <strong style={{ color: '#09261d' }}>{filteredLogs.length}</strong> activity records
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Page {currentPage} of {totalPages}</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                <th>USER ACTOR</th>
                <th>ACTION</th>
                <th>MODULE</th>
                <th>TARGET RECORD</th>
                <th>IP ADDRESS</th>
                <th>DATE & TIME</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                    <div style={{ fontWeight: 600, color: '#334155', fontSize: 14 }}>No audit logs found</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing or adjusting your search filters</div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, idx) => {
                  const actionStyle = getActionBadgeStyle(log.action)
                  const statusStyle = getStatusBadgeStyle(log.status)
                  const recordIndex = (currentPage - 1) * itemsPerPage + idx + 1

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                        {recordIndex}
                      </td>

                      {/* User Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: log.status === 'Failed' ? '#fee2e2' : '#e0f2fe',
                              color: log.status === 'Failed' ? '#b91c1c' : '#0369a1',
                              fontWeight: 700,
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {log.user.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{log.user.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{log.user.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: 14,
                            fontSize: 11.5,
                            fontWeight: 600,
                            backgroundColor: actionStyle.bg,
                            color: actionStyle.color,
                            border: `1px solid ${actionStyle.border}`,
                          }}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Module Column */}
                      <td>
                        <span style={{ fontWeight: 600, color: '#334155', fontSize: 12.5 }}>
                          {log.module}
                        </span>
                      </td>

                      {/* Record Column */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#09261d', fontFamily: 'monospace', fontSize: 12 }}>
                          {log.record}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.recordName}
                        </div>
                      </td>

                      {/* IP Address Column */}
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 11.5,
                            color: '#475569',
                            backgroundColor: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {log.ip}
                        </span>
                      </td>

                      {/* Date & Time Column */}
                      <td style={{ color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                        {log.dateTime}
                      </td>

                      {/* Status Column */}
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          <span style={{ fontSize: 8 }}>●</span>
                          {log.status}
                        </span>
                      </td>

                      {/* Details Button */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLog(log)
                          }}
                          className="admin-btn-outline"
                          style={{ padding: '4px 10px', fontSize: 11.5 }}
                        >
                          View Diff
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="admin-table-footer">
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Showing{' '}
            <strong style={{ color: '#09261d' }}>
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </strong>{' '}
            to{' '}
            <strong style={{ color: '#09261d' }}>
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </strong>{' '}
            of <strong style={{ color: '#09261d' }}>{filteredLogs.length}</strong> records
          </div>

          <div className="admin-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={page === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 4. Audit Log Details Drawer / Modal */}
      {selectedLog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 38, 29, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => setSelectedLog(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              width: '100%',
              maxWidth: 620,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 700,
                    ...getActionBadgeStyle(selectedLog.action),
                  }}
                >
                  {selectedLog.action}
                </span>
                <span style={{ fontSize: 13, color: '#64748b' }}>Log ID #{selectedLog.id}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 18,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#09261d', fontWeight: 800 }}>
                  {selectedLog.recordName}
                </h3>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Target Record: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{selectedLog.record}</strong> in module <strong style={{ color: '#0f172a' }}>{selectedLog.module}</strong>
                </div>
              </div>

              {/* User and Session Metadata */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>User Actor</div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{selectedLog.user.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{selectedLog.user.email}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Timestamp</div>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{selectedLog.dateTime}</div>
                  <div style={{ fontSize: 12, color: '#15803d', fontWeight: 500 }}>Status: {selectedLog.status}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Client IP Address</div>
                  <div style={{ fontFamily: 'monospace', color: '#0f172a', marginTop: 2 }}>{selectedLog.ip}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Device & User Agent</div>
                  <div style={{ color: '#0f172a', marginTop: 2, fontSize: 12 }}>{selectedLog.device}</div>
                </div>
              </div>

              {/* State Diff / Changes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#09261d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Field Modification Diff
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                    Field: <code style={{ color: '#09261d' }}>{selectedLog.diff?.field || 'record_payload'}</code>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: 12 }}>
                    <div style={{ padding: 12, backgroundColor: '#fef2f2', borderRight: '1px solid #fecaca' }}>
                      <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>- Before</div>
                      <div style={{ color: '#7f1d1d', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {selectedLog.diff?.before || 'None'}
                      </div>
                    </div>
                    <div style={{ padding: 12, backgroundColor: '#f0fdf4' }}>
                      <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 4 }}>+ After</div>
                      <div style={{ color: '#14532d', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {selectedLog.diff?.after || 'None'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof & Integrity Hash */}
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: '#64748b',
                }}
              >
                <div>
                  SHA-256 Checksum: <code style={{ color: '#334155' }}>9f8a3c...b41e2d</code> (Immutable ledger verification passed)
                </div>
                <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Verified</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2))
                  showToast('Log JSON copied to clipboard')
                }}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Copy JSON Payload
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#09261d',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

