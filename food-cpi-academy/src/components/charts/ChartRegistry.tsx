import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, BarChart, Bar, ComposedChart, Area, ReferenceLine, Cell, LabelList,
} from 'recharts'
import type { ChartId } from '../../types'
import {
  months, foodHomeYoY, foodAwayYoY, foodTotalYoY, ppiProcessedYoY,
  wageAllYoY, phillyFutureLevel, monthIndex,
} from '../../data/series'
import {
  homeBestLags, awayBestLags, validationComparison, finalTestComparison,
  horizonMetrics, primaryForecast, surveyForecast, latestActual, weights, timeline,
} from '../../data/modelResults'

/* ---------- 通用配色与样式 ---------- */
export const C = {
  violet: '#8b5cf6',
  sky: '#38bdf8',
  mint: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  slate: '#94a3b8',
  grid: '#242c48',
  text: '#94a3b8',
}

const tooltipStyle = {
  backgroundColor: '#141a30',
  border: '1px solid #313b5e',
  borderRadius: 12,
  fontSize: 12,
  color: '#e2e8f0',
}

function seriesData(from: string, to: string, keys: { key: string; arr: (number | null)[] }[]) {
  const a = monthIndex(from)
  const b = monthIndex(to)
  const out: Record<string, string | number | null>[] = []
  for (let i = Math.max(a, 0); i <= b; i++) {
    const row: Record<string, string | number | null> = { m: months[i] }
    for (const k of keys) row[k.key] = k.arr[i] != null ? Number(k.arr[i]!.toFixed(3)) : null
    out.push(row)
  }
  return out
}

/** 每 n 个点抽 1 个（长历史图降采样） */
function thin<T>(arr: T[], n: number): T[] {
  return arr.filter((_, i) => i % n === 0 || i === arr.length - 1)
}

/* ---------- 各图表 ---------- */

function FoodHistoryChart() {
  const data = thin(seriesData('1953-01', '2026-06', [
    { key: 'home', arr: foodHomeYoY },
    { key: 'away', arr: foodAwayYoY },
  ]), 3)
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={60} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit="%" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine x="2000-01" stroke={C.slate} strokeDasharray="4 4" label={{ value: '旧 Notebook 起点', fill: C.slate, fontSize: 10, position: 'insideTopLeft' }} />
        <Line type="monotone" dataKey="home" name="Food at Home YoY" stroke={C.violet} dot={false} strokeWidth={1.6} connectNulls />
        <Line type="monotone" dataKey="away" name="Food Away YoY" stroke={C.mint} dot={false} strokeWidth={1.6} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}

function FoodHistoryRecentChart() {
  const data = seriesData('2015-01', '2026-06', [
    { key: 'total', arr: foodTotalYoY },
    { key: 'home', arr: foodHomeYoY },
    { key: 'away', arr: foodAwayYoY },
  ])
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={50} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit="%" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="total" name="Total Food YoY" stroke={C.sky} dot={false} strokeWidth={2} connectNulls />
        <Line type="monotone" dataKey="home" name="Food at Home YoY" stroke={C.violet} dot={false} strokeWidth={1.4} connectNulls />
        <Line type="monotone" dataKey="away" name="Food Away YoY" stroke={C.mint} dot={false} strokeWidth={1.4} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}

function PpiVsHomeChart() {
  const a = monthIndex('2010-01')
  const b = monthIndex('2026-06')
  const rows: Record<string, string | number | null>[] = []
  for (let i = a; i <= b; i++) {
    rows.push({
      m: months[i],
      home: foodHomeYoY[i] != null ? Number(foodHomeYoY[i]!.toFixed(3)) : null,
      // PPI 左移 1 个月（lag 1）：t 位置画的是 t-1 的 PPI
      ppiLag1: ppiProcessedYoY[i - 1] != null ? Number(ppiProcessedYoY[i - 1]!.toFixed(3)) : null,
    })
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={50} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit="%" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="home" name="Food at Home YoY (target)" stroke={C.violet} dot={false} strokeWidth={2} connectNulls />
        <Line type="monotone" dataKey="ppiLag1" name="Processed Foods PPI YoY (lag 1)" stroke={C.amber} dot={false} strokeWidth={1.6} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}

function WageVsAwayChart() {
  const a = monthIndex('2010-01')
  const b = monthIndex('2026-06')
  const rows: Record<string, string | number | null>[] = []
  for (let i = a; i <= b; i++) {
    rows.push({
      m: months[i],
      away: foodAwayYoY[i] != null ? Number(foodAwayYoY[i]!.toFixed(3)) : null,
      wageLag12: wageAllYoY[i - 12] != null ? Number(wageAllYoY[i - 12]!.toFixed(3)) : null,
    })
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={50} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit="%" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="away" name="Food Away YoY (target)" stroke={C.mint} dot={false} strokeWidth={2} connectNulls />
        <Line type="monotone" dataKey="wageLag12" name="L&H Wage YoY (lag 12)" stroke={C.sky} dot={false} strokeWidth={1.6} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}

const predictorShort: Record<string, string> = {
  ppi_finished_consumer_foods: 'Finished Foods PPI',
  ppi_processed_foods: 'Processed Foods PPI',
  ppi_food_manufacturing: 'Food Mfg PPI',
  ppi_farm_products: 'Farm PPI',
  philly_current_prices_paid: 'Philly Prices Paid',
  global_food_price_index: 'IMF Global Food',
  ppi_energy: 'Energy PPI',
  philly_future_prices_received: 'Philly Future Prices',
  wti_crude_oil: 'WTI Oil',
  wage_leisure_hospitality_production: 'L&H Wage (Prod)',
}

function LagScanChart({ which }: { which: 'home' | 'away' }) {
  const src = which === 'home' ? homeBestLags : awayBestLags
  const data = src.map((r) => ({
    name: `${predictorShort[r.predictor] ?? r.predictor} (lag ${r.lagMonths})`,
    r2: r.rSquared,
    isPrimary: which === 'home'
      ? r.predictor === 'ppi_processed_foods'
      : r.predictor === 'wage_leisure_hospitality_production',
  }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 42)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 1]} tick={{ fill: C.text, fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={170} tick={{ fill: C.text, fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v).toFixed(3), 'Training R²']} />
        <Bar dataKey="r2" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.isPrimary ? C.violet : C.grid === '#242c48' ? '#475081' : C.slate} />
          ))}
          <LabelList dataKey="r2" position="right" formatter={(v: number) => v.toFixed(3)} fill={C.text} fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function TimelineSamplesChart() {
  const phases = [
    { label: 'Lag-training（…→1999-12）', from: 1953, to: 2000, color: C.sky, desc: '选 lag' },
    { label: 'Pre-2016 Validation（2000-01→2014-12 origins）', from: 2000, to: 2015, color: C.amber, desc: '比模型' },
    { label: 'Final Test（2016-01→ origins）', from: 2016, to: 2026.5, color: C.mint, desc: '测表现' },
  ]
  const min = 1953, max = 2027
  return (
    <div className="space-y-2">
      {phases.map((p) => (
        <div key={p.label} className="relative h-10">
          <div className="absolute inset-y-1 rounded-lg opacity-80"
            style={{
              left: `${((p.from - min) / (max - min)) * 100}%`,
              width: `${((p.to - p.from) / (max - min)) * 100}%`,
              backgroundColor: p.color + '33',
              border: `1px solid ${p.color}`,
            }}
          />
          <span className="absolute inset-y-0 flex items-center text-xs text-slate-300 pl-2"
            style={{ left: `${((p.from - min) / (max - min)) * 100}%` }}>
            {p.label} · {p.desc}
          </span>
        </div>
      ))}
      <div className="flex justify-between text-[10px] text-slate-500 num">
        <span>1953</span><span>1970</span><span>1990</span><span>2000</span><span>2016</span><span>2027</span>
      </div>
    </div>
  )
}

function ValidationRmseChart() {
  const data = validationComparison.map((r) => ({
    name: r.model,
    rmse: r.oosRmse,
    comp: r.component,
  }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: C.text, fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={190} tick={{ fill: C.text, fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toFixed(3)} pp`, 'OOS RMSE (12M)']} />
        <Bar dataKey="rmse" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.comp === 'Food at Home' ? C.violet : C.mint} />
          ))}
          <LabelList dataKey="rmse" position="right" formatter={(v: number) => v.toFixed(2)} fill={C.text} fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function FinalTestChart({ metric }: { metric: 'rmse' | 'r2' }) {
  const data = finalTestComparison.map((r) => ({
    name: r.model,
    v: metric === 'rmse' ? r.oosRmse : r.oosR2VsNoChange,
    comp: r.component,
  }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: C.text, fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={190} tick={{ fill: C.text, fontSize: 11 }} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [
            metric === 'rmse' ? `${Number(v).toFixed(3)} pp` : Number(v).toFixed(3),
            metric === 'rmse' ? 'OOS RMSE (12M)' : 'OOS R² vs no-change',
          ]}
        />
        <Bar dataKey="v" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.comp === 'Food at Home' ? C.violet : C.mint} />
          ))}
          <LabelList dataKey="v" position="right" formatter={(v: number) => v.toFixed(2)} fill={C.text} fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function HorizonRmseChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={horizonMetrics as unknown as Record<string, number>[]} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="horizon" tick={{ fill: C.text, fontSize: 11 }} label={{ value: 'Forecast Horizon (months)', fill: C.text, fontSize: 11, dy: 14 }} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit=" pp" />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="primaryRmse" name="Primary Baseline OOS RMSE" stroke={C.violet} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="surveyRmse" name="Survey Sensitivity OOS RMSE" stroke={C.amber} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ForecastFanChart() {
  const hist = seriesData('2022-01', '2026-06', [{ key: 'actual', arr: foodTotalYoY }])
  const rows: Record<string, string | number | null>[] = hist.map((h) => ({
    ...h, primary: null, survey: null, lo: null, hi: null, band: null,
  }))
  // 连接点：最新实际值
  rows[rows.length - 1].primary = Number(latestActual.totalFoodYoY.toFixed(3))
  rows[rows.length - 1].survey = Number(latestActual.totalFoodYoY.toFixed(3))
  for (const f of primaryForecast) {
    const s = surveyForecast.find((x) => x.month === f.month)!
    rows.push({
      m: f.month,
      actual: null,
      primary: Number(f.total.toFixed(3)),
      survey: Number(s.total.toFixed(3)),
      lo: Number(f.empiricalLower95.toFixed(3)),
      hi: Number(f.empiricalUpper95.toFixed(3)),
      band: Number((f.empiricalUpper95 - f.empiricalLower95).toFixed(3)),
    })
  }
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={40} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} unit="%" domain={[-2, 9]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="lo" stackId="band" stroke="none" fill="transparent" name=" " legendType="none" />
        <Area type="monotone" dataKey="band" stackId="band" stroke="none" fill={C.violet} fillOpacity={0.12} name="Empirical 95% interval" />
        <Line type="monotone" dataKey="actual" name="Official Total Food YoY" stroke="#e2e8f0" strokeWidth={2} dot={false} connectNulls />
        <Line type="monotone" dataKey="primary" name="Primary Baseline（主预测）" stroke={C.violet} strokeWidth={2.2} strokeDasharray="6 3" dot={{ r: 3 }} connectNulls />
        <Line type="monotone" dataKey="survey" name="Survey Sensitivity（情景）" stroke={C.amber} strokeWidth={1.8} strokeDasharray="2 3" dot={{ r: 2.5 }} connectNulls />
        <ReferenceLine x={timeline.currentOrigin} stroke={C.slate} strokeDasharray="4 4" label={{ value: 'Latest actual', fill: C.slate, fontSize: 10, position: 'insideTopLeft' }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function WeightsBarChart() {
  const data = [
    { name: 'Food at Home', value: weights.foodAtHomeRelativeImportance, pct: weights.homeWeightInsideFood },
    { name: 'Food Away from Home', value: weights.foodAwayRelativeImportance, pct: weights.awayWeightInsideFood },
  ]
  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 60, bottom: 0, left: 8 }}>
          <XAxis type="number" hide domain={[0, 10]} />
          <YAxis type="category" dataKey="name" width={150} tick={{ fill: C.text, fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v, _n, item) => [
            `${Number(v).toFixed(3)}（Food 内部占比 ${(Number(item?.payload?.pct) * 100).toFixed(1)}%）`,
            'Relative importance',
          ]} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            <Cell fill={C.violet} />
            <Cell fill={C.mint} />
            <LabelList dataKey="value" position="right" formatter={(v: number) => v.toFixed(3)} fill={C.text} fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-xs text-slate-500 num">
        Total Food relative importance = {weights.totalFoodRelativeImportance}（占 Headline CPI 的 13.447%）
      </p>
    </div>
  )
}

function SurveyLevelChart() {
  const data = seriesData('2019-01', '2026-07', [{ key: 'philly', arr: phillyFutureLevel }])
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
        <XAxis dataKey="m" tick={{ fill: C.text, fontSize: 11 }} minTickGap={50} />
        <YAxis tick={{ fill: C.text, fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <ReferenceLine y={0} stroke={C.slate} />
        <Line type="monotone" dataKey="philly" name="Philly Fed Future Prices Received (level)" stroke={C.amber} strokeWidth={1.8} dot={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ---------- 注册表 ---------- */

const registry: Record<ChartId, () => JSX.Element> = {
  foodHistory: FoodHistoryChart,
  foodHistoryRecent: FoodHistoryRecentChart,
  ppiVsHomeCpi: PpiVsHomeChart,
  wageVsAwayCpi: WageVsAwayChart,
  lagScanHome: () => <LagScanChart which="home" />,
  lagScanAway: () => <LagScanChart which="away" />,
  timelineSamples: TimelineSamplesChart,
  validationRmse: ValidationRmseChart,
  finalTestRmse: () => <FinalTestChart metric="rmse" />,
  finalTestR2: () => <FinalTestChart metric="r2" />,
  horizonRmse: HorizonRmseChart,
  forecastFan: ForecastFanChart,
  weightsBar: WeightsBarChart,
  surveyLevelChart: SurveyLevelChart,
}

export default function ChartBlock({ id, caption }: { id: ChartId; caption?: string }) {
  const Chart = registry[id]
  if (!Chart) {
    return <div className="card p-4 text-sm text-slate-500">图表暂不可用：{id}</div>
  }
  return (
    <figure className="card p-4">
      <Chart />
      {caption && <figcaption className="mt-2 text-xs text-slate-500 text-center">{caption}</figcaption>}
    </figure>
  )
}
