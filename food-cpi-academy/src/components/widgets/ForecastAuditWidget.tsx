import { useState } from 'react'
import type { AuditRow } from '../../data/modelResults'
import {
  auditHomeBaseline, auditAwayLegacy, auditHomeSurvey, auditAwaySurvey,
  currentEquations, primaryForecast,
} from '../../data/modelResults'

type Tab = 'primary' | 'homeSurvey' | 'awaySurvey'

const TABS: { id: Tab; label: string; note?: string }[] = [
  { id: 'primary', label: 'Primary（Home + Away）' },
  { id: 'homeSurvey', label: 'Home Survey（敏感性）', note: '样例行；完整 72 行 audit 见 Notebook Cell 35' },
  { id: 'awaySurvey', label: 'Away Survey（敏感性）', note: '样例行；完整 72 行 audit 见 Notebook Cell 35' },
]

function rowsFor(tab: Tab): AuditRow[] {
  if (tab === 'primary') return [...auditHomeBaseline, ...auditAwayLegacy]
  if (tab === 'homeSurvey') return auditHomeSurvey
  return auditAwaySurvey
}

/** 该行的计算说明（α + β×x，与 primaryForecast 对得上） */
function calcFor(row: AuditRow): { formula: string; result?: number; matches?: string } | null {
  if (row.model === 'Home baseline') {
    const eq = currentEquations.homeBaseline
    const result = eq.alpha + eq.beta * row.value
    const fc = primaryForecast.find((f) => f.month === row.forecastMonth)
    return {
      formula: `${eq.alpha.toFixed(6)} + ${eq.beta.toFixed(6)} × ${row.value.toFixed(6)}`,
      result,
      matches: fc ? `= ${result.toFixed(4)}%，与 Primary 预测表中 ${row.forecastMonth} 的 Food at Home 预测（${fc.home.toFixed(4)}%）一致` : undefined,
    }
  }
  if (row.model === 'Away legacy all-employee') {
    const eq = currentEquations.awayLegacy
    const result = eq.alpha + eq.beta * row.value
    const fc = primaryForecast.find((f) => f.month === row.forecastMonth)
    return {
      formula: `${eq.alpha.toFixed(6)} + ${eq.beta.toFixed(6)} × ${row.value.toFixed(6)}`,
      result,
      matches: fc ? `= ${result.toFixed(4)}%，与 Primary 预测表中 ${row.forecastMonth} 的 Food Away 预测（${fc.away.toFixed(4)}%）一致` : undefined,
    }
  }
  // Survey 模型有两个 predictor，单行只展示该 predictor 的贡献
  const eq = row.model === 'Home survey expanded' ? currentEquations.homeSurvey : currentEquations.awaySurvey
  const beta = row.predictor === 'philly_future_prices_received' ? eq.betas[1] : eq.betas[0]
  return {
    formula: `该 predictor 的贡献：${beta.toFixed(6)} × ${row.value.toFixed(6)} = ${(beta * row.value).toFixed(4)}（完整预测 = α ${eq.alpha.toFixed(3)} + 两个 predictor 贡献之和）`,
  }
}

const predictorLabel: Record<string, string> = {
  ppi_processed_foods: 'Processed Foods PPI YoY',
  wage_leisure_hospitality_all: 'L&H Wage YoY (All)',
  wage_leisure_hospitality_production: 'L&H Wage YoY (Prod)',
  philly_future_prices_received: 'Philly Future Prices (level)',
}

export default function ForecastAuditWidget() {
  const [tab, setTab] = useState<Tab>('primary')
  const [expanded, setExpanded] = useState<number | null>(null)
  const rows = rowsFor(tab)
  const observedCount = rows.filter((r) => r.source === 'observed').length
  const assumedCount = rows.length - observedCount
  const tabDef = TABS.find((t) => t.id === tab)!

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-slate-100 mr-auto">📋 Forecast Input Audit 互动表</h3>
        <span className="chip bg-mint-500/15 border border-mint-500/40 text-mint-300 text-xs num">
          Observed × {observedCount}
        </span>
        <span className="chip bg-amber2-500/15 border border-amber2-500/40 text-amber2-300 text-xs num">
          Assumed × {assumedCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setExpanded(null) }}
            className={`chip border px-3 py-1.5 text-xs transition ${
              tab === t.id
                ? 'border-violet2-500 bg-violet2-600/20 text-violet2-300'
                : 'border-ink-600 text-slate-400 hover:border-violet2-500/50'
            }`}
            aria-pressed={tab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabDef.note && <p className="text-xs text-slate-500">ℹ️ {tabDef.note}</p>}

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[880px]">
          <thead>
            <tr className="text-slate-500 border-b border-ink-700">
              <th className="text-left px-2 py-2">Forecast Month</th>
              <th className="text-right px-2 py-2">Horizon</th>
              <th className="text-left px-2 py-2">Predictor</th>
              <th className="text-right px-2 py-2">Lag</th>
              <th className="text-left px-2 py-2">Required Predictor Month</th>
              <th className="text-left px-2 py-2">Info Cutoff</th>
              <th className="text-left px-2 py-2">Observed / Assumed</th>
              <th className="text-right px-2 py-2">Predictor Value</th>
              <th className="text-center px-2 py-2">计算</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isOpen = expanded === i
              const calc = calcFor(r)
              return (
                <FragmentRow
                  key={`${r.model}-${r.forecastMonth}-${r.predictor}`}
                  row={r} i={i} isOpen={isOpen} calc={calc}
                  onToggle={() => setExpanded(isOpen ? null : i)}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        💡 Home baseline（lag 1）：只有第 1 个月用 <span className="text-mint-300">Observed</span> PPI；
        后 11 个月用 <span className="text-amber2-300">最新 3 个月平均假设</span>（1.878983）。
        Away legacy（lag 12）：12 个月所需工资全部 <span className="text-mint-300">Observed</span>（2025-07 → 2026-06）。
        点击「展开」查看每行的完整计算式。
      </p>
    </div>
  )
}

function FragmentRow({ row, i, isOpen, calc, onToggle }: {
  row: AuditRow
  i: number
  isOpen: boolean
  calc: { formula: string; result?: number; matches?: string } | null
  onToggle: () => void
}) {
  const alphaBeta = row.model === 'Home baseline'
    ? { alpha: currentEquations.homeBaseline.alpha, beta: currentEquations.homeBaseline.beta }
    : row.model === 'Away legacy all-employee'
      ? { alpha: currentEquations.awayLegacy.alpha, beta: currentEquations.awayLegacy.beta }
      : null
  return (
    <>
      <tr className={`border-b border-ink-800 num hover:bg-ink-850/60 ${i % 2 ? 'bg-ink-900/40' : ''}`}>
        <td className="px-2 py-1.5 text-slate-200">{row.forecastMonth}</td>
        <td className="px-2 py-1.5 text-right text-slate-400">{row.horizon}</td>
        <td className="px-2 py-1.5 text-slate-300 whitespace-nowrap">{predictorLabel[row.predictor] ?? row.predictor}</td>
        <td className="px-2 py-1.5 text-right text-slate-400">{row.lag}</td>
        <td className="px-2 py-1.5 text-sky2-300">{row.requiredPredictorMonth}</td>
        <td className="px-2 py-1.5 text-slate-500">{row.informationCutoff}</td>
        <td className="px-2 py-1.5">
          {row.source === 'observed' ? (
            <span className="chip bg-mint-500/15 border border-mint-500/40 text-mint-300 text-[10px]">✓ Observed</span>
          ) : (
            <span className="chip bg-amber2-500/15 border border-amber2-500/40 text-amber2-300 text-[10px]">◌ Assumed（3M 平均）</span>
          )}
        </td>
        <td className={`px-2 py-1.5 text-right font-medium ${row.source === 'observed' ? 'text-mint-300' : 'text-amber2-300'}`}>
          {row.value.toFixed(4)}
        </td>
        <td className="px-2 py-1.5 text-center">
          <button onClick={onToggle} className="btn-ghost text-[10px] px-2 py-0.5" aria-expanded={isOpen}>
            {isOpen ? '收起 −' : '展开 +'}
          </button>
        </td>
      </tr>
      {isOpen && calc && (
        <tr className="bg-ink-850/80">
          <td colSpan={9} className="px-4 py-3">
            <div className="text-xs space-y-1 animate-slideUp">
              {alphaBeta && (
                <p className="text-slate-400">
                  Alpha = <span className="text-amber2-300 num">{alphaBeta.alpha.toFixed(6)}</span> ·
                  Beta = <span className="text-amber2-300 num">{alphaBeta.beta.toFixed(6)}</span>
                  （estimated through 2026-06；每个 forecast origin 重新估计）
                </p>
              )}
              <p className="font-mono text-slate-200">Forecast = {calc.formula}</p>
              {calc.matches && <p className="text-mint-300">✓ {calc.matches}</p>}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
