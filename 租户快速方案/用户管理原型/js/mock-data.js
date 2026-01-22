// ==================== 模拟数据 ====================

// 用户列表数据
const mockUsers = [
  {
    id: 'USR-001',
    name: '张三',
    avatar: null,
    tenants: ['腾讯科技', '阿里巴巴', '字节跳动'],
    phone: '13800138000',
    email: 'zhangsan@example.com',
    mis: 'MIS-12345',
    createdTime: '2024-01-15 10:30:00',
    lastLoginTime: '2025-10-08 14:25:30',
    status: 'active',
    balance: 15280
  },
  {
    id: 'USR-002',
    name: '李四',
    avatar: null,
    tenants: ['百度在线', '网易公司'],
    phone: '13900139000',
    email: 'lisi@example.com',
    mis: 'MIS-12346',
    createdTime: '2024-02-20 09:15:00',
    lastLoginTime: '2025-10-09 16:40:15',
    status: 'active',
    balance: 8920
  },
  {
    id: 'USR-003',
    name: '王五',
    avatar: null,
    tenants: ['京东集团'],
    phone: '13700137000',
    email: 'wangwu@example.com',
    mis: 'MIS-12347',
    createdTime: '2024-03-10 14:20:00',
    lastLoginTime: '2025-10-07 11:30:45',
    status: 'disabled',
    balance: 3450
  },
  {
    id: 'USR-004',
    name: '赵六',
    avatar: null,
    tenants: ['美团科技', '腾讯科技', '拼多多'],
    phone: '13600136000',
    email: 'zhaoliu@example.com',
    mis: 'MIS-12348',
    createdTime: '2024-04-05 16:45:00',
    lastLoginTime: '2025-10-10 09:15:20',
    status: 'active',
    balance: 22150
  },
  {
    id: 'USR-005',
    name: '孙七',
    avatar: null,
    tenants: ['华为技术'],
    phone: '13500135000',
    email: 'sunqi@example.com',
    mis: null,
    createdTime: '2024-05-12 11:00:00',
    lastLoginTime: '2025-10-09 20:05:00',
    status: 'active',
    balance: 11680
  },
  {
    id: 'USR-006',
    name: '周八',
    avatar: null,
    tenants: ['小米科技', '字节跳动'],
    phone: '13400134000',
    email: 'zhouba@example.com',
    mis: 'MIS-12349',
    createdTime: '2024-06-18 13:30:00',
    lastLoginTime: '2025-10-08 08:50:30',
    status: 'active',
    balance: 19340
  }
];

// 租户列表数据
const mockTenants = [
  { id: 'TNT-001', name: '腾讯科技', plan: '企业版', owner: '马化腾', createdTime: '2024-01-01' },
  { id: 'TNT-002', name: '阿里巴巴', plan: '企业版', owner: '马云', createdTime: '2024-01-02' },
  { id: 'TNT-003', name: '字节跳动', plan: '团队版', owner: '张一鸣', createdTime: '2024-01-03' },
  { id: 'TNT-004', name: '百度在线', plan: '企业版', owner: '李彦宏', createdTime: '2024-01-04' },
  { id: 'TNT-005', name: '网易公司', plan: '团队版', owner: '丁磊', createdTime: '2024-01-05' },
  { id: 'TNT-006', name: '京东集团', plan: '企业版', owner: '刘强东', createdTime: '2024-01-06' },
  { id: 'TNT-007', name: '美团科技', plan: '团队版', owner: '王兴', createdTime: '2024-01-07' },
  { id: 'TNT-008', name: '拼多多', plan: '团队版', owner: '黄峥', createdTime: '2024-01-08' },
  { id: 'TNT-009', name: '华为技术', plan: '企业版', owner: '任正非', createdTime: '2024-01-09' },
  { id: 'TNT-010', name: '小米科技', plan: '团队版', owner: '雷军', createdTime: '2024-01-10' }
];

// 生成时间序列数据
function generateTimeSeriesData(days, baseValue, variance) {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const value = baseValue + Math.random() * variance - variance / 2;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, Math.round(value))
    });
  }
  return data;
}

// KPI数据
const mockKPIData = {
  totalPoints: 12580,
  totalPointsTrend: '+12.5%',
  tokenUsage: {
    input: 8200000,
    output: 2100000
  },
  deviceTime: {
    desktop: 3600,
    mobile: 1200
  },
  totalAssets: 25,
  assetsBreakdown: {
    agents: 5,
    workflows: 12,
    knowledgeBases: 3,
    toolLibraries: 5
  }
};

// 积分消耗趋势数据
const mockPointsTrendData = {
  daily: generateTimeSeriesData(30, 400, 200).map(item => ({
    ...item,
    token: Math.round(item.value * 0.6),
    desktop: Math.round(item.value * 0.25),
    mobile: Math.round(item.value * 0.15)
  })),
  weekly: generateTimeSeriesData(12, 2800, 800).map(item => ({
    ...item,
    token: Math.round(item.value * 0.6),
    desktop: Math.round(item.value * 0.25),
    mobile: Math.round(item.value * 0.15)
  })),
  monthly: generateTimeSeriesData(6, 12000, 3000).map(item => ({
    ...item,
    token: Math.round(item.value * 0.6),
    desktop: Math.round(item.value * 0.25),
    mobile: Math.round(item.value * 0.15)
  }))
};

// 积分消耗构成
const mockPointsComposition = [
  { name: 'Token消耗', value: 7548, percentage: 60 },
  { name: '云电脑', value: 3145, percentage: 25 },
  { name: '云手机', value: 1887, percentage: 15 }
];

// 按租户消耗排行
const mockTenantRanking = [
  { tenant: '腾讯科技', points: 4580 },
  { tenant: '阿里巴巴', points: 3240 },
  { tenant: '字节跳动', points: 2890 },
  { tenant: '百度在线', points: 1870 }
];

// Token消耗趋势
const mockTokenTrendData = {
  daily: generateTimeSeriesData(30, 300000, 100000).map(item => ({
    date: item.date,
    input: Math.round(item.value * 0.75),
    output: Math.round(item.value * 0.25)
  })),
  weekly: generateTimeSeriesData(12, 2100000, 600000).map(item => ({
    date: item.date,
    input: Math.round(item.value * 0.75),
    output: Math.round(item.value * 0.25)
  })),
  monthly: generateTimeSeriesData(6, 9000000, 2000000).map(item => ({
    date: item.date,
    input: Math.round(item.value * 0.75),
    output: Math.round(item.value * 0.25)
  }))
};

// 按模型消耗分布
const mockModelDistribution = [
  { name: 'GPT-4o', value: 3850000, percentage: 37 },
  { name: 'Claude 3.5', value: 2890000, percentage: 28 },
  { name: 'GPT-3.5', value: 2050000, percentage: 20 },
  { name: 'Gemini Pro', value: 1550000, percentage: 15 }
];

// 设备时长趋势
const mockDeviceTrendData = {
  daily: generateTimeSeriesData(30, 150, 50).map(item => ({
    date: item.date,
    desktop: Math.round(item.value * 0.75),
    mobile: Math.round(item.value * 0.25)
  })),
  weekly: generateTimeSeriesData(12, 1050, 350).map(item => ({
    date: item.date,
    desktop: Math.round(item.value * 0.75),
    mobile: Math.round(item.value * 0.25)
  })),
  monthly: generateTimeSeriesData(6, 4500, 1000).map(item => ({
    date: item.date,
    desktop: Math.round(item.value * 0.75),
    mobile: Math.round(item.value * 0.25)
  }))
};

// 会话时长分布
const mockSessionDistribution = [
  { range: '0-10分钟', count: 45 },
  { range: '10-30分钟', count: 78 },
  { range: '30-60分钟', count: 52 },
  { range: '60+分钟', count: 25 }
];

// 分时段使用分析
const mockHourlyUsage = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  usage: Math.round(Math.random() * 100 + 20)
}));

// 消费明细数据
const mockConsumptionDetails = [];
for (let i = 0; i < 100; i++) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  const resourceTypes = ['智能体', '工作流', 'Token', '云电脑设备时长', '云手机设备时长'];
  const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
  
  const actions = ['调用GPT-4o', '调用Claude 3.5', '运行工作流', '新建智能体', '云设备使用'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  const changeTypes = ['消耗', '返还'];
  const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
  
  mockConsumptionDetails.push({
    id: `CSD-${String(i + 1).padStart(4, '0')}`,
    date: date.toISOString().replace('T', ' ').split('.')[0],
    resourceType,
    action,
    changeType,
    usage: resourceType === 'Token' ? `输入: ${Math.round(Math.random() * 10000)}, 输出: ${Math.round(Math.random() * 3000)}` : `${Math.round(Math.random() * 100)} 分钟`,
    points: changeType === '消耗' ? Math.round(Math.random() * 500) : -Math.round(Math.random() * 100),
    tenant: mockTenants[Math.floor(Math.random() * 4)].name
  });
}

// 资产数据 - 智能体
const mockAgents = [
  { id: 'AGT-001', name: '客服助手', runs: 1250, users: 320, status: '已发布', creator: '张三', lastUpdated: '2025-10-08 14:30', lastRun: '2025-10-10 09:15', tokens: 2850000 },
  { id: 'AGT-002', name: '数据分析助手', runs: 890, users: 150, status: '已发布', creator: '张三', lastUpdated: '2025-10-05 11:20', lastRun: '2025-10-09 16:45', tokens: 1920000 },
  { id: 'AGT-003', name: '代码审查助手', runs: 560, users: 85, status: '已发布', creator: '张三', lastUpdated: '2025-10-01 09:15', lastRun: '2025-10-08 14:20', tokens: 1230000 },
  { id: 'AGT-004', name: '文档生成器', runs: 320, users: 42, status: '草稿', creator: '张三', lastUpdated: '2025-09-28 16:40', lastRun: '2025-10-07 10:30', tokens: 780000 },
  { id: 'AGT-005', name: '翻译助手', runs: 2100, users: 580, status: '已发布', creator: '张三', lastUpdated: '2025-10-09 10:00', lastRun: '2025-10-10 08:50', tokens: 3450000 }
];

// 资产数据 - 工作流
const mockWorkflows = [
  { id: 'WFL-001', name: '自动化报告生成', runs: 450, users: 120, status: '已发布', creator: '张三', lastUpdated: '2025-10-06 15:20', lastRun: '2025-10-09 14:30', points: 8920 },
  { id: 'WFL-002', name: '数据清洗流程', runs: 680, users: 95, status: '已发布', creator: '张三', lastUpdated: '2025-10-04 10:15', lastRun: '2025-10-10 11:20', points: 12450 },
  { id: 'WFL-003', name: '用户反馈处理', runs: 320, users: 68, status: '已发布', creator: '张三', lastUpdated: '2025-09-30 14:40', lastRun: '2025-10-08 09:15', points: 5680 },
  { id: 'WFL-004', name: '多语言内容发布', runs: 180, users: 35, status: '草稿', creator: '张三', lastUpdated: '2025-09-25 11:30', lastRun: '2025-10-05 16:45', points: 3240 }
];

// 资产数据 - 工具
const mockTools = [
  { id: 'TL-001', name: 'PDF解析工具', library: '文档处理库', agentRefs: 12, workflowRefs: 8, createdTime: '2024-05-15 10:30', creator: '张三' },
  { id: 'TL-002', name: '图片压缩工具', library: '媒体处理库', agentRefs: 8, workflowRefs: 5, createdTime: '2024-06-20 14:15', creator: '张三' },
  { id: 'TL-003', name: '邮件发送工具', library: '通信工具库', agentRefs: 15, workflowRefs: 12, createdTime: '2024-07-10 09:45', creator: '张三' },
  { id: 'TL-004', name: '数据库查询工具', library: '数据工具库', agentRefs: 20, workflowRefs: 18, createdTime: '2024-08-05 16:20', creator: '张三' }
];

// 资产数据 - 工具库
const mockToolLibraries = [
  { id: 'TLB-001', name: '文档处理库', status: '已发布', type: 'API', toolCount: 15, createdTime: '2024-04-10 11:00', creator: '张三' },
  { id: 'TLB-002', name: '媒体处理库', status: '已发布', type: 'API', toolCount: 12, createdTime: '2024-05-15 14:30', creator: '张三' },
  { id: 'TLB-003', name: '通信工具库', status: '已发布', type: '上下文', toolCount: 8, createdTime: '2024-06-20 09:15', creator: '张三' },
  { id: 'TLB-004', name: '数据工具库', status: '未发布', type: 'API', toolCount: 22, createdTime: '2024-07-25 16:45', creator: '张三' }
];

// 资产数据 - 知识库
const mockKnowledgeBases = [
  { id: 'KB-001', name: '产品文档库', status: '启用', units: 1250, references: 340, capacity: '15.6 MB', createdTime: '2024-03-20 10:30', creator: '张三' },
  { id: 'KB-002', name: '技术规范库', status: '启用', units: 890, references: 220, capacity: '22.3 MB', createdTime: '2024-04-15 14:20', creator: '张三' },
  { id: 'KB-003', name: 'FAQ知识库', status: '未启用', units: 560, references: 180, capacity: '8.9 MB', createdTime: '2024-05-10 09:45', creator: '张三' }
];

// 资产数据 - 空间
const mockSpaces = [
  { id: 'SPC-001', name: '研发团队空间', type: '团队空间', owner: '张三', createdTime: '2024-02-10 11:00', lastUpdatedBy: '李四', lastUpdated: '2025-10-08 15:30', agents: 8, workflows: 15, tools: 25 },
  { id: 'SPC-002', name: '产品设计空间', type: '团队空间', owner: '张三', createdTime: '2024-03-15 14:20', lastUpdatedBy: '王五', lastUpdated: '2025-10-07 10:45', agents: 5, workflows: 10, tools: 12 },
  { id: 'SPC-003', name: '个人工作空间', type: '个人空间', owner: '张三', createdTime: '2024-01-05 09:30', lastUpdatedBy: '张三', lastUpdated: '2025-10-09 16:20', agents: 3, workflows: 8, tools: 6 }
];

// 用户租户关系数据
const mockUserTenants = [
  { 
    id: 'TNT-001', 
    name: '腾讯科技', 
    joinedTime: '2024-01-15 10:30:00',
    plan: '企业版',
    creator: '马化腾',
    createdTime: '2024-01-01',
    owner: '马化腾',
    isOwner: false
  },
  { 
    id: 'TNT-002', 
    name: '阿里巴巴', 
    joinedTime: '2024-02-20 14:15:00',
    plan: '企业版',
    creator: '马云',
    createdTime: '2024-01-02',
    owner: '马云',
    isOwner: false
  },
  { 
    id: 'TNT-003', 
    name: '字节跳动', 
    joinedTime: '2024-03-10 09:20:00',
    plan: '团队版',
    creator: '张一鸣',
    createdTime: '2024-01-03',
    owner: '张一鸣',
    isOwner: true
  }
];

// 获取用户首字母作为头像
function getAvatarText(name) {
  return name ? name.charAt(0) : '?';
}

// 格式化数字
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 格式化时间
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
}

// 获取状态样式
function getStatusClass(status) {
  const statusMap = {
    'active': 'badge-success',
    'disabled': 'badge-danger',
    '正常': 'badge-success',
    '已禁用': 'badge-danger',
    '已发布': 'badge-success',
    '草稿': 'badge-warning',
    '未发布': 'badge-warning',
    '启用': 'badge-success',
    '未启用': 'badge-warning'
  };
  return statusMap[status] || 'badge-info';
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    'active': '正常',
    'disabled': '已禁用'
  };
  return statusMap[status] || status;
}
