/**
 * ECharts 图表配置 - 平台运营报表原型
 */

// 通用图表配置
const commonChartOptions = {
  color: ['#3370FF', '#00B42A', '#FF7D00', '#F53F3F', '#7816FF', '#00B8D4', '#F7BA1E', '#F76965'],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#E5E6EB',
    borderWidth: 1,
    textStyle: {
      color: '#1D2129',
      fontSize: 13,
    },
    padding: [8, 12],
    extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
  },
  legend: {
    top: 0,
    left: 'center',
    textStyle: {
      color: '#4E5969',
      fontSize: 13,
    },
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 20,
  },
};

// ==================== 成本趋势组合图 ====================
function createCostTrendChart(data) {
  return {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach(item => {
          if (item.seriesName.includes('Token')) {
            html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
              <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
              <span style="font-weight: 600; margin-left: 20px;">${Utils.formatToken(item.value)}</span>
            </div>`;
          } else {
            html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
              <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
              <span style="font-weight: 600; margin-left: 20px;">${Utils.formatCurrency(item.value)}</span>
            </div>`;
          }
        });
        return html;
      },
    },
    legend: {
      ...commonChartOptions.legend,
      data: ['输入Token', '输出Token', '成本'],
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Token',
        nameTextStyle: {
          color: '#86909C',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12,
          formatter: function(value) {
            return Utils.formatToken(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: '#F2F3F5',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        name: '成本(元)',
        nameTextStyle: {
          color: '#86909C',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12,
          formatter: function(value) {
            return Utils.formatCurrency(value);
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '输入Token',
        type: 'bar',
        stack: 'tokens',
        data: data.map(d => d.inputTokens),
        itemStyle: {
          color: '#3370FF',
        },
      },
      {
        name: '输出Token',
        type: 'bar',
        stack: 'tokens',
        data: data.map(d => d.outputTokens),
        itemStyle: {
          color: '#00B42A',
        },
      },
      {
        name: '成本',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.cost),
        lineStyle: {
          width: 3,
          color: '#F53F3F',
        },
        itemStyle: {
          color: '#F53F3F',
        },
      },
    ],
  };
}

// ==================== Top排行条形图 ====================
function createTopRankingChart(data, title, valueFormatter) {
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 20);
  
  return {
    color: ['#3370FF'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
      formatter: function(params) {
        const param = params[0];
        return `<div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
                <div>${title}: <span style="font-weight: 600;">${valueFormatter ? valueFormatter(param.value) : param.value.toLocaleString()}</span></div>`;
      },
    },
    grid: {
      left: '25%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: valueFormatter || function(value) {
          return value.toLocaleString();
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map(d => d.value),
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          formatter: valueFormatter || function(value) {
            return value.toLocaleString();
          },
          color: '#4E5969',
          fontSize: 12,
        },
      },
    ],
  };
}

// ==================== 使用趋势折线图 ====================
function createUsageTrendChart(data, seriesNames) {
  return {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach(item => {
          html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
            <span style="font-weight: 600; margin-left: 20px;">${item.value.toLocaleString()}</span>
          </div>`;
        });
        return html;
      },
    },
    legend: {
      ...commonChartOptions.legend,
      data: seriesNames,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: '次数',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: seriesNames.map((name, index) => ({
      name: name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: data.map(d => d[`value${index + 1}`] || d.value),
      lineStyle: {
        width: 3,
      },
      areaStyle: {
        opacity: 0.1,
      },
    })),
  };
}

// ==================== 成功率条形图 ====================
function createSuccessRateChart(data) {
  const sortedData = [...data].sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate)).slice(0, 20);
  
  return {
    color: ['#00B42A'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
      formatter: function(params) {
        const param = params[0];
        const item = sortedData[param.dataIndex];
        return `<div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
                <div>成功率: <span style="font-weight: 600;">${item.successRate}%</span></div>
                <div>调用次数: <span style="font-weight: 600;">${item.callCount || item.runCount}次</span></div>`;
      },
    },
    grid: {
      left: '25%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      name: '成功率(%)',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map(d => parseFloat(d.successRate)),
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: '#4E5969',
          fontSize: 12,
        },
      },
    ],
  };
}

// ==================== 分布直方图 ====================
function createDistributionChart(data, bins) {
  const histogram = new Array(bins.length - 1).fill(0);
  
  data.forEach(value => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (value >= bins[i] && value < bins[i + 1]) {
        histogram[i]++;
        break;
      }
    }
  });
  
  const labels = [];
  for (let i = 0; i < bins.length - 1; i++) {
    labels.push(`${bins[i]}-${bins[i + 1]}`);
  }
  
  return {
    color: ['#3370FF'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '用户数',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'bar',
        data: histogram,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };
}

// ==================== 散点图 ====================
function createScatterChart(data, xLabel, yLabel) {
  return {
    color: ['#3370FF'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
      formatter: function(params) {
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.data.name || params.name}</div>
                <div>${xLabel}: <span style="font-weight: 600;">${params.value[0].toLocaleString()}</span></div>
                <div>${yLabel}: <span style="font-weight: 600;">${params.value[1].toLocaleString()}</span></div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: xLabel,
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: yLabel,
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'scatter',
        data: data,
        symbolSize: function(data) {
          return Math.sqrt(data[2]) / 10;
        },
      },
    ],
  };
}

// ==================== 箱线图 ====================
function createBoxPlotChart(data) {
  const categories = data.map(d => d.name);
  const boxData = data.map(d => {
    const values = d.values;
    values.sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const q2 = values[Math.floor(values.length * 0.5)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const min = values[0];
    const max = values[values.length - 1];
    return [min, q1, q2, q3, max];
  });
  
  return {
    color: ['#3370FF'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
    },
    grid: {
      left: '10%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '响应时间(ms)',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '响应时间',
        type: 'boxplot',
        data: boxData,
        itemStyle: {
          color: '#3370FF',
          borderColor: '#1F5ADB',
        },
      },
    ],
  };
}

// ==================== 堆叠柱状图 ====================
function createStackedBarChart(data, seriesNames) {
  return {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
    },
    legend: {
      ...commonChartOptions.legend,
      data: seriesNames,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '次数',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: seriesNames.map((name, index) => ({
      name: name,
      type: 'bar',
      stack: 'total',
      data: data.map(d => d[`value${index + 1}`] || 0),
    })),
  };
}

// ==================== 堆叠面积图（Top10趋势） ====================
function createStackedAreaChart(timeSeriesData, yAxisName, valueFormatter) {
  const colors = ['#3370FF', '#00B42A', '#FF7D00', '#F53F3F', '#7816FF', '#00B8D4', '#F7BA1E', '#F76965', '#52C41A', '#FA8C16'];
  
  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        let total = 0;
        params.forEach(item => {
          total += item.value;
          html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
            <span style="font-weight: 600; margin-left: 20px;">${valueFormatter ? valueFormatter(item.value) : Utils.formatNumber(item.value)}</span>
          </div>`;
        });
        html += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E6EB; font-weight: 600;">总计: ${valueFormatter ? valueFormatter(total) : Utils.formatNumber(total)}</div>`;
        return html;
      },
    },
    legend: {
      top: 0,
      left: 'center',
      textStyle: {
        color: '#4E5969',
        fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      type: 'scroll',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeSeriesData.dates,
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: valueFormatter || function(value) {
          return Utils.formatNumber(value);
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: timeSeriesData.series.map((series, index) => ({
      name: series.name.length > 20 ? series.name.substring(0, 20) + '...' : series.name,
      type: 'line',
      stack: 'total',
      areaStyle: {
        opacity: 0.6,
      },
      smooth: true,
      data: series.data,
      emphasis: {
        focus: 'series',
      },
    })),
  };
}

// ==================== 气泡图（四象限图）- 使用ECharts visualMap组件控制大小和颜色 ====================
function createBubbleChart(data, xLabel, yLabel, useLogScaleX = false, useLogScaleY = false, config = {}) {
  // 数据格式: [{name, x, y, size, cost, sizeField, colorField, ...}]
  // config: { sizeRange: [min, max], opacityRange: [min, max], sizeField, colorField }
  
  const sizeRangeConfig = config.sizeRange || [15, 70];
  const opacityRangeConfig = config.opacityRange || [0.4, 1.0];
  const sizeField = config.sizeField || 'size';
  const colorField = config.colorField || 'cost';
  
  // 计算气泡大小的数据范围
  const sizeValues = data.map(d => d[sizeField] || 0);
  const maxSize = Math.max(...sizeValues);
  const minSize = Math.min(...sizeValues);
  
  // 计算颜色深浅的数据范围
  const colorValues = data.map(d => d[colorField] || 0);
  const maxColorValue = Math.max(...colorValues);
  const minColorValue = Math.min(...colorValues);
  
  // 获取字段标签
  const getFieldLabel = (field) => {
    const labels = {
      'userCount': '活跃用户数',
      'cost': '总费用',
      'callCount': '调用次数',
      'tokens': 'Token消耗',
      'size': '活跃用户数'
    };
    return labels[field] || field;
  };
  
  // 计算四象限分界线（中位数）
  const sortedX = [...data.map(d => d.x)].sort((a, b) => a - b);
  const sortedY = [...data.map(d => d.y)].sort((a, b) => a - b);
  const medianX = sortedX[Math.floor(sortedX.length / 2)];
  const medianY = sortedY[Math.floor(sortedY.length / 2)];
  
  // 准备数据：格式为 [x, y, sizeValue, colorValue, name, cost, id, quadrant, ...]
  const chartData = data.map(d => {
    const sizeValue = d[sizeField] || 0;
    const colorValue = d[colorField] || 0;
    const quadrant = d.x >= medianX && d.y >= medianY ? 1 : 
                     d.x < medianX && d.y >= medianY ? 2 :
                     d.x < medianX && d.y < medianY ? 3 : 4;
    
    return [
      d.x,           // 0: x坐标
      d.y,           // 1: y坐标
      sizeValue,     // 2: 气泡大小值（visualMap dimension: 2）
      colorValue,    // 3: 颜色深浅值（visualMap dimension: 3）
      d.name,        // 4: 名称
      d.cost,        // 5: 费用
      d.id,          // 6: ID
      quadrant       // 7: 象限
    ];
  });
  
  // 象限标签映射
  const quadrantLabels = {
    1: '第一象限（高调用+高成本）',
    2: '第二象限（低调用+高成本）',
    3: '第三象限（低调用+低成本）',
    4: '第四象限（高调用+低成本）⭐'
  };
  
  const quadrantTips = {
    1: '这是"核心应用"，高调用高成本，需要关注效率',
    2: '这是"成本黑洞"，低调用但高成本，需要优化',
    3: '这是"潜力应用"，低调用低成本，可以尝试推广',
    4: '这是"明星应用"，高调用但低成本，值得推广'
  };
  
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-radius: 8px;',
      formatter: function(params) {
        const value = params.value; // [x, y, sizeValue, colorValue, name, cost, id, quadrant]
        const name = value[4];
        const cost = value[5];
        const quadrant = value[7];
        const sizeValue = value[2];
        const colorValue = value[3];
        
        return `<div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #1F2329;">${name}</div>
                <div style="padding: 6px 10px; background: #F7F8FA; border-radius: 4px; margin-bottom: 8px; font-size: 12px; color: #646A73;">
                  ${quadrantLabels[quadrant]}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                  <div><span style="color: #86909C;">${xLabel}:</span> <span style="font-weight: 600; color: #1F2329;">${Utils.formatNumber(value[0])}</span></div>
                  <div><span style="color: #86909C;">${yLabel}:</span> <span style="font-weight: 600; color: #1F2329;">${Utils.formatCurrency(value[1])}</span></div>
                  <div><span style="color: #86909C;">气泡大小(${getFieldLabel(sizeField)}):</span> <span style="font-weight: 600; color: #1F2329;">${Utils.formatNumber(sizeValue)}</span></div>
                  <div><span style="color: #86909C;">颜色深浅(${getFieldLabel(colorField)}):</span> <span style="font-weight: 600; color: #1F2329;">${colorField === 'cost' ? Utils.formatCurrency(colorValue) : Utils.formatNumber(colorValue)}</span></div>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E6EB; font-size: 12px; color: #86909C;">
                  💡 提示: ${quadrantTips[quadrant]}
                </div>`;
      },
    },
    legend: {
      show: true,
      bottom: 10,
      data: [
        { name: '第一象限: 高调用+高成本', itemStyle: { color: '#F53F3F' } },
        { name: '第二象限: 低调用+高成本', itemStyle: { color: '#FF7D00' } },
        { name: '第三象限: 低调用+低成本', itemStyle: { color: '#86909C' } },
        { name: '第四象限: 高调用+低成本 ⭐', itemStyle: { color: '#00B42A' } }
      ],
      textStyle: {
        fontSize: 12,
        color: '#646A73'
      },
      itemGap: 20
    },
    grid: {
      left: '12%',
      right: '150px', // 为visualMap留出空间
      bottom: '15%',
      top: '8%',
      containLabel: true,
    },
    xAxis: {
      type: useLogScaleX ? 'log' : 'value',
      name: xLabel,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#646A73',
        fontSize: 13,
        fontWeight: 500,
      },
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: function(value) {
          return Utils.formatNumber(value);
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
          width: 1,
        },
      },
      // 添加中位线
      markLine: {
        silent: true,
        lineStyle: {
          color: '#86909C',
          type: 'dashed',
          width: 1,
        },
        label: {
          show: true,
          position: 'end',
          formatter: '中位数',
          fontSize: 11,
          color: '#86909C',
        },
        data: [{
          xAxis: medianX,
        }],
      },
    },
    yAxis: {
      type: useLogScaleY ? 'log' : 'value',
      name: yLabel,
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        color: '#646A73',
        fontSize: 13,
        fontWeight: 500,
      },
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: function(value) {
          return Utils.formatCurrency(value);
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
          width: 1,
        },
      },
      // 添加中位线
      markLine: {
        silent: true,
        lineStyle: {
          color: '#86909C',
          type: 'dashed',
          width: 1,
        },
        label: {
          show: true,
          position: 'end',
          formatter: '中位数',
          fontSize: 11,
          color: '#86909C',
        },
        data: [{
          yAxis: medianY,
        }],
      },
    },
    // 使用visualMap组件控制气泡大小和颜色深浅
    visualMap: [
      {
        // 控制气泡大小
        left: 'right',
        top: '10%',
        dimension: 2, // 使用数据第3个维度（索引2）控制大小
        min: minSize,
        max: maxSize,
        itemWidth: 30,
        itemHeight: 120,
        calculable: true,
        precision: 0.1,
        text: [`圆形大小：${getFieldLabel(sizeField)}`],
        textGap: 30,
        textStyle: {
          fontSize: 12,
          color: '#646A73'
        },
        inRange: {
          symbolSize: sizeRangeConfig
        },
        outOfRange: {
          symbolSize: sizeRangeConfig,
          color: ['rgba(255,255,255,0.4)']
        },
        controller: {
          inRange: {
            color: ['#3370FF']
          },
          outOfRange: {
            color: ['#999']
          }
        }
      },
      {
        // 控制颜色深浅（透明度）
        left: 'right',
        bottom: '5%',
        dimension: 3, // 使用数据第4个维度（索引3）控制颜色深浅
        min: minColorValue,
        max: maxColorValue,
        itemHeight: 120,
        text: [`明暗：${getFieldLabel(colorField)}`],
        textGap: 30,
        textStyle: {
          fontSize: 12,
          color: '#646A73'
        },
        inRange: {
          // 使用colorAlpha控制透明度，范围从最浅到最深
          colorAlpha: [opacityRangeConfig[0], opacityRangeConfig[1]]
        },
        outOfRange: {
          colorAlpha: [0.2],
          color: ['rgba(255,255,255,0.4)']
        },
        controller: {
          inRange: {
            color: ['#3370FF']
          },
          outOfRange: {
            color: ['#999']
          }
        }
      }
    ],
    series: [{
      type: 'scatter',
      name: '智能体',
      data: chartData,
      // 根据象限设置基础颜色
      // visualMap会自动应用透明度，所以这里只设置基础颜色
      itemStyle: {
        color: function(params) {
          const quadrant = params.value[7]; // 象限值
          const colors = {
            1: '#F53F3F',   // 第一象限
            2: '#FF7D00',   // 第二象限
            3: '#86909C',   // 第三象限
            4: '#00B42A'    // 第四象限
          };
          return colors[quadrant] || '#3370FF';
        },
        borderColor: function(params) {
          const quadrant = params.value[7];
          const colors = {
            1: '#F53F3F',
            2: '#FF7D00',
            3: '#86909C',
            4: '#00B42A'
          };
          return colors[quadrant] || '#3370FF';
        },
        borderWidth: 2,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.3)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 3,
        },
        scale: true,
      },
      label: {
        show: false,
        formatter: function(params) {
          const name = params.value[4];
          return name.length > 10 ? name.substring(0, 10) + '...' : name;
        },
        fontSize: 11,
        color: '#1F2329',
        fontWeight: 500,
      },
    }],
  };
}

// ==================== 动态分桶直方图（ECharts Bar图表） ====================
function createDynamicHistogram(data, metricLabel) {
  if (!data || data.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'middle',
        textStyle: { color: '#86909C', fontSize: 14 }
      }
    };
  }
  
  // 使用Freedman-Diaconis规则计算最优分桶数
  const sortedData = [...data].filter(v => v > 0).sort((a, b) => a - b);
  if (sortedData.length === 0) {
    return {
      title: {
        text: '暂无有效数据',
        left: 'center',
        top: 'middle',
        textStyle: { color: '#86909C', fontSize: 14 }
      }
    };
  }
  
  const q1 = sortedData[Math.floor(sortedData.length * 0.25)];
  const q3 = sortedData[Math.floor(sortedData.length * 0.75)];
  const iqr = q3 - q1 || 1;
  const binWidth = 2 * iqr / Math.pow(sortedData.length, 1/3);
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];
  const numBins = Math.max(5, Math.min(25, Math.ceil((max - min) / binWidth) || 10));
  
  // 创建分桶
  const binSize = (max - min) / numBins;
  const bins = [];
  const labels = [];
  
  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binSize;
    const binEnd = min + (i + 1) * binSize;
    bins.push({ start: binStart, end: binEnd, count: 0, agents: [] });
    
    // 格式化标签
    const formatValue = (val) => {
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
      if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
      return val.toFixed(0);
    };
    labels.push(`${formatValue(binStart)}-${formatValue(binEnd)}`);
  }
  
  // 统计每个桶的数量
  sortedData.forEach((value, index) => {
    for (let i = 0; i < bins.length; i++) {
      if (value >= bins[i].start && (i === bins.length - 1 ? value <= bins[i].end : value < bins[i].end)) {
        bins[i].count++;
        break;
      }
    }
  });
  
  // 计算统计信息
  const total = sortedData.length;
  const mean = sortedData.reduce((a, b) => a + b, 0) / total;
  const median = sortedData[Math.floor(total / 2)];
  const maxCount = Math.max(...bins.map(b => b.count));
  const maxBin = bins.find(b => b.count === maxCount);
  
  return {
    color: ['#3370FF'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); border-radius: 8px;',
      formatter: function(params) {
        const param = params[0];
        const binIndex = param.dataIndex;
        const bin = bins[binIndex];
        const percentage = ((bin.count / total) * 100).toFixed(1);
        
        return `<div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #1F2329;">${metricLabel}分布</div>
                <div style="padding: 8px 12px; background: #F7F8FA; border-radius: 4px; margin-bottom: 8px;">
                  <div style="font-size: 13px; margin-bottom: 4px;"><span style="color: #86909C;">区间:</span> <span style="font-weight: 600; color: #1F2329;">${Utils.formatNumber(Math.floor(bin.start))} - ${Utils.formatNumber(Math.floor(bin.end))}</span></div>
                  <div style="font-size: 13px;"><span style="color: #86909C;">智能体数量:</span> <span style="font-weight: 600; color: #3370FF; font-size: 16px;">${bin.count}个</span> <span style="color: #86909C;">(${percentage}%)</span></div>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E6EB; font-size: 12px; color: #86909C;">
                  💡 此区间包含 ${percentage}% 的智能体，${bin.count === maxCount ? '是分布最集中的区间' : '分布正常'}
                </div>`;
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 11,
        rotate: 45,
        margin: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: '智能体数量(个)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        color: '#646A73',
        fontSize: 13,
        fontWeight: 500,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
          width: 1,
        },
      },
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 20,
        style: {
          text: `📊 分布统计: 平均值 ${Utils.formatNumber(Math.floor(mean))} | 中位数 ${Utils.formatNumber(Math.floor(median))} | 最多区间 ${Utils.formatNumber(Math.floor(maxBin.start))}-${Utils.formatNumber(Math.floor(maxBin.end))}`,
          fontSize: 12,
          fill: '#86909C',
          fontWeight: 500,
        },
      },
    ],
    series: [{
      type: 'bar',
      name: '智能体数量',
      data: bins.map(b => ({
        value: b.count,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3370FF' },
              { offset: 1, color: '#ADC6FF' }
            ],
          },
          borderRadius: [6, 6, 0, 0],
        },
      })),
      label: {
        show: true,
        position: 'top',
        formatter: function(params) {
          return params.value > 0 ? params.value : '';
        },
        fontSize: 11,
        color: '#646A73',
        fontWeight: 500,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(51, 112, 255, 0.3)',
        },
      },
    }],
  };
}

// ==================== 箱线图（支持对数尺度） ====================
function createAgentBoxPlotChart(data, useLogScale = false) {
  // data格式: [{group: '官方', values: [1,2,3,...]}, {group: '用户创建', values: [4,5,6,...]}]
  const categories = data.map(d => d.group);
  
  // 计算箱线图数据
  const boxData = data.map(d => {
    const values = [...d.values].filter(v => v > 0).sort((a, b) => a - b);
    if (values.length === 0) {
      return {
        box: [0, 0, 0, 0, 0],
        outliers: [],
        group: d.group,
        agentInfo: []
      };
    }
    
    const q1 = values[Math.floor(values.length * 0.25)];
    const q2 = values[Math.floor(values.length * 0.5)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const min = values[0];
    const max = values[values.length - 1];
    
    // 计算异常值
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = values.filter(v => v < lowerBound || v > upperBound);
    
    return {
      box: [min, q1, q2, q3, max],
      outliers: outliers,
      group: d.group,
      agentInfo: d.agentInfo || [] // 异常值对应的智能体信息
    };
  });
  
  return {
    color: ['#3370FF', '#00B42A'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E6EB',
      borderWidth: 1,
      textStyle: {
        color: '#1D2129',
        fontSize: 13,
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); border-radius: 4px;',
      formatter: function(params) {
        if (params.seriesType === 'scatter') {
          // 异常值
          const outlierData = params.data;
          return `<div style="font-weight: 600; margin-bottom: 4px;">异常值</div>
                  <div>${outlierData.group}: <span style="font-weight: 600;">${Utils.formatNumber(outlierData.value)}</span></div>
                  ${outlierData.agentName ? `<div>智能体: ${outlierData.agentName}</div>` : ''}`;
        } else {
          // 箱线图
          const box = boxData[params.dataIndex];
          return `<div style="font-weight: 600; margin-bottom: 4px;">${box.group}</div>
                  <div>最小值: <span style="font-weight: 600;">${Utils.formatNumber(box.box[0])}</span></div>
                  <div>Q1: <span style="font-weight: 600;">${Utils.formatNumber(box.box[1])}</span></div>
                  <div>中位数: <span style="font-weight: 600;">${Utils.formatNumber(box.box[2])}</span></div>
                  <div>Q3: <span style="font-weight: 600;">${Utils.formatNumber(box.box[3])}</span></div>
                  <div>最大值: <span style="font-weight: 600;">${Utils.formatNumber(box.box[4])}</span></div>`;
        }
      },
    },
    grid: {
      left: '10%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
      },
    },
    yAxis: {
      type: useLogScale ? 'log' : 'value',
      name: '数值',
      nameTextStyle: {
        color: '#86909C',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#86909C',
        fontSize: 12,
        formatter: function(value) {
          return Utils.formatNumber(value);
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '箱线图',
        type: 'boxplot',
        data: boxData.map(b => b.box),
        itemStyle: {
          color: '#3370FF',
          borderColor: '#1F5ADB',
        },
      },
      {
        name: '异常值',
        type: 'scatter',
        data: boxData.flatMap((box, index) => 
          box.outliers.map(outlier => {
            const agentInfo = box.agentInfo.find(info => {
              const diff = Math.abs(info.value - outlier);
              const tolerance = Math.max(Math.abs(outlier) * 0.01, 0.0001);
              return diff < tolerance;
            });
            return {
              value: [index, outlier],
              group: box.group,
              agentName: agentInfo?.name
            };
          })
        ),
        symbolSize: 8,
        itemStyle: {
          color: '#F53F3F',
        },
      },
    ],
  };
}

// 导出图表函数
window.ChartConfig = {
  createCostTrendChart,
  createTopRankingChart,
  createUsageTrendChart,
  createSuccessRateChart,
  createDistributionChart,
  createScatterChart,
  createBoxPlotChart: createBoxPlotChart,
  createStackedBarChart,
  createStackedAreaChart,
  createBubbleChart,
  createDynamicHistogram,
  createAgentBoxPlotChart: createAgentBoxPlotChart,
};


