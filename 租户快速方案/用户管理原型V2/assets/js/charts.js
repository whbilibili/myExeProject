// ECharts Configuration Library
// 企业级图表配置和主题

// 全局主题配置
const chartTheme = {
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 12,
    color: '#606266'
  },
  title: {
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#303133'
    },
    subtextStyle: {
      fontSize: 12,
      color: '#909399'
    }
  },
  legend: {
    textStyle: {
      fontSize: 12,
      color: '#606266'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  }
};

// 图表配置生成器
const ChartConfigs = {
  
  // 堆叠面积图 - 积分消耗趋势
  pointsTrendArea(data, granularity = 'daily') {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function(params) {
          let result = params[0].axisValue + '<br/>';
          params.forEach(item => {
            result += `${item.marker} ${item.seriesName}: ${item.value.toFixed(2)} 积分<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Token消耗', '云电脑时长抵扣', '云手机时长抵扣'],
        top: 0
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
        data: data.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '积分',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Token消耗',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.tokenPoints
        },
        {
          name: '云电脑时长抵扣',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.cloudPCPoints
        },
        {
          name: '云手机时长抵扣',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.cloudPhonePoints
        }
      ]
    };
  },

  // 环形图 - 积分消耗构成
  pointsCompositionDoughnut(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          name: '积分消耗构成',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
  },

  // 水平条形图 - 按租户消耗排行
  tenantRankingBar(data) {
    return {
      ...chartTheme,
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
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '消耗积分',
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'category',
        data: data.tenants.reverse(),
        axisLabel: {
          interval: 0
        }
      },
      series: [
        {
          name: '消耗积分',
          type: 'bar',
          data: data.points.reverse(),
          itemStyle: {
            borderRadius: [0, 5, 5, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c} 积分'
          }
        }
      ]
    };
  },

  // 双折线图 - Token消耗趋势
  tokenTrendLine(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['输入Token', '输出Token'],
        top: 0
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
        data: data.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Token数量',
        axisLabel: {
          formatter: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          }
        }
      },
      series: [
        {
          name: '输入Token',
          type: 'line',
          smooth: true,
          data: data.input,
          lineStyle: {
            width: 2
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: '输出Token',
          type: 'line',
          smooth: true,
          data: data.output,
          lineStyle: {
            width: 2
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  },

  // 饼图 - 输入输出分布
  tokenDistributionPie(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0
      },
      series: [
        {
          name: 'Token分布',
          type: 'pie',
          radius: '60%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}\n{d}%'
          }
        }
      ]
    };
  },

  // 环形图 - 按模型消耗分布
  modelDistributionDoughnut(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          name: '模型分布',
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
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: data
        }
      ]
    };
  },

  // 双折线图 - 设备时长消耗趋势
  deviceTimeTrendLine(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params) {
          let result = params[0].axisValue + '<br/>';
          params.forEach(item => {
            result += `${item.marker} ${item.seriesName}: ${item.value} 分钟<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['云电脑', '云手机'],
        top: 0
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
        data: data.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '时长(分钟)',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '云电脑',
          type: 'line',
          smooth: true,
          data: data.cloudPC,
          lineStyle: {
            width: 2
          }
        },
        {
          name: '云手机',
          type: 'line',
          smooth: true,
          data: data.cloudPhone,
          lineStyle: {
            width: 2
          }
        }
      ]
    };
  },

  // 直方图 - 会话时长分布
  sessionDurationHistogram(data) {
    return {
      ...chartTheme,
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
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.ranges,
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '会话次数'
      },
      series: [
        {
          name: '会话次数',
          type: 'bar',
          barWidth: '60%',
          data: data.counts,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    };
  },

  // 组合图 - 使用与抵扣趋势
  usageAndDeductionCombo(data) {
    return {
      ...chartTheme,
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
        data: ['总使用时长', '积分抵扣时长'],
        top: 0
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
        data: data.dates,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '时长(分钟)',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '总使用时长',
          type: 'bar',
          data: data.totalUsage,
          itemStyle: {
            borderRadius: [5, 5, 0, 0]
          }
        },
        {
          name: '积分抵扣时长',
          type: 'line',
          smooth: true,
          data: data.deduction,
          lineStyle: {
            width: 2
          }
        }
      ]
    };
  },

  // 热力图/柱状图 - 分时段使用分析
  hourlyUsageBar(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}:00 - {c} 分钟'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.hours,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: '{value}:00'
        }
      },
      yAxis: {
        type: 'value',
        name: '使用时长(分钟)'
      },
      series: [
        {
          name: '使用时长',
          type: 'bar',
          data: data.usage,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: function(params) {
              // 根据数值大小设置不同颜色深度
              const colorList = ['#c6e48b', '#7bc96f', '#49af5d', '#2e8840', '#196127'];
              const max = Math.max(...data.usage);
              const index = Math.floor((params.value / max) * (colorList.length - 1));
              return colorList[index];
            }
          }
        }
      ]
    };
  },

  // 组合图 - 创建与调用趋势
  createAndCallTrend(data, resourceName = '资源') {
    return {
      ...chartTheme,
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
        data: [`创建${resourceName}`, `调用次数`],
        top: 0
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
        data: data.dates,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          rotate: 45
        }
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
          name: `创建${resourceName}`,
          type: 'bar',
          data: data.created,
          itemStyle: {
            borderRadius: [5, 5, 0, 0]
          }
        },
        {
          name: '调用次数',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: data.calls,
          lineStyle: {
            width: 2
          }
        }
      ]
    };
  },

  // 堆叠条形图 - 各空间资产分布
  spaceAssetStackedBar(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['智能体', '工作流', '工具', '知识库'],
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '资产数量'
      },
      yAxis: {
        type: 'category',
        data: data.spaces
      },
      series: [
        {
          name: '智能体',
          type: 'bar',
          stack: 'total',
          data: data.bots
        },
        {
          name: '工作流',
          type: 'bar',
          stack: 'total',
          data: data.workflows
        },
        {
          name: '工具',
          type: 'bar',
          stack: 'total',
          data: data.tools
        },
        {
          name: '知识库',
          type: 'bar',
          stack: 'total',
          data: data.kbs
        }
      ]
    };
  },

  // 面积图 - 容量使用趋势
  capacityTrendArea(data) {
    return {
      ...chartTheme,
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>{a}: {c} MB'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '容量 (MB)',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '占用容量',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
              { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
            ])
          },
          data: data.capacity,
          lineStyle: {
            width: 2
          }
        }
      ]
    };
  }
};

// 导出配置
window.ChartConfigs = ChartConfigs;


