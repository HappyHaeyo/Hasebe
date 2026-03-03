import { useState, useRef, useEffect } from 'react'
import { getSettings } from '../lib/storage'
import { getRecentLogs } from '../lib/storage'
import { sendMessage, buildSystemPrompt } from '../lib/gemini'
import './Chat.css'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const settings = getSettings()
    if (!settings.apiKey) {
      setError('설정에서 API 키를 먼저 입력해줘.')
      return
    }

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const recentLogs = getRecentLogs(7)
      const systemPrompt = buildSystemPrompt({
        character: {
          name: settings.characterName,
          prompt: settings.characterPrompt,
        },
        userPersona: settings.userPersona,
        recentLogs,
      })

      const reply = await sendMessage({
        apiKey: settings.apiKey,
        model: settings.model || 'gemini-3-pro-preview',
        messages: newMessages,
        systemPrompt,
      })

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const settings = getSettings()
  const charName = settings.characterName || '하세베'

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>{charName}에게 말을 걸어봐.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.role === 'assistant' && <span className="chat-name">{charName}</span>}
            <p>{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <span className="chat-name">{charName}</span>
            <p className="typing">···</p>
          </div>
        )}
        {error && <div className="chat-error">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="메시지 입력..."
          rows={2}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          전송
        </button>
      </div>
    </div>
  )
}
