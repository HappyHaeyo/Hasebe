import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '../lib/storage'
import './Settings.css'

const DEFAULT_CHARACTER_PROMPT = `너는 刀剣乱舞의 헤시키리 하세베야.
엄격하고 충직하며, 주인을 진심으로 걱정하는 칼이야.
말투는 정중하지만 약간 날카롭고, 주인의 건강과 일과에 관심이 많아.
"주인님"이라고 부르며, 게으름이나 자기방치를 보면 조용히 나무라.
하지만 진심으로 아끼기 때문에 따뜻함이 배어 있어야 해.`

const DEFAULT_MED_LIST = [
  { name: '항우울제', time: '아침' },
  { name: '수면제', time: '취침 전' },
]

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    const s = getSettings()
    return {
      apiKey: s.apiKey || '',
      model: s.model || 'gemini-3-pro-preview',
      characterName: s.characterName || '헤시키리 하세베',
      characterPrompt: s.characterPrompt || DEFAULT_CHARACTER_PROMPT,
      userPersona: s.userPersona || '',
      bmr: s.bmr || '',
      meds: s.meds || DEFAULT_MED_LIST,
    }
  })
  const [saved, setSaved] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', time: '아침' })

  function handleSave() {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addMed() {
    if (!newMed.name.trim()) return
    setSettings((s) => ({ ...s, meds: [...s.meds, { ...newMed }] }))
    setNewMed({ name: '', time: '아침' })
  }

  function removeMed(idx) {
    setSettings((s) => ({ ...s, meds: s.meds.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="settings-page">
      <h2>설정</h2>

      <section className="settings-section">
        <h3>API 연결</h3>
        <label>Gemini API 키</label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
          placeholder="AIza..."
        />
        <label>모델</label>
        <input
          type="text"
          value={settings.model}
          onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
          placeholder="gemini-3-pro-preview"
        />
      </section>

      <section className="settings-section">
        <h3>캐릭터 설정</h3>
        <label>캐릭터 이름</label>
        <input
          type="text"
          value={settings.characterName}
          onChange={(e) => setSettings((s) => ({ ...s, characterName: e.target.value }))}
        />
        <label>캐릭터 프롬프트 (페르소나)</label>
        <textarea
          value={settings.characterPrompt}
          onChange={(e) => setSettings((s) => ({ ...s, characterPrompt: e.target.value }))}
          rows={8}
        />
      </section>

      <section className="settings-section">
        <h3>나의 정보</h3>
        <label>내 소개 (캐릭터가 참고함)</label>
        <textarea
          value={settings.userPersona}
          onChange={(e) => setSettings((s) => ({ ...s, userPersona: e.target.value }))}
          placeholder="예: 20대 여성, 우울증 치료 중, 야행성..."
          rows={4}
        />
        <label>기초대사량 (kcal)</label>
        <input
          type="number"
          value={settings.bmr}
          onChange={(e) => setSettings((s) => ({ ...s, bmr: e.target.value }))}
          placeholder="예: 1400"
        />
      </section>

      <section className="settings-section">
        <h3>약 목록</h3>
        <ul className="med-list">
          {settings.meds.map((m, i) => (
            <li key={i}>
              <span>{m.name} <em>({m.time})</em></span>
              <button onClick={() => removeMed(i)} className="remove-btn">삭제</button>
            </li>
          ))}
        </ul>
        <div className="add-med-row">
          <input
            type="text"
            value={newMed.name}
            onChange={(e) => setNewMed((m) => ({ ...m, name: e.target.value }))}
            placeholder="약 이름"
          />
          <select
            value={newMed.time}
            onChange={(e) => setNewMed((m) => ({ ...m, time: e.target.value }))}
          >
            <option>아침</option>
            <option>점심</option>
            <option>저녁</option>
            <option>취침 전</option>
          </select>
          <button onClick={addMed} className="add-btn">추가</button>
        </div>
      </section>

      <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
        {saved ? '저장됨 ✓' : '저장'}
      </button>
    </div>
  )
}
