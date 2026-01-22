/**
 * ECharts图表配置 - Charts Configuration
 * 飞书风格的图表主题和配置
 */

const ChartConfig = {
  // 飞书配色方案
  colors: [
    '#3370FF', '#00B42A', '#FF7D00', '#F53F3F', 
    '#7816FF', '#00B8D9', '#36CFC9', '#F7BA1E',
    '#FF77A9', '#9FDB1D', '#165DFF', '#14C9C9'
  ],

  // 通用配置
  getCommonConfig() {
    return {
      color: this.colors,
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        fontSize: 13
      },
      animation: true,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    };
  },

  // Grid通用配置
  getGridConfig() {
    return {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    };
  },

  /**
   * 面积图 - 积分消耗趋势
   */
  getPointsTrendChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          const param = params[0];
          return `${param.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color}"></span>
                  积分消耗: <strong>${Utils.formatNumber(param.value)}</strong> 点`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date),
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#8F959E'
        }
      },
      yAxis: {
        type: 'value',
        name: '积分 (点)',
        nameTextStyle: {
          color: '#646A73',
          padding: [0, 0, 0, -10]
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F2F3F5', type: 'dashed' }
        },
        axisLabel: {
          color: '#8F959E',
          formatter: (value) => Utils.formatLargeNumber(value)
        }
      },
      grid: this.getGridConfig(),
      series: [{
        name: '积分消耗',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(51, 112, 255, 0.3)' },
              { offset: 1, color: 'rgba(51, 112, 255, 0.05)' }
            ]
          }
        },
        lineStyle: {
          width: 2,
          color: '#3370FF'
        },
        itemStyle: {
          color: '#3370FF',
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          scale: true,
          focus: 'series'
        },
        data: data.map(d => d.value)
      }]
    };
  },

  /**
   * 双折线 - 积分消耗趋势（Token积分 vs 设备积分）
   */
  getPointsBreakdownTrendChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: { color: '#1F2329' }
      },
      legend: {
        data: ['Token积分', '设备积分'],
        top: '0%',
        right: '5%',
        itemGap: 20,
        textStyle: { color: '#646A73', fontSize: 13 }
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date),
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisLabel: { color: '#8F959E' }
      },
      yAxis: {
        type: 'value',
        name: '积分 (点)',
        nameTextStyle: { color: '#646A73', padding: [0,0,0,-10] },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } },
        axisLabel: { color: '#8F959E' }
      },
      grid: this.getGridConfig(),
      series: [
        {
          name: 'Token积分',
          type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          lineStyle: { width: 2, color: '#3370FF' },
          itemStyle: { color: '#3370FF', borderWidth: 2, borderColor: '#fff' },
          data: data.map(d => d.tokenPoints)
        },
        {
          name: '设备积分',
          type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
          lineStyle: { width: 2, color: '#00B42A' },
          itemStyle: { color: '#00B42A', borderWidth: 2, borderColor: '#fff' },
          data: data.map(d => d.devicePoints)
        }
      ]
    };
  },

  /**
   * 环形图 - 积分消耗构成
   */
  getPointsCompositionChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          return `${params.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${params.color}"></span>
                  积分: <strong>${Utils.formatNumber(params.value)}</strong> 点<br/>
                  占比: <strong>${params.percent}%</strong>`;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: '0%',
        left: 'center',
        itemGap: 20,
        textStyle: {
          color: '#646A73',
          fontSize: 13
        }
      },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#646A73',
          fontSize: 12
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          lineStyle: {
            color: '#C9CDD4'
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: data
      }]
    };
  },

  /**
   * 水平条形图 - 按模型积分消耗排行
   */
  getModelRankingChart(data) {
    const top20 = data.slice(0, 20);
    
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          const param = params[0];
          return `${param.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:2px;width:10px;height:10px;background-color:${param.color}"></span>
                  积分消耗: <strong>${Utils.formatNumber(param.value)}</strong> 点`;
        }
      },
      grid: {
        left: '15%',
        right: '10%',
        top: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F2F3F5', type: 'dashed' }
        },
        axisLabel: {
          color: '#8F959E',
          formatter: (value) => Utils.formatLargeNumber(value)
        }
      },
      yAxis: {
        type: 'category',
        data: top20.map(d => d.name).reverse(),
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#646A73',
          fontSize: 12
        }
      },
      series: [{
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#6C97FF' },
              { offset: 1, color: '#3370FF' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#3370FF' },
                { offset: 1, color: '#1F5ADB' }
              ]
            }
          }
        },
        label: {
          show: true,
          position: 'right',
          color: '#8F959E',
          fontSize: 11,
          formatter: (params) => Utils.formatLargeNumber(params.value)
        },
        data: top20.map(d => d.value).reverse()
      }]
    };
  },

  /**
   * 饼图 - 按设备积分消耗分布
   */
  getDeviceDistributionChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          return `${params.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${params.color}"></span>
                  积分: <strong>${Utils.formatNumber(params.value)}</strong> 点<br/>
                  占比: <strong>${params.percent}%</strong>`;
        }
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'center',
        itemGap: 15,
        textStyle: {
          color: '#646A73',
          fontSize: 13
        },
        formatter: (name) => {
          const item = data.find(d => d.name === name);
          return `${name}  ${Utils.formatNumber(item.value)} 点`;
        }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['35%', '50%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: data
      }]
    };
  },

  /**
   * Token消耗趋势图
   */
  getTokenTrendChart(data) {
    return this.getPointsTrendChart(data);
  },

  /**
   * 输入/输出Token构成
   */
  getTokenCompositionChart(data) {
    return this.getPointsCompositionChart(data);
  },

  /**
   * 双折线 - Token消耗趋势（输入 vs 输出）
   */
  getTokenIOTrendChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#E5E6EB', borderWidth: 1, textStyle: { color: '#1F2329' } },
      legend: { data: ['输入Token', '输出Token'], top: '0%', right: '5%', itemGap: 20, textStyle: { color: '#646A73', fontSize: 13 } },
      xAxis: { type: 'category', data: data.map(d => d.date), boundaryGap: false, axisLine: { lineStyle: { color: '#E5E6EB' } }, axisLabel: { color: '#8F959E' } },
      yAxis: { type: 'value', name: 'Tokens', nameTextStyle: { color: '#646A73', padding: [0,0,0,-10] }, axisLine: { show:false }, axisTick: { show:false }, splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } }, axisLabel: { color: '#8F959E' } },
      grid: this.getGridConfig(),
      series: [
        { name: '输入Token', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width:2, color:'#3370FF' }, itemStyle: { color:'#3370FF', borderWidth:2, borderColor:'#fff' }, data: data.map(d => d.inputTokens) },
        { name: '输出Token', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width:2, color:'#FF7D00' }, itemStyle: { color:'#FF7D00', borderWidth:2, borderColor:'#fff' }, data: data.map(d => d.outputTokens) }
      ]
    };
  },

  /**
   * 模型Token消耗分析
   */
  getModelTokenAnalysisChart(data) {
    return this.getModelRankingChart(data);
  },

  /**
   * 双折线图 - 设备使用时长趋势
   */
  getDeviceTimeTrendChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          let result = `${params[0].name}<br/>`;
          params.forEach(param => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color}"></span>
                       ${param.seriesName}: <strong>${Utils.formatNumber(param.value)}</strong> 分钟<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['云电脑', '云手机'],
        top: '0%',
        right: '5%',
        itemGap: 20,
        textStyle: {
          color: '#646A73',
          fontSize: 13
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date),
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#8F959E'
        }
      },
      yAxis: {
        type: 'value',
        name: '时长 (分钟)',
        nameTextStyle: {
          color: '#646A73',
          padding: [0, 0, 0, -10]
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F2F3F5', type: 'dashed' }
        },
        axisLabel: {
          color: '#8F959E'
        }
      },
      grid: this.getGridConfig(),
      series: [
        {
          name: '云电脑',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#3370FF'
          },
          itemStyle: {
            color: '#3370FF',
            borderWidth: 2,
            borderColor: '#fff'
          },
          data: data.map(d => d.cloudPC)
        },
        {
          name: '云手机',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#00B42A'
          },
          itemStyle: {
            color: '#00B42A',
            borderWidth: 2,
            borderColor: '#fff'
          },
          data: data.map(d => d.cloudPhone)
        }
      ]
    };
  },

  /**
   * 组合图 - 使用与抵扣趋势
   */
  getUsageDeductionTrendChart(data) {
    return {
      ...this.getCommonConfig(),
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E6EB',
        borderWidth: 1,
        textStyle: {
          color: '#1F2329'
        },
        formatter: (params) => {
          let result = `${params[0].name}<br/>`;
          params.forEach(param => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:${param.seriesType === 'bar' ? '2px' : '50%'};width:10px;height:10px;background-color:${param.color}"></span>
                       ${param.seriesName}: <strong>${Utils.formatNumber(param.value)}</strong> 分钟<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['总使用时长', '积分抵扣时长'],
        top: '0%',
        right: '5%',
        itemGap: 20,
        textStyle: {
          color: '#646A73',
          fontSize: 13
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.date),
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#8F959E'
        }
      },
      yAxis: {
        type: 'value',
        name: '时长 (分钟)',
        nameTextStyle: {
          color: '#646A73',
          padding: [0, 0, 0, -10]
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F2F3F5', type: 'dashed' }
        },
        axisLabel: {
          color: '#8F959E'
        }
      },
      grid: this.getGridConfig(),
      series: [
        {
          name: '总使用时长',
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#C5D9FF' },
                { offset: 1, color: '#EBF2FF' }
              ]
            }
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#6C97FF' },
                  { offset: 1, color: '#C5D9FF' }
                ]
              }
            }
          },
          data: data.map(d => d.totalTime)
        },
        {
          name: '积分抵扣时长',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#FF7D00'
          },
          itemStyle: {
            color: '#FF7D00',
            borderWidth: 2,
            borderColor: '#fff'
          },
          data: data.map(d => d.deductionTime)
        }
      ]
    };
  },

  /**
   * 初始化图表
   */
  initChart(elementId, option) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`图表容器 ${elementId} 不存在`);
      return null;
    }

    const chart = echarts.init(element);
    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });

    return chart;
  },

  /**
   * 批量初始化图表
   */
  initCharts(charts) {
    const instances = {};
    
    charts.forEach(({ id, option }) => {
      instances[id] = this.initChart(id, option);
    });

    return instances;
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.ChartConfig = ChartConfig;
}

