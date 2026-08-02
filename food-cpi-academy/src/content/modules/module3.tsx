import type { CourseModule } from '../../types'

/**
 * Module 3：数据转换
 * 从 FRED 原始指数到 model_data：完整月历、YoY 转换、
 * Diffusion Index 保持 Level、缺失值（2025-10 停摆）的诚实处理。
 * 数值出处：Notebook Cell 9 / 11 / 13 与 modelResults.ts。
 */
export const module3: CourseModule = {
  id: 'm3',
  order: 3,
  title: 'Module 3 · 数据转换',
  subtitle: '把 18 条原始序列变成模型能用的 model_data',
  icon: '🔧',
  accent: 'violet',
  lessons: [
    {
      id: 'm3-l1',
      moduleId: 'm3',
      title: '把 18 个序列放上同一条时间轴',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道什么是月度时间序列（Monthly Time Series）',
            '理解 Notebook 为什么要 reindex 到一条完整月历',
            '明白完整月历和 lag 的关系：lag 1 必须永远等于一个日历月',
          ],
        },
        {
          type: 'text',
          md: '我们的 18 条 FRED 序列都是**月度时间序列（Monthly Time Series）**：每个日历月最多一个数值。但它们的"年龄"差别巨大——Farm Products PPI 从 **1913 年**就有，L&H 全体员工工资 **2006 年**才开始，达拉斯联储调查 2007 年才出生。\n\n要让这些序列能互相比较、能做"上个月的 PPI 预测这个月的 CPI"这种操作，第一步是把它们放上**同一条完整月历（Complete Monthly Calendar）**：从最早的月份到最新的月份，每个月一行，一个月都不跳过。某条序列还没出生的月份，就填 `NaN`（缺失）占位。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '月度时间序列',
              en: 'Monthly Time Series',
              definition: '按日历月排列的数据序列，每个月最多一个数值。本项目所有 18 条序列都是月度频率。',
              example: 'Food at Home CPI 每月一个指数值，从 1952-01 到 2026-06。',
            },
            {
              zh: '重建索引',
              en: 'Reindex',
              definition: '把数据对齐到一条指定的时间轴上：时间轴上有、数据里没有的月份自动补 NaN，不发明任何数值。',
              example: 'Notebook 用 data.reindex(monthly_index) 把 18 条序列对齐到同一条完整月历。',
            },
            {
              zh: '完整月历',
              en: 'Complete Monthly Calendar',
              definition: '从起点到终点每个日历月都有一行的时间轴，中间不跳过任何月份，即使该月数据缺失。',
              example: '有了完整月历，把序列移动 1 行就恰好等于移动 1 个日历月。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 9：构建完整月历并 reindex',
          code: 'monthly_index = pd.date_range(data.index.min(), data.index.max(), freq="MS")\ndata = data.reindex(monthly_index)\ndata.index.name = "DATE"',
          output: 'freshness 表摘录：\nppi_farm_products              WPU01                1913-01 → 2026-06\nfood_total_cpi                 CPIUFDSL             1947-01 → 2026-06\nwage_leisure_hospitality_all   CES7000000003        2006-03 → 2026-06\nphilly_future_prices_received  PRFDFSA066MSFRBPHI   1968-05 → 2026-07',
          note: 'freq="MS" 表示 Month Start（每月第一天）。reindex 之后，从最早月份到最新月份之间每个月都有一行——各序列出生前的月份是 NaN。',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '为什么完整月历这么重要？',
          md: '后面做 lag 时会用 `shift(1)`——把序列往后移一行。**只有月历完整，"移一行"才恰好等于"移一个日历月"**。如果月历有洞（比如跳过了缺失的月份），shift(1) 就可能一下跨过好几个月，lag 1 的含义被悄悄破坏。所以 Cell 11 里还有一条 assert 专门检查月历无洞。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Notebook 把数据 reindex 到完整月历，核心目的是什么？',
            options: [
              {
                id: 'a',
                text: '删除所有缺失值，让数据更干净',
                correct: false,
                explanation: '错在方向：reindex 不删数据，反而会为缺失的月份补上 NaN 占位——缺失变多而不是变少。删缺失是后面回归配对时 dropna 的事。正确思路：reindex 是为了让时间轴完整。',
              },
              {
                id: 'b',
                text: '保证每个日历月都有一行，让 lag/shift 的"1"永远等于一个日历月',
                correct: true,
                explanation: '正确！完整月历是 lag 含义的地基：shift(1) = 移动一个日历月。Notebook Cell 10 的原文就写着：a lag of one month always means one calendar month。',
              },
              {
                id: 'c',
                text: '把所有序列的起点统一改成 1913 年',
                correct: false,
                explanation: '错在"改起点"：reindex 不会发明历史数据。工资序列 2006 年才开始，reindex 之后它 2006 年之前的月份只是 NaN，起点没有变。正确思路：reindex 只是对齐时间轴，不创造数值。',
              },
            ],
            conceptReview: '完整月历与重建索引（Complete Monthly Calendar / Reindex）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '每行代码在干什么？',
            instructions: '把 Notebook 里的操作和它的作用配对。',
            pairs: [
              { left: 'pd.date_range(..., freq="MS")', right: '生成从首月到末月、每月一行的完整月历' },
              { left: 'data.reindex(monthly_index)', right: '把 18 条序列对齐到月历，缺的月份留 NaN' },
              { left: 'shift(1)（之后 lag 会用）', right: '把整条序列向后移动恰好一个日历月' },
              { left: 'assert data.index.equals(...)', right: '检查月历确实完整、没有跳月' },
            ],
            feedbackCorrect: '全对！date_range 造月历、reindex 对齐、assert 把关，shift 才能放心地表示"一个月"。',
            feedbackWrong: '再想想每一步的分工：先造完整月历（date_range），再把数据铺上去（reindex），然后用 assert 验证月历无洞，这样 shift(1) 才严格等于移动一个日历月。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：为什么 Notebook 要先把所有序列 reindex 到一条完整月历？这和后面的 lag 有什么关系？',
            keywords: ['reindex', '月', 'lag'],
            modelAnswer: '18 条序列起点各不相同，reindex 把它们对齐到同一条完整月历上：每个日历月一行，缺数据的月份填 NaN。这样后面做 lag 时，shift(1) 移动一行就恰好等于移动一个日历月，lag 1 的含义才不会被缺月破坏。',
          },
        },
      ],
    },
    {
      id: 'm3-l2',
      moduleId: 'm3',
      title: 'YoY：把指数水平变成通胀率',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清指数水平（Index Level）和同比变化率（YoY % Change）',
            '会用公式和 pct_change(12) 计算 YoY',
            '用真实数字验证：WPU02 2026-06 指数 279.422 → YoY 1.63%',
          ],
        },
        {
          type: 'text',
          md: '原始 FRED 数据是**指数水平（Index Level）**：比如 WPU02（Processed Foods PPI）在 2026-06 的值是 **279.422**。这个数字只回答"相对基期有多贵"，不回答"最近涨得多快"——而我们要预测的正是"涨多快"（通胀率）。\n\n所以 Cell 13 把所有价格、工资类序列转换成**同比变化率（YoY % Change）**：和 12 个月前的自己比。选"同比"而不是"环比"还有一个好处：12 个月正好一个季节循环，**季节性（Seasonality）**（比如节假日前食品涨价）在同比里自动抵消。\n\n验证一下：WPU02 的 2026-06 指数是 279.422，除以 2025-06 的指数、减 1、乘 100，得到 **1.629435%**——正是 Cell 13 输出里 `ppi_processed_foods` 在 2026-06 那一格的值。意思是：加工食品出厂价比一年前的自己贵了约 1.63%。',
        },
        {
          type: 'formula',
          lhs: 'YoY %(t)',
          rhs: '(Index(t) ÷ Index(t−12) − 1) × 100',
          note: '对应 pandas 的 pct_change(periods=12) × 100。每条序列的前 12 个月自动是 NaN——它们没有"一年前"可比。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '指数水平',
              en: 'Index Level',
              definition: '价格指数本身的数值，衡量相对基期的价格高低，不直接反映最近的涨速。',
              example: 'WPU02 在 2026-06 的指数水平是 279.422。',
            },
            {
              zh: '同比变化率',
              en: 'YoY % Change (Year-over-Year)',
              definition: '和 12 个月前的自己比的百分比变化，是本项目衡量通胀的标准方式。',
              example: 'WPU02 2026-06 的 YoY 是 1.629435%，即比 2025-06 贵约 1.63%。',
            },
            {
              zh: '季节性',
              en: 'Seasonality',
              definition: '每年固定时间重复出现的价格波动模式。同比比较让相隔 12 个月的同一季节互相抵消。',
              example: '节假日食品涨价每年都发生，在 YoY 里不会被误认成通胀加速。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 13：按规则转换每一条序列',
          code: 'model_data = pd.DataFrame(index=data.index)\nfor variable, rule in transform_rules.items():\n    if rule == "yoy_pct":\n        model_data[variable] = data[variable].pct_change(periods=12, fill_method=None) * 100\n    elif rule == "level":\n        model_data[variable] = data[variable]',
          output: 'model_data.tail() 摘录（ppi_processed_foods 列，YoY %）：\n2026-04  2.141680\n2026-05  1.865835\n2026-06  1.629435\n（food_at_home_cpi 2026-06：2.704309；food_total_cpi 2026-06：2.987321）',
          note: 'fill_method=None 很重要：它防止 pct_change 悄悄用旧值填补缺失月。转换后的表叫 model_data 而不是 model_yoy——因为下一课会看到，不是每一列都是 YoY。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'model_data 里 ppi_processed_foods 在 2026-06 的值是 1.629435。它的含义是？',
            options: [
              {
                id: 'a',
                text: '2026-06 的加工食品出厂价比 2026-05 涨了约 1.63%',
                correct: false,
                explanation: '错在比较对象：和上个月比是环比（MoM），对应 pct_change(1)。这里用的是 pct_change(12)，比较对象是 12 个月前。正确思路：YoY = 和去年同月比。',
              },
              {
                id: 'b',
                text: '2026-06 的加工食品出厂价比 2025-06 涨了约 1.63%',
                correct: true,
                explanation: '正确！YoY 就是和 12 个月前的自己比：指数从 2025-06 的水平涨到 2026-06 的 279.422，涨幅约 1.63%。',
              },
              {
                id: 'c',
                text: 'WPU02 的指数水平是 1.63',
                correct: false,
                explanation: '错在混淆水平和增长率：指数水平是 279.422（在原始 data 表里），1.629435 是转换后的增长率（在 model_data 表里）。正确思路：记住两张表的分工——data 存水平，model_data 存转换结果。',
              },
            ],
            conceptReview: '同比变化率（YoY % Change）vs 指数水平（Index Level）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手算一次 YoY',
            instructions: '用 YoY 公式计算。注意：这里用的是练习专用的假想数字，不是真实数据。',
            prompt: '假想指数：2026-06 = 103.0，2025-06 = 100.0。它的 YoY % Change 是多少？',
            answer: 3,
            tolerance: 0.05,
            unit: '%',
            solution: '(103.0 ÷ 100.0 − 1) × 100 = 3.0%。同一条公式作用在真实的 WPU02 上：用 2026-06 的指数 279.422 除以 2025-06 的指数、减 1、乘 100，就得到 Cell 13 输出里的 1.629435%。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：为什么模型用 YoY 增长率做回归，而不是直接用指数水平？',
            keywords: ['同比', '12', '季节'],
            modelAnswer: '指数水平只说明相对基期有多贵，而我们要预测的是通胀率——价格涨多快。YoY 是和 12 个月前比的同比增长率，正好覆盖一个完整的季节循环，所以季节性会自动抵消。用 pct_change(12)×100 就能把指数水平转换成 YoY。',
          },
        },
      ],
    },
    {
      id: 'm3-l3',
      moduleId: 'm3',
      title: 'Diffusion Index：唯一不做 YoY 的例外',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道什么是扩散指数（Diffusion Index）：报涨减报跌的净差额',
            '理解为什么对它算 YoY 在数学和经济上都是错的',
            '记住三条调查序列保持 Level，且发布特别快（2026-07 Philly = 41.4）',
          ],
        },
        {
          type: 'text',
          md: '18 条序列里有 3 条特殊的：费城联储的 Current Prices Paid、Future Prices Received，和达拉斯联储的 Future Service Selling Prices。它们不是价格指数，而是**扩散指数（Diffusion Index）**——来自对企业的问卷调查。\n\n做法很直白：问一批企业"价格是涨、跌、还是不变？"，然后计算**净差额（Net Balance）**：\n\n- 扩散指数 = 报"涨"的企业百分比 − 报"跌"的企业百分比\n- 例如 2026-07 的 Philly Future Prices Received = **41.4**：预计未来售价上涨的企业比预计下跌的多 41.4 个百分点\n\n它衡量的是"涨价的方向和广度"，本身已经是一种方向性的度量，**不是价格水平**。它可以是 0，也可以是负数（报跌的更多）。\n\n如果硬对它算 YoY 会怎样？分母可能是 0（除法爆炸）或负数（符号翻转，比率失去意义）；而且"净差额的同比增长率"在经济上根本没有含义。所以 Cell 13 的 `transform_rules` 给这三条序列标注 `level`：**原样保留**。这也是转换后的表叫 `model_data` 而不叫 `model_yoy` 的原因。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '扩散指数',
              en: 'Diffusion Index',
              definition: '基于问卷调查的指数：报告上涨的企业百分比减去报告下跌的企业百分比，衡量价格变动的方向与广度。',
              example: '2026-07 的 Philly Future Prices Received = 41.4，表示看涨的企业净多 41.4 个百分点。',
            },
            {
              zh: '净差额',
              en: 'Net Balance',
              definition: '"涨"的比例减"跌"的比例。可以为正、为零、为负，所以不能像价格指数那样求同比比率。',
            },
            {
              zh: '水平值',
              en: 'Level',
              definition: '不做任何转换、按发布原值使用。三条调查序列在 model_data 里都保持 Level。',
              example: 'transform_rules 里调查序列的规则是 "level"，其余价格/工资序列是 "yoy_pct"。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 13：level 分支 + 调查序列的最新值',
          code: 'elif rule == "level":\n    model_data[variable] = data[variable]',
          output: 'philly_future_prices_received：2026-05 = 60.5，2026-06 = 67.2，2026-07 = 41.4\nphilly_current_prices_paid：  2026-06 = 53.2，2026-07 = 53.9\ndallas_future_service_selling_prices：2026-07 = 25.2',
          note: '注意 2026-07 这一行：CPI、PPI、工资都还没发布（NaN），但三条调查序列已经有 7 月值——联储调查发布非常快，这是它们作为敏感性指标的一个优势。',
        },
        {
          type: 'chart',
          id: 'surveyLevelChart',
          caption: '费城联储 Future Prices Received 扩散指数（保持 Level）。它可正可负、围绕 0 波动——对这种序列求同比比率没有意义。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么不能对费城联储扩散指数计算 YoY % Change？',
            options: [
              {
                id: 'a',
                text: '因为它的历史数据太短，算不出同比',
                correct: false,
                explanation: '错在事实：Philly 两条调查从 1968-05 就开始了，历史将近 60 年，算同比在数据长度上毫无障碍。问题不在历史长短，而在指数的性质。正确思路：想想扩散指数可以取什么值。',
              },
              {
                id: 'b',
                text: '因为它是"报涨 − 报跌"的净差额，可为 0 或负数，同比比率在数学上会爆炸、在经济上没有含义',
                correct: true,
                explanation: '正确！分母为 0 时除法未定义，分母为负时比率符号错乱；而且"净差额的同比增速"不对应任何经济概念。它本身已经是方向性指标，直接用 Level。',
              },
              {
                id: 'c',
                text: '因为调查数据每季度才发布一次，频率对不上',
                correct: false,
                explanation: '错在频率：它是月度序列，而且发布还特别快——2026-07 大多数序列缺失时，Philly 已经有 41.4 这个 7 月值。正确思路：不做 YoY 的原因是净差额的数学性质，不是发布频率。',
              },
            ],
            conceptReview: '扩散指数（Diffusion Index）与净差额（Net Balance）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '谁转 YoY，谁保持 Level？',
            instructions: '按 Cell 13 的 transform_rules，把每条序列放进正确的转换规则。',
            categories: ['转换成 YoY %', '保持 Level'],
            items: [
              { text: 'Processed Foods PPI（WPU02）', category: '转换成 YoY %' },
              { text: 'Food at Home CPI', category: '转换成 YoY %' },
              { text: 'L&H 平均时薪（CES7000000003）', category: '转换成 YoY %', note: '工资也是价格类数据，同样转 YoY' },
              { text: 'WTI 原油价格', category: '转换成 YoY %' },
              { text: '费城联储 Future Prices Received', category: '保持 Level' },
              { text: '费城联储 Current Prices Paid', category: '保持 Level' },
              { text: '达拉斯联储 Future Service Selling Prices', category: '保持 Level' },
            ],
            feedbackCorrect: '完全正确！规则很干净：价格指数、大宗商品价格、工资 → YoY；三条商业调查扩散指数 → Level。',
            feedbackWrong: '判断标准只有一条：它是"价格/工资水平"还是"净差额调查"？前者转 YoY，后者（费城 ×2 + 达拉斯 ×1）保持 Level——净差额可为零或负，不能求同比。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '向队友解释：为什么三条调查序列在 model_data 里保持 Level？请用「净差额」这个概念来说明。',
            keywords: ['扩散', 'level', '净差额'],
            modelAnswer: '这三条是扩散指数：报涨企业比例减报跌企业比例的净差额。它本身已经是方向性指标，可以为 0 或负数，如果算 YoY，分母可能为 0 或负，比率在数学上爆炸、经济上无意义。所以 transform_rules 让它们保持 level 原值进入 model_data。',
          },
        },
      ],
    },
    {
      id: 'm3-l4',
      moduleId: 'm3',
      title: 'Checkpoint · 缺失值：诚实面对数据的洞',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 2025-10 的 CPI 因联邦停摆缺失，以及 Notebook 如何处理',
            '理解"保持缺失、不插值"背后的诚实原则',
            '把 Module 3 的完整数据管道串成一条线',
          ],
        },
        {
          type: 'text',
          md: '完整月历上有两种"洞"，性质完全不同：\n\n1. **2025-10：数据本该有却没有**。当月美国联邦政府停摆（federal shutdown），CPI 没有发布——三条 CPI 目标序列在这个月缺失，而 PPI、工资等 predictor 都正常发布\n2. **2026-07：数据太新还没到**。大多数序列尚未发布（NaN），只有费城/达拉斯联储调查已经有 7 月值\n\nNotebook 的处理原则只有一句话：**保持缺失，不插值、不编造**。Cell 11 甚至用 `assert` 专门确认 2025-10 的 Food at Home CPI 确实是 NaN——缺失是被验证过的事实，不是被忽略的意外。后面做回归时，配对样本的 `dropna()` 会自动跳过这些月份。',
        },
        {
          type: 'text',
          md: '为什么不插值？**插值等于发明数据**。比如用 2025-09 和 2025-11 的平均"补出"一个 10 月值，听起来无害，实际上是把一个从未存在的观测喂给模型：\n\n- 回测的诚实性被破坏——模型"看到"了现实中不存在的数据点\n- 真实风险被掩盖——现实世界里数据就是会缺席（停摆、发布延迟），模型应当在这样的世界里被检验\n- 假数据一旦混进历史，之后所有的回归和评估结论都会被污染',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '缺失值',
              en: 'Missing Value (NaN)',
              definition: '日历上存在、但没有观测数据的格子。保持 NaN 让下游计算自动跳过它，而不是假装它存在。',
              example: '2025-10 的三条 CPI 目标序列因联邦停摆缺失。',
            },
            {
              zh: '插值',
              en: 'Interpolation',
              definition: '用相邻数据"推算"出缺失位置的数值。本项目明确不做——插值等于发明观测。',
            },
            {
              zh: '断言检查',
              en: 'Assert',
              definition: '代码中的自动检查：条件不满足就立刻报错停机，防止有问题的数据静悄悄流入模型。',
              example: 'Cell 11 用 assert 确认月历完整、各序列起点正确、2025-10 确实缺失。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 11：数据质量检查',
          code: 'assert not data.index.has_duplicates\nassert data.index.equals(pd.date_range(data.index.min(), data.index.max(), freq="MS"))\nassert data["food_at_home_cpi"].first_valid_index() == pd.Timestamp("1952-01-01")\nassert pd.isna(data.loc[pd.Timestamp("2025-10-01"), "food_at_home_cpi"])\n\ndisplay(data.loc["2025-01-01":].isna().loc[lambda x: x.any(axis=1)])',
          output: '2025 年以来有缺失的月份只有两行：\n2025-10-01：三条 CPI 目标 = True（缺失），所有 predictor = False（正常）\n2026-07-01：大多数序列 = True（尚未发布），费城/达拉斯调查 = False（已有 7 月值）',
          note: '注意最后一条 assert 的方向：它不是检查"数据没有缺失"，而是检查"2025-10 确实缺失"。如果哪天有人误把插值数据混进备份 CSV，这条 assert 会立刻报警。',
        },
        {
          type: 'table',
          headers: ['月份', '涉及序列', '缺失原因', 'Notebook 的处理'],
          rows: [
            ['2025-10', '三条 CPI 目标序列', '联邦政府停摆，CPI 未发布', '保持 NaN，不插值'],
            ['2025-10', 'PPI、工资等 predictor', '（正常发布，不缺失）', '正常使用'],
            ['2026-07', '大多数序列', '数据尚未发布', '保持 NaN'],
            ['2026-07', '费城/达拉斯联储调查', '（已发布）', '正常使用（Philly = 41.4）'],
          ],
          note: '两种洞：一种是"该有没有"（停摆），一种是"还没到"（发布延迟）。处理原则相同：保持缺失。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '2025-10 的 CPI 因停摆缺失，Notebook 是怎么处理的？',
            options: [
              {
                id: 'a',
                text: '用 2025-09 和 2025-11 的平均值插值补齐',
                correct: false,
                explanation: '错在发明数据：插值会造出一个现实中从未发布的"观测"，污染回归样本和回测的诚实性。Notebook 的原则恰恰相反——缺失就保持缺失。正确思路：保持 NaN，让 dropna 自动跳过。',
              },
              {
                id: 'b',
                text: '保持 NaN，回归配对时由 dropna 自动跳过该月',
                correct: true,
                explanation: '正确！Cell 10 原文：remain missing and are not invented。缺失被 assert 确认、被保留，回归在构建配对样本时自动绕开它。',
              },
              {
                id: 'c',
                text: '把 2025-10 整行从月历中删掉',
                correct: false,
                explanation: '错在破坏月历：删掉整行后月历出现跳月，shift(1) 会从 2025-11 直接跨到 2025-09，lag 1 不再等于一个日历月。正确思路：行保留、值为 NaN——月历完整性和数据诚实性两者都要。',
              },
            ],
            conceptReview: '缺失值处理（Missing Values）与完整月历',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: 'Module 3 数据管道排序',
            instructions: '把"从 FRED 原始数据到 model_data"的 5 个步骤按 Notebook 的实际顺序排好。',
            correctOrder: [
              '从 FRED 下载（或读取备份 CSV）18 条序列',
              'reindex 到完整月历，缺的月份补 NaN',
              '数据质量 assert：月历无洞、起点正确、2025-10 确实缺失',
              '按 transform_rules 转换：价格/工资 → YoY %，调查 → Level',
              '得到 model_data，交给后面的 lag 选择与回归',
            ],
            feedbackCorrect: '顺序完全正确！这正是 Cell 9 → Cell 11 → Cell 13 的流水线：先对齐、再验证、后转换。',
            feedbackWrong: '想想依赖关系：必须先有对齐好的完整月历（reindex），质量检查才有意义；检查通过后才敢做转换；转换完成才有 model_data。验证永远在使用之前。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '一口气总结 Module 3：原始数据从 FRED 到 model_data，经历了哪些处理？缺失的月份怎么办？',
            keywords: ['yoy', 'level', '缺失', '月历'],
            modelAnswer: '18 条序列先被 reindex 到一条完整月历上，保证 lag 1 永远等于一个日历月；assert 验证月历无洞、2025-10 的 CPI 确实因停摆缺失。然后按规则转换：价格和工资序列用 pct_change(12)×100 转成 YoY，三条调查扩散指数保持 Level。缺失值保持 NaN、绝不插值，回归时自动跳过。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: 'model_data 已经就绪：每一列要么是 YoY 通胀率，要么是调查 Level，月历完整、缺失诚实。下一个模块（Module 4）就要在这张表上回答关键问题：**用哪个 predictor、滞后几个月**？',
        },
      ],
    },
  ],
}
