import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader2, Target, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadReports()
  }, [user])

  const loadReports = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('payments')
      .select(`
        *,
        matches (title, map, mode, start_time)
      `)
      .eq('player_id', user.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    setReports(data || [])
    setLoading(false)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl italic tracking-wide">
          MATCH <span className="neon-text-cyan">REPORTS</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-mono text-white/50 px-4">
          Detailed statistics and results from past battles.
        </p>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-32">
          <Loader2 size={40} className="text-neonCyan animate-spin mb-4" />
          <p className="text-xs sm:text-sm font-mono text-white/50">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-16 sm:py-24 text-center border border-dashed border-white/10 rounded-xl mx-2">
          <FileText size={48} className="text-white/20 mx-auto mb-4 sm:w-14 sm:h-14" />
          <p className="text-xs sm:text-sm font-mono text-white/40 px-4">
            No reports available yet. Complete a match to see your stats.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-md bg-neonCyan/10 border border-neonCyan/30 flex-shrink-0">
                    <Target size={16} className="text-neonCyan sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                      {r.matches?.title || r.match_title || 'Unknown Match'}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-mono text-white/50 mt-0.5 truncate">
                      {r.matches?.map} • {r.matches?.mode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-white/40 uppercase">Amount</p>
                    <p className="text-neonGold font-bold">₹{r.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] sm:text-[10px] text-white/40 uppercase">Date</p>
                    <p className="text-white/70 text-[10px] sm:text-xs">{formatDate(r.created_at)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
        {[
          { label: 'Kills',      value: '—' },
          { label: 'Damage',     value: '—' },
          { label: 'Placement',  value: '—' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card p-4 sm:p-5"
          >
            <p className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
              {item.label}
            </p>
            <p className="mt-1.5 sm:mt-2 font-display font-black text-2xl sm:text-3xl italic text-white">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  )
}