# CLAUDE.md — 美债期货实时监控平台

## 项目概述

30年期美国国债期货实时监控网站，部署在 GitHub Pages。
面向中国用户（中文界面），服务于美债期货交易员的日常盯盘需求。

- **仓库**: https://github.com/prestonxy-cpu/my-website
- **线上地址**: https://prestonxy-cpu.github.io/my-website/
- **部署方式**: GitHub Pages，master 分支根目录

---

## 文件结构

```
my-website/
├── index.html          # 主页面，所有模块的 HTML 结构
├── style.css           # 全部样式，响应式设计
├── app.js              # 交互逻辑、数据获取、图表渲染、经济日历
├── .claude/
│   └── launch.json     # Claude Preview 开发服务器配置
└── CLAUDE.md           # 本文件
```

无构建工具、无框架、无包管理器。纯静态 HTML/CSS/JS，直接部署。

---

## 各文件详细说明

### index.html

主页面，包含以下模块（从上到下）：

| 模块 | HTML id | 说明 |
|------|---------|------|
| 顶部标题栏 | — | Logo"美债监控"、北京/纽约双时钟、交易状态（交易中/已休市） |
| 报价条 | `tickerBar` | 横向滚动，显示 8 个品种的实时价格和涨跌幅 |
| 导航栏 | `mainNav` | 6 个锚点标签：实时行情、期货概览、数据回顾、经济日历、关联市场、资讯入口 |
| 实时行情 | `#chart` | 主 K 线图，支持切换 30/10/5/2 年期期货 |
| 各期限期货 | `#yield-curve` | 4 张迷你面积图卡片：ZT(2Y)、ZF(5Y)、ZN(10Y)、ZB(30Y) |
| 数据走势回顾 | `#data-review` | 最新数据卡片 + 下跌概率 + 历史数据表格 |
| 经济数据日历 | `#calendar` | 自建中文经济日历（非 TradingView），按日期分组 |
| 关联市场 | `#markets` | 4 张迷你图卡片：美元指数、黄金、标普500、VIX |
| 快速资讯入口 | `#resources` | 8 个外部链接卡片：CME、FedWatch、Reuters、FRED 等 |
| 影响参考表 | `#reference` | 10 个关键经济指标对美债期货的利多/利空逻辑参考 |

### style.css

所有样式集中在一个文件，主要结构：

- CSS 变量定义（颜色、阴影、圆角、尺寸）
- 各模块样式（按 HTML 顺序排列）
- 3 个响应式断点：1024px、768px、480px

### app.js

JavaScript 分为以下模块：

| 模块 | 功能 |
|------|------|
| Config | CORS 代理地址、Yahoo Finance API、品种代码映射 |
| fetchData() | 从 Yahoo Finance 获取 OHLCV 数据 |
| Ticker Bar | loadTicker() — 更新顶部报价条 |
| Main Chart | initMainChart() / loadMainChart() — Lightweight Charts K 线 + 成交量 |
| Mini Charts | createMiniAreaChart() / loadMiniCard() / loadAllMiniCharts() — 迷你面积图 |
| Economic Data | 20 条历史经济数据（硬编码），含涨跌影响分析 |
| Data Rendering | renderImpactSummary / renderImpactProb / renderDataTable |
| Calendar | calendarEvents 数组 (35+ 条) + renderCalendar() |
| Utilities | 双时钟、交易状态判断、导航高亮、平滑滚动 |
| Auto-refresh | 每 60 秒自动刷新主图和报价条 |

---

## 设计规范

### 颜色体系（中国金融惯例）

```
红色 #e74c3c → 上涨 / 利多（bullish）
绿色 #2ecc71 → 下跌 / 利空（bearish）
橙色 #f39c12 → 中性 / 中等重要性
蓝色 #1890ff → 强调、链接、徽章
```

- 背景色: `#f0f2f5` (浅灰)
- 卡片色: `#ffffff`
- 主文字: `#1a1a2e`
- 次文字: `#666666`
- 弱文字: `#999999`
- 边框色: `#e8e8e8`

### 字体

```css
font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
```

- 优先系统字体，确保中文渲染质量
- 价格数字使用 `font-variant-numeric: tabular-nums` 保证等宽对齐

### 布局

- 最大宽度 1200px，居中
- 卡片圆角 12px，阴影 `0 2px 8px rgba(0,0,0,0.06)`
- 标题栏和导航栏均 sticky 置顶
- 标题栏背景渐变: `linear-gradient(135deg, #1a1a2e, #16213e)`
- 模块间距 16px
- 响应式 Grid 布局（4列 → 2列 → 1列）

---

## 技术架构

### 图表

- **库**: Lightweight Charts v4.1.7（TradingView 开源图表库，CDN 引入）
- **主图**: 蜡烛图 + 成交量柱状图，可切换品种
- **迷你图**: 面积图，颜色根据涨跌自动变化（红涨绿跌）

### 数据来源

- **价格数据**: Yahoo Finance API，通过 `api.allorigins.win` CORS 代理
- **数据延迟**: 约 15 分钟（非实时）
- **刷新频率**: 60 秒自动刷新
- **经济日历**: 硬编码在 app.js 中（需手动更新）
- **历史影响数据**: 硬编码 20 条经济数据发布记录

### 品种代码（Yahoo Finance）

| 代码 | 品种 |
|------|------|
| ZB=F | 30 年期美债期货 |
| ZN=F | 10 年期美债期货 |
| ZF=F | 5 年期美债期货 |
| ZT=F | 2 年期美债期货 |
| DX-Y.NYB | 美元指数 |
| GC=F | 黄金期货 |
| ES=F | 标普500 E-mini 期货 |
| ^VIX | VIX 恐慌指数 |

---

## 已知限制

1. **TradingView 嵌入限制**: TradingView 禁止所有期货/收益率品种在第三方网站嵌入，因此全站使用自建图表
2. **数据延迟**: Yahoo Finance 期货数据延迟约 15 分钟，非盘中实时
3. **CORS 代理依赖**: 依赖 allorigins.win 代理访问 Yahoo Finance API，该服务可能不稳定
4. **经济日历静态**: calendarEvents 数组需手动更新，当前覆盖 2026年4月-5月
5. **数据筛选未实现**: 数据回顾模块的标签页切换（30年美债/10年美债/美元指数等）目前显示相同数据
6. **无本地开发服务器**: 系统未安装 Node.js 或 Python，无法本地预览，需直接推送到 GitHub Pages 验证
7. **历史数据硬编码**: economicData 数组中的 20 条历史记录是示例数据，非 API 实时获取

---

## 用户偏好

- 用户是 30 年期美债期货交易员，需要快速了解市场动向
- 用户不写代码，所有开发由 Claude 完成
- 界面语言全部使用中文
- 颜色惯例遵循中国金融市场：红涨绿跌
- 风格参考中国金融 App（如截图中的经济数据走势回顾界面）
- 尽量减少权限确认，自主完成工作

---

## 开发历史

| 提交 | 内容 |
|------|------|
| 980f38c | 初始提交：TradingView 嵌入组件版本 |
| 10295a9 | 尝试用 CBOE 收益率指数修复嵌入限制 |
| 46b9da9 | 改用 CBOT 期货合约替代收益率 |
| 5ca7c91 | **重大重写**: 全面替换为 Lightweight Charts + Yahoo Finance |
| 5f90446 | 自建中文经济日历替换 TradingView 英文日历 |
