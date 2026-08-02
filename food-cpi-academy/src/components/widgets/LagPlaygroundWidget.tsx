import { useMemo, useState } from 'react'
import {
  ppiProcessedYoY, wageProdYoY, foodHomeYoY, foodAwayYoY, monthIndex, months,
} from '../../data/series'
import { alignPairs, ols } from '../../lib/stats'
import { timeline } from '../../data/modelResults'

type Target = 'home' | 'away'

const CONFIG = {
  home: {
    targetLabel: 'Food at Home CPI YoY',
    predictorLabel: 'Processed Foods PPI YoY (WPU02)',
    target: foodHomeYoY,
    predictor: ppiProcessedYoY,
    noteZh: 'Notebook Cell 17 在 ≤1999 样本上得到最优 lag = 1（R² = 0.769）——你应该能亲手复现这个结果。',
  },
  away: {
    targetLabel: 'Food Away from Home CPI YoY',
    predictorLabel: 'L&H Wage YoY (Production, CES7000000008)',
    target: foodAwayYoY,
    predictor: wageProdYoY,
    noteZh: 'Notebook Cell 17 中该工资序列的最优 lag = 2（R² = 0.476）。注意：Primary Away 模型最终沿用的是 all-employee 工资 lag 12 的 legacy 模型。',
  },
} as const

/** Lag Alignment Playground：滑动 lag，实时用 ≤1999-12 训练样本计算 R² */
export default function LagPlaygroundWidget() {
  const [target, setTarget] = useState<Target>('home')
  const [lag, setLag] = useState(3)
  const cfg = CONFIG[target]
  const endIdx = monthIndex(timeline.lagTrainEnd)

  // 所有 lag 0-12 的 R²（与 Notebook Cell 17 同一算法：min_obs=60）
  const scan = useMemo(() => {
    const rows: { lag: number; r2: number | null; n: number }[] = []
    for (let L = 0; L <= 12; L++) {
      const { xs, ys } = alignPairs(cfg.predictor, cfg.target, L, endIdx)
      const fit = xs.length >= 60 ? ols(xs, ys) : null
      rows.push({ lag: L, r2: fit ? fit.r2 : null, n: xs.length })
    }
    return rows
  }, [cfg, endIdx])

  const current = scan[lag]
  const best = scan.reduce((a, b) => ((b.r2 ?? -1) > (a.r2 ?? -1) ? b : a), scan[0])
  const maxR2 = Math.max(...scan.map((s) => s.r2 ?? 0))
  const atBest = lag === best.lag

  // 对齐示意：目标月与所需 predictor 月
  const demoTargetIdx = monthIndex('1999-12')
  const alignRows = [0, 1, 2].map((k) => {
    const t = demoTargetIdx - k
    return { targetMonth: months[t], predictorMonth: months[t - lag] }
  })

  return (
    <div className="card p-5 space-y-5">
      {/* 目标切换 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500">选择 Target：</span>
        {(['home', 'away'] as Target[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTarget(t); setLag(3) }}
            className={`chip border px-3 py-1.5 text-xs transition ${
              target === t
                ? 'border-violet2-500 bg-violet2-600/20 text-violet2-300'
                : 'border-ink-600 text-slate-400 hover:border-violet2-500/50'
            }`}
            aria-pressed={target === t}
          >
            {t === 'home' ? '🛒 Food at Home' : '🍽️ Food Away'}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto hidden sm:inline">
          Predictor：<span className="term-en">{cfg.predictorLabel}</span>
        </span>
      </div>

      {/* Lag 滑块 */}
      <div>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
          <label htmlFor="lag-slider" className="text-sm text-slate-300">
            Lag（滞后月数）：<span className="font-bold text-violet2-300 num text-lg">{lag}</span> 个月
          </label>
          <span className="text-xs text-slate-500">训练样本：仅用 ≤ 1999-12（Lag-training Sample）</span>
        </div>
        <input
          id="lag-slider"
          type="range"
          min={0}
          max={12}
          step={1}
          value={lag}
          onChange={(e) => setLag(Number(e.target.value))}
          className="w-full accent-[#8b5cf6]"
          aria-valuetext={`lag ${lag} 个月`}
        />
        <div className="flex justify-between text-[10px] text-slate-600 num px-0.5">
          {Array.from({ length: 13 }, (_, i) => <span key={i}>{i}</span>)}
        </div>
      </div>

      {/* 当前 R² 大数字 */}
      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className={`rounded-xl border p-4 ${atBest ? 'border-mint-500/60 bg-mint-500/10' : 'border-ink-600 bg-ink-850'}`}>
          <p className="text-xs text-slate-500">Training R² @ lag {lag}</p>
          <p className={`text-3xl font-bold num ${atBest ? 'text-mint-300' : 'text-slate-100'}`}>
            {current.r2 != null ? current.r2.toFixed(3) : '—'}
          </p>
          {atBest && <p className="text-[11px] text-mint-300 mt-1">🎉 这就是最优 lag！</p>}
        </div>
        <div className="rounded-xl border border-ink-600 bg-ink-850 p-4">
          <p className="text-xs text-slate-500">训练观测数 N</p>
          <p className="text-3xl font-bold text-slate-100 num">{current.n}</p>
        </div>
        <div className="rounded-xl border border-ink-600 bg-ink-850 p-4">
          <p className="text-xs text-slate-500">最优 lag（0–12 扫描）</p>
          <p className="text-3xl font-bold text-sky2-300 num">{best.lag}</p>
          <p className="text-[11px] text-slate-500 num">R² = {best.r2?.toFixed(3)}</p>
        </div>
      </div>

      {/* R² 柱状图 */}
      <div>
        <p className="text-xs text-slate-500 mb-2">13 个 lag 的 Training R² 对比（点击柱子可跳转）：</p>
        <div className="flex items-end gap-1.5 h-32" role="group" aria-label="各 lag 的 R² 柱状图">
          {scan.map((s) => (
            <button
              key={s.lag}
              onClick={() => setLag(s.lag)}
              className="flex-1 flex flex-col items-center gap-1 group h-full justify-end"
              aria-label={`lag ${s.lag}，R² ${s.r2?.toFixed(3) ?? '不可用'}`}
            >
              <span className="text-[9px] text-slate-500 num opacity-0 group-hover:opacity-100 transition">
                {s.r2?.toFixed(2)}
              </span>
              <span
                className={`w-full rounded-t transition-all ${
                  s.lag === lag ? 'bg-violet2-500' : s.lag === best.lag ? 'bg-mint-500/70' : 'bg-ink-600 group-hover:bg-ink-700'
                }`}
                style={{ height: `${Math.max(4, ((s.r2 ?? 0) / (maxR2 || 1)) * 100)}%` }}
              />
              <span className={`text-[10px] num ${s.lag === lag ? 'text-violet2-300 font-bold' : 'text-slate-500'}`}>{s.lag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 对齐示意 */}
      <div className="overflow-x-auto">
        <p className="text-xs text-slate-500 mb-2">
          对齐方式：预测某个 Target 月时，回归用的是 {lag} 个月前的 Predictor 值——
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="text-left px-2 py-1">Target 月（y = {cfg.targetLabel}）</th>
              <th className="text-left px-2 py-1">所需 Predictor 月（x，t−{lag}）</th>
            </tr>
          </thead>
          <tbody>
            {alignRows.map((r) => (
              <tr key={r.targetMonth} className="border-t border-ink-800">
                <td className="px-2 py-1.5 text-slate-200 num">{r.targetMonth}</td>
                <td className="px-2 py-1.5 text-amber2-300 num">{r.predictorMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-sky2-300 bg-sky2-500/10 border border-sky2-500/25 rounded-lg px-3 py-2">
        📓 {cfg.noteZh}
      </p>
    </div>
  )
}
