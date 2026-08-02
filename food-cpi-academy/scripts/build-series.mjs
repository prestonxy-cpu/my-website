/**
 * 从 data/Food_CPI_Data.csv（Notebook 的备份数据）生成 src/data/series.ts。
 *
 * 转换规则与 Notebook Cell 13 完全一致：
 *   - 价格/工资序列: pct_change(12) * 100 （YoY %）
 *   - 调查扩散指数: 保持 level
 *
 * 生成后会用 Notebook 已知输出做校验（例如 2026-06 Food at Home YoY = 2.704309），
 * 校验不通过则报错退出，保证网站数值可追溯到 Notebook。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const csvPath = join(root, 'data', 'Food_CPI_Data.csv')
const outPath = join(root, 'src', 'data', 'series.ts')

const raw = readFileSync(csvPath, 'utf8').replace(/^﻿/, '')
const lines = raw.trim().split(/\r?\n/)
const headers = lines[0].split(',')

const rows = lines.slice(1).map((line) => line.split(','))
const dates = rows.map((r) => r[0].slice(0, 7)) // YYYY-MM

const col = (name) => {
  const i = headers.indexOf(name)
  if (i < 0) throw new Error(`column not found: ${name}`)
  return rows.map((r) => (r[i] === '' || r[i] === undefined ? null : Number(r[i])))
}

const yoy = (values) =>
  values.map((v, i) => {
    if (i < 12) return null
    const prev = values[i - 12]
    if (v == null || prev == null || prev === 0) return null
    return Math.round((v / prev - 1) * 100 * 1e6) / 1e6
  })

const level = (values) => values.map((v) => (v == null ? null : Math.round(v * 1e6) / 1e6))

const series = {
  foodTotalYoY: yoy(col('food_total_cpi')),
  foodHomeYoY: yoy(col('food_at_home_cpi')),
  foodAwayYoY: yoy(col('food_away_cpi')),
  ppiProcessedYoY: yoy(col('ppi_processed_foods')),
  wageAllYoY: yoy(col('wage_leisure_hospitality_all')),
  wageProdYoY: yoy(col('wage_leisure_hospitality_production')),
  phillyFutureLevel: level(col('philly_future_prices_received')),
}

/* ---------- 校验（对照 Notebook 输出） ---------- */
const idx = (m) => dates.indexOf(m)
const approx = (a, b, tol = 5e-5) => a != null && Math.abs(a - b) < tol
const checks = [
  ['foodHomeYoY 2026-06', series.foodHomeYoY[idx('2026-06')], 2.704309],
  ['foodAwayYoY 2026-06', series.foodAwayYoY[idx('2026-06')], 3.365905],
  ['foodTotalYoY 2026-06', series.foodTotalYoY[idx('2026-06')], 2.987321],
  ['ppiProcessedYoY 2026-06', series.ppiProcessedYoY[idx('2026-06')], 1.629435],
  ['wageAllYoY 2026-06', series.wageAllYoY[idx('2026-06')], 3.869833],
  ['wageAllYoY 2025-07', series.wageAllYoY[idx('2025-07')], 3.352968],
  ['wageProdYoY 2026-05', series.wageProdYoY[idx('2026-05')], 4.731076],
  ['phillyFutureLevel 2026-07', series.phillyFutureLevel[idx('2026-07')], 41.4],
]
let failed = false
for (const [name, got, want] of checks) {
  if (!approx(got, want)) {
    console.error(`CHECK FAILED: ${name}: got ${got}, want ${want}`)
    failed = true
  }
}

/* OLS 校验：Home baseline lag-1 训练样本 ≤1999-12 应还原 Notebook 的 R²=0.769, beta=0.690 */
function ols(pairs) {
  const n = pairs.length
  let sx = 0, sy = 0
  for (const [x, y] of pairs) { sx += x; sy += y }
  const mx = sx / n, my = sy / n
  let sxx = 0, sxy = 0, syy = 0
  for (const [x, y] of pairs) {
    sxx += (x - mx) ** 2
    sxy += (x - mx) * (y - my)
    syy += (y - my) ** 2
  }
  const beta = sxy / sxx
  const alpha = my - beta * mx
  let sse = 0
  for (const [x, y] of pairs) sse += (y - alpha - beta * x) ** 2
  return { alpha, beta, r2: 1 - sse / syy, n }
}

const end99 = idx('1999-12')
const trainPairs = []
for (let i = 1; i <= end99; i++) {
  const x = series.ppiProcessedYoY[i - 1] // lag 1
  const y = series.foodHomeYoY[i]
  if (x != null && y != null) trainPairs.push([x, y])
}
const fit99 = ols(trainPairs)
if (!(fit99.n === 564 && approx(fit99.r2, 0.768958, 1e-4) && approx(fit99.beta, 0.690337, 1e-4))) {
  console.error('CHECK FAILED: lag-1 training fit', fit99)
  failed = true
}

/* 全样本 Home baseline 应还原 alpha=1.408146, beta=0.649634 */
const allPairs = []
for (let i = 1; i < dates.length; i++) {
  const x = series.ppiProcessedYoY[i - 1]
  const y = series.foodHomeYoY[i]
  if (x != null && y != null) allPairs.push([x, y])
}
const fitAll = ols(allPairs)
if (!(fitAll.n === 881 && approx(fitAll.alpha, 1.408146, 1e-4) && approx(fitAll.beta, 0.649634, 1e-4))) {
  console.error('CHECK FAILED: full-sample Home baseline fit', fitAll)
  failed = true
}

if (failed) process.exit(1)
console.log('All checks passed.')
console.log(`  lag-1 train fit (<=1999): n=${fit99.n} R2=${fit99.r2.toFixed(6)} beta=${fit99.beta.toFixed(6)}`)
console.log(`  full-sample fit: n=${fitAll.n} alpha=${fitAll.alpha.toFixed(6)} beta=${fitAll.beta.toFixed(6)}`)

/* ---------- 写出 series.ts ---------- */
const banner = `/**
 * 自动生成文件 —— 不要手工编辑。
 * 由 scripts/build-series.mjs 从 data/Food_CPI_Data.csv（Notebook 备份数据）生成。
 * 转换规则与 Notebook Cell 13 一致：yoy_pct = pct_change(12) * 100；调查指数保持 level。
 * 生成时间以外的一切数值不做修改；重新运行 \`npm run data\` 即可从新 CSV 重建。
 */

/** 月份标签，'YYYY-MM'，从 ${dates[0]} 到 ${dates[dates.length - 1]}，与所有序列数组一一对应 */
export const months: string[] = ${JSON.stringify(dates)}

export type SeriesArray = (number | null)[]
`

const body = Object.entries(series)
  .map(([k, v]) => `export const ${k}: SeriesArray = ${JSON.stringify(v)}`)
  .join('\n\n')

const helpers = `

/** 找到某个月份的下标；不存在返回 -1 */
export function monthIndex(m: string): number {
  return months.indexOf(m)
}

export interface Point { m: string; v: number | null }

/** 将某个序列切片为 {m, v} 点数组（含端点），用于图表 */
export function slicePoints(s: SeriesArray, from: string, to: string): Point[] {
  const a = monthIndex(from)
  const b = monthIndex(to)
  if (a < 0 || b < 0) return []
  const out: Point[] = []
  for (let i = a; i <= b; i++) out.push({ m: months[i], v: s[i] })
  return out
}
`

writeFileSync(outPath, banner + '\n' + body + helpers)
console.log(`written ${outPath}`)
