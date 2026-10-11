import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, Swords, Trophy, Target, TrendingUp, ArrowRight,
  Shield, Flame, Loader2, Map, Clock, Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [matches, setMatches] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  const stats = [
    { label: 'Matches Played', value: profile?.matches_played || 0, icon: Swords, color: 'neonGold' },
    { label: 'Total Wins', value: profile?.total_wins || 0, icon: Trophy, color: 'neonGold' },
    { label: 'Total Kills', value: profile?.total_kills || 0, icon: Target, color: 'orangeRed' },
    { label: 'Win Rate', value: profile?.win_rate || '0%', icon: TrendingUp, color: 'neonCyan' },
  ]

  // ═══ Load Data ═══
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)

    // Load upcoming matches
    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['upcoming', 'live'])
      .order('start_time', { ascending: true })
      .limit(5)

    setMatches(matchData || [])

    // Load top players
    const { data: lbData } = await supabase
      .from('leaderboard')
      .select('*, profiles(full_name, ign)')
      .order('points', { ascending: false })
      .limit(5)

    setLeaderboard(lbData || [])
    setLoading(false)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'TBA'
    const d = new Date(timestamp)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Operator'

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl italic tracking-wide">
            COMMAND <span className="neon-text-gold">CENTER</span>
          </h1>
          <p className="mt-2 text-sm font-mono text-white/60">
            Welcome back, <span className="text-neonCyan font-bold">{displayName}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/40 bg-green-500/10 self-start">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase">
            Online
          </span>
        </div>
      </motion.div>

      {/* Warning Banner — only if profile incomplete */}
      {(!profile?.ign || !profile?.ff_uid) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 mb-8 border-neonGold/40 flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-neonGold/10 border border-neonGold/30 flex-shrink-0">
            <AlertTriangle size={22} className="text-neonGold" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-neonGold text-sm tracking-wider uppercase">
              Gaming Profile Incomplete
            </h3>
            <p className="text-xs font-mono text-white/60 mt-1">
              Please add your In-Game Name (IGN) and Free Fire UID so squad leaders and admins can verify you for tournament operations.
            </p>
          </div>
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all flex-shrink-0"
          >
            Set In-Game Details
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="glass-card p-5 hover:scale-105 transition-transform"
          >
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
                {s.label}
              </p>
              <div className={`p-2 rounded-md bg-${s.color}/10 border border-${s.color}/30`}>
                <s.icon size={16} className={`text-${s.color}`} />
              </div>
            </div>
            <p className="mt-3 font-display font-black text-4xl italic text-white">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Two Column: Upcoming + Top Players */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Upcoming Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orangeRed" />
              <h2 className="font-display font-bold italic text-lg tracking-wide">
                Upcoming <span className="neon-text-cyan">Operations</span>
              </h2>
            </div>
            <Link
              to="/matches"
              className="text-xs font-mono font-bold text-neonCyan hover:text-neonGold transition flex items-center gap-1"
            >
              View All Matches <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <Loader2 size={32} className="text-neonCyan animate-spin mx-auto" />
            </div>
          ) : matches.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-lg">
              <p className="text-sm font-mono text-white/40">
                No upcoming operations scheduled right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => (
                <Link
                  key={m.id}
                  to="/matches"
                  className="block p-4 rounded-md border border-white/10 hover:border-neonCyan/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-white">{m.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-mono text-white/50">
                        <span className="flex items-center gap-1">
                          <Map size={10} className="text-neonCyan" /> {m.map}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={10} className="text-neonCyan" /> {m.mode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-neonCyan" /> {formatDate(m.start_time)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-white/40 uppercase">Prize</p>
                      <p className="font-display font-bold text-green-400">₹{m.prize_pool}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-neonGold" />
              <h2 className="font-display font-bold italic text-lg tracking-wide">
                Top <span className="neon-text-gold">Players</span>
              </h2>
            </div>
            <Link
              to="/leaderboards"
              className="text-xs font-mono text-neonGold/70 hover:text-neonGold transition"
            >
              All →
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <Loader2 size={24} className="text-neonGold animate-spin mx-auto" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs font-mono text-white/40">
                No rankings recorded yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {leaderboard.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition"
                >
                  <span className="font-display font-black text-lg text-neonGold w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">
                      {p.profiles?.ign || p.profiles?.full_name || 'Unknown'}
                    </p>
                    <p className="text-[10px] font-mono text-white/40">
                      {p.kills} kills • {p.wins} wins
                    </p>
                  </div>
                  <span className="font-display font-bold text-xs text-neonGold">
                    {p.points}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Ready to Battle CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-8 text-center border-neonCyan/30"
      >
        <div className="inline-flex p-3 rounded-full bg-neonCyan/10 border border-neonCyan/40 mb-4">
          <Shield size={28} className="text-neonCyan" />
        </div>

        <h2 className="font-display font-black text-2xl md:text-3xl italic">
          READY TO <span className="neon-text-cyan">BATTLE</span>?
        </h2>
        <p className="mt-3 text-sm font-mono text-white/60 max-w-md mx-auto">
          Assemble your squad, select your map, and join active Free Fire tournaments.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/teams"
            className="px-6 py-3 font-display font-bold text-xs tracking-wider uppercase rounded-md border-2 border-white/30 text-white hover:border-white hover:bg-white/5 transition-all"
          >
            Manage Squad
          </Link>
          <Link
            to="/matches"
            className="px-6 py-3 font-display font-bold text-xs tracking-wider uppercase rounded-md text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition-all"
          >
            Join Active Match
          </Link>
        </div>
      </motion.div>

    </div>
  )
}