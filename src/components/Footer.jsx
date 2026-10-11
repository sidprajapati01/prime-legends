import { Github, Instagram, Youtube, MessageCircle } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-neonGold/20 bg-black/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-white/60 font-mono max-w-md">
              The ultimate Free Fire esports ecosystem. Drop into Bermuda,
              lead your squad to victory, and claim the glory.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-neonGold font-display font-bold text-sm mb-3 tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm text-white/60 font-mono">
              <li><a href="/dashboard" className="hover:text-neonGold transition">Dashboard</a></li>
              <li><a href="/matches" className="hover:text-neonGold transition">Matches</a></li>
              <li><a href="/tournament" className="hover:text-neonGold transition">Tournament</a></li>
              <li><a href="/leaderboards" className="hover:text-neonGold transition">Leaderboards</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-neonGold font-display font-bold text-sm mb-3 tracking-wider">
              JOIN US
            </h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-md border border-neonGold/30 hover:border-neonGold hover:shadow-glow-gold transition">
                <MessageCircle size={18} className="text-neonGold" />
              </a>
              <a href="#" className="p-2 rounded-md border border-neonCyan/30 hover:border-neonCyan hover:shadow-glow-blue transition">
                <Instagram size={18} className="text-neonCyan" />
              </a>
              <a href="#" className="p-2 rounded-md border border-orangeRed/30 hover:border-orangeRed hover:shadow-glow-red transition">
                <Youtube size={18} className="text-orangeRed" />
              </a>
              <a href="#" className="p-2 rounded-md border border-white/30 hover:border-white transition">
                <Github size={18} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-white/40">
            © 2026 PRIME LEGENDS. All rights reserved.
          </p>
          <p className="text-xs font-mono text-neonGold/60">
            v1.0.0 — CYBERPUNK ESPORTS PLATFORM
          </p>
        </div>
      </div>
    </footer>
  )
}