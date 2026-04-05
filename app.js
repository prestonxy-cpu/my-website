// ========================================================================
// 美债期货实时监控 — Lightweight Charts + Yahoo Finance
// ========================================================================

// ── Config ──
const PROXY = 'https://api.allorigins.win/raw?url=';
const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/';

const SYMBOLS = {
    'ZB=F': { label: 'ZB', name: '30年期', dec: 3 },
    'ZN=F': { label: 'ZN', name: '10年期', dec: 3 },
    'ZF=F': { label: 'ZF', name: '5年期',  dec: 3 },
    'ZT=F': { label: 'ZT', name: '2年期',  dec: 3 },
    'DX-Y.NYB': { label: 'DX', name: '美元指数', dec: 3 },
    'GC=F': { label: 'GC', name: '黄金', dec: 1 },
    'ES=F': { label: 'ES', name: '标普500', dec: 2 },
    '^VIX': { label: 'VIX', name: 'VIX', dec: 2 },
};

const FUTURES = ['ZB=F', 'ZN=F', 'ZF=F', 'ZT=F'];
const MARKETS = ['DX-Y.NYB', 'GC=F', 'ES=F', '^VIX'];

// ── Yahoo Finance Data Fetching ──
async function fetchData(symbol, interval = '1h', range = '5d') {
    const url = YAHOO + encodeURIComponent(symbol) + '?interval=' + interval + '&range=' + range;
    const resp = await fetch(PROXY + encodeURIComponent(url));
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    const r = json.chart.result[0];
    const ts = r.timestamp || [];
    const q = r.indicators.quote[0];
    const candles = [];
    for (let i = 0; i < ts.length; i++) {
        if (q.close[i] != null && q.open[i] != null) {
            candles.push({
                time: ts[i],
                open: q.open[i],
                high: q.high[i],
                low: q.low[i],
                close: q.close[i],
                volume: (q.volume && q.volume[i]) || 0,
            });
        }
    }
    return { candles, meta: r.meta };
}

// ── Ticker Bar ──
async function loadTicker() {
    const allSyms = [...FUTURES, ...MARKETS];
    const promises = allSyms.map(async sym => {
        try {
            const { candles, meta } = await fetchData(sym, '1d', '5d');
            const info = SYMBOLS[sym];
            const last = candles[candles.length - 1];
            if (!last) return;
            const prev = meta.chartPreviousClose || meta.previousClose || candles[Math.max(0, candles.length - 2)].close;
            const change = last.close - prev;
            const pct = (change / prev) * 100;

            const priceEl = document.getElementById('tp-' + info.label);
            const chgEl = document.getElementById('tc-' + info.label);
            if (priceEl) priceEl.textContent = last.close.toFixed(info.dec);
            if (chgEl) {
                chgEl.textContent = (change >= 0 ? '+' : '') + pct.toFixed(2) + '%';
                chgEl.className = 'ticker-chg ' + (change >= 0 ? 'up' : 'down');
            }
        } catch (e) { /* silent */ }
    });
    await Promise.allSettled(promises);
}

// ── Main Chart (Candlestick) ──
let mainChart = null;
let mainCandleSeries = null;
let mainVolSeries = null;
let currentSymbol = 'ZB=F';

function initMainChart() {
    const container = document.getElementById('mainChartContainer');
    if (!container || typeof LightweightCharts === 'undefined') return;

    mainChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight || 480,
        layout: { background: { type: 'solid', color: '#ffffff' }, textColor: '#333' },
        grid: { vertLines: { color: '#f5f5f5' }, horzLines: { color: '#f5f5f5' } },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        rightPriceScale: { borderColor: '#e0e0e0' },
        timeScale: { borderColor: '#e0e0e0', timeVisible: true, secondsVisible: false },
    });

    mainCandleSeries = mainChart.addCandlestickSeries({
        upColor: '#e74c3c', downColor: '#2ecc71',
        borderUpColor: '#e74c3c', borderDownColor: '#2ecc71',
        wickUpColor: '#e74c3c', wickDownColor: '#2ecc71',
    });

    mainVolSeries = mainChart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        scaleMargins: { top: 0.85, bottom: 0 },
    });

    new ResizeObserver(() => {
        mainChart.applyOptions({ width: container.clientWidth });
    }).observe(container);
}

async function loadMainChart(symbol) {
    currentSymbol = symbol || currentSymbol;
    const info = SYMBOLS[currentSymbol];

    document.getElementById('priceSymbol').textContent = info.label + ' (' + info.name + '美债期货)';
    document.getElementById('priceCurrent').textContent = '加载中...';
    document.getElementById('priceChange').textContent = '';

    try {
        const { candles, meta } = await fetchData(currentSymbol, '1h', '10d');
        if (!candles.length) throw new Error('No data');

        mainCandleSeries.setData(candles);
        mainVolSeries.setData(candles.map(c => ({
            time: c.time,
            value: c.volume,
            color: c.close >= c.open ? 'rgba(231,76,60,0.25)' : 'rgba(46,204,113,0.25)',
        })));
        mainChart.timeScale().fitContent();

        const last = candles[candles.length - 1];
        const prev = meta.chartPreviousClose || meta.previousClose || candles[0].open;
        const change = last.close - prev;
        const pct = (change / prev) * 100;

        document.getElementById('priceCurrent').textContent = last.close.toFixed(info.dec);
        const chgEl = document.getElementById('priceChange');
        chgEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(info.dec) + ' (' + (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%)';
        chgEl.className = 'price-change ' + (change >= 0 ? 'up' : 'down');
    } catch (e) {
        console.error('Main chart error:', e);
        document.getElementById('priceCurrent').textContent = '数据获取失败';
        document.getElementById('priceChange').textContent = '请稍后刷新重试';
    }
}

// ── Mini Charts (Area) ──
const miniCharts = {};

function createMiniAreaChart(containerId, candles, isUp) {
    const container = document.getElementById(containerId);
    if (!container || typeof LightweightCharts === 'undefined') return;
    container.innerHTML = '';

    const color = isUp ? '#e74c3c' : '#2ecc71';
    const chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight || 120,
        layout: { background: { type: 'solid', color: 'transparent' }, textColor: '#999' },
        grid: { vertLines: { visible: false }, horzLines: { visible: false } },
        rightPriceScale: { visible: false },
        timeScale: { visible: false },
        handleScroll: false,
        handleScale: false,
        crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    });

    const series = chart.addAreaSeries({
        lineColor: color,
        topColor: isUp ? 'rgba(231,76,60,0.18)' : 'rgba(46,204,113,0.18)',
        bottomColor: isUp ? 'rgba(231,76,60,0.02)' : 'rgba(46,204,113,0.02)',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
    });

    series.setData(candles.map(c => ({ time: c.time, value: c.close })));
    chart.timeScale().fitContent();

    new ResizeObserver(() => {
        chart.applyOptions({ width: container.clientWidth });
    }).observe(container);

    miniCharts[containerId] = chart;
}

async function loadMiniCard(symbol, chartId, infoId) {
    const info = SYMBOLS[symbol];
    try {
        const { candles, meta } = await fetchData(symbol, '1h', '5d');
        if (!candles.length) return;

        const last = candles[candles.length - 1];
        const first = candles[0];
        const change = last.close - first.open;
        const pct = (change / first.open) * 100;
        const isUp = change >= 0;

        const infoEl = document.getElementById(infoId);
        if (infoEl) {
            infoEl.innerHTML = '<span class="mini-price">' + last.close.toFixed(info.dec) + '</span>'
                + '<span class="mini-change ' + (isUp ? 'up' : 'down') + '">'
                + (isUp ? '+' : '') + pct.toFixed(2) + '%</span>';
        }

        createMiniAreaChart(chartId, candles, isUp);
    } catch (e) {
        const infoEl = document.getElementById(infoId);
        if (infoEl) infoEl.innerHTML = '<span class="loading-text">暂无数据</span>';
    }
}

async function loadAllMiniCharts() {
    const tasks = [];
    FUTURES.forEach(sym => {
        const l = SYMBOLS[sym].label;
        tasks.push(loadMiniCard(sym, 'mc-' + l, 'yi-' + l));
    });
    MARKETS.forEach(sym => {
        const l = SYMBOLS[sym].label;
        tasks.push(loadMiniCard(sym, 'mc-' + l, 'mi-' + l));
    });
    await Promise.allSettled(tasks);
}

// ── Chart Tab Switching ──
function initChartTabs() {
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadMainChart(tab.dataset.symbol);
        });
    });
}

// ── Auto Refresh ──
function startAutoRefresh() {
    setInterval(() => {
        loadMainChart();
        loadTicker();
    }, 60000); // every 60s
}

// ========================================================================
// Economic Data (unchanged from original)
// ========================================================================

const economicData = [
    { date:'2026-03-06',time:'21:30',name:'美国2月非农就业',stars:5,value:'275K',previous:'143K',forecast:'160K',impact:'bearish',change5m:-0.52,change30m:-0.71,changeDay:-1.15 },
    { date:'2026-03-12',time:'21:30',name:'美国2月CPI同比',stars:5,value:'2.8%',previous:'3.0%',forecast:'2.9%',impact:'bullish',change5m:0.45,change30m:0.62,changeDay:0.89 },
    { date:'2026-02-07',time:'21:30',name:'美国1月非农就业',stars:5,value:'143K',previous:'256K',forecast:'170K',impact:'bullish',change5m:0.68,change30m:0.82,changeDay:1.35 },
    { date:'2026-02-12',time:'21:30',name:'美国1月CPI同比',stars:5,value:'3.0%',previous:'2.9%',forecast:'2.9%',impact:'bearish',change5m:-0.41,change30m:-0.55,changeDay:-0.82 },
    { date:'2026-01-29',time:'03:00',name:'美联储利率决议',stars:5,value:'4.25%',previous:'4.25%',forecast:'4.25%',impact:'neutral',change5m:0.12,change30m:0.08,changeDay:-0.15 },
    { date:'2026-01-10',time:'21:30',name:'美国12月非农就业',stars:5,value:'256K',previous:'212K',forecast:'165K',impact:'bearish',change5m:-0.67,change30m:-0.89,changeDay:-1.23 },
    { date:'2026-01-15',time:'21:30',name:'美国12月CPI同比',stars:5,value:'2.9%',previous:'2.7%',forecast:'2.9%',impact:'neutral',change5m:0.18,change30m:0.25,changeDay:0.31 },
    { date:'2025-12-18',time:'03:00',name:'美联储利率决议(降息)',stars:5,value:'4.25%',previous:'4.50%',forecast:'4.25%',impact:'bearish',change5m:-0.82,change30m:-1.05,changeDay:-1.54 },
    { date:'2025-12-11',time:'21:30',name:'美国11月CPI同比',stars:5,value:'2.7%',previous:'2.6%',forecast:'2.7%',impact:'neutral',change5m:0.15,change30m:0.22,changeDay:0.38 },
    { date:'2025-12-06',time:'21:30',name:'美国11月非农就业',stars:5,value:'227K',previous:'36K',forecast:'202K',impact:'bearish',change5m:-0.31,change30m:-0.18,changeDay:0.12 },
    { date:'2025-11-07',time:'03:00',name:'美联储利率决议(降息)',stars:5,value:'4.50%',previous:'4.75%',forecast:'4.50%',impact:'bullish',change5m:0.22,change30m:0.35,changeDay:0.61 },
    { date:'2025-11-01',time:'21:30',name:'美国10月非农就业',stars:5,value:'12K',previous:'223K',forecast:'100K',impact:'bullish',change5m:0.48,change30m:0.55,changeDay:0.42 },
    { date:'2025-10-10',time:'21:30',name:'美国9月CPI同比',stars:5,value:'2.4%',previous:'2.5%',forecast:'2.3%',impact:'neutral',change5m:-0.15,change30m:-0.22,changeDay:-0.38 },
    { date:'2025-10-04',time:'21:30',name:'美国9月非农就业',stars:5,value:'254K',previous:'159K',forecast:'147K',impact:'bearish',change5m:-0.75,change30m:-0.91,changeDay:-1.08 },
    { date:'2025-09-18',time:'02:00',name:'美联储利率决议(降息50bp)',stars:5,value:'4.75%',previous:'5.25%',forecast:'5.00%',impact:'bullish',change5m:0.95,change30m:0.78,changeDay:0.52 },
    { date:'2025-09-06',time:'21:30',name:'美国8月非农就业',stars:5,value:'142K',previous:'89K',forecast:'165K',impact:'bullish',change5m:0.32,change30m:0.45,changeDay:0.71 },
    { date:'2025-08-14',time:'21:30',name:'美国7月CPI同比',stars:5,value:'2.9%',previous:'3.0%',forecast:'3.0%',impact:'bullish',change5m:0.38,change30m:0.52,changeDay:0.85 },
    { date:'2025-08-02',time:'21:30',name:'美国7月非农就业',stars:5,value:'114K',previous:'179K',forecast:'176K',impact:'bullish',change5m:0.72,change30m:0.95,changeDay:1.42 },
    { date:'2025-07-11',time:'21:30',name:'美国6月CPI同比',stars:5,value:'3.0%',previous:'3.3%',forecast:'3.1%',impact:'bullish',change5m:0.55,change30m:0.68,changeDay:0.92 },
    { date:'2025-07-05',time:'21:30',name:'美国6月非农就业',stars:5,value:'206K',previous:'218K',forecast:'190K',impact:'neutral',change5m:-0.12,change30m:-0.08,changeDay:0.15 },
];

function renderImpactSummary(data) {
    const el = document.getElementById('impactSummary');
    if (!data.length) return;
    const d = data[0];
    const impactText = d.impact === 'bullish' ? '利多' : d.impact === 'bearish' ? '利空' : '中性';
    const impactClass = d.impact;
    el.innerHTML = '<div class="impact-top"><div class="impact-flag-time"><span class="flag">🇺🇸</span><span>' + d.time + '</span></div><div class="impact-stars">' + '★'.repeat(d.stars) + '☆'.repeat(5 - d.stars) + '</div></div>'
        + '<div class="impact-name">' + d.name + '</div>'
        + '<div class="impact-labels"><span class="impact-label ' + impactClass + '">' + impactText + ' 美债期货</span></div>'
        + '<div class="impact-values"><span>前值 <strong>' + d.previous + '</strong></span><span>预期 <strong>' + d.forecast + '</strong></span><span>公布 <strong>' + d.value + '</strong></span></div>';
    el.style.borderLeftColor = d.impact === 'bullish' ? 'var(--red)' : d.impact === 'bearish' ? 'var(--green)' : 'var(--orange)';
}

function renderImpactProb(data) {
    const el = document.getElementById('impactProb');
    if (!data.length) return;
    const declineCount = data.filter(d => d.changeDay < 0).length;
    const prob = ((declineCount / data.length) * 100).toFixed(2);
    const isDown = prob >= 50;
    el.className = 'impact-prob ' + (isDown ? 'down' : 'up');
    el.innerHTML = '<div class="impact-prob-left">30年美债期货</div><div class="impact-prob-right"><span class="impact-prob-arrow">' + (isDown ? '↓' : '↑') + '</span><span class="impact-prob-label">' + (isDown ? '下跌概率' : '上涨概率') + '</span><span class="impact-prob-value">' + (isDown ? prob : (100 - parseFloat(prob)).toFixed(2)) + '%</span></div>';
}

function renderDataTable(data) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = data.map(d => {
        const t = d.impact === 'bullish' ? '利多' : d.impact === 'bearish' ? '利空' : '中性';
        const bc = d.impact === 'bullish' ? 'badge-bullish' : d.impact === 'bearish' ? 'badge-bearish' : 'badge-neutral';
        return '<tr><td><span class="data-date">' + d.date + '</span><span class="data-time">' + d.time + '</span></td>'
            + '<td class="data-indicator">' + d.name + '</td>'
            + '<td class="data-value">' + d.value + '</td>'
            + '<td><span class="badge ' + bc + '">' + t + '</span></td>'
            + '<td class="' + (d.change5m >= 0 ? 'change-positive' : 'change-negative') + '">' + (d.change5m >= 0 ? '+' : '') + d.change5m.toFixed(2) + '%</td>'
            + '<td class="' + (d.change30m >= 0 ? 'change-positive' : 'change-negative') + '">' + (d.change30m >= 0 ? '+' : '') + d.change30m.toFixed(2) + '%</td>'
            + '<td class="' + (d.changeDay >= 0 ? 'change-positive' : 'change-negative') + '">' + (d.changeDay >= 0 ? '+' : '') + d.changeDay.toFixed(2) + '%</td></tr>';
    }).join('');
}

function initDataTabs() {
    document.querySelectorAll('.data-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.data-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderDataTable(economicData);
            renderImpactSummary(economicData);
            renderImpactProb(economicData);
        });
    });
}

// ── Navigation & Clock ──
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navTabs = document.querySelectorAll('.nav-tab');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navTabs.forEach(tab => tab.classList.toggle('active', tab.getAttribute('href') === '#' + id));
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
}

function updateClock() {
    const now = new Date();
    const bjTime = now.toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const nyTime = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById('clock').textContent = '北京 ' + bjTime + ' | 纽约 ' + nyTime;
    const nyNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = nyNow.getDay(), hour = nyNow.getHours(), timeNum = hour * 100 + nyNow.getMinutes();
    let isOpen = false;
    if (day >= 1 && day <= 5) isOpen = !(timeNum >= 1700 && timeNum < 1800);
    else if (day === 0) isOpen = timeNum >= 1800;
    const s = document.getElementById('marketStatus');
    s.textContent = isOpen ? '交易中' : '已休市';
    s.className = 'market-status ' + (isOpen ? 'open' : 'closed');
}

function initSmoothScroll() {
    document.querySelectorAll('.nav-tab').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initProbExplain() {
    const btn = document.getElementById('probExplainBtn');
    if (btn) btn.addEventListener('click', () => {
        alert('行情走势概率说明\n\n下跌/上涨概率基于该指标历史发布后，30年期美债期货（ZB）在当日的涨跌次数统计计算得出。\n\n例如：过去10次数据发布中，有6次ZB当日下跌，则下跌概率为60%。\n\n注意：历史概率仅供参考，不代表未来走势。');
    });
}

// ========================================================================
// Economic Calendar (Chinese)
// ========================================================================
// importance: 3=high, 2=medium, 1=low
const calendarEvents = [
    { date:'2026-04-07', time:'22:00', name:'美国2月工厂订单', en:'Factory Orders', imp:2, prev:'+1.7%', fore:'+0.5%' },
    { date:'2026-04-08', time:'06:00', name:'美国2月消费信贷', en:'Consumer Credit', imp:2, prev:'$18.1B', fore:'$15.0B' },
    { date:'2026-04-09', time:'02:00', name:'FOMC会议纪要', en:'FOMC Minutes', imp:3 },
    { date:'2026-04-10', time:'20:30', name:'美国3月CPI消费者物价指数', en:'CPI', imp:3, prev:'2.8%', fore:'2.6%' },
    { date:'2026-04-10', time:'20:30', name:'美国当周初请失业金', en:'Initial Jobless Claims', imp:2, prev:'219K', fore:'223K' },
    { date:'2026-04-11', time:'20:30', name:'美国3月PPI生产者物价指数', en:'PPI', imp:3, prev:'3.2%', fore:'3.3%' },
    { date:'2026-04-14', time:'20:30', name:'美国3月进出口物价指数', en:'Import/Export Prices', imp:1 },
    { date:'2026-04-15', time:'20:30', name:'美国3月零售销售月率', en:'Retail Sales MM', imp:3, prev:'0.2%', fore:'1.3%' },
    { date:'2026-04-15', time:'22:00', name:'美国4月NAHB房屋市场指数', en:'NAHB Housing Index', imp:2, prev:'39' },
    { date:'2026-04-16', time:'20:30', name:'美国3月新屋开工', en:'Housing Starts', imp:2, prev:'1.501M', fore:'1.420M' },
    { date:'2026-04-16', time:'20:30', name:'美国3月建筑许可', en:'Building Permits', imp:2, prev:'1.456M', fore:'1.450M' },
    { date:'2026-04-17', time:'20:30', name:'美国当周初请失业金', en:'Initial Jobless Claims', imp:2 },
    { date:'2026-04-17', time:'20:30', name:'费城联储制造业指数', en:'Philadelphia Fed Index', imp:2, prev:'12.5' },
    { date:'2026-04-22', time:'22:00', name:'美国3月成屋销售', en:'Existing Home Sales', imp:2, prev:'4.26M' },
    { date:'2026-04-23', time:'20:30', name:'美国当周初请失业金', en:'Initial Jobless Claims', imp:2 },
    { date:'2026-04-23', time:'21:45', name:'标普全球综合PMI初值', en:'S&P Global PMI Flash', imp:2, prev:'53.5' },
    { date:'2026-04-24', time:'20:30', name:'美国3月耐用品订单', en:'Durable Goods Orders', imp:3, prev:'+0.9%' },
    { date:'2026-04-24', time:'22:00', name:'美国3月新屋销售', en:'New Home Sales', imp:2, prev:'676K' },
    { date:'2026-04-25', time:'22:00', name:'密歇根消费者信心指数终值', en:'Michigan Sentiment Final', imp:2, prev:'57.0' },
    { date:'2026-04-29', time:'22:00', name:'谘商会消费者信心指数', en:'CB Consumer Confidence', imp:3, prev:'92.9' },
    { date:'2026-04-29', time:'22:00', name:'JOLTS职位空缺', en:'JOLTS Job Openings', imp:3, prev:'7.57M' },
    { date:'2026-04-30', time:'20:15', name:'ADP就业人数', en:'ADP Employment', imp:2, prev:'155K' },
    { date:'2026-04-30', time:'20:30', name:'美国Q1 GDP初值(年化季率)', en:'GDP Advance Q/Q', imp:3, prev:'+2.4%' },
    { date:'2026-04-30', time:'20:30', name:'美国Q1核心PCE物价指数', en:'Core PCE Prices Q/Q', imp:3, prev:'+2.6%' },
    { date:'2026-05-01', time:'20:30', name:'美国当周初请失业金', en:'Initial Jobless Claims', imp:2 },
    { date:'2026-05-01', time:'22:00', name:'ISM制造业PMI', en:'ISM Manufacturing PMI', imp:3, prev:'50.3' },
    { date:'2026-05-02', time:'20:30', name:'美国4月非农就业', en:'Non-Farm Payrolls', imp:3, prev:'228K', fore:'138K' },
    { date:'2026-05-02', time:'20:30', name:'美国4月失业率', en:'Unemployment Rate', imp:3, prev:'4.2%', fore:'4.2%' },
    { date:'2026-05-05', time:'22:00', name:'ISM非制造业PMI', en:'ISM Services PMI', imp:3, prev:'50.8' },
    { date:'2026-05-07', time:'02:00', name:'美联储利率决议', en:'Fed Rate Decision', imp:3, prev:'4.25-4.50%' },
    { date:'2026-05-07', time:'02:30', name:'美联储主席鲍威尔新闻发布会', en:'Fed Press Conference', imp:3 },
    { date:'2026-05-13', time:'20:30', name:'美国4月CPI消费者物价指数', en:'CPI', imp:3, prev:'2.4%' },
    { date:'2026-05-14', time:'20:30', name:'美国4月PPI生产者物价指数', en:'PPI', imp:3 },
    { date:'2026-05-15', time:'20:30', name:'美国4月零售销售', en:'Retail Sales', imp:3 },
    { date:'2026-05-15', time:'20:30', name:'美国当周初请失业金', en:'Initial Jobless Claims', imp:2 },
    { date:'2026-05-16', time:'22:00', name:'密歇根消费者信心指数初值', en:'Michigan Sentiment Prelim', imp:2 },
];

function renderCalendar() {
    const container = document.getElementById('calendarContent');
    if (!container) return;

    const today = new Date().toISOString().slice(0, 10);
    const grouped = {};
    calendarEvents.forEach(ev => {
        if (!grouped[ev.date]) grouped[ev.date] = [];
        grouped[ev.date].push(ev);
    });

    const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];
    let html = '';

    Object.keys(grouped).sort().forEach(date => {
        const d = new Date(date + 'T00:00:00');
        const m = d.getMonth() + 1;
        const day = d.getDate();
        const wd = weekdays[d.getDay()];
        const isPast = date < today;
        const isToday = date === today;

        html += '<div class="cal-date-group">';
        html += '<div class="cal-date-header">' + m + '月' + day + '日 ' + wd + (isToday ? ' <span style="color:var(--red);font-size:0.75rem">今天</span>' : '') + '</div>';

        grouped[date].forEach(ev => {
            const dotClass = ev.imp === 3 ? 'high' : ev.imp === 2 ? 'med' : 'low';
            html += '<div class="cal-event" style="' + (isPast ? 'opacity:0.5' : '') + '">'
                + '<span class="cal-time">' + ev.time + '</span>'
                + '<span class="cal-dot ' + dotClass + '"></span>'
                + '<span class="cal-name">' + ev.name + '<br><span class="cal-name-en">' + ev.en + '</span></span>'
                + '<span class="cal-val">' + (ev.prev ? ev.prev + '<span class="cal-val-label">前值</span>' : '') + '</span>'
                + '<span class="cal-val">' + (ev.fore ? ev.fore + '<span class="cal-val-label">预期</span>' : '') + '</span>'
                + '<span class="cal-val"></span>'
                + '</div>';
        });
        html += '</div>';
    });

    container.innerHTML = html;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
    // Static content first
    renderImpactSummary(economicData);
    renderImpactProb(economicData);
    renderDataTable(economicData);
    initDataTabs();
    initChartTabs();
    renderCalendar();
    initNavHighlight();
    initProbExplain();
    initSmoothScroll();
    updateClock();
    setInterval(updateClock, 1000);

    // Charts (async, loads data from API)
    initMainChart();
    await Promise.allSettled([
        loadMainChart('ZB=F'),
        loadTicker(),
        loadAllMiniCharts(),
    ]);
    startAutoRefresh();
});
