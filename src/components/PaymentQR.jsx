import { Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function PaymentQR({ amount = 0 }) {
  const [copied, setCopied] = useState(false)

  const upiId = '9106716454@fam'
  const payeeName = 'Dhruv Doshi'

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-black/60 rounded-lg border border-neonGold/40 p-4">
      <div className="text-center mb-3">
        <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
          Scan & Pay via UPI
        </p>
      </div>

      {/* QR Image */}
      <div className="bg-white rounded-lg p-2 mx-auto w-fit">
        <img
          src="/fampay-qr.png"
          alt="FamPay QR Code"
          className="w-48 h-48 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white/50">UPI ID:</span>
          <button
            onClick={handleCopyUPI}
            className="flex items-center gap-1.5 text-neonCyan hover:text-neonGold transition"
          >
            {copied ? (
              <>
                <CheckCircle2 size={12} className="text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                {upiId}
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white/50">Name:</span>
          <span className="text-white">{payeeName}</span>
        </div>

        {amount > 0 && (
          <div className="flex items-center justify-between text-sm font-mono pt-2 border-t border-white/10">
            <span className="text-white/50">Amount:</span>
            <span className="font-display font-bold text-neonGold text-lg">₹{amount}</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-[10px] font-mono text-white/40 text-center">
        ⚠️ Pay exact amount, then upload screenshot below
      </p>
    </div>
  )
}