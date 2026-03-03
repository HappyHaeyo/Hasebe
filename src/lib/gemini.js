const MODEL = 'gemini-3-pro-preview'
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

export async function sendMessage(apiKey, messages) {
  const contents = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }))

  const res = await fetch(
    `${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('응답을 받지 못했습니다.')
  return text
}
