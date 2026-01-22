/**
 * Mock数据 - 平台运营报表原型
 */

// 生成随机数字
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// 用户名称池
const USER_NAMES = [
  '张伟', '李娜', '王强', '刘洋', '陈敏', '杨静', '黄磊', '赵勇', '周杰', '吴涛',
  '徐丽', '孙鹏', '马超', '朱婷', '胡斌', '郭芳', '林峰', '何颖', '高明', '梁艳',
  '宋军', '郑霞', '谢宇', '韩雪', '唐晨', '冯瑞', '于洁', '董浩', '萧然', '程亮'
];

// 租户名称池
const TENANT_NAMES = [
  '科技创新有限公司', '智能科技集团', '数字化解决方案公司', '云计算服务平台',
  '人工智能研究院', '大数据分析中心', '软件开发工作室', '互联网科技公司'
];

// 智能体名称池
const AGENT_NAMES = [
  '智能客服助手', '数据分析专家', '内容创作助手', '代码审查助手', '翻译助手',
  '会议纪要助手', '文档整理助手', '市场分析助手', '客户服务助手', '技术支持助手',
  '产品推荐助手', '学习辅导助手', '健康咨询助手', '财务分析助手', '项目管理助手',
  '销售助手', 'HR助手', '法务助手', '设计助手', '运营助手'
];

// 工作流名称池
const WORKFLOW_NAMES = [
  '订单处理流程', '数据同步流程', '报告生成流程', '审批流程', '通知发送流程',
  '数据分析流程', '内容审核流程', '用户注册流程', '支付处理流程', '库存管理流程',
  '客户跟进流程', '任务分配流程', '质量检查流程', '备份恢复流程', '报表导出流程'
];

// 大模型名称池
const MODEL_NAMES = [
  'GPT-4o', 'GPT-4', 'GPT-3.5-turbo', 'Claude-3-Opus', 'Claude-3-Sonnet',
  'Gemini-Pro', 'Llama-3-70B', 'Mistral-Large', 'Command-R-Plus', 'Qwen-Max',
  'GLM-4', 'Baichuan-3', 'Yi-Large', 'DeepSeek-V2', 'MiniMax-abab6',
  'Doubao-pro', '文心一言4.0', '通义千问Max', '星火大模型3.5', '混元大模型'
];

// 生成用户头像URL
function getUserAvatar(name) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

// ==================== 智能体数据生成 ====================

function generateAgentData(days = 30) {
  const agents = [];
  const agentCount = randomInt(50, 200);
  
  for (let i = 1; i <= agentCount; i++) {
    const name = AGENT_NAMES[i % AGENT_NAMES.length] + (i > AGENT_NAMES.length ? `_${Math.floor(i / AGENT_NAMES.length)}` : '');
    const callCount = randomInt(100, 50000);
    const failCount = randomInt(0, Math.floor(callCount * 0.1));
    const successCount = callCount - failCount;
    const inputTokens = randomInt(100000, 5000000);
    const outputTokens = randomInt(50000, 2000000);
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens / 1000 * 0.15 + outputTokens / 1000 * 0.5) * (0.8 + Math.random() * 0.4);
    const userCount = randomInt(10, 500);
    const dialogCount = randomInt(callCount, callCount * 3);
    const sessionCount = Math.floor(dialogCount / randomInt(2, 5)); // 总会话数
    const avgResponseTime = randomFloat(0.5, 5.0);
    const isOfficial = Math.random() < 0.2; // 20%是官方智能体
    const agentType = isOfficial ? '官方创建' : '用户创建';
    const statusOptions = ['已发布', '草稿', '已归档'];
    const status = statusOptions[randomInt(0, isOfficial ? 0 : 2)]; // 官方智能体都是已发布
    
    // 计算平均每次调用成本和Token
    const avgCostPerCall = callCount > 0 ? cost / callCount : 0;
    const avgTokensPerCall = callCount > 0 ? totalTokens / callCount : 0;
    const callsPerUser = userCount > 0 ? callCount / userCount : 0;
    const callsPerSession = sessionCount > 0 ? callCount / sessionCount : 0;
    
    // 花费最多的模型
    const primaryModel = MODEL_NAMES[randomInt(0, MODEL_NAMES.length - 1)];
    
    agents.push({
      id: `agent_${String(i).padStart(6, '0')}`,
      name: name,
      agentType: agentType,
      status: status,
      callCount: callCount,
      successCount: successCount,
      failCount: failCount,
      successRate: parseFloat(((successCount / callCount) * 100).toFixed(2)),
      userCount: userCount,
      dialogCount: dialogCount,
      sessionCount: sessionCount,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      totalTokens: totalTokens,
      cost: parseFloat(cost.toFixed(2)),
      avgCostPerCall: parseFloat(avgCostPerCall.toFixed(4)),
      avgTokensPerCall: parseFloat(avgTokensPerCall.toFixed(0)),
      callsPerUser: parseFloat(callsPerUser.toFixed(1)),
      callsPerSession: parseFloat(callsPerSession.toFixed(1)),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)],
      creatorAvatar: getUserAvatar(USER_NAMES[randomInt(0, USER_NAMES.length - 1)]),
      ownerTenant: TENANT_NAMES[randomInt(0, TENANT_NAMES.length - 1)],
      primaryModel: primaryModel,
      lastCallTime: new Date(Date.now() - randomInt(0, days) * 24 * 60 * 60 * 1000).toISOString(),
      createTime: new Date(Date.now() - randomInt(30, days + 30) * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - randomInt(0, days) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return agents.sort((a, b) => b.cost - a.cost);
}

// 生成智能体Top10时间序列数据（堆叠面积图用）
function generateAgentTop10TimeSeriesData(agents, days = 30, metric = 'tokens') {
  const top10Agents = agents.slice(0, 10);
  const now = new Date();
  const dates = [];
  
  // 生成日期数组
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(5, 10));
  }
  
  // 为每个智能体生成时间序列数据
  const seriesData = top10Agents.map((agent, index) => {
    const baseValue = metric === 'tokens' ? agent.totalTokens / days :
                     metric === 'cost' ? agent.cost / days :
                     agent.callCount / days;
    
    return {
      name: agent.name,
      data: dates.map((date, i) => {
        // 添加一些随机波动
        const variation = 0.7 + Math.random() * 0.6;
        return Math.max(0, Math.floor(baseValue * variation));
      })
    };
  });
  
  return {
    dates: dates,
    series: seriesData
  };
}

// 生成租户列表
function generateTenantList() {
  return TENANT_NAMES.map((name, index) => ({
    id: `tenant_${String(index + 1).padStart(3, '0')}`,
    name: name
  }));
}

// ==================== 工作流数据生成 ====================

function generateWorkflowData(days = 30) {
  const workflows = [];
  const workflowCount = randomInt(30, 150);
  
  for (let i = 1; i <= workflowCount; i++) {
    const name = WORKFLOW_NAMES[i % WORKFLOW_NAMES.length] + (i > WORKFLOW_NAMES.length ? `_${Math.floor(i / WORKFLOW_NAMES.length)}` : '');
    const runCount = randomInt(50, 20000);
    const failCount = randomInt(0, Math.floor(runCount * 0.05));
    const successCount = runCount - failCount;
    const inputTokens = randomInt(50000, 3000000);
    const outputTokens = randomInt(20000, 1500000);
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens / 1000 * 0.15 + outputTokens / 1000 * 0.5) * (0.8 + Math.random() * 0.4);
    const userCount = randomInt(5, 300);
    const avgDuration = randomFloat(10, 300);
    const nodeCount = randomInt(3, 20);
    
    workflows.push({
      id: `workflow_${String(i).padStart(6, '0')}`,
      name: name,
      status: Math.random() > 0.1 ? '已发布' : '草稿',
      runCount: runCount,
      successCount: successCount,
      failCount: failCount,
      successRate: ((successCount / runCount) * 100).toFixed(2),
      userCount: userCount,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      totalTokens: totalTokens,
      cost: parseFloat(cost.toFixed(2)),
      avgDuration: parseFloat(avgDuration.toFixed(2)),
      nodeCount: nodeCount,
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)],
      creatorAvatar: getUserAvatar(USER_NAMES[randomInt(0, USER_NAMES.length - 1)]),
      lastRunTime: new Date(Date.now() - randomInt(0, days) * 24 * 60 * 60 * 1000).toISOString(),
      createTime: new Date(Date.now() - randomInt(30, days + 30) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return workflows.sort((a, b) => b.runCount - a.runCount);
}

// ==================== 用户数据生成 ====================

function generateUserData(days = 30) {
  const users = [];
  const userCount = randomInt(200, 1000);
  
  for (let i = 1; i <= userCount; i++) {
    const name = USER_NAMES[i % USER_NAMES.length] + (i > USER_NAMES.length ? `_${Math.floor(i / USER_NAMES.length)}` : '');
    const agentCallCount = randomInt(0, 10000);
    const workflowRunCount = randomInt(0, 5000);
    const totalTokens = randomInt(10000, 1000000);
    const cost = (totalTokens / 1000 * 0.3) * (0.8 + Math.random() * 0.4);
    const assetCount = randomInt(0, 50);
    const tenant = TENANT_NAMES[randomInt(0, TENANT_NAMES.length - 1)];
    
    users.push({
      id: `user_${String(i).padStart(6, '0')}`,
      name: name,
      avatar: getUserAvatar(name),
      tenant: tenant,
      agentCallCount: agentCallCount,
      workflowRunCount: workflowRunCount,
      totalTokens: totalTokens,
      cost: parseFloat(cost.toFixed(2)),
      assetCount: assetCount,
      lastActiveTime: new Date(Date.now() - randomInt(0, days) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return users.sort((a, b) => b.cost - a.cost);
}

// ==================== 大模型数据生成 ====================

function generateModelData(days = 30) {
  const models = [];
  const modelCount = randomInt(10, 30);
  
  for (let i = 0; i < modelCount; i++) {
    const name = MODEL_NAMES[i % MODEL_NAMES.length];
    const callCount = randomInt(1000, 100000);
    const failCount = randomInt(0, Math.floor(callCount * 0.05));
    const successCount = callCount - failCount;
    const inputTokens = randomInt(500000, 50000000);
    const outputTokens = randomInt(200000, 20000000);
    const totalTokens = inputTokens + outputTokens;
    const inputPrice = randomFloat(0.1, 0.5);
    const outputPrice = randomFloat(0.3, 1.5);
    const cost = (inputTokens / 1000 * inputPrice + outputTokens / 1000 * outputPrice);
    const avgPrice = (cost / totalTokens * 1000).toFixed(4);
    const avgResponseTime = randomFloat(100, 2000);
    const errorRate = ((failCount / callCount) * 100).toFixed(2);
    
    models.push({
      name: name,
      callCount: callCount,
      successCount: successCount,
      failCount: failCount,
      errorRate: parseFloat(errorRate),
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      totalTokens: totalTokens,
      cost: parseFloat(cost.toFixed(2)),
      avgPrice: parseFloat(avgPrice),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(0)),
      mainScenario: Math.random() > 0.5 ? '智能体' : '工作流',
    });
  }
  
  return models.sort((a, b) => b.cost - a.cost);
}

// ==================== 时间序列数据生成 ====================

function generateTimeSeriesData(days = 30, min = 100, max = 1000) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().slice(5, 10),
      value: randomInt(min, max),
    });
  }
  return data;
}

function generateDualTimeSeriesData(days = 30) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().slice(5, 10),
      value1: randomInt(500, 2000),
      value2: randomInt(300, 1500),
    });
  }
  return data;
}

function generateTokenTimeSeriesData(days = 30) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().slice(5, 10),
      inputTokens: randomInt(100000, 500000),
      outputTokens: randomInt(50000, 250000),
      cost: randomFloat(100, 1000),
    });
  }
  return data;
}

// ==================== 导出数据 ====================

window.MockData = {
  generateAgentData,
  generateWorkflowData,
  generateUserData,
  generateModelData,
  generateTimeSeriesData,
  generateDualTimeSeriesData,
  generateTokenTimeSeriesData,
  generateAgentTop10TimeSeriesData,
  generateTenantList,
};

