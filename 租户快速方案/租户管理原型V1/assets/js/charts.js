/**
 * ECharts 图表配置 - 租户管理原型
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

// ==================== 积分消耗趋势图（双折线） ====================
function createCreditsTrendChart(data) {
  return {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach(item => {
          html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
            <span style="font-weight: 600; margin-left: 20px;">${item.value.toLocaleString()} 点</span>
          </div>`;
        });
        return html;
      },
    },
    legend: {
      ...commonChartOptions.legend,
      data: ['Token消耗', '设备使用抵扣'],
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
      name: '积分',
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
    series: [
      {
        name: 'Token消耗',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value1),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '设备使用抵扣',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value2),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
    ],
  };
}

// ==================== 积分消耗构成（环形图） ====================
function createCreditsCompositionChart(tokenValue, deviceValue) {
  const total = tokenValue + deviceValue;
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
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>积分: <span style="font-weight: 600;">${params.value.toLocaleString()} 点</span></div>
                <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#4E5969',
        fontSize: 13,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: tokenValue, name: 'Token消耗' },
          { value: deviceValue, name: '设备使用抵扣' },
        ],
      },
    ],
  };
}

// ==================== 按模型积分消耗排行（条形图） ====================
function createModelRankingChart(data) {
  return {
    color: ['#3370FF'],
    grid: {
      left: '20%',
      right: '10%',
      top: '3%',
      bottom: '3%',
      containLabel: false,
    },
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
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].name}</div>
                <div>积分消耗: <span style="font-weight: 600;">${params[0].value.toLocaleString()} 点</span></div>`;
      },
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
      data: data.map(d => d.name),
      axisLine: {
        lineStyle: { color: '#E5E6EB' },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#4E5969',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map(d => d.value),
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#1F5ADB',
          },
        },
      },
    ],
  };
}

// ==================== 按设备积分消耗分布（饼图） ====================
function createDeviceDistributionChart(desktopValue, mobileValue) {
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
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>积分: <span style="font-weight: 600;">${params.value.toLocaleString()} 点</span></div>
                <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#4E5969',
        fontSize: 13,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['35%', '50%'],
        data: [
          { value: desktopValue, name: '云电脑抵扣积分' },
          { value: mobileValue, name: '云手机抵扣积分' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 13,
          color: '#4E5969',
        },
      },
    ],
  };
}

// ==================== Token消耗趋势图（双折线） ====================
function createTokenTrendChart(data) {
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
      data: ['输入Token', '输出Token'],
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
      name: 'Token数量',
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
        name: '输入Token',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value1),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '输出Token',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value2),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
    ],
  };
}

// ==================== 输入/输出Token构成（饼图） ====================
function createTokenCompositionChart(inputValue, outputValue) {
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
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>数量: <span style="font-weight: 600;">${params.value.toLocaleString()}</span></div>
                <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#4E5969',
        fontSize: 13,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['35%', '50%'],
        data: [
          { value: inputValue, name: '输入Token' },
          { value: outputValue, name: '输出Token' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 13,
          color: '#4E5969',
        },
      },
    ],
  };
}

// ==================== 设备使用时长趋势图（双折线） ====================
function createDeviceTrendChart(data) {
  return {
    ...commonChartOptions,
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
        params.forEach(item => {
          html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>${item.seriesName}</span>
            <span style="font-weight: 600; margin-left: 20px;">${item.value.toLocaleString()} 分钟</span>
          </div>`;
        });
        return html;
      },
    },
    legend: {
      ...commonChartOptions.legend,
      data: ['云电脑', '云手机'],
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
      name: '使用时长(分钟)',
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
        name: '云电脑',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value1),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
      {
        name: '云手机',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: data.map(d => d.value2),
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.1,
        },
      },
    ],
  };
}

// ==================== 使用与抵扣趋势（组合图） ====================
function createUsageDeductionChart(data) {
  return {
    color: ['#3370FF', '#00B42A'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
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
    legend: {
      top: 0,
      left: 'center',
      data: ['总使用时长', '积分抵扣时长'],
      textStyle: {
        color: '#4E5969',
        fontSize: 13,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
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
        name: '使用时长(分钟)',
        position: 'left',
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
    ],
    series: [
      {
        name: '总使用时长',
        type: 'bar',
        data: data.map(d => d.value1),
        barWidth: 16,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: '积分抵扣时长',
        type: 'line',
        smooth: true,
        data: data.map(d => d.value2),
        lineStyle: {
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };
}

// ==================== 设备使用时长构成（饼图） ====================
function createDeviceCompositionChart(desktopValue, mobileValue) {
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
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>时长: <span style="font-weight: 600;">${params.value.toLocaleString()} 分钟</span></div>
                <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#4E5969',
        fontSize: 13,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['35%', '50%'],
        data: [
          { value: desktopValue, name: '云电脑' },
          { value: mobileValue, name: '云手机' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 13,
          color: '#4E5969',
        },
      },
    ],
  };
}

// ==================== 按模型Token消耗排行 ====================
function createModelTokenRankingChart(data) {
  return {
    color: ['#3370FF'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
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
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#4E5969',
        fontSize: 12,
        formatter: function(value) {
          return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : 
                 value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value;
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E5E6EB',
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
      data: data.map(item => item.name),
      axisLabel: {
        color: '#4E5969',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#E5E6EB',
        },
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.value),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#4E5969',
          fontSize: 12,
          formatter: function(params) {
            return params.value >= 1000000 ? (params.value / 1000000).toFixed(1) + 'M' : 
                   params.value >= 1000 ? (params.value / 1000).toFixed(1) + 'K' : params.value;
          },
        },
      },
    ],
  };
}

// ==================== 按资产Token消耗分析 ====================
function createAssetTokenRankingChart(data) {
  return {
    color: ['#3370FF'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
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
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#4E5969',
        fontSize: 12,
        formatter: function(value) {
          return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : 
                 value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value;
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E5E6EB',
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
      data: data.map(item => item.name),
      axisLabel: {
        color: '#4E5969',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#E5E6EB',
        },
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.value),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#4E5969',
          fontSize: 12,
          formatter: function(params) {
            return params.value >= 1000000 ? (params.value / 1000000).toFixed(1) + 'M' : 
                   params.value >= 1000 ? (params.value / 1000).toFixed(1) + 'K' : params.value;
          },
        },
      },
    ],
  };
}

// 导出图表配置函数
window.ChartConfigs = {
  createCreditsTrendChart,
  createCreditsCompositionChart,
  createModelRankingChart,
  createDeviceDistributionChart,
  createTokenTrendChart,
  createTokenCompositionChart,
  createModelTokenRankingChart,
  createAssetTokenRankingChart,
  createDeviceTrendChart,
  createUsageDeductionChart,
  createDeviceCompositionChart,
};

