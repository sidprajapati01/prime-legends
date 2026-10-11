import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, AlertTriangle, Lock, Save, X, Mail, Phone, Gamepad2, Hash, Loader2, CheckCircle2
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, profile: authProfile } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    ign: '',
    ffUid: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [combat, setCombat] = useState({
    matches: 0,
    wins: 0,
    kills: 0,
    winRate: '0%',
  })

  // Load profile
  useEffect(() => {
    if (!user) return

    const loadProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          fullName: data.full_name || '',
          ign: data.ign || '',
          ffUid: data.ff_uid || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          newPassword: '',
          confirmPassword: '',
        })
        setCombat({
          matches: data.matches_played || 0,
          wins: data.total_wins || 0,
          kills: data.total_kills || 0,
          winRate: data.win_rate || '0%',
        })
      }
      setLoading(false)
    }

    loadProfile()
  }, [user])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: form.fullName,
          ign: form.ign,
          ff_uid: form.ffUid,
          email: form.email,
          phone: form.phone,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (form.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.newPassword,
      })
      if (error) throw error

      setMessage({ type: 'success', text: 'Password updated!' })
      setForm((f) => ({ ...f, newPassword: '', confirmPassword: '' }))
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-neonGold animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-neonGold/60 bg-gradient-to-br from-neonGold/20 to-neonCyan/20 flex items-center justify-center shadow-glow-gold">
            <User size={40} className="text-neonGold" />
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-black" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display font-black text-3xl md:text-4xl italic tracking-wide text-white uppercase">
            {form.fullName || 'OPERATOR'}
          </h1>
          <p className="mt-2 text-xs font-mono font-bold tracking-widest uppercase text-neonCyan">
            Operator Status: <span className="text-green-400">Active</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-white border border-white/20 hover:border-white/50 transition-all flex items-center gap-2"
          >
            <X size={14} /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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
            <AlertTriangle size={18} className="text-red-400" />
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

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <motion.div className="lg:col-span-2 glass-card p-7">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-neonCyan" />
            <h2 className="font-display font-bold text-sm tracking-widest uppercase text-neonCyan">
              Operator Details
            </h2>
          </div>

          <div className="p-4 rounded-lg border border-neonCyan/30 bg-neonCyan/5 mb-6 flex gap-3">
            <AlertTriangle size={18} className="text-neonCyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono font-bold text-neonCyan uppercase tracking-wider">
                Action Required: Set Gaming Identity
              </p>
              <p className="text-xs font-mono text-white/60 mt-1">
                Fill in your In-Game Name (IGN) and Free Fire Game UID below, then click Save Changes.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Full Name" icon={User}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonCyan/60 transition"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="In-Game Name (IGN)" icon={Gamepad2}>
                <input
                  type="text"
                  value={form.ign}
                  onChange={(e) => update('ign', e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-neonCyan/60 transition"
                />
              </Field>

              <Field label="Free Fire Game UID" icon={Hash} required>
                <input
                  type="text"
                  value={form.ffUid}
                  onChange={(e) => update('ffUid', e.target.value)}
                  placeholder="e.g. 98745621"
                  className="w-full px-4 py-3 rounded-md bg-black/60 border border-neonGold/40 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonGold focus:shadow-glow-gold transition"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Email Address" icon={Mail}>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/10 text-white/50 text-sm font-mono cursor-not-allowed"
                />
              </Field>

              <Field label="Phone Number" icon={Phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 transition"
                />
              </Field>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <div className="space-y-6">
          <motion.div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={16} className="text-neonGold" />
              <h3 className="font-display font-bold text-xs tracking-widest uppercase text-neonGold">
                Combat Record
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Matches Played', value: combat.matches },
                { label: 'Total Wins', value: combat.wins },
                { label: 'Total Kills', value: combat.kills },
                { label: 'Win Rate', value: combat.winRate },
              ].map((c, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-md bg-black/40 border border-white/5">
                  <span className="text-xs font-mono text-white/60">{c.label}</span>
                  <span className="font-display font-bold text-sm text-white">{c.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock size={16} className="text-orangeRed" />
              <h3 className="font-display font-bold text-xs tracking-widest uppercase text-orangeRed">
                Security
              </h3>
            </div>

            <input
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              className="w-full mb-3 px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-orangeRed/60 transition"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-orangeRed/60 transition"
            />

            <button
              onClick={handlePasswordUpdate}
              className="w-full py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-white border border-orangeRed/40 hover:bg-orangeRed/10 transition"
            >
              Update Password
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
        {label} {required && <span className="text-neonGold">• REQUIRED</span>}
      </span>
      {children}
    </label>
  )
}