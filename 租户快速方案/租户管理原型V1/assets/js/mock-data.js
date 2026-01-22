/**
 * Mock数据 - 租户管理原型
 */

// 生成随机日期
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 生成随机数字
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 租户版本
const TENANT_VERSIONS = ['试用版', '团队版', '企业版'];
const TENANT_STATUS = ['正常', '已禁用', '套餐到期'];

// 用户名称池
const USER_NAMES = [
  '张伟', '李娜', '王强', '刘洋', '陈敏', '杨静', '黄磊', '赵勇', '周杰', '吴涛',
  '徐丽', '孙鹏', '马超', '朱婷', '胡斌', '郭芳', '林峰', '何颖', '高明', '梁艳',
  '宋军', '郑霞', '谢宇', '韩雪', '唐晨', '冯瑞', '于洁', '董浩', '萧然', '程亮'
];

// 租户名称池
const COMPANY_NAMES = [
  '科技创新有限公司', '智能科技集团', '数字化解决方案公司', '云计算服务平台',
  '人工智能研究院', '大数据分析中心', '软件开发工作室', '互联网科技公司',
  '移动应用开发团队', '企业服务平台', '智慧城市解决方案', '金融科技公司',
  '教育科技集团', '医疗健康平台', '电商运营中心', '物流管理系统',
  '营销自动化平台', '客户关系管理', '人力资源系统', '财务管理软件',
  '项目协作平台', '设计创意工作室', '视频制作团队', '内容创作平台',
  '社交媒体运营', '游戏开发工作室', '区块链技术公司', '物联网解决方案',
  '智能制造平台', '供应链管理系统', '能源管理平台', '环保科技公司',
  '农业科技服务', '房地产科技', '汽车科技公司', '零售管理系统',
  '酒店管理平台', '旅游服务系统', '体育健康应用', '娱乐传媒公司',
  '法律科技服务', '政务服务平台', '安全监控系统', '通信技术公司',
  '网络安全公司', '数据中心服务', '云存储平台', '开发者社区',
  '技术培训机构', '咨询服务公司'
];

// 生成租户Logo URL
function getTenantLogo(index) {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${index}`;
}

// 生成用户头像URL
function getUserAvatar(name) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

// ==================== 租户列表数据 ====================
const mockTenants = [];
for (let i = 1; i <= 80; i++) {
  const version = TENANT_VERSIONS[randomInt(0, 2)];
  const status = TENANT_STATUS[randomInt(0, 2)];
  const owner = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const createTime = randomDate(new Date(2023, 0, 1), new Date(2025, 9, 12));
  
  let expireDate = null;
  if (version === '团队版' || version === '企业版') {
    expireDate = randomDate(new Date(2025, 10, 1), new Date(2026, 11, 31));
  }
  
  mockTenants.push({
    id: `T${String(i).padStart(6, '0')}`,
    name: COMPANY_NAMES[i % COMPANY_NAMES.length] + (i > COMPANY_NAMES.length ? ` ${Math.floor(i / COMPANY_NAMES.length)}` : ''),
    logo: getTenantLogo(i),
    version: version,
    expireDate: expireDate,
    owner: owner,
    ownerAvatar: getUserAvatar(owner),
    memberCount: randomInt(5, 500),
    agentCount: randomInt(0, 50),
    workflowCount: randomInt(0, 30),
    toolLibraryCount: randomInt(0, 10),
    toolCount: randomInt(0, 100),
    spaceCount: randomInt(1, 20),
    status: status,
    createTime: createTime.toISOString().slice(0, 19).replace('T', ' '),
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    description: '这是一家专注于数字化转型的创新型企业',
  });
}

// ==================== 仪表盘统计数据 ====================
const dashboardStats = {
  totalTenants: mockTenants.length,
  normalTenants: mockTenants.filter(t => t.status === '正常').length,
  disabledTenants: mockTenants.filter(t => t.status === '已禁用').length,
  expiredTenants: mockTenants.filter(t => t.status === '套餐到期').length,
  todayNewTenants: randomInt(3, 12),
};

// ==================== 租户详情数据总览 ====================
function generateDashboardData(tenantId) {
  return {
    // 资产总览
    assets: {
      agentCount: randomInt(10, 50),
      workflowCount: randomInt(5, 30),
      toolCount: randomInt(20, 100),
      toolLibraryCount: randomInt(2, 10),
      knowledgeBaseCount: randomInt(5, 20),
      spaceCount: randomInt(1, 10),
      
      agentRunCount: randomInt(10000, 100000),
      agentUserCount: randomInt(50, 500),
      agentDialogCount: randomInt(5000, 50000),
      agentTokenUsage: randomInt(100000, 1000000),
      
      workflowRunCount: randomInt(1000, 10000),
      workflowSuccessRate: (95 + Math.random() * 5).toFixed(1),
      workflowUserCount: randomInt(30, 300),
      workflowTokenUsage: randomInt(50000, 500000),
      
      toolReferenceCount: randomInt(300, 3000),
      knowledgeBaseReferenceCount: randomInt(500, 5000),
      
      memberCount: randomInt(50, 500),
      departmentCount: randomInt(10, 50),
      adminCount: randomInt(2, 10),
    },
    
    // 积分消耗
    credits: {
      totalConsumption: randomInt(30000, 100000),
      tokenConsumption: randomInt(20000, 70000),
      deviceConsumption: randomInt(10000, 30000),
    },
    
    // Token消耗
    tokens: {
      totalTokens: randomInt(1000000, 5000000),
      inputTokens: randomInt(600000, 3000000),
      outputTokens: randomInt(400000, 2000000),
      agentTokens: randomInt(500000, 2500000),
      workflowTokens: randomInt(500000, 2500000),
    },
    
    // 设备使用
    devices: {
      totalMinutes: randomInt(2000, 10000),
      desktopMinutes: randomInt(1500, 7000),
      mobileMinutes: randomInt(500, 3000),
    },
  };
}

// ==================== 图表数据生成器 ====================

// 生成时序数据（最近30天）
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

// 生成双线数据
function generateDualLineData(days = 30) {
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

// 生成模型排行数据
function generateModelRankingData() {
  const models = [
    'GPT-4o', 'GPT-4', 'GPT-3.5-turbo', 'Claude-3-Opus', 'Claude-3-Sonnet',
    'Gemini-Pro', 'Llama-3-70B', 'Mistral-Large', 'Command-R-Plus', 'Qwen-Max',
    'GLM-4', 'Baichuan-3', 'Yi-Large', 'DeepSeek-V2', 'MiniMax-abab6',
    'Doubao-pro', '文心一言4.0', '通义千问Max', '星火大模型3.5', '混元大模型'
  ];
  
  return models.slice(0, 20).map(model => ({
    name: model,
    value: randomInt(5000, 50000),
  })).sort((a, b) => b.value - a.value);
}

// 生成资产排行数据
function generateAssetRankingData() {
  const assets = [
    '智能体', '工作流', '工具', '工具库', '知识库', '团队空间',
    '组件库', '数据集', '模型', 'API接口', '插件', '模板'
  ];
  
  return assets.slice(0, 10).map(asset => ({
    name: asset,
    value: randomInt(10000, 100000),
  }));
}

// 生成Top10用户消耗数据
function generateTop10Users(type = 'credits') {
  return USER_NAMES.slice(0, 10).map((name, index) => ({
    name: name,
    avatar: getUserAvatar(name),
    value: randomInt(1000, 10000) - index * 100,
  })).sort((a, b) => b.value - a.value);
}

// ==================== 账单明细数据 ====================
const RESOURCE_TYPES = ['Token', '云电脑设备时长', '云手机设备时长', '存储空间'];
const BEHAVIORS = [
  '运行工作流', '调用GPT-4o', '调用Claude-3', '智能体对话', '知识库检索',
  '云电脑使用', '云手机使用', '文件上传', '图片生成', '语音合成'
];
const CHANGE_TYPES = ['消耗', '返还'];

const mockBillingRecords = [];
for (let i = 0; i < 200; i++) {
  const resourceType = RESOURCE_TYPES[randomInt(0, RESOURCE_TYPES.length - 1)];
  const changeType = CHANGE_TYPES[randomInt(0, CHANGE_TYPES.length - 1)];
  const date = randomDate(new Date(2025, 8, 1), new Date(2025, 9, 12));
  
  let usage = '';
  let credits = 0;
  
  if (resourceType === 'Token') {
    const inputTokens = randomInt(100, 5000);
    const outputTokens = randomInt(100, 3000);
    usage = `输入Token: ${inputTokens}, 输出Token: ${outputTokens}`;
    credits = Math.floor((inputTokens * 0.01 + outputTokens * 0.02) * (changeType === '返还' ? -1 : 1));
  } else if (resourceType.includes('设备')) {
    const minutes = randomInt(5, 120);
    usage = `${minutes} 分钟`;
    credits = Math.floor(minutes * 2 * (changeType === '返还' ? -1 : 1));
  } else {
    const size = randomInt(1, 1000);
    usage = `${size} MB`;
    credits = Math.floor(size * 0.1 * (changeType === '返还' ? -1 : 1));
  }
  
  mockBillingRecords.push({
    id: `B${String(i + 1).padStart(8, '0')}`,
    date: date.toISOString().slice(0, 19).replace('T', ' '),
    resourceType: resourceType,
    behavior: BEHAVIORS[randomInt(0, BEHAVIORS.length - 1)],
    changeType: changeType,
    usage: usage,
    credits: Math.abs(credits),
    hasCreditsChange: credits !== 0,
  });
}

// 按时间降序排序
mockBillingRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

// ==================== 资产明细数据 ====================

// 智能体列表
const mockAgents = [];
for (let i = 1; i <= 60; i++) {
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const status = Math.random() > 0.1 ? '已发布' : '已删除';
  mockAgents.push({
    id: `A${String(i).padStart(6, '0')}`,
    name: `智能助手-${i}`,
    runCount: randomInt(100, 10000),
    userCount: randomInt(10, 500),
    dialogCount: randomInt(500, 50000),
    tokenUsage: randomInt(10000, 500000),
    status: status,
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    updateTime: randomDate(new Date(2025, 7, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
    runTime: randomDate(new Date(2025, 8, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 工作流列表
const mockWorkflows = [];
for (let i = 1; i <= 50; i++) {
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const status = Math.random() > 0.1 ? '已发布' : '已删除';
  mockWorkflows.push({
    id: `W${String(i).padStart(6, '0')}`,
    name: `自动化流程-${i}`,
    runCount: randomInt(50, 5000),
    userCount: randomInt(5, 200),
    tokenUsage: randomInt(5000, 200000),
    status: status,
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    updateTime: randomDate(new Date(2025, 7, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
    runTime: randomDate(new Date(2025, 8, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 工具列表
const mockTools = [];
const toolLibraries = ['HTTP工具库', 'API集成库', '数据处理库', '文件操作库', '通知工具库'];
for (let i = 1; i <= 80; i++) {
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  mockTools.push({
    id: `TL${String(i).padStart(6, '0')}`,
    name: `工具-${i}`,
    library: toolLibraries[randomInt(0, toolLibraries.length - 1)],
    agentRefCount: randomInt(0, 50),
    workflowRefCount: randomInt(0, 30),
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    createTime: randomDate(new Date(2025, 0, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 工具库列表
const mockToolLibraries = [];
const libraryTypes = ['HTTP', 'Database', 'File', 'Notification', 'Data Processing'];
const libraryStatus = ['启用', '禁用'];
for (let i = 0; i < toolLibraries.length; i++) {
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  mockToolLibraries.push({
    id: `LIB${String(i + 1).padStart(4, '0')}`,
    name: toolLibraries[i],
    status: libraryStatus[randomInt(0, 1)],
    type: libraryTypes[i],
    toolCount: mockTools.filter(t => t.library === toolLibraries[i]).length,
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    createTime: randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 知识库列表
const mockKnowledgeBases = [];
for (let i = 1; i <= 40; i++) {
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const status = Math.random() > 0.2 ? '启用' : '未启用';
  mockKnowledgeBases.push({
    id: `KB${String(i).padStart(6, '0')}`,
    name: `知识库-${i}`,
    status: status,
    unitCount: randomInt(10, 1000),
    referenceCount: randomInt(100, 10000),
    storage: (randomInt(10, 5000) / 10).toFixed(1) + ' MB',
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    createTime: randomDate(new Date(2025, 0, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// 空间列表
const mockSpaces = [];
const spaceTypes = ['个人空间', '团队空间'];
for (let i = 1; i <= 30; i++) {
  const owner = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  const updater = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
  mockSpaces.push({
    id: `S${String(i).padStart(6, '0')}`,
    name: `空间-${i}`,
    type: spaceTypes[randomInt(0, 1)],
    owner: owner,
    ownerAvatar: getUserAvatar(owner),
    creator: creator,
    creatorAvatar: getUserAvatar(creator),
    createTime: randomDate(new Date(2025, 0, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
    updater: updater,
    updaterAvatar: getUserAvatar(updater),
    updateTime: randomDate(new Date(2025, 8, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// ==================== 成员数据 ====================
const DEPARTMENTS = [
  '质效技术部',
  '闪购技术部',
  '内购测试组',
  '内购产品测试组',
  '内购商家端测试组',
  '内购营销测试组',
  '酒店质行测试组',
  '公共产品测试组',
  '景点游玩测试组',
  '交通测试组',
  '度假及内容测试组',
  '住宿测试组',
  '民宿测试组',
  '服务零售测试组',
  '乐生活及品质交易测试组',
  '消费医疗及提档测试组',
  '易生活及增长测试组',
  '爆约平台测试组',
  '爆约方案与策略测试组',
  '爆约终端测试组',
  '运力管理测试组',
  '销售业务测试组',
];

const ROLES = ['所有者', '管理员', '空间创建员', '成员'];

const mockMembers = [];
for (let i = 0; i < 100; i++) {
  const name = USER_NAMES[randomInt(0, USER_NAMES.length - 1)] + (i > USER_NAMES.length ? String(i) : '');
  const department = DEPARTMENTS[randomInt(0, DEPARTMENTS.length - 1)];
  const role = i === 0 ? '所有者' : (i < 3 ? '管理员' : ROLES[randomInt(2, ROLES.length - 1)]);
  const supervisor = i === 0 ? null : USER_NAMES[randomInt(0, 5)];
  
  mockMembers.push({
    id: `M${String(i + 1).padStart(6, '0')}`,
    name: name,
    avatar: getUserAvatar(name),
    department: department,
    phone: `138${String(randomInt(10000000, 99999999))}`,
    email: `${name.toLowerCase()}${randomInt(1, 999)}@example.com`,
    supervisor: supervisor,
    role: role,
    joinTime: randomDate(new Date(2024, 0, 1), new Date(2025, 9, 12)).toISOString().slice(0, 10),
    isLeader: Math.random() > 0.9,
  });
}

// ==================== 权限数据 ====================
const PERMISSION_ROLES = ['所有者', '管理员', '空间创建员'];

const mockPermissions = [];
for (let i = 0; i < 7; i++) {
  const user = mockMembers[i];
  const operator = mockMembers[randomInt(0, 2)];
  mockPermissions.push({
    id: `P${String(i + 1).padStart(6, '0')}`,
    name: user.name,
    avatar: user.avatar,
    role: PERMISSION_ROLES[i < 1 ? 0 : (i < 3 ? 1 : 2)],
    operator: operator.name,
    operatorAvatar: operator.avatar,
    operateTime: randomDate(new Date(2025, 0, 1), new Date(2025, 9, 12)).toISOString().slice(0, 19).replace('T', ' '),
  });
}

// ==================== 订阅与配额数据 ====================
function generateSubscriptionData() {
  return {
    currentPlan: {
      version: '团队版',
      expireDate: '2026-09-03',
      credits: 22500,
    },
    quotas: [
      {
        id: 'desktop_device',
        name: '云电脑设备使用时长',
        icon: '💻',
        used: 0,
        total: 60000,
        unit: '分钟/月',
        percentage: 0,
        status: 'normal',
      },
      {
        id: 'mobile_device',
        name: '手机设备使用时长',
        icon: '📱',
        used: 0,
        total: 6000,
        unit: '分钟/月',
        percentage: 0,
        status: 'normal',
      },
      {
        id: 'workflow',
        name: '新建工作流',
        icon: '🔄',
        used: 12,
        total: 10,
        unit: '个',
        percentage: 120,
        status: 'exceeded',
        warningText: '用量已超额，请调整配额',
      },
      {
        id: 'tool',
        name: '新建工具',
        icon: '🔧',
        used: 0,
        total: 10,
        unit: '个',
        percentage: 0,
        status: 'normal',
      },
      {
        id: 'agent',
        name: '新建智能体',
        icon: '🤖',
        used: 5,
        total: 10,
        unit: '个',
        percentage: 50,
        status: 'normal',
      },
      {
        id: 'space',
        name: '新建空间',
        icon: '📁',
        used: 3,
        total: 10,
        unit: '个',
        percentage: 30,
        status: 'normal',
      },
      {
        id: 'component_library',
        name: '新建组件库',
        icon: '📦',
        used: 0,
        total: 10,
        unit: '个',
        percentage: 0,
        status: 'normal',
      },
    ],
  };
}

// 为租户生成资产数据
function generateTenantAssets(tenantId) {
  const now = new Date();
  const assets = {
    agents: [],
    workflows: [],
    tools: [],
    toolLibraries: [],
    knowledgeBases: [],
    spaces: []
  };
  
  // 生成智能体数据
  for (let i = 0; i < randomInt(5, 20); i++) {
    const createDate = randomDate(new Date(now.getFullYear(), now.getMonth() - 3, 1), now);
    const lastRunDate = randomDate(createDate, now);
    
    assets.agents.push({
      id: `AG${String(i + 1).padStart(6, '0')}`,
      name: `智能体 ${i + 1}`,
      runCount: randomInt(0, 10000),
      userCount: randomInt(0, 500),
      dialogCount: randomInt(0, 50000),
      tokenConsumption: randomInt(0, 5000000),
      status: Math.random() > 0.2 ? '已发布' : '已删除',
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)],
      createTime: createDate,
      lastUpdateTime: randomDate(createDate, now),
      lastRunTime: lastRunDate
    });
  }
  
  // 生成工作流数据
  for (let i = 0; i < randomInt(3, 15); i++) {
    const createDate = randomDate(new Date(now.getFullYear(), now.getMonth() - 3, 1), now);
    
    assets.workflows.push({
      id: `WF${String(i + 1).padStart(6, '0')}`,
      name: `工作流 ${i + 1}`,
      runCount: randomInt(0, 5000),
      userCount: randomInt(0, 200),
      tokenConsumption: randomInt(0, 2000000),
      status: Math.random() > 0.15 ? '已发布' : '已删除',
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)],
      createTime: createDate,
      lastUpdateTime: randomDate(createDate, now),
      lastRunTime: randomDate(createDate, now)
    });
  }
  
  // 生成工具库数据
  const toolLibNames = ['常用工具集', 'API工具库', '数据处理工具库', '文件操作库', '通信工具集'];
  for (let i = 0; i < randomInt(2, 8); i++) {
    assets.toolLibraries.push({
      id: `LIB${String(i + 1).padStart(6, '0')}`,
      name: toolLibNames[i] || `工具库 ${i + 1}`,
      status: Math.random() > 0.1 ? '启用' : '禁用',
      type: ['公开', '私有', '团队'][randomInt(0, 2)],
      toolCount: randomInt(1, 20),
      createTime: randomDate(new Date(now.getFullYear() - 1, 0, 1), now),
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)]
    });
  }
  
  // 生成工具数据
  const toolNames = ['数据可视化工具', 'PDF智能解析器', '图片处理工具', '文本分析器', '邮件批量发送'];
  for (let i = 0; i < randomInt(10, 30); i++) {
    assets.tools.push({
      id: `TL${String(i + 1).padStart(6, '0')}`,
      name: toolNames[i % toolNames.length] + ` ${i + 1}`,
      library: toolLibNames[randomInt(0, toolLibNames.length - 1)],
      agentRefCount: randomInt(0, 50),
      workflowRefCount: randomInt(0, 30),
      createTime: randomDate(new Date(now.getFullYear(), now.getMonth() - 6, 1), now),
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)]
    });
  }
  
  // 生成知识库数据
  const kbNames = ['产品知识库', '技术文档库', '客户案例集', '行业报告库', '培训资料库'];
  for (let i = 0; i < randomInt(3, 12); i++) {
    assets.knowledgeBases.push({
      id: `KB${String(i + 1).padStart(6, '0')}`,
      name: kbNames[i % kbNames.length] + ` ${i + 1}`,
      status: Math.random() > 0.15 ? '启用' : '未启用',
      unitCount: randomInt(10, 1000),
      refCount: randomInt(0, 500),
      storageSize: randomInt(1, 1024) * 1024 * 1024, // bytes
      createTime: randomDate(new Date(now.getFullYear(), now.getMonth() - 6, 1), now),
      creator: USER_NAMES[randomInt(0, USER_NAMES.length - 1)]
    });
  }
  
  // 生成空间数据
  const spaceNames = ['默认空间', '项目Alpha', '营销团队空间', '研发中心', '客户服务空间'];
  for (let i = 0; i < randomInt(1, 5); i++) {
    const createDate = randomDate(new Date(now.getFullYear() - 1, 0, 1), now);
    const creator = USER_NAMES[randomInt(0, USER_NAMES.length - 1)];
    
    assets.spaces.push({
      id: `SP${String(i + 1).padStart(6, '0')}`,
      name: spaceNames[i % spaceNames.length] + ` ${i + 1}`,
      type: ['个人', '团队', '部门'][randomInt(0, 2)],
      owner: creator,
      creator: creator,
      createTime: createDate,
      lastUpdater: USER_NAMES[randomInt(0, USER_NAMES.length - 1)],
      lastUpdateTime: randomDate(createDate, now)
    });
  }
  
  return assets;
}

// 生成租户付费记录数据
function generatePaymentRecords(tenantId) {
  const records = [];
  const now = new Date();
  const behaviors = ['充值积分', '购买 - Bots - 企业版', '购买 - Bots - 团队版'];
  const operators = ['张伟', '李娜', '王强', '刘洋', '陈敏', '杨静', '黄磊', '赵勇', '周杰', '吴涛'];
  
  // 生成50-100条付费记录
  const count = randomInt(50, 100);
  
  for (let i = 0; i < count; i++) {
    const recordDate = randomDate(
      new Date(now.getFullYear() - 1, 0, 1),
      now
    );
    const behavior = behaviors[randomInt(0, behaviors.length - 1)];
    const operator = operators[randomInt(0, operators.length - 1)];
    
    let amount = 0;
    if (behavior === '充值积分') {
      amount = randomInt(1000, 50000); // 1000-50000 w币
    } else if (behavior === '购买 - Bots - 企业版') {
      amount = randomInt(50000, 200000); // 50000-200000 w币
    } else if (behavior === '购买 - Bots - 团队版') {
      amount = randomInt(10000, 50000); // 10000-50000 w币
    }
    
    records.push({
      id: `PAY${String(i + 1).padStart(8, '0')}`,
      behavior: behavior,
      date: recordDate,
      operator: operator,
      amount: amount
    });
  }
  
  // 按时间降序排序
  records.sort((a, b) => b.date - a.date);
  
  return records;
}

// 导出所有数据
window.MockData = {
  tenants: mockTenants,
  dashboardStats: dashboardStats,
  generateDashboardData: generateDashboardData,
  generateTimeSeriesData: generateTimeSeriesData,
  generateDualLineData: generateDualLineData,
  generateModelRankingData: generateModelRankingData,
  generateAssetRankingData: generateAssetRankingData,
  generateTop10Users: generateTop10Users,
  billingRecords: mockBillingRecords,
  agents: mockAgents,
  workflows: mockWorkflows,
  tools: mockTools,
  toolLibraries: mockToolLibraries,
  knowledgeBases: mockKnowledgeBases,
  spaces: mockSpaces,
  members: mockMembers,
  departments: DEPARTMENTS,
  permissions: mockPermissions,
  generateSubscriptionData: generateSubscriptionData,
  getUserAvatar: getUserAvatar,
  // 新增租户资产数据生成函数
  getAgents: (tenantId) => generateTenantAssets(tenantId).agents,
  getWorkflows: (tenantId) => generateTenantAssets(tenantId).workflows,
  getTools: (tenantId) => generateTenantAssets(tenantId).tools,
  getToolLibraries: (tenantId) => generateTenantAssets(tenantId).toolLibraries,
  getKnowledgeBases: (tenantId) => generateTenantAssets(tenantId).knowledgeBases,
  getSpaces: (tenantId) => generateTenantAssets(tenantId).spaces,
  // 新增付费记录数据生成函数
  getPaymentRecords: (tenantId) => generatePaymentRecords(tenantId),
};

