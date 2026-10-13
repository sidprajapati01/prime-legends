import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

// ═══ LAZY LOAD ALL PAGES ═══
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

// ═══ LOADING FALLBACK ═══
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
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
        {/* ═══ PUBLIC ROUTES (No login required) ═══ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ═══ PROTECTED ROUTES (Login required) ═══ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="matches" element={<Matches />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tournament" element={<Tournament />} />
          <Route path="teams" element={<Teams />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="leaderboards" element={<Leaderboards />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-payments" element={<MyPayments />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App