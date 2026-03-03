import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTodayLog, saveTodayLog, getSettings } from '../lib/storage'
import './Home.css'

const MOOD_EMOJI = ['', '😞', '😕', '😐', '🙂', '😊']

export default function Home() {
  const [log, setLog] = useState(null)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    setLog(getTodayLog())
    setSettings(getSettings())
  }, [])

  function toggleHygiene(key) {
    const hygiene = { ...(log.hygiene || {}), [key]: !log.hygiene?.[key] }
    const next = { ...log, hygiene }
    setLog(next)
    saveTodayLog({ hygiene })
  }

  if (!log) return null

  const charName = settings.characterName || '하세베'
  const mealsEaten = ['breakfast', 'lunch', 'dinner'].filter((k) => log.meals?.[k])
  const medsTotal = (settings.meds || []).length
  const medsTaken = (log.meds || []).filter((m) => m.taken).length

  const warnings = []
  if (log.sleep?.hours != null && log.sleep.hours < 6) warnings.push('수면 부족')
  if (log.sleep?.hours != null && log.sleep.hours > 12) warnings.push('수면 과다')
  if (mealsEaten.length < 2) warnings.push('식사 부족')
  if (medsTotal > 0 && medsTaken < medsTotal) warnings.push('약 미복용')
  if ((log.water || 0) < 4) warnings.push('물 부족')

  const HYGIENE_ITEMS = [
    { key: 'shower', label: '샤워 / 씻기', icon: '🚿' },
    { key: 'teeth', label: '양치', icon: '🪥' },
  ]

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>오마모리</h1>
        <p className="home-date">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      {warnings.length > 0 && (
        <div className="home-warning">
          <span className="warning-char">{charName}</span>
          <p>
            {warnings.join(', ')}이 걱정됩니다, 주인님.{' '}
            <Link to="/chat">이야기하러 가기 →</Link>
          </p>
        </div>
      )}

      <div className="hygiene-bar">
        {HYGIENE_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`hygiene-btn ${log.hygiene?.[item.key] ? 'done' : ''}`}
            onClick={() => toggleHygiene(item.key)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {log.hygiene?.[item.key] && <span className="hygiene-check">✓</span>}
          </button>
        ))}
      </div>

      <div className="home-grid">
        <Link to="/diet" className="home-card">
          <div className="card-icon">🍱</div>
          <div className="card-label">식단</div>
          <div className="card-value">{mealsEaten.length}/3 식사</div>
          <div className="card-sub">물 {log.water || 0}잔</div>
        </Link>

        <Link to="/sleep" className="home-card">
          <div className="card-icon">🌙</div>
          <div className="card-label">수면</div>
          <div className="card-value">
            {log.sleep?.hours != null ? `${log.sleep.hours}시간` : '미기록'}
          </div>
          <div className="card-sub">
            {log.sleep?.bedtime ? `${log.sleep.bedtime} 취침` : ''}
          </div>
        </Link>

        <Link to="/exercise" className="home-card">
          <div className="card-icon">👟</div>
          <div className="card-label">운동</div>
          <div className="card-value">{(log.steps || 0).toLocaleString()}보</div>
          <div className="card-sub">목표 7,000보</div>
        </Link>

        <Link to="/medication" className="home-card">
          <div className="card-icon">💊</div>
          <div className="card-label">약</div>
          <div className="card-value">{medsTaken}/{medsTotal}</div>
          <div className="card-sub">{medsTaken === medsTotal && medsTotal > 0 ? '완료 ✓' : '복용 확인'}</div>
        </Link>

        <Link to="/mood" className="home-card">
          <div className="card-icon">{log.mood ? MOOD_EMOJI[log.mood] : '💭'}</div>
          <div className="card-label">기분</div>
          <div className="card-value">{log.mood ? `${log.mood}/5` : '미기록'}</div>
          <div className="card-sub">{log.moodNote?.slice(0, 12) || ''}</div>
        </Link>

        <Link to="/schedule" className="home-card">
          <div className="card-icon">📋</div>
          <div className="card-label">일정</div>
          <div className="card-value">할 일</div>
          <div className="card-sub">탭해서 확인</div>
        </Link>

        <Link to="/menstrual" className="home-card">
          <div className="card-icon">🩸</div>
          <div className="card-label">월경</div>
          <div className="card-value">관리</div>
          <div className="card-sub">탭해서 확인</div>
        </Link>
      </div>
    </div>
  )
}
