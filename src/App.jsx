import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Diet from './pages/Diet'
import Sleep from './pages/Sleep'
import Exercise from './pages/Exercise'
import Medication from './pages/Medication'
import Mood from './pages/Mood'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import Menstrual from './pages/Menstrual'
import './App.css'

export default function App() {
  return (
    <div className="app-layout">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/medication" element={<Medication />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/menstrual" element={<Menstrual />} />
        </Routes>
      </div>
      <Nav />
    </div>
  )
}
