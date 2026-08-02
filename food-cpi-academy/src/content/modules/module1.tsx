import type { CourseModule } from '../../types'

/**
 * Module 1：认识 Food CPI
 * CPI 水平 vs 通胀率、MoM vs YoY、Food at Home vs Food Away from Home、
 * 以及为什么两个分项要分开预测。
 */
export const module1: CourseModule = {
  id: 'm1',
  order: 1,
  title: 'Module 1 · 认识 Food CPI',
  subtitle: '看懂你要预测的对象：指数、通胀率和两个分项',
  icon: '🛒',
  accent: 'sky',
  lessons: [
    {
      id: 'm1-l1',
      moduleId: 'm1',
      title: 'CPI 水平和通胀率是两回事',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清 CPI 指数水平（Level）和通胀率（Inflation Rate）',
            '知道 2026 年 6 月 Total Food CPI 的两个数字：水平 349.609、同比 2.99%',
            '理解为什么模型预测的是"增长率"而不是"指数本身"',
          ],
        },
        {
          type: 'text',
          md: '打开 FRED 查 Total Food CPI（代码 `CPIUFDSL`），你会看到 2026 年 6 月的数字是 **349.609**。它不是"食品要 349 美元"，而是一个**指数水平（Index Level）**：把某个基期的价格记为 100，之后价格整体涨到几倍，指数就跟着变成多少。349.609 的意思是——食品的整体价格已经涨到基期的约 3.5 倍。\n\n但项目要预测的**不是这个水平，而是它的增长速度**。就像描述一个孩子：身高 175cm 是"水平"，一年长高 3% 是"速度"。Pacific Life 关心的是"食品价格涨得多快"，也就是**通胀率（Inflation Rate）**。2026 年 6 月，Total Food CPI 比一年前高了 **2.99%**——这才是模型的预测对象。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '指数水平',
              en: 'Index Level',
              definition: '把基期价格记为 100 后，价格整体涨跌换算出来的相对数值。它没有单位，也不是美元金额。',
              example: '2026 年 6 月 Total Food CPI 的指数水平是 349.609。',
            },
            {
              zh: '食品 CPI 总指数',
              en: 'Total Food CPI (CPIUFDSL)',
              definition: '覆盖全部食品（在家吃 + 在外吃）的 CPI 分项指数，FRED 代码是 CPIUFDSL，历史从 1947 年开始。',
              example: '它是本项目三大预测目标之一。',
            },
            {
              zh: '变化率',
              en: 'Rate of Change',
              definition: '指数在一段时间内涨了百分之多少。通胀率就是价格指数的变化率。',
              example: '2026 年 6 月 Total Food CPI 同比变化率为 2.99%。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'foodHistoryRecent',
          caption: '2015 年至今的三条 Food CPI 同比通胀率——注意纵轴是"每年涨多少 %"，不是指数水平',
        },
        {
          type: 'notebook',
          title: 'Notebook 里的两张表：水平表和增长率表',
          code: 'display(data.tail(6))         # 原始指数水平（Level）\ndisplay(model_data.tail(6))   # 转换后的同比增长率（YoY %）',
          output: 'food_total_cpi（Level）:  2026-05  348.892   |  2026-06  349.609\nfood_total_cpi（YoY %）:  2026-05  3.077932  |  2026-06  2.987321',
          note: 'Notebook 始终维护两套数字：`data` 存指数水平，`model_data` 存增长率。同一个月、同一个序列，349.609 和 2.99% 描述的是完全不同的东西。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '2026 年 6 月：Total Food CPI 指数水平 349.609，同比通胀率 2.99%。下面哪个理解是对的？',
            options: [
              {
                id: 'a',
                text: '349.609 表示食品价格一年之内涨了 349.609%',
                correct: false,
                explanation: '错在把水平当成了变化率：349.609 是相对基期的指数水平，不是任何时间段的涨幅。一年涨了多少要看同比变化率，也就是 2.99%。正确思路：先问自己"这个数字有没有和另一个时点比较"。',
              },
              {
                id: 'b',
                text: '349.609 是相对基期的指数水平；2.99% 是它比一年前涨了多少',
                correct: true,
                explanation: '正确！指数水平回答"价格现在处于什么位置"，通胀率回答"价格涨得多快"。模型预测的是后者。',
              },
              {
                id: 'c',
                text: '2.99% 是指数水平，349.609 是通胀率，两个数字被说反了',
                correct: false,
                explanation: '错在方向搞反了：通胀率是一个百分比（通常个位数），指数水平是累计了几十年涨幅的相对数值（几十到几百）。2.99% 这种量级不可能是从 1947 年累计到今天的指数水平。应复习"指数水平 vs 变化率"。',
              },
            ],
            conceptReview: '指数水平（Index Level）vs 通胀率（Inflation Rate）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '水平还是速度？',
            instructions: '把左边的数字或比喻，和右边的概念配对。',
            pairs: [
              { left: '身高 175cm', right: '水平（Level）的比喻' },
              { left: '一年长高 3%', right: '变化率（Rate）的比喻' },
              { left: '349.609（2026-06）', right: 'Total Food CPI 指数水平' },
              { left: '2.99%（2026-06）', right: 'Total Food CPI 同比通胀率' },
            ],
            feedbackCorrect: '全对！以后看到任何数字，先问一句："这是水平还是速度？"——这个习惯能帮你避开一大半误读。',
            feedbackWrong: '再想想比喻：身高是"现在的位置"（水平），长高速度是"变化有多快"（变化率）。349.609 是位置，2.99% 是速度。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：指数水平和通胀率有什么区别？用 2026 年 6 月的两个真实数字举例。',
            keywords: ['水平', '通胀', '349', '2.99'],
            modelAnswer: '指数水平描述价格现在的位置：把基期记为 100，2026 年 6 月 Total Food CPI 的水平是 349.609。通胀率描述价格涨的速度：同一个月的同比通胀率是 2.99%，表示比一年前贵了约 2.99%。模型预测的是通胀率，不是指数水平。',
          },
        },
      ],
    },
    {
      id: 'm1-l2',
      moduleId: 'm1',
      title: 'MoM 与 YoY：跟谁比很重要',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清环比（MoM）和同比（YoY）',
            '会用公式把指数水平换算成 YoY % Change',
            '知道本项目全部预测目标都用 YoY 口径',
          ],
        },
        {
          type: 'text',
          md: '算变化率之前要先回答：**跟谁比？**\n\n- **环比（MoM, Month-over-Month）**：跟**上个月**比。Total Food CPI 从 2026 年 5 月的 348.892 涨到 6 月的 349.609，环比约 0.2%。\n- **同比（YoY, Year-over-Year）**：跟**去年同一个月**比。349.609 比 2025 年 6 月的水平高了 2.99%，这就是同比。\n\n本项目全部用 **YoY**。原因很实际：MoM 每月只挪一小步，数字小、噪音大，一条新闻就能让它上蹿下跳；YoY 覆盖整整 12 个月，把短期噪音摊平了，而且"同比通胀"正是 Pacific Life 想要的口径——新闻里说的"食品通胀 2.99%"就是它。',
        },
        {
          type: 'formula',
          lhs: 'YoY %(t)',
          rhs: '( Index(t) / Index(t−12) − 1 ) × 100',
          note: 'Index(t−12) 是 12 个月前的指数水平。这也意味着：一条序列最开始的 12 个月算不出 YoY。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '环比',
              en: 'MoM (Month-over-Month % Change)',
              definition: '本月相对上个月的变化率。反应快但噪音大。',
              example: 'Total Food CPI 从 348.892（2026-05）到 349.609（2026-06），环比约 0.2%。',
            },
            {
              zh: '同比',
              en: 'YoY (Year-over-Year % Change)',
              definition: '本月相对去年同月的变化率。覆盖 12 个月，比环比平滑，是最常用的通胀口径。',
              example: '2026 年 6 月 Total Food CPI 同比为 2.99%。',
            },
            {
              zh: '噪音',
              en: 'Noise',
              definition: '数据里与真实趋势无关的短期随机波动。噪音越大，越难看清方向。',
              example: 'MoM 逐月跳动大，就是噪音较大的表现；YoY 把 12 个月的变化合在一起看，噪音小得多。',
            },
          ],
        },
        {
          type: 'notebook',
          title: '一行代码完成 YoY 转换（Cell 13）',
          code: 'for variable, rule in transform_rules.items():\n    if rule == "yoy_pct":\n        model_data[variable] = data[variable].pct_change(periods=12, fill_method=None) * 100',
          output: 'food_total_cpi YoY %:  2026-04  3.216659 | 2026-05  3.077932 | 2026-06  2.987321',
          note: '`pct_change(periods=12)` 的意思正是"和 12 行（12 个月）之前比"，再乘 100 变成百分数。这就是公式 (Index(t)/Index(t−12) − 1) × 100 的代码版。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '本项目的预测目标（如 Food at Home 通胀）用的是哪种口径？',
            options: [
              {
                id: 'a',
                text: 'MoM：环比更灵敏，能更快看到变化',
                correct: false,
                explanation: '错在取舍：灵敏的代价是噪音大，逐月环比上蹿下跳，很难当稳定的预测目标。项目交付的是"未来 12 个月的同比通胀走势"，所以目标全部是 YoY。',
              },
              {
                id: 'b',
                text: 'YoY：跟去年同月比的 12 个月变化率',
                correct: true,
                explanation: '正确！Notebook 用 pct_change(12)×100 把所有价格和工资序列转成 YoY，预测目标也是 YoY——比如 2026 年 6 月的 2.99%。',
              },
              {
                id: 'c',
                text: '指数水平本身：预测 349.609 之后会变成多少',
                correct: false,
                explanation: '错在层次：349.609 是水平不是速度。项目要回答的是"通胀会是百分之几"，直接预测指数水平既不是交付口径，也会让不同年代的数字无法直接比较。应复习上一课"水平 vs 变化率"。',
              },
            ],
            conceptReview: '同比（YoY % Change）与环比（MoM % Change）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '亲手算一次 YoY',
            instructions: '这是一道纯练习题（假设数字，不是项目数据），帮你把公式过一遍手。',
            prompt: '假设某指数 2025 年 6 月 = 100，2026 年 6 月 = 103。它 2026 年 6 月的 YoY % 是多少？',
            answer: 3,
            tolerance: 0.05,
            unit: '%',
            solution: 'YoY = (103 / 100 − 1) × 100 = 3%。Notebook 对真实数据做的是同一件事：把 349.609 除以 2025 年 6 月的水平，减 1 再乘 100，得到 2.99%。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话解释：YoY 和 MoM 差别在哪？为什么本项目选 YoY？',
            keywords: ['yoy', '同比', '12', '噪音'],
            modelAnswer: 'MoM 是和上个月比，YoY 是和去年同月比、跨度 12 个月。MoM 灵敏但噪音大；YoY 把 12 个月的变化合在一起，平滑得多，而且"同比通胀"正是项目要交付的口径，所以所有价格和工资序列都被转成 YoY，预测目标也是 YoY。',
          },
        },
      ],
    },
    {
      id: 'm1-l3',
      moduleId: 'm1',
      title: 'Food at Home vs Food Away from Home',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 Food CPI 被拆成"在家吃"和"在外吃"两个分项',
            '记住 2026 年 6 月的两个同比：Home 2.70%、Away 3.37%',
            '理解两者的驱动完全不同：供应链成本 vs 劳动力成本',
          ],
        },
        {
          type: 'text',
          md: 'Food CPI 其实是两种完全不同的消费拼在一起：\n\n- **Food at Home（家庭食品，FRED: `CUSR0000SAF11`）**：超市、杂货店买回家的食品——牛奶、鸡蛋、面包。2026 年 6 月同比 **2.70%**。\n- **Food Away from Home（在外饮食，FRED: `CUSR0000SEFV`）**：餐厅堂食、外卖、快餐。2026 年 6 月同比 **3.37%**。\n\n它们背后的成本结构截然不同。超市价签主要跟着**供应链成本**走：面粉、食用油这些食品的**出厂价**涨了，货架价很快跟涨——所以 Home 的主预测指标是加工食品的生产者价格指数（**Processed Foods PPI**）。而一顿餐厅饭菜里，你付的很大一部分是**人的服务**：厨师和服务员的工资涨了，菜单价格才会慢慢调上去——所以 Away 的主预测指标是休闲和酒店业（Leisure & Hospitality）的**平均时薪**。\n\n一句话记忆：**超市看成本，餐厅看工资。**',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '家庭食品',
              en: 'Food at Home',
              definition: 'CPI 中"买回家吃"的食品分项：超市和杂货店的食品价格。',
              example: '2026 年 6 月 Food at Home 同比 2.70%，权重（relative importance）8.188。',
            },
            {
              zh: '在外饮食',
              en: 'Food Away from Home',
              definition: 'CPI 中"在外面吃"的分项：餐厅、快餐、外卖的价格。里面含大量服务成本。',
              example: '2026 年 6 月 Food Away 同比 3.37%，权重 5.260。',
            },
            {
              zh: '生产者价格指数',
              en: 'PPI (Producer Price Index)',
              definition: '衡量生产端（出厂）价格的指数，和衡量零售端价格的 CPI 相对。生产端涨价往往会传导到零售端。',
              example: 'Processed Foods and Feeds PPI（WPU02）是 Food at Home 的主预测指标。',
            },
          ],
        },
        {
          type: 'chart',
          id: 'foodHistory',
          caption: '长历史对比：Food at Home（波动大）与 Food Away from Home（平滑）的同比走势',
        },
        {
          type: 'text',
          md: '看上面的长历史图还能发现一个关键差异：**Home 的同比大起大落，Away 平滑得多**。原因还是成本结构——超市价格对原材料冲击反应快，涨得猛也回落得快；餐厅调菜单是件麻烦事，不会天天改价，工资成本本身也变化缓慢，所以 Away 的通胀"有粘性"、路径平稳。这个差异后面会直接影响两个模型的预测难度。',
        },
        {
          type: 'notebook',
          title: '把两条历史画在一起（Cell 15）',
          code: 'plt.plot(model_data.index, model_data["food_at_home_cpi"], label="Food at Home YoY")\nplt.plot(model_data.index, model_data["food_away_cpi"], label="Food Away from Home YoY")\nplt.axvline(pd.Timestamp("2000-01-01"), color="grey", linestyle="--", label="Old notebook start")\nplt.title("Food CPI History Now Extends Well Before 2000")',
          output: '一张对比图：Home 曲线大幅震荡，Away 曲线明显平滑。灰色虚线标出旧版 Notebook 的起点 2000 年——当前版本的历史远早于此。',
          note: '当前 Notebook 是 Long-History 版本：Home 目标序列从 1952 年、Away 从 1953 年开始，比只从 2000 年起步多出近 50 年历史可用。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '为什么工资是 Food Away from Home 的关键驱动？',
            options: [
              {
                id: 'a',
                text: '餐饮的成本里人工占比很高，行业工资上涨会逐步传导到菜单价格',
                correct: true,
                explanation: '正确！这是成本传导逻辑：Leisure & Hospitality 行业时薪涨 → 餐厅人力成本涨 → 菜单价格慢慢跟涨。这正是 Away 模型用 L&H 平均时薪做预测指标的原因。',
              },
              {
                id: 'b',
                text: '工资涨了大家更有钱下馆子，需求变多把价格推高',
                correct: false,
                explanation: '错在渠道：这是需求端故事，听起来合理，但不是本模型的机制。模型走的是成本端——用的是餐饮行业自己的工资（成本），而不是全社会收入（需求）。如果是需求逻辑，同样的钱也会推高超市价格，就解释不了为什么工资只进 Away 模型。',
              },
              {
                id: 'c',
                text: '工资和食品价格长期都在上涨，所以随便哪个都能当驱动',
                correct: false,
                explanation: '错在把"同涨"当"驱动"：两条长期上涨的序列天然相关，但相关不等于机制。选预测指标要讲清楚传导链条（工资→人力成本→菜单价），否则就是碰运气。这个坑在 Module 4 的 Correlation ≠ Causation 里还会专门讲。',
              },
            ],
            conceptReview: '成本传导：供应链成本驱动 Home、劳动力成本驱动 Away',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '这属于哪条战线？',
            instructions: '把每一项放进它所属的分项。想一想：它更靠近超市价签，还是餐厅菜单？',
            categories: ['Food at Home（超市）', 'Food Away from Home（餐厅）'],
            items: [
              { text: '超市货架上的牛奶价格', category: 'Food at Home（超市）' },
              { text: '面粉、食用油的出厂价上涨', category: 'Food at Home（超市）', note: '供应链成本，传导到超市价签' },
              { text: 'Processed Foods PPI（WPU02）', category: 'Food at Home（超市）', note: 'Home 的主预测指标' },
              { text: '餐厅菜单上的一碗面涨价', category: 'Food Away from Home（餐厅）' },
              { text: '服务员和厨师的时薪上涨', category: 'Food Away from Home（餐厅）', note: '劳动力成本，传导到菜单价' },
              { text: 'L&H 平均时薪（CES7000000003）', category: 'Food Away from Home（餐厅）', note: 'Away 的主预测指标' },
            ],
            feedbackCorrect: '完全正确！"超市看成本、餐厅看工资"已经刻进你的脑子里了。',
            feedbackWrong: '回到那句口诀：超市价签跟着食品出厂价（PPI）走，餐厅菜单跟着行业工资走。把每一项沿着"它影响哪个价格"想一遍。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '向一个完全不懂经济的朋友解释：Food at Home 和 Food Away from Home 有什么不同？各自被什么驱动？',
            keywords: ['home', 'away', '工资', 'ppi'],
            modelAnswer: 'Food at Home 是超市买回家的食品，Food Away from Home 是餐厅外卖等在外吃的花费。超市价格主要跟供应链成本走，所以用加工食品的出厂价指数（Processed Foods PPI）来预测；餐厅价格里一大块是服务人工，主要跟行业工资走，所以用休闲酒店业平均时薪来预测。2026 年 6 月两者同比分别是 2.70% 和 3.37%。',
          },
        },
      ],
    },
    {
      id: 'm1-l4',
      moduleId: 'm1',
      title: 'Checkpoint · 为什么要分开预测',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '能说出"分开预测再合并"的三个理由',
            '记住两个分项各自的模型方程长什么样',
            '把 Module 1 的所有概念串成一条线',
          ],
        },
        {
          type: 'text',
          md: '既然最后要交的是 Total Food CPI，为什么不直接对它建一个模型，而要拆成两个分项分别预测？三个理由：\n\n1. **驱动不同**：Home 跟供应链成本、Away 跟劳动力成本。塞进同一个方程，两种信号会互相干扰；分开建模，每个分项都能用最贴合自己机制的 predictor。\n2. **节奏不同**：成本传导到超市只要约 1 个月（lag 1），工资传导到菜单用的是 12 个月前的数据（lag 12）。一个模型没法同时照顾两种节奏——lag 的细节在 Module 4 展开。\n3. **行为不同**：Home 波动大、难预测，Away 平滑、粘性强。在 2016 年后的最终测试里，12 个月预测的误差（OOS RMSE）Home 是 2.797 个百分点，Away 只有 1.610——分开建模，还能分别诚实地评估各自的预测质量。\n\n分开预测之后，再按 CPI 权重（Home 8.188、Away 5.260，合计 13.447）加权合并回 Total Food——合并方法在 Module 10 细讲。',
        },
        {
          type: 'formula',
          lhs: 'FoodAtHome(t)',
          rhs: '1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
          note: 'Home 主模型：用上个月的加工食品 PPI 同比预测本月家庭食品通胀。',
        },
        {
          type: 'formula',
          lhs: 'FoodAway(t)',
          rhs: '1.753 + 0.485 × WageGrowth(t−12)',
          note: 'Away 主模型：用 12 个月前的 L&H 工资同比预测本月在外饮食通胀。注意：系数在每个 forecast origin 都会重新估计，这里是用截至 2026-06 数据估出的当前值。',
        },
        {
          type: 'table',
          headers: ['', 'Food at Home', 'Food Away from Home'],
          rows: [
            ['是什么', '超市/杂货店买回家的食品', '餐厅、外卖等在外饮食'],
            ['2026-06 同比', '2.70%', '3.37%'],
            ['权重（relative importance）', '8.188', '5.260'],
            ['核心驱动', '供应链成本（食品出厂价）', '劳动力成本（行业工资）'],
            ['Primary predictor', 'Processed Foods PPI（WPU02），lag 1', 'L&H 全体员工时薪（CES7000000003），lag 12'],
            ['历史表现', '波动大，对成本冲击反应快', '平滑、有粘性，调价慢'],
          ],
          note: '两列几乎处处不同——这正是分开预测的理由。',
        },
        {
          type: 'chart',
          id: 'weightsBar',
          caption: '合并时的权重：Home 8.188 + Away 5.260 = Total Food 13.447（约占 Headline CPI 的 13.4%）',
        },
        {
          type: 'notebook',
          title: '模型规格在测试前就被冻结（Cell 19，节选）',
          code: 'model_specs = {\n    "Home baseline": {\n        "predictors": {"ppi_processed_foods": 1},            # lag 1\n        "role": "Primary national baseline",\n    },\n    "Away legacy all-employee": {\n        "predictors": {"wage_leisure_hospitality_all": 12},  # lag 12\n        "role": "Original model retained for continuity",\n    },\n    # ... 共 9 个模型规格（其余为长历史、调查敏感性与稳健性检查）\n}',
          output: '9 个模型规格被写进字典：Home 与 Away 从头到尾各自独立建模，之后才进入回测与最终测试。',
          note: '"分开预测"不是事后拆分，而是设计之初的结构：两个分项是两套独立的模型规格。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '如果放弃拆分，直接用一个模型预测 Total Food CPI，最主要会失去什么？',
            options: [
              {
                id: 'a',
                text: '无法再为每个分项使用最贴合其机制的 predictor 和 lag（PPI lag 1 vs 工资 lag 12）',
                correct: true,
                explanation: '正确！Home 和 Away 的驱动与传导节奏都不同，混在一起意味着用同一组输入同时迁就两种机制，两边都做不好。分开建模、再按权重合并，才能各取所长。',
              },
              {
                id: 'b',
                text: '无法计算 YoY，因为 Total Food CPI 算不出同比',
                correct: false,
                explanation: '错在混淆口径与结构：YoY 只是"跟去年同月比"的换算，任何指数都能算——Total Food CPI（CPIUFDSL）的同比 2.99% 就摆在那里。拆不拆分项和能不能算 YoY 毫无关系。应复习 M1-L2 的 YoY 定义。',
              },
              {
                id: 'c',
                text: 'FRED 上没有 Total Food CPI 这条数据，所以根本没得选',
                correct: false,
                explanation: '错在事实：FRED 上有现成的 Total Food CPI，代码 CPIUFDSL，1947 年至今。拆分不是被迫的，而是主动的建模选择——为了让每个分项用上自己的驱动逻辑。',
              },
            ],
            conceptReview: '分开预测的理由：驱动不同、节奏不同、行为不同',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: 'Module 1 知识大配对',
            instructions: '把左边的角色和右边的内容一一对上——这是 Module 1 的全部主线。',
            pairs: [
              { left: 'Food at Home 的 primary predictor', right: 'Processed Foods PPI（WPU02），lag 1' },
              { left: 'Food Away 的 primary predictor', right: 'L&H 全体员工时薪（CES7000000003），lag 12' },
              { left: 'Total Food CPI 的算法', right: '两个分项按 8.188 / 5.260 权重合并' },
              { left: '模型的预测口径', right: 'YoY 同比变化率（不是指数水平）' },
            ],
            feedbackCorrect: '漂亮！两条战线、两个 predictor、一套合并权重、一个统一口径——Module 1 通关。',
            feedbackWrong: '提示：超市看成本（PPI，快、lag 1），餐厅看工资（时薪，慢、lag 12）；合并靠 relative importance 权重；预测目标永远是 YoY。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '综合本模块：为什么 Food CPI 要拆成两个分项分别预测？请至少给出两个理由，并提到两个分项各自的驱动。',
            keywords: ['驱动', '工资', '权重', '分开'],
            modelAnswer: '因为两个分项机制完全不同：Food at Home 跟供应链成本走，用加工食品 PPI（lag 1）预测；Food Away 跟劳动力成本走，用休闲酒店业工资（lag 12）预测。传导节奏一快一慢、历史波动一大一小，放进一个模型会互相干扰。分开预测后再按 8.188 和 5.260 的权重合并成 Total Food CPI，两边都能用最合适的指标，也能分别评估预测质量。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '你已经认识了预测对象：两个分项、两种驱动、一个 YoY 口径。下一步（Module 2）去认识给模型"喂料"的 18 条数据序列。',
        },
      ],
    },
  ],
}
