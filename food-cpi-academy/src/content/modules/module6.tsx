import type { CourseModule } from '../../types'

/**
 * Module 6：Linear Regression
 * 用当前 Home 方程（α=1.408、β=0.650）讲透
 * Alpha / Beta / Residual / Standard Error / P-value / HAC。
 */
export const module6: CourseModule = {
  id: 'm6',
  order: 6,
  title: 'Module 6 · Linear Regression',
  subtitle: '读懂 α、β、Residual 和那些统计数字',
  icon: '📐',
  accent: 'sky',
  lessons: [
    {
      id: 'm6-l1',
      moduleId: 'm6',
      title: '一条直线读懂预测方程',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '认识线性回归（Linear Regression）的四个角色：Target、Predictor、Alpha、Beta',
            '会逐词读出 Home 方程：FoodAtHome(t) = 1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
            '理解 β = 0.650 的"传导打折"含义',
          ],
        },
        {
          type: 'text',
          md: '我们的 Home 主模型，本质上只是一条**直线**。**线性回归（Linear Regression）**就是"用一条直线描述两个变量的关系"：知道 x，就能沿着直线读出对 y 的最佳猜测。\n\n这条方程里有四个角色：\n\n- **Target（目标变量）**：等号左边、要预测的东西——本月 Food at Home CPI 的 YoY。\n- **Predictor（预测变量）**：等号右边的 x——**上一个月**的 Processed Foods PPI YoY（lag 1，Module 4 冻结的选择）。\n- **Alpha（α，截距 Intercept）= 1.408**：当 Predictor 恰好为 0 时方程给出的基准水平——即使上月 PPI 同比零增长，模型仍预测约 1.4% 的食品通胀。\n- **Beta（β，斜率 Slope）= 0.650**：上月 PPI YoY 每高 1 个百分点，本月 Food at Home YoY 的预测就高 0.650 个百分点。',
        },
        {
          type: 'formula',
          lhs: 'FoodAtHome(t)',
          rhs: '1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
          note: '系数 estimated through 2026-06（Cell 35）；每个 forecast origin 都会重新估计。',
        },
        {
          type: 'text',
          md: '注意 β = 0.650 **小于 1**：生产端涨价不会一比一地全额传到超市货架，传导"打了折扣"——超市还有人工、租金等其他成本，也会自己消化一部分涨价。在 Module 9 里，把真实的 PPI 数值代入这条方程，就得到未来 12 个月的 Home 预测。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '线性回归',
              en: 'Linear Regression',
              definition: '用一条直线 y = α + β × x 描述两个变量关系、并据此做预测的统计方法。',
              example: 'Home baseline 就是一条以上月 PPI YoY 为 x 的回归直线。',
            },
            {
              zh: '目标变量',
              en: 'Target',
              definition: '方程等号左边、模型要预测的变量。',
              example: 'Home 模型的 Target 是 Food at Home CPI YoY。',
            },
            {
              zh: '预测变量',
              en: 'Predictor',
              definition: '方程等号右边、用来做预测的变量（本项目里带着冻结的 lag）。',
              example: 'Home 模型的 Predictor 是 Processed Foods PPI YoY，lag 1。',
            },
            {
              zh: '截距',
              en: 'Alpha (Intercept)',
              definition: '当 Predictor 为 0 时方程给出的基准水平，即直线与纵轴的交点。',
              example: 'Home 方程的 α = 1.408。',
            },
            {
              zh: '斜率 / 系数',
              en: 'Beta (Slope)',
              definition: 'Predictor 每变化 1 个单位，预测值随之变化多少。',
              example: 'Home 方程的 β = 0.650：PPI YoY 高 1 pp，预测高 0.650 pp。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 35：Notebook 打印出的当前方程',
          code: 'display(current_equations)',
          output: 'Home baseline:\nfood_at_home_cpi(t) = 1.408 + 0.650 × ppi_processed_foods(t−1)\nEstimated_through: 2026-06',
          note: '这条方程不是拍脑袋写的——它是 Cell 35 用截至 2026-06 的数据估计后自动生成的文本。',
        },
        {
          type: 'chart',
          id: 'ppiVsHomeCpi',
          caption: '上月 PPI YoY（lag 1）与本月 Food at Home YoY 的走势对比——这条直线描述的正是这两条线的关系',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'β = 0.650 的正确解读是？',
            options: [
              {
                id: 'a',
                text: '上月 PPI YoY 每高 1 个百分点，本月 Food at Home YoY 的预测值高 0.650 个百分点',
                correct: true,
                explanation: '正确！β 是斜率：Predictor 每变动 1 个单位，预测值变动 β 个单位。小于 1 说明生产端涨价传导到零售端时打了折扣。',
              },
              {
                id: 'b',
                text: 'Food at Home 通胀永远等于 PPI 通胀的 0.650 倍',
                correct: false,
                explanation: '错在漏掉了 α 和误差：方程还有截距 1.408，而且真实值 = 预测值 + Residual。回归描述的是"平均而言的关系"，不是简单的固定倍数。应复习方程的完整结构 y = α + β × x。',
              },
              {
                id: 'c',
                text: '模型 65% 的预测是准确的',
                correct: false,
                explanation: '错在概念混淆：0.650 是斜率（系数），不是准确率，也不是 R²。衡量预测好坏要用 RMSE、OOS R² 等指标（Module 11）。正确思路：β 回答的是"x 动一格，y 的预测动几格"。',
              },
            ],
            conceptReview: 'Beta（斜率）的含义',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '方程里的四个角色',
            instructions: '把 Home 方程中的每个角色和它的含义配对。',
            pairs: [
              { left: 'Target', right: '本月 Food at Home CPI YoY（要预测的）' },
              { left: 'Predictor', right: '上月 Processed Foods PPI YoY（lag 1，用来预测的）' },
              { left: 'Alpha = 1.408', right: '当 Predictor 为 0 时的基准预测水平' },
              { left: 'Beta = 0.650', right: 'PPI YoY 每高 1 pp，预测高 0.650 pp' },
            ],
            feedbackCorrect: '全部正确！现在你可以逐词读出整条方程了：本月食品通胀的预测 = 1.408 + 0.650 × 上月 PPI 通胀。',
            feedbackWrong: '回到方程 y = α + β × x：y 是 Target（左边），x 是 Predictor（右边），α 是 x 为 0 时的起点，β 是 x 每动 1 格 y 动几格。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '不看讲义，逐词解释 Home 方程：等号左右各是什么？1.408 和 0.650 分别扮演什么角色？',
            keywords: ['截距', '斜率', '0.650'],
            modelAnswer: '等号左边是 Target：本月 Food at Home CPI YoY。右边的 Predictor 是上月的 Processed Foods PPI YoY（lag 1）。1.408 是截距（Alpha）：PPI 同比为 0 时模型仍预测约 1.4% 的通胀。0.650 是斜率（Beta）：上月 PPI YoY 每高 1 个百分点，本月预测就高 0.650 个百分点——传导打了折扣，不是一比一。',
          },
        },
      ],
    },
    {
      id: 'm6-l2',
      moduleId: 'm6',
      title: 'Residual 与"最小化平方误差"',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解 Residual（残差）= Actual − Predicted',
            '知道 OLS 用"平方误差和最小"来定义最优直线',
            '明白为什么用平方而不是简单相加',
          ],
        },
        {
          type: 'text',
          md: '打开散点图你会发现：几百个月的数据点不可能全部落在一条直线上。对每一个点，直线的预测和真实值之间都有一段差距：\n\n**Residual（残差）= Actual − Predicted**\n\nResidual 为正，说明真实通胀比直线预测的高（点在直线上方）；为负则相反。残差就是"这条直线在这个月犯的错"。',
        },
        {
          type: 'formula',
          lhs: 'Residual(t)',
          rhs: 'Actual(t) − Predicted(t)',
          note: '每个样本点都有自己的 Residual；一条好的直线应该让这些错误整体尽可能小。',
        },
        {
          type: 'text',
          md: '那"最好的直线"到底是哪一条？**OLS（Ordinary Least Squares，普通最小二乘法）**给出的标准是：把每个点的 Residual **平方**后加总（SSE，Sum of Squared Errors），选让 SSE 最小的那条直线。为什么要平方？\n\n1. 正负误差不会互相抵消：+2 和 −2 的平方都是 4，两个错误都被记账；\n2. 大错误的惩罚远大于小错误：误差 2 的平方是 4，误差 4 的平方是 16——OLS 特别"讨厌"离谱的预测。\n\nα = 1.408、β = 0.650 不是人工挑选的，正是 OLS 在 1953-01 → 2026-06 共 881 个月数据上算出的唯一最优解。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '残差',
              en: 'Residual',
              definition: '真实值减去模型预测值的差，衡量直线在某个样本点上犯的错。',
              example: '若某月真实 YoY 高于直线的预测，该月 Residual 为正。',
            },
            {
              zh: '普通最小二乘法',
              en: 'OLS (Ordinary Least Squares)',
              definition: '寻找让所有残差平方和最小的 α 和 β 的估计方法，是线性回归的标准解法。',
              example: 'Home 方程的 1.408 和 0.650 就是 OLS 在 881 个月样本上的解。',
            },
            {
              zh: '平方误差和',
              en: 'SSE (Sum of Squared Errors)',
              definition: '所有样本点残差的平方相加得到的总量，OLS 的最小化目标。',
              example: '在 Regression Playground 里拖动滑块，可以实时看到 SSE 的变化。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 17：一行代码完成 OLS',
          code: 'fitted = sm.OLS(\n    pair["target"],\n    sm.add_constant(pair["predictor"]),\n).fit()',
          note: 'statsmodels 的 `sm.OLS(...).fit()` 自动求出让 SSE 最小的 α（常数项）和 β。`add_constant` 就是在方程里加入截距 α。',
        },
        {
          type: 'widget',
          id: 'regressionPlayground',
          caption: '亲手拖动 α 和 β，看你的直线能不能打败 OLS——注意 SSE 怎么变化，再点"让 OLS 找最优"对答案',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'OLS 认为哪条直线是"最优直线"？',
            options: [
              {
                id: 'a',
                text: '穿过最多数据点的直线',
                correct: false,
                explanation: '错在标准：真实数据带噪声，任何直线能精确穿过的点都寥寥无几，"穿过多少点"不是可用的标准。正确思路：看所有点的整体误差，而不是数穿过几个点。',
              },
              {
                id: 'b',
                text: '让所有点的 Residual 平方和（SSE）最小的直线',
                correct: true,
                explanation: '正确！OLS = Ordinary Least Squares，"least squares" 就是"平方和最小"。平方保证正负误差不抵消，并对大错误加重惩罚。',
              },
              {
                id: 'c',
                text: '让所有 Residual 直接相加之后等于最大的直线',
                correct: false,
                explanation: '错在方向和方法：我们要的是误差"小"而不是"大"；而且残差直接相加会正负抵消——一条错得离谱的直线也可能残差之和接近 0。所以 OLS 先平方再求和。应复习 SSE 的定义。',
              },
            ],
            conceptReview: 'OLS 与 Residual、SSE 的关系',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '还原 OLS 的思路',
            instructions: '把"寻找最优直线"的 5 个步骤按逻辑顺序排好。',
            correctOrder: [
              '画出散点图：横轴 PPI YoY(t−1)，纵轴 Food at Home YoY(t)',
              '任选一条候选直线 y = α + β × x',
              '对每个数据点计算 Residual = Actual − Predicted',
              '把所有 Residual 平方后加总，得到 SSE',
              '调整 α 和 β 直到 SSE 最小——这组解就是 OLS 估计',
            ],
            feedbackCorrect: '思路完全正确！你刚刚在脑中跑了一遍 `sm.OLS(...).fit()` 内部做的事。',
            feedbackWrong: '按因果链想：先有数据（散点），才能试直线；有直线才能算每个点的误差；有误差才能平方求和；最后才是"调到最小"。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：什么是 Residual？OLS 为什么把残差平方之后再加总，而不是直接相加？',
            keywords: ['residual', '平方', '最小'],
            modelAnswer: 'Residual 是真实值减预测值，代表直线在某个点上犯的错。OLS 把每个 Residual 平方后加总得到 SSE，然后选 SSE 最小的直线。用平方有两个原因：一是正负误差不会互相抵消，二是大错误受到的惩罚比小错误重得多。Home 方程的 α=1.408、β=0.650 就是这样在 881 个月数据上算出来的。',
          },
        },
      ],
    },
    {
      id: 'm6-l3',
      moduleId: 'm6',
      title: 'Standard Error、P-value 与 HAC',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '把 Standard Error 理解为"估计值的晃动幅度"',
            '会正确解读 P-value（以及它不代表什么）',
            '知道为什么本项目用 HAC 标准误处理序列相关',
          ],
        },
        {
          type: 'text',
          md: 'OLS 告诉我们 β = 0.650，但这只是**估计值**——如果历史稍有不同、数据换一批，估计出的数字也会有些不同。统计学用两个数字描述估计的可靠程度：\n\n- **Standard Error（标准误，SE）**：如果反复重抽样本，估计值大约会晃动多少。SE 越小，估计越稳。Home baseline 的 β 估计是 0.650，HAC SE 只有 0.043——相对 0.650 非常小，说明这个斜率估计得相当稳。\n- **P-value（P 值）**：假设真实的 β 其实是 0（即 PPI 与食品通胀毫无关系），我们纯靠运气看到如此强关系的概率有多大。β 的 P-value 是 9.26e-52——一个小得难以想象的数，说明这层关系几乎不可能是巧合。',
        },
        {
          type: 'text',
          md: '为什么用 **HAC** 标准误，而不是普通标准误？月度通胀数据有**序列相关（Serial Correlation）**：这个月的误差往往和上个月的误差相关——通胀是有"惯性"的。普通 SE 假设各期误差相互独立，在这种数据上会**低估**不确定性、显得过度自信。**HAC（Heteroskedasticity and Autocorrelation Consistent）**标准误对异方差和自相关都做了修正，给出更诚实的不确定性估计。Notebook 用 `cov_type="HAC"`、`maxlags=12` 实现（对应最长 12 个月的误差相关）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '标准误',
              en: 'Standard Error (SE)',
              definition: '系数估计值的不确定性度量：换一批样本重新估计，数值大约会晃动多少。',
              example: 'Home baseline 的 β=0.650，HAC SE 仅 0.043，估计很稳。',
            },
            {
              zh: 'P 值',
              en: 'P-value',
              definition: '假设真实系数为 0 时，观察到当前这么强（或更强）关系的概率。越小越说明关系不是巧合。',
              example: 'Home baseline 中 β 的 P-value 为 9.26e-52。',
            },
            {
              zh: '序列相关',
              en: 'Serial Correlation',
              definition: '时间序列中相邻期的误差彼此相关的现象，会让普通标准误过于乐观。',
              example: '通胀有惯性：本月误差往往与上月误差同方向。',
            },
            {
              zh: 'HAC 标准误',
              en: 'HAC Standard Error',
              definition: '对异方差（Heteroskedasticity）与自相关（Autocorrelation）都稳健的标准误，适合时间序列回归。',
              example: 'Notebook 所有当前系数都配 HAC SE，maxlags 设为 12。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 21 / Cell 35：带 HAC 的回归与输出',
          code: 'model = sm.OLS(train["y"], x_train).fit(\n    cov_type="HAC", cov_kwds={"maxlags": 12}\n)',
          output: 'Home baseline (origin 2026-06):\n  const                1.408146   HAC SE 0.187304   P 5.56e-14\n  ppi_processed_foods  0.649634   HAC SE 0.042918   P 9.26e-52\n  n = 881, In-sample R² = 0.7146',
          note: '`cov_type="HAC"` 让每个系数都配上抗序列相关的标准误；`maxlags=12` 允许误差在最长 12 个月内相关。',
        },
        {
          type: 'table',
          headers: ['Term', 'Coefficient', 'HAC SE', 'P-value'],
          rows: [
            ['const（Alpha）', '1.408146', '0.187304', '5.56e-14'],
            ['ppi_processed_foods（Beta）', '0.649634', '0.042918', '9.26e-52'],
          ],
          note: 'Home baseline，estimated through 2026-06；训练样本 1953-01 → 2026-06 共 881 个月，In-sample R² 0.715（Cell 35）。',
        },
        {
          type: 'callout',
          variant: 'warn',
          title: 'P-value 极小 ≠ 预测一定准',
          md: 'P-value 只回答一个问题："这层关系是不是巧合？"它**不保证**样本外预测的精度。预测好不好，要看 Module 11 的 RMSE 和 OOS R²——统计显著（Statistical Significance）和预测能力是两回事。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'β 的 P-value = 9.26e-52，正确的解读是？',
            options: [
              {
                id: 'a',
                text: '模型预测的准确率高达 (1 − 9.26e-52)',
                correct: false,
                explanation: '错在概念：P-value 与预测准确率完全是两回事。它衡量的是"关系是否为巧合"，预测精度要看 RMSE 和 OOS R²（Module 11）。正确思路：从"假设 β=0"这个前提出发理解 P-value。',
              },
              {
                id: 'b',
                text: '如果真实的 β 是 0，纯靠运气看到这么强关系的概率是 9.26e-52——几乎不可能，所以关系不是巧合',
                correct: true,
                explanation: '正确！P-value 是"零假设（β=0）之下看到当前证据的概率"。这个数字小到 51 个零，说明 PPI 与食品通胀之间的关系在统计上极其扎实。',
              },
              {
                id: 'c',
                text: 'β 的真实值有 9.26e-52 的可能性等于 0.650',
                correct: false,
                explanation: '错在对象：P-value 不是"β 等于某个值的概率"，它是在"假设 β=0"的前提下看到当前数据的概率。经典统计里 β 是固定但未知的数，不谈"它等于 0.650 的概率"。应复习 P-value 的定义。',
              },
            ],
            conceptReview: 'P-value 的定义与常见误读',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '统计数字配含义',
            instructions: '把 Home baseline 输出里的每个数字或概念与它的含义配对。',
            pairs: [
              { left: 'Beta = 0.650', right: '上月 PPI 与本月食品通胀之间的估计斜率' },
              { left: 'HAC SE = 0.043', right: '斜率估计的晃动幅度，已修正序列相关' },
              { left: 'P-value = 9.26e-52', right: '若真实 β 为 0，看到这么强关系的概率' },
              { left: 'Serial Correlation', right: '相邻月份误差彼此相关，普通 SE 会因此过于自信' },
            ],
            feedbackCorrect: '全部正确！你已经能读懂回归输出表里最重要的一行数字了。',
            feedbackWrong: '分工记忆：β 说"关系多强"，SE 说"估计多稳"，P-value 说"是不是巧合"，HAC 负责在时间序列里把 SE 算得诚实。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '向队友解释：Standard Error 和 P-value 各自回答什么问题？为什么这个项目要用 HAC 标准误？',
            keywords: ['不确定', 'p-value', '序列相关'],
            modelAnswer: 'Standard Error 回答"估计值有多稳"：换一批样本，β 的估计大约晃动多少——Home 的 β=0.650、HAC SE 只有 0.043，很稳。P-value 回答"关系是不是巧合"：假设真实 β 为 0，看到这么强关系的概率——9.26e-52 几乎排除了巧合。因为月度通胀误差存在序列相关（通胀有惯性），普通 SE 会低估不确定性，所以 Notebook 用 HAC 标准误（maxlags=12）来修正。',
          },
        },
      ],
    },
    {
      id: 'm6-l4',
      moduleId: 'm6',
      title: 'Checkpoint · 用方程算出一个预测',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '把 Home 和 Away 两条 Primary 方程放在一起读懂',
            '亲手用方程算出 2026-07 的 Food at Home 预测',
            '记住两个警示：系数会随 origin 重估、In-sample R² ≠ 预测能力',
          ],
        },
        {
          type: 'text',
          md: '把两条 Primary 方程并排放好——这就是当前预测（origin 2026-06）的全部"发动机"：',
        },
        {
          type: 'formula',
          lhs: 'FoodAtHome(t)',
          rhs: '1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
          note: 'Home baseline：lag 1，训练样本 1953-01 → 2026-06（881 个月）。',
        },
        {
          type: 'formula',
          lhs: 'FoodAway(t)',
          rhs: '1.753 + 0.485 × WageGrowth(t−12)',
          note: 'Away legacy all-employee：lag 12，α=1.752964、β=0.485499。',
        },
        {
          type: 'text',
          md: '读方程时注意三件事：\n\n1. **Lag 藏在括号里**：Home 用 t−1（上月 PPI），Away 用 t−12（12 个月前的工资）。预测 2026-07 时，Away 需要的是 2025-07 的工资 YoY（3.3530）——这个数字早已公布。\n2. **系数不是永远不变的**：α=1.408、β=0.650 是站在 origin 2026-06 估计的结果。每移动一个 forecast origin，系数都会用当时可得的数据重新估计；被冻结的是变量与 lag（Module 5），历史回测中的系数不一定与当前方程相同。\n3. **In-sample R² ≠ 预测能力**：Home baseline 的 In-sample R² 是 0.715，表示方程解释了历史样本内约 71.5% 的波动——但这是"对着已有数据打分"。真正的考验是样本外表现（Module 11）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '样本内拟合优度',
              en: 'In-sample R²',
              definition: '方程在参与估计的历史数据上解释了多少比例的波动；数值高不代表样本外预测就好。',
              example: 'Home baseline 用 881 个月估计时 In-sample R² 为 0.715。',
            },
            {
              zh: '系数重估',
              en: 'Coefficient Re-estimation',
              definition: '每个 forecast origin 用截至当月的数据重新估计 α 和 β；变量与 lag 保持冻结。',
              example: '当前方程 α=1.408、β=0.650 是 origin 2026-06 的估计版本。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 35：两条当前方程的原始输出',
          code: 'display(current_equations)',
          output: 'food_at_home_cpi(t) = 1.408 + 0.650 × ppi_processed_foods(t−1)\nfood_away_cpi(t)    = 1.753 + 0.485 × wage_leisure_hospitality_all(t−12)\nEstimated_through: 2026-06',
          note: '把 2026-06 的 PPI YoY（1.6294）代入 Home 方程，得到 2026-07 预测 2.4667；把 2025-07 的工资 YoY（3.3530）代入 Away 方程，得到 2026-07 预测 3.3808——与 Primary 预测表逐位吻合。',
        },
        {
          type: 'chart',
          id: 'wageVsAwayCpi',
          caption: '工资 YoY（提前 12 个月）与 Food Away YoY 的走势对比——Away 方程背后的关系',
        },
        {
          type: 'quiz',
          quiz: {
            question: '用 Away 方程预测 2026-07 的 Food Away YoY，需要哪个月的工资数据？',
            options: [
              {
                id: 'a',
                text: '2025-07',
                correct: true,
                explanation: '正确！lag 12 意味着从预测月份往回数 12 个月：2026-07 − 12 个月 = 2025-07。该月工资 YoY（3.3530）早已公布，属于 Observed 数据。',
              },
              {
                id: 'b',
                text: '2026-06',
                correct: false,
                explanation: '错在混淆：2026-06 是 forecast origin（信息截止），也是 Home 方程 lag 1 所需的 PPI 月份，但 Away 用的是 lag 12。正确思路：所需月份 = 预测月份 − lag，即 2026-07 − 12 = 2025-07。',
              },
              {
                id: 'c',
                text: '2026-07',
                correct: false,
                explanation: '错在逻辑：2026-07 是被预测的月份本身。如果需要当月数据才能预测当月，模型就失去了"提前预知"的意义。lag 的存在正是为了只用过去的数据预测未来。应复习 Lag 与月份对应关系（Module 4）。',
              },
            ],
            conceptReview: 'Lag 与方程所需月份的对应（Forecast Month − Lag = Required Predictor Month）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手算出 2026-07 的 Home 预测',
            instructions: '2026-06 的 Processed Foods PPI YoY 是 1.6294。把它代入 Home 方程，算出 2026-07 的 Food at Home YoY 预测（保留 2 位小数）。',
            prompt: '1.408 + 0.650 × 1.6294 = ?',
            answer: 2.47,
            tolerance: 0.02,
            unit: '%',
            solution: '0.650 × 1.6294 ≈ 1.059，再加 1.408 得 ≈ 2.467。Notebook 用未取整系数（1.408146 + 0.649634 × 1.629435）算出的精确值是 2.4667，四舍五入 2.47%——正是 Primary 预测表中 2026-07 的 Food at Home 预测。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '假设队友只会加减乘除。请解释 Home 方程里 1.408 和 0.650 各是什么，以及 2026-07 的预测约 2.47% 是怎么一步步算出来的。',
            keywords: ['1.408', '0.650', 'ppi'],
            modelAnswer: '1.408 是截距：PPI 同比为 0 时模型给出的基准通胀水平。0.650 是斜率：上月 PPI YoY 每高 1 个百分点，预测就加 0.650 个百分点。预测 2026-07 时，取上一个月（2026-06）的 PPI YoY = 1.6294，计算 1.408 + 0.650 × 1.6294 ≈ 2.47%。注意这套系数是 origin 2026-06 的估计版本，换一个 origin 会用当时的数据重估。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经能读懂并亲手运行这台"预测发动机"了。Module 7 将把镜头拉远：9 个模型规范同台竞技，看看为什么最后站上 C 位的是这两条朴素的单变量方程。',
        },
      ],
    },
  ],
}
