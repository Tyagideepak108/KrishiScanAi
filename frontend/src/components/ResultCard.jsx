import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitFeedback } from '../api/predict'

const TABS = ['organic', 'chemical', 'preventive']
const TAB_ICONS = { organic: '🌿', chemical: '🧪', preventive: '🛡️' }

export default function ResultCard({ result, lang }) {
  const { t }          = useTranslation()
  const [tab, setTab]  = useState('organic')
  const [fb, setFb]    = useState(null)   // null | 'yes' | 'no'
  const [comment, setComment] = useState('')
  const [fbSent, setFbSent]   = useState(false)

  if (!result) return null

  const info = result.disease_info
    ? (result.disease_info[lang] || result.disease_info)
    : null

  const isHealthy = result.predicted_class?.toLowerCase().includes('health')

  const confColor = result.confidence >= 85
    ? 'text-green-400' : result.confidence >= 65
    ? 'text-yellow-400' : 'text-red-400'

  const sendFeedback = async (correct) => {
    setFb(correct ? 'yes' : 'no')
    if (result.report_id) {
      try {
        await submitFeedback({ report_id: result.report_id, is_correct: correct, comment })
        setFbSent(true)
      } catch { setFbSent(true) }
    } else {
      setFbSent(true)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main result card */}
      <div className={`card border ${isHealthy ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">{t('result.title')}</p>
            <h2 className="text-2xl font-display font-bold">
              {info?.disease_name || result.predicted_class}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs mb-1">{t('result.confidence')}</p>
            <p className={`text-3xl font-bold ${confColor}`}>{result.confidence?.toFixed(1)}%</p>
          </div>
        </div>

        {/* confidence bar */}
        <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${result.confidence >= 85 ? 'bg-green-400' : result.confidence >= 65 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Top 3 */}
      {result.top3?.length > 0 && (
        <div className="card">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{t('result.top3')}</p>
          <div className="space-y-2">
            {result.top3.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={i === 0 ? 'text-white font-medium' : 'text-white/50'}>{p.disease}</span>
                    <span className={i === 0 ? 'text-brand-400 font-medium' : 'text-white/30'}>{p.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-white/8 rounded-full">
                    <div className={`h-full rounded-full ${i === 0 ? 'bg-brand-500' : 'bg-white/20'}`} style={{ width: `${p.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disease info */}
      {info && (
        <>
          {/* Cause */}
          {info.cause && (
            <div className="card">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{t('result.cause')}</p>
              <p className="text-white/80 text-sm leading-relaxed">{info.cause}</p>
            </div>
          )}

          {/* Treatment tabs */}
          {!isHealthy && (
            <div className="card p-0 overflow-hidden">
              {/* Tab headers */}
              <div className="flex border-b border-white/8">
                {TABS.map(tabKey => (
                  <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${
                      tab === tabKey
                        ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/5'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {TAB_ICONS[tabKey]} {t(`result.${tabKey}`)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-5">
                <ul className="space-y-2">
                  {(info[`${tab}_treatment`] || info[tab] || []).map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/70">
                      <span className="text-brand-400 mt-0.5 flex-shrink-0">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {/* Feedback */}
      <div className="card">
        {fbSent ? (
          <p className="text-center text-brand-400 text-sm">{t('result.feedback_thanks')}</p>
        ) : (
          <>
            <p className="text-white/60 text-sm text-center mb-3">{t('result.feedback_q')}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => sendFeedback(true)}
                className="px-6 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-sm transition-all">
                {t('result.yes')}
              </button>
              <button onClick={() => setFb('no')}
                className="px-6 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm transition-all">
                {t('result.no')}
              </button>
            </div>
            {fb === 'no' && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={t('result.feedback_label')}
                  rows={2}
                  className="input text-sm resize-none"
                />
                <button onClick={() => sendFeedback(false)} className="btn-primary w-full text-sm py-2">
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}