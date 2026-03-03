import { useState, useEffect } from 'react'
import { getTodos, saveTodos } from '../lib/storage'
import './Schedule.css'

export default function Schedule() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setTodos(getTodos())
  }, [])

  function save(next) {
    setTodos(next)
    saveTodos(next)
  }

  function addTodo() {
    if (!input.trim()) return
    save([
      { id: Date.now(), text: input.trim(), done: false, date: new Date().toISOString().slice(0, 10) },
      ...todos,
    ])
    setInput('')
  }

  function toggleTodo(id) {
    save(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTodo(id) {
    save(todos.filter((t) => t.id !== id))
  }

  function handleKey(e) {
    if (e.key === 'Enter') addTodo()
  }

  const filtered =
    filter === 'all' ? todos
    : filter === 'done' ? todos.filter((t) => t.done)
    : todos.filter((t) => !t.done)

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div className="schedule-page">
      <h2>일정 · 할 일</h2>

      <div className="todo-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="할 일 추가..."
        />
        <button onClick={addTodo} disabled={!input.trim()}>추가</button>
      </div>

      <div className="todo-filters">
        {['all', 'todo', 'done'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `전체 (${todos.length})` : f === 'todo' ? `할 일 (${todos.length - doneCount})` : `완료 (${doneCount})`}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filtered.length === 0 && (
          <li className="todo-empty">비어 있어요.</li>
        )}
        {filtered.map((t) => (
          <li key={t.id} className={`todo-item ${t.done ? 'done' : ''}`}>
            <button className="todo-check" onClick={() => toggleTodo(t.id)}>
              {t.done ? '✓' : '○'}
            </button>
            <span className="todo-text">{t.text}</span>
            <span className="todo-date">{t.date}</span>
            <button className="todo-delete" onClick={() => deleteTodo(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
