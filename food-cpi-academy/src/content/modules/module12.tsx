import type { CourseModule } from '../../types'

/**
 * Module 12：Notebook Walkthrough
 * 16 章节地图 + 三个关键 cell 精讲 + 完整走读引导
 */
export const module12: CourseModule = {
  id: 'm12',
  order: 12,
  title: 'Module 12 · Notebook Walkthrough',
  subtitle: '45 个 cell、16 个章节：把你的代码逐格看透',
  icon: '📓',
  accent: 'violet',
  lessons: [
    {
      id: 'm12-l1',
      moduleId: 'm12',
      title: '如何读这份 Notebook：16 章节地图',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '记住 Notebook 的整体结构：45 cells、16 章节、18 个 FRED 序列',
            '知道每个章节大致在做什么、对应课程哪个模块',
            '学会"带着问题"读代码，而不是从头逐行硬啃',
          ],
        },
        {
          type: 'text',
          md: '你的 Notebook 标题是 **"Food CPI Forecast — Long-History and Survey-Enhanced Version"**，共 **45 个 cells**、**16 个主要章节**。它不是零散的代码堆，而是一条流水线：\n\n1. **准备**（第 1–6 章）：白话说明 → 导入包 → 定义日期与权重 → 数据字典 → 加载校验 → 转换\n2. **建模**（第 7–9 章）：选 lag → 冻结规格 → expanding-window 引擎\n3. **检验**（第 10–12 章）：Pre-2016 验证 → 2016+ 最终测试 → 组合 Total Food\n4. **交付**（第 13–16 章）：当前 12 个月预测 + audit → 最终结果解读 → 六大限制 → 导出 26 张表\n\n读代码的正确姿势：先问"这个 cell 回答什么问题"，再看实现。每个 cell 的答案都在 Notebook Walkthrough 页面里。',
        },
        {
          type: 'table',
          headers: ['章节', '在做什么', '对应课程模块'],
          rows: [
            ['1–2 白话说明与导入', '模型直觉 + 工具包', 'Module 0、1'],
            ['3 日期与权重', '三阶段边界 + 8.188/5.260/13.447', 'Module 5、10'],
            ['4–5 数据字典与加载', '18 个序列的元数据、新鲜度、断言', 'Module 2、3'],
            ['6 转换', 'YoY vs Level', 'Module 3'],
            ['7–8 选 lag 与冻结规格', '0–12 扫描 → 9 个模型', 'Module 4、7'],
            ['9 预测引擎', 'forecast_from_origin', 'Module 8'],
            ['10–11 验证与最终测试', '模型对比 → 成绩单', 'Module 5、11'],
            ['12 组合', '权重合并 + 分 horizon', 'Module 10、11'],
            ['13 当前预测', '12 个月 + 72 行 audit', 'Module 9'],
            ['14–16 结果、限制、导出', '3.02% / 4.34% + 六大限制 + 26 张表', 'Module 11、13'],
          ],
          note: '这张表就是"课程 ↔ 代码"的双向索引：忘了哪块，就知道去哪个 cell 复习。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '想确认"lag 1 是怎么选出来的"，应该去看哪一部分？',
            options: [
              {
                id: 'a',
                text: '第 7 章（Cell 16–17）：Choose lags using only data through 1999',
                correct: true,
                explanation: '正确！Cell 17 的 scan_univariate_lags 对每个候选指标扫描 lag 0–12，输出的 home_best_lags 表里 WPU02 的最优 lag=1（R² 0.769）。',
              },
              {
                id: 'b',
                text: '第 13 章：Produce the current 12-month forecast',
                correct: false,
                explanation: '错在阶段：第 13 章只是"使用"已冻结的 lag 生成当前预测。lag 的"选择"发生在第 7 章——阶段分工正是这个 Notebook 的设计核心。',
              },
              {
                id: 'c',
                text: '第 15 章：Limitations',
                correct: false,
                explanation: '错在位置：Limitations 讲模型边界，不讲 lag 怎么来。查"某个决定怎么做出的"，永远先找对应的方法论章节。',
              },
            ],
            conceptReview: 'Notebook 章节地图（Module 12）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把流水线四个阶段排序',
            instructions: '按 Notebook 从上到下的顺序排列四个阶段。',
            correctOrder: [
              '准备：数据字典、加载校验、YoY 转换',
              '建模：选 lag、冻结 9 个模型规格、写预测引擎',
              '检验：Pre-2016 验证、2016+ 最终测试、组合',
              '交付：当前 12 个月预测、限制说明、导出 26 张表',
            ],
            feedbackCorrect: '正确！这个顺序不能乱：没有干净数据谈不上建模，没有冻结规格谈不上诚实检验。',
            feedbackWrong: '想想依赖关系：检验必须在规格冻结之后，交付必须在检验之后——顺序就是方法论。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话说：为什么读这个 Notebook 应该"按章节带着问题读"，而不是从 Cell 0 逐行硬啃？',
            keywords: ['章节', '问题', '流水线'],
            modelAnswer: '因为 Notebook 是一条有明确分工的流水线，16 个章节各自回答一个问题（数据哪来、lag 怎么选、成绩多少……）。带着问题定位章节，再看 cell 的输入输出，比逐行读快得多，也不容易迷失在语法细节里。',
          },
        },
      ],
    },
    {
      id: 'm12-l2',
      moduleId: 'm12',
      title: '三个关键 Cell 精讲',
      xp: 50,
      minutes: 12,
      blocks: [
        {
          type: 'goal',
          items: [
            '深入理解三个最重要的 cell：17（lag 扫描）、21（预测引擎）、37（当前预测合并）',
            '对每个 cell 能回答：做什么/为什么/输入/输出/改错会怎样',
          ],
        },
        {
          type: 'text',
          md: '45 个 cell 里有三个是"心脏级"的——理解了它们，整个模型就通了。',
        },
        {
          type: 'notebook',
          title: '关键 Cell ① · Cell 17：lag 扫描',
          code: 'def scan_univariate_lags(frame, target, predictors, sample_end, max_lag=12, min_obs=60):\n    for predictor in predictors:\n        for lag in range(max_lag + 1):\n            pair = pd.DataFrame({\n                "target": frame[target],\n                "predictor": frame[predictor].shift(lag),\n            }).loc[:sample_end].dropna()\n            if len(pair) < min_obs:\n                continue\n            fitted = sm.OLS(pair["target"], sm.add_constant(pair["predictor"])).fit()',
          output: 'home_best_lags: ppi_processed_foods lag 1, R² 0.769, N=564 (1953-01 → 1999-12)',
          note: '做什么：对每个候选指标试 13 个 lag，记录 Training R²。为什么：用统一标准客观选 lag。输入：model_data + LAG_TRAIN_END。输出：最优 lag 表。改错会怎样：去掉 sample_end → lag 选择偷看未来，2016+ 成绩作废。与预测的关系：lag=1 决定了 2026-07 预测用 2026-06 的 PPI。',
        },
        {
          type: 'notebook',
          title: '关键 Cell ② · Cell 21：预测引擎',
          code: 'def forecast_from_origin(frame, model_name, spec, origin, horizon=12, information_cutoffs=None, ...):\n    train = train.loc[:origin].dropna()          # 只用"当时可得"的数据\n    model = sm.OLS(train["y"], x_train).fit(\n        cov_type="HAC", cov_kwds={"maxlags": 12}) # HAC 标准误\n    for h in range(1, horizon + 1):\n        predictor_date = target_date - pd.DateOffset(months=lag)\n        if known:   value = frame.loc[predictor_date, predictor]      # Observed\n        else:       value = frame.loc[:cutoff, predictor].dropna().tail(3).mean()  # 3 个月平均假设',
          output: '返回三张表：forecast（12 行预测）、audit（每个输入的来源）、coefficients（本 origin 的 α/β）',
          note: '做什么：在一个 origin 上完成"训练→预测→记账"全流程。为什么：历史回测与当前预测共用同一台引擎，规则绝对一致。改错会怎样：删掉 known 判断 → 未来数据泄漏，回测变作弊。与预测的关系：3.02% 就是它以 origin=2026-06 跑出来的。',
        },
        {
          type: 'notebook',
          title: '关键 Cell ③ · Cell 37：当前预测合并',
          code: 'result["food_yoy"] = (HOME_WEIGHT_INSIDE_FOOD * result["food_at_home_yoy"]\n                     + AWAY_WEIGHT_INSIDE_FOOD * result["food_away_yoy"])\nresult["contribution_to_headline_cpi_pp"] = result["food_yoy"] * 13.447 / 100\n\nerror_quantiles = primary_errors.groupby("Horizon_months")["Forecast_error"]\\\n    .quantile([0.025, 0.975])\nprimary_current_forecast["empirical_lower_95"] = food_yoy + error_q025',
          output: '2027-06: home 2.629, away 3.632, total 3.021, contribution 0.406, interval [-0.558, 8.227]',
          note: '做什么：按权重合并两个分项、算 Headline 贡献、用历史误差分位数加经验区间。为什么：交付给 Pacific Life 的最终数字矩阵在此成型。改错会怎样：权重写反 → Total Food 系统性偏差。与预测的关系：这就是 3.02% 与 0.41 pp 的出生地。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Cell 21 中 `train.loc[:origin]` 这一行的作用是什么？',
            options: [
              {
                id: 'a',
                text: '把训练数据截断到 forecast origin，保证只用"当时可得"的信息',
                correct: true,
                explanation: '正确！这一行就是 expanding-window 的"防偷看"闸门：origin 之后的数据一律不进训练集。',
              },
              {
                id: 'b',
                text: '为了让代码跑得更快',
                correct: false,
                explanation: '错在动机：截断确实少算一点，但目的完全是方法论——不用未来数据。就算更慢也必须截断。',
              },
              {
                id: 'c',
                text: '删除缺失值',
                correct: false,
                explanation: '错在对象：删缺失的是后面的 .dropna()。.loc[:origin] 做的是时间截断，两者职责不同。',
              },
            ],
            conceptReview: 'forecast_from_origin 的信息纪律（Module 8、12）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '把"改错后果"配给正确的 cell',
            instructions: '左边是一个改动，右边是它引发的灾难。',
            pairs: [
              { left: 'Cell 17 去掉 sample_end', right: 'lag 选择看到未来，最终测试成绩作废' },
              { left: 'Cell 21 删掉 known 判断', right: '未观察的 predictor 被"偷看"，回测变作弊' },
              { left: 'Cell 37 权重写反', right: 'Total Food 预测系统性偏向 Away 分项' },
              { left: 'Cell 13 periods=12 改成 1', right: 'YoY 变 MoM，全部回归与预测错位' },
            ],
            feedbackCorrect: '全对！能预判改错的后果，说明你真的理解了每个 cell 的职责。',
            feedbackWrong: '思路：先想这个 cell 守护的是什么原则（时间纪律/转换正确/权重正确），改错就是打破那个原则。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '不看笔记，说出 Cell 21（forecast_from_origin）的输入、输出和它守护的核心原则。',
            keywords: ['origin', 'audit', '3'],
            modelAnswer: '输入：model_data、模型规格（predictor+lag）、forecast origin、各 predictor 的信息截止日。输出：12 行预测表、每个输入的 audit 记录、本轮系数表。核心原则：训练只用 origin 之前的数据；所需 predictor 月份已观察就用真实值，否则用最新 3 个月平均并在 audit 中如实标注。',
          },
        },
      ],
    },
    {
      id: 'm12-l3',
      moduleId: 'm12',
      title: 'Checkpoint · 完整走读 45 个 Cell',
      xp: 100,
      minutes: 15,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '在 Notebook Walkthrough 页面完整浏览 45 个 cell',
            '能独立回答"任何一个 cell 是干什么的"',
          ],
        },
        {
          type: 'text',
          md: '现在去 **Notebook Walkthrough** 页面（左侧栏或底部导航 → 📓），完成一次完整走读。建议路线：\n\n1. 先用"全部章节"模式从 Cell 0 翻到 Cell 44，每格重点看「这段在做什么」和「与最终预测的关系」\n2. 再用章节过滤，把第 7、9、13 章（选 lag / 引擎 / 当前预测）各细读一遍\n3. 最后回来完成下面的 Checkpoint 测验',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '为什么要走读全部 45 格？',
          md: '会议上没人会问"请背诵 Cell 21"，但会问"你的断言检查了什么""audit 表哪来的"。走读的目标不是记住代码，而是**在脑子里建立索引**：任何问题都知道答案藏在哪个 cell。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Notebook 最后一个 cell（Cell 44）在做什么？',
            options: [
              {
                id: 'a',
                text: '刷新数据备份 CSV，并把 26 张已验证的结果表导出为 JSON 审计包',
                correct: true,
                explanation: '正确！这保证 Excel 输出和本网站的数据都能追溯到同一次 Notebook 运行——可复现交付的最后一环。',
              },
              {
                id: 'b',
                text: '重新训练所有模型',
                correct: false,
                explanation: '错在阶段：训练与预测在第 9–13 章早已完成。Cell 44 只负责把结果"打包存档"，不做任何计算修改。',
              },
              {
                id: 'c',
                text: '画最终的预测图',
                correct: false,
                explanation: '错在位置：预测图在 Cell 39（13.2 节）。Cell 44 是导出与备份——注意区分"展示"与"存档"两种收尾。',
              },
            ],
            conceptReview: '第 16 章：可复现交付（Module 12）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '这些产出分别诞生在哪一章？',
            instructions: '把每个产出放进它诞生的章节。',
            categories: ['第 7 章 选 lag', '第 11 章 最终测试', '第 13 章 当前预测'],
            items: [
              { text: 'WPU02 最优 lag = 1（R² 0.769）', category: '第 7 章 选 lag' },
              { text: 'Home baseline OOS RMSE 2.797', category: '第 11 章 最终测试' },
              { text: '72 行 Forecast Input Audit', category: '第 13 章 当前预测' },
              { text: '当前方程 1.408 + 0.650 × PPI(t−1)', category: '第 13 章 当前预测', note: '系数是在当前 origin（2026-06）估计的——历史回测中的系数由各自的 origin 决定。' },
              { text: 'Away legacy OOS R² 0.097', category: '第 11 章 最终测试' },
            ],
            feedbackCorrect: '完美！你的"代码索引"已经建立起来了。',
            feedbackWrong: '回忆流水线：选择类产出在第 7–8 章，成绩类在第 10–12 章，交付类在第 13 章之后。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: 'Checkpoint 总结：如果队友只有 2 分钟，你如何向他介绍这份 Notebook 的结构？',
            keywords: ['45', '16', '冻结'],
            modelAnswer: '这是一份 45 个 cell、16 个章节的流水线：前 6 章准备数据（18 个 FRED 序列、YoY 转换、调查保持 level）；第 7–9 章在 ≤1999 样本上选 lag、冻结 9 个模型规格、实现 expanding-window 引擎；第 10–12 章先在 2000–2015 验证、再在 2016+ 做最终测试并按权重组合；第 13–16 章生成当前 12 个月预测（含 72 行 audit）、解读结果（3.02% vs 4.34%）、列出六大限制并导出全部结果表。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经能在 Notebook 里自由导航了。接下来直面模型的软肋：Module 13 · Limitations。',
        },
      ],
    },
  ],
}
