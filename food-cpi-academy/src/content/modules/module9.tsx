import type { CourseModule } from '../../types'

/**
 * Module 9：未来 12 个月预测（全课程重点）
 * 当前 Forecast Origin 2026-06；Home 的 1 Observed + 11 Assumed；
 * Away 的 12 个月工资全部 Observed；Forecast Input Audit。
 * 全部数值出自 Notebook Cell 34–37（modelResults.ts 第 12、13 节）。
 */
export const module9: CourseModule = {
  id: 'm9',
  order: 9,
  title: 'Module 9 · 未来 12 个月预测',
  subtitle: '从 Origin 2026-06 出发，逐月生成 2026-07 到 2027-06 的预测',
  icon: '🔮',
  accent: 'amber',
  lessons: [
    {
      id: 'm9-l1',
      moduleId: 'm9',
      title: '当前 Origin：站在 2026-06 看未来 12 个月',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道当前的 Forecast Origin 是 2026-06，预测范围是 2026-07 到 2027-06',
            '理解 Horizon（预测期数）从 1 到 12 的编号方式',
            '记住两条当前主模型方程（系数在 origin 2026-06 重新估计）',
          ],
        },
        {
          type: 'text',
          md: '前面的模块都在"回测历史"——假装回到过去做预测，检验模型好不好。从这一课开始，我们做真正的事：**站在今天，预测未来 12 个月**。\n\n出发点叫 **Forecast Origin（预测起点）**。当前 origin 是 **2026-06**——这是最新一个 CPI 目标月（Latest common CPI target month）。从这里出发：\n\n- 第 1 个预测月是 **2026-07**，记作 Horizon = 1（h1）\n- 第 12 个预测月是 **2027-06**，记作 Horizon = 12（h12）\n\n每次预测前，回归系数都会用截至 origin 的**全部历史**重新估计（Expanding Window 的精神）：Home baseline 用 1953-01 到 2026-06 共 881 个观测；Away legacy 用 2008-03 到 2026-06 共 219 个观测。所以现在的 α 和 β 是"截至 2026-06 的最新版本"。',
        },
        {
          type: 'formula',
          lhs: 'FoodAtHome(t)',
          rhs: '1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
          note: 'Home baseline，系数 estimated through 2026-06（精确值 α=1.408146，β=0.649634）',
        },
        {
          type: 'formula',
          lhs: 'FoodAway(t)',
          rhs: '1.753 + 0.485 × WageGrowth(t−12)',
          note: 'Away legacy all-employee，系数 estimated through 2026-06（精确值 α=1.752964，β=0.485499）',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '预测起点',
              en: 'Forecast Origin',
              definition: '做预测时"站立的时间点"。只能使用这个时点及之前已经发布的数据。',
              example: '当前 origin 是 2026-06，因此 2026-06 及之前的数据可用，之后的都不可用。',
            },
            {
              zh: '预测期数',
              en: 'Forecast Horizon',
              definition: '预测月份距离 origin 有几个月。h1 表示往前 1 个月，h12 表示往前 12 个月。',
              example: '从 2026-06 出发，2026-09 是 h3，2027-06 是 h12。',
            },
            {
              zh: '信息截止',
              en: 'Information Cutoff',
              definition: '每个 predictor 序列在 origin 时点"最后一个已发布的月份"。晚于它的数据一律视为未知。',
              example: 'Processed Foods PPI 与工资序列的 cutoff 都是 2026-06。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 35：从当前 origin 生成预测',
          code: 'current_origin = latest_target_month  # 2026-06\ninformation_cutoffs = {\n    predictor: model_data[predictor].dropna().index.max()\n    for predictor in model_data.columns\n}\n\nforecast, audit, coefficients = forecast_from_origin(\n    model_data, name, model_specs[name], current_origin,\n    horizon=FORECAST_HORIZON,  # 12\n    information_cutoffs={p: information_cutoffs[p] for p in model_specs[name]["predictors"]},\n)',
          output: 'food_at_home_cpi(t) = 1.408 + 0.650 × ppi_processed_foods(t−1)   Estimated_through 2026-06\nfood_away_cpi(t)   = 1.753 + 0.485 × wage_leisure_hospitality_all(t−12)',
          note: '和历史回测用的是同一个 forecast_from_origin 引擎，只是 origin 换成了今天。它同时返回预测值、输入审计表（audit）和系数表。',
        },
        {
          type: 'chart',
          id: 'forecastFan',
          caption: '当前 12 个月 Primary 预测（终点 2027-06 为 3.02%）+ 经验 95% 区间 + Survey Sensitivity 情景（4.34%）',
        },
        {
          type: 'quiz',
          quiz: {
            question: '当前 Forecast Origin 是 2026-06。那么 Horizon = 3 对应的预测月份（Forecast Month）是哪个月？',
            options: [
              {
                id: 'a',
                text: '2026-09',
                correct: true,
                explanation: '正确！从 2026-06 往前数 3 个月：07 是 h1、08 是 h2、09 是 h3。Primary 对 2026-09 的 Total Food 预测约 2.99%。',
              },
              {
                id: 'b',
                text: '2026-03',
                correct: false,
                explanation: '错在方向：Horizon 是向未来数，不是向过去数。2026-03 在 origin 之前，是已经发生的历史。正确思路：origin 加 3 个月 = 2026-09。',
              },
              {
                id: 'c',
                text: '2027-06',
                correct: false,
                explanation: '错在数错了距离：2027-06 距离 2026-06 是 12 个月，对应 h12，不是 h3。h3 应该是 2026-06 加 3 = 2026-09。应复习 Forecast Horizon 的定义。',
              },
            ],
            conceptReview: '预测起点与预测期数（Forecast Origin & Horizon）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '月份配 Horizon',
            instructions: '当前 origin 是 2026-06。把每个 Forecast Month 与它的 Horizon 配对。',
            pairs: [
              { left: '2026-07', right: 'Horizon 1' },
              { left: '2026-12', right: 'Horizon 6' },
              { left: '2027-03', right: 'Horizon 9' },
              { left: '2027-06', right: 'Horizon 12' },
            ],
            feedbackCorrect: '全对！Horizon 就是"距离 origin 几个月"，简单但必须一秒反应出来——后面每一课都要用。',
            feedbackWrong: '数月份时从 origin 的下一个月开始：2026-07 是 h1，2026-08 是 h2……2027-06 正好是 h12。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话说清楚：当前预测的 origin 是哪个月？预测覆盖哪 12 个月？系数是用什么数据估计的？',
            keywords: ['origin', '2026-06', '12'],
            modelAnswer: '当前 Forecast Origin 是 2026-06（最新的 CPI 目标月）。从它出发预测 2026-07（h1）到 2027-06（h12）共 12 个月。两条方程的系数都用截至 2026-06 的全部历史重新估计：Home 是 1.408 + 0.650 × PPI(t−1)，Away 是 1.753 + 0.485 × Wage(t−12)。',
          },
        },
      ],
    },
    {
      id: 'm9-l2',
      moduleId: 'm9',
      title: 'Home 的月份映射：1 个 Observed + 11 个 Assumed',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '会为 Home 的每个预测月算出"需要哪个月的 PPI"（Required Predictor Month）',
            '理解为什么只有 2026-07 用 Observed PPI（1.6294），其余 11 个月用假设值 1.8790',
            '能解释为什么 Home 预测从第 2 个月起全是 2.6288——以及为什么这不是 bug',
          ],
        },
        {
          type: 'text',
          md: 'Home 模型是 **lag 1**：预测 t 月需要 t−1 月的 Processed Foods PPI YoY。逐月推一遍：\n\n- 预测 **2026-07**（h1）需要 **2026-06** 的 PPI——它在 origin 时已发布（cutoff 正是 2026-06），值为 **1.6294**。这是 **Observed（已观察）**。\n- 预测 **2026-08**（h2）需要 **2026-07** 的 PPI——站在 2026-06，这个数字**还不存在**！\n- 同理，h3 到 h12 需要 2026-08 到 2027-05 的 PPI，全都在未来。\n\n模型不编造未来数据，而是用一个透明的假设：**最新 3 个月 PPI YoY 的平均值**，当作所有未知未来月份的 PPI。这就是 **Assumed（假设值）**。',
        },
        {
          type: 'formula',
          lhs: 'AssumedPPI',
          rhs: '(2.1417 + 1.8658 + 1.6294) / 3 ≈ 1.8790',
          note: '三个数字分别是 2026-04、2026-05、2026-06 的 PPI YoY（精确值 2.141680、1.865835、1.629435，平均 1.878983）',
        },
        {
          type: 'formula',
          lhs: 'Home(2026-07)',
          rhs: '1.408146 + 0.649634 × 1.629435 ≈ 2.4667',
          note: 'h1：唯一用 Observed PPI 的月份',
        },
        {
          type: 'formula',
          lhs: 'Home(2026-08 … 2027-06)',
          rhs: '1.408146 + 0.649634 × 1.878983 ≈ 2.6288',
          note: 'h2 到 h12：同一个假设值 → 同一个预测',
        },
        {
          type: 'text',
          md: '**为什么从第 2 个月起 Home 预测全是 2.6288？**因为 α 和 β 是固定的（都在 origin 估计好了），而 h2 到 h12 代入的 PPI 值是同一个假设值 1.8790。同样的公式加上同样的输入，等于同样的输出。\n\n这不是 bug，而是**诚实**：模型没有假装知道未来 PPI 会怎么走，它说的是"如果 PPI 增速保持在最近 3 个月的平均水平，Home 通胀大约是 2.63%"。所以靠后的月份本质上是**基准情景（Baseline Scenario）**，而不是完全基于观测数据的预测——这正是 Notebook 六大限制中的第 3 条。',
        },
        {
          type: 'table',
          headers: ['Forecast Month', 'Horizon', '需要的 PPI 月份', '来源', 'PPI 值', 'Home 预测'],
          rows: [
            ['2026-07', 'h1', '2026-06', 'Observed', '1.6294', '2.4667'],
            ['2026-08', 'h2', '2026-07', 'Assumed', '1.8790', '2.6288'],
            ['2026-09', 'h3', '2026-08', 'Assumed', '1.8790', '2.6288'],
            ['……', '……', '……', 'Assumed', '1.8790', '2.6288'],
            ['2027-06', 'h12', '2027-05', 'Assumed', '1.8790', '2.6288'],
          ],
          note: 'Home baseline 的 12 行输入审计（Cell 35）：1 行 Observed + 11 行 Assumed。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '已观察值',
              en: 'Observed',
              definition: '在 information cutoff 之前已经正式发布的数据，可以直接使用。',
              example: '2026-06 的 PPI YoY = 1.6294，用于预测 2026-07。',
            },
            {
              zh: '假设值',
              en: 'Assumed',
              definition: '预测所需但尚未发布的数据，用一个明确声明的规则代替。本模型用最新 3 个月平均。',
              example: 'h2 到 h12 需要的未来 PPI 全部用 1.8790 代替。',
            },
            {
              zh: '基准情景',
              en: 'Baseline Scenario',
              definition: '基于"某个变量保持当前水平"这类假设做出的预测，而不是对该变量本身的预测。',
              example: 'Home 的 2.63% 是"PPI 保持最近 3 个月平均增速"情景下的结果。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 35 输出：Home baseline 的输入审计（前几行）',
          code: 'display(forecast_input_audit)',
          output: 'Model          Forecast_month  Horizon  Predictor_month_required  Input_source                       Predictor_value_used\nHome baseline  2026-07         1        2026-06                   Observed by information cutoff     1.629435\nHome baseline  2026-08         2        2026-07                   Latest 3-month average assumption  1.878983\nHome baseline  2026-09         3        2026-08                   Latest 3-month average assumption  1.878983\n（h4–h12 各行相同：Latest 3-month average assumption，1.878983）',
          note: '审计表把每个月"用了什么数、数从哪来"写得明明白白，会议上任何一个数字都能追溯。',
        },
        {
          type: 'callout',
          variant: 'warn',
          title: '会议红线',
          md: '绝对不能说"12 个月预测都基于 observed 数据"。对 Home 而言只有**第 1 个月**是 Observed，后 11 个月建立在 3 个月平均假设之上。诚实说出这一点反而加分——这说明你清楚模型的边界。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么 Home 的预测从 2026-08 到 2027-06 每个月都是同一个数 2.6288？',
            options: [
              {
                id: 'a',
                text: '因为模型出了 bug，忘记更新预测值',
                correct: false,
                explanation: '错在定性：这是设计使然，不是错误。正确思路：h2 到 h12 需要的 PPI 都在未来、都不可得，于是统一用同一个假设值 1.8790；固定的 α、β 加上相同输入自然得到相同输出。',
              },
              {
                id: 'b',
                text: '因为 h2 到 h12 代入的都是同一个假设值 1.8790，α 和 β 又不变，所以输出相同',
                correct: true,
                explanation: '正确！公式是 1.408146 + 0.649634 × PPI。h2 起 PPI 一律取最新 3 个月平均 1.8790，所以预测一律是 2.6288。这是 baseline scenario 的诚实表达。',
              },
              {
                id: 'c',
                text: '因为家庭食品价格未来 11 个月真的不会变化',
                correct: false,
                explanation: '错在把模型输出当成现实断言：模型并没有说未来不变，它说的是"在 PPI 保持近期平均增速的情景下"预测值不变。真实通胀几乎肯定会波动——这正是要配合经验区间来看的原因。应复习 Baseline Scenario。',
              },
            ],
            conceptReview: '假设值与基准情景（Assumed Input & Baseline Scenario）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手算出那个假设值',
            instructions: '未来月份的 PPI 用最新 3 个月 YoY 的平均。请用 2026-04、2026-05、2026-06 的值算出它（保留 4 位小数）。',
            prompt: '(2.1417 + 1.8658 + 1.6294) / 3 =',
            answer: 1.879,
            tolerance: 0.002,
            unit: '%',
            solution: '三数相加 = 5.6369，除以 3 ≈ 1.8790。Notebook 精确值为 (2.141680 + 1.865835 + 1.629435) / 3 = 1.878983，这就是 h2 到 h12 全部代入的 Assumed PPI。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '假设会议上被问："Which PPI value produces the July 2026 forecast? And what about the later months?" 用自己的话（中文即可）组织答案。',
            keywords: ['1.6294', 'observed', '平均', '假设'],
            modelAnswer: '2026-07 的预测用的是 2026-06 已发布的 Observed PPI YoY = 1.6294，代入 1.408 + 0.650 × 1.6294 ≈ 2.47。从 2026-08 起需要的 PPI 尚未发布，统一用最新 3 个月平均 1.8790 作为假设值，得到 2.63。因此后 11 个月是基准情景，不是完全基于观测数据的预测。',
          },
        },
      ],
    },
    {
      id: 'm9-l3',
      moduleId: 'm9',
      title: 'Away 的月份映射：12 个月工资全部 Observed',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '会为 Away 的每个预测月算出需要哪个月的工资数据（t−12）',
            '确认 12 个所需工资月份（2025-07 到 2026-06）在 origin 时全部已发布',
            '能解释为什么 Away 预测每个月都不同，而 Home 从第 2 个月起恒定',
          ],
        },
        {
          type: 'text',
          md: 'Away 模型是 **lag 12**：预测 t 月需要 t−12 月的休闲酒店业全体员工工资增速（L&H AHE YoY）。再逐月推一遍：\n\n- 预测 **2026-07** 需要 **2025-07** 的工资——一年前的数据，早就发布了。\n- 预测 **2027-06**（最远的 h12）需要 **2026-06** 的工资——恰好就是 cutoff 当月，也已发布。\n\n12 个所需月份正好落在 **2025-07 到 2026-06** 这一年里，全部不晚于 information cutoff（2026-06）。所以 Away 的 12 个月预测**不需要任何假设值**——这是 lag 12 模型一个实实在在的操作优势：整整一年的预测都建立在已观察数据上。',
        },
        {
          type: 'table',
          headers: ['Forecast Month', '需要的工资月份 (t−12)', '工资 YoY（Observed）', 'Away 预测'],
          rows: [
            ['2026-07', '2025-07', '3.3530', '3.3808'],
            ['2026-08', '2025-08', '3.5230', '3.4634'],
            ['2026-09', '2025-09', '3.6970', '3.5479'],
            ['2026-10', '2025-10', '3.4157', '3.4113'],
            ['2026-11', '2025-11', '3.7153', '3.5567'],
            ['2026-12', '2025-12', '3.7021', '3.5503'],
            ['2027-01', '2026-01', '3.5556', '3.4792'],
            ['2027-02', '2026-02', '3.6315', '3.5161'],
            ['2027-03', '2026-03', '3.2556', '3.3336'],
            ['2027-04', '2026-04', '3.6580', '3.5289'],
            ['2027-05', '2026-05', '3.9683', '3.6795'],
            ['2027-06', '2026-06', '3.8698', '3.6318'],
          ],
          note: 'Away legacy 的 12 行输入审计（Cell 35）：Input_source 全部为 Observed by information cutoff。预测 = 1.752964 + 0.485499 × 工资值。',
        },
        {
          type: 'text',
          md: '看出与 Home 的关键差别了吗？**Away 每个月的预测都不一样**：从 h1 的 3.38 一路到 h12 的 3.63，中间还有起伏（最低 3.33，最高 3.68）。\n\n原因很简单：每个预测月代入的是**不同月份的真实工资值**，而 2025-07 到 2026-06 的工资增速本身在 3.26 到 3.97 之间波动。真实数据逐月不同，预测自然逐月不同。\n\n对比记忆：**Home 恒定是因为输入恒定（同一个假设值）；Away 逐月变化是因为输入逐月变化（12 个不同的观测值）**。同一套机制，两种输入，两种形态。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '滞后 12 个月',
              en: 'Lag 12',
              definition: '预测 t 月使用 t−12 月的 predictor 值。滞后期越长，未来预测中能用上的已发布数据越多。',
              example: '预测 2027-06 只需要 2026-06 的工资，在 origin 时已经发布。',
            },
            {
              zh: '延续性模型',
              en: 'Legacy Model',
              definition: '保留自项目早期版本的模型，为了结果的连续性与可比性而继续作为 Primary 使用。',
              example: 'Away legacy all-employee（工资 lag 12）就是这样保留下来的主模型。',
            },
            {
              zh: '全体员工工资',
              en: 'L&H AHE: All Employees (CES7000000003)',
              definition: '休闲与酒店业全体员工平均时薪，2006 年起有数据，是 Away 的 Primary Predictor。',
              example: '2026-06 的 YoY 为 3.8698，驱动 2027-06 的 Away 预测 3.63。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 35：information cutoff 决定 Observed 还是 Assumed',
          code: 'information_cutoffs = {\n    predictor: model_data[predictor].dropna().index.max()\n    for predictor in model_data.columns\n}\n# wage_leisure_hospitality_all 的 cutoff = 2026-06',
          output: 'Away legacy all-employee 的 12 行审计：\nPredictor_month_required 从 2025-07 到 2026-06，全部 ≤ 2026-06\nInput_source 全部为 "Observed by information cutoff"',
          note: '判断规则完全机械：所需月份 ≤ cutoff 就标 Observed，否则标 Assumed。Away 的 12 个所需月份全部通过。',
        },
        {
          type: 'chart',
          id: 'wageVsAwayCpi',
          caption: '工资 YoY（滞后 12 个月）与 Food Away YoY：工资一年前的波动，映射成 Away 未来一年逐月不同的预测',
        },
        {
          type: 'quiz',
          quiz: {
            question: '预测 2027-01 的 Food Away from Home 时，代入方程的是哪个月的工资数据？',
            options: [
              {
                id: 'a',
                text: '2026-01 的工资（YoY 3.5556）',
                correct: true,
                explanation: '正确！lag 12 意味着 2027-01 减去 12 个月 = 2026-01。该月工资 YoY 为 3.5556，代入 1.753 + 0.485 × 3.5556 得到 Away 预测约 3.48。',
              },
              {
                id: 'b',
                text: '2027-01 当月的工资',
                correct: false,
                explanation: '错在忘了 lag：模型用的是 t−12 的工资，不是 t 当月的。而且 2027-01 的工资在 origin 2026-06 时根本不存在。正确思路：从 forecast month 往回数 12 个月。',
              },
              {
                id: 'c',
                text: '2025-07 的工资（YoY 3.3530）',
                correct: false,
                explanation: '错在配错了行：2025-07 是预测 2026-07（h1）所需的工资月份。2027-01 是 h7，对应 2026-01。每个 forecast month 都有自己专属的 required predictor month，不能混用。应复习 Predictor Month Mapping。',
              },
            ],
            conceptReview: '滞后与月份映射（Lag 12 & Required Predictor Month）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手算出 2027-06 的 Away 预测',
            instructions: '预测 2027-06 需要 2026-06 的工资 YoY = 3.8698。用 Away 方程算出预测值（保留 2 位小数）。',
            prompt: '1.753 + 0.485 × 3.8698 =',
            answer: 3.63,
            tolerance: 0.02,
            unit: '%',
            solution: '0.485 × 3.8698 ≈ 1.877，加上 1.753 ≈ 3.63。Notebook 精确计算为 1.752964 + 0.485499 × 3.869833 = 3.631765——这正是 h12 的 Away 预测，也是组合出 3.02% 的两个原料之一。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：为什么 Away 的 12 个月预测每月都不同，而 Home 从第 2 个月起完全相同？',
            keywords: ['工资', '12', 'observed', '不同'],
            modelAnswer: 'Away 是 lag 12：每个预测月代入的是一年前那个月的真实工资值，2025-07 到 2026-06 的工资 YoY 全部已发布（Observed）且逐月波动，所以 12 个预测逐月不同（3.38 到 3.63）。Home 是 lag 1：只有第 1 个月能用已发布的 PPI（1.6294），后 11 个月只能用同一个 3 个月平均假设值 1.8790，输入相同所以预测都等于 2.6288。',
          },
        },
      ],
    },
    {
      id: 'm9-l4',
      moduleId: 'm9',
      title: 'Checkpoint · Forecast Input Audit：审计每一个数字',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解每个预测月都有自己的 Forecast Month、Required Predictor Month 和 Forecast Calculation——不是一个数字复制 12 次',
            '会读 Forecast Input Audit 表，说出 Primary 模型 24 行中 Observed 与 Assumed 的分布',
            '能当场追溯任意一个月的预测是怎么算出来的',
          ],
        },
        {
          type: 'text',
          md: '把前两课合起来，就是本模块最重要的一句话：**12 个月预测不是"算一次然后复制 12 份"，而是 12 次独立的计算**。每个月都有：\n\n1. 自己的 **Forecast Month** 和 **Horizon**（2026-07 是 h1……2027-06 是 h12）\n2. 自己的 **Required Predictor Month**（Home 是 t−1，Away 是 t−12）\n3. 自己的 **Observed / Assumed 判定**（所需月份是否不晚于 cutoff）\n4. 自己的 **Forecast Calculation**（α + β × 该月的 predictor 值）\n\nNotebook 用一张 **Forecast Input Audit（预测输入审计表）** 把这一切摊开：Primary 两个模型各 12 行、共 **24 行**。其中 **Observed 13 行**（Home 1 行 + Away 12 行），**Assumed 11 行**（Home 的 h2 到 h12）。加上两个 survey 敏感性模型，完整审计表共 72 行。\n\n会议上如果被问 "Are all twelve months based on observed predictor data?"，答案就在这张表里：**No**——Away 的 12 个月是，Home 只有第 1 个月是。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '预测输入审计表',
              en: 'Forecast Input Audit',
              definition: '逐行列出每个预测月使用的 predictor、滞后、所需月份、信息截止、来源（Observed/Assumed）和数值的表格，让每个预测都可追溯。',
              example: 'Cell 35 生成的 72 行审计表；Primary 部分为 24 行。',
            },
            {
              zh: '所需指标月份',
              en: 'Required Predictor Month',
              definition: '某个预测月按照 lag 规则倒推出来的、方程需要代入的那个 predictor 月份（forecast month 减去 lag）。',
              example: '预测 2027-03（Away）需要 2026-03 的工资；预测 2026-09（Home）需要 2026-08 的 PPI。',
            },
          ],
        },
        {
          type: 'widget',
          id: 'forecastAudit',
          caption: '亲手审计：切换模型、逐行展开，看每个月的预测由哪个数字、哪条算式产生',
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 35 输出：完整审计表',
          code: 'forecast_input_audit = pd.concat(current_audits.values(), ignore_index=True)\ndisplay(forecast_input_audit)',
          output: '[72 rows x 10 columns]\n列：Model / Forecast_origin / Forecast_month / Horizon_months / Predictor /\n    Lag_months / Predictor_month_required / Information_cutoff / Input_source / Predictor_value_used\n例：Home baseline · 2026-07 · h1 · ppi_processed_foods · lag 1 · 需要 2026-06 · Observed · 1.629435',
          note: '4 个模型（Home/Away 的 baseline 与 survey expanded）各自的审计拼接成 72 行。Primary 只看前两个模型的 24 行。',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '一行的完整生命周期',
          md: '以 Home h1 为例走完全程：Forecast Month = 2026-07 → lag 1 → Required Predictor Month = 2026-06 → 不晚于 cutoff（2026-06）→ **Observed** → 取值 1.629435 → 计算 1.408146 + 0.649634 × 1.629435 = **2.4667**。任何一行都能这样从头讲到尾——这就是"可追溯"的含义。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Primary 预测（Home baseline + Away legacy，共 24 行审计）中，predictor 来源的正确分布是？',
            options: [
              {
                id: 'a',
                text: '24 行全部是 Observed，因为预测必须基于真实数据',
                correct: false,
                explanation: '错在想当然：Home 是 lag 1，h2 到 h12 需要的 PPI 在 origin 时还没发布，只能用 3 个月平均假设值。声称"全部 observed"正是会议上最不能犯的错误。正确分布是 13 Observed + 11 Assumed。',
              },
              {
                id: 'b',
                text: 'Observed 13 行（Home 1 + Away 12），Assumed 11 行（Home 的 h2 到 h12）',
                correct: true,
                explanation: '正确！Away 因为 lag 12，所需工资月份（2025-07 到 2026-06）全部已发布；Home 因为 lag 1，只有 h1 所需的 2026-06 PPI 已发布，后 11 个月用假设值 1.8790。',
              },
              {
                id: 'c',
                text: 'Observed 12 行（全在 Home），Assumed 12 行（全在 Away）',
                correct: false,
                explanation: '错在正好搞反了：lag 越长，未来预测能用的已发布数据越多。是 Away（lag 12）12 行全部 Observed，Home（lag 1）只有 1 行 Observed。应复习 lag 与月份映射的关系。',
              },
            ],
            conceptReview: 'Observed 与 Assumed 的分布（Forecast Input Audit）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '一个预测月的诞生',
            instructions: '把"生成某一个月预测"的 5 个步骤按正确顺序排列（以 Home 预测 2026-09 为例）。',
            correctOrder: [
              '确定 Forecast Month 与 Horizon（2026-09，h3）',
              '按 lag 倒推 Required Predictor Month（lag 1 → 2026-08）',
              '与 Information Cutoff 比较，判定 Observed 还是 Assumed（2026-08 晚于 2026-06 → Assumed）',
              '取 Predictor 值（假设值 1.8790）',
              '代入方程 α + β × 值，得到该月预测（1.408 + 0.650 × 1.8790 ≈ 2.6288）',
            ],
            feedbackCorrect: '完美！这 5 步对 24 行 Primary 审计中的每一行都成立——换的只是月份、lag 和数值。',
            feedbackWrong: '想想依赖关系：先知道要预测哪个月，才能倒推需要哪个月的数据；先判定数据可不可得，才能决定取观测值还是假设值；最后才轮到代入方程。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '会议模拟："How exactly do you produce the 12-month forecast?" 请用自己的话完整回答（覆盖两个模型、Observed/Assumed 的区别、以及为什么是 12 次计算而非复制）。',
            keywords: ['predictor', 'horizon', 'observed', 'assumed'],
            modelAnswer: '从 origin 2026-06 出发，对 h1 到 h12 逐月计算：每个月先按 lag 倒推所需 predictor 月份，再和 information cutoff 比较决定用 Observed 还是 Assumed 值，最后代入当前方程。Home（lag 1）只有 h1 用 Observed PPI 1.6294，其余 11 个月用 3 个月平均假设 1.8790，所以 h2 起恒为 2.63；Away（lag 12）12 个月工资全部 Observed，预测逐月不同（3.38 到 3.63）。这是 12 次独立计算，Forecast Input Audit 逐行记录了每一次。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经掌握了本课程最核心的一块拼图：当前 12 个月预测的完整生产过程。下一模块把 Home 和 Away 组合成 Total Food CPI，得到最终的 3.02%。',
        },
      ],
    },
  ],
}
