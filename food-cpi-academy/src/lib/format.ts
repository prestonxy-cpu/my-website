/** 数字与月份格式化工具 */

export function fmtPct(v: number | null | undefined, digits = 2): string {
  if (v == null || Number.isNaN(v)) return '—'
  return `${v.toFixed(digits)}%`
}

export function fmtNum(v: number | null | undefined, digits = 3): string {
  if (v == null || Number.isNaN(v)) return '—'
  return v.toFixed(digits)
}

export function fmtPp(v: number | null | undefined, digits = 2): string {
  if (v == null || Number.isNaN(v)) return '—'
  return `${v.toFixed(digits)} pp`
}

/** '2026-07' -> '2026年7月' */
export function fmtMonthZh(m: string): string {
  const [y, mo] = m.split('-')
  return `${y}年${Number(mo)}月`
}

/** '2026-07' -> "2026-07"（图表轴用短格式） */
export function fmtMonthShort(m: string): string {
  return m
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}
