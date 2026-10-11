import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Plus, Users, Trophy, DollarSign, Target,
  Loader2, CheckCircle2, XCircle, Trash2, Clock,
  ExternalLink, TrendingUp, Filter, Crown
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('matches')
  const [matches, setMatches] = useState([])
  const [payments, setPayments] = useState([])
  const [paymentFilter, setPaymentFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [newMatch, setNewMatch] = useState({
    title: '',
    map: 'Bermuda',
    mode: 'Squad',
    entry_fee: 0,
    prize_pool: 0,
    max_slots: 48,
    start_time: '',
  })

  // ═══ Declare Result State ═══
  const [showResultModal, setShowResultModal] = useState(false)
  const [selectedResultMatch, setSelectedResultMatch] = useState(null)
  const [teams, setTeams] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [resultData, setResultData] = useState({
    winner_team_id: '',
    runner_up_team_id: '',
    top_killer_id: '',
    top_killer_kills: 0,
  })

  // ═══ Load Data ═══
  useEffect(() => {
    if (activeTab === 'matches') loadMatches()
    if (activeTab === 'payments') loadPayments()
  }, [activeTab, paymentFilter])

  const loadMatches = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
    setMatches(data || [])
    setLoading(false)
  }

  const loadPayments = async () => {
    setLoading(true)

    let query = supabase
      .from('payments')
      .select(`
        *,
        profiles:player_id (full_name, ign, email),
        teams:team_id (name),
        matches:match_id (title, map, mode)
      `)
      .order('created_at', { ascending: false })

    if (paymentFilter !== 'all') {
      query = query.eq('status', paymentFilter)
    }

    const { data, error } = await query
    if (!error) setPayments(data || [])
    setLoading(false)
  }

  const loadTeamsAndPlayers = async () => {
    const { data: t } = await supabase.from('teams').select('id, name')
    const { data: p } = await supabase
      .from('profiles')
      .select('id, full_name, ign')
    setTeams(t || [])
    setAllPlayers(p || [])
  }

  const handleOpenResultModal = async (match) => {
    await loadTeamsAndPlayers()
    setSelectedResultMatch(match)
    setResultData({
      winner_team_id: '',
      runner_up_team_id: '',
      top_killer_id: '',
      top_killer_kills: 0,
    })
    setShowResultModal(true)
  }

  const handleDeclareResult = async () => {
    if (!resultData.winner_team_id) {
      setMessage({ type: 'error', text: 'Winner team required' })
      return
    }
    setSaving(true)

    try {
      // 1. Update match with result
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          winner_team_id: resultData.winner_team_id,
          runner_up_team_id: resultData.runner_up_team_id || null,
          top_killer_id: resultData.top_killer_id || null,
          top_killer_kills: resultData.top_killer_kills || 0,
          status: 'completed',
          declared_at: new Date().toISOString(),
        })
        .eq('id', selectedResultMatch.id)

      if (matchError) throw matchError

      // 2. Call award_match_points function
      const { error: awardError } = await supabase.rpc('award_match_points', {
        p_match_id: selectedResultMatch.id,
      })

      if (awardError) throw awardError

      setMessage({ type: 'success', text: 'Result declared! Points awarded.' })
      setShowResultModal(false)
      loadMatches()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  // ═══ Create Match ═══
  const handleCreateMatch = async () => {
    if (!newMatch.title) {
      setMessage({ type: 'error', text: 'Match title required' })
      return
    }
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.from('matches').insert({
        ...newMatch,
        start_time: newMatch.start_time || null,
        created_by: user?.id,
        status: 'upcoming',
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Match created!' })
      setNewMatch({
        title: '',
        map: 'Bermuda',
        mode: 'Squad',
        entry_fee: 0,
        prize_pool: 0,
        max_slots: 48,
        start_time: '',
      })
      loadMatches()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  // ═══ Delete Match ═══
  const handleDeleteMatch = async (id) => {
    if (!confirm('Delete this match?')) return
    try {
      await supabase.from('matches').delete().eq('id', id)
      setMessage({ type: 'success', text: 'Match deleted' })
      loadMatches()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  // ═══ Update Match Status ═══
  const handleStatusChange = async (id, status) => {
    try {
      await supabase.from('matches').update({ status }).eq('id', id)
      setMessage({ type: 'success', text: `Match marked as ${status}` })
      loadMatches()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  // ═══ APPROVE PAYMENT ═══
  const handleApprovePayment = async (paymentId) => {
    if (!confirm('Approve this payment?')) return

    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'approved',
          verified_at: new Date().toISOString(),
          admin_note: 'Verified by admin',
        })
        .eq('id', paymentId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Payment approved!' })
      loadPayments()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  // ═══ REJECT PAYMENT ═══
  const handleRejectPayment = async (paymentId) => {
    const reason = prompt('Rejection reason?', 'Invalid UTR or screenshot')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          verified_at: new Date().toISOString(),
          admin_note: reason,
        })
        .eq('id', paymentId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Payment rejected' })
      loadPayments()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  // ═══ Stats ═══
  const paymentStats = {
    pending: payments.filter((p) => p.status === 'pending').length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
    revenue: payments
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
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
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 rounded-lg bg-orangeRed/10 border border-orangeRed/40">
          <Shield size={24} className="text-orangeRed" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl italic tracking-wide">
            ADMIN <span className="text-orangeRed">PANEL</span>
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Restricted area — operators only
          </p>
        </div>
      </motion.div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md border flex items-center gap-3 ${
            message.type === 'success'
              ? 'border-green-500/40 bg-green-500/10'
              : 'border-red-500/40 bg-red-500/10'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={18} className="text-green-400" />
          ) : (
            <XCircle size={18} className="text-red-400" />
          )}
          <p
            className={`text-sm font-mono ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'matches', label: 'Matches', icon: Target },
          { id: 'payments', label: 'Payments', icon: DollarSign },
          { id: 'tournaments', label: 'Tournaments', icon: Trophy },
          { id: 'teams', label: 'Teams', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neonGold to-gold text-black shadow-glow-gold'
                : 'text-white/60 border border-white/10 hover:border-neonGold/40 hover:text-neonGold'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ MATCHES TAB ═══ */}
      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Form */}
          <motion.div className="lg:col-span-1 glass-card p-6 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <Plus size={16} className="text-neonGold" />
              <h3 className="font-display font-bold text-xs tracking-widest uppercase text-neonGold">
                Create Match
              </h3>
            </div>

            <div className="space-y-4">
              <Field label="Match Title">
                <input
                  type="text"
                  value={newMatch.title}
                  onChange={(e) => setNewMatch({ ...newMatch, title: e.target.value })}
                  placeholder="e.g. Prime Elite Scrims"
                  className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Map">
                  <select
                    value={newMatch.map}
                    onChange={(e) => setNewMatch({ ...newMatch, map: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  >
                    <option>Bermuda</option>
                    <option>Purgatory</option>
                    <option>Kalahari</option>
                    <option>Alpine</option>
                    <option>NeXTerra</option>
                  </select>
                </Field>
                <Field label="Mode">
                  <select
                    value={newMatch.mode}
                    onChange={(e) => setNewMatch({ ...newMatch, mode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  >
                    <option>Squad</option>
                    <option>Duo</option>
                    <option>Solo</option>
                    <option>Clash Squad</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Entry Fee (₹)">
                  <input
                    type="number"
                    value={newMatch.entry_fee}
                    onChange={(e) => setNewMatch({ ...newMatch, entry_fee: +e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  />
                </Field>
                <Field label="Prize Pool (₹)">
                  <input
                    type="number"
                    value={newMatch.prize_pool}
                    onChange={(e) => setNewMatch({ ...newMatch, prize_pool: +e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Max Slots">
                  <input
                    type="number"
                    value={newMatch.max_slots}
                    onChange={(e) => setNewMatch({ ...newMatch, max_slots: +e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  />
                </Field>
                <Field label="Start Time">
                  <input
                    type="datetime-local"
                    value={newMatch.start_time}
                    onChange={(e) => setNewMatch({ ...newMatch, start_time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  />
                </Field>
              </div>

              <button
                onClick={handleCreateMatch}
                disabled={saving}
                className="w-full py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {saving ? 'Creating...' : 'Create Match'}
              </button>
            </div>
          </motion.div>

          {/* Matches List */}
          <motion.div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display font-bold text-xs tracking-widest uppercase text-neonCyan mb-5">
              All Matches ({matches.length})
            </h3>

            {loading ? (
              <div className="text-center py-10">
                <Loader2 size={32} className="text-neonGold animate-spin mx-auto" />
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
                <Target size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-sm font-mono text-white/40">
                  No matches yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-md border border-white/10 hover:border-neonCyan/40 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{m.title}</h4>
                        <p className="text-xs font-mono text-white/50 mt-1">
                          {m.map} • {m.mode} • {m.max_slots} slots
                        </p>
                        <div className="flex gap-3 mt-2 text-xs font-mono">
                          <span className="text-neonGold">Entry: ₹{m.entry_fee}</span>
                          <span className="text-green-400">Prize: ₹{m.prize_pool}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={m.status}
                          onChange={(e) => handleStatusChange(m.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-mono font-bold border bg-black/60 ${
                            m.status === 'live'
                              ? 'border-red-500/50 text-red-400'
                              : m.status === 'completed'
                              ? 'border-white/30 text-white/60'
                              : 'border-neonGold/50 text-neonGold'
                          }`}
                        >
                          <option value="upcoming">UPCOMING</option>
                          <option value="live">LIVE</option>
                          <option value="completed">COMPLETED</option>
                        </select>

                        {m.status === 'live' && (
                          <button
                            onClick={() => handleOpenResultModal(m)}
                            className="px-3 py-1 rounded text-xs font-mono font-bold border border-green-500/50 text-green-400 hover:bg-green-500/10 transition flex items-center gap-1"
                          >
                            <Crown size={12} />
                            Declare
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteMatch(m.id)}
                          className="p-2 rounded hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ═══ PAYMENTS TAB ═══ */}
      {activeTab === 'payments' && (
        <div>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Pending',  value: paymentStats.pending,  color: 'text-neonGold' },
              { label: 'Approved', value: paymentStats.approved, color: 'text-green-400' },
              { label: 'Rejected', value: paymentStats.rejected, color: 'text-red-400' },
              { label: 'Revenue',  value: `₹${paymentStats.revenue}`, color: 'text-neonCyan' },
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
          <div className="flex gap-2 mb-6">
            {[
              { id: 'pending',  label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'all',      label: 'All' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setPaymentFilter(f.id)}
                className={`px-4 py-2 rounded-md font-display font-bold text-xs tracking-wider uppercase transition-all ${
                  paymentFilter === f.id
                    ? 'bg-gradient-to-r from-neonCyan to-neonBlue text-black shadow-glow-blue'
                    : 'text-white/60 border border-white/10 hover:border-neonCyan/40 hover:text-neonCyan'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Payments List */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 size={48} className="text-neonCyan animate-spin mx-auto" />
            </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
              <DollarSign size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-sm font-mono text-white/40">
                No {paymentFilter} payments.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* LEFT: Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-md bg-neonGold/10 border border-neonGold/30">
                          <DollarSign size={16} className="text-neonGold" />
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

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                        <div>
                          <p className="text-white/40 uppercase text-[10px]">Player</p>
                          <p className="text-white">{p.profiles?.ign || p.profiles?.full_name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-white/40 uppercase text-[10px]">Team</p>
                          <p className="text-white">{p.team_name || p.teams?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-white/40 uppercase text-[10px]">Amount</p>
                          <p className="text-neonGold font-bold">₹{p.amount}</p>
                        </div>
                        <div>
                          <p className="text-white/40 uppercase text-[10px]">UTR</p>
                          <p className="text-white/80">{p.utr_number || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex flex-col items-end gap-2 min-w-[160px]">
                      <div
                        className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          p.status === 'approved'
                            ? 'bg-green-500/10 border-green-500/40 text-green-400'
                            : p.status === 'rejected'
                            ? 'bg-red-500/10 border-red-500/40 text-red-400'
                            : 'bg-neonGold/10 border-neonGold/40 text-neonGold'
                        }`}
                      >
                        {p.status}
                      </div>

                      {p.screenshot_url && (
                        <a
                          href={p.screenshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neonCyan/40 bg-neonCyan/5 hover:bg-neonCyan/10 transition text-xs font-mono text-neonCyan"
                        >
                          <ExternalLink size={12} />
                          Screenshot
                        </a>
                      )}

                      {p.status === 'pending' && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleApprovePayment(p.id)}
                            className="flex-1 py-2 rounded-md font-display font-bold text-[10px] tracking-wider uppercase text-black bg-gradient-to-r from-green-400 to-green-600 hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transition flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPayment(p.id)}
                            className="flex-1 py-2 rounded-md font-display font-bold text-[10px] tracking-wider uppercase text-white border border-red-500/40 hover:bg-red-500/10 transition flex items-center justify-center gap-1"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      )}

                      {p.admin_note && p.status !== 'pending' && (
                        <p className="text-[10px] font-mono text-white/40 text-right max-w-[160px]">
                          "{p.admin_note}"
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other Tabs — Placeholder */}
      {activeTab !== 'matches' && activeTab !== 'payments' && (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <Shield size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            {activeTab} management coming soon...
          </p>
        </div>
      )}

      {/* ═══ DECLARE RESULT MODAL ═══ */}
      {showResultModal && selectedResultMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-lg w-full p-6 border-green-500/40 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Declare Result
                </h2>
                <p className="text-xs font-mono text-white/50 mt-1">
                  {selectedResultMatch.title}
                </p>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                <XCircle size={18} className="text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Winner Team */}
              <Field label="🏆 Winner Team *">
                <select
                  value={resultData.winner_team_id}
                  onChange={(e) => setResultData({ ...resultData, winner_team_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-green-500/40 text-white text-sm font-mono focus:outline-none focus:border-green-400"
                >
                  <option value="">-- Select Winner --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </Field>

              {/* Runner-up */}
              <Field label="🥈 Runner-up Team">
                <select
                  value={resultData.runner_up_team_id}
                  onChange={(e) => setResultData({ ...resultData, runner_up_team_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                >
                  <option value="">-- Select Runner-up --</option>
                  {teams
                    .filter((t) => t.id !== resultData.winner_team_id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
              </Field>

              {/* Top Killer */}
              <Field label="⚔️ Top Killer">
                <select
                  value={resultData.top_killer_id}
                  onChange={(e) => setResultData({ ...resultData, top_killer_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                >
                  <option value="">-- Select Top Killer --</option>
                  {allPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ign || p.full_name}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Top Killer Kills */}
              {resultData.top_killer_id && (
                <Field label="Kills by Top Killer">
                  <input
                    type="number"
                    value={resultData.top_killer_kills}
                    onChange={(e) => setResultData({ ...resultData, top_killer_kills: +e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonGold/60"
                  />
                </Field>
              )}

              {/* Info */}
              <div className="p-3 rounded-md bg-neonGold/5 border border-neonGold/20">
                <p className="text-[10px] font-mono text-white/60">
                  💡 Points will be awarded automatically:
                </p>
                <ul className="text-[10px] font-mono text-white/50 mt-1 space-y-0.5">
                  <li>• Winner team: <span className="text-green-400">+100 pts each</span></li>
                  <li>• Runner-up: <span className="text-neonGold">+50 pts each</span></li>
                  <li>• Top Killer: <span className="text-orangeRed">+10 pts per kill</span></li>
                </ul>
              </div>

              {/* Submit */}
              <button
                onClick={handleDeclareResult}
                disabled={saving || !resultData.winner_team_id}
                className="w-full py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-green-400 to-green-600 hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                {saving ? 'Declaring...' : 'Declare Result & Award Points'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}