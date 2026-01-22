/**
 * ECharts 图表配置 - 智能体运营报表
 */

// ==================== 通用配置 ====================
const COMMON_GRID = { left: '5%', right: '5%', top: '15%', bottom: '10%', containLabel: true };
const COLOR_PALETTE = ['#3370FF', '#00B42A', '#FF7D00', '#F53F3F', '#722ED1', '#13C2C2', '#FAAD14', '#EB2F96', '#A0D911', '#2F54EB'];

// ==================== 1. 堆叠面积图 (Top 10 趋势) ====================

function createStackedAreaOption(title, data, unit = '') {
  return {
    title: {
      text: title,
      textStyle: { fontSize: 14, fontWeight: 600, color: '#1F2329' },
      top: 0,
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      textStyle: { color: '#1F2329', fontSize: 12 },
      axisPointer: { type: 'line', lineStyle: { type: 'dashed' } },
      confine: true
    },
    legend: {
      data: data.series.map(s => s.name),
      bottom: 0,
      type: 'scroll',
      itemWidth: 10,
      itemHeight: 10
    },
    grid: { ...COMMON_GRID, top: '40px' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8F959E' }
    },
    yAxis: {
      type: 'value',
      name: unit,
      splitLine: { lineStyle: { type: 'dashed', color: '#E5E6EB' } },
      axisLabel: {
        formatter: (value) => {
          if (value >= 1000) return (value / 1000) + 'k';
          return value;
        },
        color: '#8F959E'
      }
    },
    color: COLOR_PALETTE,
    series: data.series.map(s => ({
      name: s.name,
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 0 },
      showSymbol: false,
      areaStyle: { opacity: 0.8 },
      emphasis: { focus: 'series' },
      data: s.data
    }))
  };
}

// ==================== 2. 四象限气泡图 ====================

function createQuadrantChartOption(data, xMedian, yMedian, config = {}) {
  const { xLog = false, yLog = false } = config;

  // 象限定义: 
  // 1: High Call, High Cost (High X, High Y) -> Red (Priority Optimize)
  // 2: Low Call, High Cost (Low X, High Y) -> Orange (Check)
  // 3: Low Call, Low Cost (Low X, Low Y) -> Grey (Long Tail)
  // 4: High Call, Low Cost (High X, Low Y) -> Green (Star)

  // 数据映射: [x, y, size, id, name, quadrant, rawItem]
  // x: callCount, y: avgCostPerCall, size: userCount

  // 辅助函数：确定象限颜色
  const getQuadrantColor = (quadrant) => {
    switch (quadrant) {
      case 1: return '#F53F3F'; // Red
      case 2: return '#FF7D00'; // Orange
      case 3: return '#86909C'; // Grey
      case 4: return '#00B42A'; // Green
      default: return '#3370FF';
    }
  };

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      formatter: (params) => {
        if (params.componentType !== 'series') return '';
        const [x, y, size, id, name, quadrant] = params.data;
        const qLabels = ['高频高耗', '低频高耗', '低频低耗', '高频低耗'];
        const qLabel = qLabels[quadrant - 1] || '';
        
        return `
          <div style="font-weight:600; margin-bottom:4px;">${name}</div>
          <div style="font-size:12px; color:#646A73; margin-bottom:6px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${getQuadrantColor(quadrant)};margin-right:4px;"></span>
            ${qLabel} (Q${quadrant})
          </div>
          <div style="font-size:12px; line-height:1.8;">
            <div>总对话轮次: <b>${Utils.formatNumber(x)}</b></div>
            <div>平均成本: <b>${Utils.formatCurrency(y)}</b></div>
            <div>活跃用户: <b>${Utils.formatNumber(size)}</b></div>
          </div>
        `;
      }
    },
    grid: { ...COMMON_GRID, top: '10%', right: '10%' },
    xAxis: {
      type: xLog ? 'log' : 'value',
      name: '总对话轮次 (Log)',
      nameLocation: 'middle',
      nameGap: 25,
      splitLine: { lineStyle: { type: 'dashed', color: '#E5E6EB' } },
      axisLabel: { color: '#8F959E' },
      scale: true // 避免从0开始，log轴必须 > 0
    },
    yAxis: {
      type: yLog ? 'log' : 'value',
      name: '平均单轮成本 (Log)',
      nameLocation: 'end',
      splitLine: { lineStyle: { type: 'dashed', color: '#E5E6EB' } },
      axisLabel: { formatter: (val) => `¥${val}`, color: '#8F959E' },
      scale: true
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data) => {
          // 简单线性映射 size (userCount) 到 10-60px
          // 实际应基于数据集最大最小值动态计算，这里简化处理
          const size = data[2]; 
          return Math.max(8, Math.min(60, Math.sqrt(size) * 5));
        },
        data: data, // [x, y, size, id, name, quadrant, rawItem]
        itemStyle: {
          color: (params) => getQuadrantColor(params.data[5]), // 使用 quadrant 字段着色
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          opacity: 0.8
        },
        emphasis: {
          focus: 'self',
          itemStyle: {
            borderColor: '#333',
            borderWidth: 2,
            opacity: 1
          }
        },
        markLine: {
          animation: false,
          silent: true,
          symbol: ['none', 'none'],
          label: { show: true, position: 'end', color: '#646A73', fontSize: 10 },
          lineStyle: { type: 'dashed', color: '#1F2329', width: 1, opacity: 0.6 },
          data: [
            { xAxis: xMedian, label: { formatter: `轮次中位数: ${Utils.formatNumber(xMedian)}` } },
            { yAxis: yMedian, label: { formatter: `成本中位数: ¥${yMedian}` } }
          ]
        }
      }
    ]
  };
}

// ==================== 3. 直方图 (核心指标分布) ====================

function createHistogramOption(data, metricName) {
  // data: [{ range: '0-10', count: 50 }, ...]
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      formatter: (params) => {
        const item = params[0];
        return `${metricName}区间: <b>${item.name}</b><br/>智能体数量: <b>${item.value}</b>`;
      }
    },
    grid: { ...COMMON_GRID, top: '10%' },
    xAxis: {
      type: 'category',
      data: data.map(d => d.range),
      axisLabel: { rotate: 30, color: '#8F959E', interval: 0 }
    },
    yAxis: {
      type: 'value',
      name: '智能体数量',
      splitLine: { lineStyle: { type: 'dashed', color: '#E5E6EB' } }
    },
    series: [{
      data: data.map(d => d.count),
      type: 'bar',
      barWidth: '60%',
      itemStyle: { color: '#3370FF', borderRadius: [4, 4, 0, 0] }
    }]
  };
}

window.ChartConfig = {
  createStackedAreaOption,
  createQuadrantChartOption,
  createHistogramOption
};

