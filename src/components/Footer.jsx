import { Github, Instagram, Youtube, MessageCircle, Facebook, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-neonGold/20 bg-black/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Logo size="md" />
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/60 font-mono max-w-md leading-relaxed">
              The ultimate Free Fire esports ecosystem. Drop into Bermuda,
              lead your squad to victory, and claim the glory.{' '}
              <span className="text-neonGold font-bold">Real prizes for the last survivor.</span>
            </p>

            <p className="mt-3 text-[10px] sm:text-xs font-mono text-white/40">
              📧 Email: <a href="mailto:primelengend.co@gmail.com" className="text-neonCyan hover:text-neonGold transition">primelengend.co@gmail.com</a>
            </p>
            <p className="mt-1 text-[10px] sm:text-xs font-mono text-white/40">
              📍 India • Free Fire Esports
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neonGold font-display font-bold text-xs sm:text-sm mb-3 tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/60 font-mono">
              <li>
                <Link to="/dashboard" className="hover:text-neonGold transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-neonGold transition">
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/tournament" className="hover:text-neonGold transition">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboards" className="hover:text-neonGold transition">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-neonGold transition">
                  View Account
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-neonGold transition">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-neonGold font-display font-bold text-xs sm:text-sm mb-3 tracking-wider">
              JOIN US
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="https://whatsapp.com/channel/0029VbDzPhD2v1ImyriHNj20"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="p-2 rounded-md border border-green-500/30 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition"
              >
                <MessageCircle size={18} className="text-green-500" />
              </a>
              <a
                href="https://www.facebook.com/share/1H5iTHhL9v/?ref=1"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="p-2 rounded-md border border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition"
              >
                <Facebook size={18} className="text-blue-500" />
              </a>
              <a
                href="https://discord.gg/dWTzy2zpd"
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
                className="p-2 rounded-md border border-indigo-500/30 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition"
              >
                <Send size={18} className="text-indigo-500" />
              </a>
              <a
                href="https://www.instagram.com/invites/contact/?utm_content=b2n5a90&stkn=19wk612kckd2o"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-2 rounded-md border border-pink-500/30 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition"
              >
                <Instagram size={18} className="text-pink-500" />
              </a>
              <a
                href="https://youtube.com/@primelegends-0044?si=RMFFmMyJeFkoW-xa"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-2 rounded-md border border-red-500/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition"
              >
                <Youtube size={18} className="text-red-500" />
              </a>
              <a
                href="https://t.me/+72MIoqo-gRs4MzY9"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                className="p-2 rounded-md border border-sky-500/30 hover:border-sky-500 hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] transition"
              >
                <Github size={18} className="text-sky-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}