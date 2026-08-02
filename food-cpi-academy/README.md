# Food CPI Forecast Academy 🌾

一个游戏化的互动学习网站，帮助零基础学生真正理解自己在 **UCI × Pacific Life Capstone Project** 中完成的 Food CPI forecasting 模型。

课程严格依据 Notebook **“Food CPI Forecast — Long-History and Survey-Enhanced Version”**（45 cells · 16 章节 · 18 个 FRED 数据序列）。所有模型数值可追溯到该 Notebook 及其导出的 `Food_CPI_Output.xlsx`。

## 功能

- 🗺️ **Course Map**：15 个模块（Module 0–14）、逐节解锁、Checkpoint
- ⭐ **XP 与等级**：完成课程/练习/答辩获得 XP，8 个等级称号
- 🏅 **Achievement Badges**：18 个成就徽章
- 🎯 **Lag Alignment Playground**：滑动 lag（0–12），用与 Notebook 相同的数据实时计算 Training R²
- 📐 **Regression Playground**：手动拟合 α/β，再让 OLS 一键找最优（还原 Notebook 的 1.408 / 0.650）
- 🔁 **Expanding-window Simulator**：Estimate → Forecast → Reveal → Add Month → Next Origin 五步循环
- 🔮 **12-Month Forecast Explorer**：Forecast Input Audit 互动表（Observed 绿 / Assumed 橙）
- 🧮 **组合计算器**：权重、Total Food、Headline CPI 贡献
- 📓 **Notebook Walkthrough**：45 个 cell 逐格讲解
- 🎤 **Mock Pacific Life Meeting**：13 个英文追问，即时中文反馈 + 参考答案 + 薄弱点记录
- 🏆 **Final Challenge**：20 题综合测验 + 12 项独立解释清单
- 📖 **Glossary**：全部术语「中文名称（English Term）」
- 📱 响应式：桌面三栏布局，移动端底部导航
- 💾 学习进度保存在浏览器 Local Storage，无需登录

## 技术栈

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- Tailwind CSS（深色主题，紫/蓝/绿强调色）
- Recharts（图表）
- react-router（HashRouter，适配 GitHub Pages）

## 安装与运行

需要 Node.js ≥ 18。

```bash
cd food-cpi-academy
npm install        # 安装依赖
npm run dev        # 本地开发（http://localhost:5173）
npm run build      # 产出静态站点到 dist/
npm run preview    # 预览生产构建
npm run data       # 从 data/Food_CPI_Data.csv 重新生成 src/data/series.ts（含数值校验）
```

## 文件结构

```
food-cpi-academy/
├── data/
│   └── Food_CPI_Data.csv         # Notebook 备份数据（18 个序列）
├── scripts/
│   └── build-series.mjs          # CSV → series.ts 生成器（内置与 Notebook 输出的校验）
├── src/
│   ├── types.ts                  # 全部共享类型契约
│   ├── data/                     # ⚙️ 模型结果数据（与教学文案分离）
│   │   ├── modelResults.ts       #   Notebook 全部数值：模型规范/系数/预测/审计/指标
│   │   ├── series.ts             #   自动生成的时间序列（YoY 转换与 Notebook 一致）
│   │   └── achievements.ts       #   成就定义
│   ├── content/                  # 📚 教学内容（更新 Notebook 后只需替换 data/）
│   │   ├── modules/module0..14   #   15 个模块的课程数据
│   │   ├── glossary.ts           #   词汇表
│   │   ├── meetingQuestions.ts   #   Mock Meeting 13 题
│   │   ├── walkthrough.ts        #   Notebook 45 cells 走读
│   │   └── finalChallenge.ts     #   Final Challenge 题库
│   ├── store/progress.tsx        # 进度 store（localStorage）
│   ├── lib/                      # 统计（浏览器端 OLS）与格式化工具
│   ├── components/
│   │   ├── blocks/               # 课程块渲染（quiz/exercise/selfExplain/…）
│   │   ├── charts/ChartRegistry  # 14 个预注册图表
│   │   └── widgets/              # 7 个互动组件（playground/simulator/audit/计算器）
│   └── pages/                    # 13 个页面
└── README.md
```

## 更新模型数值

Notebook 重跑后：

1. 用新的 `Food_CPI_Data.csv` 替换 `data/Food_CPI_Data.csv`，运行 `npm run data`（校验不通过会报错）。
2. 按新 Notebook 输出更新 `src/data/modelResults.ts` 中的数值。
3. 教学文案（`src/content/`）无需改动，除非模型设定（predictor/lag）变化。

## 部署

`npm run build` 后把 `dist/` 内容部署到任意静态托管。本仓库将构建产物提交到根目录 `academy/`，由 GitHub Pages 直接服务：
`https://prestonxy-cpu.github.io/my-website/academy/`
（`vite.config.ts` 中 `base: './'`，HashRouter 路由，无需服务端配置。）
