import React, { useState, useMemo } from 'react'

export function AdminStudents({
  students,
  onSelectStudent,
  onAddStudent,
  isAddModalOpen,
  setIsAddModalOpen,
}) {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All Classes')
  const [genderFilter, setGenderFilter] = useState('All Genders')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [yearFilter, setYearFilter] = useState('2024/2025')
  const [selectedIds, setSelectedIds] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Add Student Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const isModalOpen = isAddModalOpen || showAddModal
  const setModalOpen = (val) => {
    setShowAddModal(val)
    if (setIsAddModalOpen) setIsAddModalOpen(val)
  }

  const [newStudentForm, setNewStudentForm] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    class: 'JSS 1',
    gender: 'Male',
    dob: '2012-05-14',
    email: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: 'Father',
    guardianAddress: '',
    feeStatus: 'Paid',
    attendance: 100,
  })
  const [addLoading, setAddLoading] = useState(false)
  const [successToast, setSuccessToast] = useState('')

  // Default students matching media_1789920743370.png
  const defaultStudents = [
    {
      id: 1,
      num: 1,
      name: 'Chinedu Okafor',
      email: 'chinedu.okafor@school.ng',
      student_id: 'RS-0001',
      class: 'JSS 1',
      gender: 'Male',
      age: 12,
      guardian: {
        name: 'Mr. Okafor',
        phone: '0803 123 4567',
        relationship: 'Father',
        address: '12, Unity Street, Owerri, Imo State',
      },
      attendance: 96,
      fee_status: 'Paid',
      enrolled_on: '2024-09-02',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      num: 2,
      name: 'Amaka Nwosu',
      email: 'amaka.nwosu@school.ng',
      student_id: 'RS-0002',
      class: 'JSS 2',
      gender: 'Female',
      age: 13,
      guardian: {
        name: 'Mrs. Nwosu',
        phone: '0806 234 5678',
        relationship: 'Mother',
        address: '45, Palm Avenue, Victoria Island, Lagos',
      },
      attendance: 92,
      fee_status: 'Partial',
      enrolled_on: '2024-09-05',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      num: 3,
      name: 'Tunde Bello',
      email: 'tunde.bello@school.ng',
      student_id: 'RS-0003',
      class: 'SS 1',
      gender: 'Male',
      age: 15,
      guardian: {
        name: 'Mr. Bello',
        phone: '0703 987 6543',
        relationship: 'Father',
        address: '8, Commercial Road, Ikeja, Lagos',
      },
      attendance: 88,
      fee_status: 'Paid',
      enrolled_on: '2024-08-28',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      num: 4,
      name: 'Bisola Adebayo',
      email: 'bisola.adebayo@school.ng',
      student_id: 'RS-0004',
      class: 'JSS 3',
      gender: 'Female',
      age: 14,
      guardian: {
        name: 'Mrs. Adebayo',
        phone: '0809 876 5432',
        relationship: 'Mother',
        address: '19, Hilltop Estate, Abuja',
      },
      attendance: 100,
      fee_status: 'Paid',
      enrolled_on: '2024-09-01',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      num: 5,
      name: 'Emeka Uche',
      email: 'emeka.uche@school.ng',
      student_id: 'RS-0005',
      class: 'SS 2',
      gender: 'Male',
      age: 16,
      guardian: {
        name: 'Mr. Uche',
        phone: '0706 345 6789',
        relationship: 'Father',
        address: '22, Marina Road, Port Harcourt',
      },
      attendance: 76,
      fee_status: 'Pending',
      enrolled_on: '2024-09-03',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ]

  const [localStudents, setLocalStudents] = useState(() => (students && students.length > 0 ? students : defaultStudents))

  React.useEffect(() => {
    if (students && students.length > 0) {
      setLocalStudents(students)
    }
  }, [students])

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, classFilter, genderFilter, statusFilter, pageSize])

  const filteredStudents = useMemo(() => {
    return localStudents.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.student_id && s.student_id.toLowerCase().includes(search.toLowerCase())) ||
        (s.guardian?.name && s.guardian.name.toLowerCase().includes(search.toLowerCase()))

      const matchClass = classFilter === 'All Classes' || s.class === classFilter
      const matchGender = genderFilter === 'All Genders' || s.gender === genderFilter
      const matchStatus = statusFilter === 'All Statuses' || s.status === statusFilter

      return matchSearch && matchClass && matchGender && matchStatus
    })
  }, [localStudents, search, classFilter, genderFilter, statusFilter])

  // Pagination calculations
  const totalStudents = filteredStudents.length
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize))
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStudents.slice(start, start + pageSize)
  }, [filteredStudents, currentPage, pageSize])

  const startEntry = totalStudents === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalStudents)

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map((s) => s.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault()
    if (!newStudentForm.firstName.trim() || !newStudentForm.lastName.trim()) {
      alert('Please enter student first and last name')
      return
    }

    setAddLoading(true)
    const generatedId = newStudentForm.studentId.trim() || `RS-${String(localStudents.length + 1).padStart(4, '0')}`
    const fullName = `${newStudentForm.firstName.trim()} ${newStudentForm.lastName.trim()}`
    const studentEmail = newStudentForm.email.trim() || `${newStudentForm.firstName.toLowerCase()}.${newStudentForm.lastName.toLowerCase()}@school.ng`

    const newStudent = {
      id: Date.now(),
      num: localStudents.length + 1,
      name: fullName,
      email: studentEmail,
      student_id: generatedId,
      class: newStudentForm.class,
      gender: newStudentForm.gender,
      age: 12,
      guardian: {
        name: newStudentForm.guardianName || 'Guardian',
        phone: newStudentForm.guardianPhone || '0803 123 4567',
        relationship: newStudentForm.guardianRelationship || 'Parent',
        address: newStudentForm.guardianAddress || 'Riverside Academy Campus',
      },
      attendance: Number(newStudentForm.attendance) || 100,
      fee_status: newStudentForm.feeStatus,
      enrolled_on: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: newStudentForm.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    }

    // 1. Immediately add to local state
    setLocalStudents((prev) => [newStudent, ...prev])
    if (onAddStudent) onAddStudent(newStudent)

    try {
      await fetch('/api/students/students/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: newStudentForm.firstName.trim(),
          last_name: newStudentForm.lastName.trim(),
          admission_number: generatedId,
          dob: newStudentForm.dob,
          phone: newStudentForm.guardianPhone,
        }),
      })

      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'student.registered',
          model_name: 'Student',
          object_id: generatedId,
          description: `Student ${fullName} (${generatedId}) enrolled in cohort ${newStudentForm.class}.`,
        }),
      })
    } catch (err) {
      console.warn('API sync warning:', err)
    }

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))

    setAddLoading(false)
    setSuccessToast(`Student ${fullName} (${generatedId}) added successfully!`)
    setModalOpen(false)
    setNewStudentForm({
      firstName: '',
      lastName: '',
      studentId: '',
      class: 'JSS 1',
      gender: 'Male',
      dob: '2012-05-14',
      email: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelationship: 'Father',
      guardianAddress: '',
      feeStatus: 'Paid',
      attendance: 100,
    })
    setTimeout(() => setSuccessToast(''), 4000)
  }

  const exportCSV = () => {
    const headers = ['#,Student,Student ID,Class,Gender,Guardian,Phone,Attendance,Fee Status,Enrolled On,Status\n']
    const rows = filteredStudents.map((s) =>
      `"${s.num || s.id}","${s.name}","${s.student_id || ''}","${s.class}","${s.gender || ''}","${s.guardian?.name || ''}","${s.guardian?.phone || ''}","${s.attendance}%","${s.fee_status}","${s.enrolled_on}","${s.status}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Riverside_Students_2024_2025.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Students</h1>
          <p className="admin-page-subtitle">
            Manage student records, track attendance, fees and academic progress.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={() => alert('Import feature: CSV/Excel format')}>
            <span>Import</span>
          </button>

          <button className="admin-btn-outline" onClick={exportCSV}>
            <span>Export</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setModalOpen(true)}>
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span>
            <span>{successToast}</span>
          </div>
          <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#065f46', fontSize: 14 }} onClick={() => setSuccessToast('')}>✕</button>
        </div>
      )}

      {/* 2. Filter Bar */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, student ID, guardian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="All Classes">Class: All Classes</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>

        <select className="admin-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="All Genders">Gender: All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Statuses">Status: All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>

        <select className="admin-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="2024/2025">Academic Year: 2024/2025</option>
          <option value="2025/2026">Academic Year: 2025/2026</option>
        </select>
      </div>

      {/* 3. 4 KPI Cards (Dynamic from DB) */}
      <div className="admin-4kpi-grid">
        {/* Card 1: Total Students */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Total Students</span>
          </div>
          <div className="admin-kpi-number">{localStudents.length}</div>
          <div className="admin-kpi-trend up">
            <span>↑ 12%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last term</span>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Active Students</span>
          </div>
          <div className="admin-kpi-number">{localStudents.filter((s) => s.status === 'Active').length}</div>
          <div className="admin-kpi-trend up">
            <span>↑ 10%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last term</span>
          </div>
        </div>

        {/* Card 3: New This Term */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="admin-kpi-title">New This Term</span>
          </div>
          <div className="admin-kpi-number">
            {localStudents.filter((s) => (s.enrolled_on && (s.enrolled_on.includes('2024') || s.enrolled_on.includes('2026'))) || s.num <= 5).length}
          </div>
          <div className="admin-kpi-trend up">
            <span>↑ 5%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last term</span>
          </div>
        </div>

        {/* Card 4: Pending Admission */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Pending Admission</span>
          </div>
          <div className="admin-kpi-number">
            {localStudents.filter((s) => s.status === 'Pending').length}
          </div>
          <div className="admin-kpi-trend down">
            <span>● Review</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>in queue</span>
          </div>
        </div>
      </div>

      {/* 4. Table Panel (media_1789920743370.png) */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={handleSelectAll}
              />
              <span>Bulk actions ▼</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <button style={{ background: 'transparent', border: 0, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
            <span>☷ Columns</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 40 }}>#</th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Guardian</th>
                <th>Attendance</th>
                <th>Fee Status</th>
                <th>Enrolled On</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: 40 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s, idx) => {
                const isSelected = selectedIds.includes(s.id)
                const isJSS = (s.class || '').startsWith('JSS')
                const displayNum = s.num || (currentPage - 1) * pageSize + idx + 1
                return (
                  <tr
                    key={s.id}
                    style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                    onClick={() => onSelectStudent(s)}
                  >
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(s.id)}
                      />
                    </td>
                    <td style={{ color: '#64748b' }}>{displayNum}</td>
                    <td>
                      <div className="admin-table-user-cell">
                        <img src={s.avatar} alt={s.name} className="admin-table-avatar" />
                        <div>
                          <div className="admin-table-name">{s.name}</div>
                          <div className="admin-table-sub">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#475569' }}>{s.student_id}</td>
                    <td>
                      <span className={`admin-pill ${isJSS ? 'class-jss' : 'class-ss'}`}>
                        {s.class}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>
                      {s.gender === 'Male' ? '♂ Male' : '♀ Female'}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{s.guardian?.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.guardian?.phone}</div>
                    </td>
                    <td>
                      <div className="admin-progress-container">
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#15803d' }}>{s.attendance}%</span>
                        <div className="admin-progress-track">
                          <div className="admin-progress-val" style={{ width: `${s.attendance}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-pill ${s.fee_status === 'Paid' ? 'paid' : s.fee_status === 'Partial' ? 'partial' : 'pending'}`}>
                        {s.fee_status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{s.enrolled_on}</td>
                    <td>
                      <span className="admin-pill active">{s.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 16, color: '#94a3b8' }}
                        onClick={() => onSelectStudent(s)}
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
          <div>Showing {startEntry} to {endEntry} of {totalStudents} students</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              className="admin-btn-outline"
              style={{ padding: '4px 8px', fontSize: 11, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum
              return (
                <button
                  key={pageNum}
                  className={isActive ? 'admin-btn-primary' : 'admin-btn-outline'}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    minWidth: 28,
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 500,
                  }}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              className="admin-btn-outline"
              style={{ padding: '4px 8px', fontSize: 11, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</div>
                <h3 className="admin-modal-title">Add New Student</h3>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddStudentSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">First Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Chinedu"
                      value={newStudentForm.firstName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, firstName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Last Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Okafor"
                      value={newStudentForm.lastName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, lastName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Student ID</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder={`RS-${String(localStudents.length + 1).padStart(4, '0')}`}
                      value={newStudentForm.studentId}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, studentId: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Class *</label>
                    <select
                      className="admin-form-select"
                      value={newStudentForm.class}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, class: e.target.value })}
                    >
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3</option>
                      <option value="Grade 8B">Grade 8B</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Gender</label>
                    <select
                      className="admin-form-select"
                      value={newStudentForm.gender}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="admin-form-input"
                      value={newStudentForm.dob}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Guardian Full Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Mr. Jude Okafor"
                      value={newStudentForm.guardianName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Guardian Phone</label>
                    <input
                      type="tel"
                      className="admin-form-input"
                      placeholder="e.g. 0803 123 4567"
                      value={newStudentForm.guardianPhone}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianPhone: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Guardian Relationship</label>
                    <select
                      className="admin-form-select"
                      value={newStudentForm.guardianRelationship}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianRelationship: e.target.value })}
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Home Address</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 12, Unity Street, Owerri, Imo State"
                      value={newStudentForm.guardianAddress}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, guardianAddress: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Fee Status</label>
                    <select
                      className="admin-form-select"
                      value={newStudentForm.feeStatus}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, feeStatus: e.target.value })}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Partial">Partial</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Initial Attendance (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="admin-form-input"
                      value={newStudentForm.attendance}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, attendance: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
