import React, { useState } from 'react'

export function StudentAIAssistant({ student, showToast }) {
  const [activeSession, setActiveSession] = useState('Dijkstra Algorithm in Python')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Can you show me how to implement Dijkstra’s shortest path algorithm in Python with a priority queue for my CS201 assignment?',
    },
    {
      id: 2,
      sender: 'assistant',
      text: `Certainly, ${student?.firstName || 'Student'}! Here is an efficient implementation of Dijkstra's Algorithm in Python using the \`heapq\` standard library module. This achieves an optimal time complexity of O((V + E) log V).`,
      code: `import heapq

def dijkstra(graph, start_vertex):
    # Initialize distances with infinity
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start_vertex] = 0
    
    # Priority queue stores tuples of (distance, vertex)
    priority_queue = [(0, start_vertex)]
    
    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)
        
        # If distance in queue is larger, skip
        if current_distance > distances[current_vertex]:
            continue
            
        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight
            
            # Found a shorter path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
                
    return distances

# Example Graph representation:
# graph = {'A': {'B': 4, 'C': 2}, 'B': {'C': 5, 'D': 10}, 'C': {'D': 3}, 'D': {}}
# print(dijkstra(graph, 'A'))`,
      citations: [
        'Riverside CS201 Lecture Notes — Module 8 (Graph Theory)',
        'Introduction to Algorithms (CLRS) — Chapter 24',
      ],
    },
  ])

  const [inputPrompt, setInputPrompt] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputPrompt.trim()) return

    const userText = inputPrompt
    setInputPrompt('')

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userText },
    ])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `Great question, ${student?.firstName || 'Student'}! Regarding "${userText}": Based on the Riverside College academic syllabus, the fundamental concept relates directly to algorithmic efficiency and standard design paradigms.`,
          code: `# Key algorithmic demonstration\ndef analyze_concept():\n    return "Optimal solution verified against course materials."`,
          citations: ['Riverside College Computing Repository', 'Faculty Course Guide 2026/2027'],
        },
      ])
    }, 700)
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    if (showToast) showToast('Code copied to clipboard! ✓')
  }

  return (
    <div className="student-ai-page">
      {/* Header */}
      <div className="student-page-header">
        <div>
          <h1 className="student-page-title">Riverside Academic AI Assistant</h1>
          <p className="student-page-subtitle">
            Course-grounded AI tutor & research partner for Computer Science & Engineering students.
          </p>
        </div>
        <div className="student-page-actions">
          <span className="student-badge student-badge-success" style={{ padding: '6px 12px' }}>
            Riverside Knowledge Base v2.4 Active
          </span>
        </div>
      </div>

      {/* 3-Column Layout from Reference Image */}
      <div
        className="student-card"
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 280px',
          padding: 0,
          overflow: 'hidden',
          minHeight: 640,
        }}
      >
        {/* Left Column: Sessions & Categories */}
        <div style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: 16 }}>
          <button
            className="student-btn student-btn-primary"
            style={{ width: '100%', marginBottom: 16, fontSize: 13 }}
            onClick={() => {
              const newTitle = prompt('Enter research topic:') || 'New Study Session'
              setActiveSession(newTitle)
            }}
          >
            + New Study Session
          </button>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
            Previous Research Chats
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Dijkstra Algorithm in Python',
              'Calculus II: Integration by Parts',
              'Physics 101: Harmonic Motion',
              'Technical Writing APA Citations',
              'Binary Search Tree Balancing',
            ].map((topic) => (
              <div
                key={topic}
                onClick={() => setActiveSession(topic)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  fontWeight: activeSession === topic ? 600 : 500,
                  backgroundColor: activeSession === topic ? '#ecfdf5' : 'transparent',
                  color: activeSession === topic ? '#0f766e' : '#334155',
                  border: activeSession === topic ? '1px solid #a7f3d0' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Chat & Code Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
          {/* Active Session Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{activeSession}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Explain Simply', 'Generate Quiz', 'Practice Exercises'].map((pill) => (
                <button
                  key={pill}
                  className="student-btn-ghost-sm"
                  style={{ fontSize: 11, padding: '4px 8px', color: '#0f766e', borderColor: '#a7f3d0' }}
                  onClick={() => setInputPrompt(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: m.sender === 'user' ? '#0f766e' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{m.sender === 'user' ? (student?.fullName || 'Student Account') : 'Riverside AI Assistant'}</span>
                </div>

                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? '#f0fdf4' : '#f8fafc',
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: '#0f172a',
                  }}
                >
                  {m.text}

                  {m.code && (
                    <div style={{ marginTop: 12, position: 'relative' }}>
                      <div
                        style={{
                          backgroundColor: '#09261d',
                          color: '#f8fafc',
                          padding: 14,
                          borderRadius: 8,
                          fontFamily: 'Consolas, monospace',
                          fontSize: 12.5,
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                        }}
                      >
                        {m.code}
                      </div>
                      <button
                        onClick={() => handleCopyCode(m.code)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        Copy Code
                      </button>
                    </div>
                  )}

                  {m.citations && (
                    <div style={{ marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Accredited Sources:</div>
                      {m.citations.map((c, i) => (
                        <div key={i} style={{ fontSize: 11.5, color: '#0f766e', marginTop: 2 }}>
                          &bull; {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: 10,
              backgroundColor: '#f8fafc',
            }}
          >
            <input
              type="text"
              className="student-form-input"
              placeholder="Ask anything about CS101, MAT201, PHY101, algorithms, or exams..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              style={{ backgroundColor: '#ffffff' }}
            />
            <button type="submit" className="student-btn student-btn-primary">
              Ask AI
            </button>
          </form>
        </div>

        {/* Right Column: Grounded Sources & Quick Reference */}
        <div style={{ borderLeft: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            Connected Sources
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>CS201 Syllabus (2025/2026)</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Engr. Williams &bull; 100% Synced</div>
            </div>
            <div style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>MAT201 Calculus Notes</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Prof. Balogun &bull; Verified</div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
            Quick Prompts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Explain Big-O Notation',
              'Derive Integration by Parts formula',
              'Practice Midterm Quiz',
              'Debug Python recursion error',
            ].map((qp) => (
              <button
                key={qp}
                onClick={() => setInputPrompt(qp)}
                style={{
                  textAlign: 'left',
                  fontSize: 12,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  color: '#334155',
                }}
              >
                {qp} &rarr;
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentAIAssistant
