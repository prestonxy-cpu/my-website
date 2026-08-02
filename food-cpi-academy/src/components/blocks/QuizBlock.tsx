import { useState } from 'react'
import type { Quiz } from '../../types'
import Markdown from './Markdown'

interface Props {
  quiz: Quiz
  onResult?: (correctFirstTry: boolean) => void
}

/** 选择题：即时反馈 + 答错解释 + 复习指引 */
export default function QuizBlock({ quiz, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  const options = quiz.options

  const choose = (id: string) => {
    if (solved) return
    setSelected(id)
    const opt = quiz.options.find((o) => o.id === id)!
    const newAttempts = [...attempts, id]
    setAttempts(newAttempts)
    if (opt.correct) {
      setSolved(true)
      onResult?.(newAttempts.length === 1)
    }
  }

  const selectedOpt = selected ? quiz.options.find((o) => o.id === selected) : null

  return (
    <div className="card p-5 border-l-4 border-l-sky2-500">
      <p className="text-xs font-semibold text-sky2-300 mb-2">✅ 选择题 · 即时反馈</p>
      <p className="font-medium text-slate-100 mb-3">{quiz.question}</p>
      <div className="space-y-2" role="radiogroup" aria-label="选择题选项">
        {options.map((o) => {
          const isSel = selected === o.id
          const wrongTried = attempts.includes(o.id) && !o.correct
          const showCorrect = solved && o.correct
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={isSel}
              onClick={() => choose(o.id)}
              disabled={solved && !o.correct}
              className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition
                ${showCorrect
                  ? 'border-mint-500 bg-mint-500/10 text-mint-300'
                  : wrongTried
                    ? 'border-rose2-500/60 bg-rose2-500/10 text-rose2-400'
                    : isSel
                      ? 'border-violet2-500 bg-violet2-600/10'
                      : 'border-ink-600 hover:border-violet2-500/50 hover:bg-ink-800'}`}
            >
              {o.text}
            </button>
          )
        })}
      </div>

      {selectedOpt && (
        <div
          className={`mt-3 rounded-xl p-3 text-sm animate-slideUp ${
            selectedOpt.correct
              ? 'bg-mint-500/10 border border-mint-500/40 text-mint-200'
              : 'bg-rose2-500/10 border border-rose2-500/40 text-slate-300'
          }`}
          role="status"
        >
          <p className="font-semibold mb-1">
            {selectedOpt.correct ? '✔ 回答正确！+10 XP（首次答对）' : '✘ 还不对——看看为什么：'}
          </p>
          <Markdown md={selectedOpt.explanation} className="text-sm" />
          {!selectedOpt.correct && quiz.conceptReview && (
            <p className="mt-2 text-xs text-amber2-300">
              📌 建议复习：{quiz.conceptReview}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
