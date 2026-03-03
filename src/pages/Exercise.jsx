import { useState, useEffect } from 'react'
import { getTodayLog, saveTodayLog } from '../lib/storage'
import './Exercise.css'

const GOAL = 7000

export default function Exercise() {
  const [log, setLog] = useState(null)

  useEffect(() => {
    setLog(getTodayLog())
  }, [])

  function setSteps(v) {
    const steps = Math.max(0, parseInt(v) || 0)
    setLog((l) => ({ ...l, steps }))
    saveTodayLog({ steps })
  }

  if (!log) return null

  const steps = log.steps || 0
  const pct = Math.min(100, Math.round((steps / GOAL) * 100))

  return (
    <div className="exercise-page">
      <h2>운동 관리</h2>

      <section className="exercise-section">
        <h3>오늘 걸음수</h3>
        <div className="steps-input-row">
          <input
            type="number"
            value={steps || ''}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="0"
            min="0"
          />
          <span>보</span>
        </div>

        <div className="steps-bar-wrap">
          <div className="steps-bar">
            <div className="steps-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="steps-pct">{pct}%</span>
        </div>
        <p className="steps-goal">목표: {GOAL.toLocaleString()}보</p>

        <div className="steps-status">
          {steps === 0 && <p>아직 입력하지 않았어요.</p>}
          {steps > 0 && steps < GOAL && (
            <p>{(GOAL - steps).toLocaleString()}보 남았어요!</p>
          )}
          {steps >= GOAL && <p>목표 달성! 대단해요 ✓</p>}
        </div>
      </section>

      <div className="exercise-tip">
        <p>💡 아이폰 건강 앱에서 걸음수를 확인하고 여기에 입력해줘요.</p>
        <p>나중에 iOS 단축어 자동 연동도 추가할 예정이에요.</p>
      </div>
    </div>
  )
}
