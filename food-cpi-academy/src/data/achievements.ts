import type { AchievementDef } from '../types'

/** 成就徽章定义（判定逻辑在 progress store 中） */
export const achievements: AchievementDef[] = [
  { id: 'first-steps', title: '启程', description: '完成第一节课', icon: '🌱', check: { kind: 'lessonsCompleted', count: 1 } },
  { id: 'cpi-rookie', title: 'CPI 入门', description: '完成 Module 1：认识 Food CPI', icon: '🛒', check: { kind: 'moduleCompleted', moduleId: 'm1' } },
  { id: 'data-detective', title: '数据侦探', description: '完成 Module 2：认识 18 个数据序列', icon: '🔍', check: { kind: 'moduleCompleted', moduleId: 'm2' } },
  { id: 'lag-hunter', title: '领先指标猎人', description: '完成 Module 4：Leading Indicator 与 Lag', icon: '🎯', check: { kind: 'moduleCompleted', moduleId: 'm4' } },
  { id: 'time-guardian', title: '时间守卫', description: '完成 Module 5：防止 Look-ahead Bias', icon: '⏳', check: { kind: 'moduleCompleted', moduleId: 'm5' } },
  { id: 'regression-scholar', title: '回归学者', description: '完成 Module 6：Linear Regression', icon: '📐', check: { kind: 'moduleCompleted', moduleId: 'm6' } },
  { id: 'backtest-engineer', title: '回测工程师', description: '完成 Module 8：Expanding-window Backtest', icon: '🔁', check: { kind: 'moduleCompleted', moduleId: 'm8' } },
  { id: 'forecast-reader', title: '预测解读者', description: '完成 Module 9：未来 12 个月预测', icon: '🔮', check: { kind: 'moduleCompleted', moduleId: 'm9' } },
  { id: 'honest-modeler', title: '诚实的建模者', description: '完成 Module 13：Limitations', icon: '🪞', check: { kind: 'moduleCompleted', moduleId: 'm13' } },
  { id: 'quiz-streak-5', title: '连击 ×5', description: '连续答对 5 道选择题', icon: '⚡', check: { kind: 'quizStreak', count: 5 } },
  { id: 'quiz-streak-10', title: '连击 ×10', description: '连续答对 10 道选择题', icon: '🔥', check: { kind: 'quizStreak', count: 10 } },
  { id: 'playground-explorer', title: '实验室常客', description: '访问全部 4 个 Playground', icon: '🧪', check: { kind: 'allPlaygrounds' } },
  { id: 'first-interview', title: '第一次答辩', description: '在 Mock Meeting 中通过 1 个问题', icon: '🎤', check: { kind: 'meetingAnswered', count: 1 } },
  { id: 'meeting-survivor', title: '会议幸存者', description: '通过 Mock Meeting 全部 13 个问题', icon: '🏛️', check: { kind: 'meetingAllPassed' } },
  { id: 'word-master', title: '词汇达人', description: '查看 20 个词汇表条目', icon: '📖', check: { kind: 'glossaryViewed', count: 20 } },
  { id: 'xp-1000', title: '千分学者', description: '累计获得 1000 XP', icon: '💎', check: { kind: 'xp', amount: 1000 } },
  { id: 'course-complete', title: '全课程通关', description: '完成所有 15 个模块', icon: '🎓', check: { kind: 'allModules' } },
  { id: 'final-boss', title: '终极挑战者', description: '通过 Final Challenge（≥80 分）', icon: '🏆', check: { kind: 'finalPassed' } },
]
