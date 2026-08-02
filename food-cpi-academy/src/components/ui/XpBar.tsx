import { useProgress, levelFor } from '../../store/progress'

export default function XpBar() {
  const { state } = useProgress()
  const lvl = levelFor(state.xp)
  const pct = Math.round(lvl.progress * 100)
  return (
    <div>
      <div
        className="h-2.5 rounded-full bg-ink-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="当前等级经验进度"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet2-500 via-sky2-400 to-mint-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500 num">
        <span>{lvl.currentFloor} XP</span>
        <span>{lvl.nextAt != null ? `下一级 ${lvl.nextAt} XP` : '已满级'}</span>
      </div>
    </div>
  )
}
