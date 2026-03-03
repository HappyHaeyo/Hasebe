import { useState, useEffect } from 'react'
import { getTodayLog, saveTodayLog, getSettings } from '../lib/storage'
import './Diet.css'

export default function Diet() {
  const [log, setLog] = useState(null)
  const settings = getSettings()

  useEffect(() => {
    setLog(getTodayLog())
  }, [])

  function update(patch) {
    const next = { ...log, ...patch }
    setLog(next)
    saveTodayLog(patch)
  }

  function toggleMeal(meal) {
    const meals = { ...log.meals, [meal]: !log.meals[meal] }
    update({ meals })
  }

  function setWater(n) {
    update({ water: Math.max(0, n) })
  }

  if (!log) return null

  const bmr = settings.bmr ? parseInt(settings.bmr) : null
  const mealsEaten = ['breakfast', 'lunch', 'dinner'].filter((k) => log.meals[k]).length
  const approxKcal = mealsEaten * (bmr ? Math.round(bmr / 3) : 500)

  const MEAL_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁' }

  return (
    <div className="diet-page">
      <h2>식단 관리</h2>

      <section className="diet-section">
        <h3>식사 체크</h3>
        <div className="meal-row">
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <button
              key={meal}
              className={`meal-btn ${log.meals[meal] ? 'checked' : ''}`}
              onClick={() => toggleMeal(meal)}
            >
              {MEAL_LABELS[meal]}
              <span>{log.meals[meal] ? '✓' : '○'}</span>
            </button>
          ))}
        </div>
        {bmr && (
          <p className="kcal-info">
            약 {approxKcal} kcal 섭취 / 기초대사량 {bmr} kcal
          </p>
        )}
        <div className="meal-notes">
          <label>메모</label>
          <input
            type="text"
            value={log.meals.notes || ''}
            onChange={(e) => update({ meals: { ...log.meals, notes: e.target.value } })}
            placeholder="오늘 뭐 먹었는지 적어봐..."
          />
        </div>
      </section>

      <section className="diet-section">
        <h3>물 마시기</h3>
        <div className="water-tracker">
          <button className="water-btn minus" onClick={() => setWater((log.water || 0) - 1)}>－</button>
          <div className="water-count">
            <span className="water-num">{log.water || 0}</span>
            <span className="water-label">잔 (목표 8잔)</span>
          </div>
          <button className="water-btn plus" onClick={() => setWater((log.water || 0) + 1)}>＋</button>
        </div>
        <div className="water-cups">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`cup ${i < (log.water || 0) ? 'filled' : ''}`}
              onClick={() => setWater(i + 1)}
            >
              🥛
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
