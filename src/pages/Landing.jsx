import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Trophy, Clock, MessageCircle, Instagram, Youtube, Flame, Shield, BarChart3, MessageSquare } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-0" />

        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-neonGold/40 bg-neonGold/5 backdrop-blur-sm mb-8"
        >
          <Flame size={14} className="text-neonGold" />
          <span className="text-xs font-mono font-bold tracking-widest text-neonGold uppercase">
            Battle Royale Season Live
          </span>
        </motion.div>

        {/* Hero heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none italic"
        >
          <span className="block text-white">DOMINATE THE</span>
          <span className="block bg-gradient-to-r from-neonGold via-orangeRed to-neonGold bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
            BATTLEGROUNDS
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-8 max-w-2xl text-white/70 font-mono text-sm md:text-base leading-relaxed"
        >
          The ultimate Free Fire esports ecosystem. Drop into Bermuda,
          lead your squad to victory, and claim the glory.{' '}
          <span className="text-neonGold font-bold">Real prizes for the last survivor.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/dashboard"
            className="px-8 py-4 font-display font-bold tracking-widest text-black uppercase rounded-md bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all duration-300 hover:scale-105"
          >
            Join the Battle
          </Link>
          <Link
            to="/leaderboards"
            className="px-8 py-4 font-display font-bold tracking-widest text-neonGold uppercase rounded-md border-2 border-neonGold/50 hover:bg-neonGold/10 hover:shadow-glow-gold transition-all duration-300"
          >
            View Rankings
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          INFO PILLS
      ═══════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users, title: 'SQUAD UP', sub: 'Find Teammates' },
            { icon: Trophy, title: 'DIAMONDS & CASH', sub: 'Real Rewards' },
            { icon: Clock, title: 'DAILY SCRIMS', sub: '24/7 Tournaments' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className="p-3 rounded-lg bg-neonGold/10 border border-neonGold/30">
                <item.icon size={24} className="text-neonGold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-white/50 mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURE CARDS
      ═══════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl md:text-5xl italic text-white">
            WHY <span className="neon-text-gold">PRIME LEGENDS</span>?
          </h2>
          <p className="mt-3 text-white/50 font-mono text-sm">
            Everything you need to dominate the battlefield
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Trophy,
              title: 'Tournaments & Events',
              desc: 'Join competitive tournaments with real prizes. Participate in daily scrims, climb the ranks and earn your place among champions.',
              color: 'neonGold',
            },
            {
              icon: Shield,
              title: 'Team Management',
              desc: 'Create and manage your esports team. Invite players, assign roles, track performance and build the ultimate squad to dominate.',
              color: 'neonCyan',
            },
            {
              icon: BarChart3,
              title: 'Global Stats',
              desc: 'Track your performance with detailed analytics. View match history, kill stats, win rates and monitor your progress.',
              color: 'orangeRed',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="glass-card p-8 group hover:scale-105 transition-transform duration-300"
            >
              <div className={`p-3 rounded-lg bg-${item.color}/10 border border-${item.color}/30 inline-block mb-5`}>
                <item.icon size={28} className={`text-${item.color}`} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-3 tracking-wide">
                {item.title}
              </h3>
              <p className="text-sm font-mono text-white/60 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          JOIN THE COMMUNITY
      ═══════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl md:text-5xl italic">
            JOIN THE <span className="neon-text-cyan">COMMUNITY</span>
          </h2>
          <p className="mt-3 text-white/50 font-mono text-sm max-w-xl mx-auto">
            Connect with fellow players, get instant updates, and never miss a tournament. Scan the QR codes or click the buttons below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'WhatsApp Group',
              desc: 'Get instant match alerts & room codes',
              btn: 'Join Group',
              btnColor: 'bg-green-500 hover:bg-green-600',
              borderColor: 'border-green-500/40 hover:border-green-500',
              icon: MessageCircle,
              link: 'https://whatsapp.com/channel/0029VbDzPhD2v1ImyriHNj20',
            },
            {
              name: 'Discord Server',
              desc: 'Voice chat, scrims & community',
              btn: 'Join Discord',
              btnColor: 'bg-indigo-500 hover:bg-indigo-600',
              borderColor: 'border-indigo-500/40 hover:border-indigo-500',
              icon: MessageSquare,
              link: 'https://discord.gg/dWTzy2zpd',
            },
            {
              name: 'Instagram',
              desc: 'Follow for highlights & giveaways',
              btn: 'Follow Us',
              btnColor: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90',
              borderColor: 'border-pink-500/40 hover:border-pink-500',
              icon: Instagram,
              link: 'https://www.instagram.com/invites/contact/?username=primelengends',
            },
            {
              name: 'YouTube',
              desc: 'Subscribe for streams & VODs',
              btn: 'Subscribe',
              btnColor: 'bg-red-600 hover:bg-red-700',
              borderColor: 'border-red-500/40 hover:border-red-500',
              icon: Youtube,
              link: 'https://youtube.com/@primelegends-0044?si=RMFFmMyJeFkoW-xa',
            },
            {
              name: 'Facebook',
              desc: 'Get instant match alerts & room codes',
              btn: 'Join Group',
              btnColor: 'bg-blue-500 hover:bg-blue-600',
              borderColor: 'border-blue-500/40 hover:border-blue-500',
              icon: MessageCircle,
              link: 'https://www.facebook.com/share/1H5iTHhL9v/?ref=1',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-6 text-center ${item.borderColor} transition-all duration-300`}
            >
              <div className="w-32 h-32 mx-auto mb-5 rounded-lg bg-white p-3 flex items-center justify-center">
                <div className="w-full h-full bg-black rounded flex items-center justify-center">
                  <item.icon size={40} className="text-white" />
                </div>
              </div>

              <h3 className="font-display font-bold text-white text-base mb-1">
                {item.name}
              </h3>
              <p className="text-xs font-mono text-white/50 mb-5">{item.desc}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 font-display font-bold tracking-wider text-xs text-white uppercase rounded-md ${item.btnColor} transition-all`}
              >
                {item.btn}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-24" />
    </div>
  )
}