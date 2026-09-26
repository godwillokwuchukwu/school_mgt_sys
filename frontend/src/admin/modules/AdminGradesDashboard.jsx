import React, { useState, useMemo } from 'react'

export default function AdminGradesDashboard({ students = [] }) {
  const [academicYear, setAcademicYear] = useState('2025/2026')
  const [term, setTerm] = useState('1st Term')
  const [selectedClass, setSelectedClass] = useState('JSS 2A')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState([])
  const [isLocked, setIsLocked] = useState(false)
  const [enterGradeModalOpen, setEnterGradeModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Default dataset matching high-fidelity student records
  const [resultsData, setResultsData] = useState([
    { id: 1, name: 'Daniel Anderson', student_id: 'RS-0001', class: 'JSS 2A', ca1: 18, ca2: 17, test: 17, exam: 35, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Chioma Okafor', student_id: 'RS-0002', class: 'JSS 2A', ca1: 16, ca2: 16, test: 18, exam: 34, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Michael Brown', student_id: 'RS-0003', class: 'JSS 2A', ca1: 15, ca2: 16, test: 15, exam: 33, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Aisha Mohammed', student_id: 'RS-0004', class: 'JSS 2A', ca1: 14, ca2: 15, test: 14, exam: 31, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 5, name: 'David Johnson', student_id: 'RS-0005', class: 'JSS 2A', ca1: 13, ca2: 14, test: 12, exam: 24, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 6, name: 'Amaka Nwosu', student_id: 'RS-0006', class: 'JSS 2A', ca1: 17, ca2: 18, test: 16, exam: 36, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { id: 7, name: 'Tunde Bello', student_id: 'RS-0007', class: 'JSS 2A', ca1: 15, ca2: 14, test: 15, exam: 28, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 8, name: 'Bisola Adebayo', student_id: 'RS-0008', class: 'JSS 2A', ca1: 12, ca2: 13, test: 11, exam: 22, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 9, name: 'Emeka Uche', student_id: 'RS-0009', class: 'JSS 2A', ca1: 19, ca2: 18, test: 18, exam: 37, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 10, name: 'Blessing Udo', student_id: 'RS-0010', class: 'JSS 2A', ca1: 16, ca2: 15, test: 16, exam: 31, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ])

  const [newGradeEntry, setNewGradeEntry] = useState({
    studentId: '',
    studentName: '',
    class: 'JSS 2A',
    ca1: 15,
    ca2: 15,
    test: 15,
    exam: 30,
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculate Totals, Grades, Positions
  const processedResults = useMemo(() => {
    const withTotals = resultsData.map((r) => {
      const total = Number(r.ca1 || 0) + Number(r.ca2 || 0) + Number(r.test || 0) + Number(r.exam || 0)
      let grade = 'F'
      if (total >= 75) grade = 'A'
      else if (total >= 65) grade = 'B'
      else if (total >= 50) grade = 'C'
      else if (total >= 40) grade = 'D'
      return { ...r, total, grade }
    })

    const sorted = [...withTotals].sort((a, b) => b.total - a.total)
    return sorted.map((item, index) => ({
      ...item,
      position: index + 1,
    }))
  }, [resultsData])

  // Filter results
  const filteredResults = useMemo(() => {
    return processedResults.filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.student_id && r.student_id.toLowerCase().includes(search.toLowerCase()))
      const matchClass = selectedClass === 'All Classes' || r.class === selectedClass
      return matchSearch && matchClass
    })
  }, [processedResults, search, selectedClass])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize))
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredResults.slice(start, start + pageSize)
  }, [filteredResults, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedRows.length && paginatedRows.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedRows.map((r) => r.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleAddGrade = async (e) => {
    e.preventDefault()
    const student = (students || []).find((s) => s.id === Number(newGradeEntry.studentId)) || {
      id: Date.now(),
      name: newGradeEntry.studentName.trim() || `Student ${resultsData.length + 1}`,
      student_id: `RS-${String(resultsData.length + 1).padStart(4, '0')}`,
      class: newGradeEntry.class || selectedClass,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    }

    const updatedList = [
      ...resultsData,
      {
        id: student.id,
        name: student.name,
        student_id: student.student_id || `RS-00${resultsData.length + 1}`,
        class: student.class || selectedClass,
        ca1: Number(newGradeEntry.ca1),
        ca2: Number(newGradeEntry.ca2),
        test: Number(newGradeEntry.test),
        exam: Number(newGradeEntry.exam),
        avatar: student.avatar,
      },
    ]
    setResultsData(updatedList)
    setEnterGradeModalOpen(false)

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grades.recorded',
          model_name: 'Gradebook',
          object_id: student.student_id,
          description: `Recorded continuous assessment & exam grades for ${student.name} (${student.class}) in ${selectedSubject}.`,
        }),
      })
    } catch {}

    window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    showToast(`Grade recorded for ${student.name}!`)
    setNewGradeEntry({
      studentId: '',
      studentName: '',
      class: 'JSS 2A',
      ca1: 15,
      ca2: 15,
      test: 15,
      exam: 30,
    })
  }

  const exportResultsCSV = () => {
    const headers = ['Position,Student,Student ID,Class,CA 1 (20),CA 2 (20),Test (20),Exam (40),Total (100),Grade\n']
    const rows = filteredResults.map((r) =>
      `"${r.position}","${r.name}","${r.student_id || ''}","${r.class}","${r.ca1}","${r.ca2}","${r.test}","${r.exam}","${r.total}","${r.grade}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Academic_Results_${selectedClass}_${selectedSubject}_${term}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // KPIs
  const classAvg = useMemo(() => {
    if (processedResults.length === 0) return 0
    const sum = processedResults.reduce((acc, r) => acc + r.total, 0)
    return (sum / processedResults.length).toFixed(1)
  }, [processedResults])

  const passRate = useMemo(() => {
    if (processedResults.length === 0) return 0
    const passes = processedResults.filter((r) => r.total >= 50).length
    return Math.round((passes / processedResults.length) * 100)
  }, [processedResults])

  const highestScore = useMemo(() => {
    if (processedResults.length === 0) return 0
    return Math.max(...processedResults.map((r) => r.total))
  }, [processedResults])

  const startEntry = filteredResults.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredResults.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Grades</h1>
          <p className="admin-page-subtitle">
            Manage student continuous assessments, term examinations, class rankings, and academic scorecards.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={exportResultsCSV}>
            <span>Export Scores</span>
          </button>

          <button
            className="admin-btn-outline"
            style={{ color: isLocked ? '#b45309' : '#0f172a' }}
            onClick={() => {
              const nextLocked = !isLocked
              setIsLocked(nextLocked)
              try {
                fetch('/api/core/admin/log-activity/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: nextLocked ? 'grades.locked' : 'grades.unlocked',
                    model_name: 'Gradebook',
                    object_id: `${selectedClass}-${selectedSubject}`,
                    description: `${nextLocked ? 'Locked and certified' : 'Unlocked'} gradebook for ${selectedClass} (${selectedSubject}).`,
                  }),
                })
              } catch {}
              window.dispatchEvent(new CustomEvent('admin-refresh-data'))
              showToast(nextLocked ? 'Gradebook locked and certified!' : 'Gradebook unlocked for editing.')
            }}
          >
            <span>{isLocked ? 'Unlock Results' : 'Lock Gradebook'}</span>
          </button>

          <button
            className="admin-btn-primary"
            onClick={() => setEnterGradeModalOpen(true)}
            disabled={isLocked}
          >
            <span>+ Enter Grades</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
          <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#065f46', fontSize: 14 }} onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* 2. 4-KPI Grid (Matching Gold Standard) */}
      <div className="admin-4kpi-grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Class Average</span>
          </div>
          <div className="admin-kpi-number">{classAvg}%</div>
          <div className="admin-kpi-trend up">
            <span>↑ 3.2%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs previous term</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Pass Rate</span>
          </div>
          <div className="admin-kpi-number">{passRate}%</div>
          <div className="admin-kpi-trend up">
            <span>Target: 90%</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>achieved</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Top Subject Score</span>
          </div>
          <div className="admin-kpi-number">{highestScore} / 100</div>
          <div className="admin-kpi-trend up">
            <span>Grade A</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>valedictorian score</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Graded Roster</span>
          </div>
          <div className="admin-kpi-number">{processedResults.length}</div>
          <div className="admin-kpi-trend neutral">
            <span>{isLocked ? '🔒 Locked' : '✏ Open'}</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>status</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Row (Matching Students & Teachers) */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by student name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="All Classes">Class: All Classes</option>
          <option value="JSS 2A">JSS 2A</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>

        <select className="admin-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="Mathematics">Subject: Mathematics</option>
          <option value="English Language">Subject: English Language</option>
          <option value="Physics">Subject: Physics</option>
          <option value="Chemistry">Subject: Chemistry</option>
          <option value="Biology">Subject: Biology</option>
        </select>

        <select className="admin-select" value={term} onChange={(e) => setTerm(e.target.value)}>
          <option value="1st Term">Term: 1st Term</option>
          <option value="2nd Term">Term: 2nd Term</option>
          <option value="3rd Term">Term: 3rd Term</option>
        </select>

        <select className="admin-select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
          <option value="2025/2026">Year: 2025/2026</option>
          <option value="2024/2025">Year: 2024/2025</option>
        </select>
      </div>

      {/* 4. Table Panel (Matching Gold Standard) */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedIds.length === paginatedRows.length && paginatedRows.length > 0}
                onChange={handleSelectAll}
              />
              <span>Bulk actions ▼</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 6px', fontSize: 12 }}
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#64748b' }}>
            Grading Scale: <strong>A</strong> (75–100) • <strong>B</strong> (65–74) • <strong>C</strong> (50–64) • <strong>D</strong> (40–49) • <strong>F</strong> (&lt;40)
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedRows.length && paginatedRows.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 40 }}>#</th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class</th>
                <th style={{ textAlign: 'center' }}>CA 1 (20)</th>
                <th style={{ textAlign: 'center' }}>CA 2 (20)</th>
                <th style={{ textAlign: 'center' }}>Test (20)</th>
                <th style={{ textAlign: 'center' }}>Exam (40)</th>
                <th style={{ textAlign: 'center' }}>Total (100)</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center' }}>Position</th>
                <th style={{ textAlign: 'right', width: 40 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                    <strong>No student scores match your search or filter</strong>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r, idx) => {
                  const isSelected = selectedIds.includes(r.id)
                  const isJSS = (r.class || '').startsWith('JSS')
                  const displayNum = (currentPage - 1) * pageSize + idx + 1
                  return (
                    <tr
                      key={r.id}
                      style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(r.id)}
                        />
                      </td>
                      <td style={{ color: '#64748b' }}>{displayNum}</td>
                      <td>
                        <div className="admin-table-user-cell">
                          <img src={r.avatar} alt={r.name} className="admin-table-avatar" />
                          <div>
                            <div className="admin-table-name">{r.name}</div>
                            <div className="admin-table-sub">{r.student_id || `RS-000${r.id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#475569' }}>{r.student_id}</td>
                      <td>
                        <span className={`admin-pill ${isJSS ? 'class-jss' : 'class-ss'}`}>
                          {r.class}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>{r.ca1}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>{r.ca2}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>{r.test}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>{r.exam}</td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: '#09261d', fontSize: 13 }}>
                        {r.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`admin-pill ${
                            r.grade === 'A'
                              ? 'paid'
                              : r.grade === 'B'
                              ? 'class-ss'
                              : r.grade === 'C'
                              ? 'class-jss'
                              : r.grade === 'D'
                              ? 'partial'
                              : 'pending'
                          }`}
                        >
                          Grade {r.grade}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#475569' }}>
                        #{r.position}
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 16, color: '#94a3b8' }}
                          onClick={() => showToast(`Report card prepared for ${r.name}!`)}
                        >
                          ⋮
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
          <div>Showing {startEntry} to {endEntry} of {filteredResults.length} student scores</div>
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
                  style={{
                    padding: '4px 9px',
                    fontSize: 11.5,
                    fontWeight: isActive ? 800 : 500,
                    borderRadius: 6,
                    background: isActive ? '#09261d' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    border: isActive ? '1px solid #09261d' : '1px solid #e2e8f0',
                    cursor: 'pointer',
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

      {/* Modal: Enter Grades */}
      {enterGradeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              Enter Academic Grades
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Record continuous assessment, mid-term tests, and examination scores for {selectedSubject} ({selectedClass}).
            </p>

            <form onSubmit={handleAddGrade}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Okafor"
                  value={newGradeEntry.studentName}
                  onChange={(e) => setNewGradeEntry({ ...newGradeEntry, studentName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    CA 1 (Max 20)
                  </label>
                  <input
                    type="number"
                    max="20"
                    min="0"
                    value={newGradeEntry.ca1}
                    onChange={(e) => setNewGradeEntry({ ...newGradeEntry, ca1: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    CA 2 (Max 20)
                  </label>
                  <input
                    type="number"
                    max="20"
                    min="0"
                    value={newGradeEntry.ca2}
                    onChange={(e) => setNewGradeEntry({ ...newGradeEntry, ca2: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Test (Max 20)
                  </label>
                  <input
                    type="number"
                    max="20"
                    min="0"
                    value={newGradeEntry.test}
                    onChange={(e) => setNewGradeEntry({ ...newGradeEntry, test: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Exam (Max 40)
                  </label>
                  <input
                    type="number"
                    max="40"
                    min="0"
                    value={newGradeEntry.exam}
                    onChange={(e) => setNewGradeEntry({ ...newGradeEntry, exam: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setEnterGradeModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
