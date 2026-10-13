export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: 'w-12 h-18',        // ← 32 → 40 (moto)
    md: 'w-12 h-12',        // ← 40 → 48 (moto)
    lg: 'w-16 h-16',        // ← 56 → 64 (moto)
    xl: 'w-20 h-20',        // ← NEW
  }

  const textSizes = {
    sm: 'text-sm sm:text-base',    // ← 14 → 16
    md: 'text-base sm:text-lg',    // ← 16 → 18
    lg: 'text-lg sm:text-xl',      // ← 18 → 20
    xl: 'text-xl sm:text-2xl',     // ← NEW
  }

  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="PRIME LEGENDS"
        className={`${sizes[size]} object-contain flex-shrink-0`}
      />

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-black tracking-wider text-white ${textSizes[size]}`}>
            PRIME
          </span>
          <span className={`font-display font-black tracking-wider neon-text-gold ${textSizes[size]}`}>
            LEGENDS
          </span>
        </div>
      )}
    </div>
  )
}