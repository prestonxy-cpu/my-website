import { Link } from 'react-router-dom'
import { modules } from '../content'
import { useProgress } from '../store/progress'

const accentClasses = {
  violet: 'from-violet2-600/25 to-violet2-600/5 border-violet2-500/40',
  sky: 'from-sky2-500/25 to-sky2-500/5 border-sky2-500/40',
  mint: 'from-mint-500/25 to-mint-500/5 border-mint-500/40',
  amber: 'from-amber2-500/25 to-amber2-500/5 border-amber2-500/40',
  rose: 'from-rose2-500/25 to-rose2-500/5 border-rose2-500/40',
} as const

export default function CourseMapPage() {
  const { isModuleUnlocked, isLessonUnlocked, isLessonCompleted, moduleCompletion } = useProgress()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100 pixel-title">🗺️ Course Map 课程地图</h1>
        <p className="text-sm text-slate-400 mt-1">
          沿着学习路径逐节解锁。每个模块最后一课是 Checkpoint 🚩，通过后解锁下一个模块。
        </p>
      </header>

      <div className="relative">
        {modules.map((m, mi) => {
          const unlocked = isModuleUnlocked(m.id)
          const { done, total } = moduleCompletion(m.id)
          const moduleDone = total > 0 && done === total
          return (
            <div key={m.id} className="relative pl-8 pb-8">
              {/* 路径连接线 */}
              {mi < modules.length - 1 && (
                <span className="absolute left-[13px] top-10 bottom-0 w-[3px] path-connector" aria-hidden />
              )}
              {/* 节点 */}
              <span
                aria-hidden
                className={`absolute left-0 top-2 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2
                  ${moduleDone
                    ? 'bg-mint-500/20 border-mint-500 text-mint-300'
                    : unlocked
                      ? 'bg-violet2-600/20 border-violet2-500 text-violet2-300 animate-pulseSoft'
                      : 'bg-ink-800 border-ink-600 text-slate-600'}`}
              >
                {moduleDone ? '✓' : unlocked ? '●' : '🔒'}
              </span>

              <div className={`card bg-gradient-to-br ${accentClasses[m.accent]} ${unlocked ? '' : 'opacity-55'}`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{m.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-100">{m.title}</h2>
                      <p className="text-xs text-slate-400 truncate">{m.subtitle}</p>
                    </div>
                    <span className="text-xs text-slate-400 num shrink-0">{done}/{total}</span>
                  </div>

                  {unlocked && m.lessons.length > 0 && (
                    <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                      {m.lessons.map((l) => {
                        const lUnlocked = isLessonUnlocked(l.id)
                        const lDone = isLessonCompleted(l.id)
                        return (
                          <li key={l.id}>
                            <Link
                              to={lUnlocked || lDone ? `/lesson/${l.id}` : '#'}
                              aria-disabled={!lUnlocked && !lDone}
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition
                                ${lDone
                                  ? 'border-mint-500/40 bg-mint-500/10 text-mint-200'
                                  : lUnlocked
                                    ? 'border-ink-600 bg-ink-900/60 hover:border-violet2-500/60 text-slate-200'
                                    : 'border-ink-700 bg-ink-900/40 text-slate-600 cursor-not-allowed pointer-events-none'}`}
                            >
                              <span aria-hidden>{lDone ? '✅' : lUnlocked ? (l.isCheckpoint ? '🚩' : '▶️') : '🔒'}</span>
                              <span className="flex-1 truncate">{l.title}</span>
                              <span className="text-[10px] text-slate-500 num">+{l.xp}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {!unlocked && (
                    <p className="mt-2 text-xs text-slate-500">完成上一个模块的全部课程后解锁</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* 终点：Final Challenge */}
        <div className="relative pl-8">
          <span aria-hidden className="absolute left-0 top-2 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 bg-amber2-500/20 border-amber2-400 text-amber2-300">🏆</span>
          <Link to="/final" className="card card-hover block p-5 bg-gradient-to-br from-amber2-500/20 to-rose2-500/10 border-amber2-500/40">
            <h2 className="font-bold text-slate-100">Final Challenge 终极挑战</h2>
            <p className="text-xs text-slate-400 mt-1">综合测验 + 12 项独立解释清单。通过（≥80 分）获得 🏆 徽章与 200 XP。</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
