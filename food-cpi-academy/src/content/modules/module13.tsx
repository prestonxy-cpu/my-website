import type { CourseModule } from '../../types'

/**
 * Module 13：Limitations（模型的六大限制）
 * 逐一讲透 Notebook 第 15 章的六条限制，每条配生活化比喻与面试答法；
 * 再教会学生用「承认→边界→缓解」把弱点讲成可信度。
 */
export const module13: CourseModule = {
  id: 'm13',
  order: 13,
  title: 'Module 13 · 模型的边界',
  subtitle: '六大 Limitations：知道模型的话能信到什么程度',
  icon: '🪞',
  accent: 'rose',
  lessons: [
    {
      id: 'm13-l1',
      moduleId: 'm13',
      title: '六大限制逐一拆解',
      xp: 50,
      minutes: 12,
      blocks: [
        {
          type: 'goal',
          items: [
            '能说出 Notebook 第 15 章列出的六条限制分别是什么',
            '每条限制都能配一个生活化比喻',
            '每条限制都准备好一句面试官问起时的英文回答',
          ],
        },
        {
          type: 'text',
          md: '一份成熟的模型报告，最后一章几乎一定是 **Limitations（限制）**。这不是自我批评环节，而是告诉使用者：**模型的话能信到什么程度**。\n\nNotebook 第 15 章诚实列出了六条限制。面试官最喜欢问的问题之一就是 "What are the main model limitations?"——答不出来 = 不懂自己的模型；答得清楚 = 真正掌握了它。下面逐条拆解。',
        },
        {
          type: 'text',
          md: '**限制 1 · 伪实时回测（Pseudo-real-time Backtest）**\n\n回测用的是**今天**从 FRED 下载的、经过历次修订的历史数据，而不是历史上每个时点「当时真实看到」的版本。存档这些历史版本的数据库叫 **ALFRED**（ArchivaL FRED）——Notebook 没有用它。\n\n- 生活化比喻：像用一张**今天已经修订过的地图**去评价司机十年前的选路。当年他手里的地图版本可能不太一样。\n- 面试答法："Our backtest is pseudo-real-time: it uses today\'s revised FRED history, not archived ALFRED vintages. Revisions are usually modest, but we do not claim a literal real-time reconstruction."\n\n**限制 2 · 没有重建历史发布日（Release-day Timing）**\n\n模型假设「某个观测月的数据，在对应的 Forecast Origin 时已经可用」。但现实中，6 月的 CPI 要到 7 月中旬才发布。Notebook 没有逐条重建历史上每个数据的确切发布日。\n\n- 生活化比喻：像假设**工资单当月月底就能拿到**，实际上要下个月中旬才寄到。把「观测月」当「可用月」，信息集会比真实情况稍微乐观一点。\n- 面试答法："Observation months are treated as available by the corresponding forecast origin; we did not reconstruct exact historical release days, so the information set is slightly optimistic at the margin."\n\n**限制 3 · 未来 Predictor 用三个月平均（Baseline Scenario）**\n\nHome 模型是 lag 1：只有第一个预测月（2026-07）能用到 observed PPI（2026-06 的 1.6294）。之后 11 个月需要的 PPI 还没发生，只能用最近三个月的平均值 1.8790 代替。所以靠后的月份是**基准情景（Baseline Scenario）**，不是完全基于观测数据的预测。\n\n- 生活化比喻：像天气预报预报下周——明天用今天的真实云图，后面几天只能假设「温度 ≈ 最近三天的平均」。\n- 面试答法："Only the first month uses observed PPI; the remaining months assume the recent three-month average of 1.879, so they are baseline scenarios rather than fully observed forecasts."',
        },
        {
          type: 'text',
          md: '**限制 4 · 当前权重用于历史组合（Current Weights）**\n\n把 Home 和 Away 组合成 Total Food 时用的 Relative Importance（8.188 / 5.260）是**当前**的权重。历史回测中的组合也统一使用这套当前权重，没有重建历史上每个时点的实时权重。好处是所有模型对比口径一致；代价是它不是历史实时权重的重建。\n\n- 生活化比喻：像用**今年家里的开支比例**去核算十年前每个月的家庭账本——比例大体稳定，但严格说不是当年的比例。\n- 面试答法："Current CPI relative-importance weights are also applied to historical component forecasts. That keeps model comparisons consistent, but it is not a reconstruction of real-time weights."\n\n**限制 5 · 调查是区域性的（Regional Surveys）**\n\n费城和达拉斯联储的调查覆盖的是**区域性**的制造业/服务业企业，不是全国性、也不是食品行业专属。所以 Survey 模型只能作为敏感性指标（4.34% 那条线），不能证明因果传导。\n\n- 生活化比喻：像**只问了费城的商家**就推断全国餐厅都要涨价——是有价值的信号，但不能当成全国性的定论。\n- 面试答法："The Philadelphia and Dallas surveys are regional and not food-sector-specific, so we treat them as sensitivity indicators — the 4.34% scenario — not as proof of causal pass-through."\n\n**限制 6 · 重叠误差序列相关（Serial Correlation）**\n\n相邻 Forecast Origin 做出的 12 个月预测，覆盖的经济时段大量重叠，所以这些预测误差彼此高度相关（serially correlated），**不是独立样本**。应对方式：当前回归系数使用 **HAC Standard Error** 校正；而历史 RMSE 和经验区间才是主要的可靠性度量。\n\n- 生活化比喻：像**每天给同一片风景拍一张照**——相邻两张照片内容几乎一样，100 张照片并不等于 100 条独立信息。\n- 面试答法："Overlapping 12-month errors are serially correlated, so we use HAC standard errors for current coefficients and rely on historical RMSE and empirical intervals as the main reliability measures."',
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 42（第 15 章）：六条限制的原文',
          code: '## 15. Limitations\n1. This is a pseudo-real-time backtest using today\'s revised FRED history, not archived ALFRED vintages.\n2. Observation months are treated as available by the corresponding forecast origin; exact historical release-day timing is not reconstructed.\n3. Unknown future predictors use a recent three-month average, so later forecast months are baseline scenarios rather than fully observed forecasts.\n4. Current CPI relative-importance weights are also used to combine historical component forecasts; this is consistent across model comparisons but is not a reconstruction of historical real-time weights.\n5. The Philadelphia and Dallas survey series are regional and not food-sector-specific. They are sensitivity indicators, not proof of causal food-price pass-through.\n6. Overlapping 12-month forecast errors are serially correlated. HAC standard errors are used for current regression coefficients, while historical forecast RMSE and empirical intervals remain the main reliability measures.',
          note: '这是 Notebook 里唯一一个全文都值得背下来的 markdown cell——面试时它就是 Q12 的标准答案素材。',
        },
        {
          type: 'table',
          headers: ['#', '限制（English）', '一句话比喻'],
          rows: [
            ['1', 'Pseudo-real-time：用今天修订后的 FRED 历史，非 ALFRED vintages', '用今天修订过的地图评价当年的选路'],
            ['2', 'Release-day timing：未重建历史确切发布日', '假设工资单当月月底就能拿到'],
            ['3', '未来 Predictor 用三个月平均（1.8790）', '后几天的天气预报只能假设温度 ≈ 最近三天平均'],
            ['4', '当前 Relative Importance 权重也用于历史组合', '用今年的开支比例核算十年前的账本'],
            ['5', 'Philly / Dallas 调查是区域性、非食品专属', '只问费城的商家，推断全国餐厅'],
            ['6', '重叠 12 个月误差序列相关；HAC SE + 历史 RMSE 应对', '每天拍同一片风景，相邻照片不是独立信息'],
          ],
          note: '六条限制 = 三条关于数据时间线（1、2、3）+ 一条关于权重（4）+ 一条关于调查（5）+ 一条关于统计推断（6）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '历史版本数据',
              en: 'Vintage Data / ALFRED',
              definition: '数据在历史上某个时点「当时长什么样」的存档版本。FRED 的历史存档数据库叫 ALFRED（ArchivaL FRED）。',
              example: '限制 1：本模型回测用的是今天的修订版历史，没有用 ALFRED vintages。',
            },
            {
              zh: '伪实时回测',
              en: 'Pseudo-real-time Backtest',
              definition: '流程上严格模拟实时预测（只用 origin 之前的月份），但数据本身是今天已修订的版本，不是历史当时的版本。',
              example: '本 Notebook 的 Expanding-window Backtest 就是 pseudo-real-time 的。',
            },
            {
              zh: '基准情景',
              en: 'Baseline Scenario',
              definition: '当预测依赖「对未来输入的假设」时，得到的结果是条件于该假设的情景，而不是完全基于观测数据的预测。',
              example: 'Home 预测从第 2 个月起假设 PPI = 三个月平均 1.8790，因此是 baseline scenario。',
            },
            {
              zh: '序列相关',
              en: 'Serial Correlation',
              definition: '一个序列中相邻观测值彼此相关、不独立的现象。重叠的 12 个月预测误差就是典型例子。',
              example: '限制 6：相邻 origin 的 12 个月预测覆盖的时段大量重叠，误差自然相关。',
            },
            {
              zh: 'HAC 标准误',
              en: 'HAC Standard Error',
              definition: '对异方差（Heteroskedasticity）和自相关（Autocorrelation）都稳健的标准误估计，用于序列相关数据的回归推断。',
              example: '当前系数表全部使用 HAC SE，如 Home baseline 的 β 标准误 0.043。',
            },
          ],
        },
        {
          type: 'widget',
          id: 'forecastAudit',
          caption: '限制 3 的最好证据：切到 Primary 标签，数一数绿色 Observed 与橙色 Assumed 各有几行——Home 只有 1 行 observed，Away 12 行全部 observed。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '关于本模型的历史回测，下列哪个说法是准确的？',
            options: [
              {
                id: 'a',
                text: '回测使用了历史上每个时点的 ALFRED vintage 数据，是严格的实时回测',
                correct: false,
                explanation: '错在方向：ALFRED vintages 恰恰是 Notebook **没有**用的东西。回测用的是今天已修订的 FRED 历史——这正是限制 1 要坦白的内容。正确思路：流程模拟实时（只用 origin 之前的月份），数据本身却是今天的版本，所以叫 pseudo-real-time。',
              },
              {
                id: 'b',
                text: '回测使用今天已修订的 FRED 历史数据，是 pseudo-real-time 回测',
                correct: true,
                explanation: '正确！流程上严格只用 origin 之前的月份（防 Look-ahead Bias），但数据是今天的修订版而非历史 vintage，因此称为伪实时（pseudo-real-time）回测。',
              },
              {
                id: 'c',
                text: '因为用了修订后的数据，回测结果完全没有参考价值',
                correct: false,
                explanation: '错在夸大：数据修订通常幅度有限，pseudo-real-time 回测依然是对实时表现有意义的近似。诚实的说法是「接近但不完全等于实时环境」，而不是「毫无价值」——把限制夸大成否定，和掩盖限制一样不专业。',
              },
            ],
            conceptReview: '伪实时回测（Pseudo-real-time Backtest）与历史版本数据（Vintage Data / ALFRED）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '限制 ↔ 比喻配对',
            instructions: '把六条限制和对应的生活化比喻连起来。',
            pairs: [
              { left: '1 · Pseudo-real-time（今天的修订版历史）', right: '用今天修订过的地图评价当年的选路' },
              { left: '2 · 未重建 Release-day Timing', right: '假设工资单当月月底就能拿到，实际下月中旬才到' },
              { left: '3 · 未来 PPI 用三个月平均', right: '后几天的天气预报只能假设温度 ≈ 最近三天平均' },
              { left: '4 · 当前权重用于历史组合', right: '用今年的开支比例核算十年前的账本' },
              { left: '5 · 调查是区域性的', right: '只问费城的商家，推断全国餐厅' },
              { left: '6 · 重叠误差序列相关', right: '每天拍同一片风景，相邻照片不是独立信息' },
            ],
            feedbackCorrect: '全对！六个比喻各自锚定一条限制——面试时先想起比喻，再翻译成专业表述，就不会卡壳。',
            feedbackWrong: '再对照一遍：1 关于数据版本（地图被修订过）；2 关于发布时间（工资单晚到）；3 关于未来假设（天气预报）；4 关于权重（开支比例）；5 关于调查覆盖面（只问一个城市）；6 关于误差不独立（重复的照片）。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释两件事：为什么说这是 pseudo-real-time 回测？为什么 Home 模型从第 2 个预测月起只是 baseline scenario？',
            keywords: ['修订', 'vintage', '三个月', '平均', 'scenario'],
            modelAnswer: '回测流程上只用每个 origin 之前的月份，模拟实时预测；但数据是今天从 FRED 下载的、已经过修订的版本，不是历史当时的 vintage（ALFRED），所以只能叫伪实时。Home 模型 lag 1，只有 2026-07 的预测能用到 observed PPI（1.6294）；之后 11 个月的 PPI 还没发生，用最近三个月平均 1.8790 代替，所以那些月份是条件于这个假设的 baseline scenario。',
          },
        },
      ],
    },
    {
      id: 'm13-l2',
      moduleId: 'm13',
      title: 'Checkpoint · 诚实回答「模型的弱点」',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解「弱点 ≠ 模型没用」：诚实 + 边界 = 可信',
            '掌握「承认 → 边界 → 缓解」三步回答法',
            '能把六条限制组织成一个 60 秒的英文回答',
          ],
        },
        {
          type: 'text',
          md: '面试官问 "What are the main model limitations?" 时，**不是**想听「模型很完美」。这道题测的是：你是否真正理解自己的工具。\n\n- 答不出限制 = 不懂模型；\n- 把限制夸大成「模型不可信」= 不理解限制的边界；\n- **诚实说出限制 + 讲清边界 + 给出缓解措施 = 可信**。\n\n推荐三步法：\n\n1. **承认（Acknowledge）**：直接说出限制是什么，不绕弯。\n2. **边界（Scope）**：说明它影响什么、不影响什么——模型的话能信到什么程度。\n3. **缓解（Mitigation）**：说明模型里已经做了什么来应对：HAC Standard Error、经验区间、敏感性情景、audit 表里逐行标注 observed / assumed。',
        },
        {
          type: 'table',
          headers: ['步骤', '以限制 3 为例（英文例句）'],
          rows: [
            ['承认 Acknowledge', '"Only the first month uses observed PPI; the remaining eleven months assume the recent three-month average."'],
            ['边界 Scope', '"So months 2 to 12 are baseline scenarios — conditional on that assumption, not fully observed forecasts."'],
            ['缓解 Mitigation', '"The forecast audit table labels every input as observed or assumed, and the empirical interval reflects the historical errors of exactly this procedure."'],
          ],
          note: '同样的三步可以套在任何一条限制上——先承认，再画边界，最后给缓解。',
        },
        {
          type: 'text',
          md: '**60 秒英文示范**（回答 Q12 时，把六条组织成四组更顺口）：\n\n"Four things are worth flagging. First, the backtest is pseudo-real-time — it uses today\'s revised FRED history, not ALFRED vintages, and we did not reconstruct exact release days. Second, beyond the first month the Home model assumes a recent three-month-average PPI, so later months are baseline scenarios. Third, the Philadelphia and Dallas surveys are regional and not food-specific, which is why the 4.34% survey number is a sensitivity scenario, not the primary forecast. Finally, overlapping 12-month errors are serially correlated, so we use HAC standard errors and rely on historical RMSE and empirical intervals for reliability."\n\n（第 4 条「当前权重用于历史组合」可以在被追问组合方法时补充。）',
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 40（第 14 章）：诚实表达的原文示范',
          code: '- The **primary baseline** is easier to defend economically and uses national food PPI and national Leisure & Hospitality wages.\n- The **survey sensitivity** asks what the forecast looks like if recent business price intentions also pass through. It is not presented as certain because the Philadelphia survey is regional and broader than food.',
          note: 'Notebook 自己就示范了诚实表达："It is not presented as certain"——主动画出边界，而不是等别人来质疑。',
        },
        {
          type: 'chart',
          id: 'horizonRmse',
          caption: '诚实的另一种形式：公开每个 horizon 的历史 RMSE。短期很难打败 no-change（h=1 的 OOS R² 是 -13.5），长期优势才显现——主动展示这条曲线比只报一个最好看的数字可信得多。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '敏感性分析',
              en: 'Sensitivity Analysis',
              definition: '改变一个假设或输入，观察结论变化多少的分析方式。它回答「如果……会怎样」，而不是给出另一个主预测。',
              example: 'Survey Sensitivity 的 4.34% 就是敏感性情景：如果企业价格意向也传导，预测会怎样。',
            },
            {
              zh: '稳健性检查',
              en: 'Robustness Check',
              definition: '用替代的变量或规范重跑模型，确认核心结论不依赖某个特定选择。',
              example: 'Home upstream-energy、Home global-food 等模型就是围绕 Home baseline 的稳健性检查。',
            },
            {
              zh: '经验样本外误差区间',
              en: 'Empirical OOS-error Interval',
              definition: '用历史回测中真实发生过的预测误差构造的区间，反映「这套流程过去实际错多少」。',
              example: '2027-06 的 Primary 预测 3.02%，经验区间约 [-0.56, 8.23]——区间宽本身就是一种诚实。',
            },
          ],
        },
        {
          type: 'quiz',
          quiz: {
            question: '下面哪句话是对模型限制的**准确且诚实**的表述？',
            options: [
              {
                id: 'a',
                text: '「因为用了今天的修订数据，历史回测结果毫无参考价值。」',
                correct: false,
                explanation: '错在把限制夸大成否定：数据修订通常幅度有限，pseudo-real-time 回测仍是对实时表现有意义的近似。诚实不等于自我否定——正确做法是画出边界（「接近但不完全等于实时环境」），而不是全盘推翻。',
              },
              {
                id: 'b',
                text: '「回测是 pseudo-real-time 的：流程模拟实时，但没有复现每个数据的历史 vintage 与确切发布日。」',
                correct: true,
                explanation: '正确！这句话同时做到了承认（pseudo-real-time）和边界（流程可靠、数据版本与发布日未复现）——既不掩盖也不夸大，是标准的诚实表述。',
              },
              {
                id: 'c',
                text: '「回测完全复现了真实历史环境，结果可以按字面精确解读。」',
                correct: false,
                explanation: '错在掩盖限制：限制 1 和 2 明确说了没有用 ALFRED vintages、没有重建发布日。在面试中做出这种过度声明，一旦被追问就会失去全部可信度。应复习限制 1、2 的内容。',
              },
            ],
            conceptReview: '诚实 + 边界 = 可信（Limitations 的表达方式）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '哪些是可信的答法，哪些是危险的答法？',
            instructions: '把每句回答放进正确的类别。',
            categories: ['诚实可信的答法', '危险的答法'],
            items: [
              { text: '"Our backtest is pseudo-real-time; it uses today\'s revised FRED history."', category: '诚实可信的答法' },
              { text: '"Beyond the first month, the Home forecasts are baseline scenarios."', category: '诚实可信的答法' },
              { text: '"The Philly survey is regional, so we treat 4.34% as a sensitivity, not the primary forecast."', category: '诚实可信的答法' },
              { text: '「我们的回测完全复现了历史实时数据环境。」', category: '危险的答法', note: '过度声明：限制 1、2 明确否定了这一点' },
              { text: '「Survey 模型 R² 更高，所以 4.34% 才是最可信的预测。」', category: '危险的答法', note: '违反课程铁律：Survey 是敏感性情景，Primary 才是主预测' },
              { text: '「这个模型没有什么值得一提的弱点。」', category: '危险的答法', note: '答不出限制 = 不懂自己的模型' },
            ],
            feedbackCorrect: '判断力满分！可信的答法都有共同点：承认事实、画出边界；危险的答法要么过度声明，要么否认限制的存在。',
            feedbackWrong: '判断标准：这句话有没有过度声明（说了模型做不到的事）？有没有违反「Survey ≠ 主预测」的铁律？有没有假装限制不存在？诚实 + 边界才可信。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '面试官追问：「既然有这么多限制，这个模型还可信吗？」写下你的回答思路（中文即可，可夹英文术语，至少提到一个数字）。',
            keywords: ['rmse', '区间', '限制', '边界'],
            modelAnswer: '可信，但要带着边界使用。模型不是水晶球，而是一个诚实标注了所有假设的基准情景：12 个月 OOS RMSE 约 2.035 pp、经验区间 [-0.56, 8.23] 都公开给使用者，明确告诉大家不确定性有多大；每条限制都有对应的缓解措施（HAC SE、audit 表逐行标注 observed/assumed、敏感性情景）。正因为限制被诚实说明，模型的输出才知道该怎么用——诚实 + 边界 = 可信。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经能把「弱点」讲成「可信度」。最后一站 Module 14：把全课程装进 13 个英文问题的答题框架，然后走进会议室。',
        },
      ],
    },
  ],
}
