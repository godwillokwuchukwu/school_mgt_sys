import React, { useState, useEffect } from 'react'
import { api } from '../api'

// 1. PARENTS MODULE
export function AdminParents({ parents, onSelectParent, onMessage }) {
  const [search, setSearch] = useState('')
  const filtered = (parents || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  )

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div className="admin-table-title-group">
          <h3 className="admin-table-title">Parents & Guardians Directory</h3>
          <span className="admin-badge admin-badge-teal">{filtered.length} Registered</span>
        </div>
        <input
          type="text"
          className="admin-filter-input"
          placeholder="Search parents by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 280 }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Parent / Guardian</th>
              <th>Relationship</th>
              <th>Contact Details</th>
              <th>Linked Children</th>
              <th>Outstanding Fees</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} onClick={() => onSelectParent(p)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0e3d2f' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: PAR-{String(p.id).padStart(4, '0')}</div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-blue">{p.relationship}</span>
                </td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.phone}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.email}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(p.children || []).map((ch, idx) => (
                      <span key={idx} className="admin-badge admin-badge-teal">
                        {ch.name} ({ch.class})
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: p.outstanding_fees > 0 ? '#dc2626' : '#16a34a' }}>
                    ₦{(p.outstanding_fees || 0).toLocaleString()}
                  </span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-green">{p.status || 'Active'}</span>
                </td>
                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="admin-btn admin-btn-outline"
                    style={{ padding: '4px 8px', fontSize: 11 }}
                    onClick={() => onSelectParent(p)}
                  >
                    👁 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 2. STAFF MODULE
export function AdminStaff({ staff }) {
  const [deptFilter, setDeptFilter] = useState('All')
  const departments = ['All', 'Administrative', 'Finance', 'IT', 'Medical', 'Security', 'Maintenance']
  const filtered = (staff || []).filter((s) => deptFilter === 'All' || s.department === deptFilter)

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              border: '1px solid',
              borderColor: deptFilter === d ? '#0e3d2f' : '#e2e8f0',
              background: deptFilter === d ? '#0e3d2f' : '#ffffff',
              color: deptFilter === d ? '#ffffff' : '#64748b',
              cursor: 'pointer',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <h3 className="admin-table-title">Non-Teaching Staff Directory</h3>
          <span className="admin-badge admin-badge-teal">{filtered.length} Staff Members</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Department</th>
                <th>Position / Designation</th>
                <th>Employee ID</th>
                <th>Contact</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{s.name}</td>
                  <td>
                    <span className="admin-badge admin-badge-purple">{s.department}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.position}</td>
                  <td>{s.employee_id}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{s.phone}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{s.email}</div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-green">{s.attendance}%</span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-green">{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 3. CLASSES MODULE
export function AdminClasses({ classes, onSelectClass }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {(classes || []).map((c) => {
          const occ = Math.round((c.students_count / c.capacity) * 100)
          return (
            <div key={c.id} className="admin-chart-card" style={{ cursor: 'pointer' }} onClick={() => onSelectClass && onSelectClass(c)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0e3d2f', fontWeight: 800 }}>Class {c.name}</h3>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.room} • Code: {c.code}</div>
                </div>
                <span className="admin-badge admin-badge-teal">{c.attendance}% Att.</span>
              </div>

              <div style={{ margin: '14px 0' }}>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  Class Teacher: <strong>{c.class_teacher}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  Subjects: {c.subjects_count} subjects offered
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  <span>Capacity: {c.students_count} / {c.capacity}</span>
                  <span style={{ color: occ > 90 ? '#f59e0b' : '#10b981' }}>{occ}% filled</span>
                </div>
                <div className="admin-progress-bar">
                  <div className={`admin-progress-fill ${occ > 90 ? 'amber' : 'green'}`} style={{ width: `${occ}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 4. ADMISSIONS MODULE
export function AdminAdmissions({ candidates, onIssueLetter }) {
  const stages = ['Inquiry', 'Applied', 'Under Review', 'Interview', 'Accepted', 'Enrolled']

  return (
    <div>
      <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Applications</div>
          <div className="admin-kpi-val">{candidates ? candidates.length : 5}</div>
          <div className="admin-kpi-sub">2025/2026 Academic Session</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Under Review</div>
          <div className="admin-kpi-val">2</div>
          <div className="admin-kpi-sub">Awaiting decision</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Interview Scheduled</div>
          <div className="admin-kpi-val">1</div>
          <div className="admin-kpi-sub">Entrance exam passed</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Enrolled</div>
          <div className="admin-kpi-val">1</div>
          <div className="admin-kpi-sub">Fees cleared</div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <h3 className="admin-table-title">Admissions Pipeline & Applicants</h3>
          <span className="admin-badge admin-badge-teal">6-Stage Funnel</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>App No</th>
                <th>Candidate Name</th>
                <th>Applied Class</th>
                <th>Parent / Contact</th>
                <th>Entrance Score</th>
                <th>Stage</th>
                <th>Documents</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(candidates || []).map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{c.app_no}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{c.email}</div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-teal">{c.applied_class}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.parent_name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.parent_phone}</div>
                  </td>
                  <td>
                    <strong style={{ color: c.entrance_score >= 80 ? '#10b981' : '#f59e0b' }}>
                      {c.entrance_score}%
                    </strong>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-blue">{c.stage}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${c.documents_verified ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                      {c.documents_verified ? '✓ Verified' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '4px 10px', fontSize: 11 }}
                      onClick={() => onIssueLetter && onIssueLetter(c)}
                    >
                      📜 Issue Letter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 5. EMPLOYMENT / HR MODULE
export function AdminEmployment() {
  const jobs = [
    { id: 1, title: 'Senior Physics Teacher', dept: 'Sciences', type: 'Full-Time', applicants: 14, status: 'Active', deadline: '30 Sep 2025' },
    { id: 2, title: 'French & Modern Languages Tutor', dept: 'Arts', type: 'Full-Time', applicants: 8, status: 'Interviewing', deadline: '25 Sep 2025' },
    { id: 3, title: 'School Nurse / Health Officer', dept: 'Medical', type: 'Full-Time', applicants: 19, status: 'Active', deadline: '05 Oct 2025' },
  ]

  return (
    <div>
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div>
            <h3 className="admin-table-title">Staff Recruitment & Openings</h3>
            <p className="admin-chart-subtitle">Manage vacancies, candidate screening, and hiring pipelines</p>
          </div>
          <button className="admin-btn admin-btn-primary">+ Post New Opening</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Employment Type</th>
                <th>Applicants</th>
                <th>Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{j.title}</td>
                  <td><span className="admin-badge admin-badge-blue">{j.dept}</span></td>
                  <td>{j.type}</td>
                  <td><strong>{j.applicants} candidates</strong></td>
                  <td>{j.deadline}</td>
                  <td><span className="admin-badge admin-badge-green">{j.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}>
                      Review Candidates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 6. ATTENDANCE MODULE
export function AdminAttendance({ students }) {
  const [selectedClass, setSelectedClass] = useState('JSS 1')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceMap, setAttendanceMap] = useState({})

  const toggleStatus = (id, status) => {
    setAttendanceMap({ ...attendanceMap, [id]: status })
  }

  const markAllPresent = () => {
    const next = {}
    ;(students || []).forEach((s) => {
      next[s.id] = 'Present'
    })
    setAttendanceMap(next)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="date"
          className="admin-filter-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="admin-filter-select"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>
        <button className="admin-btn admin-btn-secondary" onClick={markAllPresent}>
          ✓ Mark All Present
        </button>
        <button className="admin-btn admin-btn-primary" onClick={() => alert('Attendance saved successfully!')}>
          💾 Save & Submit Register
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <h3 className="admin-table-title">Daily Roll Call — {selectedClass}</h3>
          <span className="admin-badge admin-badge-teal">{date}</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Status Today</th>
              <th style={{ textAlign: 'right' }}>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {(students || []).map((s) => {
              const currentStatus = attendanceMap[s.id] || 'Present'
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{s.name}</td>
                  <td>{s.student_id || `RS-000${s.id}`}</td>
                  <td>
                    <span className={`admin-badge ${currentStatus === 'Present' ? 'admin-badge-green' : currentStatus === 'Late' ? 'admin-badge-amber' : 'admin-badge-red'}`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      {['Present', 'Late', 'Absent'].map((st) => (
                        <button
                          key={st}
                          className={`admin-btn ${currentStatus === st ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => toggleStatus(s.id, st)}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 7. GRADES MODULE
export function AdminGrades({ students }) {
  const [cls, setCls] = useState('JSS 1')
  const [subject, setSubject] = useState('Mathematics')

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <h3 className="admin-table-title">Grade Sheet & Broad Sheet</h3>
          <select className="admin-filter-select" value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="SS 1">SS 1</option>
          </select>
          <select className="admin-filter-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="Mathematics">Mathematics</option>
            <option value="English Language">English Language</option>
            <option value="Basic Science">Basic Science</option>
          </select>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => alert('Broadsheet published!')}>
          📢 Publish Term Grades
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>CA 1 (20)</th>
            <th>CA 2 (20)</th>
            <th>Exam (60)</th>
            <th>Total (100)</th>
            <th>Grade</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {(students || []).map((s, idx) => {
            const ca1 = 16 + (idx % 4)
            const ca2 = 17 + (idx % 3)
            const exam = 48 + (idx % 10)
            const total = ca1 + ca2 + exam
            const grade = total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D'

            return (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{s.name}</td>
                <td>{ca1}</td>
                <td>{ca2}</td>
                <td>{exam}</td>
                <td><strong>{total}%</strong></td>
                <td>
                  <span className={`admin-badge ${grade === 'A' ? 'admin-badge-green' : 'admin-badge-blue'}`}>
                    Grade {grade}
                  </span>
                </td>
                <td style={{ color: '#64748b' }}>{grade === 'A' ? 'Excellent' : 'Very Good'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// 8. FEES & FINANCE MODULE
export function AdminFees({ invoices = [] }) {
  const [localInvoices, setLocalInvoices] = useState(invoices || [])
  const [activeTab, setActiveTab] = useState('All') // 'All' | 'Admission' | 'Enrolled'
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Invoice Form State
  const [selectedAppId, setSelectedAppId] = useState('')
  const [classCategory, setClassCategory] = useState('JSS')
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })
  const [notes, setNotes] = useState('Payment is required within 14 days to confirm enrollment and reserve student placement.')

  // Itemized fee items: array of { id, title, amount }
  const [feeItems, setFeeItems] = useState([
    { id: 1, title: 'School Tuition Fees', amount: 120000 },
    { id: 2, title: 'Development Levy', amount: 15000 },
    { id: 3, title: 'ICT & Computer Lab Fee', amount: 10000 },
    { id: 4, title: 'School Uniform & Textbooks', amount: 25000 },
    { id: 5, title: 'Registration & ID Card', amount: 5000 },
  ])

  // Fee Presets by Class / Level
  const applyPreset = (category) => {
    setClassCategory(category)
    if (category === 'Creche' || category === 'Nursery') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 80000 },
        { id: 2, title: 'Development Levy', amount: 10000 },
        { id: 3, title: 'Learning Materials & Toys', amount: 15000 },
        { id: 4, title: 'Registration & ID Card', amount: 5000 },
      ])
    } else if (category === 'Primary') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 100000 },
        { id: 2, title: 'Development Levy', amount: 15000 },
        { id: 3, title: 'ICT & Basic Science Lab', amount: 10000 },
        { id: 4, title: 'Uniform & Exercise Books', amount: 20000 },
        { id: 5, title: 'Registration & ID Card', amount: 5000 },
      ])
    } else if (category === 'JSS') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 120000 },
        { id: 2, title: 'Development Levy', amount: 15000 },
        { id: 3, title: 'ICT & Science Lab Fee', amount: 10000 },
        { id: 4, title: 'School Uniform & Textbooks', amount: 25000 },
        { id: 5, title: 'Registration & ID Card', amount: 5000 },
      ])
    } else if (category === 'SS Science') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 140000 },
        { id: 2, title: 'Development Levy', amount: 20000 },
        { id: 3, title: 'Physics/Chem/Bio Science Lab', amount: 20000 },
        { id: 4, title: 'School Uniform & Textbooks', amount: 25000 },
        { id: 5, title: 'Registration & ID Card', amount: 5000 },
      ])
    } else if (category === 'SS Arts') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 130000 },
        { id: 2, title: 'Development Levy', amount: 15000 },
        { id: 3, title: 'Fine Arts & Language Lab Fee', amount: 10000 },
        { id: 4, title: 'School Uniform & Textbooks', amount: 25000 },
        { id: 5, title: 'Registration & ID Card', amount: 5000 },
      ])
    } else if (category === 'SS Commercial') {
      setFeeItems([
        { id: 1, title: 'School Tuition Fees', amount: 130000 },
        { id: 2, title: 'Development Levy', amount: 15000 },
        { id: 3, title: 'Accounting & ICT Lab Fee', amount: 10000 },
        { id: 4, title: 'School Uniform & Textbooks', amount: 25000 },
        { id: 5, title: 'Registration & ID Card', amount: 5000 },
      ])
    }
  }

  // Load admission applications when modal opens
  useEffect(() => {
    if (isInvoiceModalOpen) {
      setLoadingApps(true)
      api.admissionsApplications()
        .then((res) => {
          const list = res.results || res || []
          setApplications(list)
          const eligible = list.find((a) => a.status === 'submitted' || a.status === 'under_review' || a.status === 'approved') || list[0]
          if (eligible && !selectedAppId) {
            setSelectedAppId(eligible.id)
            const cName = eligible.class_applying_for || ''
            if (cName.includes('Nursery') || cName.includes('Creche')) applyPreset('Creche')
            else if (cName.includes('Primary') || cName.includes('Grade')) applyPreset('Primary')
            else if (cName.includes('SS') && cName.toLowerCase().includes('sci')) applyPreset('SS Science')
            else if (cName.includes('SS') && cName.toLowerCase().includes('art')) applyPreset('SS Arts')
            else if (cName.includes('SS')) applyPreset('SS Commercial')
            else applyPreset('JSS')
          }
        })
        .catch(() => {})
        .finally(() => setLoadingApps(false))
    }
  }, [isInvoiceModalOpen])

  const handleSelectApp = (appId) => {
    setSelectedAppId(appId)
    const app = applications.find((a) => String(a.id) === String(appId))
    if (app) {
      const cName = app.class_applying_for || ''
      if (cName.includes('Nursery') || cName.includes('Creche')) applyPreset('Creche')
      else if (cName.includes('Primary') || cName.includes('Grade')) applyPreset('Primary')
      else if (cName.includes('SS') && cName.toLowerCase().includes('sci')) applyPreset('SS Science')
      else if (cName.includes('SS') && cName.toLowerCase().includes('art')) applyPreset('SS Arts')
      else if (cName.includes('SS')) applyPreset('SS Commercial')
      else applyPreset('JSS')
    }
  }

  const totalAmount = feeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  const updateFeeItem = (id, field, value) => {
    setFeeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item))
    )
  }

  const addFeeItem = () => {
    setFeeItems((prev) => [...prev, { id: Date.now(), title: 'Additional Fee', amount: 5000 }])
  }

  const removeFeeItem = (id) => {
    setFeeItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleGenerateInvoice = async (e) => {
    e.preventDefault()
    if (!selectedAppId) {
      setErrorMsg('Please select an applicant to generate an invoice for.')
      return
    }
    const app = applications.find((a) => String(a.id) === String(selectedAppId))
    if (!app) {
      setErrorMsg('Applicant record not found.')
      return
    }
    if (totalAmount <= 0) {
      setErrorMsg('Total invoice amount must be greater than ₦0.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const breakdownMap = {}
    feeItems.forEach((item) => {
      if (item.title && item.amount > 0) {
        breakdownMap[item.title] = item.amount
      }
    })

    try {
      await api.admissionsGenerateInvoice(app.id, {
        amount: totalAmount,
        fee_breakdown: breakdownMap,
        due_date: dueDate,
        notes: notes.trim(),
      })

      const newInv = {
        id: 'inv-' + Date.now(),
        invoice_no: `INV-${app.reference || 'ADM-' + app.id}`,
        student_name: `${app.student_first_name} ${app.student_last_name}`,
        class: app.class_applying_for || 'Admission',
        amount: totalAmount,
        paid: 0,
        balance: totalAmount,
        status: 'Payment Required',
        date: new Date().toISOString().split('T')[0],
        type: 'Admission',
      }

      setLocalInvoices((prev) => [newInv, ...prev])
      setSuccessMsg(`Invoice ${newInv.invoice_no} generated successfully for ${newInv.student_name} (₦${totalAmount.toLocaleString()})! The student portal now displays this exact fee amount.`)
      setIsInvoiceModalOpen(false)
      setTimeout(() => setSuccessMsg(''), 8000)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate invoice. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayedInvoices = (localInvoices || []).filter((inv) => {
    if (activeTab === 'Admission') return inv.type === 'Admission' || (inv.invoice_no && inv.invoice_no.includes('BFA')) || (inv.invoice_no && inv.invoice_no.includes('ADM'))
    if (activeTab === 'Enrolled') return inv.type !== 'Admission' && !(inv.invoice_no && inv.invoice_no.includes('BFA')) && !(inv.invoice_no && inv.invoice_no.includes('ADM'))
    return true
  })

  const selectedApp = applications.find((a) => String(a.id) === String(selectedAppId))

  return (
    <div>
      {/* KPI Cards */}
      <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Expected</div>
          <div className="admin-kpi-val">₦55.1M</div>
          <div className="admin-kpi-sub">First Term 2026/2027</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Collected</div>
          <div className="admin-kpi-val">₦48.2M</div>
          <div className="admin-kpi-badge up">87.4%</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Outstanding Balance</div>
          <div className="admin-kpi-val">₦6.9M</div>
          <div className="admin-kpi-sub">12.6% pending</div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Fully Paid Students</div>
          <div className="admin-kpi-val">1,088</div>
          <div className="admin-kpi-sub">Out of 1,248</div>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: 8, marginBottom: 18, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Ledger Card */}
      <div className="admin-table-container">
        <div className="admin-table-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h3 className="admin-table-title" style={{ margin: 0 }}>Tuition & Invoices Ledger</h3>
            <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
              {['All', 'Admission', 'Enrolled'].map((t) => (
                <button
                  key={t}
                  style={{
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: 'none',
                    background: activeTab === t ? '#ffffff' : 'transparent',
                    color: activeTab === t ? '#0e3d2f' : '#64748b',
                    boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab(t)}
                >
                  {t === 'All' ? 'All Invoices' : t === 'Admission' ? 'Admission Invoices' : 'Enrolled Students'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="admin-btn admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0d624a' }}
              onClick={() => {
                setIsInvoiceModalOpen(true)
                setErrorMsg('')
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>+ Generate Admission Invoice</span>
            </button>
            <button className="admin-btn admin-btn-outline" onClick={() => alert('Record payment modal')}>
              + Record Payment
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Student / Applicant</th>
              <th>Class / Dept</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayedInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No invoices found in this view.
                </td>
              </tr>
            ) : (
              displayedInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{inv.invoice_no}</td>
                  <td style={{ fontWeight: 600 }}>
                    {inv.student_name}
                    {inv.type === 'Admission' && (
                      <span className="admin-badge admin-badge-amber" style={{ marginLeft: 8, fontSize: 10 }}>
                        Admission
                      </span>
                    )}
                  </td>
                  <td><span className="admin-badge admin-badge-teal">{inv.class}</span></td>
                  <td>₦{Number(inv.amount || 0).toLocaleString()}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>₦{Number(inv.paid || 0).toLocaleString()}</td>
                  <td style={{ color: inv.balance > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                    ₦{Number(inv.balance || 0).toLocaleString()}
                  </td>
                  <td>
                    <span className={`admin-badge ${inv.status === 'Paid' ? 'admin-badge-green' : inv.status === 'Partial' ? 'admin-badge-amber' : 'admin-badge-red'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{inv.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* GENERATE ADMISSION INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="admin-modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: 680, width: '92%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 12 }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '18px 24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0e3d2f', fontWeight: 700 }}>Generate Admission Invoice</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b' }}>
                  Set custom school fees and itemized charges for an accepted student by class and department.
                </p>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} style={{ padding: 24 }}>
              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
                  {errorMsg}
                </div>
              )}

              {/* 1. Applicant Selector */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Select Accepted Applicant <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {loadingApps ? (
                  <div style={{ fontSize: 13, color: '#64748b' }}>Loading applicants...</div>
                ) : applications.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#ef4444', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
                    No admission applications found. Please verify applications in the Admissions module.
                  </div>
                ) : (
                  <select
                    className="admin-filter-select"
                    style={{ width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    value={selectedAppId}
                    onChange={(e) => handleSelectApp(e.target.value)}
                    required
                  >
                    <option value="">-- Choose an Applicant --</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.reference ? `[${app.reference}] ` : ''}{app.student_first_name} {app.student_last_name} — {app.class_applying_for} ({app.status ? app.status.replace(/_/g, ' ') : 'draft'})
                      </option>
                    ))}
                  </select>
                )}
                {selectedApp && (
                  <div style={{ marginTop: 8, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12.5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>Class Applying: <strong style={{ color: '#0e3d2f' }}>{selectedApp.class_applying_for}</strong></div>
                    <div>Guardian: <strong>{selectedApp.guardian_full_name}</strong></div>
                    <div>Ref: <strong style={{ color: '#b45309' }}>{selectedApp.reference || 'Pending'}</strong></div>
                  </div>
                )}
              </div>

              {/* 2. Class / Department Fee Preset Selector */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fee Structure Preset by Class & Department
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    ['Creche', 'Creche / Nursery'],
                    ['Primary', 'Primary (Grades 1–6)'],
                    ['JSS', 'Junior Secondary (JSS)'],
                    ['SS Science', 'SS (Science)'],
                    ['SS Arts', 'SS (Arts & Humanities)'],
                    ['SS Commercial', 'SS (Commercial)'],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: classCategory === key ? '1.5px solid #0d624a' : '1px solid #cbd5e1',
                        background: classCategory === key ? '#e8f3ee' : '#ffffff',
                        color: classCategory === key ? '#0e3d2f' : '#475569',
                        fontWeight: classCategory === key ? 700 : 500,
                        cursor: 'pointer',
                      }}
                      onClick={() => applyPreset(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Itemized Fee Breakdown Table */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Itemized Fees Breakdown (₦)
                  </label>
                  <button
                    type="button"
                    onClick={addFeeItem}
                    style={{ background: 'none', border: 'none', color: '#0d624a', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    + Add Custom Item
                  </button>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '8px 12px' }}>Fee Description</th>
                        <th style={{ padding: '8px 12px', width: 160 }}>Amount (₦)</th>
                        <th style={{ padding: '8px 12px', width: 40 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateFeeItem(item.id, 'title', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }}
                              required
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              step="500"
                              value={item.amount}
                              onChange={(e) => updateFeeItem(item.id, 'amount', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, fontWeight: 600 }}
                              required
                            />
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                            {feeItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFeeItem(item.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}
                                title="Remove item"
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontWeight: 800, fontSize: 14, color: '#0e3d2f' }}>
                          TOTAL AMOUNT DUE:
                        </td>
                        <td style={{ padding: '12px', fontWeight: 800, fontSize: 16, color: '#b45309' }}>
                          ₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 4. Due Date & Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4, textTransform: 'uppercase' }}>
                    Payment Due Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4, textTransform: 'uppercase' }}>
                    Invoice Reference Note
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ background: '#0d624a', padding: '10px 24px', fontWeight: 700 }}
                  disabled={submitting || !selectedAppId}
                >
                  {submitting ? 'Generating Invoice…' : 'Generate & Issue Invoice →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// 9. TIMETABLE MODULE
export function AdminTimetable({ timetable }) {
  const [selectedClass, setSelectedClass] = useState('JSS 1')
  const periods = (timetable && timetable[selectedClass]) || []

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 className="admin-table-title">Master Academic Timetable</h3>
          <select className="admin-filter-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="SS 1">SS 1</option>
          </select>
        </div>
        <button className="admin-btn admin-btn-outline" onClick={() => window.print()}>
          ⎙ Print Timetable
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ width: 140, textAlign: 'left' }}>Time / Period</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, idx) => (
              <tr key={idx} style={{ background: p.mon.includes('BREAK') ? '#f8fafc' : 'transparent' }}>
                <td style={{ textAlign: 'left', fontWeight: 700, color: '#0e3d2f' }}>{p.period}</td>
                <td>{p.mon}</td>
                <td>{p.tue}</td>
                <td>{p.wed}</td>
                <td>{p.thu}</td>
                <td>{p.fri}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 10. CALENDAR MODULE
export function AdminCalendar({ events }) {
  return (
    <div>
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <h3 className="admin-table-title">Academic Calendar & Events (2025/2026)</h3>
          <button className="admin-btn admin-btn-primary">+ Add New Event</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, padding: 20 }}>
          {(events || []).map((ev) => (
            <div key={ev.id} style={{ display: 'flex', gap: 16, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
              <div className="admin-event-date-box" style={{ width: 54, height: 54 }}>
                <span className="month">{ev.date_month}</span>
                <span className="day" style={{ fontSize: 18 }}>{ev.date_day}</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0e3d2f' }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>🕒 {ev.time}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>📍 {ev.location}</div>
                <span className="admin-badge admin-badge-teal" style={{ marginTop: 8 }}>{ev.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 11. NEWS / ANNOUNCEMENTS MODULE
export function AdminNews({ news }) {
  return (
    <div>
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <h3 className="admin-table-title">School Announcements & Circulars</h3>
          <button className="admin-btn admin-btn-primary">+ Publish Announcement</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
          {(news || []).map((n) => (
            <div key={n.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: 16, color: '#0e3d2f' }}>{n.title}</h4>
                <span className="admin-badge admin-badge-blue">{n.audience}</span>
              </div>
              <p style={{ margin: '8px 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{n.summary}</p>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Posted on {n.date} by {n.author} • Category: {n.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 12. REPORTS MODULE
export function AdminReports() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
      {[
        { title: 'Academic Performance Report', desc: 'Comprehensive student grade distribution, class rankings, and GPA summaries.', icon: '📊' },
        { title: 'Attendance Audit Report', desc: 'Detailed attendance registers, chronic absenteeism alerts, and monthly trends.', icon: '📋' },
        { title: 'Financial & Fee Ledger', desc: 'Collected tuition, outstanding balances, receipts, and income statements.', icon: '₦' },
        { title: 'Staff & Payroll Summary', desc: 'Teaching hours, staff presence records, and departmental capacity analysis.', icon: '👥' },
      ].map((rep, idx) => (
        <div key={idx} className="admin-chart-card">
          <div style={{ fontSize: 32, marginBottom: 8 }}>{rep.icon}</div>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, color: '#0e3d2f' }}>{rep.title}</h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.4, marginBottom: 16 }}>{rep.desc}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="admin-btn admin-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => alert(`Generating ${rep.title}`)}>
              Generate PDF
            </button>
            <button className="admin-btn admin-btn-outline" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => alert(`Exporting ${rep.title} CSV`)}>
              Export CSV
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// 13. AUDIT LOGS MODULE
export function AdminAuditLogs({ logs }) {
  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div>
          <h3 className="admin-table-title">System & Security Audit Logs</h3>
          <p className="admin-chart-subtitle">Immutable audit trail of administrator and system actions</p>
        </div>
        <button className="admin-btn admin-btn-outline" onClick={() => alert('Exporting audit logs...')}>
          📥 Export Audit Trail
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(logs || []).map((l) => (
              <tr key={l.id}>
                <td style={{ color: '#64748b', fontSize: 12 }}>{l.timestamp}</td>
                <td style={{ fontWeight: 700, color: '#0e3d2f' }}>{l.user}</td>
                <td style={{ fontWeight: 600 }}>{l.action}</td>
                <td>{l.entity}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{l.ip}</td>
                <td>
                  <span className={`admin-badge ${l.status === 'Success' ? 'admin-badge-green' : 'admin-badge-amber'}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 14. SETTINGS MODULE
export function AdminSettings({ settings, onSave }) {
  const [form, setForm] = useState(settings || {})

  return (
    <div className="admin-table-container" style={{ padding: 24 }}>
      <h3 className="admin-table-title" style={{ marginBottom: 20 }}>School Administration Settings</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        <div>
          <label className="admin-form-label">School Name</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.school_name || 'Riverside Academy'}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-form-label">Official Domain</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.domain || 'riversideacademy.com'}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-form-label">Current Academic Session</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.current_session || '2025/2026'}
            onChange={(e) => setForm({ ...form, current_session: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-form-label">Current Term</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.current_term || 'First Term'}
            onChange={(e) => setForm({ ...form, current_term: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-form-label">Contact Phone</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.phone || '+234 800 RIVERSIDE'}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-form-label">Official Email</label>
          <input
            type="email"
            className="admin-form-input"
            value={form.email || 'info@riversideacademy.com'}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label className="admin-form-label">Campus Address</label>
          <input
            type="text"
            className="admin-form-input"
            value={form.address || 'Plot 14, Riverside Boulevard, Victoria Island, Lagos'}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            if (onSave) onSave(form)
            alert('Settings updated successfully!')
          }}
        >
          💾 Save School Configuration
        </button>
      </div>
    </div>
  )
}

