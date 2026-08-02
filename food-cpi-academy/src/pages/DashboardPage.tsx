import { Link } from 'react-router-dom'
import { useProgress, levelFor } from '../store/progress'
import { modules, allLessons } from '../content'
import { achievements } from '../data/achievements'
import { headlineNumbers, latestActual, timeline } from '../data/modelResults'
import XpBar from '../components/ui/XpBar'

export default function DashboardPage() {
  const { state, isLessonUnlocked, isLessonCompleted, overallCompletion, moduleCompletion } = useProgress()
  const lvl = levelFor(state.xp)
  const { done, total } = overallCompletion()

  // 下一节待学课程
  const nextLesson = allLessons.find((l) => !isLessonCompleted(l.id) && isLessonUnlocked(l.id))
  const nextModule = nextLesson ? modules.find((m) => m.id === nextLesson.moduleId) : undefined
  const unlockedAchievements = achievements.filter((a) => state.achievements[a.id])
  const meetingPassed = Object.values(state.meeting).filter((m) => m.passed).length

  return (
    <div className="space-y-6">
      <header className="card p-6 bg-gradient-to-br from-violet2-600/20 via-ink-900 to-sky2-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100">
              欢迎回来，Lv.{lvl.index} {lvl.title} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              课程进度 {done}/{total} · 徽章 {unlockedAchievements.length}/{achievements.length} · Mock Meeting {meetingPassed}/13
            </p>
            <div className="mt-3 max-w-sm"><XpBar /></div>
          </div>
          {nextLesson ? (
            <Link to={`/lesson/${nextLesson.id}`} className="btn-primary shrink-0">
              ▶ 继续学习：{nextLesson.title}
            </Link>
          ) : done === total && total > 0 ? (
            <Link to="/final" className="btn-success shrink-0">🏆 挑战 Final Challenge</Link>
          ) : (
            <Link to="/map" className="btn-primary shrink-0">查看课程地图</Link>
          )}
        </div>
        {nextModule && (
          <p className="mt-3 text-xs text-slate-500">
            当前模块：{nextModule.icon} {nextModule.title}（{moduleCompletion(nextModule.id).done}/{moduleCompletion(nextModule.id).total}）
          </p>
        )}
      </header>

      {/* 两个核心数字 */}
      <section className="grid sm:grid-cols-3 gap-4" aria-label="模型核心数字">
        <div className="card p-5 text-center">
          <p className="text-xs text-slate-500">Latest Actual · {timeline.currentOrigin}</p>
          <p className="text-3xl font-bold text-slate-100 num mt-1">{latestActual.rounded.total}%</p>
          <p className="text-xs text-slate-400 mt-1">Official Total Food CPI YoY</p>
        </div>
        <div className="card p-5 text-center border-violet2-500/50">
          <p className="text-xs text-violet2-300">Primary Forecast · 2027-06</p>
          <p className="text-3xl font-bold text-violet2-300 num mt-1">{headlineNumbers.primary12m}%</p>
          <p className="text-xs text-slate-400 mt-1">主预测（Primary Baseline）</p>
        </div>
        <div className="card p-5 text-center border-amber2-500/40">
          <p className="text-xs text-amber2-300">Survey Scenario · 2027-06</p>
          <p className="text-3xl font-bold text-amber2-300 num mt-1">{headlineNumbers.survey12m}%</p>
          <p className="text-xs text-slate-400 mt-1">调查敏感性情景（非主预测）</p>
        </div>
      </section>

      {/* 快捷入口 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3">🚀 快捷入口</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/playground/lag', icon: '🎯', title: 'Lag Playground', desc: '拖动 lag 看 R² 变化' },
            { to: '/playground/regression', icon: '📐', title: 'Regression', desc: '亲手拟合 α 和 β' },
            { to: '/playground/expanding', icon: '🔁', title: 'Expanding Window', desc: '逐月运行回测' },
            { to: '/playground/forecast', icon: '🔮', title: 'Forecast Explorer', desc: '12 个月预测审计' },
            { to: '/notebook', icon: '📓', title: 'Notebook 导读', desc: '45 cells 逐格讲解' },
            { to: '/meeting', icon: '🎤', title: 'Mock Meeting', desc: '13 个答辩问题' },
            { to: '/glossary', icon: '📖', title: 'Glossary', desc: '术语词汇表' },
            { to: '/progress', icon: '🏅', title: '成就与进度', desc: '徽章 · 薄弱点' },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="card card-hover p-4">
              <p className="text-2xl mb-1.5" aria-hidden>{c.icon}</p>
              <p className="font-semibold text-slate-100 text-sm">{c.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 薄弱知识点提醒 */}
      {state.weakAreas.length > 0 && (
        <section className="card p-5 border-amber2-500/40">
          <h2 className="text-sm font-semibold text-amber2-300 mb-2">🎯 建议复习的薄弱知识点</h2>
          <div className="flex flex-wrap gap-2">
            {state.weakAreas.slice(0, 12).map((w) => (
              <span key={w} className="chip bg-amber2-500/10 border border-amber2-500/40 text-amber2-300">{w}</span>
            ))}
          </div>
          <Link to="/progress" className="text-xs text-sky2-300 hover:underline mt-3 inline-block">查看全部 →</Link>
        </section>
      )}

      {/* 最近徽章 */}
      {unlockedAchievements.length > 0 && (
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">🏅 已获得徽章</h2>
          <div className="flex flex-wrap gap-3">
            {unlockedAchievements.map((a) => (
              <span key={a.id} className="text-2xl" title={`${a.title}：${a.description}`} aria-label={a.title}>
                {a.icon}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
