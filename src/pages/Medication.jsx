import { useState, useEffect } from 'react'
import { getTodayLog, saveTodayLog, getSettings } from '../lib/storage'
import './Medication.css'

export default function Medication() {
  const [log, setLog] = useState(null)
  const [meds, setMeds] = useState([])

  useEffect(() => {
    const settings = getSettings()
    const settingsMeds = settings.meds || []
    const todayLog = getTodayLog()

    // 설정의 약 목록과 오늘 로그 병합
    const merged = settingsMeds.map((m) => {
      const existing = (todayLog.meds || []).find((lm) => lm.name === m.name)
      return existing || { name: m.name, time: m.time, taken: false }
    })

    setMeds(merged)
    setLog(todayLog)
  }, [])

  function toggle(idx) {
    const next = meds.map((m, i) => i === idx ? { ...m, taken: !m.taken } : m)
    setMeds(next)
    saveTodayLog({ meds: next })
  }

  const total = meds.length
  const taken = meds.filter((m) => m.taken).length

  return (
    <div className="medication-page">
      <h2>약 관리</h2>

      {total === 0 ? (
        <div className="med-empty">
          <p>약 목록이 없어요.</p>
          <p>설정에서 먹는 약을 추가해줘요.</p>
        </div>
      ) : (
        <>
          <div className="med-progress">
            <span>{taken}/{total} 복용</span>
            {taken === total && <span className="all-done"> 오늘 약 다 먹었어요 ✓</span>}
          </div>

          <ul className="med-list">
            {meds.map((m, i) => (
              <li key={i} className={`med-item ${m.taken ? 'taken' : ''}`} onClick={() => toggle(i)}>
                <div className="med-check">{m.taken ? '✓' : '○'}</div>
                <div className="med-info">
                  <span className="med-name">{m.name}</span>
                  <span className="med-time">{m.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
