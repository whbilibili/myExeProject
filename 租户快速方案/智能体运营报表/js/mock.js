/**
 * Mock 数据生成 - 智能体运营报表
 */

const USER_NAMES = ['张伟', '李娜', '王强', '刘洋', '陈敏', '杨静', '黄磊', '赵勇', '周杰', '吴涛', 'Alice', 'Bob', 'Charlie', 'David'];
const DEPARTMENTS = ['研发部', '产品部', '市场部', '运营部', '销售部', 'HR', '财务部'];
const MODEL_NAMES = ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gpt-4o-mini'];
const AGENT_PREFIXES = ['智能', 'AI', '自动', '超级', '企业'];
const AGENT_SUFFIXES = ['助手', '专家', '顾问', 'Bot', '精灵'];
const AGENT_FUNCTIONS = ['客服', '编程', '写作', '翻译', '数据分析', '会议纪要', '法律咨询', '销售话术'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成智能体列表数据
function generateAgentList(count = 100, days = 30) {
  const agents = [];
  
  for (let i = 0; i < count; i++) {
    const isOfficial = Math.random() < 0.2;
    const model = randomItem(MODEL_NAMES);
    
    // 四象限分布逻辑控制
    // 1. 高调用 高成本 (明星但昂贵)
    // 2. 高调用 低成本 (明星且高效)
    // 3. 低调用 高成本 (问题/小众)
    // 4. 低调用 低成本 (长尾)
    
    let callCount, costPerCall;
    const rand = Math.random();
    
    if (rand < 0.1) { 
      // 1. 高频 高价 (10%)
      callCount = randomInt(5000, 20000);
      costPerCall = randomFloat(0.5, 2.0); // 较贵
    } else if (rand < 0.3) {
      // 2. 高频 低价 (20%)
      callCount = randomInt(5000, 30000);
      costPerCall = randomFloat(0.01, 0.3); // 便宜
    } else if (rand < 0.5) {
      // 3. 低频 高价 (20%)
      callCount = randomInt(1, 500);
      costPerCall = randomFloat(1.0, 5.0); // 很贵
    } else {
      // 4. 低频 低价 (50% - 长尾)
      callCount = randomInt(0, 1000);
      costPerCall = randomFloat(0.01, 0.5);
    }

    // 确保至少有一些调用
    if (callCount === 0 && Math.random() > 0.5) callCount = randomInt(1, 10);

    const totalCost = callCount * costPerCall;
    // 根据模型调整 Token 消耗估算
    const tokenPrice = model.includes('gpt-4') ? 0.0002 : 0.00001; // 假定价格
    const totalTokens = Math.floor(totalCost / tokenPrice);
    const avgTokensPerCall = callCount > 0 ? Math.floor(totalTokens / callCount) : 0;
    
    // 输入输出比例 (用于诊断)
    const inputRatio = randomFloat(0.3, 1.5); // 大部分正常，少数异常
    const inputTokens = Math.floor(totalTokens * (inputRatio / (1 + inputRatio)));
    const outputTokens = totalTokens - inputTokens;

    // 成功率
    let successRate = randomFloat(90, 100);
    if (Math.random() < 0.1) successRate = randomFloat(50, 89); // 少数成功率低
    
    // 活跃用户数 (与调用量正相关，但有波动)
    const userCount = callCount > 0 ? Math.max(1, Math.floor(callCount / randomFloat(5, 50))) : 0;
    
    const creator = randomItem(USER_NAMES);
    const dept = randomItem(DEPARTMENTS);
    
    agents.push({
      id: `agent_${i + 1000}`,
      name: `${randomItem(AGENT_PREFIXES)}${randomItem(AGENT_FUNCTIONS)}${randomItem(AGENT_SUFFIXES)}`,
      creator: creator,
      department: dept, // 租户/部门
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator}`,
      
      // 状态
      type: isOfficial ? '官方创建' : '用户创建',
      status: Math.random() > 0.1 ? '已发布' : '草稿',
      lastUpdated: new Date(Date.now() - randomInt(0, 30) * 24 * 3600 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - randomInt(0, 7) * 24 * 3600 * 1000).toISOString(),
      createdDate: new Date(Date.now() - randomInt(30, 365) * 24 * 3600 * 1000).toISOString(),
      
      // 核心指标
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalTokens: totalTokens,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      callCount: callCount,
      userCount: userCount,
      avgCostPerCall: parseFloat(costPerCall.toFixed(4)),
      avgTokensPerCall: avgTokensPerCall,
      successRate: parseFloat(successRate.toFixed(2)),
      
      // 归因
      primaryModel: model,
      
      // 衍生指标
      callsPerUser: userCount > 0 ? parseFloat((callCount / userCount).toFixed(1)) : 0,
      inputOutputRatio: outputTokens > 0 ? parseFloat((inputTokens / outputTokens).toFixed(2)) : 0,
      avgLatency: randomInt(500, 5000) // ms
    });
  }
  
  return agents;
}

// 生成时间趋势数据 (Top 10 堆叠图)
function generateTrendData(agentList, days = 30, metric = 'totalTokens') {
  // 选出 Top 10
  const top10 = [...agentList]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10);
    
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(`${d.getMonth() + 1}-${d.getDate()}`);
  }
  
  const series = top10.map(agent => {
    const data = [];
    // 模拟每日数据，总和大致等于 metric 值
    const avgDaily = agent[metric] / days;
    for (let i = 0; i < days; i++) {
      // 随机波动
      const val = Math.max(0, avgDaily * randomFloat(0.5, 1.5)); 
      data.push(metric.includes('Cost') ? parseFloat(val.toFixed(2)) : Math.floor(val));
    }
    return {
      name: agent.name,
      data: data
    };
  });
  
  return { dates, series };
}

window.MockData = {
  generateAgentList,
  generateTrendData,
  DEPARTMENTS
};

