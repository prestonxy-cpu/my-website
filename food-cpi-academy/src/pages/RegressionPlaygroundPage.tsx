import { useEffect } from 'react'
import { useProgress } from '../store/progress'
import RegressionPlaygroundWidget from '../components/widgets/RegressionPlaygroundWidget'

export default function RegressionPlaygroundPage() {
  const { visitPlayground } = useProgress()
  useEffect(() => visitPlayground('regression'), [visitPlayground])

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">📐 Regression Playground</h1>
        <p className="text-sm text-slate-400 mt-1">
          先手动调 Alpha（截距）和 Beta（斜率）去拟合散点，再让 OLS 一键给出最优解，
          直观理解回归“找最小误差直线”的本质。散点是 Notebook 的真实训练数据。
        </p>
      </header>
      <RegressionPlaygroundWidget />
    </div>
  )
}
