import type { CourseModule } from '../../types'

/**
 * Module 2：认识 18 个数据序列
 * FRED 是什么、九大类别巡礼、两条工资序列的区别、
 * 以及每条序列在模型中扮演的角色。
 */
export const module2: CourseModule = {
  id: 'm2',
  order: 2,
  title: 'Module 2 · 认识 18 个数据序列',
  subtitle: '模型的全部原材料：来自 FRED 的 18 条月度序列',
  icon: '🗂️',
  accent: 'mint',
  lessons: [
    {
      id: 'm2-l1',
      moduleId: 'm2',
      title: 'FRED：模型数据的唯一来源',
      xp: 50,
      minutes: 8,
      blocks: [
        {
          type: 'goal',
          items: [
            '知道 FRED 是什么、为什么项目只用公开数据',
            '了解 Notebook 如何下载并对齐 18 条月度序列',
            '对 18 条序列的九个类别有一张总览图',
          ],
        },
        {
          type: 'text',
          md: '模型的所有原材料都来自 **FRED（Federal Reserve Economic Data）**——圣路易斯联储维护的**免费公开**经济数据库。它像一个巨大的图书馆：每条数据序列都有一个唯一的**序列代码（FRED Series ID）**，比如 Total Food CPI 是 `CPIUFDSL`，加工食品 PPI 是 `WPU02`。报出代码，任何人都能找到一模一样的数据。\n\n为什么坚持只用 FRED？因为**可复现（Reproducible）**：Pacific Life 的任何人都能免费验证每一个数字。一些私有数据（如 Bloomberg、ISM）虽然常被提起，但要么收费、要么没有稳定的公开历史，Notebook 特意选了公开的费城联储和达拉斯联储调查作为替代。\n\n18 条序列全部是**月度时间序列（Monthly Time Series）**：每月一个值，按日期排队。历史最长的是农产品 PPI（`WPU01`），从 **1913 年**就开始记录，有 1362 个月度观测；最年轻的 Final Demand Foods PPI（`PPIDFS`）2009 年 11 月才出生。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '美联储经济数据库',
              en: 'FRED (Federal Reserve Economic Data)',
              definition: '圣路易斯联储维护的免费公开数据库，收录几十万条经济时间序列，每条有唯一代码。',
              example: '本项目 18 条序列全部来自 FRED，如 CPIUFDSL、WPU02。',
            },
            {
              zh: '序列代码',
              en: 'FRED Series ID',
              definition: 'FRED 给每条序列的唯一标识符。报出代码就能精确定位数据，不会拿错。',
              example: 'Food at Home CPI 的代码是 CUSR0000SAF11。',
            },
            {
              zh: '月度时间序列',
              en: 'Monthly Time Series',
              definition: '按月份排列的一串数据，每个月对应一个值。本项目全部序列都是月度频率。',
              example: 'Total Food CPI 从 1947 年 1 月到 2026 年 6 月共 953 个月度观测。',
            },
          ],
        },
        {
          type: 'table',
          headers: ['类别', '数量', '序列（FRED ID）'],
          rows: [
            ['CPI 目标（Targets）', '3', 'CPIUFDSL / CUSR0000SAF11 / CUSR0000SEFV'],
            ['食品供应链 PPI', '3', 'WPU02 / PPIDFS / WPUFD4111'],
            ['食品加工', '1', 'PCU311311'],
            ['农业', '2', 'WPU01 / WPU01PLUS02'],
            ['进口价格', '1', 'IR0'],
            ['工资', '2', 'CES7000000003 / CES7000000008'],
            ['能源', '2', 'PPIENG / MCOILWTICO'],
            ['全球食品价格', '1', 'PFOODINDEXM'],
            ['商业调查', '3', 'PPCDFSA066MSFRBPHI / PRFDFSA066MSFRBPHI / TSSOSFSELLSAMFRBDAL'],
          ],
          note: '合计 18 条序列。3 条是预测目标，其余 15 条是候选输入。接下来两课逐类认识它们。',
        },
        {
          type: 'notebook',
          title: '下载、对齐、体检（Cell 9，节选）',
          code: 'downloaded = pd.concat(\n    {\n        variable: web.DataReader(fred_id, "fred", DATA_START, DATA_AS_OF)[fred_id]\n        for variable, fred_id in series.items()\n    },\n    axis=1,\n)\n# ... 下载失败时自动改用备份 Food_CPI_Data.csv ...\nmonthly_index = pd.date_range(data.index.min(), data.index.max(), freq="MS")\ndata = data.reindex(monthly_index)',
          output: 'Data source: Live FRED download\nfood_total_cpi     CPIUFDSL  1947-01 → 2026-06   953 个观测\nppi_farm_products  WPU01     1913-01 → 2026-06  1362 个观测（最长）',
          note: '下载后所有序列被放到同一张完整月历上（reindex），再生成一张 freshness 表逐条体检：每条序列从哪年开始、最新到哪个月。这些起始年份就是后面两课表格里数字的出处。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '关于 FRED，下面哪个说法是对的？',
            options: [
              {
                id: 'a',
                text: '圣路易斯联储维护的免费公开数据库，每条序列有唯一代码',
                correct: true,
                explanation: '正确！免费、公开、有唯一代码——这保证了模型可复现：任何人拿着 18 个 FRED ID 就能重建全部输入数据。',
              },
              {
                id: 'b',
                text: '一个付费数据终端，类似 Bloomberg 的订阅服务',
                correct: false,
                explanation: '错在"付费"：FRED 完全免费公开。项目恰恰是为了避开付费、不可复现的私有数据（如 Bloomberg/ISM），才全部改用 FRED 上的公开序列，包括用费城/达拉斯联储调查替代私有调查。',
              },
              {
                id: 'c',
                text: 'Notebook 内置的数据模拟器，数据是程序生成的',
                correct: false,
                explanation: '错在来源：数据不是生成的，是美国官方统计（BLS、联储等）发布后收录进 FRED 的真实观测值。Notebook 只负责下载和整理，绝不发明数据——连缺失值都原样保留。',
              },
            ],
            conceptReview: 'FRED 与可复现性（Reproducibility）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'matchPairs',
            title: '认识四个明星代码',
            instructions: '这四个 FRED ID 会在课程里反复出现，现在就把它们和名字对上号。',
            pairs: [
              { left: 'CPIUFDSL', right: 'Total Food CPI（食品 CPI 总指数）' },
              { left: 'WPU02', right: 'Processed Foods and Feeds PPI（加工食品 PPI）' },
              { left: 'CES7000000003', right: 'L&H 平均时薪·全体员工' },
              { left: 'PRFDFSA066MSFRBPHI', right: '费城联储未来销售价格调查' },
            ],
            feedbackCorrect: '记住了！其中 WPU02 和 CES7000000003 是两大主预测指标，后面每一章都会见到它们。',
            feedbackWrong: '给个规律：CPI 目标以 CPI/CUSR 开头，PPI 多以 WPU/PPI 开头，工资序列以 CES 开头，联储调查代码最长（结尾带 FRBPHI 之类的联储缩写）。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用自己的话说明：模型的数据从哪里来？为什么坚持只用这个来源？',
            keywords: ['fred', '公开', '18', '代码'],
            modelAnswer: '全部 18 条月度序列都来自 FRED——圣路易斯联储的免费公开数据库，每条序列有唯一代码（如 CPIUFDSL、WPU02）。坚持只用 FRED 是为了可复现：任何人都能免费下载同样的数据验证模型，而付费或私有数据做不到这一点。',
          },
        },
      ],
    },
    {
      id: 'm2-l2',
      moduleId: 'm2',
      title: '从农场到超市：食品成本链上的序列',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '认识 3 条 CPI 目标序列和它们的起始年份',
            '沿"农场 → 加工 → 出厂 → 超市"的链条认识 7 条食品成本序列',
            '理解上游（Upstream）和下游（Downstream）的含义',
          ],
        },
        {
          type: 'text',
          md: '先认清**要预测的 3 个目标（Targets）**：\n\n- `CPIUFDSL` Total Food CPI（1947 年起）——食品整体\n- `CUSR0000SAF11` Food at Home CPI（1952 年起）——超市\n- `CUSR0000SEFV` Food Away from Home CPI（1953 年起）——餐厅\n\n再看给 Food at Home 提供线索的**食品成本链**。一块面包到达超市货架前，价格信号沿着链条一路传递：**农场**（小麦）→ **加工厂**（面粉/烘焙）→ **成品出厂** → **超市零售**。越靠近农场叫**上游（Upstream）**，越靠近消费者叫**下游（Downstream）**。FRED 在每个环节都有测量：\n\n- 农场端：`WPU01` 农产品 PPI（1913 年起，全库最长）、`WPU01PLUS02` 农产品+加工食品组合（1947 年起）\n- 加工环节：`WPU02` 加工食品与饲料 PPI（1947 年起）——**Home 的主预测指标**、`PCU311311` 食品制造业 PPI（1984 年 12 月起）\n- 成品出厂：`WPUFD4111` 成品消费食品 PPI（1947 年起）、`PPIDFS` 最终需求食品 PPI（2009 年 11 月起，历史最短）\n- 海外进口：`IR0` 进口食品价格指数（1977 年 9 月起）\n\n为什么主角是链条中游的 `WPU02` 而不是更上游的农产品？因为它离超市价签**近而不贴**：既已吸收了上游波动、又仍然领先于零售价——这个"领先"正是 Module 4 要讲的故事。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '上游与下游',
              en: 'Upstream / Downstream',
              definition: '供应链中离原材料近的环节叫上游，离最终消费者近的环节叫下游。价格信号一般从上游往下游传导。',
              example: '农产品 PPI（WPU01）在上游，成品消费食品 PPI（WPUFD4111）在下游。',
            },
            {
              zh: '供应链',
              en: 'Supply Chain',
              definition: '商品从原材料到最终消费者手中经过的全部环节：生产、加工、运输、零售。',
              example: '面包的供应链：小麦（农场）→ 面粉与烘焙（加工）→ 出厂 → 超市。',
            },
            {
              zh: '进口价格指数',
              en: 'Import Price Index',
              definition: '衡量进口商品到岸价格变化的指数。进口食品变贵，也会推高国内食品成本。',
              example: 'IR0（进口食品、饲料和饮料价格指数）从 1977 年 9 月开始。',
            },
          ],
        },
        {
          type: 'table',
          headers: ['链条位置', '序列（FRED ID）', '起始', '模型角色'],
          rows: [
            ['目标：食品整体', 'Total Food CPI（CPIUFDSL）', '1947-01', '全国 CPI 预测目标'],
            ['目标：超市零售', 'Food at Home CPI（CUSR0000SAF11）', '1952-01', '食品杂货价格目标'],
            ['目标：餐饮', 'Food Away from Home CPI（CUSR0000SEFV）', '1953-01', '餐饮/服务价格目标'],
            ['农场（最上游）', 'Farm Products PPI（WPU01）', '1913-01', '农场端价格压力'],
            ['农场+加工组合', 'Farm + Processed Foods PPI（WPU01PLUS02）', '1947-01', '上游组合稳健性候选'],
            ['加工环节', 'Processed Foods and Feeds PPI（WPU02）', '1947-01', 'Food at Home 主预测指标'],
            ['食品制造业', 'Food Manufacturing PPI（PCU311311）', '1984-12', '食品加工稳健性候选'],
            ['成品出厂', 'Finished Consumer Foods PPI（WPUFD4111）', '1947-01', '下游食品 PPI 备选'],
            ['最终需求', 'Final Demand Foods PPI（PPIDFS）', '2009-11', '短历史稳健性候选'],
            ['海外进口', 'Import Prices: Foods（IR0）', '1977-09', '进口食品成本候选'],
          ],
          note: '起始年份直接决定一条序列"有多少历史可学"——PPIDFS 只有 2009 年后的数据，而 WPU02 有 1947 年以来的完整历史。',
        },
        {
          type: 'notebook',
          title: '数据字典里的成本链序列（Cell 7，节选）',
          code: 'series_metadata = pd.DataFrame([\n    ["ppi_processed_foods", "WPU02", "Processed Foods and Feeds PPI",\n     "food supply chain", "yoy_pct", "Primary Food at Home predictor"],\n    ["ppi_farm_products", "WPU01", "Farm Products PPI",\n     "agriculture", "yoy_pct", "Farm-gate price pressure"],\n    ["ppi_finished_consumer_foods", "WPUFD4111", "Finished Consumer Foods PPI",\n     "food supply chain", "yoy_pct", "Alternative downstream food PPI"],\n    ...\n], columns=["Variable", "FRED_series", "Label", "Channel", "Transform", "Model_role"])',
          output: '18 行数据字典：每条序列一行，记录变量名、FRED 代码、类别（Channel）、转换方式（Transform）和模型角色（Model_role）。',
          note: '这张表是全项目的"户口本"。Channel 列写明每条序列属于哪个类别，Model_role 列写明它进模型时的身份——本课表格就是照着它整理的。',
        },
        {
          type: 'quiz',
          quiz: {
            question: 'WPU02（Processed Foods and Feeds PPI）在食品成本链中处于什么位置、扮演什么角色？',
            options: [
              {
                id: 'a',
                text: '加工环节的出厂价格，是 Food at Home 的主预测指标',
                correct: true,
                explanation: '正确！WPU02 测量加工食品与饲料的生产端价格，位于链条中游。它既吸收了上游农产品的波动，又领先于超市零售价，因此被选为 Home 的 primary predictor。',
              },
              {
                id: 'b',
                text: '超市的零售价格，本质上就是 Food at Home CPI 自己',
                correct: false,
                explanation: '错在端点：WPU02 是 PPI（生产者/出厂价格），不是 CPI（消费者/零售价格）。超市零售价由 CUSR0000SAF11 测量。如果 predictor 就是目标自己，预测就成了循环论证——正因为 PPI 在零售价"上游"，它才有预测价值。',
              },
              {
                id: 'c',
                text: '农场端的原材料价格，链条的最上游',
                correct: false,
                explanation: '错在环节：最上游的农场端价格是 WPU01（Farm Products PPI，1913 年起）。WPU02 是农产品经过加工之后的出厂价，处在链条中游。位置不同，与超市价格的距离和传导速度也不同。',
              },
            ],
            conceptReview: '供应链位置：上游（Upstream）/ 加工 / 下游（Downstream）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'sortOrder',
            title: '把价格信号的传导链排出来',
            instructions: '一块面包的价格信号从田间走到超市价签。把四个环节按从上游到下游的顺序排好。',
            correctOrder: [
              '农场：Farm Products PPI（WPU01）',
              '加工：Processed Foods and Feeds PPI（WPU02）',
              '成品出厂：Finished Consumer Foods PPI（WPUFD4111）',
              '超市零售：Food at Home CPI（CUSR0000SAF11）',
            ],
            feedbackCorrect: '完美！从麦田到货架：农场 → 加工 → 出厂 → 零售。价格冲击就是沿着这条链、花上几个月时间传导下来的。',
            feedbackWrong: '想象一块面包的旅程：先是农场里的小麦（Farm Products），再进加工厂变成面粉和面包（Processed Foods），然后成品出厂（Finished Consumer Foods），最后摆上超市货架（Food at Home CPI）。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用面包（或任何食品）的例子，讲一遍价格信号如何沿供应链从农场传到超市，并点出模型在哪个环节取信号。',
            keywords: ['农场', '加工', '超市', 'ppi'],
            modelAnswer: '小麦在农场涨价（Farm Products PPI），几个月后面粉和面包的出厂价跟涨（Processed Foods PPI，即 WPU02），再传到成品出厂价（Finished Consumer Foods PPI），最后超市货架上的面包变贵（Food at Home CPI）。模型在中游的加工环节取信号：WPU02 已吸收上游波动、又领先零售价，是 Home 的主预测指标。',
          },
        },
      ],
    },
    {
      id: 'm2-l3',
      moduleId: 'm2',
      title: '工资、能源、全球价格与联储调查',
      xp: 50,
      minutes: 9,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清两条 L&H 工资序列：全体员工（2006 起）vs 一线员工（1964 起）',
            '认识能源、全球食品价格和 3 条联储调查序列',
            '知道调查序列的两个特点：是扩散指数、更新比别人快',
          ],
        },
        {
          type: 'text',
          md: '剩下 8 条序列覆盖四个类别。\n\n**工资（2 条）**——Food Away 的命脉。同一个行业（Leisure & Hospitality，休闲与酒店业）、同一个口径（平均时薪），但覆盖人群不同：\n\n- `CES7000000003` **全体员工（All Employees）**：2006 年 3 月才开始，只有 244 个观测，但覆盖行业里的所有人——**Away 的主预测指标**\n- `CES7000000008` **一线员工（Production and Nonsupervisory）**：不含管理层，1964 年 1 月就开始，750 个观测——历史长了约 42 年，是长历史回测的工资候选\n\n一条新而全、一条老而专——后面做长历史验证时，这条 1964 年起步的老序列会派上大用场。\n\n**能源（2 条）**：`PPIENG` 燃料与动力 PPI（1926 年起）、`MCOILWTICO` WTI 原油价格（1986 年起）。食品的加工和运输都烧能源，它们是稳健性检查的常客。\n\n**全球食品价格（1 条）**：`PFOODINDEXM` IMF 全球食品价格指数（1992 年起），衡量国际大宗食品行情。\n\n**商业调查（3 条）**：`PPCDFSA066MSFRBPHI` 费城联储当前支付价格、`PRFDFSA066MSFRBPHI` 费城联储未来销售价格（都从 1968 年 5 月起）、`TSSOSFSELLSAMFRBDAL` 达拉斯联储未来服务售价（2007 年起）。它们是问卷结果——"涨价的企业比例减去降价的比例"，叫**扩散指数（Diffusion Index）**，和价格指数是完全不同的动物（Module 3 细讲）。它们还有个大优点：**发布快**——2026 年 7 月各价格序列还没出数时，三条调查已经有 7 月值了（如费城未来销售价格 41.4）。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '平均时薪',
              en: 'AHE (Average Hourly Earnings)',
              definition: '一个行业员工每小时平均工资。BLS 按行业每月发布，是衡量劳动力成本的核心指标。',
              example: 'L&H 行业有两条 AHE 序列：全体员工版（2006 起）和一线员工版（1964 起）。',
            },
            {
              zh: '扩散指数',
              en: 'Diffusion Index',
              definition: '问卷调查的净差额：报告"上涨"的企业比例减去报告"下降"的比例。它衡量的是方向和广度，不是价格水平。',
              example: '费城联储未来销售价格 2026 年 7 月读数为 41.4，表示预期涨价的企业远多于预期降价的。',
            },
            {
              zh: '商业调查',
              en: 'Business Survey',
              definition: '联储定期向企业发问卷，询问价格、订单等现状与预期，汇总成指数。优点是发布快、含预期信息；缺点是区域性、主观。',
              example: '本项目用费城联储 2 条 + 达拉斯联储 1 条公开调查。',
            },
          ],
        },
        {
          type: 'table',
          headers: ['类别', '序列（FRED ID）', '起始', '模型角色'],
          rows: [
            ['工资', 'L&H AHE 全体员工（CES7000000003）', '2006-03', 'Food Away 主预测指标'],
            ['工资', 'L&H AHE 一线员工（CES7000000008）', '1964-01', '长历史工资候选'],
            ['能源', '燃料与动力 PPI（PPIENG）', '1926-01', '加工与运输能源成本压力'],
            ['能源', 'WTI 原油价格（MCOILWTICO）', '1986-01', '运输/油价冲击稳健性候选'],
            ['全球', 'IMF 全球食品价格指数（PFOODINDEXM）', '1992-01', '全球大宗商品稳健性候选'],
            ['调查', '费城联储当前支付价格（PPCDFSA066MSFRBPHI）', '1968-05', '公开投入成本调查备选'],
            ['调查', '费城联储未来销售价格（PRFDFSA066MSFRBPHI）', '1968-05', '未来六个月售价意向指标'],
            ['调查', '达拉斯联储未来服务售价（TSSOSFSELLSAMFRBDAL）', '2007-01', '服务定价调查（区域性、历史短）'],
          ],
          note: '注意最新观测：三条调查序列已更新到 2026-07，其余序列都停在 2026-06——调查天生快一步。',
        },
        {
          type: 'chart',
          id: 'surveyLevelChart',
          caption: '费城联储调查的原始水平（扩散指数）——注意它在 0 上下摆动，和一路上行的价格指数形态完全不同',
        },
        {
          type: 'notebook',
          title: 'freshness 体检表：谁最新、谁最老（Cell 9 输出，节选）',
          code: 'freshness = pd.DataFrame({\n    "Variable": data.columns,\n    "first_observation": first_nonmissing_month(data).values,\n    "latest_observation": latest_nonmissing_month(data).values,\n    "nonmissing_observations": data.notna().sum().values,\n})',
          output: 'wage_leisure_hospitality_all         CES7000000003        2006-03 → 2026-06   244 个观测\nwage_leisure_hospitality_production  CES7000000008        1964-01 → 2026-06   750 个观测\nphilly_future_prices_received        PRFDFSA066MSFRBPHI   1968-05 → 2026-07   699 个观测',
          note: '同一张体检表看出两件事：两条工资序列历史长度差了 500 多个观测；调查序列的 latest_observation 是 2026-07，比价格和工资序列都快一个月。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '两条 L&H 工资序列（CES7000000003 与 CES7000000008）的关键区别是什么？',
            options: [
              {
                id: 'a',
                text: '覆盖人群不同、历史长度不同：全体员工版从 2006 年起，一线员工版从 1964 年起',
                correct: true,
                explanation: '正确！CES7000000003 覆盖全体员工但 2006 年 3 月才开始；CES7000000008 只覆盖一线（非管理层）员工，却从 1964 年 1 月就有数据。前者是 Away 主预测指标，后者撑起长历史回测。',
              },
              {
                id: 'b',
                text: '一条是月薪、一条是年薪，单位不同',
                correct: false,
                explanation: '错在口径：两条都是平均时薪（Average Hourly Earnings），单位相同（美元/小时），进模型前也都同样转成 YoY 增长率。真正的区别在覆盖人群（全体 vs 一线）和起始年份（2006 vs 1964）。',
              },
              {
                id: 'c',
                text: '一条是餐饮业工资、一条是制造业工资，行业不同',
                correct: false,
                explanation: '错在行业：两条都属于 Leisure & Hospitality（休闲与酒店业）——代码都以 CES70 开头就是这个行业的标记。区别只在统计的人群范围和历史起点，不在行业。',
              },
            ],
            conceptReview: '两条工资序列：All Employees（2006 起）vs Production and Nonsupervisory（1964 起）',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'fillNumber',
            title: '老序列到底老多少？',
            instructions: '用两条工资序列的起始年份算一算。',
            prompt: '一线员工工资序列从 1964 年开始，全体员工版从 2006 年开始。前者比后者早了大约多少年？',
            answer: 42,
            tolerance: 1,
            unit: '年',
            solution: '2006 − 1964 = 42 年（精确说是 1964-01 vs 2006-03）。多出的这约 42 年历史，正是长历史回测（回到 2000 年之前做验证）必须用一线员工序列的原因——全体员工版在那些年份根本不存在。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '解释两件事：(1) 两条工资序列有什么区别、各自扮演什么角色？(2) 调查序列和价格序列有什么不同？',
            keywords: ['2006', '1964', '扩散', '调查'],
            modelAnswer: '两条工资序列都是 L&H 行业的平均时薪：全体员工版 2006 年才开始，是 Food Away 的主预测指标；一线员工版从 1964 年开始，历史长约 42 年，用于长历史回测。调查序列是联储问卷得出的扩散指数（涨价企业比例减降价比例），衡量方向而不是价格水平，且发布更快——2026 年 7 月只有调查已出值。',
          },
        },
      ],
    },
    {
      id: 'm2-l4',
      moduleId: 'm2',
      title: 'Checkpoint · 每条序列的角色',
      xp: 100,
      minutes: 10,
      isCheckpoint: true,
      blocks: [
        {
          type: 'goal',
          items: [
            '分清五种角色：Target / Primary / Candidate / Robustness / Survey',
            '能把任意一条序列放进正确的角色',
            '理解"角色分工"背后的建模纪律',
          ],
        },
        {
          type: 'text',
          md: '18 条序列不是平起平坐的。把模型想成一支球队，每条序列都有明确的位置：\n\n1. **Target（预测目标，3 条）**：比赛要进的球门——3 条 Food CPI 序列。它们是被预测的对象，永远不当输入。\n2. **Primary（主预测指标，2 条）**：首发前锋——`WPU02`（Home）和 `CES7000000003`（Away）。主预测 3.02% 就出自它们。\n3. **Candidate（候选指标，3 条）**：实力替补——一线员工工资 `CES7000000008`、成品消费食品 PPI `WPUFD4111`、进口食品 `IR0`。它们参与选拔，或在长历史回测里顶上首发的位置。\n4. **Robustness（稳健性检查，7 条）**：陪练队——农产品、能源、原油、全球食品价格等。它们组成对照模型，回答一个问题："换一批输入，结论还站得住吗？"表现好也**不会自动转正**，因为主模型规格在测试前已冻结（Module 5 讲原因）。\n5. **Survey（调查敏感性，3 条）**：场外情报——3 条联储调查。它们构建 4.34% 的敏感性情景，但它是**情景不是主预测**：调查是区域性的、也不是食品专属。\n\n这套分工是一种纪律：每条数据进场前，先说清自己是谁、来干什么——避免"什么都往模型里扔"的诱惑。',
        },
        {
          type: 'terms',
          cards: [
            {
              zh: '预测指标',
              en: 'Predictor',
              definition: '放进回归方程右边、用来预测目标的输入变量。',
              example: 'WPU02 的 YoY 是 Food at Home 方程里的 predictor。',
            },
            {
              zh: '候选指标',
              en: 'Candidate',
              definition: '有资格竞争 predictor 位置、或在特定场景（如长历史回测）替补上场的序列。',
              example: '一线员工工资（CES7000000008）是长历史回测中的工资候选。',
            },
            {
              zh: '稳健性检查',
              en: 'Robustness Check',
              definition: '用不同的输入重做一遍分析，看核心结论是否依旧成立。是检验，不是替换。',
              example: '用农产品 PPI、能源 PPI 等构建对照模型，检查主模型结论是否稳健。',
            },
            {
              zh: '调查敏感性',
              en: 'Survey Sensitivity',
              definition: '把商业调查加入模型形成的另一套情景，用来回答"如果企业定价意向也传导进来会怎样"。它不是主预测。',
              example: 'Survey 情景对 2027-06 的预测是 4.34%，而主预测（Primary）是 3.02%。',
            },
          ],
        },
        {
          type: 'table',
          headers: ['角色', '数量', '一句话职责', '序列'],
          rows: [
            ['Target 预测目标', '3', '被预测的对象，不当输入', 'CPIUFDSL / CUSR0000SAF11 / CUSR0000SEFV'],
            ['Primary 主预测指标', '2', '主模型的核心输入', 'WPU02（Home）/ CES7000000003（Away）'],
            ['Candidate 候选指标', '3', '备选输入或长历史替补', 'CES7000000008 / WPUFD4111 / IR0'],
            ['Robustness 稳健性检查', '7', '对照模型，检验结论稳不稳', 'PPIDFS / WPU01PLUS02 / WPU01 / PPIENG / MCOILWTICO / PFOODINDEXM / PCU311311'],
            ['Survey 调查敏感性', '3', '构建 4.34% 敏感性情景', 'PPCDFSA066MSFRBPHI / PRFDFSA066MSFRBPHI / TSSOSFSELLSAMFRBDAL'],
          ],
          note: '3 + 2 + 3 + 7 + 3 = 18。这张表值得反复看——Mock Meeting 里"你用了哪些数据、各起什么作用"就考它。',
        },
        {
          type: 'notebook',
          title: '候选名单写在代码里（Cell 17，节选）',
          code: 'home_long_history_predictors = [\n    "ppi_processed_foods",\n    "ppi_farm_products",\n    "ppi_energy",\n    "wti_crude_oil",\n    "global_food_price_index",\n    "ppi_finished_consumer_foods",\n    "ppi_food_manufacturing",\n    "philly_current_prices_paid",\n    "philly_future_prices_received",\n]\n\naway_long_history_predictors = [\n    "wage_leisure_hospitality_production",\n    "ppi_processed_foods",\n    "philly_current_prices_paid",\n    "philly_future_prices_received",\n]',
          output: 'Home 侧 9 条、Away 侧 4 条长历史候选进入 0–12 lag 扫描（Module 4 的主战场）。',
          note: '注意名单本身就体现角色分工：目标序列不在里面（它们是被预测的），短历史序列（如 PPIDFS、全体员工工资）也不在长历史扫描里——历史不够长，参加不了这场"从 1999 年前选拔"的考试。',
        },
        {
          type: 'quiz',
          quiz: {
            question: '稳健性检查（Robustness Check）序列——比如 WTI 原油——在项目中的作用是什么？',
            options: [
              {
                id: 'a',
                text: '组成对照模型，检验主模型结论是否稳健；表现好也不自动进入主模型',
                correct: true,
                explanation: '正确！Robustness 序列的使命是"换个角度再看一遍"。主模型规格在最终测试前已经冻结，对照模型即使某段时期表现更好，也只是提供参考，不会自动替换 primary——这是防止事后挑模型的纪律。',
              },
              {
                id: 'b',
                text: '一旦对照模型 R² 更高，就立即替换掉 primary predictor',
                correct: false,
                explanation: '错在"立即替换"：如果看到谁表现好就换谁，等于在测试之后挑模型，测试成绩就被污染了（Look-ahead Bias，Module 5 专讲）。正确做法是先冻结规格、再测试，robustness 结果只作参考。',
              },
              {
                id: 'c',
                text: '只是凑数的装饰，从头到尾不参与任何计算',
                correct: false,
                explanation: '错在"不参与"：robustness 序列实际参与了 lag 扫描和多个对照模型（如 Home upstream-energy、Home global-food）的回测计算。它们的成绩被完整记录和比较，只是不改变主模型的选择。',
              },
            ],
            conceptReview: '稳健性检查（Robustness Check）与模型规格冻结',
          },
        },
        {
          type: 'exercise',
          exercise: {
            kind: 'categorize',
            title: '给 8 条序列发工作证',
            instructions: '把每条序列放进它的角色。拿不准时想想：它是被预测的？进主模型的？做对照的？还是搭建调查情景的？',
            categories: ['Target 预测目标', 'Primary 主预测指标', 'Candidate / Robustness', 'Survey 调查敏感性'],
            items: [
              { text: 'Total Food CPI（CPIUFDSL）', category: 'Target 预测目标' },
              { text: 'Food Away from Home CPI（CUSR0000SEFV）', category: 'Target 预测目标' },
              { text: 'Processed Foods PPI（WPU02）', category: 'Primary 主预测指标', note: 'Home 主模型的核心输入' },
              { text: 'L&H 全体员工时薪（CES7000000003）', category: 'Primary 主预测指标', note: 'Away 主模型的核心输入' },
              { text: 'WTI 原油价格（MCOILWTICO）', category: 'Candidate / Robustness' },
              { text: 'IMF 全球食品价格指数（PFOODINDEXM）', category: 'Candidate / Robustness' },
              { text: '费城联储未来销售价格（PRFDFSA066MSFRBPHI）', category: 'Survey 调查敏感性', note: '4.34% 情景的关键输入' },
              { text: '达拉斯联储未来服务售价（TSSOSFSELLSAMFRBDAL）', category: 'Survey 调查敏感性' },
            ],
            feedbackCorrect: '全部就位！你已经能给 18 条序列发工作证了——这正是数据字典 Model_role 列的内容。',
            feedbackWrong: '再过一遍口诀：3 条 Food CPI 是球门（Target）；WPU02 和 CES7000000003 是首发（Primary）；原油、全球食品价格这类是替补和陪练（Candidate/Robustness）；联储问卷是场外情报（Survey）。',
          },
        },
        {
          type: 'selfExplain',
          selfExplain: {
            prompt: '用球队（或你喜欢的任何比喻）说明 18 条序列的五种角色，并各举一个例子。',
            keywords: ['primary', '目标', 'robustness', '调查'],
            modelAnswer: '18 条序列分五种角色：3 条 Food CPI 是预测目标（球门）；WPU02 和 CES7000000003 是 primary 主预测指标（首发），主预测 3.02% 出自它们；一线员工工资等 3 条是 candidate 候选（替补）；原油、能源 PPI 等 7 条做 robustness 稳健性检查（陪练），检验结论稳不稳但不自动转正；3 条联储调查构建 survey 敏感性情景 4.34%（场外情报），不是主预测。',
          },
        },
        {
          type: 'callout',
          variant: 'success',
          title: 'Checkpoint 完成',
          md: '原材料全部认识完毕：18 条序列、九个类别、五种角色。下一步（Module 3）学习怎么把这些原材料"洗菜切菜"——YoY 转换、扩散指数保持 level、缺失值处理。',
        },
      ],
    },
  ],
}
