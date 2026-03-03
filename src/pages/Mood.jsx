import { useState, useEffect } from 'react'
import { getTodayLog, saveTodayLog, getMoodLogs } from '../lib/storage'
import './Mood.css'

const MOODS = [
  { val: 1, emoji: '😞', label: '너무 힘들어' },
  { val: 2, emoji: '😕', label: '별로야' },
  { val: 3, emoji: '😐', label: '그냥 그래' },
  { val: 4, emoji: '🙂', label: '괜찮아' },
  { val: 5, emoji: '😊', label: '좋아!' },
]

export default function Mood() {
  const [log, setLog] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setLog(getTodayLog())
    setHistory(getMoodLogs())
  }, [])

  function selectMood(val) {
    const next = { ...log, mood: val }
    setLog(next)
    saveTodayLog({ mood: val })
    setHistory(getMoodLogs())
  }

  function setNote(note) {
    const next = { ...log, moodNote: note }
    setLog(next)
    saveTodayLog({ moodNote: note })
  }

  if (!log) return null

  const avg = history.length
    ? (history.reduce((s, h) => s + h.mood, 0) / history.length).toFixed(1)
    : null

  return (
    <div className="mood-page">
      <h2>기분 일기</h2>

      <section className="mood-section">
        <h3>오늘 기분은?</h3>
        <div className="mood-selector">
          {MOODS.map((m) => (
            <button
              key={m.val}
              className={`mood-btn ${log.mood === m.val ? 'selected' : ''}`}
              onClick={() => selectMood(m.val)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mood-note">
          <label>한 줄 일기</label>
          <textarea
            value={log.moodNote || ''}
            onChange={(e) => setNote(e.target.value)}
            placeholder="오늘 어땠어? 뭐든 적어봐..."
            rows={3}
          />
        </div>
      </section>

      {history.length > 1 && (
        <section className="mood-section">
          <h3>최근 기분 그래프 <span className="avg-label">평균 {avg}/5</span></h3>
          <div className="mood-chart">
            {history.slice(-14).map((h, i) => (
              <div key={i} className="mood-bar-col">
                <div
                  className="mood-bar"
                  style={{ height: `${h.mood * 20}%` }}
                  title={`${h.date}: ${MOODS[h.mood - 1]?.emoji}`}
                />
                <span className="mood-bar-date">{h.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
