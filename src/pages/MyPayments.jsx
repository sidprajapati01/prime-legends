import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Loader2, CheckCircle2, XCircle, Clock,
  Target, Users, ExternalLink, RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MyPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    loadPayments()
  }, [user])

  const loadPayments = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        matches (title, map, mode, start_time),
        teams (name)
      `)
      .eq('player_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setPayments(data || [])
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

  const getStatusStyle = (status) => {
    if (status === 'approved') {
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/40',
        text: 'text-green-400',
        icon: CheckCircle2,
        label: 'Approved',
      }
    }
    if (status === 'rejected') {
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        text: 'text-red-400',
        icon: XCircle,
        label: 'Rejected',
      }
    }
    return {
      bg: 'bg-neonGold/10',
      border: 'border-neonGold/40',
      text: 'text-neonGold',
      icon: Clock,
      label: 'Pending',
    }
  }

  const filtered = filter === 'all'
    ? payments
    : payments.filter((p) => p.status === filter)

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === 'pending').length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl italic tracking-wide">
            MY <span className="neon-text-gold">PAYMENTS</span>
          </h1>
          <p className="mt-2 text-sm font-mono text-white/60">
            Track your tournament entry payments
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="p-3 rounded-md border border-neonCyan/40 bg-neonCyan/5 hover:bg-neonCyan/10 transition"
          title="Refresh"
        >
          <RefreshCw size={18} className="text-neonCyan" />
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',    value: stats.total,    color: 'text-white' },
          { label: 'Pending',  value: stats.pending,  color: 'text-neonGold' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
              {s.label}
            </p>
            <p className={`mt-2 font-display font-black text-3xl italic ${s.color}`}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'all',      label: 'All' },
          { id: 'pending',  label: 'Pending' },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-md font-display font-bold text-xs tracking-wider uppercase transition-all whitespace-nowrap ${
              filter === f.id
                ? 'bg-gradient-to-r from-neonGold to-gold text-black shadow-glow-gold'
                : 'text-white/60 border border-white/10 hover:border-neonGold/40 hover:text-neonGold'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={48} className="text-neonGold animate-spin mb-4" />
          <p className="text-sm font-mono text-white/50">Loading payments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <DollarSign size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            {filter === 'all'
              ? 'No payments yet. Register for a match to get started!'
              : `No ${filter} payments.`}
          </p>
          {filter === 'all' && (
            <Link
              to="/matches"
              className="inline-block mt-6 px-6 py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition"
            >
              Browse Matches
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p, i) => {
            const status = getStatusStyle(p.status)
            const StatusIcon = status.icon

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-5 border ${status.border}`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">

                  {/* LEFT: Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-md bg-neonCyan/10 border border-neonCyan/30">
                        <Target size={16} className="text-neonCyan" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">
                          {p.matches?.title || 'Unknown Match'}
                        </h3>
                        <p className="text-[10px] font-mono text-white/40">
                          {formatDate(p.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-white/60">
                        <Users size={12} className="text-neonCyan" />
                        Team: <span className="text-white">{p.team_name || p.teams?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <DollarSign size={12} className="text-neonGold" />
                        Amount: <span className="text-neonGold font-bold">₹{p.amount}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                      <span className="text-white/40">UTR:</span>
                      <span className="text-white/80">{p.utr_number || '—'}</span>
                    </div>

                    {/* Admin Note */}
                    {p.admin_note && (
                      <div className={`mt-3 p-3 rounded-md ${status.bg} border ${status.border}`}>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider ${status.text}">
                          Admin Note
                        </p>
                        <p className="text-xs font-mono text-white/70 mt-1">
                          {p.admin_note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Status + Screenshot */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} border ${status.border}`}>
                      <StatusIcon size={14} className={status.text} />
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Screenshot Link */}
                    {p.screenshot_url && (
                      <a
                        href={p.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neonCyan/40 bg-neonCyan/5 hover:bg-neonCyan/10 transition text-xs font-mono text-neonCyan"
                      >
                        <ExternalLink size={12} />
                        View Screenshot
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Info Bottom */}
      {payments.length > 0 && (
        <div className="mt-8 p-4 rounded-md border border-neonCyan/20 bg-neonCyan/5">
          <p className="text-xs font-mono text-white/60 text-center">
            💡 Payments are verified by admins. Check back in a few hours for status updates.
          </p>
        </div>
      )}

    </div>
  )
}