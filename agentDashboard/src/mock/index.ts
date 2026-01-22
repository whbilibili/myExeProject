import type { Agent, DailyData, DashboardData } from '../types';
import dayjs from 'dayjs';
import { random, sample } from 'lodash';

const AGENT_COUNT = 50;
const DAYS = 30;

const DEPARTMENTS = ['研发部', '产品部', '市场部', '运营部', '客服部', 'HR'];
const MODELS = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet'];
const CREATORS = ['张三', '李四', '王五', '赵六', 'Alice', 'Bob', 'Charlie'];

const generateRandomAgent = (index: number): Agent => {
  const id = `agent_${index + 1}`;
  const totalCalls = random(10, 5000);
  const totalCost = random(10, 5000); // 简单模拟
  const totalTokens = Math.floor(totalCost * 1000 * random(0.8, 1.2));
  const inputTokens = Math.floor(totalTokens * random(0.3, 0.7));
  const outputTokens = totalTokens - inputTokens;
  const activeUsers = Math.max(1, Math.floor(totalCalls / random(5, 50)));
  const totalSessions = Math.max(activeUsers, Math.floor(totalCalls / random(2, 10)));
  
  return {
    id,
    name: `智能助手_${index + 1}`,
    creator: sample(CREATORS)!,
    department: sample(DEPARTMENTS)!,
    createdDate: dayjs().subtract(random(10, 300), 'day').format('YYYY-MM-DD'),
    type: Math.random() > 0.8 ? 'official' : 'user',
    status: Math.random() > 0.9 ? 'archived' : 'published',
    lastUpdated: dayjs().subtract(random(0, 30), 'day').format('YYYY-MM-DD HH:mm'),
    lastUsedDate: dayjs().subtract(random(0, 7), 'day').format('YYYY-MM-DD HH:mm'),
    
    totalCost,
    totalTokens,
    inputTokens,
    outputTokens,
    totalCalls,
    activeUsers,
    totalSessions,
    successRate: random(80, 100, true),
    avgLatency: random(500, 5000),
    primaryModel: sample(MODELS)!,
    
    avgCostPerCall: totalCost / totalCalls,
    avgTokensPerCall: totalTokens / totalCalls,
    callsPerUser: totalCalls / activeUsers,
    callsPerSession: totalCalls / totalSessions,
  };
};

export const generateMockData = (): DashboardData => {
  const agents: Agent[] = Array.from({ length: AGENT_COUNT }, (_, i) => generateRandomAgent(i));
  
  const dailyTrend: DailyData[] = [];
  const startDate = dayjs().subtract(DAYS, 'day');
  
  for (let i = 0; i <= DAYS; i++) {
    const date = startDate.add(i, 'day').format('YYYY-MM-DD');
    agents.forEach(agent => {
      // 简单模拟每日数据，总和不一定严格等于 Agent 总数，主要用于趋势图展示
      const dailyCalls = Math.floor(agent.totalCalls / DAYS * random(0.5, 1.5));
      const dailyCost = dailyCalls * agent.avgCostPerCall;
      const dailyTokens = dailyCalls * agent.avgTokensPerCall;
      
      if (dailyCalls > 0) {
        dailyTrend.push({
          date,
          agentId: agent.id,
          agentName: agent.name,
          cost: dailyCost,
          tokens: dailyTokens,
          calls: dailyCalls,
        });
      }
    });
  }

  // 计算聚合指标
  const totalCost = agents.reduce((sum, a) => sum + a.totalCost, 0);
  const totalTokens = agents.reduce((sum, a) => sum + a.totalTokens, 0);
  const totalCalls = agents.reduce((sum, a) => sum + a.totalCalls, 0);
  const successCalls = agents.reduce((sum, a) => sum + (a.totalCalls * (a.successRate / 100)), 0);

  const sortedByCost = [...agents].sort((a, b) => b.totalCost - a.totalCost);
  const sortedByCalls = [...agents].sort((a, b) => b.totalCalls - a.totalCalls);

  return {
    agents,
    dailyTrend,
    totalMetrics: {
      activeAgents: agents.filter(a => a.totalCalls > 0).length,
      totalCost,
      totalTokens,
      totalCalls,
      avgCostPerCall: totalCost / totalCalls,
      avgTokensPerCall: totalTokens / totalCalls,
      platformSuccessRate: (successCalls / totalCalls) * 100,
      mostExpensiveAgent: sortedByCost[0]?.name || '-',
      mostUsedAgent: sortedByCalls[0]?.name || '-',
    }
  };
};

