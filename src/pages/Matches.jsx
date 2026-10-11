import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Target, Loader2, Map, Users, Coins, Calendar, Clock, X, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PaymentQR from '../components/PaymentQR'
import PaymentUpload from '../components/PaymentUpload'

export default function Matches() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('live')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [myTeams, setMyTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [utrNumber, setUtrNumber] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const tabs = [
    { id: 'live', label: 'Live Operations' },
    { id: 'completed', label: 'Completed Archives' },
  ]

  useEffect(() => {
    loadMatches()
  }, [activeTab])

  useEffect(() => {
    if (user) loadMyTeams()
  }, [user])

  const loadMatches = async () => {
    setLoading(true)
    const statusFilter = activeTab === 'live' ? ['upcoming', 'live'] : ['completed']

    const { data } = await supabase
      .from('matches')
      .select('*')
      .in('status', statusFilter)
      .order('created_at', { ascending: false })

    setMatches(data || [])
    setLoading(false)
  }

  const loadMyTeams = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('role, teams(id, name)')
      .eq('player_id', user.id)

    setMyTeams(data || [])
  }

  const handleOpenModal = (match) => {
    setSelectedMatch(match)
    setUtrNumber('')
    setScreenshotUrl('')
    setMessage({ type: '', text: '' })
    setSelectedTeamId(myTeams[0]?.teams?.id || '')
  }

  const handleCloseModal = () => {
    setSelectedMatch(null)
    setMessage({ type: '', text: '' })
  }

  const handleSubmitPayment = async () => {
    if (!selectedTeamId) {
      setMessage({ type: 'error', text: 'Please select a team' })
      return
    }
    if (!utrNumber.trim() || utrNumber.length < 8) {
      setMessage({ type: 'error', text: 'Enter valid UTR number (8+ digits)' })
      return
    }
    if (!screenshotUrl) {
      setMessage({ type: 'error', text: 'Please upload payment screenshot' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const team = myTeams.find((t) => t.teams?.id === selectedTeamId)?.teams

      const { error } = await supabase.from('payments').insert({
        player_id: user.id,
        team_id: selectedTeamId,
        match_id: selectedMatch.id,
        amount: selectedMatch.entry_fee,
        utr_number: utrNumber.trim(),
        screenshot_url: screenshotUrl,
        status: 'pending',
        team_name: team?.name,
        match_title: selectedMatch.title,
        payment_method: 'fampay',
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Payment submitted! Wait for admin approval.',
      })

      setTimeout(() => {
        handleCloseModal()
      }, 2500)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
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
          ACTIVE <span className="neon-text-cyan">OPERATIONS</span>
        </h1>
        <p className="mt-3 text-sm font-mono text-white/50">
          Live matches, custom rooms and completed battle records
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
                  ? 'bg-gradient-to-r from-neonCyan to-neonBlue text-black shadow-glow-blue'
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
          <Loader2 size={48} className="text-neonCyan animate-spin mb-4" />
          <p className="text-sm font-mono text-white/50">Loading operations...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <Target size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            {activeTab === 'live'
              ? 'No live operations right now. Check back soon!'
              : 'No completed matches yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:scale-[1.02] transition-transform"
            >
              {/* Status */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase ${
                    match.status === 'live'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : match.status === 'completed'
                      ? 'bg-white/10 text-white/60 border border-white/20'
                      : 'bg-neonGold/20 text-neonGold border border-neonGold/40'
                  }`}
                >
                  {match.status === 'live' && (
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse mr-2" />
                  )}
                  {match.status}
                </div>
                <div className="p-2 rounded-md bg-neonCyan/10 border border-neonCyan/30">
                  <Target size={16} className="text-neonCyan" />
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-white mb-2">
                {match.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Map size={12} className="text-neonCyan" /> {match.map}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Users size={12} className="text-neonCyan" /> {match.mode}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Clock size={12} className="text-neonCyan" /> {match.max_slots} slots
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Calendar size={12} className="text-neonCyan" /> {formatDate(match.start_time)}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Entry</p>
                  <p className="font-display font-bold text-neonGold">₹{match.entry_fee}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Prize</p>
                  <p className="font-display font-bold text-green-400">₹{match.prize_pool}</p>
                </div>
              </div>

              {match.status === 'upcoming' && (
                <button
                  onClick={() => handleOpenModal(match)}
                  className="w-full mt-4 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition-all"
                >
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
          { icon: Map,      label: 'Maps',      value: 'Bermuda, Kalahari, Purgatory' },
          { icon: Users,    label: 'Slots',     value: '48 players per match' },
          { icon: Coins,    label: 'Entry Fee', value: 'From 20 diamonds' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card p-5 flex items-center gap-4"
          >
            <div className="p-3 rounded-lg bg-neonCyan/10 border border-neonCyan/30">
              <item.icon size={20} className="text-neonCyan" />
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

      {/* ═══ PAYMENT MODAL ═══ */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border-neonGold/40"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  {selectedMatch.title}
                </h2>
                <p className="text-xs font-mono text-white/50 mt-1">
                  Entry Fee: ₹{selectedMatch.entry_fee}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                <X size={18} className="text-white/60" />
              </button>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-md border flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'border-green-500/40 bg-green-500/10'
                    : 'border-red-500/40 bg-red-500/10'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-green-400" />
                ) : (
                  <AlertTriangle size={16} className="text-red-400" />
                )}
                <p
                  className={`text-xs font-mono ${
                    message.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT: QR */}
              <div>
                <PaymentQR amount={selectedMatch.entry_fee} />
              </div>

              {/* RIGHT: Form */}
              <div className="space-y-4">
                {/* Team Select */}
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
                    Select Team *
                  </label>
                  {myTeams.length === 0 ? (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/40">
                      <p className="text-xs font-mono text-red-400">
                        No team found. Create a team first!
                      </p>
                    </div>
                  ) : (
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonCyan/60"
                    >
                      <option value="">-- Select Team --</option>
                      {myTeams.map((t) => (
                        <option key={t.teams?.id} value={t.teams?.id}>
                          {t.teams?.name} ({t.role})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* UTR Number */}
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
                    UTR / Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 425389123456"
                    className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonCyan/60"
                  />
                  <p className="text-[10px] font-mono text-white/40 mt-1">
                    Aa number FamPay app ma payment history ma hoy
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
                    Payment Screenshot *
                  </label>
                  <PaymentUpload onUploadComplete={setScreenshotUrl} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitPayment}
              disabled={submitting || myTeams.length === 0}
              className="w-full mt-6 py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>Submit Payment for Verification</>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}