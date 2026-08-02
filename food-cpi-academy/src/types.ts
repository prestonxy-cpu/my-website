/**
 * 共享类型定义 — 课程内容、互动练习、进度系统的统一契约。
 * 内容文件（src/content/）与数值文件（src/data/）都必须遵守这里的类型。
 */

/* ---------------- 术语卡片 ---------------- */

export interface TermCard {
  /** 中文名称 */
  zh: string
  /** English term（保留英文原文） */
  en: string
  /** 零基础可读的中文定义 */
  definition: string
  /** 可选：一个来自本项目的具体例子 */
  example?: string
}

/* ---------------- 选择题 ---------------- */

export interface QuizOption {
  id: string
  text: string
  correct: boolean
  /**
   * 针对该选项的具体反馈：
   * 选错时必须说明 错在哪里 / 为什么错 / 正确思路；选对时说明为什么对。
   */
  explanation: string
}

export interface Quiz {
  question: string
  options: QuizOption[]
  /** 答错时提示应复习的概念（中文 + English term） */
  conceptReview?: string
}

/* ---------------- 互动练习 ---------------- */

/** 排序题：把步骤按正确顺序排好 */
export interface SortOrderExercise {
  kind: 'sortOrder'
  title: string
  instructions: string
  /** 按正确顺序给出；组件会打乱后让用户排序 */
  correctOrder: string[]
  feedbackCorrect: string
  feedbackWrong: string
}

/** 配对题：左右两栏一一配对 */
export interface MatchPairsExercise {
  kind: 'matchPairs'
  title: string
  instructions: string
  pairs: { left: string; right: string }[]
  feedbackCorrect: string
  feedbackWrong: string
}

/** 数值题：输入一个数字，允许误差范围 */
export interface FillNumberExercise {
  kind: 'fillNumber'
  title: string
  instructions: string
  /** 显示在输入框前的算式或提示 */
  prompt: string
  answer: number
  tolerance: number
  unit?: string
  /** 答案是怎么算出来的（答错和答对都会展示） */
  solution: string
}

/** 分类题：把每一项放进正确的桶里 */
export interface CategorizeExercise {
  kind: 'categorize'
  title: string
  instructions: string
  categories: string[]
  items: { text: string; category: string; note?: string }[]
  feedbackCorrect: string
  feedbackWrong: string
}

export type Exercise =
  | SortOrderExercise
  | MatchPairsExercise
  | FillNumberExercise
  | CategorizeExercise

/* ---------------- “用自己的话解释” ---------------- */

export interface SelfExplain {
  prompt: string
  /** 关键概念词（中文或英文都可以）；缺少时会提示用户补充 */
  keywords: string[]
  /** 参考答案（简单中文，可含英文术语） */
  modelAnswer: string
}

/* ---------------- 图表与互动组件的引用 ---------------- */

/** 预注册图表 id —— 由 src/components/charts/ChartRegistry.tsx 渲染 */
export type ChartId =
  | 'foodHistory'          // Food at Home / Away YoY 长历史
  | 'foodHistoryRecent'    // 2015 年至今的三条 Food CPI YoY
  | 'ppiVsHomeCpi'         // WPU02 YoY (lag 1) 与 Food at Home YoY 对比
  | 'wageVsAwayCpi'        // 工资 YoY (lag 12) 与 Food Away YoY 对比
  | 'lagScanHome'          // Home 各候选指标最优 lag 的 R² 柱状图
  | 'lagScanAway'          // Away 各候选指标最优 lag 的 R² 柱状图
  | 'timelineSamples'      // 三个样本阶段时间轴（可点击）
  | 'validationRmse'       // Pre-2016 validation RMSE 对比
  | 'finalTestRmse'        // 2016+ final test RMSE 对比
  | 'finalTestR2'          // 2016+ final test OOS R² 对比
  | 'horizonRmse'          // 12 个 horizon 的 OOS RMSE 曲线
  | 'forecastFan'          // 当前 12 个月预测 + 经验区间 + Survey 场景
  | 'weightsBar'           // Relative importance 权重展示
  | 'surveyLevelChart'     // Philly Fed survey level 序列

/** 大型互动组件 id —— 由 src/components/widgets/WidgetRegistry.tsx 渲染 */
export type WidgetId =
  | 'lagPlayground'        // Lag Alignment Playground（内嵌简化版）
  | 'regressionPlayground' // Regression Playground（内嵌简化版）
  | 'expandingSim'         // Expanding-window Simulator
  | 'forecastAudit'        // Forecast Input Audit 互动表
  | 'combineCalculator'    // Total Food 组合计算器
  | 'timelineExplorer'     // 三阶段时间轴互动
  | 'windowCompare'        // Fixed / Rolling / Expanding window 对比动画

/* ---------------- 课程内容块 ---------------- */

export type LessonBlock =
  | { type: 'goal'; items: string[] }
  | { type: 'text'; md: string }
  | { type: 'terms'; cards: TermCard[] }
  | {
      type: 'notebook'
      title: string
      /** 与 Food_CPI.ipynb 一致的代码片段（可截取核心行） */
      code?: string
      /** 运行输出摘要（文字） */
      output?: string
      note?: string
    }
  | { type: 'formula'; lhs: string; rhs: string; note?: string }
  | {
      type: 'callout'
      variant: 'info' | 'warn' | 'success' | 'danger'
      title?: string
      md: string
    }
  | { type: 'table'; headers: string[]; rows: string[][]; note?: string }
  | { type: 'chart'; id: ChartId; caption?: string }
  | { type: 'widget'; id: WidgetId; caption?: string }
  | { type: 'quiz'; quiz: Quiz }
  | { type: 'exercise'; exercise: Exercise }
  | { type: 'selfExplain'; selfExplain: SelfExplain }

/* ---------------- 课程与模块 ---------------- */

export interface Lesson {
  /** 全局唯一，如 'm0-l1' */
  id: string
  moduleId: string
  title: string
  /** 完成本课获得的 XP */
  xp: number
  /** 模块内最后一课通常是 Checkpoint（综合检查点） */
  isCheckpoint?: boolean
  /** 预计用时（分钟），用于展示 */
  minutes: number
  blocks: LessonBlock[]
}

export interface CourseModule {
  /** 'm0' ~ 'm14' */
  id: string
  order: number
  title: string
  subtitle: string
  /** 一个 emoji 作为轻度像素风图标 */
  icon: string
  /** tailwind 颜色 token：violet / sky / mint / amber / rose */
  accent: 'violet' | 'sky' | 'mint' | 'amber' | 'rose'
  lessons: Lesson[]
}

/* ---------------- Mock Meeting ---------------- */

export interface MeetingKeyPoint {
  /** 该要点的英文表述 */
  en: string
  /** 该要点的中文说明 */
  zh: string
  /** 用于检测用户答案是否覆盖该要点的关键词（小写，英文为主，可含数字） */
  keywords: string[]
}

export interface MeetingQuestion {
  id: string
  question: string
  /** 中文提示：这个问题到底在问什么 */
  hintZh: string
  /** 回答中必须使用的英文术语 */
  requiredTerms: string[]
  keyPoints: MeetingKeyPoint[]
  /** 简单英文参考答案 */
  referenceAnswer: string
  /** 答错时建议复习的模块 id */
  reviewModuleId: string
}

/* ---------------- Notebook Walkthrough ---------------- */

export interface WalkthroughCell {
  /** cell 序号（0 起，共 45 个） */
  index: number
  cellType: 'markdown' | 'code'
  /** 所属章节，如 '7. Choose lags using only data through 1999' */
  section: string
  /** 一句话标题（中文） */
  title: string
  /** 代码 cell 展示核心代码；markdown cell 可为空 */
  code?: string
  /** 输出摘要 */
  outputSummary?: string
  /** 这段代码/文字在做什么（中文） */
  whatItDoes: string
  /** 为什么需要它 */
  whyNeeded: string
  /** 输入是什么 */
  inputs?: string
  /** 输出是什么 */
  outputs?: string
  /** 如果改错/删掉会发生什么 */
  ifBroken?: string
  /** 它与最终 12 个月预测的关系 */
  linkToForecast?: string
}

/* ---------------- Glossary ---------------- */

export interface GlossaryEntry {
  id: string
  zh: string
  en: string
  definition: string
  /** 来自本项目的例子 */
  example?: string
  /** 相关课程 id，可跳转 */
  lessonId?: string
  category:
    | 'CPI 基础'
    | '数据与转换'
    | '回归与统计'
    | '回测与评估'
    | '模型与预测'
    | '项目术语'
}

/* ---------------- 成就 ---------------- */

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  /** 满足条件所需的计数（由 progress store 判定） */
  check:
    | { kind: 'lessonsCompleted'; count: number }
    | { kind: 'moduleCompleted'; moduleId: string }
    | { kind: 'allModules' }
    | { kind: 'quizStreak'; count: number }
    | { kind: 'playgroundVisited'; id: string }
    | { kind: 'allPlaygrounds' }
    | { kind: 'meetingAnswered'; count: number }
    | { kind: 'meetingAllPassed' }
    | { kind: 'finalPassed' }
    | { kind: 'glossaryViewed'; count: number }
    | { kind: 'xp'; amount: number }
}

/* ---------------- 进度（localStorage） ---------------- */

export interface LessonProgress {
  completed: boolean
  quizCorrectFirstTry?: boolean
  exerciseDone?: boolean
  selfExplainDone?: boolean
  completedAt?: string
}

export interface MeetingRecord {
  attempts: number
  passed: boolean
  /** 未覆盖的要点（中文），作为薄弱知识点保存 */
  weakPoints: string[]
  lastAnswer?: string
}

export interface ProgressState {
  version: 2
  xp: number
  /** lessonId -> progress */
  lessons: Record<string, LessonProgress>
  /** questionId -> record */
  meeting: Record<string, MeetingRecord>
  /** 已解锁成就 id -> 解锁时间 */
  achievements: Record<string, string>
  /** 已访问的 playground id */
  playgrounds: string[]
  /** 已查看的词汇表条目 */
  glossaryViewed: string[]
  /** 连续答对选择题计数（用于成就） */
  quizStreak: number
  bestQuizStreak: number
  /** 用户笔记（自由文本，右侧栏） */
  notes: string
  /** 薄弱知识点（来自答错与 mock meeting） */
  weakAreas: string[]
  /** Final Challenge 最高分（0-100） */
  finalBestScore: number
  finalPassed: boolean
  startedAt: string
}
