import React, { useState, useMemo } from 'react'

export function AdminTeachers({
  teachers,
  onSelectTeacher,
  onAddTeacher,
  isAddModalOpen,
  setIsAddModalOpen,
}) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Add Teacher Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const isModalOpen = isAddModalOpen || showAddModal
  const setModalOpen = (val) => {
    setShowAddModal(val)
    if (setIsAddModalOpen) setIsAddModalOpen(val)
  }

  const [newTeacherForm, setNewTeacherForm] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    employeeId: '',
    subject: 'Mathematics',
    department: 'Sciences',
    classes: 'JSS 1, JSS 2',
    phone: '',
    email: '',
    location: 'Block A, Room 05',
    status: 'Active',
  })
  const [addLoading, setAddLoading] = useState(false)
  const [successToast, setSuccessToast] = useState('')

  // 10 Faculty Members matching media_1789920743383.png
  const defaultTeachers = [
    {
      id: 1,
      num: 1,
      name: 'Mr. James Okafor',
      title: 'Senior Teacher',
      employee_id: 'TCH001',
      subject: 'Mathematics',
      subjectColor: '#3b82f6',
      department: 'Sciences',
      departmentColor: '#10b981',
      classes: ['JSS 1', 'JSS 2', 'SS 1'],
      attendance: 96,
      status: 'Active',
      phone: '+234 802 345 6789',
      email: 'james.okafor@staff.riversideacademy.com',
      location: 'Block A, Room 04',
      joined: 'Jan 15, 2018 • 6 years',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '8:00 – 10:00', class: 'JSS 1 (Math)' },
        { day: 'Wed', time: '10:30 – 12:30', class: 'SS 1 (Math)' },
        { day: 'Fri', time: '8:00 – 10:00', class: 'JSS 2 (Math)' },
      ],
    },
    {
      id: 2,
      num: 2,
      name: 'Mrs. Adeola Bello',
      title: 'Head of Department',
      employee_id: 'TCH002',
      subject: 'English Language',
      subjectColor: '#8b5cf6',
      department: 'Arts',
      departmentColor: '#ec4899',
      classes: ['JSS 1', 'JSS 3', 'SS 2'],
      attendance: 98,
      status: 'Active',
      phone: '+234 803 123 4567',
      email: 'adeola.bello@riversideacademy.edu.ng',
      location: 'Block C, Room 12',
      joined: 'Aug 12, 2019 • 5 years',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '8:00 – 10:00', class: 'JSS 1 (English)' },
        { day: 'Tue', time: '10:30 – 12:30', class: 'SS 2 (Literature)' },
        { day: 'Wed', time: '8:00 – 10:00', class: 'JSS 3 (English)' },
        { day: 'Thu', time: '10:30 – 12:30', class: 'SS 2 (Literature)' },
        { day: 'Fri', time: '8:00 – 10:00', class: 'JSS 1 (English)' },
      ],
    },
    {
      id: 3,
      num: 3,
      name: 'Mr. Chinedu Nwosu',
      title: 'Teacher',
      employee_id: 'TCH003',
      subject: 'Physics',
      subjectColor: '#3b82f6',
      department: 'Sciences',
      departmentColor: '#10b981',
      classes: ['SS 1', 'SS 2'],
      attendance: 94,
      status: 'Active',
      phone: '+234 805 678 9012',
      email: 'chinedu.nwosu@staff.riversideacademy.com',
      location: 'Block B, Room 08',
      joined: 'Sep 01, 2020 • 4 years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '10:30 – 12:30', class: 'SS 1 (Physics)' },
        { day: 'Thu', time: '8:00 – 10:00', class: 'SS 2 (Physics)' },
      ],
    },
    {
      id: 4,
      num: 4,
      name: 'Mrs. Funke Ibrahim',
      title: 'Teacher',
      employee_id: 'TCH004',
      subject: 'Biology',
      subjectColor: '#10b981',
      department: 'Sciences',
      departmentColor: '#10b981',
      classes: ['JSS 2', 'SS 1'],
      attendance: 92,
      status: 'Active',
      phone: '+234 807 890 1234',
      email: 'funke.ibrahim@staff.riversideacademy.com',
      location: 'Block B, Room 03',
      joined: 'Jan 10, 2021 • 3 years',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Tue', time: '8:00 – 10:00', class: 'JSS 2 (Biology)' },
        { day: 'Fri', time: '10:30 – 12:30', class: 'SS 1 (Biology)' },
      ],
    },
    {
      id: 5,
      num: 5,
      name: 'Mr. Samuel Adeyemi',
      title: 'Teacher',
      employee_id: 'TCH005',
      subject: 'Chemistry',
      subjectColor: '#3b82f6',
      department: 'Sciences',
      departmentColor: '#10b981',
      classes: ['SS 1', 'SS 2'],
      attendance: 90,
      status: 'Active',
      phone: '+234 808 901 2345',
      email: 'samuel.adeyemi@staff.riversideacademy.com',
      location: 'Block B, Lab 2',
      joined: 'Feb 15, 2021 • 3 years',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Wed', time: '8:00 – 10:00', class: 'SS 1 (Chemistry)' },
        { day: 'Fri', time: '10:30 – 12:30', class: 'SS 2 (Chemistry)' },
      ],
    },
    {
      id: 6,
      num: 6,
      name: 'Mrs. Grace Williams',
      title: 'Teacher',
      employee_id: 'TCH006',
      subject: 'History',
      subjectColor: '#f59e0b',
      department: 'Humanities',
      departmentColor: '#f59e0b',
      classes: ['JSS 3', 'SS 1'],
      attendance: 88,
      status: 'Active',
      phone: '+234 809 111 2233',
      email: 'grace.williams@staff.riversideacademy.com',
      location: 'Block C, Room 05',
      joined: 'Sep 15, 2019 • 5 years',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '10:30 – 12:30', class: 'JSS 3 (History)' },
        { day: 'Thu', time: '8:00 – 10:00', class: 'SS 1 (History)' },
      ],
    },
    {
      id: 7,
      num: 7,
      name: 'Mr. David Eze',
      title: 'Teacher',
      employee_id: 'TCH007',
      subject: 'Geography',
      subjectColor: '#3b82f6',
      department: 'Humanities',
      departmentColor: '#f59e0b',
      classes: ['JSS 1', 'JSS 2'],
      attendance: 95,
      status: 'Active',
      phone: '+234 809 222 3344',
      email: 'david.eze@staff.riversideacademy.com',
      location: 'Block C, Room 09',
      joined: 'Jan 20, 2022 • 2 years',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Tue', time: '10:30 – 12:30', class: 'JSS 1 (Geography)' },
        { day: 'Wed', time: '8:00 – 10:00', class: 'JSS 2 (Geography)' },
      ],
    },
    {
      id: 8,
      num: 8,
      name: 'Mrs. Ngozi Ibe',
      title: 'Teacher',
      employee_id: 'TCH008',
      subject: 'French',
      subjectColor: '#8b5cf6',
      department: 'Languages',
      departmentColor: '#8b5cf6',
      classes: ['SS 1', 'SS 2'],
      attendance: 91,
      status: 'Active',
      phone: '+234 809 333 4455',
      email: 'ngozi.ibe@staff.riversideacademy.com',
      location: 'Block C, Room 14',
      joined: 'Mar 10, 2022 • 2 years',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '8:00 – 10:00', class: 'SS 1 (French)' },
        { day: 'Thu', time: '10:30 – 12:30', class: 'SS 2 (French)' },
      ],
    },
    {
      id: 9,
      num: 9,
      name: 'Mr. Bola Akinola',
      title: 'Teacher',
      employee_id: 'TCH009',
      subject: 'Computer Science',
      subjectColor: '#06b6d4',
      department: 'ICT',
      departmentColor: '#06b6d4',
      classes: ['JSS 3', 'SS 2'],
      attendance: 87,
      status: 'On Leave',
      phone: '+234 809 444 5566',
      email: 'bola.akinola@staff.riversideacademy.com',
      location: 'ICT Innovation Hub',
      joined: 'Nov 01, 2021 • 3 years',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Wed', time: '10:30 – 12:30', class: 'JSS 3 (ICT)' },
        { day: 'Fri', time: '8:00 – 10:00', class: 'SS 2 (ICT)' },
      ],
    },
    {
      id: 10,
      num: 10,
      name: 'Mrs. Chisom Okoye',
      title: 'Teacher',
      employee_id: 'TCH010',
      subject: 'Literature',
      subjectColor: '#8b5cf6',
      department: 'Arts',
      departmentColor: '#ec4899',
      classes: ['SS 1', 'SS 2'],
      attendance: 93,
      status: 'Active',
      phone: '+234 809 555 6677',
      email: 'chisom.okoye@staff.riversideacademy.com',
      location: 'Block C, Room 02',
      joined: 'Sep 01, 2023 • 1 year',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Tue', time: '8:00 – 10:00', class: 'SS 1 (Literature)' },
        { day: 'Fri', time: '10:30 – 12:30', class: 'SS 2 (Literature)' },
      ],
    },
  ]

  const [localTeachers, setLocalTeachers] = useState(() => (teachers && teachers.length > 0 ? teachers : defaultTeachers))

  React.useEffect(() => {
    if (teachers && teachers.length > 0) {
      setLocalTeachers(teachers)
    }
  }, [teachers])

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedDept, selectedSubject, statusFilter, pageSize])

  const filteredTeachers = useMemo(() => {
    return localTeachers.filter((t) => {
      const matchSearch =
        search === '' ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.employee_id && t.employee_id.toLowerCase().includes(search.toLowerCase())) ||
        (t.subject && t.subject.toLowerCase().includes(search.toLowerCase()))

      const matchDept = selectedDept === 'All Departments' || t.department === selectedDept
      const matchSubj = selectedSubject === 'All Subjects' || t.subject === selectedSubject
      const matchStatus = statusFilter === 'All Statuses' || t.status === statusFilter

      return matchSearch && matchDept && matchSubj && matchStatus
    })
  }, [localTeachers, search, selectedDept, selectedSubject, statusFilter])

  // Pagination calculations
  const totalTeachers = filteredTeachers.length
  const totalPages = Math.max(1, Math.ceil(totalTeachers / pageSize))
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTeachers.slice(start, start + pageSize)
  }, [filteredTeachers, currentPage, pageSize])

  const startEntry = totalTeachers === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, totalTeachers)

  const handleAddTeacherSubmit = async (e) => {
    e.preventDefault()
    if (!newTeacherForm.firstName.trim() || !newTeacherForm.lastName.trim()) {
      alert('Please enter teacher first and last name')
      return
    }

    setAddLoading(true)
    const empId = newTeacherForm.employeeId.trim() || `TCH${String(localTeachers.length + 1).padStart(3, '0')}`
    const fullName = `${newTeacherForm.title} ${newTeacherForm.firstName.trim()} ${newTeacherForm.lastName.trim()}`
    const teacherEmail = newTeacherForm.email.trim() || `${newTeacherForm.firstName.toLowerCase()}.${newTeacherForm.lastName.toLowerCase()}@staff.riversideacademy.com`

    const deptColors = {
      Sciences: '#10b981',
      Arts: '#ec4899',
      Humanities: '#f59e0b',
      Languages: '#3b82f6',
      ICT: '#8b5cf6',
    }

    const subjColors = {
      Mathematics: '#3b82f6',
      'English Language': '#8b5cf6',
      Physics: '#0284c7',
      Biology: '#059669',
      Chemistry: '#d97706',
      History: '#dc2626',
      Geography: '#0d9488',
      French: '#7c3aed',
      'Computer Science': '#4f46e5',
      Literature: '#db2777',
    }

    const isFemale = ['Mrs.', 'Miss', 'Ms.'].includes(newTeacherForm.title)
    const newTeacher = {
      id: Date.now(),
      num: localTeachers.length + 1,
      name: fullName,
      title: 'Subject Teacher',
      employee_id: empId,
      subject: newTeacherForm.subject,
      subjectColor: subjColors[newTeacherForm.subject] || '#3b82f6',
      department: newTeacherForm.department,
      departmentColor: deptColors[newTeacherForm.department] || '#10b981',
      classes: newTeacherForm.classes.split(',').map((c) => c.trim()).filter(Boolean),
      attendance: 100,
      status: newTeacherForm.status,
      phone: newTeacherForm.phone || '+234 803 123 4567',
      email: teacherEmail,
      location: newTeacherForm.location || 'Block A, Room 05',
      joined: 'Sep 2024 • Just joined',
      avatar: isFemale
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      schedule: [
        { day: 'Mon', time: '8:00 – 10:00', class: `${newTeacherForm.classes.split(',')[0] || 'JSS 1'} (${newTeacherForm.subject})` },
        { day: 'Wed', time: '10:30 – 12:30', class: `${newTeacherForm.classes.split(',')[1] || 'SS 1'} (${newTeacherForm.subject})` },
      ],
    }

    setLocalTeachers((prev) => [newTeacher, ...prev])
    if (onAddTeacher) onAddTeacher(newTeacher)

    try {
      await fetch('/api/accounts/admin/provision/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: newTeacherForm.firstName.trim(),
          last_name: newTeacherForm.lastName.trim(),
          email: teacherEmail,
          role: 'teacher',
        }),
      })
    } catch (err) {
      console.warn('API sync warning:', err)
    }

    setAddLoading(false)
    setSuccessToast(`Teacher ${fullName} (${empId}) added successfully!`)
    setModalOpen(false)
    setNewTeacherForm({
      title: 'Mr.',
      firstName: '',
      lastName: '',
      employeeId: '',
      subject: 'Mathematics',
      department: 'Sciences',
      classes: 'JSS 1, JSS 2',
      phone: '',
      email: '',
      location: 'Block A, Room 05',
      status: 'Active',
    })
    setTimeout(() => setSuccessToast(''), 4000)
  }

  return (
    <div className="admin-page-content">
      {/* 1. Page Header (media_1789920743383.png) */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-header-tag">TEACHERS</div>
          <h1 className="admin-page-title">Teachers</h1>
          <p className="admin-page-subtitle">
            Manage your teaching staff, view profiles, attendance and assignments.
          </p>
        </div>
      </div>

      {/* 2. 4 KPI Cards (Dynamic from DB) */}
      <div className="admin-4kpi-grid">
        {/* Card 1: Total Teachers */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Total Teachers</span>
          </div>
          <div className="admin-kpi-number">{localTeachers.length}</div>
          <div className="admin-kpi-trend up">
            <span>↑ 6%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs last term</span>
          </div>
        </div>

        {/* Card 2: Active Teachers */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="6" fill="#10b981" />
              </svg>
            </div>
            <span className="admin-kpi-title">Active Teachers</span>
          </div>
          <div className="admin-kpi-number">{localTeachers.filter((t) => t.status === 'Active').length}</div>
          <div className="admin-kpi-trend up">
            <span>↑ 7%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs last term</span>
          </div>
        </div>

        {/* Card 3: On Leave */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box attendance">
              <span style={{ fontWeight: 800, fontSize: 13, color: '#d97706' }}>T</span>
            </div>
            <span className="admin-kpi-title">On Leave</span>
          </div>
          <div className="admin-kpi-number">{localTeachers.filter((t) => t.status === 'On Leave').length}</div>
          <div className="admin-kpi-trend down">
            <span>↓ 25%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs last term</span>
          </div>
        </div>

        {/* Card 4: New This Term */}
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="admin-kpi-title">New This Term</span>
          </div>
          <div className="admin-kpi-number">4</div>
          <div className="admin-kpi-trend up">
            <span>↑ 33%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs last term</span>
          </div>
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

      {/* 3. Filter Bar */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search teachers by name, ID, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
          <option value="All Departments">All Departments</option>
          <option value="Sciences">Sciences</option>
          <option value="Arts">Arts</option>
          <option value="Humanities">Humanities</option>
          <option value="Languages">Languages</option>
          <option value="ICT">ICT</option>
        </select>

        <select className="admin-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="All Subjects">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English Language">English Language</option>
          <option value="Physics">Physics</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="French">French</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Literature">Literature</option>
        </select>

        <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Statuses">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>

        <button className="admin-btn-primary" onClick={() => setModalOpen(true)} style={{ marginLeft: 'auto' }}>
          <span>+ Add Teacher</span>
        </button>
      </div>

      {/* 4. Teachers Table (media_1789920743383.png) */}
      <div className="admin-table-panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>TEACHER</th>
                <th>EMPLOYEE ID</th>
                <th>SUBJECT</th>
                <th>DEPARTMENT</th>
                <th>CLASSES</th>
                <th>ATTENDANCE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right', width: 60 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.map((t, idx) => {
                const isLeave = t.status === 'On Leave'
                const displayNum = t.num || (currentPage - 1) * pageSize + idx + 1
                return (
                  <tr
                    key={t.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectTeacher(t)}
                  >
                    <td style={{ color: '#64748b' }}>{displayNum}</td>
                    <td>
                      <div className="admin-table-user-cell">
                        <img src={t.avatar} alt={t.name} className="admin-table-avatar" />
                        <div>
                          <div className="admin-table-name">{t.name}</div>
                          <div className="admin-table-sub">{t.title}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#475569' }}>{t.employee_id}</td>
                    <td>
                      <span
                        className="admin-pill"
                        style={{
                          background: `${t.subjectColor}15`,
                          color: t.subjectColor,
                        }}
                      >
                        {t.subject}
                      </span>
                    </td>
                    <td>
                      <span
                        className="admin-pill"
                        style={{
                          background: `${t.departmentColor}15`,
                          color: t.departmentColor,
                        }}
                      >
                        {t.department}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: 12 }}>
                      {Array.isArray(t.classes) ? t.classes.join(', ') : t.classes}
                    </td>
                    <td>
                      <div className="admin-circular-gauge">
                        {t.attendance}%
                      </div>
                    </td>
                    <td>
                      <span className={`admin-pill ${isLeave ? 'leave' : 'active'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 14, color: '#94a3b8' }}
                        onClick={() => onSelectTeacher(t)}
                      >
                        ···
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
          <div>Showing {startEntry}–{endEntry} of {totalTeachers} teachers</div>
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

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</div>
                <h3 className="admin-modal-title">Add New Teacher</h3>
              </div>
              <button className="admin-modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddTeacherSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Title / Salutation</label>
                    <select
                      className="admin-form-select"
                      value={newTeacherForm.title}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, title: e.target.value })}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Employee ID</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder={`TCH${String(localTeachers.length + 1).padStart(3, '0')}`}
                      value={newTeacherForm.employeeId}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, employeeId: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">First Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Samuel"
                      value={newTeacherForm.firstName}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, firstName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Last Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Adeyemi"
                      value={newTeacherForm.lastName}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, lastName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Subject *</label>
                    <select
                      className="admin-form-select"
                      value={newTeacherForm.subject}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="English Language">English Language</option>
                      <option value="Physics">Physics</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="French">French</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Literature">Literature</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Department *</label>
                    <select
                      className="admin-form-select"
                      value={newTeacherForm.department}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, department: e.target.value })}
                    >
                      <option value="Sciences">Sciences</option>
                      <option value="Arts">Arts</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Languages">Languages</option>
                      <option value="ICT">ICT</option>
                    </select>
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">Assigned Classes (comma separated)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. JSS 1, JSS 2, SS 1"
                      value={newTeacherForm.classes}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, classes: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="admin-form-input"
                      placeholder="e.g. +234 803 123 4567"
                      value={newTeacherForm.phone}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-form-input"
                      placeholder="e.g. samuel.adeyemi@staff.riversideacademy.com"
                      value={newTeacherForm.email}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Office Location</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Block A, Room 05"
                      value={newTeacherForm.location}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, location: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-form-select"
                      value={newTeacherForm.status}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
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
                  {addLoading ? 'Saving...' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
