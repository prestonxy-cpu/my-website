import { useEffect } from 'react'
import { useProgress } from '../../store/progress'

/** 右下角成就解锁提示 */
export default function AchievementToasts() {
  const { pendingToasts, dismissToast } = useProgress()
  const top = pendingToasts[0]

  useEffect(() => {
    if (!top) return
    const t = setTimeout(() => dismissToast(top.id), 4500)
    return () => clearTimeout(t)
  }, [top, dismissToast])

  if (!top) return null
  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-pop"
      role="status"
      aria-live="polite"
    >
      <div className="card border-mint-500/50 shadow-glowGreen p-4 flex items-center gap-3 max-w-xs">
        <span className="text-3xl animate-floaty" aria-hidden>{top.icon}</span>
        <div className="min-w-0">
          <p className="text-xs text-mint-300 font-semibold">🎉 成就解锁</p>
          <p className="font-bold text-slate-100 truncate">{top.title}</p>
          <p className="text-xs text-slate-400">{top.description}</p>
        </div>
        <button
          onClick={() => dismissToast(top.id)}
          className="text-slate-500 hover:text-slate-300 ml-1"
          aria-label="关闭提示"
        >✕</button>
      </div>
    </div>
  )
}
