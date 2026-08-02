import type { CourseModule } from '../../types'

/**
 * Module 14：Mock Meeting 准备
 * 英文答题框架 + 13 个问题总览 + 进入实战
 */
export const module14: CourseModule = {
  id: 'm14',
  order: 14,
  title: 'Module 14 · Mock Meeting 准备',
  subtitle: '把全部课程装进 13 个英文问题的答题框架',
  icon: '🎤',
  accent: 'amber',
  lessons: [
    {
      id: 'm14-l1',
      moduleId: 'm14',
      title: '英文答题框架：结论 → 机制 → 数字 → 限制',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '掌握四步英文答题框架（Conclusion → Mechanism → Numbers → Limitation）',
            '知道哪些英文术语必须原样使用、哪些数字必须张口就来',
          ],
        },
        {
          type: 'text',
          md: 'Pacific Life 的提问节奏很快，答案要**先给结论**再展开。推荐四步框架：\n\n1. **Conclusion（结论先行）**："Our primary 12-month forecast is 3.02%."\n2. **Mechanism（机制一句话）**："It comes from two lead-lag regressions — PPI with a 1-month lag for groceries, hospitality wages with a 12-month lag for restaurants."\n3. **Numbers（关键数字支撑）**："Out-of-sample, the model beats a no-change benchmark with an OOS R² of 0.598."\n4. **Limitation（主动交代边界）**："Months beyond the first rely on a three-month-average PPI assumption, so it is a baseline scenario."\n\n主动说限制不是示弱——它抢在追问之前展示你完全清楚模型的边界，反而最能建立信任。',
        },
        {
          type: 'table',
          headers: ['必背数字', '值', '一句话用法'],
          rows: [
            ['Latest Total Food YoY (2026-06)', '2.99%', 'where we are today'],
            ['Primary 12M forecast (2027-06)', '3.02%', 'our main point estimate'],
            ['Survey scenario (2027-06)', '4.34%', 'higher-inflation sensitivity'],
            ['Primary 12M OOS RMSE', '2.035 pp', 'typical 12-month error'],
            ['Primary OOS R² vs no-change', '0.598', '~60% lower squared errors'],
            ['Contribution to Headline', '0.41 pp', 'what plugs into bottom-up'],
            ['Home lag / Away lag', '1 / 12', 'PPI passes fast, wages slow'],
            ['Weights', '8.188 / 5.260 / 13.447', 'how components combine'],
          ],
          note: '这 8 组数字覆盖了 13 个问题中 90% 的数字需求。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '必用术语（方法）',
              en: 'lead-lag regression / expanding window / no-change benchmark',
              definition: '回答方法类问题时必须原样出现——它们是模型方法论的"学名"，换成口语会显得不专业。',
            },
            {
              zh: '必用术语（数据与定位）',
              en: 'observed vs assumed / sensitivity scenario / look-ahead bias',
              definition: '用于回答数据来源、Survey 定位与样本设计类问题。',
              example: '"Only the first month uses observed PPI; the rest are assumed" 一句话讲清 audit 表。',
            },
          ],
        },
        {
          type: 'quiz',
          quiz: {
            question: '面试官问 "How confident are you in the 3.02%?"，按框架最好的开头是？',
            options: [
              {
                id: 'a',
                text: '"We hold it as a well-tested central scenario, not a precise promise."（结论先行，再给 RMSE 与区间）',
                correct: true,
                explanation: '正确！先一句话定性（结论），再用 2.035 pp RMSE 和经验区间支撑（数字），最后交代 3 个月平均假设（限制）。',
              },
              {
                id: 'b',
                text: '先从 1913 年的数据历史讲起，铺垫十分钟',
                correct: false,
                explanation: '错在节奏：会议追问要的是直接回答。背景可以在追问时再展开——"结论先行"是铁律。',
              },
              {
                id: 'c',
                text: '"I am 100% confident."',
                correct: false,
                explanation: '错在诚实性：任何预测都有不确定性，经验区间宽达 [−0.56%, 8.23%]。过度自信在专业听众面前是减分项，诚实 + 边界才是可信。',
              },
            ],
            conceptReview: '答题框架（Module 14）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把一个完整回答按框架排序',
            instructions: '这是回答 "Why is the survey scenario 4.34%?" 的四句话，按框架排出正确顺序。',
            correctOrder: [
              'The 4.34% is a higher-inflation sensitivity scenario, not our primary forecast.',
              'It adds the Philadelphia Fed future prices received survey, which enters with positive coefficients.',
              'Recent readings are elevated — 67.2 in June 2026 — which pushes the forecast up from 3.02%.',
              'Because the survey is regional and not food-specific, we report it as a scenario only.',
            ],
            feedbackCorrect: '完美！结论 → 机制 → 数字 → 限制，一气呵成。',
            feedbackWrong: '检查第一句是不是结论（它是什么/不是什么），最后一句是不是主动交代边界。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用四步框架，写出 "What does an OOS R² of 0.598 mean?" 的答题要点（中文列要点即可）。',
            keywords: ['no-change', '59.8', '准确率'],
            modelAnswer: '结论：它是相对 no-change 基准的误差改善度量。机制：no-change 假设未来 12 个月 YoY 不变，OOS R² = 1 − 模型平方误差/基准平方误差。数字：0.598 即平方误差比基准低约 59.8%。限制/澄清：它不是 59.8% 的准确率，也不等于解释了 59.8% 的波动。',
          },
        },
      ],
    },
    {
      id: 'm14-l2',
      moduleId: 'm14',
      title: 'Checkpoint · 进入会议室',
      xp: 100,
      minutes: 15,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '总览 13 个 Mock Meeting 问题及其考点',
            '进入 Mock Meeting 实战 + Final Challenge',
          ],
        },
        {
          type: 'text',
          md: '这是最后一个 Checkpoint。13 个问题按考点分组：\n\n- **流程类**（Q1 如何产出 12 个月预测 / Q7 什么是 expanding-window）→ Module 8、9\n- **数据来源类**（Q2 是否全部 observed / Q3 哪个 PPI 值产出 7 月预测）→ Module 9 的 audit 表\n- **模型设定类**（Q4 为什么 lag 1 / Q5 为什么 lag 12 / Q9 为什么不选 survey 模型）→ Module 4、7\n- **方法论类**（Q6 为什么分三个阶段）→ Module 5\n- **评估类**（Q8 OOS R² 0.598 / Q10 对 3.02% 的信心）→ Module 11\n- **情景类**（Q11 为什么 survey 是 4.34%）→ Module 7\n- **边界类**（Q12 模型限制）→ Module 13\n- **交付类**（Q13 如何换算 Headline 贡献）→ Module 10\n\n答完 Mock Meeting 的 13 题，再去 Final Challenge 拿下 ≥80 分，课程就通关了。',
        },
        {
          type: 'callout',
          variant: 'warn',
          title: '实战规则',
          md: '在 Mock Meeting 页面：用**英文**作答（≥20 词）；系统检查核心要点覆盖与必用术语，用中文指出遗漏并给英文参考答案；没通过可以修改重答。遗漏的要点会自动记入右侧「薄弱知识点」。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '被问到 "Are all twelve months based on observed predictor data?" 时，最致命的错误回答是？',
            options: [
              {
                id: 'a',
                text: '"Yes, everything is observed."',
                correct: true,
                explanation: '正确——这是最致命的答案！Home 分项 11 个月依赖 3 个月平均假设，audit 表白纸黑字。被识破一次"过度声称"，后面所有数字都会被怀疑。正确开头是 "No, it depends on the component."',
              },
              {
                id: 'b',
                text: '"No — for Food at Home only the first month is observed."',
                correct: false,
                explanation: '这是正确回答的开头，不是错误。题目问的是"最致命的错误"——即把 assumed 说成 observed 的过度声称。',
              },
              {
                id: 'c',
                text: '"Let me check the audit table."',
                correct: false,
                explanation: '这不算致命——当场查表虽然不够熟练，但至少诚实。致命的是自信地给出错误事实（选项 a）。当然，最好的状态是答案脱口而出。',
              },
            ],
            conceptReview: 'Observed vs Assumed（Module 9）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '13 个问题的"一句话弹药"',
            instructions: '把问题与它的核心弹药（关键数字/事实）配对。',
            pairs: [
              { left: 'Q3 Which PPI value → July 2026?', right: 'June 2026 PPI YoY = 1.63% (observed)' },
              { left: 'Q4 Why lag 1?', right: 'Highest training R² (0.769) on pre-2000 sample' },
              { left: 'Q8 OOS R² 0.598?', right: '~59.8% lower squared errors vs no-change' },
              { left: 'Q13 Headline contribution?', right: '3.02% × 13.447 / 100 ≈ 0.41 pp' },
            ],
            feedbackCorrect: '弹药装填完毕！去会议室吧。',
            feedbackWrong: '每个问题都有一个"一句话就能镇住场"的数字——把它们和问题绑定记忆。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '最后的自我检查：写下你现在最没把握的 2 个问题编号和原因（这会成为你的复习清单）。',
            keywords: ['Q', '复习'],
            modelAnswer: '示例：Q10（对 3.02% 的信心）——容易只报 RMSE 忘了经验区间和假设情景定位，需复习 Module 11/13；Q9（为什么不选 survey 模型）——容易只说"R² 差不多"而漏掉区域性与可解释性论证，需复习 Module 7。写下自己的版本，然后带着它进 Mock Meeting。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: '🎓 课程完成！',
          md: '15 个模块全部通关。现在：**🎤 Mock Meeting** 实战 13 问 → **🏆 Final Challenge** 拿下 80 分。完成后，你就能独立解释这个模型的每一个数字——从 18 个 FRED 序列到 3.02%。',
        },
      ],
    },
  ],
}
