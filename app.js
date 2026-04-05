// ========================================================================
// 美债期货实时监控 - 交互逻辑
// ========================================================================

// ── Economic Data: Historical releases and their impact on 30Y T-Bond ──
// impact: 'bullish' = 利多(债价上涨), 'bearish' = 利空(债价下跌), 'neutral' = 中性
// changes: percentage change of ZB (30Y T-Bond futures) after release
const economicData = [
    {
        date: '2026-03-06', time: '21:30', name: '美国2月非农就业', stars: 5,
        value: '275K', previous: '143K', forecast: '160K',
        impact: 'bearish',
        change5m: -0.52, change30m: -0.71, changeDay: -1.15
    },
    {
        date: '2026-03-12', time: '21:30', name: '美国2月CPI同比', stars: 5,
        value: '2.8%', previous: '3.0%', forecast: '2.9%',
        impact: 'bullish',
        change5m: 0.45, change30m: 0.62, changeDay: 0.89
    },
    {
        date: '2026-02-07', time: '21:30', name: '美国1月非农就业', stars: 5,
        value: '143K', previous: '256K', forecast: '170K',
        impact: 'bullish',
        change5m: 0.68, change30m: 0.82, changeDay: 1.35
    },
    {
        date: '2026-02-12', time: '21:30', name: '美国1月CPI同比', stars: 5,
        value: '3.0%', previous: '2.9%', forecast: '2.9%',
        impact: 'bearish',
        change5m: -0.41, change30m: -0.55, changeDay: -0.82
    },
    {
        date: '2026-01-29', time: '03:00', name: '美联储利率决议', stars: 5,
        value: '4.25%', previous: '4.25%', forecast: '4.25%',
        impact: 'neutral',
        change5m: 0.12, change30m: 0.08, changeDay: -0.15
    },
    {
        date: '2026-01-10', time: '21:30', name: '美国12月非农就业', stars: 5,
        value: '256K', previous: '212K', forecast: '165K',
        impact: 'bearish',
        change5m: -0.67, change30m: -0.89, changeDay: -1.23
    },
    {
        date: '2026-01-15', time: '21:30', name: '美国12月CPI同比', stars: 5,
        value: '2.9%', previous: '2.7%', forecast: '2.9%',
        impact: 'neutral',
        change5m: 0.18, change30m: 0.25, changeDay: 0.31
    },
    {
        date: '2025-12-18', time: '03:00', name: '美联储利率决议(降息)', stars: 5,
        value: '4.25%', previous: '4.50%', forecast: '4.25%',
        impact: 'bearish',
        change5m: -0.82, change30m: -1.05, changeDay: -1.54
    },
    {
        date: '2025-12-11', time: '21:30', name: '美国11月CPI同比', stars: 5,
        value: '2.7%', previous: '2.6%', forecast: '2.7%',
        impact: 'neutral',
        change5m: 0.15, change30m: 0.22, changeDay: 0.38
    },
    {
        date: '2025-12-06', time: '21:30', name: '美国11月非农就业', stars: 5,
        value: '227K', previous: '36K', forecast: '202K',
        impact: 'bearish',
        change5m: -0.31, change30m: -0.18, changeDay: 0.12
    },
    {
        date: '2025-11-07', time: '03:00', name: '美联储利率决议(降息)', stars: 5,
        value: '4.50%', previous: '4.75%', forecast: '4.50%',
        impact: 'bullish',
        change5m: 0.22, change30m: 0.35, changeDay: 0.61
    },
    {
        date: '2025-11-01', time: '21:30', name: '美国10月非农就业', stars: 5,
        value: '12K', previous: '223K', forecast: '100K',
        impact: 'bullish',
        change5m: 0.48, change30m: 0.55, changeDay: 0.42
    },
    {
        date: '2025-10-10', time: '21:30', name: '美国9月CPI同比', stars: 5,
        value: '2.4%', previous: '2.5%', forecast: '2.3%',
        impact: 'neutral',
        change5m: -0.15, change30m: -0.22, changeDay: -0.38
    },
    {
        date: '2025-10-04', time: '21:30', name: '美国9月非农就业', stars: 5,
        value: '254K', previous: '159K', forecast: '147K',
        impact: 'bearish',
        change5m: -0.75, change30m: -0.91, changeDay: -1.08
    },
    {
        date: '2025-09-18', time: '02:00', name: '美联储利率决议(降息50bp)', stars: 5,
        value: '4.75%', previous: '5.25%', forecast: '5.00%',
        impact: 'bullish',
        change5m: 0.95, change30m: 0.78, changeDay: 0.52
    },
    {
        date: '2025-09-06', time: '21:30', name: '美国8月非农就业', stars: 5,
        value: '142K', previous: '89K', forecast: '165K',
        impact: 'bullish',
        change5m: 0.32, change30m: 0.45, changeDay: 0.71
    },
    {
        date: '2025-08-14', time: '21:30', name: '美国7月CPI同比', stars: 5,
        value: '2.9%', previous: '3.0%', forecast: '3.0%',
        impact: 'bullish',
        change5m: 0.38, change30m: 0.52, changeDay: 0.85
    },
    {
        date: '2025-08-02', time: '21:30', name: '美国7月非农就业', stars: 5,
        value: '114K', previous: '179K', forecast: '176K',
        impact: 'bullish',
        change5m: 0.72, change30m: 0.95, changeDay: 1.42
    },
    {
        date: '2025-07-11', time: '21:30', name: '美国6月CPI同比', stars: 5,
        value: '3.0%', previous: '3.3%', forecast: '3.1%',
        impact: 'bullish',
        change5m: 0.55, change30m: 0.68, changeDay: 0.92
    },
    {
        date: '2025-07-05', time: '21:30', name: '美国6月非农就业', stars: 5,
        value: '206K', previous: '218K', forecast: '190K',
        impact: 'neutral',
        change5m: -0.12, change30m: -0.08, changeDay: 0.15
    }
];

// ── Render: Impact Summary Card ──
function renderImpactSummary(data) {
    const el = document.getElementById('impactSummary');
    if (!data.length) return;
    const d = data[0]; // Latest entry

    const impactText = d.impact === 'bullish' ? '利多' : d.impact === 'bearish' ? '利空' : '中性';
    const impactClass = d.impact === 'bullish' ? 'bullish' : d.impact === 'bearish' ? 'bearish' : 'neutral';

    el.innerHTML = `
        <div class="impact-top">
            <div class="impact-flag-time">
                <span class="flag">🇺🇸</span>
                <span>${d.time}</span>
            </div>
            <div class="impact-stars">${'★'.repeat(d.stars)}${'☆'.repeat(5 - d.stars)}</div>
        </div>
        <div class="impact-name">${d.name}</div>
        <div class="impact-labels">
            <span class="impact-label ${impactClass}">${impactText} 美债期货</span>
        </div>
        <div class="impact-values">
            <span>前值 <strong>${d.previous}</strong></span>
            <span>预期 <strong>${d.forecast}</strong></span>
            <span>公布 <strong>${d.value}</strong></span>
        </div>
    `;

    // Update border color
    el.style.borderLeftColor = d.impact === 'bullish' ? 'var(--red)' :
                               d.impact === 'bearish' ? 'var(--green)' : 'var(--orange)';
}

// ── Render: Impact Probability Bar ──
function renderImpactProb(data) {
    const el = document.getElementById('impactProb');
    if (!data.length) return;

    // Calculate decline probability from historical data
    const declineCount = data.filter(d => d.changeDay < 0).length;
    const prob = ((declineCount / data.length) * 100).toFixed(2);
    const isDown = prob >= 50;

    el.className = `impact-prob ${isDown ? 'down' : 'up'}`;
    el.innerHTML = `
        <div class="impact-prob-left">30年美债期货</div>
        <div class="impact-prob-right">
            <span class="impact-prob-arrow">${isDown ? '↓' : '↑'}</span>
            <span class="impact-prob-label">${isDown ? '下跌概率' : '上涨概率'}</span>
            <span class="impact-prob-value">${isDown ? prob : (100 - parseFloat(prob)).toFixed(2)}%</span>
        </div>
    `;
}

// ── Render: Data Table ──
function renderDataTable(data) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = data.map(d => {
        const impactText = d.impact === 'bullish' ? '利多' : d.impact === 'bearish' ? '利空' : '中性';
        const badgeClass = d.impact === 'bullish' ? 'badge-bullish' : d.impact === 'bearish' ? 'badge-bearish' : 'badge-neutral';
        return `
        <tr>
            <td>
                <span class="data-date">${d.date}</span>
                <span class="data-time">${d.time}</span>
            </td>
            <td class="data-indicator">${d.name}</td>
            <td class="data-value">${d.value}</td>
            <td><span class="badge ${badgeClass}">${impactText}</span></td>
            <td class="${d.change5m >= 0 ? 'change-positive' : 'change-negative'}">${d.change5m >= 0 ? '+' : ''}${d.change5m.toFixed(2)}%</td>
            <td class="${d.change30m >= 0 ? 'change-positive' : 'change-negative'}">${d.change30m >= 0 ? '+' : ''}${d.change30m.toFixed(2)}%</td>
            <td class="${d.changeDay >= 0 ? 'change-positive' : 'change-negative'}">${d.changeDay >= 0 ? '+' : ''}${d.changeDay.toFixed(2)}%</td>
        </tr>`;
    }).join('');
}

// ── Tab Switching: Data Review ──
function initDataTabs() {
    const tabs = document.querySelectorAll('.data-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Different filter modes could load different datasets
            // For now, all tabs show the bond impact data with different labels
            renderDataTable(economicData);
            renderImpactSummary(economicData);
            renderImpactProb(economicData);
        });
    });
}

// ── Tab Switching: Chart Symbols ──
function initChartTabs() {
    const tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Note: TradingView embedded widget doesn't support dynamic symbol change
            // The chart widget has allow_symbol_change: true so users can change manually
        });
    });
}

// ── Navigation: Active state on scroll ──
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navTabs = document.querySelectorAll('.nav-tab');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navTabs.forEach(tab => {
                    tab.classList.toggle('active', tab.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

// ── Clock & Market Status ──
function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    const statusEl = document.getElementById('marketStatus');

    // Display Beijing time and New York time
    const bjTime = now.toLocaleTimeString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const nyTime = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit', minute: '2-digit', hour12: false
    });

    clockEl.textContent = `北京 ${bjTime} | 纽约 ${nyTime}`;

    // Check if US bond futures market is open
    // CME Globex: Sun-Fri 5:00pm - 4:00pm CT (next day), with 1hr break 4-5pm
    const nyNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = nyNow.getDay();
    const hour = nyNow.getHours();
    const minute = nyNow.getMinutes();
    const timeNum = hour * 100 + minute;

    let isOpen = false;
    if (day >= 1 && day <= 5) {
        // Mon-Fri: roughly 6pm prev day to 5pm, with break 5-6pm ET
        // Simplified: market is open almost 23 hours, closed 5-6pm ET
        isOpen = !(timeNum >= 1700 && timeNum < 1800);
    } else if (day === 0) {
        // Sunday: opens at 6pm ET
        isOpen = timeNum >= 1800;
    }
    // Saturday: closed

    statusEl.textContent = isOpen ? '交易中' : '已休市';
    statusEl.className = `market-status ${isOpen ? 'open' : 'closed'}`;
}

// ── Probability Explanation Modal ──
function initProbExplain() {
    const btn = document.getElementById('probExplainBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        alert(
            '行情走势概率说明\n\n' +
            '下跌/上涨概率基于该指标历史发布后，30年期美债期货（ZB）' +
            '在当日的涨跌次数统计计算得出。\n\n' +
            '例如：过去10次数据发布中，有6次ZB当日下跌，' +
            '则下跌概率为60%。\n\n' +
            '注意：历史概率仅供参考，不代表未来走势。'
        );
    });
}

// ── Smooth scroll for nav links ──
function initSmoothScroll() {
    document.querySelectorAll('.nav-tab').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    renderImpactSummary(economicData);
    renderImpactProb(economicData);
    renderDataTable(economicData);
    initDataTabs();
    initChartTabs();
    initNavHighlight();
    initProbExplain();
    initSmoothScroll();
    updateClock();
    setInterval(updateClock, 1000);
});
