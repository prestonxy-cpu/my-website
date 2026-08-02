/**
 * 浏览器端统计工具 —— 用与 Notebook 相同的数据在前端实时计算，
 * 让 Playground 里的数字与 Notebook 可以互相印证。
 */

export interface OlsFit {
  alpha: number
  beta: number
  r2: number
  n: number
  residuals: number[]
}

/** 一元 OLS：y = alpha + beta * x */
export function ols(x: number[], y: number[]): OlsFit | null {
  const n = Math.min(x.length, y.length)
  if (n < 3) return null
  let sx = 0, sy = 0
  for (let i = 0; i < n; i++) { sx += x[i]; sy += y[i] }
  const mx = sx / n, my = sy / n
  let sxx = 0, sxy = 0, syy = 0
  for (let i = 0; i < n; i++) {
    sxx += (x[i] - mx) ** 2
    sxy += (x[i] - mx) * (y[i] - my)
    syy += (y[i] - my) ** 2
  }
  if (sxx === 0 || syy === 0) return null
  const beta = sxy / sxx
  const alpha = my - beta * mx
  const residuals: number[] = []
  let sse = 0
  for (let i = 0; i < n; i++) {
    const e = y[i] - alpha - beta * x[i]
    residuals.push(e)
    sse += e * e
  }
  return { alpha, beta, r2: 1 - sse / syy, n, residuals }
}

/**
 * 从两个（可能含 null 的）序列按 lag 对齐构造训练对：
 * y[t] 对应 x[t - lag]，仅保留两者都非空的观测。
 * endIndex 含端点（用于“只用某个时间之前的数据”）。
 */
export function alignPairs(
  x: (number | null)[],
  y: (number | null)[],
  lag: number,
  endIndex: number,
): { xs: number[]; ys: number[]; idx: number[] } {
  const xs: number[] = []
  const ys: number[] = []
  const idx: number[] = []
  for (let t = lag; t <= endIndex; t++) {
    const xv = x[t - lag]
    const yv = y[t]
    if (xv != null && yv != null) {
      xs.push(xv)
      ys.push(yv)
      idx.push(t)
    }
  }
  return { xs, ys, idx }
}

/** 给定 alpha/beta 手动算 R²（Regression Playground 的“手动拟合”模式用） */
export function r2For(x: number[], y: number[], alpha: number, beta: number): number {
  const n = Math.min(x.length, y.length)
  if (n === 0) return NaN
  let sy = 0
  for (let i = 0; i < n; i++) sy += y[i]
  const my = sy / n
  let sse = 0, syy = 0
  for (let i = 0; i < n; i++) {
    sse += (y[i] - alpha - beta * x[i]) ** 2
    syy += (y[i] - my) ** 2
  }
  return syy === 0 ? NaN : 1 - sse / syy
}

export function rmse(errors: number[]): number {
  if (errors.length === 0) return NaN
  let s = 0
  for (const e of errors) s += e * e
  return Math.sqrt(s / errors.length)
}

export function mae(errors: number[]): number {
  if (errors.length === 0) return NaN
  let s = 0
  for (const e of errors) s += Math.abs(e)
  return s / errors.length
}

/** OOS R² 相对 no-change benchmark：1 - SSE(model) / SSE(no-change) */
export function oosR2(modelErrors: number[], benchmarkErrors: number[]): number {
  let sseM = 0, sseB = 0
  for (const e of modelErrors) sseM += e * e
  for (const e of benchmarkErrors) sseB += e * e
  return sseB === 0 ? NaN : 1 - sseM / sseB
}

/** 最新 k 个非空值的平均（Notebook 对未观察 predictor 的假设规则，k=3） */
export function latestAverage(series: (number | null)[], endIndex: number, k = 3): number | null {
  const vals: number[] = []
  for (let i = endIndex; i >= 0 && vals.length < k; i--) {
    const v = series[i]
    if (v != null) vals.push(v)
  }
  if (vals.length < k) return null
  return vals.reduce((a, b) => a + b, 0) / k
}
