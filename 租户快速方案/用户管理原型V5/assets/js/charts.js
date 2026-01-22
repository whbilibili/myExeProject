/**
 * 图表工具库 V5 - Charts Utility
 * 基于 ECharts 5 的图表封装，统一样式和配色
 */

const Charts = {
  /**
   * 飞书设计系统配色方案
   */
  colors: {
    primary: ['#3370FF', '#6C97FF', '#ADC6FF', '#1F5ADB', '#174CC1'],
    success: ['#00B42A', '#7BE188', '#AFF0B5', '#009924', '#007A1F'],
    warning: ['#FF7D00', '#FFAA54', '#FFCF8B', '#F57C00', '#D35400'],
    danger: ['#F53F3F', '#F76965', '#FBACA3', '#CB2634', '#A52128'],
    info: ['#3370FF', '#94BFFF', '#C5D9FF', '#1F5ADB', '#174CC1'],
    multi: ['#3370FF', '#00B42A', '#FF7D00', '#F53F3F', '#7816FF', 
            '#00B8D9', '#36CFC9', '#F7BA1E', '#FF77A9', '#9FDB1D']
  },
  
  /**
   * 通用主题配置
   */
  getTheme() {
    return {
      color: this.colors.multi,
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", sans-serif',
        fontSize: 13,
        color: '#4E5969'
      },
      title: {
        textStyle: {
          color: '#1D2129',
          fontSize: 16,
          fontWeight: 600
        },
        subtextStyle: {
          color: '#86909C',
          fontSize: 13
        }
      },
      line: {
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2
        }
      },
      bar: {
        barMaxWidth: 32,
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      },
      pie: {
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      legend: {
        textStyle: {
          color: '#4E5969',
          fontSize: 13
        },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 16
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
          fontSize: 13
        },
        padding: [8, 12],
        borderRadius: 4,
        axisPointer: {
          lineStyle: {
            color: '#C9CDD4',
            width: 1,
            type: 'dashed'
          },
          crossStyle: {
            color: '#C9CDD4',
            width: 1,
            type: 'dashed'
          }
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E5E6EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F2F3F5'
        }
      }
    };
  },
  
  /**
   * 初始化图表实例
   */
  init(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element #${elementId} not found`);
      return null;
    }
    
    const chart = echarts.init(element);
    
    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });
    
    return chart;
  },
  
  /**
   * 双折线图（用于趋势对比）
   */
  renderDualLineChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '趋势图',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      legend: {
        data: options.seriesNames || ['系列1', '系列2'],
        top: '5%',
        right: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: options.xAxisData || [],
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: '#F2F3F5' }
        }
      },
      series: options.series || []
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 环形图（用于占比展示）
   */
  renderDoughnutChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '占比图',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'center',
        itemGap: 12
      },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
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
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: options.data || []
      }]
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 水平条形图（用于排行榜）
   */
  renderHorizontalBarChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '排行榜',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '15%',
        right: '10%',
        top: '10%',
        bottom: '5%'
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: '#F2F3F5' }
        }
      },
      yAxis: {
        type: 'category',
        data: options.yAxisData || [],
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#4E5969',
          fontSize: 12
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'bar',
        data: options.data || [],
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: this.colors.primary[0]
        },
        barMaxWidth: 20
      }]
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 饼图（用于分布展示）
   */
  renderPieChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '分布图',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'center',
        itemGap: 12
      },
      series: [{
        type: 'pie',
        radius: '60%',
        center: ['40%', '50%'],
        itemStyle: {
          borderRadius: 6,
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
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: options.data || []
      }]
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 组合图（柱状图+折线图）
   */
  renderComboChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '组合图',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: options.seriesNames || ['系列1', '系列2'],
        top: '5%',
        right: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: options.xAxisData || [],
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        }
      },
      yAxis: [
        {
          type: 'value',
          name: options.yAxisName1 || '',
          position: 'left',
          axisLine: {
            lineStyle: { color: '#E5E6EB' }
          },
          axisLabel: {
            color: '#86909C',
            fontSize: 12
          },
          splitLine: {
            lineStyle: { color: '#F2F3F5' }
          }
        },
        {
          type: 'value',
          name: options.yAxisName2 || '',
          position: 'right',
          axisLine: {
            lineStyle: { color: '#E5E6EB' }
          },
          axisLabel: {
            color: '#86909C',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: options.series || []
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 柱状图
   */
  renderBarChart(elementId, options = {}) {
    const chart = this.init(elementId);
    if (!chart) return null;
    
    const defaultOption = {
      ...this.getTheme(),
      title: {
        text: options.title || '柱状图',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1D2129'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: options.xAxisData || [],
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#E5E6EB' }
        },
        axisLabel: {
          color: '#86909C',
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: '#F2F3F5' }
        }
      },
      series: [{
        type: 'bar',
        data: options.data || [],
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: this.colors.primary[0]
        },
        barMaxWidth: 32
      }]
    };
    
    chart.setOption(defaultOption);
    return chart;
  },
  
  /**
   * 销毁图表
   */
  dispose(chart) {
    if (chart && typeof chart.dispose === 'function') {
      chart.dispose();
    }
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.Charts = Charts;
}

