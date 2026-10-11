import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Bell, LogOut, User, Trophy, Users, BarChart3, Home,
  MessageSquare, Target, FileText, DollarSign, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
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
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-neonGold/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

          {/* LEFT: Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* CENTER: Nav Items — Desktop only */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-2 text-[10px] xl:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 rounded-md whitespace-nowrap ${
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

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Notification bell — hidden on very small screens */}
            <button className="relative p-2 rounded-md hover:bg-neonGold/10 transition-colors hidden xs:block">
              <Bell size={16} className="text-white/80" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orangeRed animate-pulse" />
            </button>

            {/* Operator card — Desktop only */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md border border-neonCyan/40 bg-neonCyan/5 hover:bg-neonCyan/10 transition-all">
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neonGold to-neonCyan flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-black font-display">
                      {getInitials()}
                    </span>
                  </div>
                  <div className="hidden lg:flex flex-col leading-none max-w-[120px]">
                    <span className="text-[9px] font-mono text-neonCyan/70 uppercase">
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
                  <LogOut size={13} className="text-orangeRed" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-md border border-neonGold/40 bg-neonGold/5 hover:bg-neonGold/10 transition-all"
              >
                <User size={14} className="text-neonGold" />
                <span className="text-xs font-bold text-neonGold">Login</span>
              </Link>
            )}

            {/* HAMBURGER — Mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md border border-white/10 hover:border-neonGold/40 hover:bg-neonGold/5 transition"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X size={18} className="text-neonGold" />
              ) : (
                <Menu size={18} className="text-neonGold" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU — Full screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute top-14 right-0 bottom-0 w-full max-w-sm bg-black/95 backdrop-blur-xl border-l border-neonGold/30 overflow-y-auto">
            {/* User info (mobile) */}
            {user && (
              <div className="p-4 border-b border-white/10">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg bg-neonCyan/5 border border-neonCyan/30"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neonGold to-neonCyan flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black font-display">
                      {getInitials()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-neonCyan/70 uppercase">
                      Operator
                    </p>
                    <p className="text-sm font-bold text-white truncate">
                      {getDisplayName()}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full mt-3 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-red-400 border border-red-500/40 hover:bg-red-500/10 transition flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}

            {/* Nav Items */}
            <div className="p-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md mb-1 transition-all ${
                      isActive
                        ? 'bg-neonGold/10 text-neonGold border border-neonGold/40'
                        : 'text-white/80 hover:text-neonGold hover:bg-neonGold/5 border border-transparent'
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span className="text-sm font-mono font-bold tracking-wider uppercase">
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </div>

            {/* Login for guests */}
            {!user && (
              <div className="p-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold"
                >
                  <User size={14} />
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}