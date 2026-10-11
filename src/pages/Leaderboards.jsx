import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Award, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Leaderboards() {
  const [season, setSeason] = useState('all')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const seasons = [
    { id: 'all',    label: 'All Time' },
    { id: 'season', label: 'This Season' },
    { id: 'week',   label: 'This Week' },
  ]

  useEffect(() => {
    loadLeaderboard()
  }, [season])

  const loadLeaderboard = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('leaderboard')
      .select(`
        *,
        profiles (
          id,
          full_name,
          ign,
          avatar_url
        )
      `)
      .order('points', { ascending: false })
      .limit(50)

    setPlayers(data || [])
    setLoading(false)
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={18} className="text-neonGold" />
    if (rank === 2) return <Medal size={18} className="text-white/70" />
    if (rank === 3) return <Award size={18} className="text-orangeRed" />
    return null
  }

  const getRankStyle = (rank) => {
    if (rank === 1) return 'border-neonGold/50 bg-neonGold/5 shadow-glow-gold'
    if (rank === 2) return 'border-white/30 bg-white/5'
    if (rank === 3) return 'border-orangeRed/50 bg-orangeRed/5'
    return 'border-white/10 hover:border-neonGold/30'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="font-display font-black text-4xl md:text-5xl italic tracking-wide">
          GLOBAL <span className="neon-text-gold">LEADERBOARDS</span>
        </h1>
        <p className="mt-3 text-sm font-mono text-white/50">
          Top operators of the season — climb the ranks, claim the glory
        </p>
      </motion.div>

      {/* Season Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex glass-card p-1.5">
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              className={`px-5 py-2 font-display font-bold text-xs tracking-wider uppercase rounded-md transition-all ${
                season === s.id
                  ? 'bg-gradient-to-r from-neonGold to-gold text-black shadow-glow-gold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={48} className="text-neonGold animate-spin" />
        </div>
      ) : players.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <Trophy size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            No rankings recorded yet. Play matches to get ranked!
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
            <div className="col-span-1 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">Rank</div>
            <div className="col-span-4 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">Player</div>
            <div className="col-span-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase hidden md:block">Matches</div>
            <div className="col-span-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">Wins</div>
            <div className="col-span-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase hidden md:block">Kills</div>
            <div className="col-span-1 text-[10px] font-mono font-bold tracking-widest text-neonGold uppercase text-right">Pts</div>
          </div>

          {/* Rows */}
          {players.map((p, i) => {
            const rank = i + 1
            const profile = p.profiles || {}
            const displayName = profile.ign || profile.full_name || 'Unknown'

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 items-center transition-all ${getRankStyle(rank)}`}
              >
                <div className="col-span-1 flex items-center gap-1.5">
                  <span className="font-display font-black text-lg text-white">{rank}</span>
                  {getRankIcon(rank)}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neonGold to-neonCyan flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-black font-display">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-white truncate">
                      {displayName}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 hidden md:block font-mono text-sm text-white/70">{p.matches}</div>
                <div className="col-span-2 font-mono text-sm text-green-400">{p.wins}</div>
                <div className="col-span-2 hidden md:block font-mono text-sm text-orangeRed">{p.kills}</div>
                <div className="col-span-1 text-right font-display font-bold text-sm neon-text-gold">{p.points}</div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { label: 'Active Players', value: players.length || '—' },
          { label: 'Total Points',   value: players.reduce((s, p) => s + (p.points || 0), 0) || '—' },
          { label: 'Total Kills',    value: players.reduce((s, p) => s + (p.kills || 0), 0) || '—' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">{s.label}</p>
            <p className="mt-2 font-display font-black text-2xl italic text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

    </div>
  )
}