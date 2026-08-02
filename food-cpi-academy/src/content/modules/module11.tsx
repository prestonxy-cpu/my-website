import type { CourseModule } from '../../types'

/**
 * Module 11：评价预测
 * Forecast Error / RMSE / MAE / No-change Benchmark / OOS R² / 两种区间 / Coverage
 */
export const module11: CourseModule = {
  id: 'm11',
  order: 11,
  title: 'Module 11 · 评价预测',
  subtitle: 'RMSE、OOS R²、预测区间：模型到底靠不靠谱',
  icon: '📏',
  accent: 'sky',
  lessons: [
    {
      id: 'm11-l1',
      moduleId: 'm11',
      title: 'Forecast Error、RMSE 与 MAE',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '会计算一个预测的 Forecast Error',
            '理解 RMSE 和 MAE 各自的含义与单位（percentage points）',
            '知道 Primary Baseline 的 12 个月 OOS RMSE 是 2.035 pp',
          ],
        },
        {
          type: 'text',
          md: '模型每做一次预测，等实际数据公布后就产生一个**预测误差（Forecast Error）**：\n\nForecast Error = Actual − Forecast\n\n比如模型预测某月 Food CPI YoY 是 3.0%，实际是 4.2%，误差就是 +1.2 个百分点（percentage points，pp）。一次误差说明不了什么——评价模型要看**很多次预测的误差汇总**。最常用的两个汇总指标：\n\n- **RMSE（Root Mean Squared Error，均方根误差）**：把每个误差平方、取平均、再开根号。平方会放大大误差，所以 RMSE 对"偶尔错得离谱"很敏感。\n- **MAE（Mean Absolute Error，平均绝对误差）**：把每个误差取绝对值再平均，更"温和"，代表典型误差的大小。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '预测误差',
              en: 'Forecast Error',
              definition: '实际值减去预测值。正数表示低估了通胀，负数表示高估了。',
              example: '在 expanding-window 回测中，2016+ 共产生 113 个 12-month-ahead 误差。',
            },
            {
              zh: '均方根误差',
              en: 'RMSE (Root Mean Squared Error)',
              definition: '误差平方的平均值再开根号。对大误差更敏感，单位与预测对象相同（pp）。',
              example: 'Primary Baseline 的 12M OOS RMSE = 2.035 pp。',
            },
            {
              zh: '平均绝对误差',
              en: 'MAE (Mean Absolute Error)',
              definition: '误差绝对值的平均，代表"典型情况下差多少"。',
              example: 'Primary Baseline 的 12M OOS MAE = 1.381 pp。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 23 · calculate_oos_metrics',
          code: 'errors = result["Actual"] - result["Forecast"]\nreturn pd.Series({\n    "OOS_RMSE": np.sqrt(np.mean(errors ** 2)),\n    "OOS_MAE": np.mean(np.abs(errors)),\n    ...\n})',
          output: 'Primary baseline · 12-month ahead: OOS_RMSE 2.035, OOS_MAE 1.381 (113 forecasts)',
          note: '全 Notebook 的"成绩"都由这一个函数计算，保证验证期、测试期、组合模型的指标口径完全一致。',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '为什么 RMSE ≥ MAE？',
          md: 'Primary 的 RMSE（2.035）比 MAE（1.381）大不少，说明误差分布里有一些"离谱时刻"——主要来自 2021–2022 年食品通胀急速飙升期，模型的 12 个月前瞻跟不上急转弯。平方项把这些时刻放大了。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '模型预测 2.5%，实际 2.0%，Forecast Error 是多少？',
            options: [
              {
                id: 'a',
                text: '−0.5 pp（实际减预测）',
                correct: true,
                explanation: '正确！Error = Actual − Forecast = 2.0 − 2.5 = −0.5 pp。负号说明模型高估了通胀。',
              },
              {
                id: 'b',
                text: '+0.5 pp（预测减实际）',
                correct: false,
                explanation: '错在方向：Notebook 的定义是 Actual − Forecast（Cell 23）。符号很重要——它区分高估与低估，也决定了 Mean Error 的解读。',
              },
              {
                id: 'c',
                text: '0.5%，也就是相对误差 20%',
                correct: false,
                explanation: '错在单位概念：我们衡量的是百分点差（percentage points），2.5% 和 2.0% 相差 0.5 pp，而不是"20% 的相对误差"。通胀预测评估惯用绝对差。',
              },
            ],
            conceptReview: 'Forecast Error 的定义（Module 11）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '手算一个迷你 RMSE',
            instructions: '三次预测的误差分别是 +1、−2、+2（pp）。计算 RMSE（保留 2 位小数）。',
            prompt: 'RMSE = sqrt((1² + (−2)² + 2²) / 3) = sqrt(9/3) = ?',
            answer: 1.73,
            tolerance: 0.01,
            unit: 'pp',
            solution: '平方和 = 1 + 4 + 4 = 9；平均 = 3；开根号 ≈ 1.73 pp。注意 MAE 会是 (1+2+2)/3 ≈ 1.67——RMSE 略大，因为平方放大了 2 pp 的误差。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：RMSE 和 MAE 有什么区别？为什么 Notebook 两个都算？',
            keywords: ['平方', 'RMSE', 'MAE'],
            modelAnswer: 'MAE 是误差绝对值的平均，代表典型误差；RMSE 先平方再平均开根号，会放大偶发的大误差。两个都看可以同时了解"平时差多少"（MAE 1.381 pp）和"最坏情况有多伤"（RMSE 2.035 pp，被 2021–22 飙升期拉大）。',
          },
        },
      ],
    },
    {
      id: 'm11-l2',
      moduleId: 'm11',
      title: 'No-change Benchmark 与 OOS R²',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解 No-change Benchmark 是什么、为什么用它当参照',
            '能准确解释 OOS R² = 0.598（以及它不是什么）',
            '理解 Away 模型 0.097 与 Survey 0.636 各自说明什么',
          ],
        },
        {
          type: 'text',
          md: '"RMSE 2.035 pp"到底算好还是差？孤立的数字没有答案——必须和一个**参照物**比。Notebook 选的参照物是 **No-change Benchmark（不变基准）**：假装我们没有模型，预测"未来 12 个月的 Food CPI YoY 就等于今天的值"。\n\n**OOS R²（Out-of-Sample R-squared）** 就是模型相对这个基准的成绩：\n\nOOS R² = 1 − SSE(model) / SSE(no-change)\n\n其中 SSE 是平方误差之和。**OOS R² = 0.598 表示 Primary Baseline 相对于 No-change Benchmark，将样本外平方预测误差降低了约 59.8%。它不是 59.8% 的预测准确率。**\n\n- 正值 → 打败了朴素预测\n- 0 → 和朴素预测打平\n- 负值 → 还不如什么都不做',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '不变基准',
              en: 'No-change Benchmark',
              definition: '把"最新观测值不变地延续到未来"当作预测的朴素基准（也叫 naive forecast）。',
              example: '在 origin 2026-06 上，no-change 对未来 12 个月的预测都是 2.99%。',
            },
            {
              zh: '样本外 R 平方',
              en: 'OOS R² (vs No-change)',
              definition: '1 − 模型平方误差和 ÷ 基准平方误差和。衡量模型相对朴素预测把平方误差压低了多少比例。',
              example: 'Primary Total Food 12M：0.598；Survey：0.636；Away Legacy：0.097。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'finalTestR2',
          caption: '2016+ Final Test 各模型 12M OOS R²（相对 No-change）。正值都代表打败了朴素预测，高低反映改善幅度',
        },
        {
          type: 'callout',
          variant: 'danger',
          title: '会议高频误读警告',
          md: '把 OOS R² 说成"准确率"是最常见的错误。正确说法：**"Our model reduces out-of-sample squared errors by about 59.8% relative to a no-change forecast."** 另外注意：Away 模型的 0.097 说明它相对 no-change 的改善较弱（只降了 9.7%）——要诚实承认，同时指出它的其他价值（12 个月预测全部基于 observed 工资、模型延续性）。',
        },
        {
          type: 'table',
          headers: ['Component', 'Model', 'OOS RMSE', 'OOS R² vs No-change'],
          rows: [
            ['Food at Home', 'Home Baseline', '2.797 pp', '0.600'],
            ['Food Away from Home', 'Away Legacy All-Employee', '1.610 pp', '0.097'],
            ['Total Food CPI', 'Primary Baseline', '2.035 pp', '0.598'],
            ['Total Food CPI', 'Survey Sensitivity', '1.935 pp', '0.636'],
          ],
          note: '2016+ Final Test，12-month-ahead（Notebook Cell 41）。Survey 的 R² 更高不代表应取代 Primary——见 Module 7。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'OOS R² = 0.598 的准确含义是？',
            options: [
              {
                id: 'a',
                text: '模型 59.8% 的预测是正确的',
                correct: false,
                explanation: '错在概念：OOS R² 不数"对错次数"。它比较的是模型与 no-change 基准的平方误差总量。永远不要在会议上说"59.8% accurate"。',
              },
              {
                id: 'b',
                text: '相对 No-change Benchmark，样本外平方预测误差降低了约 59.8%',
                correct: true,
                explanation: '正确！1 − SSE(model)/SSE(no-change) = 0.598。这是相对朴素预测的改善比例，按平方误差衡量。',
              },
              {
                id: 'c',
                text: '模型解释了 59.8% 的通胀波动',
                correct: false,
                explanation: '错在混淆：那是 in-sample R² 的说法（拟合历史）。OOS R² 衡量的是真实预测场景下相对基准的表现，两者可能差别很大——Home baseline 的 in-sample R² 是 0.715，OOS R² 是 0.600。',
              },
            ],
            conceptReview: 'OOS R² vs No-change Benchmark',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '把数字配给正确的解读',
            instructions: '左边是 2016+ Final Test 的 OOS R²，右边是对应解读。',
            pairs: [
              { left: '0.600（Home Baseline）', right: '相对基准改善强，主力分项模型' },
              { left: '0.097（Away Legacy）', right: '改善较弱但为正，靠 observed 数据与延续性补足价值' },
              { left: '0.636（Survey Sensitivity）', right: '指标更高，但因区域性调查只作敏感性情景' },
              { left: '假设为 −0.2 的某模型', right: '比 no-change 还差，不应采用' },
            ],
            feedbackCorrect: '完全正确！你已经能像评审一样读这张表了。',
            feedbackWrong: '回忆判断规则：正负看是否打败 no-change，大小看改善幅度，而"用不用"还要考虑可解释性。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '面试官问"What does an OOS R² of 0.598 mean?"，写下你的中文答题要点（含它不是什么）。',
            keywords: ['no-change', '59.8', '平方'],
            modelAnswer: 'OOS R² 以 no-change 预测（把最新 YoY 延续 12 个月）为基准：0.598 表示模型的样本外平方误差总和比基准低约 59.8%。它不是准确率，也不是解释了多少历史波动；正值说明打败朴素预测，仅此而已。',
          },
        },
      ],
    },
    {
      id: 'm11-l3',
      moduleId: 'm11',
      title: '两种 Prediction Interval 与 Coverage',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '区分 Nominal Prediction Interval 与 Empirical OOS-error Interval',
            '会读 2027-06 的经验区间 [−0.56%, 8.23%]',
            '理解 Interval Coverage 如何检验区间的诚实度',
          ],
        },
        {
          type: 'text',
          md: '点预测（3.02%）只是故事的一半，另一半是**不确定性**。Notebook 给出两种 95% 区间：\n\n1. **名义预测区间（Nominal Prediction Interval）**：由回归的统计公式直接推出，依赖理论假设（误差正态、方差稳定等）。\n2. **经验 OOS 误差区间（Empirical OOS-error Interval）**：不信理论、信历史——取回测中每个 horizon 实际误差的 2.5% 和 97.5% 分位数，叠加到当前预测上。模型历史上真犯过多大的错，区间就有多宽。\n\n**Interval Coverage（区间覆盖率）** 用来检验区间是否诚实：号称 95% 的区间，历史上实际罩住实际值的比例应接近 95%。Home Baseline 的名义区间覆盖率只有 81.4%——比承诺的窄了，这正是 Notebook 把经验区间作为主要可靠性度量的原因。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '名义预测区间',
              en: 'Nominal Prediction Interval',
              definition: '从回归公式的理论假设推导出的区间。假设不成立时会过窄或过宽。',
              example: 'Home Baseline 名义 95% 区间的历史覆盖率只有 0.814。',
            },
            {
              zh: '经验误差区间',
              en: 'Empirical OOS-error Interval',
              definition: '用历史回测误差的分位数构造的区间，反映模型实际犯错的幅度。',
              example: '2027-06 的经验 95% 区间：约 −0.56% 到 8.23%。',
            },
            {
              zh: '区间覆盖率',
              en: 'Interval Coverage',
              definition: '历史上实际值落入区间的比例。诚实的 95% 区间覆盖率应接近 0.95。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'forecastFan',
          caption: '当前 12 个月预测与经验 95% 区间：越远的月份区间越宽（h12 宽达约 8.8 pp）',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么 Notebook 更信任 Empirical Interval 而不是 Nominal Interval？',
            options: [
              {
                id: 'a',
                text: '因为名义区间的历史覆盖率（0.814）低于承诺的 0.95，说明理论假设在这个数据上不成立',
                correct: true,
                explanation: '正确！区间的可信度要用历史覆盖率检验。经验区间直接从真实误差构造，天然与历史表现一致。',
              },
              {
                id: 'b',
                text: '因为经验区间更窄、更好看',
                correct: false,
                explanation: '事实相反：经验区间往往更宽（h12 达 8.8 pp）。选它不是因为好看，而是因为诚实——它反映模型真实犯过的错。',
              },
              {
                id: 'c',
                text: '因为名义区间计算太复杂',
                correct: false,
                explanation: '错在理由：statsmodels 一行就能算名义区间。弃用它是因为覆盖率检验不合格，不是计算难度。',
              },
            ],
            conceptReview: 'Empirical Interval 与 Coverage（Module 11）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: 'Nominal 还是 Empirical？',
            instructions: '把每个描述放进正确的类别。',
            categories: ['Nominal Interval', 'Empirical Interval'],
            items: [
              { text: '由回归公式和分布假设推出', category: 'Nominal Interval' },
              { text: '取历史误差的 2.5%/97.5% 分位数', category: 'Empirical Interval' },
              { text: '历史覆盖率仅 0.814，低于承诺', category: 'Nominal Interval', note: '覆盖率不达标正是它被降级的原因。' },
              { text: '2027-06 给出 [−0.56%, 8.23%]', category: 'Empirical Interval' },
              { text: 'Notebook 的主要可靠性度量', category: 'Empirical Interval' },
            ],
            feedbackCorrect: '正确！记住口诀：理论推的叫 Nominal，历史量出来的叫 Empirical。',
            feedbackWrong: '判断标准：这个区间的宽度来自公式假设，还是来自模型历史上真实的误差记录？',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '向 Pacific Life 解释：为什么 3.02% 的预测要配一个 [−0.56%, 8.23%] 这么宽的区间？',
            keywords: ['区间', '误差', '12'],
            modelAnswer: '因为食品通胀在 12 个月尺度上波动很大。这个区间不是理论摆设，而是模型历史上 12-month-ahead 误差的真实分布：过去它最多高估/低估过这么多，未来就应该按这个幅度留出不确定性。区间宽是诚实，不是模型差——配合 OOS R² 0.598，说明模型在如此难的任务上仍稳定优于朴素预测。',
          },
        },
      ],
    },
    {
      id: 'm11-l4',
      moduleId: 'm11',
      title: 'Checkpoint · 短期为什么打不过 No-change',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '读懂分 horizon 的 RMSE 曲线',
            '解释为什么 h1 的 OOS R² 是 −13.5、模型价值在中长期',
            '通过本模块 Checkpoint',
          ],
        },
        {
          type: 'text',
          md: '把 113 组预测按 **Forecast Horizon**（提前几个月）拆开看，会发现一个反直觉的事实：\n\n- horizon 1（提前 1 个月）：Primary 的 OOS R² 是 **−13.5**——远远不如 no-change！\n- horizon 4 起转正，horizon 8 附近最高（0.641），horizon 12 为 0.598。\n\n为什么短期打不过？因为 YoY 通胀有巨大**惯性**：下个月的 YoY 和这个月几乎一样（12 个月的重叠窗口里只换了 1 个月），no-change 在 1 个月尺度上几乎是完美预测，任何模型的噪声都会输给它。而 12 个月之后，今天的值早就"过期"了，领先指标的信息才真正值钱。\n\n这正是项目把 **12-month-ahead** 作为主要评估口径的原因——它是模型真正能创造价值的期限。',
        },
        {
          type: 'chart',
          id: 'horizonRmse',
          caption: 'OOS RMSE 按 horizon：Primary 在短期占优、Survey 在长期略优；两者都在 h4 前后最准（YoY 惯性 + 信息新鲜度的平衡点）',
        },
        {
          type: 'notebook',
          title: 'Cell 31 · 分 horizon 指标',
          code: 'for horizon, group in backtest.groupby("Horizon_months"):\n    metrics = metrics_for_total(group)',
          output: 'Primary baseline: h1 RMSE 1.576 (OOS R² -13.518) ... h12 RMSE 2.035 (OOS R² 0.598)',
          note: '同一个模型，不同 horizon 的成绩天差地别——汇报时必须说明口径是 12-month-ahead。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么 horizon 1 上 Primary 的 OOS R² 是 −13.5？',
            options: [
              {
                id: 'a',
                text: '因为 YoY 有强惯性，no-change 在 1 个月尺度近乎完美，模型的任何噪声都相对放大',
                correct: true,
                explanation: '正确！h1 的 no-change 误差极小（分母小），模型哪怕差一点点，比值也会变得很难看。这不是模型失败，是基准太强。',
              },
              {
                id: 'b',
                text: '因为模型在短期会故意加大误差',
                correct: false,
                explanation: '错在拟人化：模型没有"故意"。真正原因是基准（no-change）在短期几乎不犯错，使得比较对模型极为苛刻。',
              },
              {
                id: 'c',
                text: '因为数据在短期有 bug',
                correct: false,
                explanation: '错在归因：数据没有问题。−13.5 是 OOS R² 公式在"基准误差极小"时的正常表现，Survey 模型在 h1 更低（−29.6），同样原因。',
              },
            ],
            conceptReview: 'Horizon 与 No-change 惯性（Module 11）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把评价指标按"回答的问题"排成逻辑链',
            instructions: '从"单次预测"到"整体可信度"，按逻辑顺序排列。',
            correctOrder: [
              'Forecast Error：这一次差了多少',
              'RMSE / MAE：很多次预测平均差多少',
              'No-change Benchmark：不用模型会差多少',
              'OOS R²：模型比不用模型好多少',
              'Empirical Interval：未来的预测应留多宽的不确定性',
              'Coverage：这些区间历史上守信吗',
            ],
            feedbackCorrect: '完美！这条链就是 Module 11 的全部逻辑：从一次误差到一套可信度体系。',
            feedbackWrong: '提示：先能度量单次误差，才能汇总；有了汇总，才需要基准来定义"好"；最后用区间和覆盖率交代不确定性。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: 'Checkpoint 总结：用 3–5 句话向队友汇报 Primary Baseline 的"成绩单"（至少引用两个数字）。',
            keywords: ['2.035', '0.598', 'no-change'],
            modelAnswer: 'Primary Baseline 在 2016+ 最终测试中，12-month-ahead 的 OOS RMSE 是 2.035 pp、MAE 1.381 pp；相对 no-change 基准，OOS R² 为 0.598，即平方误差降低约六成。短期（h1–h3）打不过 no-change 是 YoY 惯性所致，模型价值集中在中长期。未来 12 个月预测配有经验 95% 区间（2027-06 为 −0.56% 到 8.23%），区间宽度来自模型历史真实误差。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经掌握了完整的模型评价语言。下一个模块：钻进 Notebook 的 45 个 cell，把代码逐格看透。',
        },
      ],
    },
  ],
}
