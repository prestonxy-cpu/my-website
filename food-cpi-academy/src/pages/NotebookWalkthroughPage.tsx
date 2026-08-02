import { useMemo, useState } from 'react'
import { walkthroughCells } from '../content/walkthrough'
import { notebookMeta } from '../data/modelResults'

const ALL = '全部章节'

export default function NotebookWalkthroughPage() {
  const sections = useMemo(() => {
    const seen: string[] = []
    for (const c of walkthroughCells) {
      if (!seen.includes(c.section)) seen.push(c.section)
    }
    return seen
  }, [])

  const [filter, setFilter] = useState<string>(ALL)
  const [cursor, setCursor] = useState(0)

  const visible = filter === ALL
    ? walkthroughCells
    : walkthroughCells.filter((c) => c.section === filter)
  const cell = visible[Math.min(cursor, visible.length - 1)]

  const jumpSection = (s: string) => {
    setFilter(s)
    setCursor(0)
  }

  if (!cell) {
    return <div className="card p-8 text-center text-slate-400">走读内容正在准备中。</div>
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">📓 Notebook Walkthrough</h1>
        <p className="text-sm text-slate-400 mt-1">
          「{notebookMeta.title}」——{notebookMeta.cellCount} 个 cell、{notebookMeta.sectionCount} 个章节逐格讲解：
          每段代码在做什么、为什么需要、输入输出、改错后果、与最终预测的关系。
        </p>
      </header>

      {/* 章节过滤 */}
      <div className="flex gap-1.5 flex-wrap">
        {[ALL, ...sections].map((s) => (
          <button
            key={s}
            onClick={() => jumpSection(s)}
            className={`chip border text-[11px] px-2.5 py-1 transition ${
              filter === s
                ? 'border-violet2-500 bg-violet2-600/20 text-violet2-300'
                : 'border-ink-600 text-slate-400 hover:border-violet2-500/50'
            }`}
            aria-pressed={filter === s}
          >
            {s === ALL ? s : s.length > 34 ? s.slice(0, 34) + '…' : s}
          </button>
        ))}
      </div>

      {/* 进度与导航 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCursor((c) => Math.max(0, c - 1))}
          disabled={cursor === 0}
          className="btn-secondary text-sm"
        >← 上一格</button>
        <div className="flex-1 text-center">
          <span className="text-sm text-slate-300 num">
            Cell {cell.index}/44
          </span>
          <span className="text-xs text-slate-500 ml-2">（本组 {cursor + 1}/{visible.length}）</span>
        </div>
        <button
          onClick={() => setCursor((c) => Math.min(visible.length - 1, c + 1))}
          disabled={cursor >= visible.length - 1}
          className="btn-primary text-sm"
        >下一格 →</button>
      </div>
      <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden" aria-hidden>
        <div
          className="h-full bg-gradient-to-r from-violet2-500 to-sky2-400 transition-all"
          style={{ width: `${((cell.index + 1) / 45) * 100}%` }}
        />
      </div>

      {/* 当前 cell 卡片 */}
      <article className="card overflow-hidden animate-slideUp" key={cell.index}>
        <div className="px-5 py-3 bg-ink-850 border-b border-ink-700 flex items-center gap-3 flex-wrap">
          <span className={`chip text-[10px] border ${
            cell.cellType === 'code'
              ? 'border-sky2-500/50 bg-sky2-500/10 text-sky2-300'
              : 'border-amber2-500/50 bg-amber2-500/10 text-amber2-300'
          }`}>
            {cell.cellType === 'code' ? '⌨️ code' : '📝 markdown'}
          </span>
          <span className="text-xs text-slate-500">Cell {cell.index}</span>
          <span className="text-xs text-slate-500 truncate">{cell.section}</span>
        </div>

        <div className="p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-100">{cell.title}</h2>

          {cell.code && (
            <pre className="codeblock"><code>{cell.code}</code></pre>
          )}
          {cell.outputSummary && (
            <div>
              <p className="text-[11px] text-slate-500 mb-1">输出摘要：</p>
              <p className="text-sm text-mint-300/90 bg-ink-950/70 border border-ink-700 rounded-xl px-3 py-2.5">
                {cell.outputSummary}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet2-600/10 border border-violet2-500/30 p-3.5">
              <p className="text-xs font-semibold text-violet2-300 mb-1">🔍 这段在做什么</p>
              <p className="text-sm text-slate-300 leading-relaxed">{cell.whatItDoes}</p>
            </div>
            <div className="rounded-xl bg-sky2-500/10 border border-sky2-500/30 p-3.5">
              <p className="text-xs font-semibold text-sky2-300 mb-1">🎯 为什么需要它</p>
              <p className="text-sm text-slate-300 leading-relaxed">{cell.whyNeeded}</p>
            </div>
            {cell.inputs && (
              <div className="rounded-xl bg-ink-850 border border-ink-600 p-3.5">
                <p className="text-xs font-semibold text-slate-400 mb-1">📥 输入</p>
                <p className="text-sm text-slate-300">{cell.inputs}</p>
              </div>
            )}
            {cell.outputs && (
              <div className="rounded-xl bg-ink-850 border border-ink-600 p-3.5">
                <p className="text-xs font-semibold text-slate-400 mb-1">📤 输出</p>
                <p className="text-sm text-slate-300">{cell.outputs}</p>
              </div>
            )}
            {cell.ifBroken && (
              <div className="rounded-xl bg-rose2-500/10 border border-rose2-500/30 p-3.5">
                <p className="text-xs font-semibold text-rose2-400 mb-1">💥 如果改错会怎样</p>
                <p className="text-sm text-slate-300">{cell.ifBroken}</p>
              </div>
            )}
            {cell.linkToForecast && (
              <div className="rounded-xl bg-mint-500/10 border border-mint-500/30 p-3.5">
                <p className="text-xs font-semibold text-mint-300 mb-1">🔮 与最终预测的关系</p>
                <p className="text-sm text-slate-300">{cell.linkToForecast}</p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* 全部 cell 快速索引 */}
      <details className="card p-4">
        <summary className="text-sm font-semibold text-slate-300 cursor-pointer">📑 全部 45 个 cell 快速索引</summary>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
          {walkthroughCells.map((c) => (
            <button
              key={c.index}
              onClick={() => {
                setFilter(ALL)
                setCursor(c.index)
              }}
              className={`text-left text-xs rounded-lg px-2.5 py-1.5 transition ${
                filter === ALL && cell.index === c.index
                  ? 'bg-violet2-600/20 text-violet2-300'
                  : 'hover:bg-ink-800 text-slate-400'
              }`}
            >
              <span className="num text-slate-600">{String(c.index).padStart(2, '0')}</span>{' '}
              {c.cellType === 'code' ? '⌨️' : '📝'} {c.title}
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
