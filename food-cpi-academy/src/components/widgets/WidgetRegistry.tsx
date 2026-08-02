import type { WidgetId } from '../../types'
import LagPlaygroundWidget from './LagPlaygroundWidget'
import RegressionPlaygroundWidget from './RegressionPlaygroundWidget'
import ExpandingSimWidget from './ExpandingSimWidget'
import ForecastAuditWidget from './ForecastAuditWidget'
import CombineCalculatorWidget from './CombineCalculatorWidget'
import TimelineExplorerWidget from './TimelineExplorerWidget'
import WindowCompareWidget from './WindowCompareWidget'

const registry: Record<WidgetId, () => JSX.Element> = {
  lagPlayground: LagPlaygroundWidget,
  regressionPlayground: RegressionPlaygroundWidget,
  expandingSim: ExpandingSimWidget,
  forecastAudit: ForecastAuditWidget,
  combineCalculator: CombineCalculatorWidget,
  timelineExplorer: TimelineExplorerWidget,
  windowCompare: WindowCompareWidget,
}

export default function WidgetBlock({ id, caption }: { id: WidgetId; caption?: string }) {
  const Widget = registry[id]
  if (!Widget) {
    return <div className="card p-4 text-sm text-slate-500">互动组件暂不可用：{id}</div>
  }
  return (
    <div>
      <Widget />
      {caption && <p className="mt-2 text-xs text-slate-500 text-center">{caption}</p>}
    </div>
  )
}
