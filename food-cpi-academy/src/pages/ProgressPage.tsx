import { Link } from 'react-router-dom'
import { useProgress, levelFor, LEVELS } from '../store/progress'
import { modules } from '../content'
import { achievements } from '../data/achievements'
import XpBar from '../components/ui/XpBar'

export default function ProgressPage() {
  const {
    state, moduleCompletion, overallCompletion, removeWeakArea, resetAll,
  } = useProgress()
  const lvl = levelFor(state.xp)
  const { done, total } = overallCompletion()
  const meetingPassed = Object.values(state.meeting).filter((m) => m.passed).length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">🏅 Progress & Achievements</h1>
      </header>

      <section className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-4xl font-extrabold text-violet2-300 num">Lv.{lvl.index}</p>
            <p className="text-slate-300 font-semibold">{lvl.title}</p>
          </div>
          <div className="flex-1">
            <XpBar />
            <p className="text-xs text-slate-500 mt-2 num">
              总 XP：{state.xp} · 课程 {done}/{total} · Mock Meeting {meetingPassed}/13 · Final 最高分 {state.finalBestScore}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {LEVELS.map((l, i) => (
            <span
              key={l.xp}
              className={`chip text-[10px] border ${
                state.xp >= l.xp
                  ? 'border-violet2-500/60 bg-violet2-600/15 text-violet2-300'
                  : 'border-ink-700 text-slate-600'
              }`}
            >
              Lv.{i + 1} {l.title}（{l.xp}+）
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3">📚 各模块进度</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((m) => {
            const { done: d, total: t } = moduleCompletion(m.id)
            const pct = t > 0 ? Math.round((d / t) * 100) : 0
            return (
              <div key={m.id} className="card p-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden>{m.icon}</span>
                  <p className="text-sm font-medium text-slate-200 flex-1 truncate">{m.title}</p>
                  <span className="text-xs text-slate-500 num">{d}/{t}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-mint-400' : 'bg-violet2-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3">
          🏆 徽章（{Object.keys(state.achievements).length}/{achievements.length}）
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((a) => {
            const unlocked = !!state.achievements[a.id]
            return (
              <div
                key={a.id}
                className={`card p-4 text-center ${unlocked ? 'border-mint-500/40' : 'opacity-45 grayscale'}`}
                title={a.description}
              >
                <p className="text-3xl mb-1.5" aria-hidden>{unlocked ? a.icon : '🔒'}</p>
                <p className="text-sm font-semibold text-slate-200">{a.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{a.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold text-amber2-300 mb-2">🎯 薄弱知识点</h2>
        {state.weakAreas.length === 0 ? (
          <p className="text-sm text-slate-500">
            暂无记录。选择题答错、自我解释缺概念、Mock Meeting 遗漏要点时会自动记录在这里。
          </p>
        ) : (
          <ul className="space-y-2">
            {state.weakAreas.map((w) => (
              <li key={w} className="flex items-center gap-3 text-sm">
                <span className="flex-1 text-amber2-200">{w}</span>
                <button onClick={() => removeWeakArea(w)} className="btn-ghost text-xs px-2 py-1">
                  已掌握 ✓
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-slate-500 mt-3">
          建议：针对薄弱点回到相应模块复习，或去 <Link to="/meeting" className="text-sky2-300 hover:underline">Mock Meeting</Link> 重新作答。
        </p>
      </section>

      <section className="card p-5 border-rose2-500/30">
        <h2 className="text-sm font-semibold text-rose2-400 mb-2">⚠️ 危险区</h2>
        <p className="text-xs text-slate-500 mb-3">清空所有学习进度、XP、徽章与笔记（保存在本地浏览器，无法恢复）。</p>
        <button
          onClick={() => {
            if (window.confirm('确定要清空全部学习进度吗？此操作无法撤销。')) resetAll()
          }}
          className="btn bg-rose2-500/15 border border-rose2-500/50 text-rose2-400 hover:bg-rose2-500/25 text-sm"
        >
          重置所有进度
        </button>
      </section>
    </div>
  )
}
