import { useState } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PaymentUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      alert('Only image files allowed')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB')
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `payments/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('Payment')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('payments')
        .getPublicUrl(filePath)

      setUploadedUrl(publicUrl)
      onUploadComplete?.(publicUrl)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setUploadedUrl('')
    onUploadComplete?.('')
  }

  if (uploadedUrl) {
    return (
      <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-4 text-center">
        <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
        <p className="text-sm font-mono text-green-400">Screenshot uploaded!</p>
        <button
          onClick={handleClear}
          className="mt-2 text-xs font-mono text-white/50 hover:text-white underline"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Payment screenshot"
            className="w-full max-h-48 object-contain rounded-lg border border-neonCyan/40 bg-black/40"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-white/20 hover:border-neonCyan/60 rounded-lg p-6 text-center transition">
            <ImageIcon size={32} className="text-white/30 mx-auto mb-2" />
            <p className="text-xs font-mono text-white/60">
              Click to upload payment screenshot
            </p>
            <p className="text-[10px] font-mono text-white/40 mt-1">
              PNG / JPG — Max 5 MB
            </p>
          </div>
        </label>
      )}

      {file && !uploadedUrl && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-3 py-2.5 rounded-md font-display font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Upload size={14} className="animate-bounce" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload Screenshot
            </>
          )}
        </button>
      )}
    </div>
  )
}