import type { CourseModule } from '../../types'

/**
 * Module 8：Expanding-window Backtest
 * 一个 origin 的 8 步流程、三种窗口对比、三轮模拟器练习。
 * 数值出处：Notebook Cell 20/21/23 与 modelResults.ts（timeline、validation/finalTest）。
 */
export const module8: CourseModule = {
  id: 'm8',
  order: 8,
  title: 'Module 8 · Expanding-window Backtest',
  subtitle: '像开时间机器一样，重演历史上的每一次预测',
  icon: '🔁',
  accent: 'mint',
  lessons: [
    {
      id: 'm8-l1',
      moduleId: 'm8',
      title: '一个 origin 的 8 步流程',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解回测（Backtest）的时间机器思路',
            '能按顺序说出每个 forecast origin 发生的 8 步',
            '分清什么被重新估计（系数）、什么被冻结（lag 与变量选择）',
          ],
        },
        {
          type: 'text',
          md: '**回测（Backtest）**回答一个问题：如果我在历史上的每个月都用这套模型做预测，成绩会怎样？\n\n做法像开一台时间机器：把日历拨回某个月（这个月叫 **Forecast Origin**），假装未来还没发生，只用当时"已经存在"的数据训练模型、做出预测；然后快进到未来，对答案、记误差。把这个过程在几百个月上重复，就得到一份可信的历史成绩单——Module 7 那些 RMSE 就是这么来的。',
        },
        {
          type: 'text',
          md: 'Notebook Cell 21 的 `forecast_from_origin` 函数把每个 origin 要做的事固化成 **8 步**：\n\n1. 把日历停在 Forecast Origin，只允许使用 origin 及以前的数据\n2. 按 lag 平移 predictor，与 target 对齐成训练表（`shift(lag)` + `loc[:origin]`）\n3. 检查训练样本是否至少 **60 个月**（MIN_TRAINING_OBSERVATIONS），不够就跳过这个 origin\n4. 用 OLS（HAC 标准误）**重新估计** Alpha 和 Beta\n5. 为未来 1–12 个月找出各自需要的 Predictor Month（= 目标月 − lag）\n6. Predictor 已观察就用观测值；未观察就用**最新 3 个月平均**，并记入 Audit 表\n7. 计算 12 个月预测，同时记录 nominal 95% 区间和 No-change Benchmark\n8. Origin 前移一个月，训练窗口扩大一格，重复全过程\n\n注意第 4 步和第 8 步的组合：**系数在每个 origin 都重新估计**——所以历史回测里的系数和今天的 1.408 / 0.650 不一定相同；但 **lag 和变量选择永远冻结**（Cell 19 定下的规范不许动）。',
        },
        {
          type: 'formula',
          lhs: 'Forecast(origin, h)',
          rhs: 'α(origin) + β(origin) × Predictor(origin + h − lag)',
          note: 'α 和 β 带着 origin 的标记：它们是"只用截至该 origin 的数据"估出来的，随窗口扩大而更新。h 是 horizon（1 到 12）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '回测',
              en: 'Backtest',
              definition: '用历史数据模拟"如果当时做预测会怎样"，把模型放回过去反复考试，得到一份样本外成绩单。',
              example: 'Pre-2016 验证期让 8 个模型在 180 个 origin 上各考了 180 次 12-month-ahead。',
            },
            {
              zh: '预测起点',
              en: 'Forecast Origin',
              definition: '时间机器停下的那个月：训练只能用该月及以前的数据，预测对象是它之后的 1–12 个月。',
              example: '当前 origin 是 2026-06，预测范围 2026-07 至 2027-06。',
            },
            {
              zh: '最少训练样本',
              en: 'Minimum Training Observations',
              definition: '估计回归前要求的最小样本量，防止用太少的数据得到不可靠的系数。',
              example: 'Notebook 要求至少 60 个月；不足 60 个月的 origin 直接跳过（返回 None）。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 21 · forecast_from_origin 核心逻辑',
          code: 'train = pd.DataFrame({"y": frame[target]})\nfor predictor, lag in predictors.items():\n    train[predictor] = frame[predictor].shift(int(lag))\ntrain = train.loc[:origin].dropna()\n\nif len(train) < min_obs or pd.isna(frame.loc[origin, target]):\n    return None, None, None\n\nmodel = sm.OLS(train["y"], x_train).fit(\n    cov_type="HAC", cov_kwds={"maxlags": 12})\n\nfor h in range(1, horizon + 1):\n    target_date = origin + pd.DateOffset(months=h)\n    predictor_date = target_date - pd.DateOffset(months=int(lag))\n    if known:\n        value = frame.loc[predictor_date, predictor]   # Observed\n    else:\n        value = frame.loc[:cutoff, predictor].dropna().tail(3).mean()',
          output: '返回三张表：forecast_rows（12 个月预测 + 区间 + benchmark）、audit_rows（每个 predictor 的来源：Observed / 3-month average）、coefficient_rows（该 origin 的 α、β、HAC SE 等）。',
          note: 'Cell 20 的原文总结得最精炼：At every forecast origin the coefficients are re-estimated... The lags and variable choices remain fixed.（每个 origin 重估系数，lag 与变量选择保持固定。）',
        },
        {
          type: 'quiz',
          quiz: {
            question: '在每个 forecast origin，模型的哪些部分会更新？',
            options: [
              {
                id: 'a',
                text: '系数 α 和 β 用截至 origin 的全部数据重新估计；lag 与变量选择保持冻结',
                correct: true,
                explanation: '正确！这正是 Cell 20 的规则。也因此，历史回测中每个 origin 的系数都不一样，和当前方程的 1.408 / 0.650 不一定相同。',
              },
              {
                id: 'b',
                text: '所有东西都更新，包括每个 origin 重新扫描一次 lag',
                correct: false,
                explanation: '错在"重新扫描 lag"：lag 是 Module 4 里只用 1999 年及以前数据一次性选定、并在 Cell 19 冻结的。如果每个 origin 都重挑 lag，等于一边考试一边改模型，会引入 look-ahead 味道的规范漂移。只有系数会重估。',
              },
              {
                id: 'c',
                text: '什么都不变，系数也是一次估好后固定使用',
                correct: false,
                explanation: '错在"固定系数"：Cell 20 明确说 coefficients are re-estimated at every forecast origin。窗口每扩大一个月，α 和 β 都会微调——这正是 expanding window 的"学习"过程，也是当前方程系数与历史回测系数不同的原因。',
              },
            ],
            conceptReview: '预测起点（Forecast Origin）：重估系数 vs 冻结规范',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '验证期一共有多少个 origin？',
            instructions: '验证期的 forecast origins 从 2000-01 到 2014-12，每个月都是一个 origin。请算出 origin 总数。',
            prompt: '15 个年份 × 12 个月 = ?',
            answer: 180,
            tolerance: 0,
            unit: '个',
            solution: '2000 到 2014 共 15 个整年，15 × 12 = 180 个 origin。这正是验证成绩单里 Number_of_forecasts = 180 的来源：评估 12-month-ahead 时，每个 origin 恰好贡献一个 horizon = 12 的预测。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话把一个 origin 的 8 步流程讲给同学听，重点说清哪些更新、哪些冻结。',
            keywords: ['origin', '系数', 'lag'],
            modelAnswer: '把日历停在 origin，只用它之前的数据；按 lag 平移 predictor 对齐训练表；样本至少 60 个月；用 OLS + HAC 重新估计系数；给未来 12 个月各找 predictor month；已观察用观测值，否则用最新 3 个月平均并记入 audit；算出 12 个预测和区间；然后 origin 前移一个月重来。系数每个 origin 都重估，但 lag 和变量选择从 Cell 19 冻结后就不再动。',
          },
        },
      ],
    },
    {
      id: 'm8-l2',
      moduleId: 'm8',
      title: 'Fixed vs Rolling vs Expanding',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '能准确定义 Fixed / Rolling / Expanding 三种训练窗口',
            '理解各自的优缺点与适用场景',
            '知道 Notebook 选择 Expanding 的理由',
          ],
        },
        {
          type: 'text',
          md: '"窗口"指训练回归时用到的那段历史。窗口如何随 origin 前移，有三种流派：\n\n- **Fixed Window（固定窗口）**：只用一段固定的历史估计一次，之后不再更新。像拿着 2000 年印的地图开 2026 年的车——简单，但新信息完全进不来。\n- **Rolling Window（滚动窗口）**：窗口长度固定（比如永远只用最近 240 个月），随 origin 整体向前滑动，最旧的数据不断被挤出去。\n- **Expanding Window（扩展窗口）**：起点固定在序列开头，终点跟着 origin 走，窗口只增不减。\n\nNotebook 选择 **Expanding**：样本越滚越大，系数估计越来越稳；同时它天然不偷看未来——训练集永远只到 origin 为止。代价是很久以前的结构也会一直留在样本里。',
        },
        {
          type: 'widget',
          id: 'windowCompare',
          caption: '动手对比：拖动 origin，观察三种窗口的覆盖区间怎么变化',
        },
        {
          type: 'table',
          headers: ['窗口类型', '定义', '优点', '缺点', 'Notebook 采用？'],
          rows: [
            ['Fixed', '只用一段固定历史估计一次，之后不更新', '简单、系数完全稳定', '无法吸收新信息，越用越过时', '否'],
            ['Rolling', '长度固定，随 origin 整体向前滑动', '能适应结构变化，旧数据自动退场', '丢掉长历史信息；窗口小时估计噪声大', '否'],
            ['Expanding', '起点固定，终点随 origin 前移不断扩大', '样本越来越多、估计越来越稳；不偷看未来', '旧结构的影响会一直保留', '是'],
          ],
          note: '三种窗口都不偷看 origin 之后的数据，区别只在"往回看多远"。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '固定窗口',
              en: 'Fixed Window',
              definition: '训练样本固定不变：用一段历史估计一次模型，此后所有预测都用同一组系数。',
              example: '如果只用 1953-1999 估计一次并沿用到 2026，就是 fixed window——Notebook 没有这样做。',
            },
            {
              zh: '滚动窗口',
              en: 'Rolling Window',
              definition: '训练窗口长度固定，随 origin 整体前移；每前进一个月，就纳入一个新月份、丢掉一个最旧月份。',
              example: '例如"永远只用最近 20 年"：2016-01 的 origin 用 1996-2015，2016-02 的 origin 用 1996-02 至 2016-01。',
            },
            {
              zh: '扩展窗口',
              en: 'Expanding Window',
              definition: '起点固定在数据开头，终点随 origin 前移，窗口只增不减；每个 origin 都重估一次系数。',
              example: 'Home baseline 在 2026-06 origin 的训练窗口是 1953-01 至 2026-06，共 881 个月。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 21 · expanding_window_backtest',
          code: 'def expanding_window_backtest(frame, model_name, spec,\n                              first_origin, last_origin, horizon=12):\n    pieces = []\n    for origin in frame.loc[first_origin:last_origin].index:\n        forecast, _, _ = forecast_from_origin(\n            frame, model_name, spec, origin,\n            horizon=horizon,\n            information_cutoffs={p: origin for p in spec["predictors"]},\n        )\n        if forecast is not None:\n            pieces.append(forecast)\n    return pd.concat(pieces, ignore_index=True)',
          output: '把每个 origin 的 12 行预测拼成一张长表。训练集来自 forecast_from_origin 里的 train.loc[:origin]——起点是序列开头、终点是 origin，这正是 Expanding Window 的定义。',
          note: '回测时 information cutoff 设为 origin 本身：历史上的每次"考试"，模型只能看到 origin 及以前的所有序列。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Notebook 采用的 Expanding Window 的正确定义是？',
            options: [
              {
                id: 'a',
                text: '起点固定在序列开头，终点随 origin 前移而扩大，每个 origin 重估系数',
                correct: true,
                explanation: '正确！代码里的 train.loc[:origin] 就是证据：从序列开头一直取到 origin。origin 每前移一个月，训练集就多一行，系数随之更新。',
              },
              {
                id: 'b',
                text: '窗口长度固定，随 origin 整体向前滑动，旧数据不断被丢弃',
                correct: false,
                explanation: '错在类型：这是 Rolling Window 的定义。Expanding 不丢弃旧数据——1953 年的观测直到今天仍在 Home baseline 的训练集里（当前窗口 881 个月）。分辨口诀：滚动 = 平移，扩展 = 只增不减。',
              },
              {
                id: 'c',
                text: '只用一段固定历史估计一次系数，之后所有 origin 沿用不变',
                correct: false,
                explanation: '错在类型：这是 Fixed Window。Expanding 的核心恰恰是"每个 origin 都重估"——Cell 20 写明 coefficients are re-estimated at every forecast origin。固定系数无法吸收新信息，也解释不了回测中系数随时间变化的现象。',
              },
            ],
            conceptReview: '三种训练窗口（Fixed / Rolling / Expanding Window）的定义',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '这是哪种窗口？',
            instructions: '把每条描述放进对应的窗口类型。',
            categories: ['Fixed', 'Rolling', 'Expanding'],
            items: [
              { text: '起点固定，终点随 origin 扩大，窗口只增不减', category: 'Expanding' },
              { text: 'Notebook 回测引擎采用的方案', category: 'Expanding', note: 'train.loc[:origin]' },
              { text: '窗口长度固定，随 origin 整体向前滑动', category: 'Rolling' },
              { text: '最旧的数据会不断被挤出训练集', category: 'Rolling' },
              { text: '只估计一次系数，之后不再更新', category: 'Fixed' },
              { text: '完全无法吸收 origin 之后新发布的数据', category: 'Fixed' },
            ],
            feedbackCorrect: '全对！记住证据链：train.loc[:origin] 起点不动、终点前移 = Expanding。',
            feedbackWrong: '分辨口诀：Fixed = 一次估好不再动；Rolling = 长度不变整体平移（旧数据退场）；Expanding = 起点不动、终点前移（只增不减）。再对照表格试一次。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话对比三种窗口，并说明 Notebook 为什么用 Expanding。',
            keywords: ['fixed', 'rolling', 'expanding'],
            modelAnswer: 'Fixed 只用一段固定历史估计一次，之后不更新，无法吸收新信息；Rolling 窗口长度固定、整体向前滑，能适应结构变化但会丢掉长历史；Expanding 起点固定、终点随 origin 扩大，样本只增不减。Notebook 用 Expanding：样本越大系数越稳，训练集永远只到 origin 为止、不偷看未来，代价是旧结构会一直留在样本里。',
          },
        },
      ],
    },
    {
      id: 'm8-l3',
      moduleId: 'm8',
      title: 'Checkpoint · 亲手跑三个 origin',
      xp: 100,
      minutes: 12,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '在模拟器里独立完成"估计 → 预测 → 对答案 → 扩窗 → 前移"的完整循环',
            '亲眼看到系数随窗口扩大而更新、误差累积成 RMSE',
            '把 8 步流程内化成肌肉记忆',
          ],
        },
        {
          type: 'text',
          md: '理论学完了，现在亲手开一次时间机器。下面的 **Expanding-window Simulator** 是 Home baseline 的教学版：origin 从 2016-01 起，每轮只演示 **horizon = 1**（真实 Notebook 每个 origin 要预测 1–12 个月）。请完成三轮练习：\n\n**第一轮 · 走完一个 origin**：从 origin 2016-01 开始，依次点 Estimate Model → Forecast Next Month → Reveal Actual。记下三样东西：训练样本量 n、这一轮的 α 和 β、预测值与实际值的误差。\n\n**第二轮 · 观察窗口扩大**：点 Add Month to Training Window 和 Move to Next Origin，再估计一次。对比上一轮：n 加了 1，α 和 β 发生了微小变化——这就是"每个 origin 重新估计"的含义。\n\n**第三轮 · 连续跑 12 个以上 origin**：让误差表积累起来，观察运行中的 RMSE 从忽大忽小逐渐稳定。这个"逐 origin 累积误差、汇总成 RMSE"的过程，正是 Module 7 成绩单里 180 个验证预测和 113 个测试预测的由来。',
        },
        {
          type: 'widget',
          id: 'expandingSim',
          caption: 'Expanding-window Simulator（Home baseline 教学版，horizon = 1）：请按上面三轮练习操作',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '样本外',
              en: 'Out-of-Sample (OOS)',
              definition: '被预测的月份不在训练样本里：模型在做出预测时从未见过它的答案。',
              example: '模拟器里每次 Reveal Actual 揭晓的那个月，都不在当轮的训练窗口内。',
            },
            {
              zh: '预测步长',
              en: 'Forecast Horizon',
              definition: '预测的是 origin 之后第几个月，记作 h。Notebook 每个 origin 预测 h = 1 到 12。',
              example: '模拟器只演示 h = 1；Module 11 会看到不同 h 的 RMSE 差别很大。',
            },
            {
              zh: '均方根误差',
              en: 'RMSE (Root Mean Squared Error)',
              definition: '把所有误差平方后取平均再开方，单位与预测对象相同（这里是百分点 pp）。Module 11 详讲。',
              example: '模拟器的运行 RMSE 会随着 origin 增多逐渐稳定，缩微版的 2016+ final test 就在你眼前发生。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 23 · 批量跑 180 个 origin',
          code: 'validation_backtests = {\n    name: expanding_window_backtest(\n        model_data,\n        name,\n        model_specs[name],\n        VALIDATION_FIRST_ORIGIN,   # 2000-01\n        VALIDATION_LAST_ORIGIN,    # 2014-12\n    )\n    for name in validation_models\n}',
          output: '8 个模型 × 180 个 origin，每个 origin 生成 12 行预测；筛出 Horizon_months == 12 后，每个模型恰好 180 个 12-month-ahead 预测，汇总成 Module 7 的验证成绩单。',
          note: '你在模拟器里手动做的循环，Notebook 用一个字典推导式在几秒内跑完。2016+ final test 也是同一台引擎，只是把 origin 区间换成 2016-01 起（113 个 12-month-ahead 预测）。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '2016+ final test 中的 113 个 12-month-ahead 预测，为什么每一个都算 out-of-sample？',
            options: [
              {
                id: 'a',
                text: '因为每个预测生成时，训练窗口只包含 origin 及以前的数据，被预测的月份从未参与系数估计',
                correct: true,
                explanation: '正确！Out-of-sample 的判定标准是"预测时看不到答案"。expanding window 保证训练集止步于 origin，而预测对象是 origin 之后 12 个月——考卷上的题目从没出现在复习资料里。',
              },
              {
                id: 'b',
                text: '因为 2016 年以后的数据从未进入过任何训练窗口',
                correct: false,
                explanation: '错在对 expanding 的理解：origin 前移后，2016+ 的数据会陆续进入训练窗口（比如 2020-01 origin 的训练集就包含 2016-2019）。关键不是"永远不用"，而是"预测某个月时还看不到那个月"。每个预测相对自己的 origin 都是未来。',
              },
              {
                id: 'c',
                text: '因为数据被随机抽样分成了训练集和测试集',
                correct: false,
                explanation: '错在方法：时间序列不能随机切分——把 2020 年的数据放进训练集去预测 2018 年，等于用未来预测过去，制造 look-ahead bias。正确做法是按时间推进的 expanding window：训练永远在前、预测永远在后。',
              },
            ],
            conceptReview: '样本外（Out-of-Sample）与 expanding window 的时间顺序',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把 8 步流程排成正确顺序',
            instructions: '不看笔记，把一个 forecast origin 内发生的 8 步按先后排序。',
            correctOrder: [
              '把日历停在 Forecast Origin，只允许使用 origin 及以前的数据',
              '按 lag 平移 predictor，与 target 对齐成训练表',
              '检查训练样本是否至少 60 个月',
              '用 OLS（HAC）重新估计 Alpha 和 Beta',
              '为未来 1–12 个月找出各自需要的 Predictor Month',
              '已观察用观测值，未观察用最新 3 个月平均并记入 Audit',
              '计算 12 个月预测并记录区间与 No-change Benchmark',
              'Origin 前移一个月，窗口扩大，重复全过程',
            ],
            feedbackCorrect: '完美！这 8 步就是 forecast_from_origin + expanding_window_backtest 的全部剧情——你现在可以在白板上把回测引擎讲给任何人听。',
            feedbackWrong: '抓住依赖关系倒推：没有对齐的训练表就没法检查样本量；没通过样本检查就不能估系数；没有系数就无法预测；预测完才轮到 origin 前移。先"停表 → 对齐 → 检查 → 估计"，再"找 predictor → 定来源 → 算预测"，最后"前移重来"。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '完成三轮模拟后，用自己的话描述：连续跑多个 origin 时，你看到了什么？（提到窗口、系数和 RMSE 的变化）',
            keywords: ['origin', '扩大', 'rmse'],
            modelAnswer: '每前移一个 origin，训练窗口就扩大一个月，n 加 1，α 和 β 被重新估计、发生微小变化；每轮预测对完答案后误差被记进累计表，运行中的 RMSE 一开始波动较大，随着 origin 越跑越多逐渐稳定。Notebook 就是把这个循环跑了 180 次（验证期）和 113 次（final test），才得到 RMSE 成绩单。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经亲手驾驶过回测引擎：8 步流程、expanding window、误差如何汇成 RMSE。下一站 Module 9：把引擎开到当前 origin 2026-06，看未来 12 个月的预测是怎么一格一格算出来的。',
        },
      ],
    },
  ],
}
