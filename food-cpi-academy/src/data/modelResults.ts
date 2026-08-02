/**
 * 模型结果数据 —— 全部数值逐一取自 Food_CPI.ipynb
 * （"Food CPI Forecast — Long-History and Survey-Enhanced Version"，45 cells，16 章节）
 * 及其导出的 Food_CPI_Output.xlsx。
 *
 * 更新 Notebook 后，只需替换本文件与 series.ts，教学文案无需改动。
 * 任何无法从 Notebook 确认的数值，一律不得出现在这里。
 */

/* ================= 1. 时间设定（Notebook Cell 5 / 第 3 章） ================= */

export const timeline = {
  dataStart: '1913-01',
  dataAsOf: '2026-08-01',
  /** 最新的 CPI 目标月份（Latest Actual） */
  latestActualMonth: '2026-06',
  /** Lag-training sample 截止 */
  lagTrainEnd: '1999-12',
  /** Pre-2016 Validation 的 forecast origins */
  validationFirstOrigin: '2000-01',
  validationLastOrigin: '2014-12',
  /** 2014-12 origin 的 12 个月预测在 2015-12 实现，因此整个阶段保持 pre-2016 */
  validationLastRealized: '2015-12',
  /** Final Out-of-Sample Test 起点 */
  finalTestFirstOrigin: '2016-01',
  forecastHorizon: 12,
  minTrainingObservations: 60,
  /** 当前 Forecast Origin 与预测范围 */
  currentOrigin: '2026-06',
  forecastFirstMonth: '2026-07',
  forecastLastMonth: '2027-06',
} as const

/* ================= 2. CPI 权重（Cell 5，2026 年 6 月 CPI 发布 / 2026 年 5 月 relative importance） ================= */

export const weights = {
  foodAtHomeRelativeImportance: 8.188,
  foodAwayRelativeImportance: 5.26,
  totalFoodRelativeImportance: 13.447,
  /** 8.188 / (8.188 + 5.260) */
  homeWeightInsideFood: 8.188 / (8.188 + 5.26),
  /** 5.260 / (8.188 + 5.260) */
  awayWeightInsideFood: 5.26 / (8.188 + 5.26),
} as const

/* ================= 3. 18 个 FRED 数据序列（Cell 7 / 第 4 章 + Cell 9 freshness） ================= */

export type SeriesRole = 'target' | 'primary' | 'candidate' | 'robustness' | 'survey'

export interface SeriesMeta {
  variable: string
  fredId: string
  label: string
  labelZh: string
  channel: string
  channelZh: string
  transform: 'yoy_pct' | 'level'
  modelRole: string
  roleZh: string
  role: SeriesRole
  firstObservation: string
  latestObservation: string
}

export const seriesMetadata: SeriesMeta[] = [
  { variable: 'food_total_cpi', fredId: 'CPIUFDSL', label: 'Total Food CPI', labelZh: '食品 CPI 总指数', channel: 'target', channelZh: 'CPI 目标', transform: 'yoy_pct', modelRole: 'National CPI target', roleZh: '全国 CPI 预测目标', role: 'target', firstObservation: '1947-01', latestObservation: '2026-06' },
  { variable: 'food_at_home_cpi', fredId: 'CUSR0000SAF11', label: 'Food at Home CPI', labelZh: '家庭食品 CPI', channel: 'target', channelZh: 'CPI 目标', transform: 'yoy_pct', modelRole: 'Grocery-price target', roleZh: '食品杂货价格目标', role: 'target', firstObservation: '1952-01', latestObservation: '2026-06' },
  { variable: 'food_away_cpi', fredId: 'CUSR0000SEFV', label: 'Food Away from Home CPI', labelZh: '在外饮食 CPI', channel: 'target', channelZh: 'CPI 目标', transform: 'yoy_pct', modelRole: 'Restaurant/service-price target', roleZh: '餐饮/服务价格目标', role: 'target', firstObservation: '1953-01', latestObservation: '2026-06' },
  { variable: 'ppi_processed_foods', fredId: 'WPU02', label: 'Processed Foods and Feeds PPI', labelZh: '加工食品与饲料 PPI', channel: 'food supply chain', channelZh: '食品供应链 PPI', transform: 'yoy_pct', modelRole: 'Primary Food at Home predictor', roleZh: 'Food at Home 主预测指标', role: 'primary', firstObservation: '1947-01', latestObservation: '2026-06' },
  { variable: 'ppi_final_demand_foods', fredId: 'PPIDFS', label: 'Final Demand Foods PPI', labelZh: '最终需求食品 PPI', channel: 'food supply chain', channelZh: '食品供应链 PPI', transform: 'yoy_pct', modelRole: 'Short-history robustness candidate', roleZh: '短历史稳健性候选', role: 'robustness', firstObservation: '2009-11', latestObservation: '2026-06' },
  { variable: 'ppi_farm_processed', fredId: 'WPU01PLUS02', label: 'Farm Products plus Processed Foods PPI', labelZh: '农产品+加工食品 PPI', channel: 'agriculture', channelZh: '农业', transform: 'yoy_pct', modelRole: 'Combined upstream robustness candidate', roleZh: '上游组合稳健性候选', role: 'robustness', firstObservation: '1947-01', latestObservation: '2026-06' },
  { variable: 'import_foods', fredId: 'IR0', label: 'Import Prices: Foods, Feeds and Beverages', labelZh: '进口食品价格指数', channel: 'imports', channelZh: '进口价格', transform: 'yoy_pct', modelRole: 'Imported food-cost candidate', roleZh: '进口食品成本候选', role: 'candidate', firstObservation: '1977-09', latestObservation: '2026-06' },
  { variable: 'wage_leisure_hospitality_all', fredId: 'CES7000000003', label: 'L&H Average Hourly Earnings: All Employees', labelZh: '休闲酒店业平均时薪（全体员工）', channel: 'labor', channelZh: '工资', transform: 'yoy_pct', modelRole: 'Primary Food Away predictor; starts 2006', roleZh: 'Food Away 主预测指标（2006 年起）', role: 'primary', firstObservation: '2006-03', latestObservation: '2026-06' },
  { variable: 'wage_leisure_hospitality_production', fredId: 'CES7000000008', label: 'L&H AHE: Production and Nonsupervisory Employees', labelZh: '休闲酒店业平均时薪（一线员工）', channel: 'labor', channelZh: '工资', transform: 'yoy_pct', modelRole: 'Long-history wage candidate; starts 1964', roleZh: '长历史工资候选（1964 年起）', role: 'candidate', firstObservation: '1964-01', latestObservation: '2026-06' },
  { variable: 'ppi_farm_products', fredId: 'WPU01', label: 'Farm Products PPI', labelZh: '农产品 PPI', channel: 'agriculture', channelZh: '农业', transform: 'yoy_pct', modelRole: 'Farm-gate price pressure', roleZh: '农场端价格压力', role: 'robustness', firstObservation: '1913-01', latestObservation: '2026-06' },
  { variable: 'ppi_energy', fredId: 'PPIENG', label: 'Fuels and Related Products and Power PPI', labelZh: '燃料与动力 PPI', channel: 'energy', channelZh: '能源', transform: 'yoy_pct', modelRole: 'Processing and distribution energy-cost pressure', roleZh: '加工与运输能源成本压力', role: 'robustness', firstObservation: '1926-01', latestObservation: '2026-06' },
  { variable: 'wti_crude_oil', fredId: 'MCOILWTICO', label: 'WTI Crude Oil Price', labelZh: 'WTI 原油价格', channel: 'energy', channelZh: '能源', transform: 'yoy_pct', modelRole: 'Transportation/oil-shock robustness candidate', roleZh: '运输/油价冲击稳健性候选', role: 'robustness', firstObservation: '1986-01', latestObservation: '2026-06' },
  { variable: 'global_food_price_index', fredId: 'PFOODINDEXM', label: 'IMF Global Food Price Index', labelZh: 'IMF 全球食品价格指数', channel: 'global agriculture', channelZh: '全球食品价格', transform: 'yoy_pct', modelRole: 'Global commodity-price robustness candidate', roleZh: '全球大宗商品稳健性候选', role: 'robustness', firstObservation: '1992-01', latestObservation: '2026-06' },
  { variable: 'ppi_finished_consumer_foods', fredId: 'WPUFD4111', label: 'Finished Consumer Foods PPI', labelZh: '成品消费食品 PPI', channel: 'food supply chain', channelZh: '食品供应链 PPI', transform: 'yoy_pct', modelRole: 'Alternative downstream food PPI', roleZh: '下游食品 PPI 备选', role: 'candidate', firstObservation: '1947-01', latestObservation: '2026-06' },
  { variable: 'ppi_food_manufacturing', fredId: 'PCU311311', label: 'Food Manufacturing PPI', labelZh: '食品制造业 PPI', channel: 'food processing', channelZh: '食品加工', transform: 'yoy_pct', modelRole: 'Food-processing robustness candidate', roleZh: '食品加工稳健性候选', role: 'robustness', firstObservation: '1984-12', latestObservation: '2026-06' },
  { variable: 'philly_current_prices_paid', fredId: 'PPCDFSA066MSFRBPHI', label: 'Philadelphia Fed Current Prices Paid', labelZh: '费城联储当前支付价格', channel: 'business survey', channelZh: '商业调查', transform: 'level', modelRole: 'Public input-cost survey alternative', roleZh: '公开投入成本调查备选', role: 'survey', firstObservation: '1968-05', latestObservation: '2026-07' },
  { variable: 'philly_future_prices_received', fredId: 'PRFDFSA066MSFRBPHI', label: 'Philadelphia Fed Future Prices Received', labelZh: '费城联储未来销售价格', channel: 'business survey', channelZh: '商业调查', transform: 'level', modelRole: 'Public six-month selling-price-intentions measure', roleZh: '未来六个月售价意向指标', role: 'survey', firstObservation: '1968-05', latestObservation: '2026-07' },
  { variable: 'dallas_future_service_selling_prices', fredId: 'TSSOSFSELLSAMFRBDAL', label: 'Dallas Fed Future Service Selling Prices', labelZh: '达拉斯联储未来服务售价', channel: 'business survey', channelZh: '商业调查', transform: 'level', modelRole: 'Service-pricing survey; regional and short history', roleZh: '服务定价调查（区域性、历史短）', role: 'survey', firstObservation: '2007-01', latestObservation: '2026-07' },
]

/* ================= 4. Lag 选择结果（Cell 17 / 第 7 章，仅用 1999 年及以前数据） ================= */

export interface LagScanRow {
  predictor: string
  lagMonths: number
  sampleStart: string
  sampleEnd: string
  n: number
  rSquared: number
  beta: number
}

/** Food at Home：每个候选指标在 0–12 lag 扫描中的最优 lag（按 R² 排序） */
export const homeBestLags: LagScanRow[] = [
  { predictor: 'ppi_finished_consumer_foods', lagMonths: 1, sampleStart: '1953-01', sampleEnd: '1999-12', n: 564, rSquared: 0.875, beta: 0.783 },
  { predictor: 'ppi_processed_foods', lagMonths: 1, sampleStart: '1953-01', sampleEnd: '1999-12', n: 564, rSquared: 0.769, beta: 0.69 },
  { predictor: 'ppi_food_manufacturing', lagMonths: 2, sampleStart: '1986-02', sampleEnd: '1999-12', n: 167, rSquared: 0.589, beta: 0.656 },
  { predictor: 'ppi_farm_products', lagMonths: 2, sampleStart: '1953-01', sampleEnd: '1999-12', n: 564, rSquared: 0.538, beta: 0.315 },
  { predictor: 'philly_current_prices_paid', lagMonths: 0, sampleStart: '1968-05', sampleEnd: '1999-12', n: 380, rSquared: 0.455, beta: 0.129 },
  { predictor: 'global_food_price_index', lagMonths: 7, sampleStart: '1993-08', sampleEnd: '1999-12', n: 77, rSquared: 0.399, beta: 0.071 },
  { predictor: 'ppi_energy', lagMonths: 0, sampleStart: '1953-01', sampleEnd: '1999-12', n: 564, rSquared: 0.297, beta: 0.167 },
  { predictor: 'philly_future_prices_received', lagMonths: 0, sampleStart: '1968-05', sampleEnd: '1999-12', n: 380, rSquared: 0.267, beta: 0.099 },
  { predictor: 'wti_crude_oil', lagMonths: 1, sampleStart: '1987-02', sampleEnd: '1999-12', n: 155, rSquared: 0.148, beta: 0.027 },
]

/** Food Away from Home：候选指标最优 lag */
export const awayBestLags: LagScanRow[] = [
  { predictor: 'philly_future_prices_received', lagMonths: 2, sampleStart: '1968-07', sampleEnd: '1999-12', n: 378, rSquared: 0.587, beta: 0.106 },
  { predictor: 'philly_current_prices_paid', lagMonths: 3, sampleStart: '1968-08', sampleEnd: '1999-12', n: 377, rSquared: 0.55, beta: 0.102 },
  { predictor: 'ppi_processed_foods', lagMonths: 6, sampleStart: '1954-01', sampleEnd: '1999-12', n: 552, rSquared: 0.526, beta: 0.394 },
  { predictor: 'wage_leisure_hospitality_production', lagMonths: 2, sampleStart: '1965-03', sampleEnd: '1999-12', n: 418, rSquared: 0.476, beta: 0.673 },
]

/* ================= 5. 九个模型规范（Cell 19 / 第 8 章） ================= */

export interface ModelSpec {
  name: string
  nameZh: string
  component: 'Food at Home' | 'Food Away from Home'
  target: string
  predictors: { variable: string; lag: number }[]
  role: string
  roleZh: string
  family: 'primary' | 'longHistory' | 'survey' | 'robustness' | 'legacy'
}

export const modelSpecs: ModelSpec[] = [
  {
    name: 'Home baseline', nameZh: 'Home 基准模型', component: 'Food at Home', target: 'food_at_home_cpi',
    predictors: [{ variable: 'ppi_processed_foods', lag: 1 }],
    role: 'Primary national baseline', roleZh: '主预测（全国基准）', family: 'primary',
  },
  {
    name: 'Home survey expanded', nameZh: 'Home 调查扩展模型', component: 'Food at Home', target: 'food_at_home_cpi',
    predictors: [
      { variable: 'ppi_processed_foods', lag: 1 },
      { variable: 'philly_future_prices_received', lag: 0 },
    ],
    role: 'Business-survey sensitivity', roleZh: '商业调查敏感性分析', family: 'survey',
  },
  {
    name: 'Home upstream-energy', nameZh: 'Home 上游能源模型', component: 'Food at Home', target: 'food_at_home_cpi',
    predictors: [
      { variable: 'ppi_processed_foods', lag: 1 },
      { variable: 'ppi_farm_products', lag: 2 },
      { variable: 'ppi_energy', lag: 0 },
    ],
    role: 'Agricultural and energy robustness', roleZh: '农业与能源稳健性检查', family: 'robustness',
  },
  {
    name: 'Home global-food', nameZh: 'Home 全球食品模型', component: 'Food at Home', target: 'food_at_home_cpi',
    predictors: [
      { variable: 'ppi_processed_foods', lag: 1 },
      { variable: 'global_food_price_index', lag: 7 },
    ],
    role: 'Global commodity robustness', roleZh: '全球大宗商品稳健性检查', family: 'robustness',
  },
  {
    name: 'Home food-manufacturing', nameZh: 'Home 食品制造模型', component: 'Food at Home', target: 'food_at_home_cpi',
    predictors: [
      { variable: 'ppi_processed_foods', lag: 1 },
      { variable: 'ppi_food_manufacturing', lag: 2 },
    ],
    role: 'Food-processing robustness', roleZh: '食品加工稳健性检查', family: 'robustness',
  },
  {
    name: 'Away long-history baseline', nameZh: 'Away 长历史基准模型', component: 'Food Away from Home', target: 'food_away_cpi',
    predictors: [{ variable: 'wage_leisure_hospitality_production', lag: 2 }],
    role: 'Long-history national wage baseline', roleZh: '长历史全国工资基准', family: 'longHistory',
  },
  {
    name: 'Away survey expanded', nameZh: 'Away 调查扩展模型', component: 'Food Away from Home', target: 'food_away_cpi',
    predictors: [
      { variable: 'wage_leisure_hospitality_production', lag: 2 },
      { variable: 'philly_future_prices_received', lag: 2 },
    ],
    role: 'Long wage history plus business-survey sensitivity', roleZh: '长历史工资 + 商业调查敏感性', family: 'survey',
  },
  {
    name: 'Away food-cost', nameZh: 'Away 食品成本模型', component: 'Food Away from Home', target: 'food_away_cpi',
    predictors: [
      { variable: 'wage_leisure_hospitality_production', lag: 2 },
      { variable: 'ppi_processed_foods', lag: 6 },
    ],
    role: 'Labor plus food-input robustness', roleZh: '劳动力 + 食品投入稳健性', family: 'robustness',
  },
  {
    name: 'Away legacy all-employee', nameZh: 'Away 全体员工工资模型（Primary）', component: 'Food Away from Home', target: 'food_away_cpi',
    predictors: [{ variable: 'wage_leisure_hospitality_all', lag: 12 }],
    role: 'Original model retained for continuity', roleZh: '主预测使用的原始工资模型（延续性）', family: 'primary',
  },
]

/* ================= 6. 当前回归系数（Cell 35 / 第 13 章，estimated through 2026-06） ================= */

export interface CoefficientRow {
  model: string
  term: string
  coefficient: number
  hacStandardError: number
  pValue: number
  trainingStart: string
  trainingEnd: string
  trainingObservations: number
  inSampleRSquared: number
}

export const currentCoefficients: CoefficientRow[] = [
  { model: 'Home baseline', term: 'const', coefficient: 1.408146, hacStandardError: 0.187304, pValue: 5.56e-14, trainingStart: '1953-01', trainingEnd: '2026-06', trainingObservations: 881, inSampleRSquared: 0.714558 },
  { model: 'Home baseline', term: 'ppi_processed_foods', coefficient: 0.649634, hacStandardError: 0.042918, pValue: 9.26e-52, trainingStart: '1953-01', trainingEnd: '2026-06', trainingObservations: 881, inSampleRSquared: 0.714558 },
  { model: 'Away legacy all-employee', term: 'const', coefficient: 1.752964, hacStandardError: 0.326442, pValue: 7.88e-8, trainingStart: '2008-03', trainingEnd: '2026-06', trainingObservations: 219, inSampleRSquared: 0.597572 },
  { model: 'Away legacy all-employee', term: 'wage_leisure_hospitality_all', coefficient: 0.485499, hacStandardError: 0.058682, pValue: 1.3e-16, trainingStart: '2008-03', trainingEnd: '2026-06', trainingObservations: 219, inSampleRSquared: 0.597572 },
  { model: 'Home survey expanded', term: 'const', coefficient: 0.820183, hacStandardError: 0.406844, pValue: 0.0438, trainingStart: '1968-05', trainingEnd: '2026-06', trainingObservations: 697, inSampleRSquared: 0.720958 },
  { model: 'Home survey expanded', term: 'ppi_processed_foods', coefficient: 0.581104, hacStandardError: 0.045044, pValue: 4.46e-38, trainingStart: '1968-05', trainingEnd: '2026-06', trainingObservations: 697, inSampleRSquared: 0.720958 },
  { model: 'Home survey expanded', term: 'philly_future_prices_received', coefficient: 0.030223, hacStandardError: 0.011659, pValue: 0.00954, trainingStart: '1968-05', trainingEnd: '2026-06', trainingObservations: 697, inSampleRSquared: 0.720958 },
  { model: 'Away survey expanded', term: 'const', coefficient: 0.594817, hacStandardError: 0.37785, pValue: 0.1154, trainingStart: '1968-07', trainingEnd: '2026-06', trainingObservations: 695, inSampleRSquared: 0.641497 },
  { model: 'Away survey expanded', term: 'wage_leisure_hospitality_production', coefficient: 0.426896, hacStandardError: 0.089754, pValue: 1.97e-6, trainingStart: '1968-07', trainingEnd: '2026-06', trainingObservations: 695, inSampleRSquared: 0.641497 },
  { model: 'Away survey expanded', term: 'philly_future_prices_received', coefficient: 0.051906, hacStandardError: 0.01332, pValue: 9.74e-5, trainingStart: '1968-07', trainingEnd: '2026-06', trainingObservations: 695, inSampleRSquared: 0.641497 },
]

/** 当前主模型方程（供展示；系数在每个 forecast origin 会重新估计） */
export const currentEquations = {
  homeBaseline: {
    text: 'FoodAtHome(t) = 1.408 + 0.650 × ProcessedFoodsPPI(t−1)',
    alpha: 1.408146,
    beta: 0.649634,
    explainZh: '上个月的食品生产端价格增长率（Processed Foods PPI YoY），会被用来预测这个月的家庭食品 CPI 同比通胀。',
  },
  awayLegacy: {
    text: 'FoodAway(t) = 1.753 + 0.485 × WageGrowth(t−12)',
    alpha: 1.752964,
    beta: 0.485499,
    explainZh: '12 个月前的休闲和酒店业工资增长率（L&H AHE YoY），会被用来预测当前的外出就餐通胀。',
  },
  homeSurvey: {
    text: 'FoodAtHome(t) = 0.820 + 0.581 × ProcessedFoodsPPI(t−1) + 0.030 × PhillyFuturePricesReceived(t)',
    alpha: 0.820183,
    betas: [0.581104, 0.030223],
  },
  awaySurvey: {
    text: 'FoodAway(t) = 0.595 + 0.427 × WageGrowthProd(t−2) + 0.052 × PhillyFuturePricesReceived(t−2)',
    alpha: 0.594817,
    betas: [0.426896, 0.051906],
  },
} as const

/* ================= 7. Pre-2016 Validation（Cell 23 / 第 10 章，12-month ahead） ================= */

export interface EvalRow {
  model: string
  component: string
  oosRmse: number
  oosMae: number
  meanError: number
  oosR2VsNoChange: number
  nominalCoverage: number | null
  nForecasts: number
}

export const validationComparison: EvalRow[] = [
  { model: 'Away survey expanded', component: 'Food Away from Home', oosRmse: 0.566, oosMae: 0.441, meanError: 0.014, oosR2VsNoChange: 0.679, nominalCoverage: 1.0, nForecasts: 180 },
  { model: 'Away long-history baseline', component: 'Food Away from Home', oosRmse: 0.94, oosMae: 0.783, meanError: -0.295, oosR2VsNoChange: 0.115, nominalCoverage: 1.0, nForecasts: 180 },
  { model: 'Away food-cost', component: 'Food Away from Home', oosRmse: 1.164, oosMae: 0.912, meanError: -0.62, oosR2VsNoChange: -0.357, nominalCoverage: 0.972, nForecasts: 180 },
  { model: 'Home global-food', component: 'Food at Home', oosRmse: 2.322, oosMae: 1.787, meanError: -0.534, oosR2VsNoChange: 0.46, nominalCoverage: 0.589, nForecasts: 180 },
  { model: 'Home food-manufacturing', component: 'Food at Home', oosRmse: 2.944, oosMae: 2.245, meanError: -1.227, oosR2VsNoChange: 0.132, nominalCoverage: 0.667, nForecasts: 180 },
  { model: 'Home survey expanded', component: 'Food at Home', oosRmse: 3.145, oosMae: 2.39, meanError: -1.244, oosR2VsNoChange: 0.009, nominalCoverage: 0.833, nForecasts: 180 },
  { model: 'Home baseline', component: 'Food at Home', oosRmse: 3.442, oosMae: 2.591, meanError: -1.41, oosR2VsNoChange: -0.187, nominalCoverage: 0.806, nForecasts: 180 },
  { model: 'Home upstream-energy', component: 'Food at Home', oosRmse: 3.538, oosMae: 2.683, meanError: -1.612, oosR2VsNoChange: -0.254, nominalCoverage: 0.8, nForecasts: 180 },
]

/* ================= 8. 2016+ Final Test（Cell 27 / 第 11 章，12-month ahead） ================= */

export const finalTestComparison: EvalRow[] = [
  { model: 'Away survey expanded', component: 'Food Away from Home', oosRmse: 1.464, oosMae: 1.186, meanError: -0.468, oosR2VsNoChange: 0.254, nominalCoverage: 0.965, nForecasts: 113 },
  { model: 'Away legacy all-employee', component: 'Food Away from Home', oosRmse: 1.61, oosMae: 1.091, meanError: 0.618, oosR2VsNoChange: 0.097, nominalCoverage: 0.796, nForecasts: 113 },
  { model: 'Away long-history baseline', component: 'Food Away from Home', oosRmse: 1.622, oosMae: 1.156, meanError: -0.237, oosR2VsNoChange: 0.084, nominalCoverage: 0.947, nForecasts: 113 },
  { model: 'Home survey expanded', component: 'Food at Home', oosRmse: 2.698, oosMae: 2.073, meanError: -0.546, oosR2VsNoChange: 0.628, nominalCoverage: 0.832, nForecasts: 113 },
  { model: 'Home global-food', component: 'Food at Home', oosRmse: 2.722, oosMae: 1.951, meanError: 0.576, oosR2VsNoChange: 0.621, nominalCoverage: 0.761, nForecasts: 113 },
  { model: 'Home baseline', component: 'Food at Home', oosRmse: 2.797, oosMae: 2.001, meanError: -0.092, oosR2VsNoChange: 0.6, nominalCoverage: 0.814, nForecasts: 113 },
  { model: 'Home upstream-energy', component: 'Food at Home', oosRmse: 2.81, oosMae: 2.025, meanError: -0.058, oosR2VsNoChange: 0.596, nominalCoverage: 0.814, nForecasts: 113 },
]

/* ================= 9. Total Food 组合模型表现（Cell 29 & 41 / 第 12、14 章） ================= */

export const totalFoodOosSummary = [
  { family: 'Primary baseline', horizon: '12-month ahead', oosRmse: 2.035, oosMae: 1.381, meanError: 0.212, oosR2VsNoChange: 0.598, nForecasts: 113 },
  { family: 'Primary baseline', horizon: 'All horizons', oosRmse: 1.52, oosMae: 1.136, meanError: 0.053, oosR2VsNoChange: 0.502, nForecasts: 1359 },
  { family: 'Long-history baseline', horizon: '12-month ahead', oosRmse: 2.051, oosMae: 1.377, meanError: -0.122, oosR2VsNoChange: 0.592, nForecasts: 113 },
  { family: 'Long-history baseline', horizon: 'All horizons', oosRmse: 1.478, oosMae: 1.141, meanError: -0.269, oosR2VsNoChange: 0.53, nForecasts: 1359 },
  { family: 'Survey sensitivity', horizon: '12-month ahead', oosRmse: 1.935, oosMae: 1.493, meanError: -0.489, oosR2VsNoChange: 0.636, nForecasts: 113 },
  { family: 'Survey sensitivity', horizon: 'All horizons', oosRmse: 1.636, oosMae: 1.368, meanError: -0.631, oosR2VsNoChange: 0.424, nForecasts: 1359 },
] as const

/** 会议用核心表现表（Cell 41，12-month-ahead，2016+ Final Test） */
export const modelPerformance = [
  { component: 'Food at Home', model: 'Home Baseline', oosRmse: 2.797, oosR2VsNoChange: 0.6 },
  { component: 'Food Away from Home', model: 'Away Legacy All-Employee', oosRmse: 1.61, oosR2VsNoChange: 0.097 },
  { component: 'Total Food CPI', model: 'Primary Baseline', oosRmse: 2.035, oosR2VsNoChange: 0.598 },
  { component: 'Total Food CPI', model: 'Survey Sensitivity', oosRmse: 1.935, oosR2VsNoChange: 0.636 },
] as const

/* ================= 10. 分 horizon 的 OOS RMSE（Cell 31 / 第 12.1 节） ================= */

export interface HorizonMetric {
  horizon: number
  primaryRmse: number
  surveyRmse: number
  primaryR2: number
  surveyR2: number
}

export const horizonMetrics: HorizonMetric[] = [
  { horizon: 1, primaryRmse: 1.576, surveyRmse: 2.287, primaryR2: -13.518, surveyR2: -29.552 },
  { horizon: 2, primaryRmse: 1.326, surveyRmse: 2.009, primaryR2: -2.139, surveyR2: -6.208 },
  { horizon: 3, primaryRmse: 1.256, surveyRmse: 1.708, primaryR2: -0.375, surveyR2: -1.542 },
  { horizon: 4, primaryRmse: 1.231, surveyRmse: 1.519, primaryR2: 0.201, surveyR2: -0.215 },
  { horizon: 5, primaryRmse: 1.234, surveyRmse: 1.373, primaryR2: 0.452, surveyR2: 0.321 },
  { horizon: 6, primaryRmse: 1.274, surveyRmse: 1.273, primaryR2: 0.566, surveyR2: 0.567 },
  { horizon: 7, primaryRmse: 1.346, surveyRmse: 1.236, primaryR2: 0.622, surveyR2: 0.682 },
  { horizon: 8, primaryRmse: 1.457, surveyRmse: 1.268, primaryR2: 0.641, surveyR2: 0.728 },
  { horizon: 9, primaryRmse: 1.598, surveyRmse: 1.375, primaryR2: 0.638, surveyR2: 0.732 },
  { horizon: 10, primaryRmse: 1.745, surveyRmse: 1.532, primaryR2: 0.628, surveyR2: 0.714 },
  { horizon: 11, primaryRmse: 1.893, surveyRmse: 1.722, primaryR2: 0.614, surveyR2: 0.681 },
  { horizon: 12, primaryRmse: 2.035, surveyRmse: 1.935, primaryR2: 0.598, surveyR2: 0.636 },
]

/* ================= 11. Latest Actual（2026-06，Cell 37/41） ================= */

export const latestActual = {
  month: '2026-06',
  foodAtHomeYoY: 2.704309,
  foodAwayYoY: 3.365905,
  totalFoodYoY: 2.987321,
  contributionPp: 0.401705,
  /** 会议展示用的四舍五入版本 */
  rounded: { home: 2.7, away: 3.37, total: 2.99, contribution: 0.4 },
} as const

/* ================= 12. 当前 12 个月预测（Cell 37 / 第 13.1 节） ================= */

export interface ForecastRow {
  month: string
  horizon: number
  home: number
  away: number
  total: number
  contributionPp: number
  empiricalLower95: number
  empiricalUpper95: number
}

/** Primary Baseline（主预测） */
export const primaryForecast: ForecastRow[] = [
  { month: '2026-07', horizon: 1, home: 2.466682, away: 3.380827, total: 2.824237, contributionPp: 0.379775, empiricalLower95: 0.46246, empiricalUpper95: 6.321163 },
  { month: '2026-08', horizon: 2, home: 2.628797, away: 3.463395, total: 2.955239, contributionPp: 0.397391, empiricalLower95: 1.360679, empiricalUpper95: 5.935904 },
  { month: '2026-09', horizon: 3, home: 2.628797, away: 3.547867, total: 2.988279, contributionPp: 0.401834, empiricalLower95: 1.51737, empiricalUpper95: 6.049626 },
  { month: '2026-10', horizon: 4, home: 2.628797, away: 3.411299, total: 2.934862, contributionPp: 0.394651, empiricalLower95: 1.500869, empiricalUpper95: 6.100893 },
  { month: '2026-11', horizon: 5, home: 2.628797, away: 3.556744, total: 2.991751, contributionPp: 0.402301, empiricalLower95: 1.613273, empiricalUpper95: 6.164199 },
  { month: '2026-12', horizon: 6, home: 2.628797, away: 3.550307, total: 2.989233, contributionPp: 0.401962, empiricalLower95: 1.389737, empiricalUpper95: 6.217244 },
  { month: '2027-01', horizon: 7, home: 2.628797, away: 3.479184, total: 2.961414, contributionPp: 0.398221, empiricalLower95: 1.063623, empiricalUpper95: 6.042327 },
  { month: '2027-02', horizon: 8, home: 2.628797, away: 3.51607, total: 2.975842, contributionPp: 0.400161, empiricalLower95: 0.696513, empiricalUpper95: 6.43312 },
  { month: '2027-03', horizon: 9, home: 2.628797, away: 3.33356, total: 2.904456, contributionPp: 0.390562, empiricalLower95: 0.293455, empiricalUpper95: 6.67655 },
  { month: '2027-04', horizon: 10, home: 2.628797, away: 3.52892, total: 2.980868, contributionPp: 0.400837, empiricalLower95: -0.089188, empiricalUpper95: 7.049742 },
  { month: '2027-05', horizon: 11, home: 2.628797, away: 3.679548, total: 3.039784, contributionPp: 0.40876, empiricalLower95: -0.210322, empiricalUpper95: 7.689112 },
  { month: '2027-06', horizon: 12, home: 2.628797, away: 3.631765, total: 3.021094, contributionPp: 0.406247, empiricalLower95: -0.558326, empiricalUpper95: 8.226827 },
]

/** Survey Sensitivity（较高通胀情景，不是主预测） */
export const surveyForecast = [
  { month: '2026-07', horizon: 1, home: 3.018273, away: 5.754781, total: 4.088621, contributionPp: 0.549797 },
  { month: '2026-08', horizon: 2, home: 3.61562, away: 6.055118, total: 4.569796, contributionPp: 0.6145 },
  { month: '2026-09', horizon: 3, home: 3.61562, away: 4.699213, total: 4.039452, contributionPp: 0.543185 },
  { month: '2026-10', horizon: 4, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2026-11', horizon: 5, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2026-12', horizon: 6, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-01', horizon: 7, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-02', horizon: 8, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-03', horizon: 9, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-04', horizon: 10, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-05', horizon: 11, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
  { month: '2027-06', horizon: 12, home: 3.61562, away: 5.476066, total: 4.343308, contributionPp: 0.584045 },
] as const

/** PPT 摘要（Cell 41，四舍五入到 2 位） */
export const pptSummary = [
  { horizon: 'Latest Actual', month: '2026-06', home: 2.7, away: 3.37, total: 2.99, contribution: 0.4 },
  { horizon: '+3 Months', month: '2026-09', home: 2.63, away: 3.55, total: 2.99, contribution: 0.4 },
  { horizon: '+6 Months', month: '2026-12', home: 2.63, away: 3.55, total: 2.99, contribution: 0.4 },
  { horizon: '+12 Months', month: '2027-06', home: 2.63, away: 3.63, total: 3.02, contribution: 0.41 },
] as const

/** 两个核心数字：主预测 vs 调查情景（2027-06，12-month ahead） */
export const headlineNumbers = {
  primary12m: 3.02,
  survey12m: 4.34,
  primary12mPrecise: 3.021094,
  survey12mPrecise: 4.343308,
} as const

/* ================= 13. Forecast Input Audit（Cell 35，共 72 行） ================= */

export interface AuditRow {
  model: string
  forecastMonth: string
  horizon: number
  predictor: string
  lag: number
  requiredPredictorMonth: string
  informationCutoff: string
  source: 'observed' | 'assumed'
  value: number
}

/** Home baseline：lag 1 → 只有第 1 个月用 Observed PPI，其余 11 个月用最新 3 个月平均假设 */
export const auditHomeBaseline: AuditRow[] = [
  { model: 'Home baseline', forecastMonth: '2026-07', horizon: 1, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-06', informationCutoff: '2026-06', source: 'observed', value: 1.629435 },
  { model: 'Home baseline', forecastMonth: '2026-08', horizon: 2, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-07', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2026-09', horizon: 3, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-08', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2026-10', horizon: 4, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-09', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2026-11', horizon: 5, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-10', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2026-12', horizon: 6, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-11', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-01', horizon: 7, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-12', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-02', horizon: 8, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2027-01', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-03', horizon: 9, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2027-02', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-04', horizon: 10, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2027-03', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-05', horizon: 11, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2027-04', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home baseline', forecastMonth: '2027-06', horizon: 12, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2027-05', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
]

/** Away legacy all-employee：lag 12 → 12 个月所需工资数据全部已观察到 */
export const auditAwayLegacy: AuditRow[] = [
  { model: 'Away legacy all-employee', forecastMonth: '2026-07', horizon: 1, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-07', informationCutoff: '2026-06', source: 'observed', value: 3.352968 },
  { model: 'Away legacy all-employee', forecastMonth: '2026-08', horizon: 2, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-08', informationCutoff: '2026-06', source: 'observed', value: 3.523035 },
  { model: 'Away legacy all-employee', forecastMonth: '2026-09', horizon: 3, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-09', informationCutoff: '2026-06', source: 'observed', value: 3.697024 },
  { model: 'Away legacy all-employee', forecastMonth: '2026-10', horizon: 4, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-10', informationCutoff: '2026-06', source: 'observed', value: 3.41573 },
  { model: 'Away legacy all-employee', forecastMonth: '2026-11', horizon: 5, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-11', informationCutoff: '2026-06', source: 'observed', value: 3.715309 },
  { model: 'Away legacy all-employee', forecastMonth: '2026-12', horizon: 6, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2025-12', informationCutoff: '2026-06', source: 'observed', value: 3.702052 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-01', horizon: 7, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-01', informationCutoff: '2026-06', source: 'observed', value: 3.555556 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-02', horizon: 8, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-02', informationCutoff: '2026-06', source: 'observed', value: 3.631532 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-03', horizon: 9, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-03', informationCutoff: '2026-06', source: 'observed', value: 3.255609 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-04', horizon: 10, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-04', informationCutoff: '2026-06', source: 'observed', value: 3.657999 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-05', horizon: 11, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-05', informationCutoff: '2026-06', source: 'observed', value: 3.968254 },
  { model: 'Away legacy all-employee', forecastMonth: '2027-06', horizon: 12, predictor: 'wage_leisure_hospitality_all', lag: 12, requiredPredictorMonth: '2026-06', informationCutoff: '2026-06', source: 'observed', value: 3.869833 },
]

/** Home survey expanded（敏感性模型）：PPI lag 1 + Philly survey lag 0（cutoff 2026-07） */
export const auditHomeSurvey: AuditRow[] = [
  { model: 'Home survey expanded', forecastMonth: '2026-07', horizon: 1, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-06', informationCutoff: '2026-06', source: 'observed', value: 1.629435 },
  { model: 'Home survey expanded', forecastMonth: '2026-07', horizon: 1, predictor: 'philly_future_prices_received', lag: 0, requiredPredictorMonth: '2026-07', informationCutoff: '2026-07', source: 'observed', value: 41.4 },
  { model: 'Home survey expanded', forecastMonth: '2026-08', horizon: 2, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-07', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home survey expanded', forecastMonth: '2026-08', horizon: 2, predictor: 'philly_future_prices_received', lag: 0, requiredPredictorMonth: '2026-08', informationCutoff: '2026-07', source: 'assumed', value: 56.366667 },
  { model: 'Home survey expanded', forecastMonth: '2026-09', horizon: 3, predictor: 'ppi_processed_foods', lag: 1, requiredPredictorMonth: '2026-08', informationCutoff: '2026-06', source: 'assumed', value: 1.878983 },
  { model: 'Home survey expanded', forecastMonth: '2026-09', horizon: 3, predictor: 'philly_future_prices_received', lag: 0, requiredPredictorMonth: '2026-09', informationCutoff: '2026-07', source: 'assumed', value: 56.366667 },
]

/** Away survey expanded（敏感性模型）：工资 lag 2 + Philly survey lag 2 */
export const auditAwaySurvey: AuditRow[] = [
  { model: 'Away survey expanded', forecastMonth: '2026-07', horizon: 1, predictor: 'wage_leisure_hospitality_production', lag: 2, requiredPredictorMonth: '2026-05', informationCutoff: '2026-06', source: 'observed', value: 4.731076 },
  { model: 'Away survey expanded', forecastMonth: '2026-07', horizon: 1, predictor: 'philly_future_prices_received', lag: 2, requiredPredictorMonth: '2026-05', informationCutoff: '2026-07', source: 'observed', value: 60.5 },
  { model: 'Away survey expanded', forecastMonth: '2026-08', horizon: 2, predictor: 'wage_leisure_hospitality_production', lag: 2, requiredPredictorMonth: '2026-06', informationCutoff: '2026-06', source: 'observed', value: 4.61997 },
  { model: 'Away survey expanded', forecastMonth: '2026-08', horizon: 2, predictor: 'philly_future_prices_received', lag: 2, requiredPredictorMonth: '2026-06', informationCutoff: '2026-07', source: 'observed', value: 67.2 },
  { model: 'Away survey expanded', forecastMonth: '2026-09', horizon: 3, predictor: 'wage_leisure_hospitality_production', lag: 2, requiredPredictorMonth: '2026-07', informationCutoff: '2026-06', source: 'assumed', value: 4.580754 },
  { model: 'Away survey expanded', forecastMonth: '2026-09', horizon: 3, predictor: 'philly_future_prices_received', lag: 2, requiredPredictorMonth: '2026-07', informationCutoff: '2026-07', source: 'observed', value: 41.4 },
  { model: 'Away survey expanded', forecastMonth: '2026-10', horizon: 4, predictor: 'wage_leisure_hospitality_production', lag: 2, requiredPredictorMonth: '2026-08', informationCutoff: '2026-06', source: 'assumed', value: 4.580754 },
  { model: 'Away survey expanded', forecastMonth: '2026-10', horizon: 4, predictor: 'philly_future_prices_received', lag: 2, requiredPredictorMonth: '2026-08', informationCutoff: '2026-07', source: 'assumed', value: 56.366667 },
]

/** 未观察到的未来 PPI 使用最新 3 个月 YoY 平均：(2.141680 + 1.865835 + 1.629435) / 3 ≈ 1.878983 */
export const assumptionDetail = {
  ppiLatest3m: [
    { month: '2026-04', value: 2.14168 },
    { month: '2026-05', value: 1.865835 },
    { month: '2026-06', value: 1.629435 },
  ],
  ppiAssumedValue: 1.878983,
} as const

/* ================= 14. 六大限制（Cell 42 / 第 15 章） ================= */

export const limitations = [
  {
    id: 1,
    en: 'Pseudo-real-time backtest using today\'s revised FRED history, not archived ALFRED vintages.',
    zh: '回测使用的是今天已修订的 FRED 历史数据，而不是真正的 ALFRED Vintage Data（历史当时版本）。这是一种伪实时（pseudo-real-time）回测。',
  },
  {
    id: 2,
    en: 'Observation months are treated as available by the corresponding forecast origin; exact historical release-day timing is not reconstructed.',
    zh: '模型假设每个观测月份在对应的 forecast origin 时已经可用，没有完整重建历史上每个数据的确切发布日（release-day timing）。',
  },
  {
    id: 3,
    en: 'Unknown future predictors use a recent three-month average, so later forecast months are baseline scenarios rather than fully observed forecasts.',
    zh: '未观察到的未来 Predictor 使用最新 3 个月平均值代替，因此靠后的预测月份是基准情景（baseline scenario），而不是完全基于观测数据的预测。',
  },
  {
    id: 4,
    en: 'Current CPI relative-importance weights are also used to combine historical component forecasts.',
    zh: '历史组合也使用当前的 CPI Relative-importance Weights（相对重要性权重），没有重建历史上每个时点的实时权重。',
  },
  {
    id: 5,
    en: 'The Philadelphia and Dallas survey series are regional and not food-sector-specific.',
    zh: '费城和达拉斯联储的调查是区域性（Regional）调查，不是全国性的食品行业专属指标，只能作为敏感性指标，不能证明因果传导。',
  },
  {
    id: 6,
    en: 'Overlapping 12-month forecast errors are serially correlated. HAC standard errors are used for current coefficients; historical RMSE and empirical intervals remain the main reliability measures.',
    zh: '重叠的 12 个月预测误差存在序列相关（Serial Correlation）。当前回归系数使用 HAC Standard Error，而历史 RMSE 和经验区间是主要的可靠性度量。',
  },
] as const

/* ================= 15. Notebook 元信息 ================= */

export const notebookMeta = {
  title: 'Food CPI Forecast — Long-History and Survey-Enhanced Version',
  cellCount: 45,
  sectionCount: 16,
  seriesCount: 18,
  sections: [
    '1. What the model is doing — in plain language',
    '2. Import the packages',
    '3. Dates, model periods, and CPI weights',
    '4. Data dictionary',
    '5. Load and validate the monthly data',
    '6. Transform each variable correctly',
    '7. Choose lags using only data through 1999',
    '8. Freeze the model specifications before the final test',
    '9. General expanding-window forecast engine',
    '10. Pre-2016 model validation',
    '11. Final 2016+ out-of-sample test',
    '12. Combine Food at Home and Food Away from Home',
    '13. Produce the current 12-month forecast',
    '14. Final results and interpretation',
    '15. Limitations',
    '16. Save the reproducible analysis package',
  ],
} as const

/* ================= 16. 数据缺口说明（Cell 11 / 第 5.1 节） ================= */

export const dataQualityNotes = {
  missingOctober2025: '2025 年 10 月的 CPI 目标值因联邦政府停摆（federal shutdown）缺失，Notebook 保留缺失、不做插值。',
  july2026Partial: '2026 年 7 月时大多数序列尚未发布（NaN），只有费城/达拉斯联储调查已有 7 月值。',
} as const
