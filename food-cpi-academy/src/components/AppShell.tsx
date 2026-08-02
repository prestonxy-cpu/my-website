import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useProgress, levelFor } from '../store/progress'
import { modules } from '../content'
import { glossary } from '../content/glossary'
import XpBar from './ui/XpBar'
import AchievementToasts from './ui/AchievementToasts'

const NAV_ITEMS = [
  { to: '/dashboard', label: '主页', icon: '🏠' },
  { to: '/map', label: '课程', icon: '🗺️' },
  { to: '/playground/lag', label: '练习', icon: '🧪', match: '/playground' },
  { to: '/meeting', label: '面试', icon: '🎤' },
  { to: '/progress', label: '进度', icon: '📊' },
]

function SidebarCourseMap() {
  const { isModuleUnlocked, moduleCompletion } = useProgress()
  const location = useLocation()
  return (
    <nav aria-label="课程地图" className="space-y-1">
      {modules.map((m) => {
        const unlocked = isModuleUnlocked(m.id)
        const { done, total } = moduleCompletion(m.id)
        const active = m.lessons.some((l) => location.pathname === `/lesson/${l.id}`)
        return (
          <div key={m.id}>
            <Link
              to={unlocked && m.lessons.length > 0 ? `/lesson/${m.lessons[0].id}` : '/map'}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition
                ${active ? 'bg-violet2-600/20 text-violet2-300 border border-violet2-500/40' : 'hover:bg-ink-800 text-slate-300'}
                ${unlocked ? '' : 'opacity-45'}`}
            >
              <span aria-hidden>{unlocked ? m.icon : '🔒'}</span>
              <span className="flex-1 truncate">{m.title}</span>
              <span className="text-xs text-slate-500 num">{done}/{total}</span>
            </Link>
          </div>
        )
      })}
      <div className="pt-3 mt-3 border-t border-ink-700 space-y-1">
        <Link to="/notebook" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink-800 text-slate-300">
          <span aria-hidden>📓</span> Notebook Walkthrough
        </Link>
        <Link to="/final" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink-800 text-slate-300">
          <span aria-hidden>🏆</span> Final Challenge
        </Link>
        <Link to="/glossary" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink-800 text-slate-300">
          <span aria-hidden>📖</span> Glossary 词汇表
        </Link>
      </div>
    </nav>
  )
}

function RightRail() {
  const { state, setNotes, removeWeakArea } = useProgress()
  const [notesDraft, setNotesDraft] = useState(state.notes)
  useEffect(() => setNotesDraft(state.notes), [state.notes])
  const [q, setQ] = useState('')
  const hits = useMemo(() => {
    if (!q.trim()) return []
    const lower = q.trim().toLowerCase()
    return glossary
      .filter((g) => g.zh.includes(q.trim()) || g.en.toLowerCase().includes(lower))
      .slice(0, 5)
  }, [q])
  const lvl = levelFor(state.xp)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-slate-400">Lv.{lvl.index} {lvl.title}</span>
          <span className="text-sm font-semibold text-violet2-300 num">{state.xp} XP</span>
        </div>
        <XpBar />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">📖 快速查词</h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索术语，如 lag、RMSE…"
          className="input-dark w-full text-sm"
          aria-label="搜索词汇表"
        />
        {hits.length > 0 && (
          <ul className="mt-2 space-y-1">
            {hits.map((h) => (
              <li key={h.id}>
                <Link to={`/glossary?focus=${h.id}`} className="block rounded-lg px-2 py-1 text-xs hover:bg-ink-800">
                  <span className="text-slate-200">{h.zh}</span>{' '}
                  <span className="term-en">({h.en})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">📝 我的笔记</h3>
        <textarea
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          onBlur={() => setNotes(notesDraft)}
          placeholder="随手记：术语、问题、会议要点…"
          rows={5}
          className="input-dark w-full text-sm resize-y"
          aria-label="学习笔记"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">🎯 薄弱知识点</h3>
        {state.weakAreas.length === 0 ? (
          <p className="text-xs text-slate-500">暂无。答错的概念会自动出现在这里。</p>
        ) : (
          <ul className="space-y-1">
            {state.weakAreas.map((w) => (
              <li key={w} className="flex items-center gap-2 text-xs text-amber2-300">
                <span className="flex-1">{w}</span>
                <button
                  onClick={() => removeWeakArea(w)}
                  className="text-slate-500 hover:text-slate-300"
                  aria-label={`移除 ${w}`}
                  title="已掌握，移除"
                >✓</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function AppShell() {
  const { state } = useProgress()
  const lvl = levelFor(state.xp)
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-ink-950/80 border-b border-ink-700">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-slate-100">
            <span className="text-xl" aria-hidden>🌾</span>
            <span className="hidden sm:inline">Food CPI Forecast Academy</span>
            <span className="sm:hidden">CPI Academy</span>
          </Link>
          <div className="flex-1" />
          <nav className="hidden md:flex items-center gap-1" aria-label="主导航">
            {NAV_ITEMS.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive || (n.match && location.hash.includes(n.match))
                      ? 'bg-violet2-600/25 text-violet2-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-ink-800'
                  }`
                }
              >
                {n.icon} {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="chip bg-violet2-600/20 text-violet2-300 border border-violet2-500/40">
            <span aria-hidden>⭐</span>
            <span className="num">{state.xp} XP</span>
            <span className="hidden sm:inline text-slate-400">· Lv.{lvl.index}</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_280px] lg:grid-cols-[240px_minmax(0,1fr)] gap-6">
        <aside className="hidden lg:block">
          <div className="sticky top-20 card p-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <SidebarCourseMap />
          </div>
        </aside>

        <main className="min-w-0 pb-24 md:pb-8">
          <Outlet />
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <RightRail />
          </div>
        </aside>
      </div>

      {/* 移动端底部导航 */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-t border-ink-700 grid grid-cols-5"
        aria-label="底部导航"
      >
        {NAV_ITEMS.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                isActive ? 'text-violet2-300' : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg" aria-hidden>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <AchievementToasts />
    </div>
  )
}
