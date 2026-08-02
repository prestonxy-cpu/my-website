import { Link } from 'react-router-dom'
import { headlineNumbers, notebookMeta } from '../data/modelResults'

/** 像素风小方块装饰 */
function PixelDeco({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-1 ${className ?? ''}`} aria-hidden>
      {['#8b5cf6', '#38bdf8', '#34d399', '#fbbf24', '#38bdf8', '#8b5cf6', '#fbbf24', '#34d399'].map((c, i) => (
        <span key={i} className="w-2.5 h-2.5 sprite" style={{ backgroundColor: c, opacity: 0.85 }} />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-4 py-14 sm:py-20 w-full">
        <PixelDeco className="mb-8 animate-floaty" />
        <p className="text-sm text-violet2-300 font-semibold mb-3">UCI × Pacific Life Capstone Project</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 pixel-title leading-tight">
          Food CPI<br />Forecast Academy
        </h1>
        <p className="mt-5 max-w-2xl text-slate-300 leading-relaxed">
          一门为你量身定制的游戏化课程：不需要统计学、计量经济学或 Python 基础，
          从零开始真正理解你自己的 <span className="term-en">Food CPI</span> 预测模型——
          数据从哪来、<span className="term-en">Lag</span> 怎么选、
          <span className="term-en">Expanding-window Backtest</span> 如何运行、
          12 个预测值分别由什么数据产生，以及如何在 Pacific Life 会议上自信地回答每一个追问。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn-primary text-base px-6 py-3">🚀 开始学习</Link>
          <Link to="/map" className="btn-secondary text-base px-6 py-3">🗺️ 查看课程地图</Link>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-2xl mb-2" aria-hidden>🎮</p>
            <h2 className="font-semibold text-slate-100">游戏化学习</h2>
            <p className="text-sm text-slate-400 mt-1">
              课程地图、逐节解锁、XP 等级、成就徽章、Checkpoint——像玩游戏一样学会你的模型。
            </p>
          </div>
          <div className="card p-5">
            <p className="text-2xl mb-2" aria-hidden>🧪</p>
            <h2 className="font-semibold text-slate-100">真实数据互动</h2>
            <p className="text-sm text-slate-400 mt-1">
              Lag 对齐、回归拟合、Expanding-window 模拟器全部用 Notebook 的真实数据实时计算，数字与 Notebook 一致。
            </p>
          </div>
          <div className="card p-5">
            <p className="text-2xl mb-2" aria-hidden>🎤</p>
            <h2 className="font-semibold text-slate-100">Mock Meeting</h2>
            <p className="text-sm text-slate-400 mt-1">
              13 个 Pacific Life 风格的英文追问，即时反馈遗漏要点，练到能独立答辩为止。
            </p>
          </div>
        </div>

        <div className="mt-10 card p-5 flex flex-col sm:flex-row items-center gap-4 border-violet2-500/40">
          <div className="flex-1 text-sm text-slate-400">
            <p className="text-slate-200 font-semibold mb-1">📓 课程唯一依据</p>
            <p>
              {notebookMeta.title}（{notebookMeta.cellCount} cells · {notebookMeta.sectionCount} 章节 · {notebookMeta.seriesCount} 个 FRED 序列）
            </p>
          </div>
          <div className="flex gap-6 text-center shrink-0">
            <div>
              <p className="text-2xl font-bold text-violet2-300 num">{headlineNumbers.primary12m}%</p>
              <p className="text-[11px] text-slate-500">Primary 12M 预测</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber2-300 num">{headlineNumbers.survey12m}%</p>
              <p className="text-[11px] text-slate-500">Survey 情景</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-slate-600">
        学习进度保存在本地浏览器（Local Storage），无需登录。
      </footer>
    </div>
  )
}
