import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquare, CheckCircle2 } from 'lucide-react'

export default function Feedback() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!subject || !message) return
    setSent(true)
    setSubject('')
    setMessage('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="font-display font-black text-4xl md:text-5xl italic tracking-wide">
          FEEDBACK <span className="neon-text-cyan">& REPORT</span>
        </h1>
        <p className="mt-3 text-sm font-mono text-white/50 max-w-xl mx-auto">
          We appreciate your help improving PRIME LEGENDS. Use the form below to send feedback, report bugs, become partner or file complaints.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onSubmit={handleSubmit}
        className="glass-card p-8 border-neonCyan/30 shadow-[0_0_40px_rgba(0,229,255,0.15)]"
      >
        {sent && (
          <div className="mb-6 p-4 rounded-md border border-green-500/40 bg-green-500/10 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-400" />
            <p className="text-sm font-mono text-green-400">
              Report sent successfully! We'll review it soon.
            </p>
          </div>
        )}

        {/* Subject */}
        <label className="block mb-6">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
            Subject
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short subject (e.g. Match time bug)"
            className="w-full px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 focus:shadow-glow-blue transition"
            required
          />
        </label>

        {/* Message */}
        <label className="block mb-6">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mb-2">
            Message
          </span>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue, suggestion or report in detail."
            className="w-full px-4 py-3 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 focus:shadow-glow-blue transition resize-none"
            required
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition-all"
        >
          <Send size={14} />
          Send Report
        </button>
      </motion.form>

    </div>
  )
}