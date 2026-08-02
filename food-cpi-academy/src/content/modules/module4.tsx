import type { CourseModule } from '../../types'

/**
 * Module 4：Leading Indicator 与 Lag
 * 领先指标的直觉、lag 1 / lag 12 的精确含义、
 * ≤1999-12 样本上的 0–12 lag 扫描（Training R² 选择）、
 * Correlation ≠ Causation。
 * 数值出处：Notebook Cell 16 / 17 / 35 与 modelResults.ts
 * （homeBestLags / awayBestLags / auditHomeBaseline / auditAwayLegacy）。
 */
export const module4: CourseModule = {
  id: 'm4',
  order: 4,
  title: 'Module 4 · Leading Indicator 与 Lag',
  subtitle: '找到先动的那条线，并确定它领先几个月',
  icon: '🎯',
  accent: 'amber',
  lessons: [
    {
      id: 'm4-l1',
      moduleId: 'm4',
      title: '领先指标：先动的那条线',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '用生活比喻理解领先指标（Leading Indicator）',
            '认识项目里的两条传导链：PPI → Food at Home，工资 → Food Away',
            '知道 shift(lag) 在代码里如何实现"看过去"',
          ],
        },
        {
          type: 'text',
          md: '想象一家面包店。**面粉批发价今天涨了**，面包会立刻涨价吗？通常不会——店里还有之前买的库存，采购合同是按旧价签的，重新印菜单也要成本。等这些缓冲耗尽，**几个月后**面包才涨价。\n\n面粉价格就是面包价格的**领先指标（Leading Indicator）**：它先动，下游价格后动。这个"先后"来自真实的经济过程——成本从上游**传导（Pass-through）**到下游需要时间。\n\n领先指标对预测者是黄金：当你要预测下游价格时，**上游的数据你已经拿在手里了**。',
        },
        {
          type: 'text',
          md: '本项目正是沿着两条传导链找 predictor：\n\n- **供应链成本链**：Processed Foods PPI（食品生产端出厂价，WPU02）先动 → 超市货架价跟进 → **Food at Home CPI**\n- **劳动力成本链**：休闲酒店业（L&H）工资先动 → 餐厅人力成本上升 → 菜单价跟进 → **Food Away from Home CPI**\n\n这与 Module 1 的分工完全呼应：超市食品由供应链成本驱动，外出就餐由劳动力成本驱动。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '领先指标',
              en: 'Leading Indicator',
              definition: '比目标变量先发生变动的序列。预测时它的数值往往已经公布，可以直接使用。',
              example: 'Processed Foods PPI 是 Food at Home CPI 的领先指标。',
            },
            {
              zh: '成本传导',
              en: 'Pass-through',
              definition: '上游成本变化经过库存、合同、定价决策等环节，逐步反映到下游零售价的过程。传导需要时间，这正是 lag 的经济来源。',
              example: '面粉涨价几个月后，面包店才更新菜单价格。',
            },
            {
              zh: '预测变量',
              en: 'Predictor',
              definition: '回归方程右边、用来预测目标的变量。本项目的 predictor 都是领先指标。',
              example: 'Home 模型的 predictor 是 WPU02 的 YoY；Away 模型的是 L&H 工资的 YoY。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'ppiVsHomeCpi',
          caption: 'WPU02 YoY（lag 1）与 Food at Home CPI YoY：生产端价格先动，超市价格跟进——两条线的起伏高度相似。',
        },
        {
          type: 'notebook',
          title: 'Cell 17：代码里的"看过去"——shift(lag)',
          code: 'pair = pd.DataFrame({\n    "target": frame[target],\n    "predictor": frame[predictor].shift(lag),\n}).loc[:sample_end].dropna()',
          output: 'shift(lag) 之后，同一行里：target 是 t 月的 CPI YoY，predictor 是 t−lag 月的指标值。',
          note: 'shift(lag) 把 predictor 整条序列往后移 lag 个月，于是"今天的 CPI"与"lag 个月前的 predictor"对齐在同一行——回归读的就是这张对齐后的表。这正是 Module 3 苦心维护完整月历的回报。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么 Processed Foods PPI 能当 Food at Home CPI 的领先指标？',
            options: [
              {
                id: 'a',
                text: '因为 PPI 的数据质量比 CPI 更高',
                correct: false,
                explanation: '错在理由：两者都是官方统计，谈不上谁"质量更高"。领先指标的资格来自时间顺序和传导机制，不是数据质量。正确思路：想想成本从生产端到货架要经历什么。',
              },
              {
                id: 'b',
                text: '因为生产端成本先涨，经过库存、合同、定价环节，几个月后才传导到超市零售价',
                correct: true,
                explanation: '正确！这就是 Pass-through 机制：上游先动、下游后动。预测下游时，上游的数据已经在手里——这是领先指标的全部价值。',
              },
              {
                id: 'c',
                text: '因为 PPI 和 CPI 本质上是同一个指数的两个名字',
                correct: false,
                explanation: '错在事实：PPI 衡量生产者出厂价，CPI 衡量消费者零售价，是供应链上不同环节的两个指数。正是因为它们不同、且有先后传导关系，PPI 才能"领先"CPI。',
              },
            ],
            conceptReview: '领先指标（Leading Indicator）与成本传导（Pass-through）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '把传导链连起来',
            instructions: '把每个"先动的原因"和它引发的"后动结果"配对。',
            pairs: [
              { left: '面粉批发价上涨', right: '几个月后面包店更新菜单价（比喻）' },
              { left: 'Processed Foods PPI 上涨', right: '之后 Food at Home CPI 走高' },
              { left: 'L&H 工资增速上升', right: '之后 Food Away CPI 走高' },
            ],
            feedbackCorrect: '正确！三条链是同一个逻辑：成本先动，售价后动，中间隔着传导时间——这就是 lag。',
            feedbackWrong: '回到两条传导链：供应链成本（PPI）驱动超市食品（Food at Home），劳动力成本（工资）驱动外出就餐（Food Away）。面粉与面包只是它们的生活版比喻。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用你自己的比喻（不要用面包店）解释什么是领先指标，以及为什么会存在 lag。',
            keywords: ['领先', '传导', 'lag'],
            modelAnswer: '例如：上游电池涨价，电动车厂几个月后才提高售价——电池价格就是车价的领先指标。因为成本传导要经过库存消化、合同到期、定价会议等环节，所以下游变化滞后于上游，这个时间差就是 lag。预测下游时，上游数据已经公布，可以直接拿来用。',
          },
        },
      ],
    },
    {
      id: 'm4-l2',
      moduleId: 'm4',
      title: 'lag 1 和 lag 12 到底在说什么',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '会读 lag k：预测 t 月，用 t−k 月的 predictor',
            '记住关键例子：Food Away 预测 2026-07 用的是 2025-07 的工资',
            '理解 lag 12 的意外好处：未来 12 个月所需的工资数据已全部公布',
          ],
        },
        {
          type: 'text',
          md: '**lag k 的定义**：预测 t 月的目标，用 t−k 月的 predictor 数值。两个主模型的 lag 完全不同：\n\n- **Home 模型 lag 1**：预测 2026-07 的 Food at Home，用 **2026-06** 的 PPI YoY（1.6294，已发布）\n- **Away 模型 lag 12**：预测 2026-07 的 Food Away，用 **2025-07** 的工资 YoY（3.3530，早就发布了）\n\nlag 12 有一个漂亮的推论：当前 origin 是 2026-06，要预测 2026-07 到 2027-06 共 12 个月，所需的工资月份是 2025-07 到 2026-06——**这 12 个月的工资全部已经公布**。Away 模型的整个 12 个月预测不需要任何假设值。\n\nHome 模型 lag 1 就没这么幸运：只有第 1 个月（2026-07 ← 2026-06 的 PPI）用的是观测值；从 2026-08 起，所需的 PPI 月份（2026-07 及以后）还没发布，Notebook 用最新 3 个月 PPI YoY 的平均值 **1.8790** 作为假设（Module 9 详讲）。',
        },
        {
          type: 'formula',
          lhs: 'FoodAtHome(t)',
          rhs: '1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
          note: 't−1：用上个月的 PPI YoY 预测这个月的家庭食品通胀。',
        },
        {
          type: 'formula',
          lhs: 'FoodAway(t)',
          rhs: '1.753 + 0.485 × WageGrowth(t−12)',
          note: 't−12：用 12 个月前的 L&H 全体员工工资 YoY 预测这个月的外出就餐通胀。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '滞后月数',
              en: 'Lag',
              definition: 'predictor 领先目标的月数 k：预测 t 月用 t−k 月的 predictor。',
              example: 'Home 模型 lag 1，Away 模型 lag 12。',
            },
            {
              zh: '所需预测变量月份',
              en: 'Required Predictor Month',
              definition: '某个预测月所需要的 predictor 数据对应的月份，等于预测月往回数 lag 个月。',
              example: 'Away 预测 2027-06，required predictor month 是 2026-06。',
            },
            {
              zh: '信息截止点',
              en: 'Information Cutoff',
              definition: '做预测时该 predictor 已发布数据的最新月份。所需月份不超过截止点 = 观测值；超过 = 需要假设。',
              example: 'PPI 的信息截止点是 2026-06，所以 2026-08 之后的 Home 预测要用假设的 PPI。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'wageVsAwayCpi',
          caption: 'L&H 工资 YoY（lag 12）与 Food Away CPI YoY：工资的起伏约一年后出现在餐饮价格里。',
        },
        {
          type: 'table',
          headers: ['预测月份', '模型（lag）', '所需 predictor 月份', '观测还是假设？'],
          rows: [
            ['2026-07', 'Home（PPI，lag 1）', '2026-06', '观测值 1.6294'],
            ['2026-08', 'Home（PPI，lag 1）', '2026-07', '未发布 → 假设值 1.8790'],
            ['2026-07', 'Away（工资，lag 12）', '2025-07', '观测值 3.3530'],
            ['2027-06', 'Away（工资，lag 12）', '2026-06', '观测值 3.8698'],
          ],
          note: '数字出自 Notebook Cell 35 的 Forecast Input Audit。Away 的 12 个所需工资月份（2025-07 → 2026-06）全部是观测值；Home 只有第一个月是观测值。',
        },
        {
          type: 'notebook',
          title: 'Cell 35：Forecast Input Audit 回答"每个预测月到底用了哪个数据"',
          code: 'information_cutoffs = {\n    predictor: model_data[predictor].dropna().index.max()\n    for predictor in model_data.columns\n}',
          output: 'Audit 表示例行：\nAway legacy · Forecast 2026-07 · lag 12 → required month 2025-07 · observed · 3.352968\nHome baseline · Forecast 2026-08 · lag 1 → required month 2026-07 · assumed · 1.878983',
          note: '每个 predictor 先算出自己的信息截止点（最新已发布月份），再逐个预测月检查：所需月份 ≤ 截止点就是 observed，否则是 assumed。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '要预测 Food Away 2026-07 的 YoY，Away 模型（lag 12）用的是哪个月的工资数据？',
            options: [
              {
                id: 'a',
                text: '2026-06 的工资',
                correct: false,
                explanation: '错在 lag 的读法：2026-07 往回数 1 个月才是 2026-06，那是 lag 1 的算法。Away 模型是 lag 12，要往回数 12 个月。顺带一提：2026-06 的工资要等到预测 2027-06 时才登场。',
              },
              {
                id: 'b',
                text: '2025-07 的工资',
                correct: true,
                explanation: '正确！lag 12 = 从预测月 2026-07 往回数 12 个月 = 2025-07。该月工资 YoY 是 3.352968，早已发布（observed）——这正是 Cell 35 Audit 表第一行的内容。',
              },
              {
                id: 'c',
                text: '2026-07 的工资',
                correct: false,
                explanation: '错在方向：2026-07 是预测月本身，用它等于 lag 0——而且这个月的工资在 origin 2026-06 时根本还没发布。正确思路：lag 12 = 预测月往回数 12 个月，即 2025-07。',
              },
            ],
            conceptReview: 'Lag 的含义与 Required Predictor Month',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: 'Predictor Month Mapping',
            instructions: '把每个预测任务和它所需的 predictor 月份配对（Home lag 1，Away lag 12）。',
            pairs: [
              { left: 'Away 预测 2026-07', right: '2025-07 的工资 YoY' },
              { left: 'Away 预测 2026-12', right: '2025-12 的工资 YoY' },
              { left: 'Away 预测 2027-06', right: '2026-06 的工资 YoY' },
              { left: 'Home 预测 2026-07', right: '2026-06 的 PPI YoY' },
            ],
            feedbackCorrect: '全对！规则只有一条：预测月往回数 lag 个月。Away 数 12 个月，Home 数 1 个月。',
            feedbackWrong: '用手指在日历上数：Away 是 lag 12，从预测月往回退整整一年（2026-07 → 2025-07，2027-06 → 2026-06）；Home 是 lag 1，只退一个月（2026-07 → 2026-06）。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '解释给面试官听：为什么 Away 模型的 lag 12 意味着它未来 12 个月的预测全部基于已观测的工资数据？',
            keywords: ['12', '工资', '2025'],
            modelAnswer: '当前 origin 是 2026-06，预测范围是 2026-07 到 2027-06。lag 12 意味着每个预测月用 12 个月前的工资：所需的工资月份是 2025-07 到 2026-06。而截至 origin，这 12 个月的工资数据早已全部发布，所以 Away 的 12 个月预测不需要任何假设值——这一点 Home 模型（lag 1）做不到，它只有第一个月用观测的 PPI。',
          },
        },
      ],
    },
    {
      id: 'm4-l3',
      moduleId: 'm4',
      title: '0–12 扫描：让 1999 年以前的数据替你选 lag',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解 lag 扫描的流程：0–12 逐一试、只用 ≤1999-12 数据、按 Training R² 选最优',
            '记住核心结果：WPU02 最优 lag = 1，Training R² = 0.769',
            '分清哪些 lag 来自扫描、哪个 lag（Away 的 12）来自 legacy 模型',
          ],
        },
        {
          type: 'text',
          md: 'lag 到底该是几？不能拍脑袋，也不能"看哪个 lag 让最终测试分数最高就选哪个"（那是作弊，Module 5 详讲）。Notebook 的做法（Cell 17）：\n\n1. 对每个候选 predictor，把 lag 从 **0 到 12** 全部试一遍\n2. 每个 lag 跑一个小回归（OLS），**只用 1999-12 及以前**的数据，样本至少 60 个月\n3. 记录每个 lag 的 **Training R²**——回归在训练样本内的拟合优度（0 到 1，越高说明这条直线解释了目标越多的波动）\n4. 每个 predictor 取 R² 最高的那个 lag，**冻结**，之后不再改',
        },
        {
          type: 'text',
          md: '扫描结果（Home 方向）：**WPU02 的最优 lag 是 1，Training R² = 0.769**，β = 0.690——这就是 Home baseline "lag 1" 的全部来历。\n\n两个值得注意的细节：\n\n- 扫描表第一名其实是 Finished Consumer Foods PPI（lag 1，R² = 0.875）。它被保留为下游 PPI 候选；主基准使用的是 direct national food PPI——WPU02。Cell 18 说明了主规格的原则：**刻意保持精简**，把所有高相关的食品指数塞进一个方程会造成 Multicollinearity 和 Overfitting（Module 7 详讲）\n- **Away Primary 的 lag 12 不是这次扫描选出来的**：它用的全体员工工资序列 2006 年才开始，在 ≤1999 的扫描样本里根本不存在。lag 12 来自旧版 legacy 模型，保留是为了延续性——顺便让 12 个月预测全部用上已观测工资（上一课）。扫描表里的 production 工资（1964 年起）最优 lag 是 2（R² = 0.476），用于 Long-history 和 Survey 模型',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '训练样本拟合优度',
              en: 'Training R²',
              definition: '回归在训练样本内解释目标波动的比例，取值 0 到 1。它衡量历史拟合，不等于未来预测能力（那要看 OOS R²，Module 11）。',
              example: 'WPU02 在 lag 1 的 Training R² 是 0.769。',
            },
            {
              zh: '普通最小二乘法',
              en: 'OLS (Ordinary Least Squares)',
              definition: '最常用的线性回归估计方法：找一条使预测误差平方和最小的直线。Module 6 详讲。',
            },
            {
              zh: '冻结',
              en: 'Freeze',
              definition: '选定后不再更改。lag 在 ≤1999 样本上选定后冻结，之后的 validation 和 final test 不允许再调。',
              example: 'Cell 17 的输出标题就叫 lag choices frozen using data through 1999。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 17：0–12 lag 扫描',
          code: 'def scan_univariate_lags(frame, target, predictors, sample_end, max_lag=12, min_obs=60):\n    rows = []\n    for predictor in predictors:\n        for lag in range(max_lag + 1):\n            pair = pd.DataFrame({\n                "target": frame[target],\n                "predictor": frame[predictor].shift(lag),\n            }).loc[:sample_end].dropna()\n            if len(pair) < min_obs:\n                continue\n            fitted = sm.OLS(pair["target"], sm.add_constant(pair["predictor"])).fit()\n            rows.append({"Predictor": predictor, "Lag_months": lag,\n                         "R_squared": fitted.rsquared, "Beta": fitted.params["predictor"]})\n    return pd.DataFrame(rows)',
          output: 'Food at Home lag choices frozen using data through 1999（前两行）：\nppi_finished_consumer_foods  lag 1  N=564  R²=0.875  β=0.783\nppi_processed_foods          lag 1  N=564  R²=0.769  β=0.690',
          note: 'loc[:sample_end] 是关键一行：sample_end = 1999-12，扫描永远看不到 2000 年以后的数据。选择在"考试"开始之前完成。',
        },
        {
          type: 'table',
          headers: ['Predictor（Home 方向）', '最优 Lag', 'N', 'Training R²', 'Beta'],
          rows: [
            ['ppi_finished_consumer_foods', '1', '564', '0.875', '0.783'],
            ['ppi_processed_foods（WPU02）', '1', '564', '0.769', '0.690'],
            ['ppi_food_manufacturing', '2', '167', '0.589', '0.656'],
            ['ppi_farm_products', '2', '564', '0.538', '0.315'],
            ['philly_current_prices_paid', '0', '380', '0.455', '0.129'],
            ['global_food_price_index', '7', '77', '0.399', '0.071'],
            ['ppi_energy', '0', '564', '0.297', '0.167'],
            ['philly_future_prices_received', '0', '380', '0.267', '0.099'],
            ['wti_crude_oil', '1', '155', '0.148', '0.027'],
          ],
          note: '样本截止 1999-12。距离超市越近的价格指数（下游 PPI），拟合越好；越上游、越宏观的指标（原油、能源）拟合越弱。',
        },
        {
          type: 'chart',
          id: 'lagScanHome',
          caption: 'Home 方向各候选指标最优 lag 的 Training R²：下游食品 PPI 明显领先其他候选。',
        },
        {
          type: 'widget',
          id: 'lagPlayground',
          caption: '亲手扫一遍：拖动 lag 滑块，在 ≤1999-12 样本上实时计算 Training R²。Home 的 WPU02 应在 lag 1 达到最高约 0.769——和 Cell 17 完全一致。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '在 lag 扫描里，Training R² 扮演什么角色？',
            options: [
              {
                id: 'a',
                text: '在 ≤1999-12 的训练样本上衡量每个 lag 的拟合优度，选出最高者并冻结',
                correct: true,
                explanation: '正确！Training R² 是扫描的评分标准：13 个 lag 各得一个分数，最高分胜出，然后冻结。整个过程只看 1999 年及以前的数据。',
              },
              {
                id: 'b',
                text: '衡量模型在 2016 年以后样本外测试中的表现',
                correct: false,
                explanation: '错在样本：那是 OOS（Out-of-Sample）R² 的工作（Module 11），用的是训练时没见过的数据。Training R² 只在 ≤1999 的训练样本内计算。混淆这两者是面试常见扣分点。',
              },
              {
                id: 'c',
                text: 'Training R² 越高，未来预测就一定越准',
                correct: false,
                explanation: '错在"一定"：Training R² 只说明历史拟合好，不保证未来。Module 7 会看到反例——Home baseline 在 validation 期表现并不好。所以选完 lag 还必须做样本外检验，这正是后面模块的主题。',
              },
            ],
            conceptReview: 'Training R² vs OOS R²（训练内拟合 ≠ 样本外表现）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '读扫描表',
            instructions: '从本课的扫描结果中找答案。',
            prompt: '在 ≤1999-12 训练样本上，WPU02（Processed Foods PPI）最优 lag 对应的 Training R² 是多少？（保留三位小数）',
            answer: 0.769,
            tolerance: 0.003,
            solution: 'Cell 17 对 WPU02 扫描 lag 0–12，lag 1 的 Training R² 最高，为 0.769（β = 0.690，N = 564，样本 1953-01 至 1999-12）。这就是 Home baseline 使用 lag 1 的依据。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '完整描述一遍 lag 扫描的流程：试了哪些 lag？用了哪段数据？按什么标准选？选完之后呢？',
            keywords: ['1999', '12', 'lag', '最高'],
            modelAnswer: '对每个候选 predictor，把 lag 从 0 到 12 逐一尝试，每个 lag 用 1999-12 及以前的数据（至少 60 个观测）跑一个 OLS 回归，记录 Training R²。每个 predictor 选 R² 最高的 lag，然后冻结不再改。WPU02 的最优 lag 是 1（R² 0.769）。注意 Away Primary 的 lag 12 是例外：全体员工工资 2006 年才开始，进不了这个扫描，它的 lag 来自 legacy 模型的延续。',
          },
        },
      ],
    },
    {
      id: 'm4-l4',
      moduleId: 'm4',
      title: 'Checkpoint · Correlation ≠ Causation',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解相关性（Correlation）不等于因果关系（Causation）',
            '会用项目实例说明：Philly 调查 R² 最高，却只能当敏感性指标',
            '总结本模块：机制 + 冻结的 lag + 样本外检验，三道防线',
          ],
        },
        {
          type: 'text',
          md: 'Training R² 高，只说明两条线**在历史上同步**——它回答不了"谁导致谁"。\n\n经典例子：冰淇淋销量和溺水人数高度相关。禁售冰淇淋能减少溺水吗？当然不能——真正的推手是**夏天**这个**混杂因素（Confounder）**：天热让人买冰淇淋，也让人下水游泳。只看数字上的同步就下因果结论，就会闹出这种笑话。这种由第三方因素制造的表面关联叫**伪相关（Spurious Correlation）**。',
        },
        {
          type: 'text',
          md: '项目里就有一个活生生的例子。看 Away 方向的扫描结果：**Philly Future Prices Received 的 Training R²（0.587）比 production 工资（0.476）还高**。按"唯 R² 论"，它应该当 Primary Predictor 才对。但它没有，原因：\n\n- 它是**区域性**调查（只覆盖费城地区制造业），也**不是食品行业专属**——高相关不能证明它因果驱动全国的餐饮价格（Notebook 第六大限制之五：只能作敏感性指标，不能证明因果传导）\n- 工资 → 菜单价的机制则直接得多：人工是餐厅的核心成本，涨薪实打实推高定价\n\n所以调查序列只进入 **Survey Sensitivity** 模型，Primary 留给有清晰机制的工资。这个决定本身就是"Correlation ≠ Causation"的最好教材。\n\n模型对抗伪相关的三道防线：\n\n1. 每个 predictor 都有讲得通的**经济机制**（成本传导、工资传导）\n2. lag 在 ≤1999 样本上**冻结**，不许事后挑对自己有利的\n3. 还要闯过 validation 和 2016+ 样本外测试（Module 5、8、11）',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '相关性',
              en: 'Correlation',
              definition: '两个变量在数据上同涨同跌的程度。R² 衡量的就是（线性）相关的强度。',
              example: 'WPU02 lag 1 与 Food at Home CPI 的 Training R² 为 0.769，相关性强。',
            },
            {
              zh: '因果关系',
              en: 'Causation',
              definition: '一个变量的变化真实地引起另一个变量的变化。因果需要机制支撑，数据相关本身证明不了。',
              example: '生产成本上升导致零售价上调，有明确的商业机制。',
            },
            {
              zh: '混杂因素',
              en: 'Confounder',
              definition: '同时影响两个变量的第三方因素，让它们看起来相关，其实互相之间没有因果。',
              example: '夏天同时推高冰淇淋销量和溺水人数。',
            },
            {
              zh: '伪相关',
              en: 'Spurious Correlation',
              definition: '没有因果支撑的表面相关，常由混杂因素或巧合造成。样本外检验是识别它的重要武器。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 17：Away 方向扫描结果——R² 第一名不是工资',
          code: 'print("Food Away from Home lag choices frozen using data through 1999")\ndisplay(away_best_lags)',
          output: 'philly_future_prices_received        lag 2  N=378  R²=0.587  β=0.106\nphilly_current_prices_paid           lag 3  N=377  R²=0.550  β=0.102\nppi_processed_foods                  lag 6  N=552  R²=0.526  β=0.394\nwage_leisure_hospitality_production  lag 2  N=418  R²=0.476  β=0.673',
          note: '排名第一的是费城调查，不是工资。但 R² 排名不是选 Primary 的唯一标准——机制与代表性同样重要，这正是本课的主题。',
        },
        {
          type: 'chart',
          id: 'lagScanAway',
          caption: 'Away 方向各候选指标最优 lag 的 Training R²：调查序列数字最高，但 Primary 仍属于机制清晰的工资。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Philly Future Prices Received 在 Away 扫描中 Training R² 最高（0.587 > 工资的 0.476），为什么它没有成为 Primary Predictor？',
            options: [
              {
                id: 'a',
                text: '因为它的数据历史太短，不够训练',
                correct: false,
                explanation: '错在事实：这条调查从 1968-05 就开始，扫描样本有 378 个观测，历史完全够用。它落选不是数据量问题。正确思路：想想"区域性、非食品专属"意味着什么。',
              },
              {
                id: 'b',
                text: '因为高相关不等于因果：它是区域性、非食品专属的调查，机制上不能证明驱动全国餐饮价格，只适合做敏感性指标',
                correct: true,
                explanation: '正确！这正是 Correlation ≠ Causation 在项目里的落地：R² 高只说明历史同步；Primary 要求可辩护的因果机制和全国代表性，工资 → 菜单价显然更硬。调查因此只进 Survey Sensitivity 模型。',
              },
              {
                id: 'c',
                text: '因为 R² 高就一定意味着发生了 Overfitting',
                correct: false,
                explanation: '错在推理：R² 高本身不是罪，也不自动等于 overfitting（单变量小回归很难严重过拟合）。真正的顾虑是机制与代表性：区域调查的高相关可能来自共同的宏观环境（混杂），不能证明因果传导。',
              },
            ],
            conceptReview: '相关性 vs 因果关系（Correlation ≠ Causation）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '相关性证据还是因果机制？',
            instructions: '把每条陈述放进正确的类别：它是"数字上的同步"，还是"讲得通的因果故事"？',
            categories: ['统计相关性（数字同步）', '经济机制（因果故事）'],
            items: [
              { text: 'WPU02 在 lag 1 的 Training R² = 0.769', category: '统计相关性（数字同步）' },
              { text: '生产端出厂价要经过库存和合同，几个月后传导到超市零售价', category: '经济机制（因果故事）' },
              { text: 'Philly 调查在 lag 2 的 Training R² = 0.587', category: '统计相关性（数字同步）' },
              { text: '人工是餐厅核心成本，涨薪会推高菜单定价', category: '经济机制（因果故事）' },
              { text: '夏天冰淇淋销量与溺水人数一起上升', category: '统计相关性（数字同步）', note: '混杂因素是夏天——典型伪相关' },
            ],
            feedbackCorrect: '分类全对！可信的 predictor 需要两条腿走路：数字上的相关 + 讲得通的机制。缺了机制，再高的 R² 也只能当敏感性参考。',
            feedbackWrong: '判断标准：R² 数字只是"历史上同步"的证据（相关性）；解释"为什么 A 会引起 B"的过程描述才是机制。冰淇淋和溺水就是只有相关、没有机制的反面教材。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用本项目的例子（Philly 调查 vs 工资）解释：为什么 Correlation 不等于 Causation？模型靠什么防止被伪相关骗到？',
            keywords: ['相关', '因果', '机制'],
            modelAnswer: '相关只说明两条线历史上同步，不说明谁引起谁。Philly 调查的 Training R²（0.587）比工资（0.476）高，但它是区域性、非食品专属的调查，说不出它如何因果驱动全国餐饮价格，所以只做敏感性指标；工资有清晰的成本传导机制，才配当 Primary。模型的防线是：每个 predictor 要有经济机制、lag 用 ≤1999 数据冻结、之后还要通过样本外检验。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经掌握了 predictor 与 lag 的完整故事：领先指标的机制、lag 1 / lag 12 的精确含义、0–12 扫描与 Training R²、以及"相关不等于因果"的防线。下一个模块（Module 5）回答一个更根本的问题：**如何设计训练/验证/测试三个阶段，才能保证这一切没有偷看答案（Look-ahead Bias）**？',
        },
      ],
    },
  ],
}
