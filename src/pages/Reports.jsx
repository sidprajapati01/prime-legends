import { motion } from 'framer-motion'
import { FileText, Loader2 } from 'lucide-react'

export default function Reports() {
  const loading = false

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="font-display font-black text-4xl md:text-5xl italic tracking-wide">
          MATCH <span className="neon-text-cyan">REPORTS</span>
        </h1>
        <p className="mt-3 text-sm font-mono text-white/50">
          Detailed statistics and results from past battles.
        </p>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={48} className="text-neonCyan animate-spin mb-4" />
          <p className="text-sm font-mono text-white/50">Loading reports...</p>
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-xl">
          <FileText size={56} className="text-white/20 mx-auto mb-4" />
          <p className="text-sm font-mono text-white/40">
            No reports available yet. Complete a match to see your stats.
          </p>
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
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
            className="glass-card p-5"
          >
            <p className="text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
              {item.label}
            </p>
            <p className="mt-2 font-display font-black text-3xl italic text-white">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  )
}