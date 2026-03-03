import { useState, useEffect } from 'react'
import { getTodayLog, saveTodayLog } from '../lib/storage'
import './Sleep.css'

export default function Sleep() {
  const [log, setLog] = useState(null)

  useEffect(() => {
    setLog(getTodayLog())
  }, [])

  function update(sleepPatch) {
    const sleep = { ...log.sleep, ...sleepPatch }
    // 수면 시간 자동 계산
    if (sleep.bedtime && sleep.wakeTime) {
      const [bh, bm] = sleep.bedtime.split(':').map(Number)
      const [wh, wm] = sleep.wakeTime.split(':').map(Number)
      let mins = (wh * 60 + wm) - (bh * 60 + bm)
      if (mins < 0) mins += 24 * 60
      sleep.hours = Math.round((mins / 60) * 10) / 10
    }
    const next = { ...log, sleep }
    setLog(next)
    saveTodayLog({ sleep })
  }

  if (!log) return null

  const hours = log.sleep?.hours
  const quality =
    hours == null ? null
    : hours >= 8 ? '충분해요 ✓'
    : hours >= 6 ? '조금 부족해요'
    : '많이 부족해요 ⚠️'

  return (
    <div className="sleep-page">
      <h2>수면 관리</h2>

      <section className="sleep-section">
        <div className="time-row">
          <div className="time-block">
            <label>취침 시각</label>
            <input
              type="time"
              value={log.sleep?.bedtime || ''}
              onChange={(e) => update({ bedtime: e.target.value })}
            />
          </div>
          <div className="time-arrow">→</div>
          <div className="time-block">
            <label>기상 시각</label>
            <input
              type="time"
              value={log.sleep?.wakeTime || ''}
              onChange={(e) => update({ wakeTime: e.target.value })}
            />
          </div>
        </div>

        {hours != null && (
          <div className="sleep-result">
            <span className="sleep-hours">{hours}시간</span>
            <span className={`sleep-quality ${hours < 6 ? 'bad' : hours < 8 ? 'ok' : 'good'}`}>
              {quality}
            </span>
          </div>
        )}
      </section>

      <div className="sleep-tip">
        <p>💡 하루 7~9시간 수면이 권장돼요. 취침/기상 시각을 입력하면 자동으로 계산돼요.</p>
      </div>
    </div>
  )
}
