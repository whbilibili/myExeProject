export interface Agent {
  id: string;
  name: string;
  creator: string;
  department: string; // 对应租户
  createdDate: string;
  type: 'official' | 'user';
  status: 'published' | 'draft' | 'archived';
  lastUpdated: string;
  lastUsedDate: string;
  
  // 核心指标 (聚合)
  totalCost: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCalls: number;
  activeUsers: number;
  totalSessions: number;
  successRate: number; // 0-100
  avgLatency: number; // ms
  primaryModel: string;
  
  // 衍生指标 (计算得出)
  avgCostPerCall: number;
  avgTokensPerCall: number;
  callsPerUser: number;
  callsPerSession: number;
  
  // 象限分类
  quadrantType?: 'high_calls_high_cost' | 'high_calls_low_cost' | 'low_calls_high_cost' | 'low_calls_low_cost';
}

export interface DailyData {
  date: string;
  agentId: string;
  agentName: string;
  cost: number;
  tokens: number;
  calls: number;
}

export interface DashboardData {
  agents: Agent[];
  dailyTrend: DailyData[];
  totalMetrics: {
    activeAgents: number;
    totalCost: number;
    totalTokens: number;
    totalCalls: number;
    avgCostPerCall: number;
    avgTokensPerCall: number;
    platformSuccessRate: number;
    mostExpensiveAgent: string;
    mostUsedAgent: string;
  };
}

