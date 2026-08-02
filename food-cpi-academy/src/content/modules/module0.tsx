import type { CourseModule } from '../../types'

/**
 * Module 0：项目全景
 * 让零基础学生知道：这个 Capstone 是什么、Bottom-up 是什么、
 * 自己负责的 Food CPI 在哪里、最终要交付什么。
 */
export const module0: CourseModule = {
  id: 'm0',
  order: 0,
  title: 'Module 0 · 项目全景',
  subtitle: '认识 Pacific Life Capstone 和你负责的 Food CPI',
  icon: '🗺️',
  accent: 'violet',
  lessons: [
    {
      id: 'm0-l1',
      moduleId: 'm0',
      title: '这个项目到底在做什么',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 UCI × Pacific Life Capstone 项目的目标',
            '理解什么是 CPI 预测，为什么保险公司关心它',
            '记住你负责的部分：Food CPI 的未来 12 个月预测',
          ],
        },
        {
          type: 'text',
          md: '你参加的是 UCI 与 Pacific Life（太平洋人寿）合作的 Capstone Project。Pacific Life 是一家保险与投资管理公司，它非常关心**通货膨胀（Inflation）**：通胀会影响债券收益、负债成本和投资决策。\n\n项目的目标是：**预测美国 CPI（Consumer Price Index，消费者价格指数）未来 12 个月的走势**。CPI 是衡量普通家庭购买一篮子商品和服务价格变化的指数——简单说，它衡量"生活成本涨了多少"。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '消费者价格指数',
              en: 'CPI (Consumer Price Index)',
              definition: '衡量普通家庭购买的一篮子商品和服务价格水平的指数。CPI 上涨意味着同样的东西变贵了。',
              example: '本项目预测的目标就是 CPI 中的 Food（食品）分项。',
            },
            {
              zh: '通货膨胀率',
              en: 'Inflation Rate',
              definition: '价格水平的增长速度，通常用 CPI 的同比变化率（YoY % Change）表示。',
              example: '2026 年 6 月 Food CPI 同比通胀为 2.99%，表示食品价格比一年前贵了约 2.99%。',
            },
            {
              zh: '顶点项目',
              en: 'Capstone Project',
              definition: '研究生课程的综合实践项目，把学到的方法用于真实企业的问题。',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: '为什么保险公司要预测 CPI？',
          md: '保险公司收进保费、在几十年后赔付。如果未来物价涨得比预期快，同样金额的赔付"缩水"了，投资也要重新配置。所以 Pacific Life 需要一个对未来 12 个月通胀的合理预期，来支持投资和风险决策。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '这个 Capstone 项目的核心任务是什么？',
            options: [
              {
                id: 'a',
                text: '预测美国股市未来 12 个月的涨跌',
                correct: false,
                explanation: '错在对象：项目预测的是 CPI（物价指数），不是股票市场。股价和物价是两回事——正确思路是回到项目目标：帮 Pacific Life 形成对未来通胀的预期。',
              },
              {
                id: 'b',
                text: '预测美国 CPI 未来 12 个月的走势',
                correct: true,
                explanation: '正确！整个项目围绕 CPI 通胀预测展开，你负责其中的 Food CPI 分项。',
              },
              {
                id: 'c',
                text: '计算 Pacific Life 保险产品的定价',
                correct: false,
                explanation: '错在层次：保险定价是公司内部的下游应用，Capstone 只负责提供通胀预测输入。为什么错——我们交付的是 CPI 预测，不是产品定价模型。应复习"项目目标"。',
              },
            ],
            conceptReview: '项目目标（CPI Forecasting）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '概念快速配对',
            instructions: '把左边的概念与右边的解释配对。',
            pairs: [
              { left: 'CPI', right: '衡量一篮子商品和服务价格水平的指数' },
              { left: 'Inflation Rate', right: '价格水平的增长速度（通常用 YoY 表示）' },
              { left: 'Capstone Project', right: '与真实企业合作的综合实践项目' },
              { left: 'Pacific Life', right: '需要通胀预测支持投资决策的保险公司' },
            ],
            feedbackCorrect: '配对全部正确！这四个概念是整个课程的舞台背景。',
            feedbackWrong: '再想想：哪个是"指数"，哪个是"增长速度"？哪个是项目形式，哪个是合作方？',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '请用自己的话解释：这个项目要做什么？Pacific Life 为什么需要它？',
            keywords: ['CPI', '12', '通胀'],
            modelAnswer: '这个项目为 Pacific Life 预测美国 CPI 未来 12 个月的通胀走势。保险公司未来要赔付很多钱，通胀会改变这些钱的实际价值和投资回报，所以需要一个可解释的通胀预测来支持决策。',
          },
        },
      ],
    },
    {
      id: 'm0-l2',
      moduleId: 'm0',
      title: 'Bottom-up 预测与 Food CPI 的位置',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解 Bottom-up CPI Forecasting 的思路',
            '知道 Headline CPI 被拆成哪些组件',
            '明确 Food CPI 是你负责的组件',
          ],
        },
        {
          type: 'text',
          md: '整个团队采用**自下而上预测（Bottom-up Forecasting）**：不直接预测总 CPI，而是把 **Headline CPI（整体 CPI）** 拆成几个大组件，每人负责一个组件，分别预测后再按权重加总回去。\n\n团队拆分的组件包括：Housing（住房）、Energy（能源）、**Food（食品）**、Core Goods（核心商品）、Core Services（核心服务）等，另有同学研究 TIPS 和 Real Yield（这里只需知道名字，不用深入）。\n\n**你负责的是 Food CPI**——它约占 Headline CPI 的 13.4%（relative importance 13.447）。这门课程只教你负责的 Food CPI 部分。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '整体 CPI',
              en: 'Headline CPI',
              definition: '包含所有商品与服务的总 CPI，是新闻里常说的"通胀率"。',
            },
            {
              zh: '自下而上预测',
              en: 'Bottom-up Forecasting',
              definition: '把整体拆成组件，分别预测每个组件，再按权重加总得到整体预测。',
              example: '团队把 Headline CPI 拆成 Housing、Energy、Food 等组件，你负责 Food。',
            },
            {
              zh: '相对重要性权重',
              en: 'Relative Importance',
              definition: 'BLS 公布的每个 CPI 组件在总指数中的占比权重。',
              example: 'Total Food 的 relative importance 是 13.447，即约占 Headline CPI 的 13.4%。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'weightsBar',
          caption: 'Food CPI 内部权重：Food at Home（8.188）与 Food Away from Home（5.260），合计 13.447',
        },
        {
          type: 'callout',
          variant: 'warn',
          title: '课程边界',
          md: 'Housing、Energy、Core Goods、Core Services、TIPS、Real Yield 由其他队友负责，本课程**不展开教授**。你只需要知道：它们和 Food 一样是 Bottom-up 拼图中的组件，Food 的预测最后会与它们合并成 Headline CPI 预测。',
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '谁负责什么？',
            instructions: '把每一项放进正确的类别。',
            categories: ['你负责（本课程教）', '队友负责（只需知道名字）'],
            items: [
              { text: 'Food at Home 预测', category: '你负责（本课程教）' },
              { text: 'Food Away from Home 预测', category: '你负责（本课程教）' },
              { text: 'Food CPI 对 Headline 的贡献', category: '你负责（本课程教）' },
              { text: 'Housing（住房）', category: '队友负责（只需知道名字）' },
              { text: 'Energy（能源）', category: '队友负责（只需知道名字）' },
              { text: 'TIPS / Real Yield', category: '队友负责（只需知道名字）' },
            ],
            feedbackCorrect: '完全正确！你的战场是 Food CPI：两个分项的预测 + 合并 + 对 Headline 的贡献。',
            feedbackWrong: '再想想课程边界：本课程只教 Food CPI 相关内容，Housing/Energy/TIPS 都属于队友的组件，你只需要知道它们的存在。',
          },
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Bottom-up CPI Forecasting 的意思是？',
            options: [
              {
                id: 'a',
                text: '从最新数据出发，往回推算历史 CPI',
                correct: false,
                explanation: '错在方向的含义："bottom-up" 指组件层级，不是时间方向。正确思路：bottom（组件）→ up（加总成整体）。',
              },
              {
                id: 'b',
                text: '把 Headline CPI 拆成组件，分别预测再按权重加总',
                correct: true,
                explanation: '正确！每个组件由熟悉该领域驱动因素的人预测，再按 relative importance 权重加总。',
              },
              {
                id: 'c',
                text: '只预测权重最大的组件，忽略其他',
                correct: false,
                explanation: '错在"忽略"：Bottom-up 是所有组件都预测再加总，不是只挑大的。Food 只占 13.4%，但仍是拼图中不可缺的一块。应复习 Bottom-up Forecasting 的定义。',
              },
            ],
            conceptReview: '自下而上预测（Bottom-up Forecasting）',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：Food CPI 在整个 Capstone 中处于什么位置？',
            keywords: ['Bottom-up', '组件', '权重'],
            modelAnswer: '团队用 Bottom-up 方法把 Headline CPI 拆成 Housing、Energy、Food 等组件。我负责 Food 组件：先分别预测 Food at Home 和 Food Away from Home，再合并成 Total Food CPI 预测，最后按 13.447 的相对重要性权重换算成对 Headline CPI 的贡献，交给团队加总。',
          },
        },
      ],
    },
    {
      id: 'm0-l3',
      moduleId: 'm0',
      title: 'Checkpoint · 你要交付的 10 件事',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '记住 Food CPI 模型的 10 项任务清单',
            '对课程后面的所有模块建立一张"地图"',
          ],
        },
        {
          type: 'text',
          md: '你的 Food CPI 模型需要完成以下 10 件事——这也是后面所有模块的路线图：\n\n1. 把 Food CPI 拆成 **Food at Home** 和 **Food Away from Home**（Module 1）\n2. 为两个分项寻找**领先指标（Leading Indicators）**（Module 2、4）\n3. 确定 **Predictor 和 Lag**（Module 4）\n4. 建立 **Lead-lag Regression**（Module 6）\n5. 使用 **Expanding-window Backtest**（Module 8）\n6. 生成未来 12 个月逐月预测（Module 9）\n7. 计算 **RMSE、MAE、OOS R² 和 Prediction Interval**（Module 11）\n8. 把两个分项合并为 **Total Food CPI**（Module 10）\n9. 计算 Food CPI 对 **Headline CPI 的贡献**（Module 10）\n10. 准备回答 Pacific Life 会议中的模型问题（Module 14）',
        },
        {
          type: 'notebook',
          title: '你的 Notebook：唯一的事实来源',
          code: '# Food CPI Forecast — Long-History and Survey-Enhanced Version\n# 45 cells · 16 sections · 18 FRED series',
          output: 'Primary 12-month-ahead forecast: 3.02%\nSurvey-sensitivity 12-month-ahead forecast: 4.34%',
          note: '整个课程严格依据这份 Notebook。它的最终输出是两个关键数字：主预测 3.02% 和调查敏感性情景 4.34%——课程结束时你要能解释这两个数字的全部来历。',
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把工作流程排成正确顺序',
            instructions: '从数据到会议，把 Food CPI 工作流程的 6 个大步骤按先后排序。',
            correctOrder: [
              '拆分 Food at Home 与 Food Away from Home',
              '选择 Predictor 和 Lag',
              '建立 Lead-lag Regression',
              '用 Expanding-window Backtest 检验',
              '生成未来 12 个月预测并合并成 Total Food',
              '在 Pacific Life 会议上解释模型',
            ],
            feedbackCorrect: '顺序完全正确！这就是从原始数据到会议答辩的完整链路。',
            feedbackWrong: '想一想依赖关系：必须先有分项和指标，才能建回归；回归检验合格后才谈预测；预测汇总之后才是会议答辩。',
          },
        },
        {
          type: 'quiz',
          quiz: {
            question: '课程结束时，你的 Notebook 最终给出的 Primary 12 个月预测（2027 年 6 月 Total Food CPI YoY）是多少？',
            options: [
              {
                id: 'a',
                text: '3.02%',
                correct: true,
                explanation: '正确！Primary Baseline 对 2027 年 6 月 Total Food CPI YoY 的预测是 3.02%。另一个数字 4.34% 是 Survey Sensitivity 情景，不是主预测。',
              },
              {
                id: 'b',
                text: '4.34%',
                correct: false,
                explanation: '错在混淆两条线：4.34% 是 Survey Sensitivity（调查敏感性情景），它反映"如果企业价格意向也传导进来会怎样"，不是主预测。主预测（Primary Baseline）是 3.02%。记住课程铁律：不能把 Survey Sensitivity 当作 Primary Forecast。',
              },
              {
                id: 'c',
                text: '2.59%',
                correct: false,
                explanation: '错在版本：2.59% 是早期旧版 Notebook 的数字，已经废弃。当前 Notebook（Long-History and Survey-Enhanced Version）的主预测是 3.02%。永远以当前 Notebook 为准。',
              },
            ],
            conceptReview: 'Primary Baseline vs Survey Sensitivity',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '不看清单，凭记忆写出至少 5 项你要交付的任务。',
            keywords: ['Lag', 'Regression', 'Backtest', 'RMSE', '12'],
            modelAnswer: '拆分两个 Food 分项；找 Leading Indicators；定 Predictor 和 Lag；建 Lead-lag Regression；做 Expanding-window Backtest；生成 12 个月预测；算 RMSE/MAE/OOS R²/区间；合并 Total Food；算对 Headline 的贡献；准备会议答辩。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经拿到整个课程的地图。接下来从 Module 1 开始，把每一块拼图逐一点亮。',
        },
      ],
    },
  ],
}
