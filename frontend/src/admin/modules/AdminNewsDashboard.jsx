import React, { useState, useMemo } from 'react'
import { useLiveDateTime } from '../adminDateUtils'

export default function AdminNewsDashboard({ news = [] }) {
  const { longDate, shortDate } = useLiveDateTime()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [selectedIds, setSelectedIds] = useState([])
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // News articles
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: 'Midterm Examination Schedule Released',
      category: 'Academic',
      audience: 'Students & Parents',
      published: 'Sep 18, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting & Open Day Consultations',
      category: 'Parent Notice',
      audience: 'Parents',
      published: 'Sep 17, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: 'Public Holiday & Long Weekend Notice',
      category: 'Announcement',
      audience: 'Entire School',
      published: 'Sep 15, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Science & Robotics Annual Fair 2026',
      category: 'Event',
      audience: 'All Students',
      published: 'Sep 12, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      title: 'New Digital Library and E-Learning Resources',
      category: 'Academic',
      audience: 'Faculty & Students',
      published: 'Sep 10, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Tuition Fee Due Date & Bursary Settlement Advisory',
      category: 'Parent Notice',
      audience: 'Parents',
      published: 'Sep 8, 2026',
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80',
    },
  ])

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Announcement',
    audience: 'All',
    content: '',
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredNews = useMemo(() => {
    return newsList.filter((n) => {
      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.audience.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'All' || n.category === activeCategory
      return matchSearch && matchCat
    })
  }, [newsList, search, activeCategory])

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / pageSize))
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredNews.slice(start, start + pageSize)
  }, [filteredNews, currentPage, pageSize])

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedNews.length && paginatedNews.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedNews.map((n) => n.id))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleCreateNews = async (e) => {
    e.preventDefault()
    if (!newArticle.title) return

    const item = {
      id: Date.now(),
      title: newArticle.title,
      category: newArticle.category,
      audience: newArticle.audience,
      published: shortDate,
      status: 'Published',
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format&fit=crop&q=80',
    }

    setNewsList([
      item,
      ...newsList,
    ])
    setCreateModalOpen(false)
    showToast(`Published announcement: "${newArticle.title}"!`)
    setNewArticle({ title: '', category: 'Announcement', audience: 'All', content: '' })

    try {
      await fetch('/api/core/admin/log-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'news.circular_published',
          description: `Published announcement "${item.title}" for audience: ${item.audience} (${item.category})`,
          details: item
        })
      })
      window.dispatchEvent(new CustomEvent('admin-refresh-data'))
    } catch (err) {
      console.error(err)
    }
  }

  const startEntry = filteredNews.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredNews.length)

  return (
    <div className="admin-page-content">
      {/* 1. Page Header (Gold Standard) */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">News & Circulars</h1>
          <p className="admin-page-subtitle">
            Publish school circulars, push notifications to parents and students, and manage institutional press bulletins.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="admin-btn-outline" onClick={() => showToast('News broadcast archive exported to PDF!')}>
            <span>Export Bulletins</span>
          </button>

          <button className="admin-btn-primary" onClick={() => setCreateModalOpen(true)}>
            <span>+ Create Announcement</span>
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
            <div className="admin-kpi-icon-box students">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Published Bulletins</span>
          </div>
          <div className="admin-kpi-number">{newsList.length} Articles</div>
          <div className="admin-kpi-trend up">
            <span>Term 1</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>active circulars</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box parents">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Parent Advisories</span>
          </div>
          <div className="admin-kpi-number">
            {newsList.filter((n) => n.category === 'Parent Notice').length} Notices
          </div>
          <div className="admin-kpi-trend up">
            <span>Direct to App</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>push delivered</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box teachers">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="admin-kpi-title">Academic Circulars</span>
          </div>
          <div className="admin-kpi-number">
            {newsList.filter((n) => n.category === 'Academic').length} Circulars
          </div>
          <div className="admin-kpi-trend up">
            <span>Syllabus & Exams</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>current</span>
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="admin-kpi-title">Delivery Success</span>
          </div>
          <div className="admin-kpi-number" style={{ color: '#059669' }}>100%</div>
          <div className="admin-kpi-trend up">
            <span>Email & SMS</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>synced</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Row */}
      <div className="admin-filter-row">
        <div className="admin-filter-search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search news title, audience, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="admin-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
          <option value="All">Category: All Articles</option>
          <option value="Academic">Academic</option>
          <option value="Parent Notice">Parent Notice</option>
          <option value="Announcement">Announcement</option>
          <option value="Event">Event</option>
        </select>

        <div className="admin-date-badge" style={{ marginLeft: 'auto' }}>
          <span>{longDate}</span>
        </div>
      </div>

      {/* 4. Table Panel */}
      <div className="admin-table-panel">
        <div className="admin-table-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedIds.length === paginatedNews.length && paginatedNews.length > 0}
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
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#64748b' }}>
            Riverside Academy Institutional Gazette
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedNews.length && paginatedNews.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 40 }}>#</th>
                <th>Announcement Title</th>
                <th>Category</th>
                <th>Target Audience</th>
                <th>Published Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: 40 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNews.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    <strong>No articles match your search or category filter</strong>
                  </td>
                </tr>
              ) : (
                paginatedNews.map((n, idx) => {
                  const isSelected = selectedIds.includes(n.id)
                  const displayNum = (currentPage - 1) * pageSize + idx + 1
                  return (
                    <tr
                      key={n.id}
                      style={{ background: isSelected ? '#f0fdf4' : 'transparent', cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(n.id)}
                        />
                      </td>
                      <td style={{ color: '#64748b' }}>{displayNum}</td>
                      <td>
                        <div className="admin-table-user-cell">
                          <img
                            src={n.thumb}
                            alt={n.title}
                            style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="admin-table-name">{n.title}</div>
                            <div className="admin-table-sub">Official school circular</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-pill class-jss">{n.category}</span>
                      </td>
                      <td style={{ color: '#475569', fontWeight: 600 }}>{n.audience}</td>
                      <td style={{ color: '#64748b' }}>{n.published}</td>
                      <td>
                        <span className="admin-pill paid">● {n.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-btn-outline"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={() => showToast(`Previewing "${n.title}"!`)}
                        >
                          View
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
          <div>Showing {startEntry} to {endEntry} of {filteredNews.length} articles</div>
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

      {/* Modal: Create Announcement */}
      {createModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Create Announcement</h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b' }}>
              Broadcast news or important updates across the institutional portal.
            </p>

            <form onSubmit={handleCreateNews}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. End of Term Examination Schedule"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Parent Notice">Parent Notice</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Target Audience
                  </label>
                  <select
                    className="admin-select"
                    style={{ width: '100%' }}
                    value={newArticle.audience}
                    onChange={(e) => setNewArticle({ ...newArticle, audience: e.target.value })}
                  >
                    <option value="All">All School</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers / Faculty</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Content / Body
                </label>
                <textarea
                  rows="4"
                  placeholder="Write announcement details..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="admin-btn-outline" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
