import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { glossary } from '../content/glossary'
import { useProgress } from '../store/progress'
import type { GlossaryEntry } from '../types'

const CATEGORIES: GlossaryEntry['category'][] = [
  'CPI 基础', '数据与转换', '回归与统计', '回测与评估', '模型与预测', '项目术语',
]

export default function GlossaryPage() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('全部')
  const { viewGlossary } = useProgress()
  const [open, setOpen] = useState<string | null>(focus)

  useEffect(() => {
    if (focus) {
      setOpen(focus)
      viewGlossary(focus)
      const el = document.getElementById(`term-${focus}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focus, viewGlossary])

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase()
    return glossary.filter((g) => {
      if (cat !== '全部' && g.category !== cat) return false
      if (!lower) return true
      return g.zh.toLowerCase().includes(lower) || g.en.toLowerCase().includes(lower)
        || g.definition.toLowerCase().includes(lower)
    })
  }, [q, cat])

  if (glossary.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3" aria-hidden>📖</p>
        <p className="text-slate-300">词汇表内容正在准备中。</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">📖 Glossary 词汇表</h1>
        <p className="text-sm text-slate-400 mt-1">
          共 {glossary.length} 个术语。点开条目会计入「词汇达人」成就。
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索中文或 English term…"
          className="input-dark flex-1"
          aria-label="搜索词汇表"
        />
        <div className="flex gap-1.5 flex-wrap">
          {['全部', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`chip border text-xs px-3 py-1.5 transition ${
                cat === c
                  ? 'border-violet2-500 bg-violet2-600/20 text-violet2-300'
                  : 'border-ink-600 text-slate-400 hover:border-violet2-500/50'
              }`}
              aria-pressed={cat === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">
          没有匹配「{q}」的术语。试试英文缩写或更短的关键词？
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((g) => {
            const isOpen = open === g.id
            return (
              <div key={g.id} id={`term-${g.id}`} className={`card overflow-hidden transition ${isOpen ? 'border-violet2-500/50' : ''}`}>
                <button
                  onClick={() => {
                    setOpen(isOpen ? null : g.id)
                    if (!isOpen) viewGlossary(g.id)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-ink-850/60"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-100">{g.zh}</span>
                  <span className="term-en text-sm">({g.en})</span>
                  <span className="chip bg-ink-800 text-slate-500 text-[10px] ml-auto shrink-0">{g.category}</span>
                  <span className="text-slate-500" aria-hidden>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-2 animate-slideUp">
                    <p className="text-sm text-slate-300 leading-relaxed">{g.definition}</p>
                    {g.example && (
                      <p className="text-xs text-sky2-300 bg-sky2-500/10 border border-sky2-500/25 rounded-lg px-3 py-2">
                        例：{g.example}
                      </p>
                    )}
                    {g.lessonId && (
                      <Link to={`/lesson/${g.lessonId}`} className="text-xs text-violet2-300 hover:underline inline-block">
                        → 前往相关课程
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
