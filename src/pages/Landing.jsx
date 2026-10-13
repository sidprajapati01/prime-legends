import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Trophy, Clock, Flame, Shield, BarChart3 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-0 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-0" />

        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-neonGold/40 bg-neonGold/5 backdrop-blur-sm mb-6 sm:mb-8"
        >
          <Flame size={12} className="text-neonGold sm:w-[14px] sm:h-[14px]" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-neonGold uppercase">
            Battle Royale Season Live
          </span>
        </motion.div>

        {/* Hero heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 font-display font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] italic"
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
          className="relative z-10 mt-5 sm:mt-8 max-w-2xl text-white/70 font-mono text-xs sm:text-sm md:text-base leading-relaxed px-2"
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
          className="relative z-10 mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            to="/dashboard"
            className="px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-xs sm:text-sm tracking-widest text-black uppercase rounded-md bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition-all duration-300 hover:scale-105 text-center"
          >
            Join the Battle
          </Link>
          <Link
            to="/leaderboards"
            className="px-6 sm:px-8 py-3 sm:py-4 font-display font-bold text-xs sm:text-sm tracking-widest text-neonGold uppercase rounded-md border-2 border-neonGold/50 hover:bg-neonGold/10 hover:shadow-glow-gold transition-all duration-300 text-center"
          >
            View Rankings
          </Link>
        </motion.div>
      </section>

      {/* INFO PILLS */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: Users,  title: 'SQUAD UP',         sub: 'Find Teammates' },
            { icon: Trophy, title: 'DIAMONDS & CASH',  sub: 'Real Rewards' },
            { icon: Clock,  title: 'DAILY SCRIMS',     sub: '24/7 Tournaments' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-neonGold/10 border border-neonGold/30 flex-shrink-0">
                <item.icon size={20} className="text-neonGold sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-white text-xs sm:text-sm tracking-wider truncate">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs font-mono text-white/50 mt-0.5 truncate">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl italic text-white">
            WHY <span className="neon-text-gold">PRIME LEGENDS</span>?
          </h2>
          <p className="mt-2 sm:mt-3 text-white/50 font-mono text-xs sm:text-sm">
            Everything you need to dominate the battlefield
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
              className="glass-card p-6 sm:p-8 group hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300"
            >
              <div className={`p-2.5 sm:p-3 rounded-lg bg-${item.color}/10 border border-${item.color}/30 inline-block mb-4 sm:mb-5`}>
                <item.icon size={24} className={`text-${item.color} sm:w-7 sm:h-7`} />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 sm:mb-3 tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-white/60 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* JOIN THE COMMUNITY */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl italic">
            JOIN THE <span className="neon-text-cyan">COMMUNITY</span>
          </h2>
          <p className="mt-2 sm:mt-3 text-white/50 font-mono text-xs sm:text-sm max-w-xl mx-auto px-4">
            Connect with fellow players, get instant updates, and never miss a tournament. Join our community below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              name: 'WhatsApp Group',
              desc: 'Get instant match alerts & room codes',
              btn: 'Join Group',
              btnColor: 'bg-green-500 hover:bg-green-600',
              borderColor: 'border-green-500/40 hover:border-green-500',
              // ⚠️ PASTE IMAGE URL HERE:
              logo: 'https://cdn.simpleicons.org/whatsapp/25D366',
              // ⚠️ PASTE COMMUNITY LINK HERE:
              link: 'https://whatsapp.com/channel/0029VbDzPhD2v1ImyriHNj20',
            },
            {
              name: 'Discord Server',
              desc: 'Voice chat, scrims & community',
              btn: 'Join Discord',
              btnColor: 'bg-indigo-500 hover:bg-indigo-600',
              borderColor: 'border-indigo-500/40 hover:border-indigo-500',
              // ⚠️ PASTE IMAGE URL HERE:
              logo: 'https://cdn.simpleicons.org/discord/5865F2',
              // ⚠️ PASTE COMMUNITY LINK HERE:
              link: 'https://discord.gg/dWTzy2zpd',
            },
            {
              name: 'Instagram',
              desc: 'Follow for highlights & giveaways',
              btn: 'Follow Us',
              btnColor: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90',
              borderColor: 'border-pink-500/40 hover:border-pink-500',
              // ⚠️ PASTE IMAGE URL HERE:
              logo: 'https://cdn.simpleicons.org/instagram/E4405F',
              // ⚠️ PASTE COMMUNITY LINK HERE:
              link: 'https://www.instagram.com/invites/contact/?utm_content=b2n5a90&stkn=19wk612kckd2o',
            },
            {
              name: 'YouTube',
              desc: 'Subscribe for streams & VODs',
              btn: 'Subscribe',
              btnColor: 'bg-red-600 hover:bg-red-700',
              borderColor: 'border-red-500/40 hover:border-red-500',
              // ⚠️ PASTE IMAGE URL HERE:
              logo: 'https://cdn.simpleicons.org/youtube/FF0000',
              // ⚠️ PASTE COMMUNITY LINK HERE:
              link: 'https://youtube.com/@primelegends-0044?si=RMFFmMyJeFkoW-xa',
            },
            {
              name: 'Facebook',
              desc: 'Like our page for updates',
              btn: 'Like Page',
              btnColor: 'bg-blue-600 hover:bg-blue-700',
              borderColor: 'border-blue-500/40 hover:border-blue-500',
              logo: 'https://cdn.simpleicons.org/facebook/1877F2',
              link: 'https://www.facebook.com/share/1H5iTHhL9v/?ref=1',
            },
            {
              name: 'Telegaram',
              desc: 'Like our page for updates',
              btn: 'Like Page',
              btnColor: 'bg-blue-600 hover:bg-blue-700',
              borderColor: 'border-blue-500/40 hover:border-blue-500',
              logo: 'https://cdn.simpleicons.org/telegram/1877F2',
              link: 'https://t.me/+72MIoqo-gRs4MzY9',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-5 sm:p-6 text-center ${item.borderColor} transition-all duration-300`}
            >
              {/* Logo image — Direct URL */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-5 flex items-center justify-center">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.warn(`Image failed to load: ${item.logo}`)
                    e.target.style.opacity = '0.3'
                  }}
                />
              </div>

              <h3 className="font-display font-bold text-white text-sm sm:text-base mb-1">
                {item.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-mono text-white/50 mb-4 sm:mb-5">{item.desc}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-2.5 sm:py-3 font-display font-bold tracking-wider text-[10px] sm:text-xs text-white uppercase rounded-md ${item.btnColor} transition-all`}
              >
                {item.btn}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-16 sm:h-24" />
    </div>
  )
}