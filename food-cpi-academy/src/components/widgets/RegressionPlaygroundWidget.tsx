import { useMemo, useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { ppiProcessedYoY, foodHomeYoY, months } from '../../data/series'
import { ols, r2For } from '../../lib/stats'
import { C } from '../charts/ChartRegistry'

/**
 * Regression Playground：
 * 散点 = ppiProcessedYoY(t−1) vs foodHomeYoY(t) 全样本；
 * 手动调 alpha/beta，再一键 OLS 最优（≈ Notebook 的 1.408 / 0.650）。
 */
export default function RegressionPlaygroundWidget() {
  // 全样本训练对（lag 1）
  const { xs, ys, points } = useMemo(() => {
    const xsAll: number[] = []
    const ysAll: number[] = []
    const pts: { x: number; y: number; m: string }[] = []
    for (let t = 1; t < months.length; t++) {
      const x = ppiProcessedYoY[t - 1]
      const y = foodHomeYoY[t]
      if (x != null && y != null) {
        xsAll.push(x)
        ysAll.push(y)
        pts.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), m: months[t] })
      }
    }
    // 均匀降采样到 ~250 点（保持形态）
    const step = Math.max(1, Math.floor(pts.length / 250))
    const sampled = pts.filter((_, i) => i % step === 0)
    return { xs: xsAll, ys: ysAll, points: sampled }
  }, [])

  const bestFit = useMemo(() => ols(xs, ys)!, [xs, ys])

  const [alpha, setAlpha] = useState(0.5)
  const [beta, setBeta] = useState(0.2)
  const [snapped, setSnapped] = useState(false)

  const manualR2 = useMemo(() => r2For(xs, ys, alpha, beta), [xs, ys, alpha, beta])
  const gap = bestFit.r2 - manualR2
  const closeToBest = gap < 0.005

  // 手动直线的两个端点
  const xMin = -12, xMax = 42
  const lineData = [
    { x: xMin, manual: alpha + beta * xMin, best: bestFit.alpha + bestFit.beta * xMin },
    { x: xMax, manual: alpha + beta * xMax, best: bestFit.alpha + bestFit.beta * xMax },
  ]

  const snapToOls = () => {
    setAlpha(Number(bestFit.alpha.toFixed(3)))
    setBeta(Number(bestFit.beta.toFixed(3)))
    setSnapped(true)
  }

  return (
    <div className="card p-5 space-y-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <ResponsiveContainer width="100%" height={330}>
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
              <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
              <XAxis
                type="number" dataKey="x" domain={[xMin, xMax]}
                tick={{ fill: C.text, fontSize: 11 }}
                label={{ value: 'ProcessedFoodsPPI YoY % (t−1)', fill: C.text, fontSize: 11, dy: 16 }}
              />
              <YAxis
                type="number" dataKey="y" domain={[-6, 22]}
                tick={{ fill: C.text, fontSize: 11 }}
                label={{ value: 'FoodAtHome YoY %', fill: C.text, fontSize: 11, angle: -90, dx: -6 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#141a30', border: '1px solid #313b5e', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => v.toFixed(2)}
                labelFormatter={() => ''}
              />
              <Scatter data={points} fill={C.sky} fillOpacity={0.45} shape="circle" isAnimationActive={false} />
              {/* 手动直线 */}
              <ReferenceLine
                segment={[{ x: lineData[0].x, y: lineData[0].manual }, { x: lineData[1].x, y: lineData[1].manual }]}
                stroke={C.amber} strokeWidth={2.5}
              />
              {/* OLS 最优直线（提示后显示） */}
              {snapped && (
                <ReferenceLine
                  segment={[{ x: lineData[0].x, y: lineData[0].best }, { x: lineData[1].x, y: lineData[1].best }]}
                  stroke={C.mint} strokeWidth={1.5} strokeDasharray="6 4"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-slate-500">
            每个点是一个月：横轴为上月 PPI YoY，纵轴为当月 Food at Home YoY（全样本 {bestFit.n} 个月，图中展示 {points.length} 个抽样点）
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="alpha-slider" className="text-sm text-slate-300">
              Alpha（截距）：<span className="font-bold text-amber2-300 num">{alpha.toFixed(3)}</span>
            </label>
            <input
              id="alpha-slider" type="range" min={-1} max={4} step={0.01}
              value={alpha}
              onChange={(e) => { setAlpha(Number(e.target.value)); setSnapped(false) }}
              className="w-full accent-[#fbbf24]"
            />
          </div>
          <div>
            <label htmlFor="beta-slider" className="text-sm text-slate-300">
              Beta（斜率）：<span className="font-bold text-amber2-300 num">{beta.toFixed(3)}</span>
            </label>
            <input
              id="beta-slider" type="range" min={-0.2} max={1.4} step={0.005}
              value={beta}
              onChange={(e) => { setBeta(Number(e.target.value)); setSnapped(false) }}
              className="w-full accent-[#fbbf24]"
            />
          </div>

          <div className={`rounded-xl border p-4 text-center ${closeToBest ? 'border-mint-500/60 bg-mint-500/10' : 'border-ink-600 bg-ink-850'}`}>
            <p className="text-xs text-slate-500">你的直线 R²</p>
            <p className={`text-3xl font-bold num ${closeToBest ? 'text-mint-300' : 'text-amber2-300'}`}>
              {Number.isNaN(manualR2) ? '—' : manualR2.toFixed(3)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 num">OLS 最优 R² = {bestFit.r2.toFixed(3)}</p>
            {closeToBest && <p className="text-[11px] text-mint-300 mt-1">🎉 几乎就是最优解！</p>}
          </div>

          <button onClick={snapToOls} className="btn-primary w-full text-sm">
            🤖 让 OLS 找最优
          </button>

          {snapped && (
            <div className="rounded-xl bg-sky2-500/10 border border-sky2-500/30 p-3 text-xs text-sky2-300 animate-slideUp">
              OLS 最优解：α = {bestFit.alpha.toFixed(3)}，β = {bestFit.beta.toFixed(3)}
              —— 与 Notebook 当前方程 <span className="font-mono">1.408 + 0.650 × PPI(t−1)</span> 一致
              （OLS 的本质：在所有可能的直线中，选残差平方和最小的那条）。
            </div>
          )}

          <p className="text-xs text-slate-500">
            💡 <strong className="text-slate-300">Residual（残差）</strong>
            = 点到直线的竖直距离 = 实际值 − 直线预测值。
            你调节滑块时，其实是在手动做 OLS 想自动做的事：让所有残差的平方和尽可能小。
          </p>
        </div>
      </div>
    </div>
  )
}
