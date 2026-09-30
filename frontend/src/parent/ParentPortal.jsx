import React, { useState, useEffect, useMemo } from 'react'
import './parent.css'
import { ParentSidebar } from './components/ParentSidebar'
import { ParentHeader } from './components/ParentHeader'
import {
  AddChildModal,
  MakePaymentModal,
  NewMessageModal,
  AddNoteModal,
} from './components/ParentModals'

import ParentDashboard from './pages/ParentDashboard'
import ParentChildren from './pages/ParentChildren'
import ParentAcademicProgress from './pages/ParentAcademicProgress'
import ParentAttendance from './pages/ParentAttendance'
import ParentGrades from './pages/ParentGrades'
import ParentTimetable from './pages/ParentTimetable'
import ParentFees from './pages/ParentFees'
import ParentDocuments from './pages/ParentDocuments'
import ParentMessages from './pages/ParentMessages'
import ParentNotices from './pages/ParentNotices'
import ParentSettings from './pages/ParentSettings'

import {
  DEFAULT_PARENT_PROFILE,
  DEFAULT_CHILDREN,
  RECENT_MESSAGES,
  LATEST_NOTICES,
  UPCOMING_EVENTS,
} from './parentData'

export default function ParentPortal({
  data = {},
  profile = null,
  onLogout,
  onSwitchRole,
}) {
  const [activePage, setActivePage] = useState('Dashboard')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // School branding state synced with settings
  const [schoolName, setSchoolName] = useState(() => {
    try {
      return localStorage.getItem('riverside_school_name') || 'Riverside College'
    } catch {
      return 'Riverside College'
    }
  })
  const [schoolLogo, setSchoolLogo] = useState(() => {
    try {
      return localStorage.getItem('riverside_school_logo') || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const name = localStorage.getItem('riverside_school_name')
        const logo = localStorage.getItem('riverside_school_logo')
        if (name) setSchoolName(name)
        if (logo) setSchoolLogo(logo)
      } catch {}
    }
    window.addEventListener('school-settings-updated', handleSettingsUpdate)
    return () => window.removeEventListener('school-settings-updated', handleSettingsUpdate)
  }, [])

  // Parent Profile state
  const [parentProfile, setParentProfile] = useState(() => {
    if (profile) {
      return {
        ...DEFAULT_PARENT_PROFILE,
        ...profile,
        fullName: profile.full_name || profile.name || DEFAULT_PARENT_PROFILE.fullName,
        displayName: profile.display_name || profile.name || DEFAULT_PARENT_PROFILE.displayName,
        email: profile.email || DEFAULT_PARENT_PROFILE.email,
        phone: profile.phone || DEFAULT_PARENT_PROFILE.phone,
      }
    }
    return DEFAULT_PARENT_PROFILE
  })

  // Children state
  const [childrenList, setChildrenList] = useState(DEFAULT_CHILDREN)
  const [selectedChildId, setSelectedChildId] = useState(DEFAULT_CHILDREN[0]?.id || 'child-1')

  // Messages, Notices, Events state
  const [messagesList, setMessagesList] = useState(RECENT_MESSAGES)
  const [noticesList, setNoticesList] = useState(LATEST_NOTICES)
  const [eventsList, setEventsList] = useState(UPCOMING_EVENTS)

  // Modals state
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)

  const selectedChild = useMemo(() => {
    return childrenList.find((c) => c.id === selectedChildId) || childrenList[0]
  }, [childrenList, selectedChildId])

  const unreadMessagesCount = useMemo(() => {
    return messagesList.filter((m) => m.unread > 0).length
  }, [messagesList])

  // Handlers
  const handleSelectChild = (childId) => {
    setSelectedChildId(childId)
  }

  const handleAddChild = (childData) => {
    const newChild = {
      id: `child-${Date.now()}`,
      studentId: childData.admissionNo || `RS-2025-${Math.floor(100 + Math.random() * 900)}`,
      firstName: childData.admissionNo?.split('-')?.[1] || 'New',
      lastName: 'Student',
      name: `Student (${childData.admissionNo})`,
      grade: 'Grade 9 - Standard',
      department: 'Secondary General',
      classTeacher: 'Assigned Faculty',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      gpa: 3.5,
      gpaTrend: '+0.1',
      totalCredits: 6,
      completedCredits: 6,
      inProgressCredits: 0,
      attendanceRate: 94,
      daysPresent: 18,
      daysAbsent: 1,
      daysLate: 0,
      attendanceWeek: [95, 90, 100, 95, 90],
      averageScore: 89.0,
      feesTotal: 4000,
      feesPaid: 4000,
      feesDue: 0,
      subjects: [
        { id: 'mth', code: 'MTH101', name: 'Mathematics', teacher: 'Faculty Lead', grade: 'A-', score: 90, status: 'Good', room: 'Room 101', credits: 1 },
        { id: 'eng', code: 'ENG101', name: 'English Language', teacher: 'Faculty Lead', grade: 'A', score: 92, status: 'Excellent', room: 'Room 102', credits: 1 },
      ],
      attendanceRecords: [
        { date: 'Sep 22, 2025', status: 'Present', remarks: 'First week linked' },
      ],
      feesBreakdown: [
        { id: `f-${Date.now()}`, description: 'Term Registration & Tuition', amount: 4000, status: 'Paid', dueDate: 'Sep 05, 2025' },
      ],
      documents: [],
      notes: [],
    }

    setChildrenList((prev) => [...prev, newChild])
    setSelectedChildId(newChild.id)
    alert(`Child profile with Admission Number "${childData.admissionNo}" linked successfully!`)
  }

  const handleMakePayment = (paymentData) => {
    if (!selectedChild) return
    const amountNum = parseFloat(paymentData.amount) || 0

    setChildrenList((prev) =>
      prev.map((c) => {
        if (c.id === selectedChild.id) {
          const newPaid = (c.feesPaid || 0) + amountNum
          const newDue = Math.max(0, (c.feesDue || 0) - amountNum)
          const newInvoice = {
            id: `pay-${Date.now()}`,
            description: paymentData.feeDescription || 'Tuition / Fees Payment',
            amount: amountNum,
            status: 'Paid',
            dueDate: 'Today',
          }
          return {
            ...c,
            feesPaid: newPaid,
            feesDue: newDue,
            feesBreakdown: [newInvoice, ...(c.feesBreakdown || [])],
          }
        }
        return c
      })
    )

    alert(`Payment of $${amountNum.toLocaleString()} processed successfully via ${paymentData.paymentMethod}! Official receipt issued.`)
  }

  const handleSendMessage = (msgData) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: msgData.recipient || 'Teacher / Administration',
      role: 'Staff Faculty',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      snippet: msgData.message,
      time: 'Just now',
      date: 'Today',
      unread: 0,
      chat: [
        { sender: 'me', text: msgData.message, time: 'Just now' },
      ],
    }

    setMessagesList((prev) => [newMsg, ...prev])
    setActivePage('Messages')
    alert(`Your message to "${msgData.recipient}" has been sent successfully.`)
  }

  const handleAddNote = (noteData) => {
    if (!selectedChild) return
    const newNote = {
      id: `note-${Date.now()}`,
      title: noteData.title,
      date: 'Today',
      content: noteData.content,
    }

    setChildrenList((prev) =>
      prev.map((c) => {
        if (c.id === selectedChild.id) {
          return {
            ...c,
            notes: [newNote, ...(c.notes || [])],
          }
        }
        return c
      })
    )

    alert(`Note "${noteData.title}" saved to personal notes.`)
  }

  const handleUpdateProfile = (updatedFields) => {
    setParentProfile((prev) => ({
      ...prev,
      ...updatedFields,
      fullName: `${updatedFields.firstName || ''} ${updatedFields.lastName || ''}`.trim() || prev.fullName,
    }))
  }

  return (
    <div className="parent-portal-wrapper">
      {/* 1. Dedicated Left Sidebar */}
      <ParentSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        schoolName={schoolName}
        schoolLogo={schoolLogo}
        unreadMessages={unreadMessagesCount}
      />

      {/* 2. Main Layout Shell */}
      <div className="parent-main-layout">
        {/* Top Header */}
        <ParentHeader
          schoolName={schoolName}
          parentProfile={parentProfile}
          children={childrenList}
          selectedChild={selectedChild}
          onSelectChild={handleSelectChild}
          onOpenMobileNav={() => setIsMobileOpen(true)}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
          onNavigate={setActivePage}
          unreadMessages={unreadMessagesCount}
        />

        {/* Main Content Area */}
        <main className="parent-main-content">
          {/* Breadcrumb Bar */}
          <div className="parent-breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('Dashboard')}>
              {schoolName}
            </span>
            <span>/</span>
            <span>Parent Portal</span>
            <span>/</span>
            <span className="current">{activePage}</span>
          </div>

          {/* Subpage Router */}
          {activePage === 'Dashboard' && (
            <ParentDashboard
              parentProfile={parentProfile}
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onNavigate={setActivePage}
              onOpenAddChild={() => setIsAddChildOpen(true)}
              onOpenPayment={() => setIsPaymentOpen(true)}
              onOpenMessage={() => setIsMessageOpen(true)}
              upcomingEvents={eventsList}
              latestNotices={noticesList}
              recentMessages={messagesList}
            />
          )}

          {activePage === 'Children' && (
            <ParentChildren
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onNavigate={setActivePage}
              onOpenAddChild={() => setIsAddChildOpen(true)}
              onOpenPayment={() => setIsPaymentOpen(true)}
            />
          )}

          {activePage === 'Progress' && (
            <ParentAcademicProgress
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
            />
          )}

          {activePage === 'Attendance' && (
            <ParentAttendance
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onOpenNote={() => setIsNoteOpen(true)}
            />
          )}

          {activePage === 'Grades' && (
            <ParentGrades
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
            />
          )}

          {activePage === 'Timetable' && (
            <ParentTimetable
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
            />
          )}

          {activePage === 'Fees' && (
            <ParentFees
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onOpenPayment={() => setIsPaymentOpen(true)}
            />
          )}

          {activePage === 'Documents' && (
            <ParentDocuments
              children={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
            />
          )}

          {activePage === 'Messages' && (
            <ParentMessages
              messages={messagesList}
              onOpenNewMessage={() => setIsMessageOpen(true)}
            />
          )}

          {activePage === 'Notices' && (
            <ParentNotices
              notices={noticesList}
              selectedChild={selectedChild}
              onOpenAddNote={() => setIsNoteOpen(true)}
            />
          )}

          {activePage === 'Settings' && (
            <ParentSettings
              parentProfile={parentProfile}
              children={childrenList}
              onUpdateProfile={handleUpdateProfile}
              onOpenAddChild={() => setIsAddChildOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 3. Global Interactive Modals */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onAddChild={handleAddChild}
      />

      <MakePaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedChild={selectedChild}
        onMakePayment={handleMakePayment}
      />

      <NewMessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        children={childrenList}
        selectedChild={selectedChild}
        onSendMessage={handleSendMessage}
      />

      <AddNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        selectedChild={selectedChild}
        onAddNote={handleAddNote}
      />
    </div>
  )
}
