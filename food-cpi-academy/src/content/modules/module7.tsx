import type { CourseModule } from '../../types'

/**
 * Module 7：模型家族
 * 9 个模型规范总览、四个家族的定位、Multicollinearity 与 Overfitting、
 * Pre-2016 Validation 的诚实呈现与 Primary 的选择逻辑。
 * 数值出处：Notebook Cell 18/19/23/25/35 与 modelResults.ts。
 */
export const module7: CourseModule = {
  id: 'm7',
  order: 7,
  title: 'Module 7 · 模型家族',
  subtitle: '9 个模型规范，与为什么简单的那个当主力',
  icon: '🏗️',
  accent: 'violet',
  lessons: [
    {
      id: 'm7-l1',
      moduleId: 'm7',
      title: '9 个模型规范总览',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 Notebook 一共定义了 9 个模型规范（Model Specification）',
            '能读懂一条规范的四要素：Component、Target、Predictors 与 lag、Role',
            '记住 Primary 组合 = Home baseline + Away legacy all-employee',
          ],
        },
        {
          type: 'text',
          md: '到 Module 6 为止，你已经会挑 Predictor、定 Lag、跑回归了。正式比赛开始前还差一步：把所有想法写成白纸黑字的**模型规范（Model Specification）**。\n\n一条规范就像一张"选手报名表"，写清四件事：\n\n1. **Component**：预测哪个分项（Food at Home 还是 Food Away from Home）\n2. **Target**：目标变量（如 `food_at_home_cpi` 的 YoY）\n3. **Predictors 与 lag**：用哪些变量、各滞后几个月\n4. **Role**：这个模型在整个体系里扮演什么角色\n\nNotebook Cell 19 一共登记了 **9 名选手**：5 个 Home 模型 + 4 个 Away 模型。',
        },
        {
          type: 'table',
          headers: ['模型', '分项', 'Predictors（lag）', '角色'],
          rows: [
            ['Home baseline', 'Home', 'ppi_processed_foods (lag 1)', '主预测（全国基准）'],
            ['Home survey expanded', 'Home', 'ppi_processed_foods (lag 1) + philly_future_prices_received (lag 0)', '商业调查敏感性'],
            ['Home upstream-energy', 'Home', 'ppi_processed_foods (lag 1) + ppi_farm_products (lag 2) + ppi_energy (lag 0)', '农业与能源稳健性'],
            ['Home global-food', 'Home', 'ppi_processed_foods (lag 1) + global_food_price_index (lag 7)', '全球大宗商品稳健性'],
            ['Home food-manufacturing', 'Home', 'ppi_processed_foods (lag 1) + ppi_food_manufacturing (lag 2)', '食品加工稳健性'],
            ['Away long-history baseline', 'Away', 'wage_leisure_hospitality_production (lag 2)', '长历史全国工资基准'],
            ['Away survey expanded', 'Away', 'wage_leisure_hospitality_production (lag 2) + philly_future_prices_received (lag 2)', '长历史工资 + 调查敏感性'],
            ['Away food-cost', 'Away', 'wage_leisure_hospitality_production (lag 2) + ppi_processed_foods (lag 6)', '劳动力 + 食品投入稳健性'],
            ['Away legacy all-employee', 'Away', 'wage_leisure_hospitality_all (lag 12)', '主预测使用的原始工资模型（延续性）'],
          ],
          note: '出自 Notebook Cell 19 的 model_spec_table：9 行，predictor 数量从 1 到 3 不等。',
        },
        {
          type: 'text',
          md: '读表时注意两个规律：\n\n- 所有 Home 模型都以 `ppi_processed_foods`（lag 1）为核心，在它基础上做加法；所有 Away 模型都围绕工资序列展开。\n- 报名表在 Cell 19 **一次性冻结**——之后的验证与测试阶段，任何模型都不能再改变量或 lag。这正是 Module 5 讲过的防 Look-ahead Bias 纪律：先冻结规范，再打开考卷。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '模型规范',
              en: 'Model Specification',
              definition: '一份写死的模型配方：目标变量、预测变量、各自的 lag 与模型角色。规范一旦冻结，测试期间不得更改。',
              example: 'Home baseline 的规范：target = food_at_home_cpi，predictor = ppi_processed_foods，lag 1。',
            },
            {
              zh: '角色',
              en: 'Role',
              definition: '每个模型在体系中的分工：是对外的主预测，还是用于敏感性分析或稳健性检查。',
              example: 'Away legacy all-employee 的角色写着 Original model retained for continuity（保留原始模型以维持延续性）。',
            },
            {
              zh: '冻结规范',
              en: 'Frozen Specification',
              definition: '在看到测试结果之前就固定所有模型细节，防止"边看成绩边改模型"造成的表现虚高。',
              example: 'Notebook 第 8 章标题就叫 Freeze the model specifications before the final test。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 19 · 登记并冻结 9 个模型规范',
          code: 'model_specs = {\n    "Home baseline": {\n        "component": "Food at Home",\n        "target": "food_at_home_cpi",\n        "predictors": {"ppi_processed_foods": home_lag_lookup["ppi_processed_foods"]},\n        "role": "Primary national baseline",\n    },\n    ...\n    "Away legacy all-employee": {\n        "component": "Food Away from Home",\n        "target": "food_away_cpi",\n        "predictors": {"wage_leisure_hospitality_all": 12},\n        "role": "Original model retained for continuity",\n    },\n}',
          output: 'model_spec_table：9 行 × 6 列，列出每个模型的 Component、Target、Predictors_and_lags、Number_of_predictors 和 Role。',
          note: '注意 lag 都来自 home_lag_lookup / away_lag_lookup——也就是 Module 4 里只用 1999 年及以前数据扫描出的结果，这里只是引用，不再重新挑选。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '9 个模型规范中，哪一个使用的 predictor 数量最多？',
            options: [
              {
                id: 'a',
                text: 'Home upstream-energy',
                correct: true,
                explanation: '正确！它有 3 个 predictor：加工食品 PPI（lag 1）、农产品 PPI（lag 2）、能源 PPI（lag 0），是 9 个模型里唯一的三变量模型。它的角色是稳健性检查，不是主预测。',
              },
              {
                id: 'b',
                text: 'Home survey expanded',
                correct: false,
                explanation: '错在数量：它只有 2 个 predictor（PPI lag 1 + 费城调查 lag 0）。正确思路是逐行数总览表的 Predictors 列——只有 Home upstream-energy 达到 3 个。',
              },
              {
                id: 'c',
                text: 'Away food-cost',
                correct: false,
                explanation: '错在数量：它也是 2 个 predictor（一线员工工资 lag 2 + 加工食品 PPI lag 6）。9 个模型里 predictor 最多的是 Home upstream-energy（3 个）。顺带记住：变量最多不等于最好，本模块第 3 课会解释为什么。',
              },
            ],
            conceptReview: '模型规范（Model Specification）的四要素',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '把模型和它的 Predictor 配对',
            instructions: '左边是模型名，右边是它的 predictor 组合，请一一配对。',
            pairs: [
              { left: 'Home baseline', right: 'ppi_processed_foods (lag 1)' },
              { left: 'Away legacy all-employee', right: 'wage_leisure_hospitality_all (lag 12)' },
              { left: 'Away long-history baseline', right: 'wage_leisure_hospitality_production (lag 2)' },
              { left: 'Home survey expanded', right: 'PPI (lag 1) + 费城调查 (lag 0)' },
              { left: 'Away survey expanded', right: '一线员工工资 (lag 2) + 费城调查 (lag 2)' },
            ],
            feedbackCorrect: '全对！注意两个 Primary 模型（Home baseline、Away legacy）都只有一个 predictor——记住这个"刻意简单"，第 3 课讲它背后的统计学理由。',
            feedbackWrong: '再对照一遍总览表：Home 系全部以加工食品 PPI（lag 1）为核心；Away 的 Primary 用 all-employee 工资 lag 12，long-history 和 survey 模型用一线员工工资 lag 2。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：什么是模型规范？Notebook 的 9 条规范里各写了什么？',
            keywords: ['predictor', 'lag', '9'],
            modelAnswer: '模型规范是写死的模型配方，包含预测分项（component）、目标变量（target）、predictor 及其 lag、以及模型角色。Notebook Cell 19 冻结了 9 条规范：5 个 Home 模型都以加工食品 PPI lag 1 为核心，4 个 Away 模型围绕工资序列展开，其中 Home baseline 和 Away legacy all-employee 是 Primary。',
          },
        },
      ],
    },
    {
      id: 'm7-l2',
      moduleId: 'm7',
      title: '四个家族：谁是主力，谁是替补',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清 Primary / Long-history / Survey / Robustness 四个家族的分工',
            '理解为什么 Away 的 Primary 是 legacy all-employee 模型',
            '记住铁律：Survey 情景（4.34%）不是主预测（3.02%）',
          ],
        },
        {
          type: 'text',
          md: '9 名选手不是平级的，他们分成**四个家族**，各司其职：\n\n- **Primary（主力）**：`Home baseline` + `Away legacy all-employee`。对外汇报的主预测（2027-06 Total Food 3.02%）由这两位产生。\n- **Long-history（长历史基准）**：`Away long-history baseline` 改用 1964 年起的一线员工工资（Primary 用的 all-employee 序列 2006 年才开始），提供一条历史更长的平行基准线。\n- **Survey（调查敏感性）**：两个 survey expanded 模型加入费城联储的未来售价调查，回答"如果企业价格意向也传导进来会怎样"。它们产生 4.34% 的敏感性情景——**不是**主预测。\n- **Robustness（稳健性检查）**：4 个模型换上农业、能源、全球食品、食品制造等指标，检验结论是否依赖某个特定数据源。它们始终在场，但不自动取代 baseline。',
        },
        {
          type: 'text',
          md: '一个容易搞混的点：Away 的 Primary **不是** `Away long-history baseline`，而是 `Away legacy all-employee`（all-employee 工资，lag 12）。保留它有两个理由：\n\n- **延续性（Continuity）**：它是最初版本的模型，沿用它可以让新旧结果直接可比。Cell 19 里它的角色栏写的就是 Original model retained for continuity。\n- **数据优势**：lag 12 意味着在 2026-06 这个 origin 上，未来 12 个月所需的工资 predictor（2025-07 至 2026-06）**全部已观察**，一格假设都不用（Module 9 会细讲）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '主模型',
              en: 'Primary Model',
              definition: '正式对外汇报的预测模型。其他模型都围绕它服务：要么提供敏感性情景，要么检验它的稳健性。',
              example: 'Primary 组合 = Home baseline + Away legacy all-employee，产出 2027-06 的 3.02%。',
            },
            {
              zh: '稳健性检查',
              en: 'Robustness Check',
              definition: '换一批相关指标重做分析，看核心结论是否会变。它的价值在于"验证"，而不是"替代"。',
              example: 'Home upstream-energy、Home global-food、Home food-manufacturing、Away food-cost 这 4 个模型都是稳健性检查。',
            },
            {
              zh: '敏感性分析',
              en: 'Sensitivity Analysis',
              definition: '改变一个假设或输入，观察结果会移动到哪里，用来展示预测对该假设的依赖程度。',
              example: 'Survey 家族给出 4.34% 的情景：如果费城调查反映的价格意向传导进食品价格，通胀会更高。',
            },
            {
              zh: '延续性模型',
              en: 'Legacy Model',
              definition: '早期版本沿用下来的模型。保留它是为了让不同版本的结果可以直接对比。',
              example: 'Away legacy all-employee 就是 legacy 模型，同时兼任 Away 的 Primary。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 18 · 为什么主规范刻意做小',
          code: '## 8. Freeze the model specifications before the final test\n\nThe main specifications are intentionally small. Putting every\ncorrelated food and commodity index into one equation would create\nmulticollinearity and overfitting.\n\n- Survey-expanded sensitivity: ... it is regional and not food-specific.\n- Other agricultural, energy, and commodity models are robustness\n  checks, not automatic replacements for the baseline.',
          output: '（markdown cell，无运行输出）',
          note: '这段原文是整个 Module 7 的纲领：主规范刻意做小；调查是区域性、非食品专属的敏感性指标；稳健性模型不是 baseline 的自动替代品。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Away legacy all-employee 在当前 Notebook 中扮演什么角色？',
            options: [
              {
                id: 'a',
                text: '它是 Food Away 的 Primary 模型：保留原始 all-employee 工资（lag 12）以维持延续性',
                correct: true,
                explanation: '正确！它既是 legacy（最初版本沿用），又是 Primary。lag 12 还带来一个好处：当前 origin 下未来 12 个月的工资 predictor 全部已观察。',
              },
              {
                id: 'b',
                text: '它只是稳健性检查，正式预测其实用 Away long-history baseline',
                correct: false,
                explanation: '错在张冠李戴：Away long-history baseline 属于 Long-history 家族，是平行基准线；对外主预测用的是 legacy all-employee 模型（Cell 19 角色栏：Original model retained for continuity）。正确思路是逐个查模型的 Role。',
              },
              {
                id: 'c',
                text: '它已被 Away survey expanded 取代，因为后者验证期 RMSE 更低',
                correct: false,
                explanation: '错在"取代"：Away survey expanded 验证期 RMSE 0.566 确实最低，但费城调查是区域性、非食品专属指标，Survey 家族只提供敏感性情景（4.34%），不自动接管主预测。表现好不等于自动上位——这是本模块反复强调的纪律。',
              },
            ],
            conceptReview: '四个模型家族的分工（Primary / Long-history / Survey / Robustness）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '把 9 名选手放进四个家族',
            instructions: '根据每个模型的角色，把它放进正确的家族。',
            categories: ['Primary（主力）', 'Long-history（长历史）', 'Survey（调查敏感性）', 'Robustness（稳健性检查）'],
            items: [
              { text: 'Home baseline', category: 'Primary（主力）' },
              { text: 'Away legacy all-employee', category: 'Primary（主力）', note: '角色：Original model retained for continuity' },
              { text: 'Away long-history baseline', category: 'Long-history（长历史）' },
              { text: 'Home survey expanded', category: 'Survey（调查敏感性）' },
              { text: 'Away survey expanded', category: 'Survey（调查敏感性）' },
              { text: 'Home upstream-energy', category: 'Robustness（稳健性检查）' },
              { text: 'Home global-food', category: 'Robustness（稳健性检查）' },
              { text: 'Home food-manufacturing', category: 'Robustness（稳健性检查）' },
              { text: 'Away food-cost', category: 'Robustness（稳健性检查）' },
            ],
            feedbackCorrect: '完美！2 个主力 + 1 个长历史 + 2 个调查 + 4 个稳健性，正好 9 个。',
            feedbackWrong: '提示：Primary 只有两个（Home baseline 与 Away legacy）；名字带 survey expanded 的都是调查敏感性；带农业/能源/全球/制造/食品成本字样的是稳健性检查；Away long-history baseline 独占长历史家族。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话说明四个家族各自的用途，并解释为什么 Survey 模型不直接当主预测。',
            keywords: ['primary', 'survey', 'robustness'],
            modelAnswer: 'Primary 是对外汇报的主预测（Home baseline + Away legacy）；Long-history 用更长的工资序列提供平行基准；Survey 家族加入费城调查，生成 4.34% 的敏感性情景；Robustness 家族换用农业、能源等指标检验结论稳不稳。Survey 不当主预测，因为费城调查是区域性、非食品专属的指标，只能展示风险方向；Primary 在经济逻辑、全国代表性和透明度上更可靠。',
          },
        },
      ],
    },
    {
      id: 'm7-l3',
      moduleId: 'm7',
      title: '为什么不选变量最多的模型',
      xp: 50,
      minutes: 10,
      blocks: [
        {
          type: 'goal',
          items: [
            '理解 Multicollinearity（多重共线性）和 Overfitting（过拟合）为什么惩罚大模型',
            '会用 Condition Number 读懂共线性警报：81.2 vs 6.6',
            '记住规则：新变量必须降低验证期 RMSE，只提高 in-sample R² 不算数',
          ],
        },
        {
          type: 'text',
          md: '直觉上"变量越多、信息越全、预测越准"，对吧？统计学的回答是：**通常不对**。有两个陷阱在等着大模型：\n\n**多重共线性（Multicollinearity）**：食品、农产品、能源这些指数彼此高度相关，几乎在讲同一个故事。把一堆相关变量塞进同一个方程，回归就分不清功劳该记给谁——系数变得不稳定，数据轻微变动就可能让系数大幅摇摆甚至翻符号。\n\n**过拟合（Overfitting）**：变量越多，模型越容易把历史里的噪声当成规律背下来。就像考前只背了往年答案的学生：模拟卷（in-sample）分数漂亮，真考新题（out-of-sample）就露馅。',
        },
        {
          type: 'text',
          md: 'Notebook 给多重共线性装了一个"警报器"：**条件数（Condition Number）**。它衡量回归的设计矩阵有多接近病态——数值越大，系数估计对数据的微小变动越敏感。看 Cell 35 的当前系数表：\n\n- `Home baseline`（1 个 predictor）：condition number 约 **6.6**\n- `Home survey expanded`（2 个 predictor）：condition number 约 **81.2**\n\n只加了一个调查变量，警报值涨到约 12 倍；而换来的 in-sample R² 只从 0.715 涨到 0.721。这就是 Cell 18 那句 intentionally small（刻意做小）的数字注脚。',
        },
        {
          type: 'table',
          headers: ['模型', 'Predictor 数', 'In-sample R²', 'Condition Number'],
          rows: [
            ['Home baseline', '1', '0.715', '6.6'],
            ['Home survey expanded', '2', '0.721', '81.2'],
            ['Away legacy all-employee', '1', '0.598', '7.8'],
            ['Away survey expanded', '2', '0.641', '85.6'],
          ],
          note: '出自 Cell 35 当前系数表（estimated through 2026-06）。两个单变量模型的 condition number 都在个位数，两个双变量 survey 模型都在 80 以上。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '多重共线性',
              en: 'Multicollinearity',
              definition: '多个 predictor 高度相关，导致回归无法可靠地区分各自的贡献，系数估计不稳定。',
              example: '农产品 PPI、加工食品 PPI、能源 PPI 常常同涨同跌，放进同一个方程就会互相打架。',
            },
            {
              zh: '过拟合',
              en: 'Overfitting',
              definition: '模型把训练数据里的噪声当成规律记住了：样本内表现好，样本外表现差。',
              example: '防线是 Cell 24 的规则：新变量必须降低验证期的 OOS RMSE，只提高 in-sample R² 不被接受。',
            },
            {
              zh: '条件数',
              en: 'Condition Number',
              definition: '衡量回归设计矩阵病态程度的指标。数值越大，共线性等数值问题越严重，系数对数据扰动越敏感。',
              example: 'Home baseline 约 6.6，Home survey expanded 约 81.2——加一个变量，警报值翻了约 12 倍。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 21/35 · 每次估计都记录 Condition Number',
          code: 'model = sm.OLS(train["y"], x_train).fit(\n    cov_type="HAC", cov_kwds={"maxlags": 12})\n...\ncoefficient_rows.append({\n    ...\n    "In_sample_R_squared": model.rsquared,\n    "Condition_number": model.condition_number,\n})',
          output: 'Home baseline:        In_sample_R² 0.7146, Condition_number  6.649\nHome survey expanded: In_sample_R² 0.7210, Condition_number 81.198\nAway survey expanded: In_sample_R² 0.6415, Condition_number 85.592',
          note: '警报器被写进了每一次回归估计里：任何 origin、任何模型的 condition number 都会被记录，共线性问题无处藏身。',
        },
        {
          type: 'callout',
          variant: 'warn',
          title: 'Cell 24 的裁判规则',
          md: '调查变量**不会**因为提高了 in-sample R² 就被接受。它必须在 Pre-2016 验证期里**降低 12-month-ahead RMSE**，才有资格谈贡献。样本内的漂亮从来不算数——这条规则下一课马上用到。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'Home survey expanded 的 condition number 是 81.2，而 Home baseline 只有 6.6。这最能说明什么？',
            options: [
              {
                id: 'a',
                text: '设计矩阵接近病态，多重共线性风险升高，系数估计变得不稳定',
                correct: true,
                explanation: '正确！Condition number 是共线性/病态程度的警报器。81.2 对 6.6 说明加入调查变量后，系数估计对数据扰动敏感得多——这正是"主规范刻意做小"的量化理由。',
              },
              {
                id: 'b',
                text: 'Survey 模型的预测误差一定是 baseline 的 12 倍',
                correct: false,
                explanation: '错在单位换算：condition number 不是误差指标，不能按倍数换算成 RMSE。事实上 2016+ final test 里 Home survey expanded 的 RMSE（2.698）还略低于 baseline（2.797）。正确思路：condition number 说的是"系数稳定性"，不是"预测误差大小"。',
              },
              {
                id: 'c',
                text: '说明 baseline 欠拟合，应该往里加更多变量',
                correct: false,
                explanation: '错在方向：baseline 的 in-sample R² 是 0.715，与 survey 模型的 0.721 几乎相同——加变量的拟合收益微乎其微，代价却是 condition number 涨到 81.2。低 condition number 是优点（稳定），不是欠拟合的证据。应复习 Overfitting 与 Condition Number 的含义。',
              },
            ],
            conceptReview: '多重共线性（Multicollinearity）与条件数（Condition Number）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '警报值翻了几倍？',
            instructions: '用 Cell 35 的数字算一算：Home survey expanded 的 condition number 是 Home baseline 的多少倍？（保留 1 位小数）',
            prompt: '81.198 ÷ 6.649 ≈ ?',
            answer: 12.2,
            tolerance: 0.6,
            unit: '倍',
            solution: '81.198 ÷ 6.649 ≈ 12.2 倍。只多加了一个费城调查变量，共线性警报就放大了约 12 倍，而 in-sample R² 只从 0.715 提高到 0.721。收益微小、稳定性代价巨大——这就是不选大模型的算术理由。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：为什么"变量最多的模型"反而不被选为主预测？请提到两个陷阱和 condition number 的证据。',
            keywords: ['multicollinearity', 'overfitting', '81'],
            modelAnswer: '因为相关变量堆在一起会产生 multicollinearity（回归分不清功劳，系数不稳定）和 overfitting（背下噪声，样本外变差）。证据是 condition number：Home baseline 只有 6.6，加入调查变量的 survey expanded 涨到 81.2，约 12 倍；而 in-sample R² 只从 0.715 到 0.721。所以主规范刻意做小，新变量必须在验证期降低 OOS RMSE 才算有贡献。',
          },
        },
      ],
    },
    {
      id: 'm7-l4',
      moduleId: 'm7',
      title: 'Checkpoint · 诚实的成绩单与 Primary 的选择',
      xp: 100,
      minutes: 12,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '会读 Pre-2016 Validation 成绩单：8 个模型、各 180 个 12-month-ahead 预测',
            '诚实面对事实：Home baseline 验证期 RMSE 3.442 排名靠后',
            '能说清为什么它仍是 Primary：全国性、透明、经济逻辑直接 + final test 表现良好',
          ],
        },
        {
          type: 'text',
          md: 'Cell 23 把 8 个模型放上同一条验证跑道：forecast origins 从 **2000-01 到 2014-12**（共 180 个），每个 origin 预测未来 12 个月，所有结果在 2015-12 前全部实现——完全不碰 2016 年之后的"封存考卷"。下面是 12-month-ahead 的成绩单：',
        },
        {
          type: 'table',
          headers: ['模型', '分项', 'OOS RMSE (pp)', 'OOS R² vs No-change', 'Mean Error'],
          rows: [
            ['Away survey expanded', 'Away', '0.566', '0.679', '0.014'],
            ['Away long-history baseline', 'Away', '0.940', '0.115', '−0.295'],
            ['Away food-cost', 'Away', '1.164', '−0.357', '−0.620'],
            ['Home global-food', 'Home', '2.322', '0.460', '−0.534'],
            ['Home food-manufacturing', 'Home', '2.944', '0.132', '−1.227'],
            ['Home survey expanded', 'Home', '3.145', '0.009', '−1.244'],
            ['Home baseline', 'Home', '3.442', '−0.187', '−1.410'],
            ['Home upstream-energy', 'Home', '3.538', '−0.254', '−1.612'],
          ],
          note: '出自 Cell 23：每个模型 180 个 12-month-ahead 预测（origins 2000-01 至 2014-12）。Mean Error = Actual − Forecast，负值表示预测平均偏高。',
        },
        {
          type: 'chart',
          id: 'validationRmse',
          caption: 'Pre-2016 Validation：8 个模型的 12-month-ahead OOS RMSE 对比',
        },
        {
          type: 'text',
          md: '诚实地读这张成绩单：\n\n- Away 侧：`Away survey expanded` RMSE **0.566**，全场最佳。\n- Home 侧：最好的是 `Home global-food`（2.322）；而我们的 Primary `Home baseline` 是 **3.442**，5 个 Home 模型里排第 4，OOS R² 为 **−0.187**——验证期里它甚至没跑赢 no-change benchmark，且平均高估约 1.4 pp（Mean Error −1.410）。\n\n这不是需要掩盖的丑闻，而是需要解释的事实。在 Pacific Life 面前主动摆出 3.442，比被追问时支支吾吾可信得多。',
        },
        {
          type: 'text',
          md: '那为什么 `Home baseline` 仍然是 Primary？四个理由：\n\n1. **全国性**：WPU02 是覆盖全国的食品生产端 PPI，与全国 CPI 目标同覆盖；global-food 是全球指数（1992 年才开始）、费城调查是区域性指标，代表性都要打折。\n2. **透明**：一个 predictor、两个系数，能在会议上一句话讲清楚，审计和复现都容易。\n3. **经济逻辑直接**：生产端成本 → 零售食品价格，传导路径清晰，不依赖间接渠道。\n4. **Final test 表现良好**：在真正封存的 2016+ 测试期，它 RMSE **2.797**、OOS R² **0.600**，与其他 Home 模型（2.698–2.810）差距不到 0.12 pp——简单模型并没有输。\n\n再加上 Cell 18 的原则：robustness 模型是检查项，**不是 baseline 的自动替代品**。综合下来，验证期的弱点被如实记录，但不足以推翻 Primary 的选择。',
        },
        {
          type: 'chart',
          id: 'finalTestR2',
          caption: '2016+ Final Test 的 OOS R² 对比：Home baseline 达到 0.600，与更复杂的 Home 模型不相上下',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '验证期',
              en: 'Pre-2016 Validation',
              definition: '2000-01 至 2014-12 的 forecast origins，用来在打开最终考卷之前比较各模型的样本外表现。',
              example: '8 个模型各生成 180 个 12-month-ahead 预测，最后一批在 2015-12 实现。',
            },
            {
              zh: '平均误差',
              en: 'Mean Error',
              definition: 'Actual − Forecast 的平均值。接近 0 表示没有系统偏差；负值表示预测平均偏高（高估）。',
              example: 'Home baseline 验证期 Mean Error 为 −1.410：那 15 年里它平均高估约 1.4 pp。',
            },
            {
              zh: '模型选择',
              en: 'Model Selection',
              definition: '综合样本外表现、数据代表性、透明度和经济逻辑来挑选主模型的过程——不是只看单一指标的排行榜。',
              example: 'Home baseline 验证期 RMSE 不是最低，但凭全国性、透明、逻辑直接和 final test 表现被保留为 Primary。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 25 · 自动点名验证期冠军',
          code: 'for component in ["Food at Home", "Food Away from Home"]:\n    subset = validation_comparison.loc[\n        validation_comparison["Component"] == component]\n    best_row = subset.sort_values("OOS_RMSE").iloc[0]\n    print(f"Best pre-2016 validation model for {component}: "\n          f"{best_row[\'Model\']} (RMSE {best_row[\'OOS_RMSE\']:.3f} pp)")',
          output: 'Best pre-2016 validation model for Food at Home: Home global-food (RMSE 2.322 pp)\nBest pre-2016 validation model for Food Away from Home: Away survey expanded (RMSE 0.566 pp)',
          note: 'Notebook 自己把"验证期冠军不是 Primary"打印出来——这份诚实正是答辩时的底气：弱点是被看见并解释过的，不是被藏起来的。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '验证期里 Home baseline 的 RMSE 是 3.442，在 5 个 Home 模型中排第 4。为什么它仍被选为 Primary？',
            options: [
              {
                id: 'a',
                text: '因为它其实是验证期表现最好的 Home 模型',
                correct: false,
                explanation: '错在事实：验证期最好的 Home 模型是 Home global-food（RMSE 2.322），Cell 25 明确打印了这一点。选 Home baseline 恰恰不是因为验证期成绩——承认这一点才是正确的答辩姿势。',
              },
              {
                id: 'b',
                text: '因为它全国性、透明、经济逻辑直接，且在 2016+ final test 中 RMSE 2.797、OOS R² 0.600 表现良好',
                correct: true,
                explanation: '正确！模型选择是综合判断：WPU02 覆盖全国、单变量方程透明可解释、生产端成本传导到零售价格的逻辑直接；而且在封存的最终测试期它表现良好，与更复杂的 Home 模型差距不到 0.12 pp。',
              },
              {
                id: 'c',
                text: '因为验证期结果不重要，可以直接忽略',
                correct: false,
                explanation: '错在态度：验证期正是用来筛选和理解模型的关键阶段，3.442 和 −0.187 都要如实呈现并解释（包括平均高估 1.4 pp 的系统偏差）。诚实呈现弱点 + 说明综合理由，才是可信的模型选择，不是"忽略"。',
              },
            ],
            conceptReview: '模型选择（Model Selection）：样本外表现之外还要看代表性、透明度与经济逻辑',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '验证期成绩单速查',
            instructions: '把模型和它在 Pre-2016 验证期的成绩配对（12-month-ahead OOS RMSE）。',
            pairs: [
              { left: 'Away survey expanded', right: 'RMSE 0.566 · 全场最佳' },
              { left: 'Home global-food', right: 'RMSE 2.322 · Home 侧最佳' },
              { left: 'Home baseline', right: 'RMSE 3.442 · 排名靠后但仍是 Primary' },
              { left: 'Home upstream-energy', right: 'RMSE 3.538 · Home 侧最差' },
            ],
            feedbackCorrect: '全对！记住这组数字：0.566 / 2.322 / 3.442——答辩时你要能不看表说出"验证期冠军是谁、Primary 排第几、为什么仍选它"。',
            feedbackWrong: '回到验证表：Away survey expanded 0.566 是全场最低；Home 侧从好到差是 global-food 2.322 → food-manufacturing 2.944 → survey expanded 3.145 → baseline 3.442 → upstream-energy 3.538。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '模拟答辩：请诚实回答"你的 Home 主模型在验证期不是最好的，为什么还用它？"（提到验证期与 final test 的具体数字）',
            keywords: ['3.442', '2.797', '全国'],
            modelAnswer: '先承认事实：验证期（2000-2014 origins）Home baseline 的 RMSE 是 3.442，不如 global-food 的 2.322，还平均高估约 1.4 pp。但选 Primary 是综合判断：WPU02 是全国性生产端 PPI，与全国 CPI 目标匹配；单变量方程透明、经济逻辑直接；而且在封存的 2016+ final test 里它 RMSE 2.797、OOS R² 0.600，与其他 Home 模型差距不到 0.12 pp。稳健性模型是检查项，不是自动替代品。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经掌握 9 名选手的名单、四个家族的分工、简单模型胜出的统计学理由，以及一份诚实的验证成绩单。下一站 Module 8：亲手拆开 expanding-window 回测引擎，看这些成绩单是怎么一格一格算出来的。',
        },
      ],
    },
  ],
}
