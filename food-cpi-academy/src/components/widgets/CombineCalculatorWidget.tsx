import { useState } from 'react'
import { weights, latestActual, headlineNumbers, primaryForecast, surveyForecast } from '../../data/modelResults'

/** Total Food 组合计算器：输入两个分项预测 → Total Food + Headline 贡献 */
export default function CombineCalculatorWidget() {
  const [home, setHome] = useState('2.63')
  const [away, setAway] = useState('3.63')

  const h = parseFloat(home)
  const a = parseFloat(away)
  const valid = !Number.isNaN(h) && !Number.isNaN(a)

  const hw = weights.homeWeightInsideFood
  const aw = weights.awayWeightInsideFood
  const total = valid ? hw * h + aw * a : null
  const contribution = total != null ? (total * weights.totalFoodRelativeImportance) / 100 : null

  const presets = [
    {
      label: 'Primary 2027-06',
      home: primaryForecast[11].home.toFixed(2),
      away: primaryForecast[11].away.toFixed(2),
    },
    {
      label: 'Latest Actual 2026-06',
      home: latestActual.foodAtHomeYoY.toFixed(2),
      away: latestActual.foodAwayYoY.toFixed(2),
    },
    {
      label: 'Survey 2027-06',
      home: surveyForecast[11].home.toFixed(2),
      away: surveyForecast[11].away.toFixed(2),
    },
  ]

  const nearPrimary = total != null && Math.abs(total - headlineNumbers.primary12mPrecise) < 0.05

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">一键填入：</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => { setHome(p.home); setAway(p.away) }}
            className="chip border border-ink-600 text-slate-300 hover:border-violet2-500/60 text-xs px-3 py-1.5"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-300">Food at Home 预测（YoY %）</span>
          <input
            type="number" step="0.01" inputMode="decimal"
            value={home} onChange={(e) => setHome(e.target.value)}
            className="input-dark w-full mt-1 num" aria-label="Food at Home 预测"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Food Away from Home 预测（YoY %）</span>
          <input
            type="number" step="0.01" inputMode="decimal"
            value={away} onChange={(e) => setAway(e.target.value)}
            className="input-dark w-full mt-1 num" aria-label="Food Away 预测"
          />
        </label>
      </div>

      {/* 逐步计算 */}
      <div className="rounded-xl bg-ink-850 border border-ink-600 p-4 space-y-2 font-mono text-[13px] overflow-x-auto">
        <p className="text-slate-400">
          HomeWeight = 8.188 / (8.188 + 5.260) = <span className="text-sky2-300 num">{hw.toFixed(4)}</span>
        </p>
        <p className="text-slate-400">
          AwayWeight = 5.260 / (8.188 + 5.260) = <span className="text-sky2-300 num">{aw.toFixed(4)}</span>
        </p>
        <p className="text-slate-300 whitespace-nowrap">
          FoodForecast = {hw.toFixed(4)} × {valid ? h.toFixed(2) : '?'} + {aw.toFixed(4)} × {valid ? a.toFixed(2) : '?'} ={' '}
          <strong className="text-violet2-300 num">{total != null ? total.toFixed(4) : '—'}%</strong>
        </p>
        <p className="text-slate-300 whitespace-nowrap">
          FoodContribution = {total != null ? total.toFixed(4) : '—'} × 13.447 / 100 ={' '}
          <strong className="text-mint-300 num">{contribution != null ? contribution.toFixed(4) : '—'} pp</strong>
        </p>
      </div>

      {/* 结果卡片 */}
      <div className="grid sm:grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-violet2-500/50 bg-violet2-600/10 p-4">
          <p className="text-xs text-slate-400">Total Food CPI Forecast</p>
          <p className="text-3xl font-bold text-violet2-300 num">{total != null ? `${total.toFixed(2)}%` : '—'}</p>
        </div>
        <div className="rounded-xl border border-mint-500/50 bg-mint-500/10 p-4">
          <p className="text-xs text-slate-400">Contribution to Headline CPI</p>
          <p className="text-3xl font-bold text-mint-300 num">{contribution != null ? `${contribution.toFixed(2)} pp` : '—'}</p>
        </div>
      </div>

      {nearPrimary && (
        <p className="text-xs text-mint-300 bg-mint-500/10 border border-mint-500/30 rounded-lg px-3 py-2 animate-slideUp">
          ✓ 与 Notebook 一致：Primary Baseline 2027-06 预测 Home 2.63% / Away 3.63% → Total ≈ 3.02%，
          对 Headline CPI 的贡献 ≈ 0.41 pp。
        </p>
      )}

      <p className="text-xs text-slate-500">
        权重来自 2026 年 6 月 CPI 发布（2026 年 5 月 relative importance）：Food at Home 8.188、
        Food Away 5.260、Total Food 13.447。注意：Notebook 的历史组合也使用当前权重（Limitation 4）。
      </p>
    </div>
  )
}
