import { useMemo, useState } from 'react'
import { ppiProcessedYoY, foodHomeYoY, monthIndex, months } from '../../data/series'
import { alignPairs, ols, rmse } from '../../lib/stats'
import { fmtMonthZh } from '../../lib/format'

/**
 * Expanding-window Simulator（Home baseline 教学版，horizon = 1）。
 * 五步状态机：Estimate Model → Forecast Next Month → Reveal Actual
 * → Add Month to Training Window → Move to Next Origin。
 * 真实 Notebook 在每个 origin 预测 1–12 个月，这里演示 h=1 让流程更直观。
 */

type Step = 'estimate' | 'forecast' | 'reveal' | 'add' | 'next'

interface Round {
  origin: string
  alpha: number
  beta: number
  n: number
  forecast: number
  actual: number | null
  error: number | null
}

const FIRST_ORIGIN = '2016-01'
const LAST_ORIGIN = '2025-05' // 保证下月实际值存在

export default function ExpandingSimWidget() {
  const firstIdx = monthIndex(FIRST_ORIGIN)
  const lastIdx = monthIndex(LAST_ORIGIN)

  const [originIdx, setOriginIdx] = useState(firstIdx)
  const [step, setStep] = useState<Step>('estimate')
  const [fit, setFit] = useState<{ alpha: number; beta: number; n: number } | null>(null)
  const [forecast, setForecast] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [added, setAdded] = useState(false)
  const [history, setHistory] = useState<Round[]>([])

  const origin = months[originIdx]
  const targetIdx = originIdx + 1
  const targetMonth = months[targetIdx]
  const ppiAtOrigin = ppiProcessedYoY[originIdx]
  const actual = foodHomeYoY[targetIdx]

  const trainStart = useMemo(() => {
    const { idx } = alignPairs(ppiProcessedYoY, foodHomeYoY, 1, originIdx)
    return idx.length > 0 ? months[idx[0]] : '—'
  }, [originIdx])

  const doEstimate = () => {
    const { xs, ys } = alignPairs(ppiProcessedYoY, foodHomeYoY, 1, originIdx)
    const f = ols(xs, ys)
    if (!f) return
    setFit({ alpha: f.alpha, beta: f.beta, n: f.n })
    setStep('forecast')
  }

  const doForecast = () => {
    if (!fit || ppiAtOrigin == null) return
    setForecast(fit.alpha + fit.beta * ppiAtOrigin)
    setStep('reveal')
  }

  const doReveal = () => {
    setRevealed(true)
    setStep('add')
  }

  const doAdd = () => {
    setAdded(true)
    setStep('next')
  }

  const doNext = () => {
    if (fit && forecast != null) {
      setHistory((h) => [...h, {
        origin,
        alpha: fit.alpha,
        beta: fit.beta,
        n: fit.n,
        forecast,
        actual: actual ?? null,
        error: actual != null ? actual - forecast : null,
      }])
    }
    setOriginIdx((i) => Math.min(i + 1, lastIdx))
    setFit(null)
    setForecast(null)
    setRevealed(false)
    setAdded(false)
    setStep('estimate')
  }

  const reset = () => {
    setOriginIdx(firstIdx)
    setFit(null)
    setForecast(null)
    setRevealed(false)
    setAdded(false)
    setHistory([])
    setStep('estimate')
  }

  const errors = history.filter((h) => h.error != null).map((h) => h.error!)
  const runningRmse = errors.length > 0 ? rmse(errors) : null

  const stepButtons: { key: Step; label: string; action: () => void; desc: string }[] = [
    { key: 'estimate', label: '1️⃣ Estimate Model', action: doEstimate, desc: '用截至 origin 的全部历史重新估计 α 和 β' },
    { key: 'forecast', label: '2️⃣ Forecast Next Month', action: doForecast, desc: '用固定的 lag-1 PPI 生成下月预测' },
    { key: 'reveal', label: '3️⃣ Reveal Actual', action: doReveal, desc: '揭晓实际值，计算 Forecast Error' },
    { key: 'add', label: '4️⃣ Add Month to Training Window', action: doAdd, desc: '把新数据并入训练窗口（窗口扩大！）' },
    { key: 'next', label: '5️⃣ Move to Next Origin', action: doNext, desc: '前进到下一个 Forecast Origin，重复全过程' },
  ]

  return (
    <div className="card p-5 space-y-5">
      {/* 当前 origin 与窗口可视化 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip bg-violet2-600/20 border border-violet2-500/40 text-violet2-300">
          Forecast Origin：<strong className="num">{origin}</strong>
        </span>
        <span className="chip bg-ink-800 border border-ink-600 text-slate-400">
          训练窗口：{trainStart} → {origin}{added && ' + 1 个月 ✓'}
        </span>
        <button onClick={reset} className="btn-ghost text-xs ml-auto">↺ 重置</button>
      </div>

      {/* 窗口扩大动画条 */}
      <div className="h-6 rounded-lg bg-ink-850 border border-ink-700 relative overflow-hidden" aria-hidden>
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet2-600/50 to-sky2-500/50 transition-all duration-500"
          style={{ width: `${((originIdx - monthIndex('1953-01')) / (lastIdx - monthIndex('1953-01'))) * 100}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-300">
          Expanding Window：起点固定，终点随 origin 前移而扩大
        </span>
      </div>

      {/* 五步按钮 */}
      <div className="grid sm:grid-cols-5 gap-2">
        {stepButtons.map((b) => {
          const isActive = step === b.key
          const isDone = stepButtons.findIndex((s) => s.key === step) > stepButtons.findIndex((s) => s.key === b.key)
          return (
            <button
              key={b.key}
              onClick={b.action}
              disabled={!isActive || originIdx >= lastIdx}
              title={b.desc}
              className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition
                ${isActive
                  ? 'border-violet2-500 bg-violet2-600/20 text-violet2-200 animate-pulseSoft'
                  : isDone
                    ? 'border-mint-500/40 bg-mint-500/10 text-mint-300'
                    : 'border-ink-700 bg-ink-850 text-slate-600'}`}
            >
              {b.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 -mt-2">
        {stepButtons.find((b) => b.key === step)?.desc}
      </p>

      {/* 本轮详情 */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-ink-600 bg-ink-850 p-4 text-sm space-y-2">
          <p className="text-xs font-semibold text-slate-400">📐 本轮回归（在 origin = {origin} 重新估计）</p>
          {fit ? (
            <>
              <p className="font-mono text-[13px] text-slate-200">
                FoodAtHome(t) = <span className="text-amber2-300 num">{fit.alpha.toFixed(3)}</span> +{' '}
                <span className="text-amber2-300 num">{fit.beta.toFixed(3)}</span> × PPI(t−1)
              </p>
              <p className="text-xs text-slate-500 num">训练观测 N = {fit.n}（lag 与变量固定，系数每轮重估）</p>
            </>
          ) : (
            <p className="text-slate-600 text-xs">点击 Estimate Model 开始</p>
          )}
          {forecast != null && fit && ppiAtOrigin != null && (
            <p className="text-xs text-sky2-300 bg-sky2-500/10 rounded-lg px-2.5 py-1.5 font-mono">
              预测 {targetMonth}：{fit.alpha.toFixed(3)} + {fit.beta.toFixed(3)} × {ppiAtOrigin.toFixed(3)} ={' '}
              <strong className="num">{forecast.toFixed(3)}%</strong>
            </p>
          )}
          {revealed && forecast != null && (
            <p className="text-xs rounded-lg px-2.5 py-1.5 bg-ink-900 border border-ink-600">
              实际 {fmtMonthZh(targetMonth)}：<strong className="num text-slate-100">{actual != null ? `${actual.toFixed(3)}%` : '缺失'}</strong>
              {actual != null && (
                <> · Forecast Error = {actual.toFixed(3)} − {forecast.toFixed(3)} ={' '}
                  <strong className={`num ${Math.abs(actual - forecast) < 1 ? 'text-mint-300' : 'text-amber2-300'}`}>
                    {(actual - forecast).toFixed(3)} pp
                  </strong>
                </>
              )}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-ink-600 bg-ink-850 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400">📊 已完成的 origins（{history.length}）</p>
            {runningRmse != null && (
              <span className="chip bg-violet2-600/20 text-violet2-300 text-[10px] num">
                运行中 RMSE：{runningRmse.toFixed(3)} pp
              </span>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-slate-600">完成一整轮后，这里会累计你的回测记录。</p>
          ) : (
            <div className="overflow-x-auto max-h-44 overflow-y-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-slate-500 sticky top-0 bg-ink-850">
                    <th className="text-left px-1.5 py-1">Origin</th>
                    <th className="text-right px-1.5 py-1">α</th>
                    <th className="text-right px-1.5 py-1">β</th>
                    <th className="text-right px-1.5 py-1">N</th>
                    <th className="text-right px-1.5 py-1">预测</th>
                    <th className="text-right px-1.5 py-1">实际</th>
                    <th className="text-right px-1.5 py-1">误差</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.origin} className="border-t border-ink-800 num">
                      <td className="px-1.5 py-1 text-slate-300">{h.origin}</td>
                      <td className="px-1.5 py-1 text-right text-slate-400">{h.alpha.toFixed(2)}</td>
                      <td className="px-1.5 py-1 text-right text-slate-400">{h.beta.toFixed(3)}</td>
                      <td className="px-1.5 py-1 text-right text-slate-500">{h.n}</td>
                      <td className="px-1.5 py-1 text-right text-sky2-300">{h.forecast.toFixed(2)}</td>
                      <td className="px-1.5 py-1 text-right text-slate-200">{h.actual != null ? h.actual.toFixed(2) : '—'}</td>
                      <td className={`px-1.5 py-1 text-right ${h.error != null && Math.abs(h.error) < 1 ? 'text-mint-300' : 'text-amber2-300'}`}>
                        {h.error != null ? h.error.toFixed(2) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        ⚠️ 教学简化：这里每个 origin 只预测下 1 个月（h=1）。真实 Notebook（Cell 21）在每个 origin
        预测 1–12 个月，并把 12-month-ahead 的误差作为主要评估对象。注意观察：β 会随窗口扩大而缓慢变化——
        这就是「系数在每个 Forecast Origin 重新估计」的含义。
      </p>
    </div>
  )
}
