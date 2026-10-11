// ⚠️ LOGO SWAP: fakt /public/logo.png replace karo — badhu automatic update thashe
export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo image */}
      <div className={`${sizes[size]} relative`}>
        <img
          src="/logo.png"
          alt="PRIME LEGENDS"
          className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]"
          onError={(e) => {
            // Fallback: jo logo.png na hoy to "PL" monogram dekhay
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* Fallback monogram */}
        <div
          className="hidden w-full h-full items-center justify-center rounded-full border-2 border-neonGold text-neonGold font-display font-bold text-sm"
          style={{ display: 'none' }}
        >
          PL
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-lg tracking-wider text-white">
            PRIME
          </span>
          <span className="font-display font-black text-lg tracking-wider neon-text-gold">
            LEGENDS
          </span>
        </div>
      )}
    </div>
  )
}