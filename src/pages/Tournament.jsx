import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy, Loader2, Users, Coins, Calendar, Clock, Target, Map
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Tournament() {
  const [activeTab, setActiveTab] = useState('live')
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'live', label: 'Live Tournaments' },
    { id: 'past', label: 'Past Events' },
  ]

  useEffect(() => {
    loadTournaments()
  }, [activeTab])

  const loadTournaments = async () => {
    setLoading(true)

    const statusFilter = activeTab === 'live'
      ? ['upcoming', 'live']
      : ['completed']

    const { data } = await supabase
      .from('matches')
      .select('*')
      .in('status', statusFilter)
      .order('created_at', { ascending: false })

    setTournaments(data || [])
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="font-display font-black text-4xl md:text-5xl italic tracking-wide">
          ACTIVE <span className="neon-text-gold">TOURNAMENTS</span>
        </h1>
        <p className="mt-3 text-sm font-mono text-white/50">
          Compete with the best, win real prizes, claim your glory
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex glass-card p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 font-display font-bold text-xs tracking-wider uppercase rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neonGold to-gold text-black shadow-glow-gold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={48} className="text-neonGold animate-spin mb-4" />
          <p className="text-sm font-mono text-white/50">Loading tournaments...</p>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <Trophy size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            {activeTab === 'live'
              ? 'No live tournaments right now. Stay tuned!'
              : 'No past events to display.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tournaments.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:scale-[1.02] transition-transform"
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase ${
                    t.status === 'live'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : t.status === 'completed'
                      ? 'bg-white/10 text-white/60 border border-white/20'
                      : 'bg-neonGold/20 text-neonGold border border-neonGold/40'
                  }`}
                >
                  {t.status === 'live' && (
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse mr-2" />
                  )}
                  {t.status}
                </div>

                <div className="p-2 rounded-md bg-neonGold/10 border border-neonGold/30">
                  <Trophy size={16} className="text-neonGold" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-xl text-white mb-3">
                {t.title}
              </h3>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Map size={12} className="text-neonGold" />
                  {t.map}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Users size={12} className="text-neonGold" />
                  {t.mode}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Clock size={12} className="text-neonGold" />
                  {t.max_slots} slots
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Calendar size={12} className="text-neonGold" />
                  {formatDate(t.start_time)}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Entry</p>
                  <p className="font-display font-bold text-neonGold">₹{t.entry_fee}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Prize</p>
                  <p className="font-display font-bold text-green-400">₹{t.prize_pool}</p>
                </div>
              </div>

              {/* Join Button */}
              {t.status === 'upcoming' && (
                <button className="w-full mt-4 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all">
                  Register Team
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {[
          { icon: Calendar, label: 'Schedule',   value: 'Daily at 8 PM IST' },
          { icon: Users,    label: 'Format',     value: 'Squad (4v4) & Solo' },
          { icon: Coins,    label: 'Prize Pool', value: 'Up to 10,000 diamonds' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className="p-3 rounded-lg bg-neonGold/10 border border-neonGold/30">
              <item.icon size={20} className="text-neonGold" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
                {item.label}
              </p>
              <p className="text-sm font-display font-bold text-white mt-1">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}