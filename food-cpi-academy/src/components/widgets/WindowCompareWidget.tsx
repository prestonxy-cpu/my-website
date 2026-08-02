import { useState } from 'react'

/**
 * Fixed / Rolling / Expanding Window 对比演示：
 * 步进 origin，观察三种窗口的训练数据覆盖差异。
 */
const TOTAL = 24 // 演示用的月份格子数
const WINDOW_LEN = 8 // rolling 窗口长度（演示值）
const FIRST_ORIGIN = 10

export default function WindowCompareWidget() {
  const [origin, setOrigin] = useState(FIRST_ORIGIN)

  const windows = [
    {
      name: 'Fixed Window',
      zh: '固定窗口',
      desc: '只用一段固定的历史估计一次，之后不再更新。',
      pros: '简单、稳定',
      cons: '完全学不到新数据；结构变化后越来越过时',
      color: '#fb7185',
      range: (o: number): [number, number] => [0, FIRST_ORIGIN],
    },
    {
      name: 'Rolling Window',
      zh: '滚动窗口',
      desc: `始终只用最近 ${WINDOW_LEN} 个月：起点和终点一起往前滑。`,
      pros: '适应结构变化快',
      cons: '丢掉久远样本，估计噪声大（N 恒定且小）',
      color: '#fbbf24',
      range: (o: number): [number, number] => [Math.max(0, o - WINDOW_LEN), o],
    },
    {
      name: 'Expanding Window',
      zh: '扩张窗口（Notebook 采用 ✓）',
      desc: '起点固定，终点随 origin 前移——历史越滚越多。',
      pros: 'N 持续增大、估计更稳；不会用到未来数据',
      cons: '对结构变化的适应比 rolling 慢',
      color: '#34d399',
      range: (o: number): [number, number] => [0, o],
    },
  ]

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-slate-300">
          Forecast Origin：<span className="font-bold text-violet2-300 num">第 {origin + 1} 格</span>
        </p>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setOrigin((o) => Math.max(FIRST_ORIGIN, o - 1))}
            disabled={origin <= FIRST_ORIGIN}
            className="btn-secondary text-xs px-3 py-1.5"
          >← 后退</button>
          <button
            onClick={() => setOrigin((o) => Math.min(TOTAL - 2, o + 1))}
            disabled={origin >= TOTAL - 2}
            className="btn-primary text-xs px-3 py-1.5"
          >前进 origin →</button>
        </div>
      </div>

      <div className="space-y-4">
        {windows.map((w) => {
          const [a, b] = w.range(origin)
          return (
            <div key={w.name}>
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-slate-200">
                  {w.name} <span className="text-xs text-slate-400">{w.zh}</span>
                </p>
                <p className="text-[11px] text-slate-500">{w.desc}</p>
              </div>
              <div className="flex gap-0.5" role="img" aria-label={`${w.name} 训练覆盖示意`}>
                {Array.from({ length: TOTAL }, (_, i) => {
                  const inTrain = i >= a && i <= b
                  const isOrigin = i === origin
                  const isForecast = i === origin + 1
                  return (
                    <span
                      key={i}
                      className="flex-1 h-6 rounded-sm transition-all duration-300 relative"
                      style={{
                        backgroundColor: isForecast
                          ? '#8b5cf6'
                          : inTrain
                            ? w.color + (isOrigin ? 'ff' : '66')
                            : '#242c48',
                        outline: isOrigin ? `2px solid ${w.color}` : undefined,
                      }}
                      title={isForecast ? '要预测的月份' : inTrain ? '训练窗口内' : '未使用'}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>历史 →</span>
                <span>
                  训练格数 N = <strong className="num" style={{ color: w.color }}>{b - a + 1}</strong>
                  {' '}· <span className="text-violet2-300">紫色 = 待预测月</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-ink-700">
              <th className="text-left px-2 py-1.5">窗口</th>
              <th className="text-left px-2 py-1.5">优点</th>
              <th className="text-left px-2 py-1.5">缺点</th>
            </tr>
          </thead>
          <tbody>
            {windows.map((w) => (
              <tr key={w.name} className="border-b border-ink-800 last:border-0">
                <td className="px-2 py-1.5 font-medium" style={{ color: w.color }}>{w.name}</td>
                <td className="px-2 py-1.5 text-slate-300">{w.pros}</td>
                <td className="px-2 py-1.5 text-slate-400">{w.cons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-mint-300 bg-mint-500/10 border border-mint-500/25 rounded-lg px-3 py-2">
        ✅ Notebook 采用 Expanding Window：既保证每个 origin 只用「当时可得」的数据（防 look-ahead），
        又让训练样本随时间越来越充足。
      </p>
    </div>
  )
}
