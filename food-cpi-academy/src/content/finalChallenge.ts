import type { Quiz } from '../types'

/** Final Challenge：20 题综合测验（每题 5 分，80 分通过） */
export const finalQuizzes: Quiz[] = [
  {
    question: 'Food at Home Primary Model 的 Predictor 和 Lag 是什么？',
    options: [
      { id: 'a', text: 'Processed Foods and Feeds PPI（WPU02），lag 1 个月', correct: true, explanation: '正确！当前 Primary Baseline：FoodAtHome(t) = 1.408 + 0.650 × ProcessedFoodsPPI(t−1)。' },
      { id: 'b', text: 'Processed Foods PPI，lag 3 个月', correct: false, explanation: '错在版本：lag 3 是早期旧 Notebook 的设定，已废弃。当前 Notebook 在 ≤1999 训练样本上扫描 0–12 lag，lag 1 的 Training R²（0.769）最高。' },
      { id: 'c', text: 'Farm Products PPI（WPU01），lag 2 个月', correct: false, explanation: '错在指标：WPU01 是农产品 PPI，只是稳健性候选。Primary 用的是更靠近零售端的 WPU02（加工食品与饲料）。' },
    ],
    conceptReview: 'Primary Baseline 模型设定（Module 4、9）',
  },
  {
    question: 'Food Away from Home Primary Model 使用什么 Predictor？',
    options: [
      { id: 'a', text: '休闲酒店业全体员工平均时薪（CES7000000003），lag 12 个月', correct: true, explanation: '正确！FoodAway(t) = 1.753 + 0.485 × WageGrowth(t−12)，这是保留下来的 legacy all-employee 模型。' },
      { id: 'b', text: '费城联储未来售价指数，lag 2 个月', correct: false, explanation: '错在角色：Philly 调查只出现在 Survey Sensitivity 模型中，不是 Primary。Primary Away 用全国性的休闲酒店业工资。' },
      { id: 'c', text: '一线员工工资（CES7000000008），lag 8 个月', correct: false, explanation: '错在两处：lag 8 是旧版设定已废弃；CES7000000008 用于 Long-history baseline 和 Survey 模型（lag 2），不是 Primary。' },
    ],
    conceptReview: 'Away Legacy 模型（Module 9）',
  },
  {
    question: '当前 Forecast Origin 是 2026 年 6 月。Home 模型预测 2026 年 7 月时用的 PPI 值是？',
    options: [
      { id: 'a', text: '2026 年 6 月的 Observed PPI YoY（约 1.63%）', correct: true, explanation: '正确！lag 1 → 2026-07 需要 2026-06 的 PPI，它已经发布（1.6294%），是 12 个月中唯一主要依赖 Observed PPI 的月份。' },
      { id: 'b', text: '最新 3 个月 PPI 平均值（约 1.88%）', correct: false, explanation: '错在月份：3 个月平均假设用于 2026-08 至 2027-06 这 11 个月（它们需要尚未发布的 PPI）。2026-07 需要的 2026-06 PPI 已 Observed。' },
      { id: 'c', text: '2026 年 7 月的 PPI（等发布后再预测）', correct: false, explanation: '错在对 lag 的理解：lag 1 意味着预测 t 月用 t−1 月的 PPI，即 2026-07 用 2026-06 的值——不需要等 7 月 PPI。' },
    ],
    conceptReview: 'Forecast Input Audit（Module 9）',
  },
  {
    question: '为什么 Food Away 的 12 个月预测全部基于 Observed 数据？',
    options: [
      { id: 'a', text: '因为 lag 12：预测 2026-07 至 2027-06 只需要 2025-07 至 2026-06 的工资，全部已发布', correct: true, explanation: '正确！12 个月的 lag 让所有所需 predictor 月份都落在已观察区间。' },
      { id: 'b', text: '因为工资数据每月都能提前拿到', correct: false, explanation: '错在机制：工资数据并不能提前拿到。真正的原因是 lag 12 使所需月份全部在过去。' },
      { id: 'c', text: '因为模型对 Away 也用了 3 个月平均假设', correct: false, explanation: '方向反了：正因为 lag 12，Away 完全不需要假设；3 个月平均假设只出现在 Home 的后 11 个月。' },
    ],
    conceptReview: 'Predictor Month Mapping（Module 9）',
  },
  {
    question: 'OOS R² = 0.598 的正确解释是？',
    options: [
      { id: 'a', text: '模型预测的准确率是 59.8%', correct: false, explanation: '这是最常见的误读。OOS R² 不是准确率，它是相对 No-change Benchmark 的平方误差改善比例。' },
      { id: 'b', text: '相对 No-change Benchmark，样本外平方预测误差降低约 59.8%', correct: true, explanation: '正确！1 − SSE(model)/SSE(no-change) = 0.598，即比"复读最新值"的朴素预测好 59.8%（按平方误差算）。' },
      { id: 'c', text: '模型解释了 59.8% 的历史数据', correct: false, explanation: '错在样本：那是 In-sample R² 的直觉。OOS R² 衡量的是样本外预测相对基准的改善，不是历史拟合度。' },
    ],
    conceptReview: 'OOS R² vs No-change（Module 11）',
  },
  {
    question: '3.02% 和 4.34% 分别是什么？',
    options: [
      { id: 'a', text: '3.02% 是 Primary Baseline 主预测；4.34% 是 Survey Sensitivity 较高通胀情景', correct: true, explanation: '正确！两者都是 2027-06 的 Total Food YoY，但角色完全不同：主预测 vs 敏感性情景。' },
      { id: 'b', text: '3.02% 是悲观情景；4.34% 是主预测', correct: false, explanation: '刚好说反了。课程铁律：不得把 Survey Sensitivity（4.34%）当作 Primary Forecast。' },
      { id: 'c', text: '两者是同一模型在不同月份的预测', correct: false, explanation: '错在对象：两者都是 2027-06 的预测，来自两套不同的模型家族（Primary vs Survey）。' },
    ],
    conceptReview: 'Primary vs Survey（Module 7）',
  },
  {
    question: 'Lag 选择使用了哪个样本？为什么？',
    options: [
      { id: 'a', text: '只用 1999-12 及以前的数据，防止 lag 选择"偷看"验证期和测试期', correct: true, explanation: '正确！Lag-training Sample 截止 1999-12；lag 冻结后才进入 2000–2015 验证与 2016+ 最终测试。' },
      { id: 'b', text: '用全部历史数据，样本越大越好', correct: false, explanation: '错在忽略 look-ahead：若用全样本选 lag，测试期数据参与了选择，2016+ 的成绩就不可信了。样本大小要让位于评估的诚实性。' },
      { id: 'c', text: '用 2016 年以后的数据，因为它最新', correct: false, explanation: '完全颠倒：2016+ 是 Final Test 专用的"封存卷子"，绝不能用于任何选择。' },
    ],
    conceptReview: '三个样本阶段（Module 5）',
  },
  {
    question: 'Expanding-window Backtest 中，每个 Forecast Origin 上什么被更新、什么保持不变？',
    options: [
      { id: 'a', text: '更新：回归系数（α、β）；不变：Predictor 与 Lag 的规范', correct: true, explanation: '正确！规格冻结、系数用"当时可得"的扩大样本重估——这正是历史回测系数与当前方程不完全相同的原因。' },
      { id: 'b', text: '更新：Predictor 与 Lag；不变：系数', correct: false, explanation: '刚好说反。若每个 origin 重选变量与 lag，就等于反复用后见之明改模型，回测失去意义。' },
      { id: 'c', text: '什么都不更新，一直用同一条方程', correct: false, explanation: '那是 Fixed Window 的做法。Expanding window 在每个 origin 用截至当时的全部数据重估系数。' },
    ],
    conceptReview: 'Expanding-window（Module 8）',
  },
  {
    question: 'Total Food 组合公式中 HomeWeight 怎么算？',
    options: [
      { id: 'a', text: '8.188 ÷ (8.188 + 5.260) ≈ 0.609', correct: true, explanation: '正确！Food 内部权重按两个分项的 relative importance 归一化。AwayWeight ≈ 0.391。' },
      { id: 'b', text: '8.188 ÷ 100', correct: false, explanation: '错在分母：8.188 是占 Headline CPI 的百分比。Food 内部合并时应除以两个分项之和 13.448，而不是 100。' },
      { id: 'c', text: '固定 50/50，两个分项等权', correct: false, explanation: '错在忽略数据：BLS 公布的 relative importance 显示家庭食品（8.188）权重大于外出就餐（5.260），不能拍脑袋等权。' },
    ],
    conceptReview: '权重与组合（Module 10）',
  },
  {
    question: 'Food CPI 预测 3.02% 对 Headline CPI 的贡献约是多少？',
    options: [
      { id: 'a', text: '约 0.41 个百分点（3.02% × 13.447 / 100）', correct: true, explanation: '正确！Contribution = Food YoY × relative importance / 100 = 3.02 × 0.13447 ≈ 0.41 pp。' },
      { id: 'b', text: '3.02 个百分点，直接就是贡献', correct: false, explanation: '错在忘记权重：Food 只占 Headline 的 13.447%，必须乘权重。若每个组件都直接加 YoY，Headline 会被严重高估。' },
      { id: 'c', text: '约 1.35 个百分点', correct: false, explanation: '计算有误：3.02 × 0.13447 ≈ 0.406，不是 1.35。可以用组合计算器验算。' },
    ],
    conceptReview: 'Headline 贡献（Module 10）',
  },
  {
    question: '为什么 Survey Diffusion Index 保持 Level 而不算 YoY？',
    options: [
      { id: 'a', text: '扩散指数本身已是"涨价企业占比减降价企业占比"的净差额，对它再算 YoY 没有意义', correct: true, explanation: '正确！Diffusion index 已经是一个"变化方向"的度量；pct_change(12) 会制造出无法解释甚至除零的数字。' },
      { id: 'b', text: '因为调查数据更新太慢', correct: false, explanation: '错在理由：费城联储调查每月更新（甚至比 CPI 早）。保持 level 是因为指数的统计性质，不是更新频率。' },
      { id: 'c', text: '因为 YoY 会让数值变大', correct: false, explanation: '错在本质：问题不是数值大小，而是对净差额指数做增长率变换在概念上就是错的。' },
    ],
    conceptReview: 'Diffusion Index Level（Module 3）',
  },
  {
    question: '2016+ Final Test 中 Away Legacy 模型的 OOS R² 只有 0.097，说明什么？',
    options: [
      { id: 'a', text: '它对 No-change Benchmark 的改善较弱，但仍为正（略优于朴素预测）', correct: true, explanation: '正确！0.097 表示平方误差只比 no-change 低约 9.7%——诚实呈现这一点比夸大它更重要。' },
      { id: 'b', text: '模型完全失效，应该删除', correct: false, explanation: '错在极端化：正的 OOS R² 说明仍优于基准；且该模型让 12 个月预测全部基于 observed 数据、保持了延续性，这些价值不体现在单一指标里。' },
      { id: 'c', text: '它 9.7% 的时间预测正确', correct: false, explanation: '又是"准确率"误读：OOS R² 是平方误差的相对改善，不是正确次数占比。' },
    ],
    conceptReview: 'OOS R² 解读（Module 11）',
  },
  {
    question: 'Survey 模型 OOS R²（0.636）比 Primary（0.598）高，为什么不直接换成 Survey？',
    options: [
      { id: 'a', text: '因为费城调查是区域性、非食品专属指标，牺牲了全国代表性与可解释性，只宜作敏感性情景', correct: true, explanation: '正确！小幅指标优势 ≠ 更好的主模型。Primary 的国家级食品链逻辑在向 Pacific Life 解释时更站得住。' },
      { id: 'b', text: '因为 0.636 算错了', correct: false, explanation: '数字没有错（见 Notebook Cell 29/41）。问题在于如何权衡指标提升与模型的经济逻辑、代表性和透明度。' },
      { id: 'c', text: '因为 Survey 模型计算太慢', correct: false, explanation: '错在理由：两类模型都是简单 OLS，速度毫无差别。真正的顾虑是调查指标的区域性与解释性。' },
    ],
    conceptReview: '模型选择哲学（Module 7）',
  },
  {
    question: '未观察到的未来 PPI 用什么代替？',
    options: [
      { id: 'a', text: '最新 3 个月 PPI YoY 的平均值（约 1.88%）', correct: true, explanation: '正确！(2.1417 + 1.8658 + 1.6294) / 3 ≈ 1.8790。这也是 Limitation 3：后面的月份是基准情景。' },
      { id: 'b', text: '直接填 0', correct: false, explanation: '错在假设选择：填 0 等于假设 PPI 增长骤停，是一个极端情景。Notebook 用近期平均延续当前趋势，作为中性基准。' },
      { id: 'c', text: '用去年同月的 PPI 值', correct: false, explanation: '错在规则：Notebook 的规则是最新 3 个月平均（Cell 21 的 latest 3-month average assumption），不是同比复制。' },
    ],
    conceptReview: '3 个月平均假设（Module 9、13）',
  },
  {
    question: '为什么 Home 模型 2026-08 至 2027-06 的预测都是同一个值（2.63%）？',
    options: [
      { id: 'a', text: '这 11 个月的 PPI 输入都是同一个假设值（1.879），方程相同输入相同，输出自然相同', correct: true, explanation: '正确！这不是 bug，而是"未来 predictor 未观察→用同一假设"的直接结果；Away 每月不同正是因为它的输入是逐月不同的 observed 工资。' },
      { id: 'b', text: '因为模型把第一个预测复制了 11 次', correct: false, explanation: '错在机制：每个月都独立计算（各有自己的 Required Predictor Month），只是输入值恰好相同。Audit 表能证明这一点。' },
      { id: 'c', text: '因为 Food at Home 通胀不会变化', correct: false, explanation: '错在因果：相同的是模型输入假设，不是现实。实际通胀当然会波动，这正是预测区间存在的原因。' },
    ],
    conceptReview: 'Forecast Calculation（Module 9）',
  },
  {
    question: 'Pre-2016 Validation 的作用是什么？',
    options: [
      { id: 'a', text: '在不动用 2016+ 数据的前提下，比较 Baseline 与 Expanded Models，决定谁进入最终报告', correct: true, explanation: '正确！2000–2014 origins 的 12 个月结果全部在 2015-12 前实现，模型比较全程停在 2016 之前。' },
      { id: 'b', text: '用来挑选 lag', correct: false, explanation: '错在阶段：lag 在更早的 Lag-training Sample（≤1999）就已冻结。Validation 比的是模型规格（如是否加调查指标）。' },
      { id: 'c', text: '用来报告最终业绩', correct: false, explanation: '错在角色：最终业绩来自 2016+ Final Test。Validation 是"内部选拔赛"，不是"成绩单"。' },
    ],
    conceptReview: '三个样本阶段（Module 5）',
  },
  {
    question: '经验预测区间（Empirical OOS-error Interval）是怎么来的？',
    options: [
      { id: 'a', text: '取历史回测中各 horizon 实际预测误差的 2.5% 和 97.5% 分位数，叠加到当前预测上', correct: true, explanation: '正确！它基于模型真实犯过的错，比依赖理论假设的 Nominal Interval 更诚实，也是 Notebook 的主要可靠性度量。' },
      { id: 'b', text: '固定加减 2 个百分点', correct: false, explanation: '错在机制：区间宽度随 horizon 变化（12 个月时约 [−0.56, 8.23]），来自误差分位数，不是拍脑袋的固定值。' },
      { id: 'c', text: '由正态分布公式直接推出', correct: false, explanation: '那是 Nominal Prediction Interval 的思路。经验区间恰恰绕开分布假设，用历史 OOS 误差的分位数。' },
    ],
    conceptReview: '预测区间（Module 11）',
  },
  {
    question: '六大 Limitations 之一是"伪实时回测"。它指什么？',
    options: [
      { id: 'a', text: '回测用的是今天修订后的 FRED 数据，不是历史当时的 ALFRED Vintage 版本', correct: true, explanation: '正确！历史上当月看到的数据可能与今天的修订版不同，因此回测是 pseudo-real-time。' },
      { id: 'b', text: '回测跑得不够快', correct: false, explanation: '错在望文生义："实时"指的是数据版本（当时可见 vs 事后修订），与运行速度无关。' },
      { id: 'c', text: '模型只能在盘中实时运行', correct: false, explanation: '错在语境：这是月度宏观模型，没有盘中概念。Limitation 说的是数据 vintage 问题。' },
    ],
    conceptReview: 'Limitations（Module 13）',
  },
  {
    question: '为什么重叠的 12 个月预测误差是个问题？如何应对？',
    options: [
      { id: 'a', text: '相邻 origin 的 12 个月窗口高度重叠导致误差序列相关；用 HAC SE 与经验区间应对', correct: true, explanation: '正确！比如 2020-01 和 2020-02 origin 的 12M 预测有 11 个月重叠，误差必然相关——这是 Limitation 6。' },
      { id: 'b', text: '误差重叠会让 RMSE 变成负数', correct: false, explanation: '错在数学：RMSE 是平方的均值开根号，永远非负。序列相关影响的是标准误与置信度评估，不是 RMSE 的符号。' },
      { id: 'c', text: '没有问题，误差都是独立的', correct: false, explanation: '错在事实：Notebook 明确指出（Limitation 6）重叠窗口导致 serial correlation，并因此使用 HAC 标准误。' },
    ],
    conceptReview: 'Serial Correlation 与 HAC（Module 6、13）',
  },
  {
    question: '2025 年 10 月的 CPI 数据在 Notebook 中如何处理？',
    options: [
      { id: 'a', text: '因联邦政府停摆缺失，保持缺失、不插值', correct: true, explanation: '正确！Cell 11 专门 assert 了这个缺口的存在——缺的数据就诚实地缺着，不发明数据。' },
      { id: 'b', text: '用前后月份平均插补', correct: false, explanation: '错在原则：Notebook 的规则是 missing 保持 missing（"remain missing and are not invented"），插补会制造虚假信息。' },
      { id: 'c', text: '把 10 月整行删掉', correct: false, explanation: '错在结构：月历必须保持完整（这样 lag 1 才始终等于 1 个日历月），删除行会破坏对齐。' },
    ],
    conceptReview: 'Missing Values 与日期对齐（Module 3）',
  },
]

/** 课程最终目标：12 项「能够独立解释」自查清单 */
export const explainChecklist: { zh: string; en: string }[] = [
  { zh: '数据从哪里来（18 个 FRED 序列、CSV 备份、如何验证新鲜度）', en: 'Where the data comes from' },
  { zh: '为什么要拆分 Food at Home 与 Food Away from Home 两个分项', en: 'Why the two Food CPI components are forecast separately' },
  { zh: 'Predictor 和 Lag 如何选择（≤1999 样本、0–12 扫描、Training R²）', en: 'How predictors and lags were selected' },
  { zh: '三个样本阶段（Lag-training / Validation / Final Test）各自的作用', en: 'The role of the three sample periods' },
  { zh: 'Expanding-window Forecast 如何一步步运行', en: 'How the expanding-window forecast runs' },
  { zh: '12 个预测值分别由什么数据产生（每月的 Required Predictor Month）', en: 'Which data produces each of the 12 forecast months' },
  { zh: '哪些 Predictor 是 Observed、哪些是 Assumed（3 个月平均假设）', en: 'Which predictors are observed vs assumed' },
  { zh: '3.02% 与 4.34% 的区别（Primary Baseline vs Survey Sensitivity）', en: 'The difference between 3.02% and 4.34%' },
  { zh: 'OOS RMSE 与 OOS R² 各自代表什么、如何正确解读', en: 'What OOS RMSE and OOS R² mean' },
  { zh: '模型的六大限制及其应对', en: 'The main model limitations' },
  { zh: '如何将 Food CPI 并入 Bottom-up CPI Forecast（权重与贡献）', en: 'How Food CPI enters the bottom-up forecast' },
  { zh: '如何回答 Pacific Life 会议中的追问', en: 'How to answer Pacific Life follow-up questions' },
]
