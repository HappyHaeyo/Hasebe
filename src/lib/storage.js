const TODAY = () => new Date().toISOString().slice(0, 10)

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('omamori_settings') || '{}')
  } catch {
    return {}
  }
}

export function saveSettings(data) {
  localStorage.setItem('omamori_settings', JSON.stringify(data))
}

export function getTodayLog() {
  return getDayLog(TODAY())
}

export function getDayLog(date) {
  try {
    const all = JSON.parse(localStorage.getItem('omamori_logs') || '{}')
    return all[date] || {
      sleep: { bedtime: '', wakeTime: '', hours: null },
      meals: { breakfast: false, lunch: false, dinner: false, notes: '' },
      water: 0,
      steps: 0,
      meds: [],
      mood: null,
      moodNote: '',
    }
  } catch {
    return {}
  }
}

export function saveTodayLog(patch) {
  const date = TODAY()
  const all = JSON.parse(localStorage.getItem('omamori_logs') || '{}')
  all[date] = { ...getDayLog(date), ...patch }
  localStorage.setItem('omamori_logs', JSON.stringify(all))
}

export function getRecentLogs(days = 7) {
  try {
    const all = JSON.parse(localStorage.getItem('omamori_logs') || '{}')
    const result = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const date = d.toISOString().slice(0, 10)
      if (all[date]) result.push({ date, ...all[date] })
    }
    return result
  } catch {
    return []
  }
}

export function getTodos() {
  try {
    return JSON.parse(localStorage.getItem('omamori_todos') || '[]')
  } catch {
    return []
  }
}

export function saveTodos(todos) {
  localStorage.setItem('omamori_todos', JSON.stringify(todos))
}

export function getMoodLogs() {
  try {
    const all = JSON.parse(localStorage.getItem('omamori_logs') || '{}')
    return Object.entries(all)
      .filter(([, v]) => v.mood != null)
      .map(([date, v]) => ({ date, mood: v.mood, note: v.moodNote }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
  } catch {
    return []
  }
}
