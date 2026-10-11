import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Bell, LogOut, User, Trophy, Users, BarChart3, Home,
  MessageSquare, Target, FileText, DollarSign
} from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { name: 'Dashboard',    path: '/dashboard',    icon: Home },
  { name: 'Matches',      path: '/matches',      icon: Target },
  { name: 'My Payments',  path: '/my-payments',  icon: DollarSign },
  { name: 'Reports',      path: '/reports',      icon: FileText },
  { name: 'Tournament',   path: '/tournament',   icon: Trophy },
  { name: 'Teams',        path: '/teams',        icon: Users },
  { name: 'Leaderboards', path: '/leaderboards', icon: BarChart3 },
  { name: 'Feedback',     path: '/feedback',     icon: MessageSquare },
]

export default function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const getDisplayName = () => {
    if (profile?.ign) return profile.ign
    if (profile?.full_name) return profile.full_name
    if (user?.email) return user.email.split('@')[0]
    return 'Guest'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-neonGold/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo size="md" />
        </Link>

        {/* CENTER: Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 rounded-md ${
                  isActive
                    ? 'text-neonGold bg-neonGold/10 shadow-glow-gold'
                    : 'text-white/70 hover:text-neonGold hover:bg-neonGold/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Operator Card */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative p-2 rounded-md hover:bg-neonGold/10 transition-colors">
            <Bell size={18} className="text-white/80" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orangeRed animate-pulse" />
          </button>

          {/* Operator card — DYNAMIC */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-neonCyan/40 bg-neonCyan/5 hover:bg-neonCyan/10 transition-all">
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neonGold to-neonCyan flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black font-display">
                    {getInitials()}
                  </span>
                </div>

                <div className="flex flex-col leading-none max-w-[140px]">
                  <span className="text-[10px] font-mono text-neonCyan/70 uppercase">
                    Operator
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {getDisplayName()}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-1 p-1 rounded hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={14} className="text-orangeRed" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md border border-neonGold/40 bg-neonGold/5 hover:bg-neonGold/10 transition-all"
            >
              <User size={14} className="text-neonGold" />
              <span className="text-xs font-bold text-neonGold">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neonGold/20 bg-black/95">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="block px-4 py-3 text-sm font-mono text-white/80 hover:text-neonGold hover:bg-neonGold/5"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}