import { useState } from 'react'
import './Settings.css'

export default function Settings({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey)
  const [show, setShow] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (key.trim()) onSave(key.trim())
  }

  const handleClear = () => {
    setKey('')
    localStorage.removeItem('gemini_api_key')
    onSave('')
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>설정</h2>
          {currentKey && (
            <button className="close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="field-label">
            Gemini API Key
            <small>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                발급 받기 ↗
              </a>
            </small>
          </label>
          <div className="input-row">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIza..."
              autoFocus
              className="key-input"
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShow(!show)}
              title={show ? '숨기기' : '보기'}
            >
              {show ? '🙈' : '👁'}
            </button>
          </div>

          <div className="modal-footer">
            {currentKey && (
              <button type="button" className="btn-danger" onClick={handleClear}>
                키 삭제
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={!key.trim()}>
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
