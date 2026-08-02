import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="card p-10 text-center">
      <p className="text-5xl mb-4 animate-floaty" aria-hidden>🛸</p>
      <h1 className="text-xl font-bold text-slate-100">404 · 页面不存在</h1>
      <p className="text-sm text-slate-400 mt-2">这个页面不在课程地图上。</p>
      <Link to="/dashboard" className="btn-primary mt-5 inline-flex">回到主页</Link>
    </div>
  )
}
