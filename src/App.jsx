import { useState, useEffect } from 'react'
import Chat from './components/Chat.jsx'
import Settings from './components/Settings.jsx'
import './App.css'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!apiKey) setShowSettings(true)
  }, [])

  const handleSaveKey = (key) => {
    localStorage.setItem('gemini_api_key', key)
    setApiKey(key)
    setShowSettings(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">Hasebe Chat</span>
        <button className="settings-btn" onClick={() => setShowSettings(true)} title="설정">
          ⚙
        </button>
      </header>

      <main className="app-main">
        {apiKey ? (
          <Chat apiKey={apiKey} />
        ) : (
          <div className="no-key-notice">
            <p>API 키를 설정해 주세요.</p>
          </div>
        )}
      </main>

      {showSettings && (
        <Settings
          currentKey={apiKey}
          onSave={handleSaveKey}
          onClose={() => apiKey && setShowSettings(false)}
        />
      )}
    </div>
  )
}
