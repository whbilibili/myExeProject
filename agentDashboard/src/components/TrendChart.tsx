import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Tabs, Table } from 'antd';
import type { DailyData } from '../types';
import { groupBy, sumBy, orderBy } from 'lodash';

interface TrendChartProps {
  dailyData: DailyData[];
}

type MetricType = 'tokens' | 'cost' | 'calls';

const METRIC_CONFIG = {
  tokens: { label: 'Token 消耗', color: '#8884d8', unit: '' },
  cost: { label: '费用消耗 (￥)', color: '#82ca9d', unit: '¥' },
  calls: { label: '对话轮次', color: '#ffc658', unit: '次' },
};

export const TrendChart: React.FC<TrendChartProps> = ({ dailyData }) => {
  const [metric, setMetric] = useState<MetricType>('tokens');

  // 1. 数据处理：找出 Top 10 + Others
  const processedData = useMemo(() => {
    // 按 Agent 汇总
    const agentTotals = Object.entries(groupBy(dailyData, 'agentId')).map(([agentId, records]) => {
        return {
            agentId,
            agentName: records[0].agentName,
            total: sumBy(records, metric),
            records
        };
    });

    // 排序并取 Top 10
    const sortedAgents = orderBy(agentTotals, ['total'], ['desc']);
    const top10 = sortedAgents.slice(0, 10);
    const others = sortedAgents.slice(10);

    // 准备 ECharts Series
    const dates = Array.from(new Set(dailyData.map(d => d.date))).sort();
    
    const series = top10.map(agent => ({
        name: agent.agentName,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: dates.map(date => {
            const record = agent.records.find(r => r.date === date);
            return record ? record[metric] : 0;
        })
    }));

    // Add "Others" series if exists
    if (others.length > 0) {
        series.push({
            name: 'Others',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: { focus: 'series' },
            data: dates.map(date => {
                const dayRecords = others.flatMap(o => o.records).filter(r => r.date === date);
                return sumBy(dayRecords, metric);
            })
        });
    }

    return { dates, series, top10, others };
  }, [dailyData, metric]);

  // 2. ECharts 配置
  const getOption = () => ({
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
      data: processedData.series.map(s => s.name),
      type: 'scroll',
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: processedData.dates
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: METRIC_CONFIG[metric].unit
      }
    ],
    series: processedData.series
  });

  // 3. 明细表列定义
  const columns = [
    { title: '排行', dataIndex: 'rank', key: 'rank', width: 80 },
    { title: '智能体名称', dataIndex: 'name', key: 'name' },
    { 
        title: `总${METRIC_CONFIG[metric].label}`, 
        dataIndex: 'total', 
        key: 'total', 
        render: (val: number) => metric === 'cost' ? `¥${val.toFixed(2)}` : val.toLocaleString(),
        sorter: (a: any, b: any) => a.total - b.total
    },
    { title: '占比', dataIndex: 'percent', key: 'percent', render: (val: number) => `${val.toFixed(1)}%` }
  ];

  const tableData = processedData.top10.map((item, index) => {
      const totalSum = sumBy(dailyData, metric);
      return {
        key: item.agentId,
        rank: index + 1,
        name: item.agentName,
        total: item.total,
        percent: (item.total / totalSum) * 100
      };
  });
  
  // Add Others row
  if (processedData.others.length > 0) {
      const othersTotal = sumBy(processedData.others, 'total');
      const totalSum = sumBy(dailyData, metric);
      tableData.push({
          key: 'others',
          rank: 999, // or special indicator
          name: '其他 (Others)',
          total: othersTotal,
          percent: (othersTotal / totalSum) * 100
      });
  }

  return (
    <div id="trend" className="mb-8">
        <Card title="📈 核心图表：智能体成本与使用分析" className="rounded-lg shadow-none border border-[#DEE0E3]">
            <Tabs 
                activeKey={metric} 
                onChange={(key) => setMetric(key as MetricType)}
                items={[
                    { key: 'tokens', label: 'Token 消耗' },
                    { key: 'cost', label: '费用消耗' },
                    { key: 'calls', label: '对话轮次' },
                ]}
            />
            
            <div className="h-[400px] w-full">
                <ReactECharts 
                    option={getOption()} 
                    style={{ height: '100%', width: '100%' }} 
                    notMerge={true}
                />
            </div>

            <div className="mt-6">
                <h4 className="text-md font-bold mb-2 text-gray-600">数据明细 (Top 10)</h4>
                <Table 
                    dataSource={tableData} 
                    columns={columns} 
                    pagination={false} 
                    size="small" 
                    scroll={{ y: 240 }}
                />
            </div>
        </Card>
    </div>
  );
};

