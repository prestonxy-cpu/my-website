import { useState } from 'react'
import { timeline } from '../../data/modelResults'

/** 三阶段可点击时间轴：Lag-training / Pre-2016 Validation / Final Test */
const PHASES = [
  {
    id: 'train',
    name: 'Lag-training Sample',
    zh: '滞后期训练样本',
    period: `数据起点 → ${timeline.lagTrainEnd}`,
    color: '#38bdf8',
    from: 1953,
    to: 2000,
    purpose: '为每个候选 Predictor 在 0–12 个月中选择 Lag。',
    rules: [
      '只允许看 1999 年 12 月及以前的数据',
      '对每个 lag 拟合回归，按 Training-sample R² 选最优',
      '选出的 lag 从此冻结，后面阶段不得再改',
    ],
    notebook: 'Notebook 第 7 章（Cell 16–17）',
    example: 'WPU02 在这里选出 lag = 1（R² = 0.769）。',
  },
  {
    id: 'validation',
    name: 'Pre-2016 Validation',
    zh: '2016 年前验证期',
    period: `Forecast Origins ${timeline.validationFirstOrigin} → ${timeline.validationLastOrigin}`,
    color: '#fbbf24',
    from: 2000,
    to: 2015,
    purpose: '在打开 Final Test 之前，比较 Baseline 与 Expanded Models 的 12 个月预测表现。',
    rules: [
      `最后一个 origin（${timeline.validationLastOrigin}）的 12 个月预测在 ${timeline.validationLastRealized} 实现——整个阶段严格停在 2016 之前`,
      '每个 origin 只用当时可得的数据（expanding window）',
      '模型对比在这里完成：谁进入最终报告，在这里定',
    ],
    notebook: 'Notebook 第 10 章（Cell 22–25）',
    example: 'Away survey expanded 在这里 RMSE 0.566 pp 表现最好。',
  },
  {
    id: 'test',
    name: 'Final Out-of-Sample Test',
    zh: '最终样本外测试',
    period: `Forecast Origins ${timeline.finalTestFirstOrigin} → 最新可评估月`,
    color: '#34d399',
    from: 2016,
    to: 2026.5,
    purpose: '在完全没参与 lag 选择和模型比较的数据上，评估固定模型设定的真实表现。',
    rules: [
      '模型规范（变量 + lag）已冻结，只允许重新估计系数',
      '2016+ 的数据从未被用来做任何选择',
      '这里得到的 RMSE / OOS R² 才是给 Pacific Life 看的成绩单',
    ],
    notebook: 'Notebook 第 11 章（Cell 26–27）',
    example: 'Primary Total Food：12M RMSE 2.035 pp，OOS R² 0.598。',
  },
] as const

const MIN_YEAR = 1953
const MAX_YEAR = 2027

export default function TimelineExplorerWidget() {
  const [active, setActive] = useState<string>('train')
  const phase = PHASES.find((p) => p.id === active)!

  return (
    <div className="card p-5 space-y-4">
      {/* 时间轴 */}
      <div className="relative h-14">
        {PHASES.map((p) => {
          const left = ((p.from - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
          const width = ((p.to - p.from) / (MAX_YEAR - MIN_YEAR)) * 100
          const isActive = active === p.id
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className="absolute inset-y-1 rounded-lg border transition-all text-[10px] sm:text-xs font-medium overflow-hidden"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: p.color + (isActive ? '44' : '1a'),
                borderColor: p.color + (isActive ? 'ff' : '55'),
                color: p.color,
              }}
              aria-pressed={isActive}
              aria-label={`${p.name}，${p.period}`}
            >
              <span className="px-1">{p.zh}</span>
            </button>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 num -mt-2">
        <span>1953</span><span>1980</span><span>2000</span><span>2016</span><span>2027</span>
      </div>

      {/* 选中阶段详情 */}
      <div
        className="rounded-xl border p-4 animate-slideUp"
        style={{ borderColor: phase.color + '66', backgroundColor: phase.color + '0d' }}
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-bold text-slate-100">
            {phase.zh} <span className="term-en text-sm">({phase.name})</span>
          </h3>
          <span className="text-xs num" style={{ color: phase.color }}>{phase.period}</span>
        </div>
        <p className="text-sm text-slate-300 mt-2">🎯 用途：{phase.purpose}</p>
        <ul className="mt-2 space-y-1">
          {phase.rules.map((r, i) => (
            <li key={i} className="text-xs text-slate-400 flex gap-1.5">
              <span style={{ color: phase.color }} aria-hidden>▸</span>{r}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs">
          <span className="chip bg-ink-850 border border-ink-600 text-slate-400">📓 {phase.notebook}</span>
          <span className="chip bg-ink-850 border border-ink-600 text-slate-300">例：{phase.example}</span>
        </div>
      </div>

      <p className="text-xs text-rose2-400 bg-rose2-500/10 border border-rose2-500/25 rounded-lg px-3 py-2">
        🚨 三个阶段的分离是防止 Look-ahead Bias 的核心防线：如果用 2016+ 的表现来「回头」挑 lag 或挑模型，
        就等于考试前偷看了答案——成绩再好也不可信。
      </p>
    </div>
  )
}
