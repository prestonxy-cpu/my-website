import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { meetingQuestions } from '../content/meetingQuestions'
import { useProgress } from '../store/progress'
import type { MeetingQuestion } from '../types'

interface Evaluation {
  passed: boolean
  covered: string[]
  missed: { zh: string; en: string }[]
  missingTerms: string[]
}

function evaluate(q: MeetingQuestion, answer: string): Evaluation {
  const lower = answer.toLowerCase()
  const covered: string[] = []
  const missed: { zh: string; en: string }[] = []
  for (const kp of q.keyPoints) {
    if (kp.keywords.some((k) => lower.includes(k.toLowerCase()))) covered.push(kp.zh)
    else missed.push({ zh: kp.zh, en: kp.en })
  }
  const missingTerms = q.requiredTerms.filter((t) => !lower.includes(t.toLowerCase()))
  const passed = covered.length >= Math.ceil((q.keyPoints.length * 2) / 3) && missingTerms.length <= 1
  return { passed, covered, missed, missingTerms }
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

export default function MockMeetingPage() {
  const { state, recordMeeting } = useProgress()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [showReference, setShowReference] = useState(false)

  const passedCount = meetingQuestions.filter((q) => state.meeting[q.id]?.passed).length
  const active = meetingQuestions.find((q) => q.id === activeId) ?? null

  const openQuestion = (id: string) => {
    setActiveId(id)
    setAnswer(state.meeting[id]?.lastAnswer ?? '')
    setEvaluation(null)
    setShowReference(false)
  }

  const pickRandom = () => {
    const remaining = meetingQuestions.filter((q) => !state.meeting[q.id]?.passed)
    const pool = remaining.length > 0 ? remaining : meetingQuestions
    openQuestion(pool[Math.floor(Math.random() * pool.length)].id)
  }

  const submit = () => {
    if (!active || wordCount(answer) < 20) return
    const ev = evaluate(active, answer)
    setEvaluation(ev)
    setShowReference(true)
    recordMeeting(active.id, ev.passed, ev.missed.map((m) => m.zh), answer)
  }

  const words = wordCount(answer)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">🎤 Mock Pacific Life Meeting</h1>
        <p className="text-sm text-slate-400 mt-1">
          用英文回答会议追问。系统会检查核心要点覆盖度与必用术语，用中文指出遗漏，并给出英文参考答案。
          每题首次通过 +40 XP。
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-ink-700 overflow-hidden" role="progressbar"
            aria-valuenow={passedCount} aria-valuemin={0} aria-valuemax={13} aria-label="Mock Meeting 进度">
            <div className="h-full rounded-full bg-gradient-to-r from-violet2-500 to-mint-400 transition-all"
              style={{ width: `${(passedCount / 13) * 100}%` }} />
          </div>
          <span className="text-sm text-slate-300 num">{passedCount}/13 已通过</span>
          <button onClick={pickRandom} className="btn-primary text-sm">🎲 随机抽题</button>
        </div>
      </header>

      {!active ? (
        <div className="space-y-2">
          {meetingQuestions.map((q, i) => {
            const rec = state.meeting[q.id]
            return (
              <button
                key={q.id}
                onClick={() => openQuestion(q.id)}
                className={`w-full card card-hover p-4 text-left flex items-center gap-3 ${
                  rec?.passed ? 'border-mint-500/40' : ''
                }`}
              >
                <span className="text-lg shrink-0" aria-hidden>{rec?.passed ? '✅' : rec?.attempts ? '🔁' : '💬'}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100 text-sm">Q{i + 1}. {q.question}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{q.hintZh}</p>
                </div>
                {rec && !rec.passed && rec.attempts > 0 && (
                  <span className="chip bg-amber2-500/15 text-amber2-300 text-[10px] shrink-0">已尝试 {rec.attempts} 次</span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4 animate-slideUp">
          <button onClick={() => setActiveId(null)} className="btn-ghost text-sm">← 返回题目列表</button>

          <div className="card p-5 border-violet2-500/40">
            <p className="text-xs text-violet2-300 font-semibold mb-2">Pacific Life 提问：</p>
            <p className="text-lg font-semibold text-slate-100">{active.question}</p>
            <p className="text-xs text-slate-500 mt-2">💡 {active.hintZh}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500 self-center">建议使用术语：</span>
              {active.requiredTerms.map((t) => (
                <span key={t} className={`chip border text-[11px] ${
                  evaluation && evaluation.missingTerms.includes(t)
                    ? 'border-rose2-500/60 bg-rose2-500/10 text-rose2-400'
                    : 'border-sky2-500/40 bg-sky2-500/10 text-sky2-300'
                }`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <label htmlFor="meeting-answer" className="text-sm font-medium text-slate-300">
              你的英文回答（≥20 词）：
            </label>
            <textarea
              id="meeting-answer"
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); setEvaluation(null) }}
              rows={7}
              placeholder="Answer in English. Structure: conclusion → mechanism → numbers → limitation."
              className="input-dark w-full mt-2 text-sm resize-y font-mono"
            />
            <div className="mt-2 flex items-center gap-3">
              <span className={`text-xs num ${words >= 20 ? 'text-slate-500' : 'text-amber2-300'}`}>{words} 词</span>
              <button onClick={submit} disabled={words < 20} className="btn-primary text-sm ml-auto">
                提交回答
              </button>
            </div>
          </div>

          {evaluation && (
            <div className={`card p-5 animate-slideUp ${evaluation.passed ? 'border-mint-500/50' : 'border-amber2-500/50'}`} role="status">
              <p className={`font-bold ${evaluation.passed ? 'text-mint-300' : 'text-amber2-300'}`}>
                {evaluation.passed ? '✅ 通过！核心内容正确。' : '🔁 还差一点——看看遗漏了什么，然后重新作答。'}
              </p>

              {evaluation.covered.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-mint-300 mb-1">已覆盖的要点：</p>
                  <ul className="space-y-1">
                    {evaluation.covered.map((c) => (
                      <li key={c} className="text-sm text-slate-300 flex gap-2"><span className="text-mint-400">✓</span>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.missed.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-amber2-300 mb-1">遗漏的要点（已记入薄弱知识点）：</p>
                  <ul className="space-y-2">
                    {evaluation.missed.map((m) => (
                      <li key={m.zh} className="text-sm bg-amber2-500/10 border border-amber2-500/30 rounded-lg px-3 py-2">
                        <p className="text-amber2-200">✗ {m.zh}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{m.en}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.missingTerms.length > 0 && (
                <p className="mt-3 text-xs text-rose2-400">
                  ⚠️ 回答中未出现的关键术语：{evaluation.missingTerms.join(', ')}
                </p>
              )}

              <p className="mt-3 text-xs text-slate-500">
                建议复习：<Link to="/map" className="text-sky2-300 hover:underline">Module {active.reviewModuleId.slice(1)}</Link>
                {' '}· 可修改回答后再次提交。
              </p>
            </div>
          )}

          {showReference && (
            <div className="card p-5 border-sky2-500/40 animate-slideUp">
              <p className="text-xs font-semibold text-sky2-300 mb-2">📋 英文参考答案（simple English）：</p>
              <p className="text-sm text-slate-300 leading-relaxed">{active.referenceAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
