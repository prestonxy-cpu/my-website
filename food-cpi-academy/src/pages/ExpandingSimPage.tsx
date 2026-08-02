import { useEffect } from 'react'
import { useProgress } from '../store/progress'
import ExpandingSimWidget from '../components/widgets/ExpandingSimWidget'
import WindowCompareWidget from '../components/widgets/WindowCompareWidget'

export default function ExpandingSimPage() {
  const { visitPlayground } = useProgress()
  useEffect(() => visitPlayground('expanding'), [visitPlayground])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">🔁 Expanding-window Simulator</h1>
        <p className="text-sm text-slate-400 mt-1">
          按 Notebook 的流程逐月运行回测：Estimate Model → Forecast → Reveal Actual →
          Add Month → Next Origin。系数在每个 Forecast Origin 用当时可得的数据重新估计。
        </p>
      </header>
      <ExpandingSimWidget />
      <section>
        <h2 className="text-lg font-bold text-slate-100 mb-2">🪟 Fixed vs Rolling vs Expanding</h2>
        <WindowCompareWidget />
      </section>
    </div>
  )
}
