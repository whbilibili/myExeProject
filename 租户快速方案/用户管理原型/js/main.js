// ==================== 全局状态管理 ====================

const AppState = {
  currentUser: null,
  currentTab: 'data-overview',
  currentSubTab: {
    'data-overview': 'points',
    'usage-analysis': 'agents'
  },
  filters: {
    dateRange: 'last30days',
    tenant: 'all',
    granularity: 'daily'
  }
};

// ==================== 工具函数 ====================

// 显示模态框
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// 隐藏模态框
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// 显示确认对话框
function showConfirmDialog(title, message, onConfirm) {
  if (confirm(`${title}\n\n${message}`)) {
    onConfirm();
  }
}

// 显示成功提示
function showSuccessMessage(message) {
  alert(`✓ ${message}`);
}

// 显示错误提示
function showErrorMessage(message) {
  alert(`✗ ${message}`);
}

// 复制到剪贴板
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccessMessage('已复制到剪贴板');
  }).catch(() => {
    showErrorMessage('复制失败');
  });
}

// ==================== 标签页切换 ====================

function initTabs() {
  const tabItems = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.tab;
      
      // 更新标签页状态
      tabItems.forEach(t => t.classList.remove('active'));
      item.classList.add('active');
      
      // 更新内容显示
      tabContents.forEach(c => c.classList.remove('active'));
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
        AppState.currentTab = tabId;
        
        // 刷新图表
        setTimeout(() => refreshCharts(tabId), 100);
      }
    });
  });
}

function initSubTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const subTabItems = container.querySelectorAll('.sub-tab-item');
  const subTabContents = container.querySelectorAll('.sub-tab-content');
  
  subTabItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.subtab;
      const parentTab = item.closest('.tab-content').id;
      
      // 更新子标签页状态
      subTabItems.forEach(t => t.classList.remove('active'));
      item.classList.add('active');
      
      // 更新内容显示
      subTabContents.forEach(c => c.classList.remove('active'));
      const targetContent = container.querySelector(`#${tabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
        AppState.currentSubTab[parentTab] = tabId.replace(`${parentTab}-`, '');
        
        // 刷新图表
        setTimeout(() => refreshCharts(tabId), 100);
      }
    });
  });
}

// ==================== 图表渲染 ====================

let chartInstances = {};

function renderChart(containerId, option) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // 销毁旧图表
  if (chartInstances[containerId]) {
    chartInstances[containerId].dispose();
  }
  
  // 创建新图表
  const chart = echarts.init(container);
  chart.setOption(option);
  chartInstances[containerId] = chart;
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize();
  });
  
  return chart;
}

function refreshCharts(tabId) {
  Object.keys(chartInstances).forEach(key => {
    const container = document.getElementById(key);
    if (container && container.offsetParent !== null) {
      chartInstances[key].resize();
    }
  });
}

// 积分消耗趋势图
function renderPointsTrendChart(containerId, granularity = 'daily') {
  const data = mockPointsTrendData[granularity];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Token消耗', '云电脑时长抵扣', '云手机时长抵扣'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.date)
    },
    yAxis: {
      type: 'value',
      name: '积分'
    },
    series: [
      {
        name: 'Token消耗',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.8)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
          ])
        },
        emphasis: { focus: 'series' },
        data: data.map(d => d.token)
      },
      {
        name: '云电脑时长抵扣',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.8)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
          ])
        },
        emphasis: { focus: 'series' },
        data: data.map(d => d.desktop)
      },
      {
        name: '云手机时长抵扣',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 173, 20, 0.8)' },
            { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
          ])
        },
        emphasis: { focus: 'series' },
        data: data.map(d => d.mobile)
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 积分消耗构成环形图
function renderPointsCompositionChart(containerId) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: mockPointsComposition.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: ['#1890ff', '#52c41a', '#faad14'][index]
          }
        }))
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 按租户消耗排行图
function renderTenantRankingChart(containerId) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '积分'
    },
    yAxis: {
      type: 'category',
      data: mockTenantRanking.map(t => t.tenant).reverse()
    },
    series: [
      {
        type: 'bar',
        data: mockTenantRanking.map(t => t.points).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' }
          ]),
          borderRadius: [0, 5, 5, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// Token消耗趋势图
function renderTokenTrendChart(containerId, granularity = 'daily') {
  const data = mockTokenTrendData[granularity];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['输入Token', '输出Token'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.date)
    },
    yAxis: {
      type: 'value',
      name: 'Token数量',
      axisLabel: {
        formatter: value => formatNumber(value)
      }
    },
    series: [
      {
        name: '输入Token',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        },
        data: data.map(d => d.input)
      },
      {
        name: '输出Token',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
          ])
        },
        data: data.map(d => d.output)
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 输入输出分布饼图
function renderTokenIOChart(containerId) {
  const total = mockKPIData.tokenUsage.input + mockKPIData.tokenUsage.output;
  const inputPercent = ((mockKPIData.tokenUsage.input / total) * 100).toFixed(1);
  const outputPercent = ((mockKPIData.tokenUsage.output / total) * 100).toFixed(1);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { 
            value: mockKPIData.tokenUsage.input, 
            name: '输入Token',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: mockKPIData.tokenUsage.output, 
            name: '输出Token',
            itemStyle: { color: '#52c41a' }
          }
        ],
        label: {
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 按模型消耗分布环形图
function renderModelDistributionChart(containerId) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: mockModelDistribution.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: ['#667eea', '#764ba2', '#4facfe', '#00f2fe'][index]
          }
        })),
        label: {
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 设备时长消耗趋势图
function renderDeviceTrendChart(containerId, granularity = 'daily') {
  const data = mockDeviceTrendData[granularity];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['云电脑使用时长', '云手机使用时长'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.date)
    },
    yAxis: {
      type: 'value',
      name: '时长（分钟）'
    },
    series: [
      {
        name: '云电脑使用时长',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        },
        data: data.map(d => d.desktop)
      },
      {
        name: '云手机使用时长',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: '#faad14' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 173, 20, 0.3)' },
            { offset: 1, color: 'rgba(250, 173, 20, 0.05)' }
          ])
        },
        data: data.map(d => d.mobile)
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 设备时长分布饼图
function renderDeviceDistributionChart(containerId) {
  const total = mockKPIData.deviceTime.desktop + mockKPIData.deviceTime.mobile;
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}分钟 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { 
            value: mockKPIData.deviceTime.desktop, 
            name: '云电脑时长',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: mockKPIData.deviceTime.mobile, 
            name: '云手机时长',
            itemStyle: { color: '#faad14' }
          }
        ],
        label: {
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 会话时长分布直方图
function renderSessionDistributionChart(containerId) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockSessionDistribution.map(s => s.range)
    },
    yAxis: {
      type: 'value',
      name: '会话次数'
    },
    series: [
      {
        type: 'bar',
        data: mockSessionDistribution.map(s => s.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]),
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 分时段使用分析图
function renderHourlyUsageChart(containerId) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mockHourlyUsage.map(h => `${h.hour}:00`),
      axisLabel: {
        interval: 2
      }
    },
    yAxis: {
      type: 'value',
      name: '使用时长（分钟）'
    },
    series: [
      {
        type: 'bar',
        data: mockHourlyUsage.map(h => h.usage),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' }
          ])
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 使用分析 - 创建与调用趋势图
function renderUsageTrendChart(containerId, resourceType) {
  const data = generateTimeSeriesData(30, 10, 5);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['创建数量', '调用/运行次数'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '创建数量',
        position: 'left'
      },
      {
        type: 'value',
        name: '调用次数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '创建数量',
        type: 'bar',
        data: data.map(d => d.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        }
      },
      {
        name: '调用/运行次数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: data.map(d => d.value * 10),
        itemStyle: { color: '#52c41a' },
        lineStyle: { width: 3 }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// 使用分析 - 资源消耗排行图
function renderUsageRankingChart(containerId, resourceType) {
  let data = [];
  
  if (resourceType === 'agents') {
    data = mockAgents.slice(0, 5).map(a => ({ name: a.name, value: a.tokens }));
  } else if (resourceType === 'workflows') {
    data = mockWorkflows.slice(0, 5).map(w => ({ name: w.name, value: w.points }));
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name).reverse()
    },
    series: [
      {
        type: 'bar',
        data: data.map(d => d.value).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f093fb' },
            { offset: 1, color: '#f5576c' }
          ])
        },
        label: {
          show: true,
          position: 'right',
          formatter: params => formatNumber(params.value)
        }
      }
    ]
  };
  
  renderChart(containerId, option);
}

// ==================== 页面初始化 ====================

function initUserList() {
  // 这个函数在用户列表页使用
  console.log('用户列表页初始化');
}

function initUserDetail() {
  // 初始化标签页
  initTabs();
  
  // 初始化子标签页
  initSubTabs('#data-overview');
  initSubTabs('#usage-analysis');
  initSubTabs('#asset-inventory');
  
  // 初始化图表控制按钮
  initChartControls();
  
  // 渲染初始图表
  renderInitialCharts();
}

function initChartControls() {
  // 粒度控制按钮
  document.querySelectorAll('.chart-btn-group').forEach(group => {
    const buttons = group.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const granularity = btn.dataset.granularity;
        const chartType = btn.dataset.chart;
        
        // 更新按钮状态
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 更新图表
        if (chartType === 'points-trend') {
          renderPointsTrendChart('points-trend-chart', granularity);
        } else if (chartType === 'token-trend') {
          renderTokenTrendChart('token-trend-chart', granularity);
        } else if (chartType === 'device-trend') {
          renderDeviceTrendChart('device-trend-chart', granularity);
        }
      });
    });
  });
}

function renderInitialCharts() {
  // 数据总览 - 积分标签页图表
  renderPointsTrendChart('points-trend-chart');
  renderPointsCompositionChart('points-composition-chart');
  renderTenantRankingChart('tenant-ranking-chart');
  
  // 数据总览 - Token标签页图表
  renderTokenTrendChart('token-trend-chart');
  renderTokenIOChart('token-io-chart');
  renderModelDistributionChart('model-distribution-chart');
  
  // 数据总览 - 设备时长标签页图表
  renderDeviceTrendChart('device-trend-chart');
  renderDeviceDistributionChart('device-distribution-chart');
  renderSessionDistributionChart('session-distribution-chart');
  
  // 消费分析页图表
  renderPointsTrendChart('consumption-points-trend');
  renderPointsCompositionChart('consumption-points-composition');
  renderTenantRankingChart('consumption-tenant-ranking');
  renderTokenTrendChart('consumption-token-trend');
  renderTokenIOChart('consumption-token-io');
  renderModelDistributionChart('consumption-model-distribution');
  renderDeviceTrendChart('consumption-desktop-trend');
  renderDeviceTrendChart('consumption-mobile-trend');
  renderHourlyUsageChart('consumption-desktop-hourly');
  renderHourlyUsageChart('consumption-mobile-hourly');
  
  // 使用分析页图表
  renderUsageTrendChart('usage-agents-trend', 'agents');
  renderUsageRankingChart('usage-agents-ranking', 'agents');
}

// ==================== 页面加载 ====================

document.addEventListener('DOMContentLoaded', () => {
  // 检测当前页面
  if (document.getElementById('user-list-page')) {
    initUserList();
  } else if (document.getElementById('user-detail-page')) {
    initUserDetail();
  }
  
  // 模态框关闭事件
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
});


