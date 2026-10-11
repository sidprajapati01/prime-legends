import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-darkBg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neonGold/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neonCyan/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass-card p-8 border-neonGold/30 shadow-glow-gold"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" showText={true} />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display font-black text-3xl italic tracking-wide text-white">
            WELCOME <span className="neon-text-gold">BACK</span>
          </h1>
          <p className="mt-2 text-xs font-mono text-white/50">
            Sign in to continue to your command center
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md border border-red-500/40 bg-red-500/10">
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
              Email Address
            </span>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonGold/60 focus:shadow-glow-gold transition"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
              Password
            </span>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonGold/60 focus:shadow-glow-gold transition"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-md font-display font-bold text-xs tracking-widest uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-3 rounded-md font-mono font-bold text-xs tracking-wider text-white border border-white/15 hover:border-neonCyan/60 hover:bg-neonCyan/5 transition flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center space-y-2">
          <button
            type="button"
            className="block w-full text-xs font-mono text-neonCyan hover:text-neonGold transition"
          >
            Forgot Password?
          </button>
          <p className="text-xs font-mono text-white/50">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neonGold hover:text-neonCyan font-bold transition">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}