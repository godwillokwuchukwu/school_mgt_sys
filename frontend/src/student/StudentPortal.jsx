import React, { useState } from 'react'
import './student.css'
import {
  STUDENT_PROFILE,
  STUDENT_COURSES,
  TODAY_SCHEDULE,
  UPCOMING_ASSIGNMENTS,
  RECENT_GRADES,
  ANNOUNCEMENTS,
  ATTENDANCE_RECORDS,
  EXAMS_LIST,
  FINANCIAL_DATA,
  DOCUMENTS_LIST,
  CONVERSATIONS,
  NOTIFICATIONS_LIST,
  TIMETABLE_WEEK,
} from './studentData'

import { StudentSidebar } from './components/StudentSidebar'
import { StudentHeader } from './components/StudentHeader'
import { SubmitAssignmentModal, MakePaymentModal, UploadDocumentModal } from './components/StudentModals'

import { StudentDashboard } from './pages/StudentDashboard'
import { StudentProfile } from './pages/StudentProfile'
import { StudentClasses } from './pages/StudentClasses'
import { StudentAssignments } from './pages/StudentAssignments'
import { StudentGrades } from './pages/StudentGrades'
import { StudentAttendance } from './pages/StudentAttendance'
import { StudentExams } from './pages/StudentExams'
import { StudentTimetable } from './pages/StudentTimetable'
import { StudentPayments } from './pages/StudentPayments'
import { StudentDocuments } from './pages/StudentDocuments'
import { StudentMessages } from './pages/StudentMessages'
import { StudentAIAssistant } from './pages/StudentAIAssistant'
import { StudentNotifications } from './pages/StudentNotifications'
import { StudentSettings } from './pages/StudentSettings'

export default function StudentPortal({ onLogout, onSwitchRole, profile, data }) {
  const [activePage, setActivePage] = useState('Overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  // Use Chinedu Okafor dataset as requested in the design specifications
  const [student, setStudent] = useState(STUDENT_PROFILE)

  const [courses, setCourses] = useState(STUDENT_COURSES)
  const [assignments, setAssignments] = useState(UPCOMING_ASSIGNMENTS)
  const [financialData, setFinancialData] = useState(FINANCIAL_DATA)
  const [documents, setDocuments] = useState(DOCUMENTS_LIST)
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST)

  // Modals
  const [assignmentForSubmission, setAssignmentForSubmission] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Handle assignment submission
  const handleAssignmentSubmitSuccess = ({ assignmentId, content, fileName }) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'Submitted',
            statusClass: 'submitted',
            submittedAt: 'Just now',
          }
        }
        return a
      })
    )
    showToast(`Assignment submitted successfully! File: ${fileName} ✓`)
  }

  // Handle fee payment
  const handlePaymentSuccess = ({ txnId, fee, amount, amountFormatted, method }) => {
    const updatedOutstanding = Math.max(0, financialData.outstanding - amount)
    const updatedPaid = financialData.paid + amount
    setFinancialData((prev) => ({
      ...prev,
      paid: updatedPaid,
      paidFormatted: `₦${updatedPaid.toLocaleString()}.00`,
      outstanding: updatedOutstanding,
      outstandingFormatted: `₦${updatedOutstanding.toLocaleString()}.00`,
      progressPercent: Math.min(100, Math.round((updatedPaid / prev.totalFees) * 100)),
      paymentHistory: [
        {
          id: txnId,
          date: 'Sep 23, 2025',
          description: fee,
          amount: amountFormatted,
          method,
          status: 'Completed',
        },
        ...prev.paymentHistory,
      ],
      feeBreakdown: prev.feeBreakdown.map((f) => {
        if (f.item.includes(fee) || fee.includes(f.item)) {
          return {
            ...f,
            status: updatedOutstanding === 0 ? 'Paid' : 'Partially Paid',
            statusClass: updatedOutstanding === 0 ? 'success' : 'warning',
          }
        }
        return f
      }),
    }))
    showToast(`Payment of ${amountFormatted} verified! Receipt generated ✓`)
  }

  // Handle document upload
  const handleUploadDocSuccess = (newDoc) => {
    setDocuments((prev) => [{ id: Date.now(), ...newDoc }, ...prev])
    showToast(`Document "${newDoc.name}" uploaded successfully! ✓`)
  }

  // Handle profile update
  const handleUpdateProfile = (formData) => {
    setStudent((prev) => ({
      ...prev,
      fullName: formData.fullName || prev.fullName,
      phone: formData.phone || prev.phone,
      email: formData.email || prev.email,
      address: formData.address || prev.address,
      emergencyContact: {
        ...prev.emergencyContact,
        name: formData.emergencyName || prev.emergencyContact.name,
        phone: formData.emergencyPhone || prev.emergencyContact.phone,
        email: formData.emergencyEmail || prev.emergencyContact.email,
      },
    }))
  }

  return (
    <div className="student-portal-wrapper">
      {/* 1. Fixed Left Sidebar */}
      <StudentSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={onLogout}
      />

      {/* 2. Main Layout Area */}
      <div className="student-main-layout">
        {/* Top Header */}
        <StudentHeader
          activePage={activePage}
          setActivePage={setActivePage}
          student={student}
          notifications={notifications}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Main Page Content */}
        <main className="student-main-content">
          {(activePage === 'Overview' || activePage === 'Dashboard') && (
            <StudentDashboard
              student={student}
              courses={courses}
              todaySchedule={TODAY_SCHEDULE}
              upcomingAssignments={assignments}
              recentGrades={RECENT_GRADES}
              announcements={ANNOUNCEMENTS}
              financialData={financialData}
              onNavigate={(page) => setActivePage(page)}
              onOpenSubmitAssignment={() => setAssignmentForSubmission(assignments[0])}
              onOpenMakePayment={() => setIsPaymentModalOpen(true)}
              onOpenUploadDocument={() => setIsUploadDocModalOpen(true)}
            />
          )}

          {activePage === 'Profile' && (
            <StudentProfile
              student={student}
              onUpdateProfile={handleUpdateProfile}
              showToast={showToast}
            />
          )}

          {activePage === 'Classes' && (
            <StudentClasses
              courses={courses}
            />
          )}

          {activePage === 'Assignments' && (
            <StudentAssignments
              assignments={assignments}
              onOpenSubmitModal={(asg) => setAssignmentForSubmission(asg)}
            />
          )}

          {activePage === 'Grades' && (
            <StudentGrades
              courses={courses}
              student={student}
            />
          )}

          {activePage === 'Attendance' && (
            <StudentAttendance
              attendanceRecords={ATTENDANCE_RECORDS}
            />
          )}

          {activePage === 'Exams' && (
            <StudentExams
              exams={EXAMS_LIST}
              showToast={showToast}
            />
          )}

          {activePage === 'Timetable' && (
            <StudentTimetable
              timetableWeek={TIMETABLE_WEEK}
            />
          )}

          {activePage === 'Payments' && (
            <StudentPayments
              financialData={financialData}
              onOpenMakePayment={() => setIsPaymentModalOpen(true)}
              showToast={showToast}
            />
          )}

          {activePage === 'Documents' && (
            <StudentDocuments
              documents={documents}
              onOpenUploadModal={() => setIsUploadDocModalOpen(true)}
              showToast={showToast}
            />
          )}

          {activePage === 'Messages' && (
            <StudentMessages
              initialConversations={CONVERSATIONS}
            />
          )}

          {activePage === 'AIAssistant' && (
            <StudentAIAssistant
              student={student}
              showToast={showToast}
            />
          )}

          {activePage === 'Notifications' && (
            <StudentNotifications
              notifications={notifications}
              showToast={showToast}
            />
          )}

          {activePage === 'Settings' && (
            <StudentSettings
              student={student}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* 3. Global Interactive Modals */}
      {assignmentForSubmission && (
        <SubmitAssignmentModal
          assignment={assignmentForSubmission}
          onClose={() => setAssignmentForSubmission(null)}
          onSubmitSuccess={handleAssignmentSubmitSuccess}
        />
      )}

      {isPaymentModalOpen && (
        <MakePaymentModal
          financialData={financialData}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {isUploadDocModalOpen && (
        <UploadDocumentModal
          onClose={() => setIsUploadDocModalOpen(false)}
          onUploadSuccess={handleUploadDocSuccess}
        />
      )}

      {/* 4. Action Feedback Toast */}
      {toastMessage && (
        <div className="student-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
