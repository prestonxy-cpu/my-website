/**
 * 课程内容聚合入口。
 * 教学文案（content/）与模型数值（data/modelResults.ts、data/series.ts）严格分离：
 * 文案中引用的数值应从 data/ 导入或与其一致，更新 Notebook 时只需替换 data/ 文件。
 */
import type { CourseModule, Lesson } from '../types'
import { module0 } from './modules/module0'
import { module1 } from './modules/module1'
import { module2 } from './modules/module2'
import { module3 } from './modules/module3'
import { module4 } from './modules/module4'
import { module5 } from './modules/module5'
import { module6 } from './modules/module6'
import { module7 } from './modules/module7'
import { module8 } from './modules/module8'
import { module9 } from './modules/module9'
import { module10 } from './modules/module10'
import { module11 } from './modules/module11'
import { module12 } from './modules/module12'
import { module13 } from './modules/module13'
import { module14 } from './modules/module14'

export const modules: CourseModule[] = [
  module0, module1, module2, module3, module4, module5, module6, module7,
  module8, module9, module10, module11, module12, module13, module14,
]

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons)

export function findLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function findModule(id: string): CourseModule | undefined {
  return modules.find((m) => m.id === id)
}

/** 课程内相邻导航 */
export function adjacentLessons(id: string): { prev?: Lesson; next?: Lesson } {
  const i = allLessons.findIndex((l) => l.id === id)
  if (i < 0) return {}
  return {
    prev: i > 0 ? allLessons[i - 1] : undefined,
    next: i < allLessons.length - 1 ? allLessons[i + 1] : undefined,
  }
}
