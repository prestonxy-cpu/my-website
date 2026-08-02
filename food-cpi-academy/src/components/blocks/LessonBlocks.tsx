import type { LessonBlock, TermCard } from '../../types'
import Markdown from './Markdown'
import QuizBlock from './QuizBlock'
import ExerciseBlock from './ExerciseBlock'
import SelfExplainBlock from './SelfExplainBlock'
import ChartBlock from '../charts/ChartRegistry'
import WidgetBlock from '../widgets/WidgetRegistry'

function GoalBlock({ items }: { items: string[] }) {
  return (
    <div className="card p-5 bg-gradient-to-br from-violet2-600/15 to-sky2-500/10 border-violet2-500/40">
      <p className="text-xs font-semibold text-violet2-300 mb-2">🎯 本节目标</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
            <span className="text-violet2-400 mt-0.5" aria-hidden>▸</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TermsBlock({ cards }: { cards: TermCard[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {cards.map((c) => (
        <div key={c.en} className="card card-hover p-4">
          <p className="font-semibold text-slate-100">
            {c.zh} <span className="term-en text-sm">({c.en})</span>
          </p>
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{c.definition}</p>
          {c.example && (
            <p className="mt-2 text-xs text-sky2-300 bg-sky2-500/10 border border-sky2-500/25 rounded-lg px-2.5 py-1.5">
              例：{c.example}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function NotebookBlock({ title, code, output, note }: {
  title: string; code?: string; output?: string; note?: string
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-ink-850 border-b border-ink-700">
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-rose2-500/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-amber2-400/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-mint-400/70" />
        </span>
        <p className="text-xs font-semibold text-slate-400">📓 Notebook 真实例子 · {title}</p>
      </div>
      <div className="p-4 space-y-3">
        {code && <pre className="codeblock"><code>{code}</code></pre>}
        {output && (
          <div>
            <p className="text-[11px] text-slate-500 mb-1">运行输出：</p>
            <pre className="codeblock !bg-ink-900 text-mint-300/90">{output}</pre>
          </div>
        )}
        {note && <p className="text-sm text-slate-400">{note}</p>}
      </div>
    </div>
  )
}

function FormulaBlock({ lhs, rhs, note }: { lhs: string; rhs: string; note?: string }) {
  return (
    <div className="card p-5 text-center">
      <p className="font-mono text-base sm:text-lg text-slate-100 overflow-x-auto whitespace-nowrap py-1">
        <span className="text-sky2-300">{lhs}</span>
        <span className="text-slate-500 mx-2">=</span>
        <span className="text-violet2-300">{rhs}</span>
      </p>
      {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
    </div>
  )
}

const calloutStyles = {
  info: { border: 'border-sky2-500/50', bg: 'bg-sky2-500/10', icon: '💡', text: 'text-sky2-300' },
  warn: { border: 'border-amber2-500/50', bg: 'bg-amber2-500/10', icon: '⚠️', text: 'text-amber2-300' },
  success: { border: 'border-mint-500/50', bg: 'bg-mint-500/10', icon: '✅', text: 'text-mint-300' },
  danger: { border: 'border-rose2-500/50', bg: 'bg-rose2-500/10', icon: '🚨', text: 'text-rose2-400' },
} as const

function CalloutBlock({ variant, title, md }: {
  variant: keyof typeof calloutStyles; title?: string; md: string
}) {
  const s = calloutStyles[variant]
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
      {title && <p className={`font-semibold text-sm mb-1.5 ${s.text}`}>{s.icon} {title}</p>}
      <Markdown md={md} className="text-sm" />
    </div>
  )
}

function TableBlock({ headers, rows, note }: { headers: string[]; rows: string[][]; note?: string }) {
  return (
    <div className="card p-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-700">
              {headers.map((h) => (
                <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-ink-800 last:border-0 hover:bg-ink-850/60">
                {r.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-slate-300 num whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="px-3 py-2 text-xs text-slate-500">{note}</p>}
    </div>
  )
}

interface Props {
  block: LessonBlock
  lessonId: string
  onQuizResult?: (firstTry: boolean) => void
  onExerciseDone?: () => void
  onSelfExplainDone?: (missing: string[]) => void
}

export default function LessonBlockView({
  block, onQuizResult, onExerciseDone, onSelfExplainDone,
}: Props) {
  switch (block.type) {
    case 'goal': return <GoalBlock items={block.items} />
    case 'text': return <Markdown md={block.md} />
    case 'terms': return <TermsBlock cards={block.cards} />
    case 'notebook': return <NotebookBlock title={block.title} code={block.code} output={block.output} note={block.note} />
    case 'formula': return <FormulaBlock lhs={block.lhs} rhs={block.rhs} note={block.note} />
    case 'callout': return <CalloutBlock variant={block.variant} title={block.title} md={block.md} />
    case 'table': return <TableBlock headers={block.headers} rows={block.rows} note={block.note} />
    case 'chart': return <ChartBlock id={block.id} caption={block.caption} />
    case 'widget': return <WidgetBlock id={block.id} caption={block.caption} />
    case 'quiz': return <QuizBlock quiz={block.quiz} onResult={onQuizResult} />
    case 'exercise': return <ExerciseBlock exercise={block.exercise} onDone={onExerciseDone} />
    case 'selfExplain': return <SelfExplainBlock selfExplain={block.selfExplain} onDone={onSelfExplainDone} />
    default: return null
  }
}
