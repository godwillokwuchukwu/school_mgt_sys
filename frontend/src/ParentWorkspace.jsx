import React, { useState, useEffect } from 'react'
import ParentPortal from './parent/ParentPortal'
import { api } from './api'

export default function ParentWorkspace(props) {
  const [profile, setProfile] = useState(null)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If user has an active token, fetch their real dashboard data from backend
    if (api.isAuthenticated()) {
      api
        .dashboard()
        .then((dashboard) => {
          if (dashboard?.profile) {
            setProfile(dashboard.profile)
          }
          if (dashboard) {
            setData(dashboard)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    api.logout()
    try {
      sessionStorage.removeItem('active_view_role')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('applicant_access_token')
      localStorage.removeItem('applicant_refresh_token')
      localStorage.removeItem('bfa_session')
      localStorage.removeItem('bfa_user')
      localStorage.removeItem('bfa_user_role')
    } catch {}
    window.location.href = '/'
  }

  const handleSwitchRole = (newRole) => {
    const targetRole = (newRole || '').toLowerCase()
    try {
      sessionStorage.setItem('active_view_role', targetRole)
      localStorage.setItem('bfa_user_role', targetRole)
    } catch {}
    if (targetRole === 'parent') {
      window.location.href = '/parent'
    } else if (targetRole === 'admin') {
      window.location.href = '/portal?role=admin'
    } else if (targetRole === 'student') {
      window.location.href = '/portal?role=student'
    } else {
      window.location.href = `/portal?role=${targetRole}`
    }
  }

  return (
    <ParentPortal
      data={props.data || data}
      profile={props.profile || profile}
      onLogout={props.onLogout || handleLogout}
      onSwitchRole={props.onSwitchRole || handleSwitchRole}
      {...props}
    />
  )
}
