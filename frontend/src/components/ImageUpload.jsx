import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageUpload({ onFile }) {
  const { t }        = useTranslation()
  const [drag, setDrag] = useState(false)
  const [preview, setPreview] = useState(null)

  const handle = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }, [onFile])

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false)
    handle(e.dataTransfer.files[0])
  }

  const onInput = (e) => handle(e.target.files[0])

  return (
    <label
      className={`relative flex flex-col items-center justify-center w-full min-h-[260px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden
        ${drag ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' : 'border-white/20 bg-white/[0.02] hover:border-brand-500/50 hover:bg-white/[0.04]'}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <input type="file" accept="image/*" className="sr-only" onChange={onInput} />

      {preview ? (
        <>
          <img src={preview} alt="preview" className="w-full h-full object-contain max-h-[340px] p-2" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-full">Change photo</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-3xl">
            🍃
          </div>
          <div>
            <p className="text-white/80 font-medium">{t('scanner.upload_label')}</p>
            <p className="text-white/40 text-sm mt-1">{t('scanner.upload_hint')}</p>
          </div>
          <div className="flex gap-2 text-xs text-white/30">
            <span className="px-2 py-1 bg-white/5 rounded-md">JPG</span>
            <span className="px-2 py-1 bg-white/5 rounded-md">PNG</span>
            <span className="px-2 py-1 bg-white/5 rounded-md">WebP</span>
          </div>
        </div>
      )}
    </label>
  )
}