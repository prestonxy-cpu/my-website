import type { CourseModule } from '../../types'

/**
 * Module 5：防止 Look-ahead Bias
 * 用"考试偷看答案"的比喻讲清前视偏差，
 * 建立三个样本阶段的时间线，理解"先冻结、再测试"的纪律。
 */
export const module5: CourseModule = {
  id: 'm5',
  order: 5,
  title: 'Module 5 · 防止 Look-ahead Bias',
  subtitle: '像监考老师一样守住数据的时间线',
  icon: '⏳',
  accent: 'rose',
  lessons: [
    {
      id: 'm5-l1',
      moduleId: 'm5',
      title: '偷看答案：什么是 Look-ahead Bias',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '用考试比喻理解前视偏差（Look-ahead Bias）',
            '明白为什么偷看未来信息会让模型表现"虚高"',
            '知道本项目防止 Look-ahead Bias 的第一道防线在哪里',
          ],
        },
        {
          type: 'text',
          md: '想象你在准备一场重要考试。你手上有历年真题（练习册），最后还有一场从未见过题目的正式考试。如果你**先偷看了正式考试的答案**，再据此"选择"复习方法，最后考了高分——这个高分能证明你真的会吗？当然不能，分数是**虚高**的。\n\n预测模型也一样。如果我们在挑选 Lag 或挑选模型时，偷看了后面测试期的结果，再回头选出"在测试期表现最好"的那个，那么它的测试成绩就像偷看答案考出的高分：好看，但不可信。这种错误叫**前视偏差（Look-ahead Bias）**——在做决定的那个时点，用了当时不可能拿到的未来信息。',
        },
        {
          type: 'text',
          md: '本项目的第一道防线修在 Lag 选择上：扫描 0–12 共 13 个 lag 时，**只允许使用 1999-12 及以前的数据**，用 Training R² 选出每个候选指标的最优 lag（例如 WPU02 自己的最优 lag 是 1，Training R² 约 0.769），选完立即**冻结**。之后的 2000–2014 验证和 2016 年起的最终测试，都不允许回头修改——这样 2016+ 的成绩才是真正"没见过题目"考出来的。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '前视偏差',
              en: 'Look-ahead Bias',
              definition: '在某个时点做决定时，使用了那个时点还不存在或还拿不到的未来信息，导致回测表现被高估。',
              example: '看完 2016+ 测试的 RMSE 再回头换 lag，就是典型的 Look-ahead Bias。',
            },
            {
              zh: '样本外',
              en: 'Out-of-Sample (OOS)',
              definition: '模型在"从未参与模型选择或估计"的数据上的表现，是检验预测能力的真正考场。',
              example: '2016 年起的 Final Test 就是本项目的样本外考场。',
            },
            {
              zh: '信息截止',
              en: 'Information Cutoff',
              definition: '做某次预测时，允许使用的最晚数据月份。晚于截止的数据一律当作"不存在"。',
              example: '在 origin 2026-06 做预测时，PPI 的信息截止就是 2026-06。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook 第 7 章开头：先冻结，再考试',
          code: '# Cell 16 (markdown)\n"The lag with the highest training-sample R² is frozen\n before the 2000-2015 validation exercise and the 2016+\n final test. This is different from choosing a lag after\n seeing the final test results.\n The latter would make the test unfair."',
          note: 'Notebook 原文明确写下了这条纪律：lag 在看到验证与测试结果之前就被冻结。"先看结果再选 lag" 会让测试不公平（unfair）——这正是 Look-ahead Bias。',
        },
        {
          type: 'chart',
          id: 'timelineSamples',
          caption: '三个样本阶段的时间轴：≤1999-12 选 lag，2000-01→2014-12 验证，2016-01 起最终测试',
        },
        {
          type: 'callout',
          variant: 'danger',
          title: '为什么"虚高"如此危险',
          md: '带 Look-ahead Bias 的模型在回测里战无不胜，一到真实预测就现原形——因为真实世界里没有答案可偷看。Pacific Life 要的是**未来**的预测，所以回测必须诚实模拟"当时只知道什么"。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '下面哪种做法属于 Look-ahead Bias？',
            options: [
              {
                id: 'a',
                text: '只用 1999-12 及以前的数据扫描 lag，选定后冻结不再改',
                correct: false,
                explanation: '错在方向：这恰恰是**防止** Look-ahead Bias 的标准做法——选择只用早期数据，后面的数据留给检验。正确思路：Bias 出现在"用了当时拿不到的未来信息"时。',
              },
              {
                id: 'b',
                text: '看完 2016+ 最终测试的 RMSE，回头换一个表现更好的 lag，再宣布模型"通过了测试"',
                correct: true,
                explanation: '正确！测试结果反过来影响了模型选择，等于先看答案再考试。此时的测试成绩已被污染，不再代表真实的样本外能力。',
              },
              {
                id: 'c',
                text: '在 origin 2026-06 做预测时，只使用截至 2026-06 的 PPI 数据',
                correct: false,
                explanation: '错在判断：这是遵守 Information Cutoff 的正确做法，恰好是防线本身。为什么错——预测者当时确实能拿到 2026-06 及以前的数据，没有偷看任何未来。应复习 Look-ahead Bias 的定义。',
              },
            ],
            conceptReview: '前视偏差（Look-ahead Bias）的定义',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '有没有偷看答案？',
            instructions: '判断下列每种做法是否存在 Look-ahead Bias，放进正确的桶里。',
            categories: ['有 Look-ahead Bias', '没有 Look-ahead Bias'],
            items: [
              { text: '看完 2016+ 测试的 RMSE 再回头改 lag', category: '有 Look-ahead Bias' },
              { text: '只用 1999-12 及以前的数据扫描并冻结 lag', category: '没有 Look-ahead Bias' },
              { text: '预测 2026-07 时，使用 2026-07 当月才公布的数据', category: '有 Look-ahead Bias' },
              { text: '每个 forecast origin 只用截至该月的观测数据估计系数', category: '没有 Look-ahead Bias' },
              { text: '拿包括测试期在内的全部历史反复试模型，挑最好看的结果写进报告', category: '有 Look-ahead Bias' },
              { text: '先冻结 Model Specification，再进入 2016+ 最终测试', category: '没有 Look-ahead Bias' },
            ],
            feedbackCorrect: '判断全部正确！核心检验标准只有一条：做决定的那一刻，有没有用到"当时不可能知道"的信息。',
            feedbackWrong: '再用考试比喻检查一遍：凡是"看了后面的结果（答案）再回头做选择"的，都是 Look-ahead Bias；凡是只用"当时已有信息"的，都是干净的。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用考试的比喻，向完全不懂统计的朋友解释：什么是 Look-ahead Bias？它为什么让模型表现"虚高"？',
            keywords: ['答案', '未来', '虚高'],
            modelAnswer: 'Look-ahead Bias 就像考试前偷看了答案：先看到未来的结果，再回头选择模型或 lag，考出的成绩当然好看，但那是虚高的，不代表真实能力。预测模型必须只用"做决定当时已有"的信息；一旦用了未来信息，回测成绩再漂亮，也无法说明它对真正的未来有预测力。',
          },
        },
      ],
    },
    {
      id: 'm5-l2',
      moduleId: 'm5',
      title: '三个样本阶段：练习、模拟考、正式考试',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '记住三个样本阶段的时间边界和各自的任务',
            '理解为什么 Validation 的最后一个 origin 是 2014-12',
            '知道当前预测起点 2026-06 处于哪个阶段',
          ],
        },
        {
          type: 'text',
          md: '为了不偷看答案，Notebook 把一百多年的数据切成**三个阶段**，每个阶段只做一件事——就像学习中的三场考试：\n\n1. **Lag-training（平时练习，数据 ≤1999-12）**：用 1999 年及以前的数据扫描 0–12 的 lag，用 Training R² 为每个候选指标选出最优 lag，然后冻结。\n2. **Validation（模拟考，origins 2000-01 → 2014-12）**：在这段时期的每个月站上预测起点，比较不同候选模型的真实预测表现，决定模型家族的取舍。2014-12 起点的 12 个月预测在 2015-12 实现，所以整场模拟考都停留在 2016 年之前。\n3. **Final Test（正式考试，origins 2016-01 起）**：模型规格已冻结，从 2016 年起的每个月做 12 个月预测，一次性检验真正的样本外表现，不再回头改任何设定。',
        },
        {
          type: 'text',
          md: '今天我们站在**当前 Forecast Origin = 2026-06**，正是 Final Test 阶段的延长线：用截至 2026-06 的数据，生成 2026-07 → 2027-06 的正式 12 个月预测。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '滞后训练样本',
              en: 'Lag-training Sample',
              definition: '只用于选择 lag 的早期样本（本项目为 1999-12 及以前），选完即冻结。',
              example: 'WPU02 的 lag 1（Training R² 0.769）就是在这个样本上选出的。',
            },
            {
              zh: '验证期',
              en: 'Validation Period',
              definition: '用于比较候选模型表现的中间时期，预测起点为 2000-01 到 2014-12。',
              example: '2014-12 起点的 12 个月预测在 2015-12 实现，保证整个验证不越过 2016。',
            },
            {
              zh: '最终测试期',
              en: 'Final Test',
              definition: '规格冻结后才使用的样本外时期，预测起点从 2016-01 开始，衡量真实预测能力。',
              example: 'Primary Total 在这个时期的 12 个月 OOS R² 是 0.598。',
            },
            {
              zh: '预测起点',
              en: 'Forecast Origin',
              definition: '站在哪个月做预测。该月即信息截止：只能用截至该月的数据。',
              example: '当前 origin 是 2026-06，预测范围 2026-07 → 2027-06。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 5：时间边界一次性定义为常量',
          code: 'LAG_TRAIN_END = pd.Timestamp("1999-12-01")\nVALIDATION_FIRST_ORIGIN = pd.Timestamp("2000-01-01")\nVALIDATION_LAST_ORIGIN = pd.Timestamp("2014-12-01")\nFINAL_TEST_FIRST_ORIGIN = pd.Timestamp("2016-01-01")\nFORECAST_HORIZON = 12\nMIN_TRAINING_OBSERVATIONS = 60',
          note: '三个阶段的边界在 Notebook 开头（Cell 5）就写成常量，后面所有分析统一引用——边界清清楚楚，谁也不能"悄悄挪动考场的墙"。',
        },
        {
          type: 'table',
          headers: ['阶段', '时间范围', '任务', '类比'],
          rows: [
            ['Lag-training', '数据 ≤ 1999-12', '扫描 0–12 lag，用 Training R² 选择并冻结', '平时练习'],
            ['Validation', 'origins 2000-01 → 2014-12（结果至 2015-12）', '比较候选模型的预测表现', '模拟考'],
            ['Final Test', 'origins 2016-01 起', '规格冻结后检验样本外表现', '正式考试'],
          ],
          note: '当前 origin 2026-06 属于 Final Test 阶段的延续，用于生成正式的 12 个月预测。',
        },
        {
          type: 'widget',
          id: 'timelineExplorer',
          caption: '点击时间轴上的三个阶段，看看每个阶段"谁能看什么数据"',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Validation 的最后一个 forecast origin 为什么定在 2014-12，而不是 2015-12？',
            options: [
              {
                id: 'a',
                text: '因为 2015 年的数据缺失，无法使用',
                correct: false,
                explanation: '错在原因：2015 年数据并不缺失（缺失的是 2025-10，与此无关）。真正的原因是 12 个月预测需要时间"实现"——正确思路是从预测的实现月份倒推。',
              },
              {
                id: 'b',
                text: '因为 2014-12 起点的 12 个月预测在 2015-12 实现，这样整个验证全程留在 2016 年之前，不碰 Final Test 的数据',
                correct: true,
                explanation: '正确！如果最后一个 origin 是 2015-12，它的 12 个月预测要到 2016-12 才实现，就会"踩进"2016+ 的最终测试期。停在 2014-12 保证了验证与测试完全隔离。',
              },
              {
                id: 'c',
                text: '因为回归至少需要 60 个训练观测',
                correct: false,
                explanation: '错在概念：MIN_TRAINING_OBSERVATIONS = 60 是每次回归的训练样本下限，决定的是"最早"能从哪里开始，与验证期"何时结束"无关。应复习三个阶段的时间边界。',
              },
            ],
            conceptReview: '三个样本阶段的时间边界（Validation 为何止步于 2014-12）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '阶段配任务',
            instructions: '把每个时间阶段与它的任务配对。',
            pairs: [
              { left: 'Lag-training（≤1999-12）', right: '扫描 0–12 lag，用 Training R² 选出并冻结最优 lag' },
              { left: 'Validation（origins 2000-01 → 2014-12）', right: '比较候选模型家族的真实预测表现' },
              { left: 'Final Test（origins 2016-01 起）', right: '规格冻结后一次性检验样本外表现' },
              { left: '当前 Origin（2026-06）', right: '生成 2026-07 → 2027-06 的正式 12 个月预测' },
            ],
            feedbackCorrect: '全部配对正确！三个阶段各司其职，时间上互不越界——这就是抵御 Look-ahead Bias 的完整防线。',
            feedbackWrong: '回忆三场考试的比喻：先"平时练习"选 lag（≤1999），再"模拟考"比模型（2000–2014 起点），最后"正式考试"验成绩（2016 起）；当前 origin 是在考场外做真正的实战预测。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用三场考试的比喻，说出 Lag-training、Validation、Final Test 三个阶段各自的时间范围和任务。',
            keywords: ['1999', '2014', '2016'],
            modelAnswer: 'Lag-training 像平时练习：只用 1999-12 及以前的数据扫描并冻结 lag。Validation 像模拟考：预测起点从 2000-01 到 2014-12，比较各候选模型的表现；因为 2014-12 的 12 个月预测在 2015-12 实现，整场模拟考不越过 2016。Final Test 像正式考试：起点从 2016-01 开始，规格已冻结，检验真实样本外表现。当前 origin 2026-06 用同样的纪律生成未来 12 个月预测。',
          },
        },
      ],
    },
    {
      id: 'm5-l3',
      moduleId: 'm5',
      title: 'Checkpoint · 先冻结，再测试',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解冻结 Model Specification 的含义与理由',
            '分清 Model Selection 和 Out-of-Sample Evaluation 的分工',
            '知道"系数每个 origin 重估"为什么不算作弊',
          ],
        },
        {
          type: 'text',
          md: '三个阶段的背后是一条更根本的纪律：**先冻结，再测试**。**Model Specification（模型规格）**指"用哪些变量、各配什么 lag"这一整套设定。Notebook 在进入验证与最终测试之前（第 8 章），把 9 个模型的规格全部写死，之后不再改动。\n\n为什么必须冻结？因为测试的意义在于"考没见过的题"。如果测试期间还允许换变量、换 lag，那么最终呈现的成绩就是"改到好看为止"的成绩——又回到了偷看答案。',
        },
        {
          type: 'text',
          md: '这里要分清两件常被混淆的事：\n\n- **Model Selection（模型选择）**：决定用什么变量、什么 lag、保留哪个模型家族。只发生在训练与验证阶段。\n- **Out-of-Sample Evaluation（样本外评估）**：冻结之后，在 2016+ 从未参与选择的数据上测量表现。评估结果**不能**反过来用于重新选择——否则测试就被污染了。\n\n还有一个重要的例外要说清楚：**回归系数 α 和 β 在每个 forecast origin 都会重新估计**（只用截至该月的数据）。这不是作弊——系数估计只用了"当时已有"的信息；被冻结的是变量与 lag 的**选择**，不是系数的数值。所以历史回测中各 origin 的系数，不一定等于当前方程的 1.408 和 0.650。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '模型规格',
              en: 'Model Specification',
              definition: '一个模型"用哪些 Predictor、各配什么 lag"的完整设定。',
              example: 'Home baseline 的规格是：ppi_processed_foods，lag 1——在最终测试前就已冻结。',
            },
            {
              zh: '模型选择',
              en: 'Model Selection',
              definition: '在候选规格中做取舍的过程，只允许使用训练与验证阶段的信息。',
              example: '0–12 lag 扫描（≤1999）和 2000–2014 验证比较，都属于 Model Selection。',
            },
            {
              zh: '样本外评估',
              en: 'Out-of-Sample Evaluation',
              definition: '在从未参与选择的数据上测量已冻结模型的表现；结果不得反过来用于重新选择。',
              example: '2016+ Final Test 中 Primary Total 的 RMSE 2.035、OOS R² 0.598 就是样本外评估结果。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Cell 20：什么在变、什么不变',
          code: '# Cell 20 (markdown)\n"At every forecast origin the coefficients are re-estimated\n using all target observations available through that month.\n The lags and variable choices remain fixed."',
          note: 'Notebook 原文点明分界线：每个 origin 重估的是系数（coefficients），保持固定的是 lag 与变量选择（specification）。',
        },
        {
          type: 'table',
          headers: ['项目', '冻结还是变化', '说明'],
          rows: [
            ['Predictor 变量选择', '冻结', '进入验证与测试前确定，之后不再更换'],
            ['Lag（如 WPU02 的 lag 1）', '冻结', '只用 ≤1999-12 数据、按 Training R² 选出'],
            ['回归系数 α、β', '每个 origin 重新估计', '只用截至该 origin 的数据，不偷看未来'],
            ['评估指标（RMSE、OOS R² 等）', '事后计算', '只用来打分，不得反过来改模型'],
          ],
        },
        {
          type: 'callout',
          variant: 'warn',
          title: '一句话记住',
          md: '**系数可以动，规格不能动。**系数随数据更新是"用好当时的信息"；规格随结果改动是"偷看答案改志愿"。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '在 2016+ Final Test 期间，下面哪件事是被允许的？',
            options: [
              {
                id: 'a',
                text: '每个 forecast origin 用截至该月的数据重新估计 α 和 β',
                correct: true,
                explanation: '正确！系数重估只用了当时已有的信息，属于正常的 expanding-window 做法；被冻结的是变量与 lag 的选择，不是系数数值。',
              },
              {
                id: 'b',
                text: '看到某个 lag 在测试期 RMSE 更低，于是换成那个 lag',
                correct: false,
                explanation: '错在时序：这是用测试结果反过来做 Model Selection，测试立即被污染，成绩虚高。正确思路：lag 的选择在 ≤1999 样本上完成并冻结，测试期只打分、不改动。',
              },
              {
                id: 'c',
                text: '把 2016 年以后的数据加入 lag 扫描，重新选一遍最优 lag',
                correct: false,
                explanation: '错在越界：lag 扫描只允许用 1999-12 及以前的数据。把测试期数据混进选择过程，等于让"考题"参与"复习"，2016+ 就不再是干净的样本外考场。应复习三阶段的分工。',
              },
            ],
            conceptReview: '冻结 Model Specification vs 系数重估（Coefficient Re-estimation）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把防偷看的流程排成正确顺序',
            instructions: '从数据到当前预测，按 Notebook 的实际顺序排列这 6 个步骤。',
            correctOrder: [
              '只用 ≤1999-12 的数据扫描 0–12 的 lag',
              '按 Training R² 冻结每个候选指标的最优 lag',
              '冻结 9 个 Model Specification',
              '在 2000-01 → 2014-12 的 origins 上做 Validation，比较模型家族',
              '从 2016-01 起做 Final Test，检验样本外表现',
              '站上当前 origin 2026-06，生成未来 12 个月预测',
            ],
            feedbackCorrect: '顺序完全正确！每一步只用"当时已有"的信息，选择永远发生在测试之前——这就是可信预测的流水线。',
            feedbackWrong: '抓住依赖关系：先选 lag（只用最早的数据）才能定规格；规格冻结后才能公平地验证和测试；一切通过之后，才轮到当前的实战预测。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '解释 Model Selection 与 Out-of-Sample Evaluation 的分工："冻结"发生在什么时候？为什么系数重估不算违规？',
            keywords: ['冻结', '系数', '2016'],
            modelAnswer: 'Model Selection（选变量、选 lag、选模型家族）只发生在训练和验证阶段；进入 2016+ Final Test 之前，Model Specification 已经冻结。Out-of-Sample Evaluation 只负责在从未参与选择的数据上打分，结果不能反过来改模型。系数 α、β 在每个 origin 用截至当月的数据重估，用的全是当时已有的信息，所以不算偷看；被禁止的是根据测试成绩回头改变量和 lag。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经掌握了整个项目的"公平考试规则"。下一站 Module 6：走进回归方程内部，看看 α = 1.408 和 β = 0.650 到底是怎么来的。',
        },
      ],
    },
  ],
}
