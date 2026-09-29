import React, { useState } from 'react'

export function StudentMessages({ initialConversations = [], student }) {
  const [conversations, setConversations] = useState(
    initialConversations.length > 0
      ? initialConversations
      : [
          {
            id: 1,
            name: 'Dr. K. Adeyemi',
            role: 'Course Advisor & Academic Lecturer',
            avatar: 'KA',
            lastMessage: 'Please ensure you review the course chapter before tomorrow’s lab.',
            time: '10:14 AM',
            unread: 1,
            messages: [
              { id: 1, sender: 'Dr. K. Adeyemi', text: `Hello ${student?.firstName || 'Student'}, how are your preparations for the upcoming course practical?`, time: '10:05 AM', fromMe: false },
              { id: 2, sender: student?.fullName || 'Student', text: 'Good morning Sir! Preparations are going very well. I just finished the analytical derivation exercises.', time: '10:10 AM', fromMe: true },
              { id: 3, sender: 'Dr. K. Adeyemi', text: 'Excellent work. Please ensure you review the course chapter before tomorrow’s lab.', time: '10:14 AM', fromMe: false },
            ],
          },
          {
            id: 2,
            name: 'Prof. O. Balogun',
            role: 'Mathematics Lecturer',
            avatar: 'OB',
            lastMessage: 'Tutorial problem set 3 solutions are now posted on the notice board.',
            time: 'Yesterday',
            unread: 0,
            messages: [
              { id: 1, sender: 'Prof. O. Balogun', text: 'Tutorial problem set 3 solutions are now posted on the notice board.', time: 'Yesterday', fromMe: false },
            ],
          },
          {
            id: 3,
            name: 'Engr. T. Williams',
            role: 'Computer Systems Lecturer',
            avatar: 'TW',
            lastMessage: 'Great job on the linked list assignment.',
            time: 'Sep 20',
            unread: 0,
            messages: [
              { id: 1, sender: 'Engr. T. Williams', text: 'Great job on the programming assignment. Your complexity analysis was spot on.', time: 'Sep 20', fromMe: false },
              { id: 2, sender: student?.fullName || 'Student', text: 'Thank you very much, Engr. Williams!', time: 'Sep 20', fromMe: true },
            ],
          },
        ]
  )

  const [activeConvId, setActiveConvId] = useState(1)
  const [inputText, setInputText] = useState('')

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg = {
      id: Date.now(),
      sender: student?.fullName || 'Student',
      text: inputText,
      time: 'Just now',
      fromMe: true,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: inputText,
            time: 'Just now',
            messages: [...(c.messages || []), newMsg],
          }
        }
        return c
      })
    )
    setInputText('')
  }

  return (
    <div className="student-messages-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Messages & Communications</h1>
          <p className="student-page-subtitle">
            Direct communication with course lecturers, academic advisors, and peers.
          </p>
        </div>
      </div>

      {/* 2-Column Chat Layout */}
      <div
        className="student-card"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          padding: 0,
          overflow: 'hidden',
          minHeight: 560,
        }}
      >
        {/* Left: Conversations list */}
        <div style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <input
              type="text"
              className="student-form-input"
              placeholder="Search conversations..."
              style={{ fontSize: 13, backgroundColor: '#ffffff' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: activeConvId === conv.id ? '#ffffff' : 'transparent',
                  borderLeft: activeConvId === conv.id ? '4px solid #0f766e' : '4px solid transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>{conv.name}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: 12, color: '#0f766e', fontWeight: 600, marginBottom: 4 }}>
                  {conv.role}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {conv.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
          {/* Thread Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{activeConv?.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{activeConv?.role} &bull; Online</div>
            </div>
            <span className="student-badge student-badge-success">Faculty Verified</span>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(activeConv?.messages || []).map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.fromMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    backgroundColor: m.fromMe ? '#0f766e' : '#f1f5f9',
                    color: m.fromMe ? '#ffffff' : '#0f172a',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    borderBottomRightRadius: m.fromMe ? 2 : 12,
                    borderBottomLeftRadius: m.fromMe ? 12 : 2,
                  }}
                >
                  {m.text}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: '#94a3b8',
                    marginTop: 4,
                    textAlign: m.fromMe ? 'right' : 'left',
                  }}
                >
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: 12,
              backgroundColor: '#f8fafc',
            }}
          >
            <input
              type="text"
              className="student-form-input"
              placeholder={`Message ${activeConv?.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ backgroundColor: '#ffffff' }}
            />
            <button type="submit" className="student-btn student-btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default StudentMessages
