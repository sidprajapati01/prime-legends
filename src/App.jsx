import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Matches from './pages/Matches'
import Reports from './pages/Reports'
import Tournament from './pages/Tournament'
import Teams from './pages/Teams'
import Feedback from './pages/Feedback'
import Leaderboards from './pages/Leaderboards'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/AdminPanel'
import MyPayments from './pages/MyPayments'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matches" element={<Matches />} />
        <Route path="reports" element={<Reports />} />
        <Route path="tournament" element={<Tournament />} />
        <Route path="teams" element={<Teams />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="my-payments" element={<MyPayments />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App