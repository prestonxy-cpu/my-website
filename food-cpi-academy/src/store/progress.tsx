/**
 * 学习进度 store —— React Context + localStorage 持久化。
 * 负责：XP、课程解锁、成就判定、Mock Meeting 记录、薄弱知识点、笔记。
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ProgressState, LessonProgress, MeetingRecord } from '../types'
import { modules, allLessons } from '../content'
import { achievements } from '../data/achievements'

const STORAGE_KEY = 'food-cpi-academy-progress-v2'
/** 备份键：只在进度「不减少」时写入，作为高水位存档，可救回被覆盖的进度 */
const BACKUP_KEY = 'food-cpi-academy-progress-v2-backup'

export const LEVELS = [
  { xp: 0, title: '数据学徒' },
  { xp: 300, title: 'CPI 见习生' },
  { xp: 700, title: 'Lag 侦察兵' },
  { xp: 1200, title: '回归分析师' },
  { xp: 1800, title: '回测工程师' },
  { xp: 2500, title: '预测研究员' },
  { xp: 3300, title: 'Food CPI 专家' },
  { xp: 4200, title: '首席预测官' },
] as const

export function levelFor(xp: number) {
  let level = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) level = i
  }
  const current = LEVELS[level]
  const next = LEVELS[level + 1] ?? null
  return {
    index: level + 1,
    title: current.title,
    currentFloor: current.xp,
    nextAt: next ? next.xp : null,
    progress: next ? (xp - current.xp) / (next.xp - current.xp) : 1,
  }
}

function freshState(): ProgressState {
  return {
    version: 2,
    xp: 0,
    lessons: {},
    meeting: {},
    achievements: {},
    playgrounds: [],
    glossaryViewed: [],
    quizStreak: 0,
    bestQuizStreak: 0,
    notes: '',
    weakAreas: [],
    finalBestScore: 0,
    finalPassed: false,
    startedAt: new Date().toISOString(),
  }
}

type StoredState = ProgressState & { savedAt?: string }

function readKey(key: string): StoredState | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredState
    if (parsed.version !== 2) return null
    return parsed
  } catch {
    return null
  }
}

/** 进度分数：完成课程数优先，其次 XP。用于判断哪份存档「更靠前」 */
export function progressScore(s: Partial<ProgressState>): number {
  const done = Object.values(s.lessons ?? {}).filter((l) => l?.completed).length
  const meeting = Object.values(s.meeting ?? {}).filter((m) => m?.passed).length
  return done * 100000 + meeting * 1000 + (s.xp ?? 0)
}

/**
 * 读取存档：主键与备份键取「进度更靠前」的一份。
 * 这样即使主键被旧标签页覆盖或被误重置，备份仍能救回进度。
 */
function loadState(): ProgressState {
  const primary = readKey(STORAGE_KEY)
  const backup = readKey(BACKUP_KEY)
  const best = !primary
    ? backup
    : !backup
      ? primary
      : progressScore(backup) > progressScore(primary)
        ? backup
        : primary
  if (!best) return freshState()
  return { ...freshState(), ...best }
}

function saveState(s: ProgressState): void {
  const payload = JSON.stringify({ ...s, savedAt: new Date().toISOString() })
  try {
    localStorage.setItem(STORAGE_KEY, payload)
  } catch {
    /* 存储不可用（隐身模式、配额已满等）时静默失败 */
  }
  try {
    const backup = readKey(BACKUP_KEY)
    if (!backup || progressScore(s) >= progressScore(backup)) {
      localStorage.setItem(BACKUP_KEY, payload)
    }
  } catch {
    /* 备份失败不影响主存档 */
  }
}

interface ProgressApi {
  state: ProgressState
  /** 最近解锁、尚未展示的成就（toast 队列） */
  pendingToasts: { id: string; title: string; icon: string; description: string }[]
  dismissToast: (id: string) => void

  addXp: (amount: number) => void
  recordQuiz: (lessonId: string, correctFirstTry: boolean) => void
  recordExercise: (lessonId: string) => void
  recordSelfExplain: (lessonId: string, missingKeywords: string[]) => void
  completeLesson: (lessonId: string) => void
  recordMeeting: (questionId: string, passed: boolean, weakPoints: string[], answer: string) => void
  visitPlayground: (id: string) => void
  viewGlossary: (id: string) => void
  setNotes: (text: string) => void
  addWeakArea: (text: string) => void
  removeWeakArea: (text: string) => void
  recordFinal: (score: number) => void
  resetAll: () => void

  /** 导出进度为 JSON 字符串（用于备份到文件或换设备） */
  exportProgress: () => string
  /** 从 JSON 字符串恢复进度；返回是否成功 */
  importProgress: (json: string) => boolean
  /** 把某个模块的全部课程标记为已完成（用于进度丢失后免于重学） */
  markModuleComplete: (moduleId: string) => void

  isModuleUnlocked: (moduleId: string) => boolean
  isLessonUnlocked: (lessonId: string) => boolean
  isLessonCompleted: (lessonId: string) => boolean
  moduleCompletion: (moduleId: string) => { done: number; total: number }
  overallCompletion: () => { done: number; total: number }
}

const Ctx = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)
  const [pendingToasts, setPendingToasts] = useState<ProgressApi['pendingToasts']>([])
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    saveState(state)
  }, [state])

  /**
   * 跨标签页同步：另一个标签页保存了「更靠前」的进度时立即采纳。
   * 没有这一步，停留在旧状态的标签页会把新进度覆盖掉。
   */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        const incoming = JSON.parse(e.newValue) as StoredState
        if (incoming.version !== 2) return
        setState((cur) =>
          progressScore(incoming) > progressScore(cur)
            ? { ...freshState(), ...incoming }
            : cur,
        )
      } catch {
        /* 忽略无法解析的写入 */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /** 判定并解锁新成就 */
  const evaluateAchievements = useCallback((s: ProgressState): ProgressState => {
    const completedLessonIds = Object.keys(s.lessons).filter((id) => s.lessons[id].completed)
    const moduleDone = (moduleId: string) => {
      const mod = modules.find((m) => m.id === moduleId)
      if (!mod) return false
      return mod.lessons.every((l) => s.lessons[l.id]?.completed)
    }
    const passedMeeting = Object.values(s.meeting).filter((m) => m.passed).length
    const meetingTotal = 13
    const playgroundIds = ['lag', 'regression', 'expanding', 'forecast']

    const unlocked: Record<string, string> = { ...s.achievements }
    const newToasts: ProgressApi['pendingToasts'] = []
    for (const a of achievements) {
      if (unlocked[a.id]) continue
      const c = a.check
      let ok = false
      switch (c.kind) {
        case 'lessonsCompleted': ok = completedLessonIds.length >= c.count; break
        case 'moduleCompleted': ok = moduleDone(c.moduleId); break
        case 'allModules': ok = modules.every((m) => moduleDone(m.id)); break
        case 'quizStreak': ok = s.bestQuizStreak >= c.count; break
        case 'playgroundVisited': ok = s.playgrounds.includes(c.id); break
        case 'allPlaygrounds': ok = playgroundIds.every((p) => s.playgrounds.includes(p)); break
        case 'meetingAnswered': ok = passedMeeting >= c.count; break
        case 'meetingAllPassed': ok = passedMeeting >= meetingTotal; break
        case 'finalPassed': ok = s.finalPassed; break
        case 'glossaryViewed': ok = s.glossaryViewed.length >= c.count; break
        case 'xp': ok = s.xp >= c.amount; break
      }
      if (ok) {
        unlocked[a.id] = new Date().toISOString()
        newToasts.push({ id: a.id, title: a.title, icon: a.icon, description: a.description })
      }
    }
    if (newToasts.length > 0) {
      setPendingToasts((t) => [...t, ...newToasts])
    }
    return { ...s, achievements: unlocked }
  }, [])

  const update = useCallback(
    (fn: (s: ProgressState) => ProgressState) => {
      setState((s) => evaluateAchievements(fn(s)))
    },
    [evaluateAchievements],
  )

  const lessonPatch = (
    s: ProgressState, lessonId: string, patch: Partial<LessonProgress>,
  ): ProgressState => {
    const base: LessonProgress = s.lessons[lessonId] ?? { completed: false }
    return {
      ...s,
      lessons: { ...s.lessons, [lessonId]: { ...base, ...patch } },
    }
  }

  const api = useMemo<ProgressApi>(() => {
    const isModuleUnlocked = (moduleId: string) => {
      const i = modules.findIndex((m) => m.id === moduleId)
      if (i <= 0) return true
      const prev = modules[i - 1]
      return prev.lessons.every((l) => stateRef.current.lessons[l.id]?.completed)
    }
    const isLessonCompleted = (lessonId: string) =>
      !!stateRef.current.lessons[lessonId]?.completed
    const isLessonUnlocked = (lessonId: string) => {
      const lesson = allLessons.find((l) => l.id === lessonId)
      if (!lesson) return false
      if (!isModuleUnlocked(lesson.moduleId)) return false
      const mod = modules.find((m) => m.id === lesson.moduleId)!
      const li = mod.lessons.findIndex((l) => l.id === lessonId)
      if (li <= 0) return true
      return !!stateRef.current.lessons[mod.lessons[li - 1].id]?.completed
    }
    const moduleCompletion = (moduleId: string) => {
      const mod = modules.find((m) => m.id === moduleId)
      if (!mod) return { done: 0, total: 0 }
      const done = mod.lessons.filter((l) => stateRef.current.lessons[l.id]?.completed).length
      return { done, total: mod.lessons.length }
    }
    const overallCompletion = () => {
      const done = allLessons.filter((l) => stateRef.current.lessons[l.id]?.completed).length
      return { done, total: allLessons.length }
    }

    return {
      state,
      pendingToasts,
      dismissToast: (id) => setPendingToasts((t) => t.filter((x) => x.id !== id)),

      addXp: (amount) => update((s) => ({ ...s, xp: s.xp + amount })),

      recordQuiz: (lessonId, correctFirstTry) =>
        update((s) => {
          const already = s.lessons[lessonId]?.quizCorrectFirstTry !== undefined
          let next = lessonPatch(s, lessonId, {
            quizCorrectFirstTry: s.lessons[lessonId]?.quizCorrectFirstTry || correctFirstTry,
          })
          if (!already) {
            const streak = correctFirstTry ? s.quizStreak + 1 : 0
            next = {
              ...next,
              xp: next.xp + (correctFirstTry ? 10 : 0),
              quizStreak: streak,
              bestQuizStreak: Math.max(s.bestQuizStreak, streak),
            }
          }
          return next
        }),

      recordExercise: (lessonId) =>
        update((s) => {
          if (s.lessons[lessonId]?.exerciseDone) return s
          return { ...lessonPatch(s, lessonId, { exerciseDone: true }), xp: s.xp + 10 }
        }),

      recordSelfExplain: (lessonId, missingKeywords) =>
        update((s) => {
          const weak = missingKeywords.length > 0
            ? Array.from(new Set([...s.weakAreas, ...missingKeywords]))
            : s.weakAreas
          if (s.lessons[lessonId]?.selfExplainDone) return { ...s, weakAreas: weak }
          return {
            ...lessonPatch({ ...s, weakAreas: weak }, lessonId, { selfExplainDone: true }),
            xp: s.xp + 5,
          }
        }),

      completeLesson: (lessonId) =>
        update((s) => {
          if (s.lessons[lessonId]?.completed) return s
          const lesson = allLessons.find((l) => l.id === lessonId)
          return {
            ...lessonPatch(s, lessonId, {
              completed: true,
              completedAt: new Date().toISOString(),
            }),
            xp: s.xp + (lesson?.xp ?? 50),
          }
        }),

      markModuleComplete: (moduleId) =>
        update((s) => {
          const mod = modules.find((m) => m.id === moduleId)
          if (!mod) return s
          const now = new Date().toISOString()
          let next = s
          for (const lesson of mod.lessons) {
            if (next.lessons[lesson.id]?.completed) continue
            next = {
              ...lessonPatch(next, lesson.id, { completed: true, completedAt: now }),
              xp: next.xp + lesson.xp,
            }
          }
          return next
        }),

      recordMeeting: (questionId, passed, weakPoints, answer) =>
        update((s) => {
          const prev: MeetingRecord = s.meeting[questionId] ?? {
            attempts: 0, passed: false, weakPoints: [],
          }
          const firstPass = passed && !prev.passed
          return {
            ...s,
            xp: s.xp + (firstPass ? 40 : 0),
            weakAreas: weakPoints.length > 0
              ? Array.from(new Set([...s.weakAreas, ...weakPoints]))
              : s.weakAreas,
            meeting: {
              ...s.meeting,
              [questionId]: {
                attempts: prev.attempts + 1,
                passed: prev.passed || passed,
                weakPoints,
                lastAnswer: answer,
              },
            },
          }
        }),

      visitPlayground: (id) =>
        update((s) => {
          if (s.playgrounds.includes(id)) return s
          return { ...s, playgrounds: [...s.playgrounds, id], xp: s.xp + 30 }
        }),

      viewGlossary: (id) =>
        update((s) =>
          s.glossaryViewed.includes(id)
            ? s
            : { ...s, glossaryViewed: [...s.glossaryViewed, id] },
        ),

      setNotes: (text) => update((s) => ({ ...s, notes: text })),
      addWeakArea: (text) =>
        update((s) => ({ ...s, weakAreas: Array.from(new Set([...s.weakAreas, text])) })),
      removeWeakArea: (text) =>
        update((s) => ({ ...s, weakAreas: s.weakAreas.filter((w) => w !== text) })),

      recordFinal: (score) =>
        update((s) => {
          const passed = score >= 80
          const firstPass = passed && !s.finalPassed
          return {
            ...s,
            finalBestScore: Math.max(s.finalBestScore, score),
            finalPassed: s.finalPassed || passed,
            xp: s.xp + (firstPass ? 200 : 0),
          }
        }),

      resetAll: () => {
        setPendingToasts([])
        // 备份键也要清掉，否则下次加载会把「高水位」存档又恢复回来
        try {
          localStorage.removeItem(BACKUP_KEY)
        } catch {
          /* 忽略 */
        }
        setState(freshState())
      },

      exportProgress: () =>
        JSON.stringify({ ...stateRef.current, savedAt: new Date().toISOString() }, null, 2),

      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json) as StoredState
          if (parsed.version !== 2 || typeof parsed.lessons !== 'object') return false
          setPendingToasts([])
          setState({ ...freshState(), ...parsed })
          return true
        } catch {
          return false
        }
      },

      isModuleUnlocked,
      isLessonUnlocked,
      isLessonCompleted,
      moduleCompletion,
      overallCompletion,
    }
  }, [state, pendingToasts, update])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
