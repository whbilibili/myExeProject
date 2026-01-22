import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Select } from 'antd';
import type { Agent } from '../types';
import { max, min } from 'lodash';

interface HistogramChartProps {
  agents: Agent[];
}

type MetricType = 'totalCost' | 'totalTokens' | 'totalCalls' | 'activeUsers';

const METRIC_OPTIONS = [
    { value: 'totalCost', label: '智能体费用消耗' },
    { value: 'totalTokens', label: '智能体Token消耗' },
    { value: 'totalCalls', label: '智能体对话轮次' },
    { value: 'activeUsers', label: '智能体用户数' },
];

export const HistogramChart: React.FC<HistogramChartProps> = ({ agents }) => {
  const [metric, setMetric] = useState<MetricType>('totalCost');

  // 1. 动态分桶逻辑
  const chartData = useMemo(() => {
    if (agents.length === 0) return null;

    const values = agents.map(a => a[metric] as number);
    const minValue = min(values) || 0;
    const maxValue = max(values) || 0;
    
    // 如果所有值都一样，或数据太少
    if (minValue === maxValue) return { bins: [minValue], counts: [values.length] };

    const binCount = 20; // 目标桶数
    const binWidth = (maxValue - minValue) / binCount;

    const bins: string[] = [];
    const counts: number[] = new Array(binCount).fill(0);

    // 初始化 Bin Labels
    for (let i = 0; i < binCount; i++) {
        const start = minValue + i * binWidth;
        const end = start + binWidth;
        // Format label based on metric
        const format = (v: number) => {
            if (metric === 'totalCost') return `¥${v.toFixed(0)}`;
            if (metric === 'totalTokens') return `${(v/1000).toFixed(0)}k`;
            return v.toFixed(0);
        };
        bins.push(`${format(start)}-${format(end)}`);
    }

    // Fill counts
    values.forEach(v => {
        let binIndex = Math.floor((v - minValue) / binWidth);
        if (binIndex >= binCount) binIndex = binCount - 1;
        counts[binIndex]++;
    });

    return { bins, counts };
  }, [agents, metric]);

  const getOption = () => {
      if (!chartData) return {};

      return {
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
        xAxis: [
            {
                type: 'category',
                data: chartData.bins,
                axisTick: { alignWithLabel: true },
                axisLabel: { rotate: 45, interval: 'auto' }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '智能体数量 (个)'
            }
        ],
        series: [
            {
                name: '数量',
                type: 'bar',
                barWidth: '60%',
                data: chartData.counts,
                itemStyle: {
                    color: '#5470c6'
                }
            }
        ]
      };
  };

  return (
    <div id="histogram" className="mb-8">
        <Card 
            title="📊 智能体核心指标分布" 
            className="rounded-lg shadow-none border border-[#DEE0E3]" 
            extra={
                <Select 
                    value={metric} 
                    onChange={setMetric} 
                    options={METRIC_OPTIONS} 
                    style={{ width: 200 }}
                />
            }
        >
            <div className="h-[300px] w-full">
                <ReactECharts 
                    option={getOption()} 
                    style={{ height: '100%', width: '100%' }} 
                    notMerge={true}
                />
            </div>
        </Card>
    </div>
  );
};

