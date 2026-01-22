import React, { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Empty } from 'antd';
import type { Agent } from '../types';
import { median } from 'lodash';

interface QuadrantChartProps {
  agents: Agent[];
  onAgentSelect: (agent: Agent | null) => void;
  selectedAgentId?: string | null;
}

// 颜色映射
const QUADRANT_COLORS = {
  'high_calls_high_cost': '#ff4d4f', // Red
  'high_calls_low_cost': '#52c41a',  // Green
  'low_calls_high_cost': '#faad14',  // Orange
  'low_calls_low_cost': '#d9d9d9',   // Grey
};

export const QuadrantChart: React.FC<QuadrantChartProps> = ({ agents, onAgentSelect, selectedAgentId }) => {
  const echartsRef = useRef<ReactECharts>(null);

  // 1. 计算中位数和象限分类
  const chartData = useMemo(() => {
    if (agents.length === 0) return null;

    const calls = agents.map(a => a.totalCalls);
    const costs = agents.map(a => a.avgCostPerCall);

    // 排序后计算中位数
    calls.sort((a, b) => a - b);
    costs.sort((a, b) => a - b);

    const medianCalls = calls[Math.floor(calls.length / 2)] || 1;
    const medianCost = costs[Math.floor(costs.length / 2)] || 0.01;

    // 处理数据点
    const dataPoints = agents.map(agent => {
        // Log scale protection: value > 0
        const x = agent.totalCalls > 0 ? agent.totalCalls : 0.1;
        const y = agent.avgCostPerCall > 0 ? agent.avgCostPerCall : 0.001;
        
        // Determine quadrant
        let type = '';
        if (x >= medianCalls && y >= medianCost) type = 'high_calls_high_cost';
        else if (x >= medianCalls && y < medianCost) type = 'high_calls_low_cost';
        else if (x < medianCalls && y >= medianCost) type = 'low_calls_high_cost';
        else type = 'low_calls_low_cost';

        return {
            id: agent.id,
            name: agent.name,
            value: [x, y, agent.activeUsers, type, agent.totalCost], // x, y, size, type, extra
            itemStyle: {
                color: QUADRANT_COLORS[type as keyof typeof QUADRANT_COLORS],
                shadowBlur: selectedAgentId === agent.id ? 10 : 0,
                shadowColor: '#333',
                borderColor: selectedAgentId === agent.id ? '#000' : 'transparent',
                borderWidth: selectedAgentId === agent.id ? 2 : 0,
                opacity: selectedAgentId && selectedAgentId !== agent.id ? 0.3 : 0.8
            },
            original: agent
        };
    });

    return { medianCalls, medianCost, dataPoints };
  }, [agents, selectedAgentId]);

  // 2. ECharts 配置
  const getOption = () => {
    if (!chartData) return {};

    return {
      title: {
        text: '智能体成本 vs. 使用情况',
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
            const data = params.data;
            if (!data) return '';
            const agent = data.original as Agent;
            return `
                <div style="font-weight:bold; margin-bottom: 4px;">${agent.name}</div>
                <div>创建者: ${agent.creator}</div>
                <div>总对话轮次: ${agent.totalCalls}</div>
                <div>平均单轮成本: ¥${agent.avgCostPerCall.toFixed(4)}</div>
                <div>活跃用户数: ${agent.activeUsers}</div>
                <div>总花费: ¥${agent.totalCost.toFixed(2)}</div>
            `;
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'log',
        name: '总对话轮次 (Log)',
        nameLocation: 'middle',
        nameGap: 30,
        splitLine: { show: false }
      },
      yAxis: {
        type: 'log',
        name: '平均单轮成本 (Log)',
        splitLine: { show: false },
        axisLabel: {
            formatter: (value: number) => `¥${value}`
        }
      },
      series: [
        {
            type: 'scatter',
            symbolSize: (data: any[]) => {
                // Scale bubble size based on active users (3rd dimension)
                // Simple linear scaling: min 5, max 50
                const size = data[2]; 
                return Math.min(Math.max(size * 2, 10), 60);
            },
            data: chartData.dataPoints,
            markLine: {
                silent: true,
                symbol: 'none',
                label: { formatter: '{b}' },
                lineStyle: { type: 'dashed', color: '#333' },
                data: [
                    { xAxis: chartData.medianCalls, name: `轮次中位数: ${chartData.medianCalls}` },
                    { yAxis: chartData.medianCost, name: `成本中位数: ¥${chartData.medianCost.toFixed(3)}` }
                ]
            }
        }
      ]
    };
  };

  const onChartClick = (params: any) => {
      if (params.componentType === 'series' && params.data) {
          onAgentSelect(params.data.original);
      } else {
          onAgentSelect(null);
      }
  };

  // Click on blank area to clear selection
  const onEvents = {
    'click': onChartClick,
    'zr:click': (params: any) => {
        if (!params.target) {
            onAgentSelect(null);
        }
    }
  };

  return (
    <div id="quadrant" className="h-full">
        {agents.length > 0 ? (
            <ReactECharts 
                ref={echartsRef}
                option={getOption()} 
                style={{ height: '100%', width: '100%', minHeight: '500px' }} 
                onEvents={onEvents}
            />
        ) : (
            <Empty description="暂无数据" className="mt-20" />
        )}
    </div>
  );
};

