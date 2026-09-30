import React, { useState } from 'react'
import { RECENT_MESSAGES } from '../parentData'

export default function ParentMessages({
  messages = RECENT_MESSAGES,
  onOpenNewMessage,
}) {
  const [threadList, setThreadList] = useState(messages)
  const [activeThreadId, setActiveThreadId] = useState(messages[0]?.id || '')
  const [newMessageText, setNewMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const activeThread = threadList.find((t) => t.id === activeThreadId) || threadList[0]

  const filteredThreads = threadList.filter((t) =>
    t.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessageText.trim() || !activeThread) return

    const updatedThreads = threadList.map((thread) => {
      if (thread.id === activeThread.id) {
        const updatedChat = [
          ...(thread.chat || []),
          {
            sender: 'me',
            text: newMessageText.trim(),
            time: 'Just now',
          },
        ]
        return {
          ...thread,
          snippet: newMessageText.trim(),
          time: 'Just now',
          unread: 0,
          chat: updatedChat,
        }
      }
      return thread
    })

    setThreadList(updatedThreads)
    setNewMessageText('')
  }

  return (
    <div className="parent-messages-page">
      {/* Page Header */}
      <div className="parent-page-header">
        <div>
          <h1 className="parent-page-title">Communication & Messaging</h1>
          <p className="parent-page-subtitle">
            Direct, secure two-way communication channel with teachers, faculty members, and administration.
          </p>
        </div>

        <button
          type="button"
          className="parent-btn-primary"
          onClick={onOpenNewMessage}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Compose Message
        </button>
      </div>

      {/* Two-Column Chat Container */}
      <div className="parent-chat-layout">
        {/* Left Column: Thread List */}
        <div className="parent-chat-left">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
            <input
              type="text"
              className="parent-form-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: 36, fontSize: 13 }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThread?.id
              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id)
                    // Mark as read
                    setThreadList((prev) =>
                      prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t))
                    )
                  }}
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    gap: 12,
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: isActive ? '#f0fdf4' : thread.unread ? '#ffffff' : '#ffffff',
                    borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <img
                    src={thread.avatar}
                    alt={thread.sender}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong
                        style={{
                          fontSize: 13,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {thread.sender}
                      </strong>
                      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{thread.time}</span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 600 }}>{thread.role}</div>

                    <p
                      style={{
                        margin: '3px 0 0',
                        fontSize: 12,
                        color: thread.unread ? '#0f172a' : '#64748b',
                        fontWeight: thread.unread ? 700 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {thread.snippet}
                    </p>
                  </div>

                  {thread.unread > 0 && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#10b981',
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Chat History & Composer */}
        {activeThread ? (
          <div className="parent-chat-thread-view">
            {/* Header */}
            <div className="parent-chat-header">
              <img
                src={activeThread.avatar}
                alt={activeThread.sender}
                style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 15, color: '#09261d', display: 'block' }}>
                  {activeThread.sender}
                </strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {activeThread.role} &bull; <span style={{ color: '#10b981', fontWeight: 600 }}>● Active Faculty</span>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="parent-chat-history">
              {(activeThread.chat || [
                { sender: 'them', text: activeThread.snippet, time: activeThread.time }
              ]).map((msg, i) => (
                <div key={i} className={`parent-chat-bubble ${msg.sender}`}>
                  <div>{msg.text}</div>
                  <div className="parent-chat-bubble-time">{msg.time}</div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="parent-chat-composer">
              <button
                type="button"
                onClick={() => alert('Attachment upload dialog')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Attach file"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <input
                type="text"
                className="parent-chat-input"
                placeholder={`Reply to ${activeThread.sender}...`}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />

              <button
                type="submit"
                className="parent-btn-primary"
                style={{ padding: '8px 16px', borderRadius: 9999 }}
              >
                Send
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Select a conversation thread to read and respond.
          </div>
        )}
      </div>
    </div>
  )
}
