import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Matches = lazy(() => import('./pages/Matches'))
const Reports = lazy(() => import('./pages/Reports'))
const Tournament = lazy(() => import('./pages/Tournament'))
const Teams = lazy(() => import('./pages/Teams'))
const Feedback = lazy(() => import('./pages/Feedback'))
const Leaderboards = lazy(() => import('./pages/Leaderboards'))
const Profile = lazy(() => import('./pages/Profile'))
const MyPayments = lazy(() => import('./pages/MyPayments'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-darkBg">
      <Loader2 size={48} className="text-neonGold animate-spin" />
      <p className="text-xs font-mono text-white/50 tracking-widest uppercase">
        Loading...
      </p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ═══ AUTH PAGES (No layout) ═══ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ═══ MAIN LAYOUT ═══ */}
        <Route path="/" element={<MainLayout />}>
          {/* Landing — Protected (login jaruri) */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          {/* Other pages — Protected */}
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="tournament" element={<ProtectedRoute><Tournament /></ProtectedRoute>} />
          <Route path="teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="leaderboards" element={<ProtectedRoute><Leaderboards /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="my-payments" element={<ProtectedRoute><MyPayments /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App