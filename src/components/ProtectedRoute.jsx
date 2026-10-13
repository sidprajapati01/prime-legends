import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg">
        <Loader2 size={48} className="text-neonGold animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />
  }

  return children
}