/**
 * ECharts图表配置库
 * Charts Configuration Library
 * 包含所有图表的配置函数
 */

const Charts = {
  // 默认颜色方案
  colors: {
    primary: ['#409EFF', '#66b1ff', '#a0cfff', '#c6e2ff', '#d9ecff', '#ecf5ff'],
    gradient: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  },

  /**
   * 活跃度日历热力图
   * @param {Array} data - 数据 [{date, value}]
   * @returns {Object} ECharts配置
   */
  activityCalendar(data) {
    // 处理数据格式
    const calendarData = data.map(item => [item.date, item.value]);
    
    // 计算日期范围
    const dates = data.map(d => new Date(d.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    return {
      tooltip: {
        formatter: function(params) {
          return `${params.value[0]}<br/>活动次数: ${params.value[1]}`;
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map(d => d.value), 10),
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 0,
        pieces: [
          {min: 0, max: 0, label: '无活动', color: '#ebedf0'},
          {min: 1, max: 5, label: '1-5次', color: '#c6e48b'},
          {min: 6, max: 15, label: '6-15次', color: '#7bc96f'},
          {min: 16, max: 30, label: '16-30次', color: '#239a3b'},
          {min: 31, label: '30次以上', color: '#196127'}
        ]
      },
      calendar: {
        top: 80,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: [Utils.formatDate(minDate, 'YYYY-MM-DD'), Utils.formatDate(maxDate, 'YYYY-MM-DD')],
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#fff'
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: 'cn',
          fontSize: 12
        },
        dayLabel: {
          nameMap: 'cn',
          fontSize: 12
        }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarData
      }]
    };
  },

  /**
   * 堆叠面积图
   * @param {Array} xAxisData - X轴数据
   * @param {Array} series - 系列数据 [{name, data}]
   * @returns {Object} ECharts配置
   */
  stackedAreaChart(xAxisData, series) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value'
      },
      series: series.map((item, index) => ({
        name: item.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: this.colors.gradient[index % this.colors.gradient.length] + '80'
            }, {
              offset: 1,
              color: this.colors.gradient[index % this.colors.gradient.length] + '10'
            }]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: item.data,
        smooth: true,
        lineStyle: {
          width: 2
        },
        color: this.colors.gradient[index % this.colors.gradient.length]
      }))
    };
  },

  /**
   * 水平条形图（排行榜）
   * @param {Array} data - 数据 [{name, value}]
   * @param {string} unit - 单位
   * @returns {Object} ECharts配置
   */
  horizontalBarChart(data, unit = '') {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].value.toLocaleString()} ${unit}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            return Utils.abbreviateNumber(value);
          }
        }
      },
      yAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLabel: {
          fontSize: 12,
          overflow: 'truncate',
          width: 120
        }
      },
      series: [{
        type: 'bar',
        data: data.map(d => d.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: '#409EFF'
            }, {
              offset: 1,
              color: '#66b1ff'
            }]
          },
          borderRadius: [0, 4, 4, 0]
        },
        barMaxWidth: 30,
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            return Utils.abbreviateNumber(params.value);
          }
        }
      }]
    };
  },

  /**
   * 环形图（饼图）
   * @param {Array} data - 数据 [{name, value}]
   * @param {string} title - 中心标题
   * @returns {Object} ECharts配置
   */
  doughnutChart(data, title = '') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.name}<br/>${params.value.toLocaleString()} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        formatter: function(name) {
          const item = data.find(d => d.name === name);
          return `${name}: ${Utils.abbreviateNumber(item.value)}`;
        }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true
        },
        data: data,
        color: this.colors.gradient
      }]
    };
  },

  /**
   * 组合图（柱状图+折线图）
   * @param {Array} xAxisData - X轴数据
   * @param {Array} barSeries - 柱状图系列 [{name, data}]
   * @param {Array} lineSeries - 折线图系列 [{name, data}]
   * @returns {Object} ECharts配置
   */
  comboChart(xAxisData, barSeries, lineSeries) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: [...barSeries.map(s => s.name), ...lineSeries.map(s => s.name)],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: [
        {
          type: 'value',
          name: barSeries[0]?.unit || '',
          axisLabel: {
            formatter: function(value) {
              return Utils.abbreviateNumber(value);
            }
          }
        },
        {
          type: 'value',
          name: lineSeries[0]?.unit || '',
          axisLabel: {
            formatter: function(value) {
              return Utils.abbreviateNumber(value);
            }
          }
        }
      ],
      series: [
        ...barSeries.map((item, index) => ({
          name: item.name,
          type: 'bar',
          data: item.data,
          itemStyle: {
            color: this.colors.gradient[index % this.colors.gradient.length]
          }
        })),
        ...lineSeries.map((item, index) => ({
          name: item.name,
          type: 'line',
          yAxisIndex: 1,
          data: item.data,
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: this.colors.gradient[(barSeries.length + index) % this.colors.gradient.length]
          }
        }))
      ]
    };
  },

  /**
   * 分时段热力图
   * @param {Array} data - 数据 [{day, hour, value}]
   * @returns {Object} ECharts配置
   */
  timeHeatmap(data) {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    
    // 转换数据格式
    const heatmapData = data.map(item => [item.hour, item.day, item.value]);
    
    return {
      tooltip: {
        position: 'top',
        formatter: function(params) {
          return `${days[params.value[1]]} ${hours[params.value[0]]}<br/>使用时长: ${params.value[2]} 分钟`;
        }
      },
      grid: {
        height: '60%',
        top: '10%',
        left: '80px'
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: 1,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map(d => d.value), 100),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#f0f9ff', '#409EFF', '#1d4ed8']
        }
      },
      series: [{
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  },

  /**
   * 分组直方图
   * @param {Array} xAxisData - X轴数据（区间）
   * @param {Array} series - 系列数据 [{name, data}]
   * @returns {Object} ECharts配置
   */
  groupedHistogram(xAxisData, series) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        name: '会话次数'
      },
      series: series.map((item, index) => ({
        name: item.name,
        type: 'bar',
        data: item.data,
        itemStyle: {
          color: this.colors.gradient[index % this.colors.gradient.length]
        },
        barMaxWidth: 40
      }))
    };
  },

  /**
   * 折线图
   * @param {Array} xAxisData - X轴数据
   * @param {Array} series - 系列数据 [{name, data}]
   * @returns {Object} ECharts配置
   */
  lineChart(xAxisData, series) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            return Utils.abbreviateNumber(value);
          }
        }
      },
      series: series.map((item, index) => ({
        name: item.name,
        type: 'line',
        data: item.data,
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: this.colors.gradient[index % this.colors.gradient.length]
        },
        areaStyle: item.showArea ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: this.colors.gradient[index % this.colors.gradient.length] + '40'
            }, {
              offset: 1,
              color: this.colors.gradient[index % this.colors.gradient.length] + '00'
            }]
          }
        } : undefined
      }))
    };
  },

  /**
   * 柱状图
   * @param {Array} xAxisData - X轴数据
   * @param {Array} series - 系列数据 [{name, data}]
   * @param {boolean} stacked - 是否堆叠
   * @returns {Object} ECharts配置
   */
  barChart(xAxisData, series, stacked = false) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '60px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            return Utils.abbreviateNumber(value);
          }
        }
      },
      series: series.map((item, index) => ({
        name: item.name,
        type: 'bar',
        stack: stacked ? 'Total' : undefined,
        data: item.data,
        itemStyle: {
          color: this.colors.gradient[index % this.colors.gradient.length],
          borderRadius: stacked ? undefined : [4, 4, 0, 0]
        },
        barMaxWidth: 40
      }))
    };
  },

  /**
   * 饼图
   * @param {Array} data - 数据 [{name, value}]
   * @returns {Object} ECharts配置
   */
  pieChart(data) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.name}<br/>${params.value.toLocaleString()} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        formatter: function(name) {
          const item = data.find(d => d.name === name);
          return `${name}: ${Utils.abbreviateNumber(item.value)}`;
        }
      },
      series: [{
        type: 'pie',
        radius: '60%',
        center: ['60%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color: this.colors.gradient,
        label: {
          formatter: '{b}: {d}%'
        }
      }]
    };
  },

  /**
   * 仪表盘
   * @param {number} value - 值
   * @param {string} name - 名称
   * @param {number} max - 最大值
   * @returns {Object} ECharts配置
   */
  gaugeChart(value, name, max = 100) {
    return {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: max,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 12,
          distance: -60,
          rotate: 'tangential',
          formatter: function(value) {
            return Utils.abbreviateNumber(value);
          }
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 16
        },
        detail: {
          fontSize: 24,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function(value) {
            return Utils.formatNumber(value);
          },
          color: 'auto'
        },
        data: [{
          value: value,
          name: name
        }]
      }]
    };
  },

  /**
   * 雷达图
   * @param {Array} indicator - 指标 [{name, max}]
   * @param {Array} series - 系列数据 [{name, value}]
   * @returns {Object} ECharts配置
   */
  radarChart(indicator, series) {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0
      },
      radar: {
        indicator: indicator,
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#999'
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(64, 158, 255, 0.1)',
              'rgba(64, 158, 255, 0.2)',
              'rgba(64, 158, 255, 0.3)',
              'rgba(64, 158, 255, 0.4)',
              'rgba(64, 158, 255, 0.5)'
            ].reverse()
          }
        },
        splitArea: {
          show: false
        }
      },
      series: [{
        type: 'radar',
        data: series.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: this.colors.gradient[index % this.colors.gradient.length]
          },
          areaStyle: {
            color: this.colors.gradient[index % this.colors.gradient.length] + '30'
          }
        }))
      }]
    };
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.Charts = Charts;
}

