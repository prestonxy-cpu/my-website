import type { CourseModule } from '../../types'

/**
 * Module 10：组合 Total Food CPI
 * Relative Importance 权重 → 加权组合验算（0.6089×2.63+0.3911×3.63≈3.02）
 * → Headline 贡献（×13.447/100≈0.41 pp）。
 * 全部数值出自 Notebook Cell 5 与 Cell 37（modelResults.ts 第 2、11、12 节）。
 */
export const module10: CourseModule = {
  id: 'm10',
  order: 10,
  title: 'Module 10 · 组合 Total Food CPI',
  subtitle: '把 Home 和 Away 两个预测加权合成一个数字，再换算成 Headline 贡献',
  icon: '⚖️',
  accent: 'mint',
  lessons: [
    {
      id: 'm10-l1',
      moduleId: 'm10',
      title: '权重从哪里来：Relative Importance',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 Home 8.188、Away 5.260、Total Food 13.447 这三个权重数字的来源',
            '会用公式算出 Food 内部权重：HomeWeight ≈ 0.6089、AwayWeight ≈ 0.3911',
            '分清"Food 内部权重"和"Food 在 Headline 中的权重"是两码事',
          ],
        },
        {
          type: 'text',
          md: '现在手里有两个预测：Home 的 2.63% 和 Away 的 3.63%（2027-06）。要合成一个 Total Food 数字，不能简单取平均——因为美国家庭在"买菜"和"下馆子"上花的钱**不一样多**。\n\n花钱比例来自 BLS（美国劳工统计局）公布的 **Relative Importance（相对重要性权重）**——每个 CPI 组件在总指数中的占比。本模型使用 2026 年 6 月 CPI 发布中的权重（2026 年 5 月 relative importance）：\n\n- Food at Home：**8.188**\n- Food Away from Home：**5.260**\n- Total Food：**13.447**（约占 Headline CPI 的 13.4%）\n\n要把两个分项合成 Total Food，需要的是它们在 **Food 内部**的占比：各自的权重除以两者之和（8.188 + 5.260 = 13.448）。',
        },
        {
          type: 'formula',
          lhs: 'HomeWeight',
          rhs: '8.188 / (8.188 + 5.260) = 8.188 / 13.448 ≈ 0.6089',
          note: '家庭食品约占 Food 支出的 61%',
        },
        {
          type: 'formula',
          lhs: 'AwayWeight',
          rhs: '5.260 / 13.448 ≈ 0.3911',
          note: '在外饮食约占 39%。两个权重相加恰好为 1',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '13.448 和 13.447 差了 0.001？',
          md: '分项之和 8.188 + 5.260 = **13.448**，而 BLS 公布的 Total Food 是 **13.447**——这是官方数字各自四舍五入造成的微小差异。Notebook 的处理：算 **Food 内部权重**时用分项之和 13.448（保证两权重加起来等于 1）；换算**对 Headline 的贡献**时用官方 Total 13.447。',
        },
        {
          type: 'chart',
          id: 'weightsBar',
          caption: 'Food CPI 内部权重：Home 8.188（≈60.9%）与 Away 5.260（≈39.1%），合计约 13.45',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '相对重要性权重',
              en: 'Relative Importance',
              definition: 'BLS 公布的每个 CPI 组件在总指数中的占比，反映家庭支出结构，随时间更新。',
              example: 'Total Food 的 relative importance 是 13.447，即食品约占 Headline CPI 的 13.4%。',
            },
            {
              zh: 'Food 内部权重',
              en: 'Weight inside Food',
              definition: '把某个 Food 分项的权重除以两个分项权重之和，得到它在 Food 内部的占比，用于组合两个分项预测。',
              example: 'HomeWeight = 8.188 / 13.448 ≈ 0.6089。',
            },
            {
              zh: '美国劳工统计局',
              en: 'BLS (Bureau of Labor Statistics)',
              definition: '负责编制和发布 CPI 及其组件权重的官方机构。',
              example: '本模型的三个权重数字都来自 BLS 的 CPI 发布。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 5：权重常量的定义',
          code: 'FOOD_AT_HOME_RELATIVE_IMPORTANCE = 8.188\nFOOD_AWAY_RELATIVE_IMPORTANCE = 5.260\nTOTAL_FOOD_RELATIVE_IMPORTANCE = 13.447\n\ncomponent_weight_sum = FOOD_AT_HOME_RELATIVE_IMPORTANCE + FOOD_AWAY_RELATIVE_IMPORTANCE\nHOME_WEIGHT_INSIDE_FOOD = FOOD_AT_HOME_RELATIVE_IMPORTANCE / component_weight_sum\nAWAY_WEIGHT_INSIDE_FOOD = FOOD_AWAY_RELATIVE_IMPORTANCE / component_weight_sum',
          output: 'HOME_WEIGHT_INSIDE_FOOD ≈ 0.6089\nAWAY_WEIGHT_INSIDE_FOOD ≈ 0.3911',
          note: '权重在 Notebook 一开始（第 3 章）就定义为常量，后面组合预测和算贡献时反复使用。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'HomeWeight ≈ 0.6089 的正确含义是？',
            options: [
              {
                id: 'a',
                text: 'Food at Home 约占 Headline CPI 的 60.89%',
                correct: false,
                explanation: '错在分母：0.6089 的分母是 Food 内部（13.448），不是整个 Headline CPI。Food at Home 在 Headline 中只占 8.188%。正确思路：0.6089 回答的是"Food 这块蛋糕里，买菜占多大"。',
              },
              {
                id: 'b',
                text: 'Food at Home 在 Total Food 内部约占 60.89%',
                correct: true,
                explanation: '正确！8.188 / (8.188 + 5.260) ≈ 0.6089，表示在食品支出内部，家庭食品约占六成、在外饮食约占四成。组合两个分项预测时就按这个比例加权。',
              },
              {
                id: 'c',
                text: 'Home 模型的预测有 60.89% 的概率是对的',
                correct: false,
                explanation: '错在类别：0.6089 是**支出占比权重**，和预测准确率毫无关系。模型准确度要看 RMSE 和 OOS R²（Module 11 的内容）。应复习 Relative Importance 的定义。',
              },
            ],
            conceptReview: '相对重要性与内部权重（Relative Importance & Weight inside Food）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '算出 AwayWeight',
            instructions: '用 Away 的 relative importance（5.260）和分项之和（13.448）算出 Away 在 Food 内部的权重（保留 4 位小数）。',
            prompt: '5.260 / 13.448 =',
            answer: 0.3911,
            tolerance: 0.002,
            unit: '',
            solution: '5.260 ÷ 13.448 ≈ 0.3911。验算：HomeWeight 0.6089 + AwayWeight 0.3911 = 1，两个权重必须加起来等于 1，否则组合出的 Total Food 会凭空放大或缩小。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：组合 Home 和 Away 时为什么不能简单取平均？权重是怎么定出来的？',
            keywords: ['8.188', '5.26', '权重'],
            modelAnswer: '因为家庭在买菜和下馆子上的花费不同：BLS 的 relative importance 显示 Home 是 8.188、Away 是 5.260。组合时按各自占 Food 内部的比例加权：Home 占 8.188/13.448 ≈ 0.6089，Away 占 5.260/13.448 ≈ 0.3911。简单平均等于假设两者各占一半，会歪曲 Total Food。',
          },
        },
      ],
    },
    {
      id: 'm10-l2',
      moduleId: 'm10',
      title: '组合公式与验算：得到 3.02%',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '会写出并使用 Total Food 的加权组合公式',
            '能用 2027-06 的数字亲手验算出 3.02%',
            '知道 12 个预测月每个月都做一次同样的组合',
          ],
        },
        {
          type: 'text',
          md: '组合就是一步**加权平均（Weighted Average）**：把两个分项的同月预测按内部权重加权相加。\n\n用 2027-06（h12）验算一遍。两个原料来自 Module 9：Home = 2.6288（假设情景下的恒定值），Away = 3.6318（由 2026-06 工资驱动）。\n\n- 精确计算：0.6089 × 2.628797 + 0.3911 × 3.631765 = **3.021094**\n- 会议口算版：0.6089 × 2.63 + 0.3911 × 3.63 ≈ 1.60 + 1.42 ≈ **3.02**\n\n这就是主预测 **3.02%** 的全部来历——没有黑箱，就是两个回归输出的加权平均。注意它**不是**简单平均：(2.63 + 3.63) / 2 = 3.13，会高估 Total Food，因为权重较大的 Home 通胀恰好较低。\n\n同样的组合对 h1 到 h12 每个月各做一次：比如 2026-09 和 2026-12 都组合出 2.99%。',
        },
        {
          type: 'formula',
          lhs: 'TotalFood(t)',
          rhs: '0.6089 × Home(t) + 0.3911 × Away(t)',
          note: '对 12 个预测月逐月执行；权重不随月份变化',
        },
        {
          type: 'widget',
          id: 'combineCalculator',
          caption: '亲手组合：输入任意 Home 和 Away 值，看权重、Total Food 和 Headline 贡献如何逐步算出',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '加权平均',
              en: 'Weighted Average',
              definition: '每个数乘以自己的权重后相加。权重之和为 1 时，结果落在参与的数之间、偏向权重大的那个。',
              example: '3.02 比简单平均 3.13 更靠近 Home 的 2.63，因为 Home 权重 0.6089 更大。',
            },
            {
              zh: '组合预测',
              en: 'Combined Forecast',
              definition: '由多个组件预测按权重合成的整体预测。Bottom-up 方法的核心一步。',
              example: 'Total Food 的 12 个月预测就是 Home 与 Away 逐月组合的结果。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 37：combine_current_forecasts',
          code: 'result["food_yoy"] = (\n    HOME_WEIGHT_INSIDE_FOOD * result["food_at_home_yoy"]\n    + AWAY_WEIGHT_INSIDE_FOOD * result["food_away_yoy"]\n)\n\nprimary_current_forecast = combine_current_forecasts(\n    current_component_forecasts["Home baseline"],\n    current_component_forecasts["Away legacy all-employee"],\n    "Primary baseline",\n)',
          output: 'Model_family      date        food_at_home_yoy  food_away_yoy  food_yoy\nPrimary baseline  2026-09-01  2.628797          3.547867       2.988279\nPrimary baseline  2026-12-01  2.628797          3.550307       2.989233\nPrimary baseline  2027-06-01  2.628797          3.631765       3.021094',
          note: '每一行都是一次加权组合。h12 那行的 3.021094 四舍五入后就是会议上的 3.02%。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '用会议数字验算：Home = 2.63，Away = 3.63，组合出的 Total Food 约是多少？',
            options: [
              {
                id: 'a',
                text: '约 3.02%（0.6089 × 2.63 + 0.3911 × 3.63）',
                correct: true,
                explanation: '正确！1.6014 + 1.4197 ≈ 3.02。结果偏向权重更大的 Home（2.63），这正是加权平均应有的行为。',
              },
              {
                id: 'b',
                text: '约 3.13%（(2.63 + 3.63) / 2）',
                correct: false,
                explanation: '错在用了简单平均：这等于假设 Home 和 Away 各占一半支出。实际上家庭食品占约 61%，在外饮食占约 39%，必须按 0.6089 和 0.3911 加权。简单平均会把 Total Food 高估约 0.11 个百分点。',
              },
              {
                id: 'c',
                text: '约 6.26%（2.63 + 3.63）',
                correct: false,
                explanation: '错在直接相加：两个分项是同一块蛋糕的两部分，不是两块独立的蛋糕。相加会把食品通胀数成两倍。正确做法是权重和为 1 的加权平均。应复习 Weighted Average。',
              },
            ],
            conceptReview: '加权平均组合（Weighted Average Combination）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手组合出主预测',
            instructions: '用内部权重组合 2027-06 的两个分项预测（保留 2 位小数）。',
            prompt: '0.6089 × 2.63 + 0.3911 × 3.63 =',
            answer: 3.02,
            tolerance: 0.02,
            unit: '%',
            solution: '0.6089 × 2.63 = 1.6014；0.3911 × 3.63 = 1.4197；相加 ≈ 3.02。Notebook 用未四舍五入的分项值算出精确结果 3.021094——这就是 Primary 主预测 3.02% 的出处。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '会议模拟：请从两个分项数字出发，口头推导出 3.02% 这个主预测。',
            keywords: ['0.6089', '0.3911', '3.02'],
            modelAnswer: '2027-06 的 Home 预测是 2.63（PPI 假设情景），Away 预测是 3.63（由 2026-06 已观察工资驱动）。按 Food 内部权重组合：0.6089 × 2.63 + 0.3911 × 3.63 ≈ 3.02。所以 Primary 对 2027-06 Total Food CPI YoY 的预测是 3.02%，它偏向权重更大的 Home 分项。',
          },
        },
      ],
    },
    {
      id: 'm10-l3',
      moduleId: 'm10',
      title: 'Checkpoint · 换算成 Headline CPI 贡献',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '会用贡献公式：Contribution = Total Food YoY × 13.447 / 100',
            '能算出并解释 0.41 pp 这个数字的含义',
            '理解贡献数字是交给 Bottom-up 团队的最终交付物',
          ],
        },
        {
          type: 'text',
          md: '最后一步：把 Food 通胀翻译成**团队语言**。做 Bottom-up 汇总的队友不需要"食品涨 3.02%"，他们需要"食品给 Headline CPI 贡献了多少个百分点"。\n\n换算只需一乘：Total Food YoY 乘以它在 Headline 中的权重（13.447 / 100）。\n\n- 2027-06 预测：3.021094 × 13.447 / 100 = **0.406** ≈ **0.41 pp**\n- 最新实际值（2026-06）：2.987321 × 13.447 / 100 = **0.4017** ≈ **0.40 pp**\n\n**0.41 pp 的读法**：如果 Food 预测成立，那么 2027-06 的 Headline CPI 同比通胀中，约有 0.41 个百分点是食品贡献的。假如 Headline 通胀是 3%，其中食品贡献 0.41 个百分点，其余 2.59 个百分点来自住房、能源等其他组件。\n\n注意单位是 **pp（percentage point，百分点）**，不是 %。贡献是"从通胀率里切出来的一块"，所以用百分点计量。',
        },
        {
          type: 'formula',
          lhs: 'Contribution(t)',
          rhs: 'TotalFood(t) × 13.447 / 100',
          note: '13.447 是 Total Food 在 Headline CPI 中的 relative importance；除以 100 把权重从百分数变成比例',
        },
        {
          type: 'table',
          headers: ['Horizon', '月份', 'Home', 'Away', 'Total Food', '贡献 (pp)'],
          rows: [
            ['Latest Actual', '2026-06', '2.70', '3.37', '2.99', '0.40'],
            ['+3 Months', '2026-09', '2.63', '3.55', '2.99', '0.40'],
            ['+6 Months', '2026-12', '2.63', '3.55', '2.99', '0.40'],
            ['+12 Months', '2027-06', '2.63', '3.63', '3.02', '0.41'],
          ],
          note: '会议 PPT 摘要（Cell 41，四舍五入到 2 位）：从最新实际值到 12 个月预测的完整链条。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '对整体 CPI 的贡献',
              en: 'Contribution to Headline CPI',
              definition: '某组件的通胀率乘以它在 Headline 中的权重，表示它为整体通胀"贡献"了多少个百分点。',
              example: '2027-06 预测贡献 3.02 × 13.447/100 ≈ 0.41 pp。',
            },
            {
              zh: '百分点',
              en: 'Percentage Point (pp)',
              definition: '两个百分数相差的绝对量单位。通胀率用 %，通胀率的组成和变化用 pp。',
              example: '食品贡献 0.41 pp，指 Headline 通胀率中有 0.41 个百分点来自食品。',
            },
          ],
        },
        {
          type: 'notebook',
          title: 'Notebook Cell 37：贡献列与最新实际值',
          code: 'result["contribution_to_headline_cpi_pp"] = result["food_yoy"] * TOTAL_FOOD_RELATIVE_IMPORTANCE / 100\n\nlatest_actual = pd.DataFrame([{\n    "Model_family": "Actual",\n    "date": current_origin,  # 2026-06\n    "food_yoy": model_data.loc[current_origin, "food_total_cpi"],\n    "contribution_to_headline_cpi_pp": model_data.loc[current_origin, "food_total_cpi"] * TOTAL_FOOD_RELATIVE_IMPORTANCE / 100,\n}])',
          output: 'Model_family      date        food_yoy   contribution_to_headline_cpi_pp\nActual            2026-06-01  2.987321   0.401705\nPrimary baseline  2027-06-01  3.021094   0.406247',
          note: '贡献列对表中每一行（实际值 + 12 个预测月）统一计算，用的都是官方 Total 权重 13.447。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '"2027-06 食品对 Headline CPI 的贡献约 0.41 pp"——这句话的正确理解是？',
            options: [
              {
                id: 'a',
                text: '如果预测成立，Headline CPI 同比通胀中约有 0.41 个百分点来自食品',
                correct: true,
                explanation: '正确！贡献 = 组件通胀 × 组件权重 = 3.02% × 0.13447 ≈ 0.41 pp。队友把各组件的贡献相加，就得到 Bottom-up 的 Headline 通胀预测。',
              },
              {
                id: 'b',
                text: '食品价格 2027-06 只会上涨 0.41%',
                correct: false,
                explanation: '错在混淆两个数字：食品通胀本身是 3.02%，0.41 pp 是它乘以权重之后"摊到 Headline 上"的份额。食品只占约 13.4% 的篮子，所以 3.02% 的涨幅只贡献 0.41 个百分点。应复习贡献公式。',
              },
              {
                id: 'c',
                text: 'Food 在 Headline CPI 中的权重是 0.41%',
                correct: false,
                explanation: '错在类别：权重是 13.447（约 13.4%），0.41 pp 是"通胀 × 权重"的乘积结果，不是权重本身。两个数字在会议上都可能被问到，别互相串。正确思路：贡献 = 3.02 × 13.447 / 100。',
              },
            ],
            conceptReview: '贡献与百分点（Contribution & Percentage Point）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '算出最终交付的贡献数字',
            instructions: '用 2027-06 的 Total Food 预测（3.02）和 relative importance（13.447）算出对 Headline 的贡献（保留 2–3 位小数）。',
            prompt: '3.02 × 13.447 / 100 =',
            answer: 0.406,
            tolerance: 0.01,
            unit: 'pp',
            solution: '3.02 × 13.447 = 40.61，除以 100 得 0.406，四舍五入约 0.41 pp。Notebook 用精确值算出 3.021094 × 13.447 / 100 = 0.406247。这就是交给 Bottom-up 团队的最终数字。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '会议模拟："How is Food CPI converted into a Headline CPI contribution?" 用自己的话完整回答（公式、数字、含义）。',
            keywords: ['13.447', '0.41', '贡献', 'headline'],
            modelAnswer: '把 Total Food YoY 乘以它在 Headline CPI 中的 relative importance 再除以 100：贡献 = 3.02 × 13.447 / 100 ≈ 0.41 pp。含义是：若预测成立，2027-06 的 Headline 通胀中约 0.41 个百分点来自食品。最新实际值（2026-06）的贡献是 2.99 × 13.447 / 100 ≈ 0.40 pp。这个贡献数字就是我交给 Bottom-up 团队去和其他组件加总的最终交付物。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '从两个分项预测到 3.02%，再到 0.41 pp——Food CPI 的完整产出链你已经全部打通。下一模块学习如何评价这些预测到底有多可信（RMSE、OOS R² 与区间）。',
        },
      ],
    },
  ],
}
