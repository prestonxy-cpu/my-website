import { useEffect } from 'react'
import { useProgress } from '../store/progress'
import ForecastAuditWidget from '../components/widgets/ForecastAuditWidget'
import CombineCalculatorWidget from '../components/widgets/CombineCalculatorWidget'
import ChartBlock from '../components/charts/ChartRegistry'

export default function ForecastExplorerPage() {
  const { visitPlayground } = useProgress()
  useEffect(() => visitPlayground('forecast'), [visitPlayground])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">🔮 12-Month Forecast Explorer</h1>
        <p className="text-sm text-slate-400 mt-1">
          当前 Forecast Origin 为 2026 年 6 月，预测 2026 年 7 月至 2027 年 6 月。
          每个月都有自己的 Forecast Month、Required Predictor Month 和 Forecast Calculation——
          不是把同一个数字复制 12 次。
        </p>
      </header>
      <ChartBlock
        id="forecastFan"
        caption="Primary Baseline（主预测）+ 经验 95% 区间；Survey Sensitivity 是更高通胀情景，不是主预测"
      />
      <ForecastAuditWidget />
      <section>
        <h2 className="text-lg font-bold text-slate-100 mb-2">🧮 Total Food 组合计算器</h2>
        <CombineCalculatorWidget />
      </section>
    </div>
  )
}
