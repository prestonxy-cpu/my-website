import { useState } from 'react'
import { Link } from 'react-router-dom'
import { finalQuizzes, explainChecklist } from '../content/finalChallenge'
import { useProgress } from '../store/progress'

type Stage = 'intro' | 'quiz' | 'result'

export default function FinalChallengePage() {
  const { state, recordFinal } = useProgress()
  const [stage, setStage] = useState<Stage>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [checked, setChecked] = useState<boolean[]>(explainChecklist.map(() => false))

  const start = () => {
    setAnswers(finalQuizzes.map(() => null))
    setCurrent(0)
    setStage('quiz')
  }

  const answerCurrent = (optId: string) => {
    if (answers[current] != null) return
    const next = [...answers]
    next[current] = optId
    setAnswers(next)
  }

  const goNext = () => {
    if (current < finalQuizzes.length - 1) {
      setCurrent(current + 1)
    } else {
      const score = finalQuizzes.reduce((acc, q, i) => {
        const sel = answers[i]
        const ok = sel != null && q.options.find((o) => o.id === sel)?.correct
        return acc + (ok ? 5 : 0)
      }, 0)
      recordFinal(score)
      setStage('result')
    }
  }

  const score = finalQuizzes.reduce((acc, q, i) => {
    const sel = answers[i]
    const ok = sel != null && q.options.find((o) => o.id === sel)?.correct
    return acc + (ok ? 5 : 0)
  }, 0)

  if (stage === 'intro') {
    return (
      <div className="space-y-6">
        <header className="card p-6 bg-gradient-to-br from-amber2-500/20 to-rose2-500/10 border-amber2-500/40 text-center">
          <p className="text-5xl mb-3 animate-floaty" aria-hidden>🏆</p>
          <h1 className="text-2xl font-bold text-slate-100 pixel-title">Final Challenge 终极挑战</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            20 道综合题，覆盖全部 13 个模块的核心概念与关键数字。每题 5 分，
            <strong className="text-amber2-300"> 80 分通过</strong>，通过获得 🏆 徽章与 200 XP。
            每题只有一次作答机会，答完立刻看到解释。
          </p>
          {state.finalBestScore > 0 && (
            <p className="mt-3 text-sm num">
              历史最高分：<span className={state.finalPassed ? 'text-mint-300' : 'text-amber2-300'}>{state.finalBestScore}/100</span>
              {state.finalPassed && ' · 已通过 ✓'}
            </p>
          )}
          <button onClick={start} className="btn-primary mt-5 text-base px-8 py-3">
            {state.finalBestScore > 0 ? '再次挑战' : '开始挑战'}
          </button>
        </header>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            📜 课程最终目标：你现在应该能独立解释以下 12 件事
          </h2>
          <ul className="space-y-2">
            {explainChecklist.map((item, i) => (
              <li key={i}>
                <label className="flex items-start gap-3 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => {
                      const next = [...checked]
                      next[i] = !next[i]
                      setChecked(next)
                    }}
                    className="mt-1 accent-[#34d399]"
                  />
                  <span className={checked[i] ? 'text-mint-300' : 'text-slate-300 group-hover:text-slate-100'}>
                    {item.zh}
                    <span className="block text-xs text-slate-500 font-mono">{item.en}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500 num">
            自查：{checked.filter(Boolean).length}/12 —— 有不确定的就回对应模块复习，再来挑战。
          </p>
        </section>
      </div>
    )
  }

  if (stage === 'quiz') {
    const q = finalQuizzes[current]
    const sel = answers[current]
    const selOpt = sel != null ? q.options.find((o) => o.id === sel) : null
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-ink-700 overflow-hidden" role="progressbar"
            aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={20} aria-label="挑战进度">
            <div className="h-full bg-gradient-to-r from-amber2-400 to-rose2-400 transition-all"
              style={{ width: `${((current + 1) / finalQuizzes.length) * 100}%` }} />
          </div>
          <span className="text-sm text-slate-400 num">{current + 1}/{finalQuizzes.length}</span>
        </div>

        <div className="card p-6">
          <p className="font-semibold text-slate-100 text-lg mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isSel = sel === o.id
              const showState = sel != null
              return (
                <button
                  key={o.id}
                  onClick={() => answerCurrent(o.id)}
                  disabled={sel != null}
                  className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition ${
                    showState && o.correct
                      ? 'border-mint-500 bg-mint-500/10 text-mint-200'
                      : isSel
                        ? 'border-rose2-500 bg-rose2-500/10 text-rose2-400'
                        : 'border-ink-600 hover:border-amber2-500/60 disabled:opacity-60'
                  }`}
                >
                  {o.text}
                </button>
              )
            })}
          </div>

          {selOpt && (
            <div className={`mt-4 rounded-xl p-4 text-sm animate-slideUp ${
              selOpt.correct
                ? 'bg-mint-500/10 border border-mint-500/40 text-mint-200'
                : 'bg-rose2-500/10 border border-rose2-500/40 text-slate-300'
            }`} role="status">
              <p className="font-semibold mb-1">{selOpt.correct ? '✔ +5 分' : '✘ 0 分'}</p>
              <p>{selOpt.explanation}</p>
              {!selOpt.correct && q.conceptReview && (
                <p className="mt-2 text-xs text-amber2-300">📌 建议复习：{q.conceptReview}</p>
              )}
            </div>
          )}

          {sel != null && (
            <button onClick={goNext} className="btn-primary mt-4 w-full">
              {current < finalQuizzes.length - 1 ? '下一题 →' : '交卷，看成绩 🏁'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // result
  const passed = score >= 80
  return (
    <div className="space-y-5">
      <div className={`card p-8 text-center ${passed ? 'border-mint-500/50 shadow-glowGreen' : 'border-amber2-500/50'}`}>
        <p className="text-6xl mb-3 animate-pop" aria-hidden>{passed ? '🏆' : '💪'}</p>
        <h1 className="text-3xl font-extrabold text-slate-100 num">{score}/100</h1>
        <p className={`mt-2 font-semibold ${passed ? 'text-mint-300' : 'text-amber2-300'}`}>
          {passed
            ? '通过！你已经可以自信地走进 Pacific Life 会议室了。+200 XP（首次通过）'
            : '未达 80 分——看看下面每题的解释，回模块复习后再战。'}
        </p>
        <div className="mt-5 flex justify-center gap-3 flex-wrap">
          <button onClick={start} className="btn-secondary">再考一次</button>
          <Link to="/meeting" className="btn-primary">🎤 去 Mock Meeting 实战</Link>
          {!passed && <Link to="/map" className="btn-ghost">回课程地图复习</Link>}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400">逐题回顾：</h2>
        {finalQuizzes.map((q, i) => {
          const sel = answers[i]
          const opt = sel != null ? q.options.find((o) => o.id === sel) : null
          const correct = q.options.find((o) => o.correct)!
          const ok = opt?.correct ?? false
          return (
            <div key={i} className={`card p-4 border-l-4 ${ok ? 'border-l-mint-500' : 'border-l-rose2-500'}`}>
              <p className="text-sm font-medium text-slate-200">
                {ok ? '✅' : '❌'} 第 {i + 1} 题：{q.question}
              </p>
              {!ok && (
                <div className="mt-2 text-xs space-y-1">
                  <p className="text-rose2-400">你的选择：{opt?.text ?? '未作答'}</p>
                  <p className="text-mint-300">正确答案：{correct.text}</p>
                  <p className="text-slate-400">{correct.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
