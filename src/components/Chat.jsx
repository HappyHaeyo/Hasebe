import { useState, useRef, useEffect } from 'react'
import { sendMessage } from '../lib/gemini.js'
import Message from './Message.jsx'
import './Chat.css'

export default function Chat({ apiKey }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      const reply = await sendMessage(apiKey, history)
      setMessages([...history, { role: 'model', content: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleClear = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p>무엇이든 물어보세요</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="message model">
            <div className="bubble">
              <span className="typing-dots">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-bar">
            <span>오류: {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        {messages.length > 0 && (
          <button className="clear-btn" onClick={handleClear} title="대화 지우기">
            새 대화
          </button>
        )}
        <form className="input-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력... (Enter 전송, Shift+Enter 줄바꿈)"
            rows={1}
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || loading}
            title="전송"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  )
}
