import { useMemo, useState } from 'react'
import type {
  Exercise, SortOrderExercise, MatchPairsExercise, FillNumberExercise, CategorizeExercise,
} from '../../types'

interface Props {
  exercise: Exercise
  onDone?: () => void
}

/** 稳定伪随机打乱（避免每次渲染变化） */
function shuffled<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Feedback({ ok, correctText, wrongText }: { ok: boolean; correctText: string; wrongText: string }) {
  return (
    <div
      role="status"
      className={`mt-3 rounded-xl p-3 text-sm animate-slideUp ${
        ok
          ? 'bg-mint-500/10 border border-mint-500/40 text-mint-200'
          : 'bg-amber2-500/10 border border-amber2-500/40 text-amber2-300'
      }`}
    >
      {ok ? `✔ ${correctText}` : `✘ ${wrongText}`}
    </div>
  )
}

/* ---------------- 排序题 ---------------- */
function SortOrder({ ex, onDone }: { ex: SortOrderExercise; onDone?: () => void }) {
  const initial = useMemo(() => shuffled(ex.correctOrder, ex.correctOrder.join('').length), [ex])
  const [items, setItems] = useState(initial)
  const [checked, setChecked] = useState<boolean | null>(null)

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
    setChecked(null)
  }

  const check = () => {
    const ok = items.every((it, i) => it === ex.correctOrder[i])
    setChecked(ok)
    if (ok) onDone?.()
  }

  return (
    <div>
      <ol className="space-y-2">
        {items.map((it, i) => (
          <li key={it} className="flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-850 px-3 py-2 text-sm">
            <span className="text-slate-500 num w-5">{i + 1}.</span>
            <span className="flex-1">{it}</span>
            <button onClick={() => move(i, -1)} disabled={i === 0} className="btn-ghost px-2 py-1 text-xs" aria-label={`上移 ${it}`}>↑</button>
            <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="btn-ghost px-2 py-1 text-xs" aria-label={`下移 ${it}`}>↓</button>
          </li>
        ))}
      </ol>
      <button onClick={check} className="btn-primary mt-3 text-sm">检查顺序</button>
      {checked !== null && <Feedback ok={checked} correctText={ex.feedbackCorrect} wrongText={ex.feedbackWrong} />}
    </div>
  )
}

/* ---------------- 配对题 ---------------- */
function MatchPairs({ ex, onDone }: { ex: MatchPairsExercise; onDone?: () => void }) {
  const rights = useMemo(
    () => shuffled(ex.pairs.map((p) => p.right), ex.pairs.length * 31 + ex.title.length),
    [ex],
  )
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [wrongFlash, setWrongFlash] = useState<string | null>(null)
  const done = Object.keys(matches).length === ex.pairs.length

  const tryMatch = (right: string) => {
    if (!selLeft) return
    const pair = ex.pairs.find((p) => p.left === selLeft)!
    if (pair.right === right) {
      const next = { ...matches, [selLeft]: right }
      setMatches(next)
      setSelLeft(null)
      if (Object.keys(next).length === ex.pairs.length) onDone?.()
    } else {
      setWrongFlash(right)
      setTimeout(() => setWrongFlash(null), 700)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {ex.pairs.map((p) => {
            const matched = matches[p.left] !== undefined
            return (
              <button
                key={p.left}
                onClick={() => !matched && setSelLeft(p.left)}
                disabled={matched}
                className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition
                  ${matched
                    ? 'border-mint-500/50 bg-mint-500/10 text-mint-300'
                    : selLeft === p.left
                      ? 'border-violet2-500 bg-violet2-600/15'
                      : 'border-ink-600 hover:border-violet2-500/50'}`}
              >
                {p.left} {matched && '✓'}
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rights.map((r) => {
            const matched = Object.values(matches).includes(r)
            return (
              <button
                key={r}
                onClick={() => tryMatch(r)}
                disabled={matched || !selLeft}
                className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition
                  ${matched
                    ? 'border-mint-500/50 bg-mint-500/10 text-mint-300'
                    : wrongFlash === r
                      ? 'border-rose2-500 bg-rose2-500/15'
                      : 'border-ink-600 hover:border-sky2-500/60'}`}
              >
                {r} {matched && '✓'}
              </button>
            )
          })}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">先点左边一项，再点右边与之配对的一项。</p>
      {done && <Feedback ok correctText={ex.feedbackCorrect} wrongText={ex.feedbackWrong} />}
    </div>
  )
}

/* ---------------- 数值题 ---------------- */
function FillNumber({ ex, onDone }: { ex: FillNumberExercise; onDone?: () => void }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<'ok' | 'wrong' | null>(null)

  const check = () => {
    const v = parseFloat(value)
    if (Number.isNaN(v)) return
    const ok = Math.abs(v - ex.answer) <= ex.tolerance
    setResult(ok ? 'ok' : 'wrong')
    if (ok) onDone?.()
  }

  return (
    <div>
      <p className="text-sm text-slate-300 mb-2 font-mono bg-ink-850 rounded-xl px-3 py-2 border border-ink-600">
        {ex.prompt}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={(e) => { setValue(e.target.value); setResult(null) }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          className="input-dark w-40 num"
          aria-label="输入你的答案"
          placeholder="你的答案"
        />
        {ex.unit && <span className="text-slate-400 text-sm">{ex.unit}</span>}
        <button onClick={check} className="btn-primary text-sm">检查</button>
      </div>
      {result && (
        <div
          role="status"
          className={`mt-3 rounded-xl p-3 text-sm animate-slideUp ${
            result === 'ok'
              ? 'bg-mint-500/10 border border-mint-500/40 text-mint-200'
              : 'bg-amber2-500/10 border border-amber2-500/40 text-amber2-300'
          }`}
        >
          <p className="font-semibold mb-1">{result === 'ok' ? '✔ 正确！' : `✘ 不对（允许误差 ±${ex.tolerance}）。`}</p>
          <p className="text-slate-300">{ex.solution}</p>
        </div>
      )}
    </div>
  )
}

/* ---------------- 分类题 ---------------- */
function Categorize({ ex, onDone }: { ex: CategorizeExercise; onDone?: () => void }) {
  const items = useMemo(
    () => shuffled(ex.items, ex.items.length * 17 + ex.title.length),
    [ex],
  )
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<boolean | null>(null)
  const allPlaced = items.every((it) => placed[it.text])

  const place = (text: string, cat: string) => {
    setPlaced((p) => ({ ...p, [text]: cat }))
    setChecked(null)
  }

  const check = () => {
    const ok = items.every((it) => placed[it.text] === it.category)
    setChecked(ok)
    if (ok) onDone?.()
  }

  return (
    <div>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.text} className="rounded-xl border border-ink-600 bg-ink-850 p-3">
            <p className="text-sm mb-2">{it.text}</p>
            <div className="flex flex-wrap gap-2">
              {ex.categories.map((cat) => {
                const isSel = placed[it.text] === cat
                const isWrong = checked === false && isSel && it.category !== cat
                const isRight = checked !== null && isSel && it.category === cat
                return (
                  <button
                    key={cat}
                    onClick={() => place(it.text, cat)}
                    className={`chip border transition text-xs px-3 py-1.5 ${
                      isRight
                        ? 'border-mint-500 bg-mint-500/15 text-mint-300'
                        : isWrong
                          ? 'border-rose2-500 bg-rose2-500/15 text-rose2-400'
                          : isSel
                            ? 'border-violet2-500 bg-violet2-600/20 text-violet2-300'
                            : 'border-ink-600 text-slate-400 hover:border-violet2-500/60'
                    }`}
                    aria-pressed={isSel}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
            {checked === false && placed[it.text] !== it.category && it.note && (
              <p className="mt-2 text-xs text-amber2-300">{it.note}</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={check} disabled={!allPlaced} className="btn-primary mt-3 text-sm">
        检查分类
      </button>
      {checked !== null && <Feedback ok={checked} correctText={ex.feedbackCorrect} wrongText={ex.feedbackWrong} />}
    </div>
  )
}

export default function ExerciseBlock({ exercise, onDone }: Props) {
  return (
    <div className="card p-5 border-l-4 border-l-mint-500">
      <p className="text-xs font-semibold text-mint-300 mb-1">🧩 互动任务</p>
      <p className="font-medium text-slate-100">{exercise.title}</p>
      <p className="text-sm text-slate-400 mt-1 mb-3">{exercise.instructions}</p>
      {exercise.kind === 'sortOrder' && <SortOrder ex={exercise} onDone={onDone} />}
      {exercise.kind === 'matchPairs' && <MatchPairs ex={exercise} onDone={onDone} />}
      {exercise.kind === 'fillNumber' && <FillNumber ex={exercise} onDone={onDone} />}
      {exercise.kind === 'categorize' && <Categorize ex={exercise} onDone={onDone} />}
    </div>
  )
}
