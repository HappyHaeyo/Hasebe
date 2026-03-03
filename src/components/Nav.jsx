import { NavLink } from 'react-router-dom'
import './Nav.css'

const TABS = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/chat', label: '대화', icon: '💬' },
  { to: '/diet', label: '식단', icon: '🍱' },
  { to: '/sleep', label: '수면', icon: '🌙' },
  { to: '/exercise', label: '운동', icon: '👟' },
  { to: '/medication', label: '약', icon: '💊' },
  { to: '/mood', label: '기분', icon: '💭' },
  { to: '/schedule', label: '일정', icon: '📋' },
  { to: '/settings', label: '설정', icon: '⚙️' },
]

export default function Nav() {
  return (
    <nav className="bottom-nav">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
