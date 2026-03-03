import { useState, useEffect } from 'react'
import { getPeriodLogs, savePeriodEntry, deletePeriodEntry } from '../lib/storage'
import './Menstrual.css'

const SYMPTOMS = ['복통', '두통', '피로', '기분변화', '부종', '요통', '식욕변화']

function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000)
}

function calcCycleInfo(logs) {
  if (logs.length < 2) return null
  const starts = logs.map((l) => l.start)
  const lengths = []
  for (let i = 1; i < starts.length; i++) {
    lengths.push(diffDays(starts[i - 1], starts[i]))
  }
  const avg = Math.round(lengths.reduce((s, v) => s + v, 0) / lengths.length)
  return avg
}

export default function Menstrual() {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ start: '', end: '', symptoms: [], notes: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    setLogs(getPeriodLogs())
  }, [])

  function reload() {
    const updated = getPeriodLogs()
    setLogs(updated)
  }

  function handleSave() {
    if (!form.start) return
    const entry = {
      id: editing || Date.now().toString(),
      ...form,
    }
    savePeriodEntry(entry)
    setForm({ start: '', end: '', symptoms: [], notes: '' })
    setEditing(null)
    reload()
  }

  function handleEdit(entry) {
    setEditing(entry.id)
    setForm({ start: entry.start, end: entry.end || '', symptoms: entry.symptoms || [], notes: entry.notes || '' })
  }

  function handleDelete(id) {
    deletePeriodEntry(id)
    reload()
  }

  function toggleSymptom(s) {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter((x) => x !== s)
        : [...prev.symptoms, s],
    }))
  }

  const today = new Date().toISOString().slice(0, 10)
  const last = logs[logs.length - 1]
  const avgCycle = calcCycleInfo(logs)

  // 현재 생리 중 여부
  const activePeriod = last && last.start <= today && (!last.end || last.end >= today)

  // 다음 생리 예측
  let nextPrediction = null
  if (last && avgCycle) {
    const nextDate = new Date(last.start)
    nextDate.setDate(nextDate.getDate() + avgCycle)
    nextPrediction = nextDate.toISOString().slice(0, 10)
  }

  const daysUntilNext = nextPrediction ? diffDays(today, nextPrediction) : null

  return (
    <div className="menstrual-page">
      <h2>월경 관리</h2>

      <section className="period-status">
        {activePeriod ? (
          <div className="status-card active">
            <span className="status-icon">🩸</span>
            <div>
              <div className="status-title">생리 중</div>
              <div className="status-sub">{last.start} 시작</div>
            </div>
          </div>
        ) : nextPrediction ? (
          <div className={`status-card ${daysUntilNext <= 3 ? 'soon' : ''}`}>
            <span className="status-icon">{daysUntilNext <= 3 ? '⚠️' : '📅'}</span>
            <div>
              <div className="status-title">
                {daysUntilNext <= 0 ? '오늘 또는 곧 시작 예정' : `${daysUntilNext}일 후 예정`}
              </div>
              <div className="status-sub">예측일: {nextPrediction} · 평균 주기: {avgCycle}일</div>
            </div>
          </div>
        ) : (
          <div className="status-card empty">
            <span className="status-icon">📝</span>
            <div className="status-title">기록을 추가해봐요</div>
          </div>
        )}
      </section>

      <section className="period-form-section">
        <h3>{editing ? '기록 수정' : '새 기록 추가'}</h3>
        <div className="period-form">
          <div className="form-row">
            <label>시작일</label>
            <input
              type="date"
              value={form.start}
              onChange={(e) => setForm((p) => ({ ...p, start: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label>종료일 (선택)</label>
            <input
              type="date"
              value={form.end}
              onChange={(e) => setForm((p) => ({ ...p, end: e.target.value }))}
            />
          </div>
          <div className="form-row symptoms-row">
            <label>증상</label>
            <div className="symptom-chips">
              {SYMPTOMS.map((s) => (
                <button
                  key={s}
                  className={`chip ${form.symptoms.includes(s) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>메모</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="자유롭게 적어봐..."
            />
          </div>
          <div className="form-actions">
            <button className="btn-save" onClick={handleSave} disabled={!form.start}>
              {editing ? '수정 완료' : '추가'}
            </button>
            {editing && (
              <button className="btn-cancel" onClick={() => { setEditing(null); setForm({ start: '', end: '', symptoms: [], notes: '' }) }}>
                취소
              </button>
            )}
          </div>
        </div>
      </section>

      {logs.length > 0 && (
        <section className="period-history">
          <h3>기록 내역 ({logs.length}회)</h3>
          <div className="history-list">
            {[...logs].reverse().map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-dates">
                  <span className="history-start">{entry.start}</span>
                  {entry.end && <span className="history-arrow"> ~ {entry.end}</span>}
                  {entry.start && entry.end && (
                    <span className="history-duration"> ({diffDays(entry.start, entry.end) + 1}일)</span>
                  )}
                </div>
                {entry.symptoms?.length > 0 && (
                  <div className="history-symptoms">
                    {entry.symptoms.map((s) => <span key={s} className="chip small">{s}</span>)}
                  </div>
                )}
                {entry.notes && <div className="history-notes">{entry.notes}</div>}
                <div className="history-actions">
                  <button onClick={() => handleEdit(entry)}>수정</button>
                  <button onClick={() => handleDelete(entry.id)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
