import { useEffect } from 'react'
import { useProgress } from '../store/progress'
import LagPlaygroundWidget from '../components/widgets/LagPlaygroundWidget'

export default function LagPlaygroundPage() {
  const { visitPlayground } = useProgress()
  useEffect(() => visitPlayground('lag'), [visitPlayground])

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">🎯 Lag Alignment Playground</h1>
        <p className="text-sm text-slate-400 mt-1">
          亲手滑动 Lag（0–12 个月），看 Predictor 与 Target 的对齐方式和 Training R² 如何变化。
          数据与 Notebook 完全相同：训练样本只用 1999 年 12 月之前的数据（Lag-training Sample）。
        </p>
      </header>
      <LagPlaygroundWidget />
    </div>
  )
}
