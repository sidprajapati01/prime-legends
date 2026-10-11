import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Feedback() {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'Please fill all fields' })
      return
    }

    setSending(true)
    setStatus({ type: '', text: '' })

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      })

      if (error) throw error

      setStatus({
        type: 'success',
        text: 'Feedback submitted! We will review it soon.',
      })
      setSubject('')
      setMessage('')

      setTimeout(() => setStatus({ type: '', text: '' }), 4000)
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl italic tracking-wide">
          FEEDBACK <span className="neon-text-cyan">& REPORT</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-mono text-white/50 max-w-xl mx-auto px-4">
          We appreciate your help improving PRIME LEGENDS. Use the form below to send feedback, report bugs, become partner or file complaints.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit}
        className="glass-card p-5 sm:p-8 border-neonCyan/30 shadow-[0_0_40px_rgba(0,229,255,0.15)]"
      >
        {status.text && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-md border flex items-center gap-2 sm:gap-3 ${
              status.type === 'success'
                ? 'border-green-500/40 bg-green-500/10'
                : 'border-red-500/40 bg-red-500/10'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
            )}
            <p
              className={`text-xs sm:text-sm font-mono ${
                status.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {status.text}
            </p>
          </div>
        )}

        {/* Subject */}
        <label className="block mb-4 sm:mb-6">
          <span className="block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-1.5 sm:mb-2">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short subject (e.g. Match time bug)"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 focus:shadow-glow-blue transition"
            required
          />
        </label>

        {/* Message */}
        <label className="block mb-4 sm:mb-6">
          <span className="block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-1.5 sm:mb-2">
            Message
          </span>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue, suggestion or report in detail."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 focus:shadow-glow-blue transition resize-none"
            required
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition-all disabled:opacity-50"
        >
          <Send size={14} />
          {sending ? 'Sending...' : 'Send Report'}
        </button>
      </motion.form>

    </div>
  )
}