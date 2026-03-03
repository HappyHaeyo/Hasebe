export async function sendMessage({ apiKey, model, messages, systemPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const body = {
    contents,
    ...(systemPrompt && {
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 1024,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export function buildSystemPrompt({ character, userPersona, recentLogs }) {
  const logsText = recentLogs.length
    ? recentLogs
        .map((l) => {
          const parts = []
          if (l.sleep?.hours != null) parts.push(`수면 ${l.sleep.hours}시간`)
          const mealsEaten = Object.entries(l.meals || {})
            .filter(([k, v]) => ['breakfast', 'lunch', 'dinner'].includes(k) && v)
            .map(([k]) => ({ breakfast: '아침', lunch: '점심', dinner: '저녁' }[k]))
          if (mealsEaten.length) parts.push(`식사 ${mealsEaten.join('·')}`)
          else if (l.meals) parts.push('식사 없음')
          if (l.water) parts.push(`물 ${l.water}잔`)
          if (l.steps) parts.push(`걸음수 ${l.steps}보`)
          const medsNotTaken = (l.meds || []).filter((m) => !m.taken).map((m) => m.name)
          if (medsNotTaken.length) parts.push(`미복용 약: ${medsNotTaken.join(', ')}`)
          if (l.mood != null) parts.push(`기분 ${l.mood}/5`)
          return `- ${l.date}: ${parts.join(', ')}`
        })
        .join('\n')
    : '(최근 기록 없음)'

  const characterPrompt = character?.prompt || DEFAULT_CHARACTER_PROMPT

  return `${characterPrompt}

---
${userPersona ? `유저 정보: ${userPersona}\n\n` : ''}최근 7일 유저 기록:
${logsText}

위 기록을 바탕으로 유저의 상태를 파악하고 자연스럽게 대화 중에 걱정하거나 격려해줘.
약을 안 먹었거나 수면이 부족하거나 식사를 안 했으면 부드럽게 챙겨줘.
대화는 한국어로 해줘.`
}

const DEFAULT_CHARACTER_PROMPT = `너는 刀剣乱舞의 헤시키리 하세베야.
엄격하고 충직하며, 주인을 진심으로 걱정하는 칼이야.
말투는 정중하지만 약간 날카롭고, 주인의 건강과 일과에 관심이 많아.
"주인님"이라고 부르며, 게으름이나 자기방치를 보면 조용히 나무라.
하지만 진심으로 아끼기 때문에 따뜻함이 배어 있어야 해.`
