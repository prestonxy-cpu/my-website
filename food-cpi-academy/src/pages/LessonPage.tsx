import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { findLesson, findModule, adjacentLessons } from '../content'
import { useProgress } from '../store/progress'
import LessonBlockView from '../components/blocks/LessonBlocks'

export default function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const {
    isLessonUnlocked, isLessonCompleted, recordQuiz, recordExercise,
    recordSelfExplain, completeLesson,
  } = useProgress()

  const lesson = findLesson(lessonId)
  const mod = lesson ? findModule(lesson.moduleId) : undefined
  const { prev, next } = adjacentLessons(lessonId)

  // 本课需要完成的互动块（按块下标追踪）
  const required = useMemo(() => {
    if (!lesson) return { quiz: [] as number[], exercise: [] as number[], selfExplain: [] as number[] }
    const quiz: number[] = [], exercise: number[] = [], selfExplain: number[] = []
    lesson.blocks.forEach((b, i) => {
      if (b.type === 'quiz') quiz.push(i)
      else if (b.type === 'exercise') exercise.push(i)
      else if (b.type === 'selfExplain') selfExplain.push(i)
    })
    return { quiz, exercise, selfExplain }
  }, [lesson])

  const [doneBlocks, setDoneBlocks] = useState<Set<number>>(new Set())
  useEffect(() => setDoneBlocks(new Set()), [lessonId])

  if (!lesson || !mod) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3" aria-hidden>🧭</p>
        <p className="text-slate-300 font-medium">找不到这节课</p>
        <Link to="/map" className="btn-primary mt-4 inline-flex">回到课程地图</Link>
      </div>
    )
  }

  const completed = isLessonCompleted(lessonId)
  const unlocked = isLessonUnlocked(lessonId)

  if (!unlocked && !completed) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3 animate-floaty" aria-hidden>🔒</p>
        <p className="text-slate-200 font-semibold text-lg">本课尚未解锁</p>
        <p className="text-sm text-slate-400 mt-2">先完成前面的课程，逐节解锁是为了保证概念按正确顺序建立。</p>
        <Link to="/map" className="btn-primary mt-5 inline-flex">查看课程地图</Link>
      </div>
    )
  }

  const markDone = (i: number) => setDoneBlocks((s) => new Set(s).add(i))
  const allRequired = [...required.quiz, ...required.exercise, ...required.selfExplain]
  const canComplete = completed || allRequired.every((i) => doneBlocks.has(i))
  const remaining = allRequired.filter((i) => !doneBlocks.has(i)).length

  const handleComplete = () => {
    completeLesson(lessonId)
    if (next) navigate(`/lesson/${next.id}`)
    else navigate('/map')
  }

  const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId)

  return (
    <article className="space-y-5 animate-slideUp">
      <header>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <Link to="/map" className="hover:text-slate-300">{mod.title}</Link>
          <span aria-hidden>·</span>
          <span>第 {lessonIndex + 1} / {mod.lessons.length} 课</span>
          <span aria-hidden>·</span>
          <span>约 {lesson.minutes} 分钟</span>
          <span className="chip bg-violet2-600/20 text-violet2-300 ml-auto num">+{lesson.xp} XP</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          {lesson.isCheckpoint && <span aria-hidden>🚩</span>}
          {lesson.title}
          {completed && <span className="chip bg-mint-500/20 text-mint-300 text-xs">已完成 ✓</span>}
        </h1>
      </header>

      {lesson.blocks.map((block, i) => (
        <LessonBlockView
          key={i}
          block={block}
          lessonId={lessonId}
          onQuizResult={(firstTry) => { recordQuiz(lessonId, firstTry); markDone(i) }}
          onExerciseDone={() => { recordExercise(lessonId); markDone(i) }}
          onSelfExplainDone={(missing) => { recordSelfExplain(lessonId, missing); markDone(i) }}
        />
      ))}

      <footer className="card p-5 flex flex-col sm:flex-row items-center gap-3">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="btn-secondary text-sm w-full sm:w-auto">
            ← 上一课
          </Link>
        ) : <span />}
        <div className="flex-1 text-center">
          {!completed && !canComplete && (
            <p className="text-xs text-amber2-300">
              还有 {remaining} 个互动任务未完成（选择题 / 互动任务 / 自我解释）
            </p>
          )}
        </div>
        {completed ? (
          next ? (
            <Link to={`/lesson/${next.id}`} className="btn-primary text-sm w-full sm:w-auto">
              下一课 →
            </Link>
          ) : (
            <Link to="/final" className="btn-success text-sm w-full sm:w-auto">
              🏆 前往 Final Challenge
            </Link>
          )
        ) : (
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="btn-success text-sm w-full sm:w-auto"
          >
            {lesson.isCheckpoint ? '🚩 通过 Checkpoint' : '完成本课'} +{lesson.xp} XP
          </button>
        )}
      </footer>
    </article>
  )
}
