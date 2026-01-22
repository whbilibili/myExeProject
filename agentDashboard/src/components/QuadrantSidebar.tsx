import React, { useMemo } from 'react';
import { Tag, Button, Divider, Alert, Statistic, Drawer, Space } from 'antd';
import type { Agent } from '../types';
import { meanBy, groupBy } from 'lodash';
import { UserOutlined, DollarOutlined, ExperimentOutlined, StarOutlined, RightOutlined } from '@ant-design/icons';

interface QuadrantProps {
  agents: Agent[];
  medianCost: number;
  medianCalls: number;
}

interface DrawerProps {
  selectedAgent: Agent | null;
  onClose: () => void;
}

// 辅助函数：计算象限分布
const calculateDistribution = (agents: Agent[], medianCalls: number, medianCost: number) => {
    const total = agents.length;
    if (total === 0) return null;

    const getQuadrant = (a: Agent) => {
        const x = a.totalCalls;
        const y = a.avgCostPerCall;
        if (x >= medianCalls && y >= medianCost) return 'high_cost'; 
        if (x >= medianCalls && y < medianCost) return 'best_roi';   
        if (x < medianCalls && y >= medianCost) return 'check';      
        return 'long_tail';                                          
    };

    const grouped = groupBy(agents, getQuadrant);
    
    return {
        high_cost: {
            count: grouped['high_cost']?.length || 0,
            avgCost: meanBy(grouped['high_cost'], 'avgCostPerCall') || 0,
        },
        best_roi: {
            count: grouped['best_roi']?.length || 0,
        },
        check: {
            count: grouped['check']?.length || 0,
        }
    };
};

export const QuadrantSummary: React.FC<QuadrantProps> = ({ 
    agents, 
    medianCost,
    medianCalls 
}) => {
  const distribution = useMemo(() => 
    calculateDistribution(agents, medianCalls, medianCost), 
  [agents, medianCalls, medianCost]);

  if (!distribution) return null;

  const total = agents.length;

  const SummaryItem = ({ title, count, color, desc, extra }: any) => (
      <div className={`flex-1 p-4 rounded-lg border border-l-4 ${color} bg-white shadow-sm`}>
          <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-700">{title}</span>
              <Tag>{count}个 ({Math.round(count / total * 100)}%)</Tag>
          </div>
          <div className="text-xs text-gray-500 mb-1 min-h-[20px]">{extra}</div>
          <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
      </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 lg:w-[200px]">
            <div className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">Benchmark</div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">💰 成本中位数</span>
                <span className="font-mono font-bold">¥{medianCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">🔥 轮次中位数</span>
                <span className="font-mono font-bold">{medianCalls}</span>
            </div>
        </div>

        <SummaryItem 
            title="🔴 重点优化" 
            count={distribution.high_cost.count}
            color="border-l-red-500 border-gray-100"
            extra={`平均成本: ¥${distribution.high_cost.avgCost.toFixed(2)}`}
            desc="高频且昂贵，降本首要目标。"
        />
        <SummaryItem 
            title="🟢 明星应用" 
            count={distribution.best_roi.count}
            color="border-l-green-500 border-gray-100"
            extra="ROI 之王"
            desc="高频低价，值得推广的最佳实践。"
        />
        <SummaryItem 
            title="🟠 需排查" 
            count={distribution.check.count}
            color="border-l-orange-400 border-gray-100"
            extra="低频高价"
            desc="确认是否为废弃测试应用或异常。"
        />
    </div>
  );
};

export const AgentDetailDrawer: React.FC<DrawerProps> = ({ selectedAgent, onClose }) => {
    if (!selectedAgent) return null;

    const isExpensiveModel = selectedAgent.primaryModel.includes('gpt-4') || selectedAgent.primaryModel.includes('opus');
    const highTokenRatio = selectedAgent.inputTokens / (selectedAgent.outputTokens || 1) > 10;
    const lowSuccessRate = selectedAgent.successRate < 90;

    return (
        <Drawer
            title={
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold">{selectedAgent.name}</div>
                    <div className="text-xs font-normal text-gray-500">ID: {selectedAgent.id}</div>
                </div>
            }
            placement="right"
            width={400}
            onClose={onClose}
            open={!!selectedAgent}
            styles={{ body: { paddingBottom: 80 } }}
        >
            <div className="mb-6">
                <Space size={[0, 8]} wrap>
                    <Tag color="blue">{selectedAgent.creator}</Tag>
                    <Tag>{selectedAgent.department}</Tag>
                    <Tag color={selectedAgent.status === 'published' ? 'success' : 'default'}>
                        {selectedAgent.status === 'published' ? '已发布' : selectedAgent.status}
                    </Tag>
                </Space>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <Statistic title="总花费" value={selectedAgent.totalCost} precision={2} prefix="¥" />
                <Statistic title="活跃用户" value={selectedAgent.activeUsers} prefix={<UserOutlined />} />
                <Statistic title="单轮成本" value={selectedAgent.avgCostPerCall} precision={4} prefix="¥" />
                <Statistic 
                    title="成功率" 
                    value={selectedAgent.successRate} 
                    suffix="%" 
                    valueStyle={{ color: selectedAgent.successRate < 90 ? '#ff4d4f' : 'inherit' }} 
                />
            </div>

            <Divider orientation="left">智能诊断</Divider>

            <div className="space-y-4">
                {isExpensiveModel ? (
                    <Alert
                        message="昂贵模型预警"
                        description={`当前使用 ${selectedAgent.primaryModel}，建议测试是否可用 mini 版替代。`}
                        type="warning"
                        showIcon
                        icon={<DollarOutlined />}
                    />
                ) : (
                    <div className="p-3 bg-green-50 border border-green-100 rounded text-green-700 text-sm flex items-center gap-2">
                        <CheckCircleOutlined /> 模型成本检查通过
                    </div>
                )}

                {highTokenRatio && (
                    <Alert
                        message="Prompt 过长"
                        description="输入Token占比过高 (>10:1)。建议开启 Context Caching。"
                        type="info"
                        showIcon
                        icon={<ExperimentOutlined />}
                    />
                )}

                {lowSuccessRate && (
                    <Alert
                        message="稳定性差"
                        description="失败率达 10%以上，存在隐性浪费。"
                        type="error"
                        showIcon
                    />
                )}

                {!isExpensiveModel && !highTokenRatio && !lowSuccessRate && (
                    <Alert
                        message="运行健康"
                        description="各项指标正常，未发现明显问题。"
                        type="success"
                        showIcon
                        icon={<StarOutlined />}
                    />
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-4 bg-white text-right">
                <Button type="primary" href="#" target="_blank">
                    查看完整详情 <RightOutlined />
                </Button>
            </div>
        </Drawer>
    );
};

// 为了兼容 import 的辅助组件
const CheckCircleOutlined = () => <span role="img" aria-label="check-circle" className="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></span>;
