// ═══════════════════════════════════════════
// 图表模块
// ═══════════════════════════════════════════

// 图表实例
let trendChart = null;
let performanceChart = null;

// 初始化图表
function initCharts(pageName) {
    // 仪表盘页面
    if (pageName === 'dashboard' || (!pageName && !trendChart)) {
        initTrendChart();
    }

    // 报告页面
    if (pageName === 'report' || (!pageName && !performanceChart)) {
        initPerformanceChart();
    }
}

// 获取主题颜色
function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
        textColor: isDark ? '#94a3b8' : '#64748b',
        gridColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)'
    };
}

// 初始化趋势图表
function initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    if (trendChart) {
        trendChart.destroy();
        trendChart = null;
    }

    const colors = getChartColors();

    trendChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['4/15', '4/16', '4/17', '4/18', '4/19', '4/20', '4/21'],
            datasets: [{
                label: '通过率',
                data: [94, 96, 93, 97, 95, 98, 96.2],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: '执行数',
                data: [32, 45, 38, 52, 48, 55, 48],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: colors.textColor, usePointStyle: true }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.gridColor },
                    ticks: { color: colors.textColor }
                },
                y: {
                    grid: { color: colors.gridColor },
                    ticks: { color: colors.textColor, callback: v => v + '%' },
                    min: 80,
                    max: 100
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: colors.textColor },
                    min: 0,
                    max: 80
                }
            }
        }
    });
}

// 初始化性能图表
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }

    const colors = getChartColors();

    performanceChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['v2.3.0', 'v2.3.1', 'v2.3.2', 'v2.3.3', 'v2.3.4'],
            datasets: [{
                label: '通过率',
                data: [95, 96.2, 94.5, 97, 98],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 4
            }, {
                label: '用例数',
                data: [320, 328, 315, 340, 350],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: colors.textColor, usePointStyle: true }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.gridColor },
                    ticks: { color: colors.textColor }
                },
                y: {
                    grid: { color: colors.gridColor },
                    ticks: { color: colors.textColor, callback: v => v + '%' },
                    min: 90,
                    max: 100
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: colors.textColor }
                }
            }
        }
    });
}
