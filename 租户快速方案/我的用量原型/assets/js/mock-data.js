/**
 * Mock 数据生成器 V5 - Mock Data Generator
 * 从零构建，支持用户管理V1.1方案的所有数据需求
 */

(function() {
  'use strict';
  
  // ==================== 数据池 ====================
  const DataPool = {
    firstNames: ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴',
                 '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '罗',
                 '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹'],
    
    lastNames: ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
                '勇', '艳', '涛', '杰', '超', '明', '秀', '霞', '刚', '平',
                '辉', '波', '鹏', '燕', '玲', '婷', '华', '飞', '峰', '斌'],
    
    tenantNames: ['创新科技有限公司', '云端智能', '数字未来科技', '星辰网络', '飞跃互联',
                  '智慧方舟', '量子实验室', '蓝海科技', '极光工作室', '未来实验室',
                  '创想空间', '智能工坊', '数据魔方', '创客联盟', '科技前沿',
                  '天马行空', '睿智网络', '鼎盛互联', '精英团队', '卓越科技'],
    
    agentNames: ['智能客服助手', 'AI写作助理', '数据分析师', '代码审查机器人', '翻译专家',
                 '文案生成器', '市场分析师', '法律顾问AI', '医疗健康助手', '教育导师',
                 '财务智能分析', '设计师助手', '产品经理助手', 'HR智能助理', '销售顾问',
                 '内容审核员', '知识问答机器人', '编程助手Pro', '邮件智能助手', '会议记录员'],
    
    workflowNames: ['订单自动处理', '客户服务流程', '数据清洗与分析', '内容智能审核', '报告自动生成',
                    '自动化测试流程', '发票处理系统', '合同智能审批', '招聘流程自动化', '员工培训流程',
                    '数据实时同步', '邮件营销自动化', '用户注册流程', '产品发布流程', '质量检测流程'],
    
    toolNames: ['数据可视化工具', 'PDF智能解析器', '图片处理工具', '文本分析器', '邮件批量发送',
                'API调用器', '数据库连接器', '文件格式转换', '加密工具箱', 'OCR文字识别',
                'JSON解析器', 'Excel处理器', '网页数据爬虫', '语音识别引擎', '图像识别AI'],
    
    toolLibNames: ['常用工具集', 'API工具库', '数据处理工具库', '文件操作库', '通信工具集',
                   '安全工具库', '分析工具集', '转换工具库', '开发者工具', '运维工具集'],
    
    knowledgeBaseNames: ['产品知识库', '技术文档库', '客户案例集', '行业报告库', '培训资料库',
                         '法律法规库', '公司规章制度', '最佳实践库', 'FAQ问答库', '用户手册库'],
    
    spaceNames: ['默认空间', '项目Alpha', '营销团队空间', '研发中心', '客户服务空间',
                 '数据分析空间', '运营团队', '产品设计空间', '技术支持空间', '人力资源空间'],
    
    models: ['GPT-4o', 'GPT-4o-mini', 'GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Claude 3 Haiku',
             'Claude 3 Opus', 'Gemini Pro', 'Gemini 1.5 Pro', 'Llama 3 70B', 'Llama 3 8B',
             '通义千问-Max', '通义千问-Plus', '文心一言 4.0', 'Kimi', 'GLM-4'],
    
    resourceTypes: ['Token', '云电脑设备时长', '云手机设备时长', '存储空间', '带宽流量', 'API调用'],
    
    actions: ['运行智能体', '运行工作流', '调用大模型', '数据分析', '文本生成', '图片生成',
              '使用云电脑', '使用云手机', '文件上传', '文件下载', 'API调用'],
    
    domains: ['gmail.com', '163.com', 'qq.com', 'outlook.com', 'company.com', 'tech.com', 'email.com']
  };
  
  // ==================== 工具函数 ====================
  const MockUtils = {
    randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },
    
    randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomFloat(min, max, decimals = 2) {
      return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    },
    
    generateId(prefix = '', length = 8) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = prefix;
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    
    randomBool(probability = 0.5) {
      return Math.random() < probability;
    },
    
    randomItems(arr, count) {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, arr.length));
    },
    
    generateAvatar(name) {
      // 生成带名字首字母的头像URL
      const firstChar = name ? name.charAt(0) : '用';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=random&size=128`;
    }
  };
  
  // ==================== 租户数据生成 ====================
  let cachedTenants = null;
  
  function generateTenants() {
    if (cachedTenants) return cachedTenants;
    
    // 尝试从localStorage加载
    const storedTenants = localStorage.getItem('mockTenants');
    if (storedTenants) {
      try {
        cachedTenants = JSON.parse(storedTenants);
        return cachedTenants;
      } catch (e) {
        console.warn('Failed to load cached tenants:', e);
      }
    }
    
    const tenants = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 2, 0, 1),
        new Date(now.getFullYear(), now.getMonth() - 1, 1)
      );
      
      tenants.push({
        id: MockUtils.generateId('T', 6),
        name: DataPool.tenantNames[i] || `租户${i + 1}`,
        version: MockUtils.randomItem(['个人版', '团队版', '企业版']),
        owner: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        memberCount: MockUtils.randomInt(1, 50),
        status: MockUtils.randomBool(0.9) ? '正常' : '已禁用'
      });
    }
    
    cachedTenants = tenants;
    // 保存到localStorage
    try {
      localStorage.setItem('mockTenants', JSON.stringify(tenants));
    } catch (e) {
      console.warn('Failed to cache tenants:', e);
    }
    return tenants;
  }
  
  // ==================== 用户数据生成 ====================
  let cachedUsers = null;
  
  function generateUsers() {
    // 尝试从localStorage加载
    if (cachedUsers) return cachedUsers;
    
    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
      try {
        cachedUsers = JSON.parse(storedUsers);
        return cachedUsers;
      } catch (e) {
        console.warn('Failed to load cached users:', e);
      }
    }
    
    const users = [];
    const tenants = generateTenants();
    const now = new Date();
    
    for (let i = 0; i < 150; i++) {
      const firstName = MockUtils.randomItem(DataPool.firstNames);
      const lastName = MockUtils.randomItem(DataPool.lastNames);
      const name = firstName + lastName;
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        now
      );
      const lastLoginDate = MockUtils.randomDate(createDate, now);
      const lastActiveDate = MockUtils.randomDate(lastLoginDate, now);
      
      // 随机分配1-3个租户
      const userTenants = MockUtils.randomItems(tenants, MockUtils.randomInt(1, 3)).map(t => ({
        tenantId: t.id,
        tenantName: t.name,
        joinTime: MockUtils.randomDate(createDate, now),
        isOwner: MockUtils.randomBool(0.1)
      }));
      
      users.push({
        id: MockUtils.generateId('U', 8),
        name: name,
        avatar: MockUtils.generateAvatar(name),
        phone: `1${MockUtils.randomInt(3, 9)}${String(MockUtils.randomInt(10000000, 99999999))}`,
        email: `${name.toLowerCase()}${MockUtils.randomInt(1, 999)}@${MockUtils.randomItem(DataPool.domains)}`,
        mis: MockUtils.randomBool(0.3) ? `MIS${MockUtils.randomInt(10000, 99999)}` : null,
        createTime: createDate,
        lastLoginTime: lastLoginDate,
        lastActiveTime: lastActiveDate,
        status: MockUtils.randomBool(0.92) ? '正常' : '已禁用',
        balance: MockUtils.randomInt(0, 100000),
        tenants: userTenants
      });
    }
    
    cachedUsers = users;
    // 保存到localStorage
    try {
      localStorage.setItem('mockUsers', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to cache users:', e);
    }
    return users;
  }
  
  // ==================== 用户统计数据 ====================
  function getUserStats() {
    const users = generateUsers();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: users.length,
      normal: users.filter(u => u.status === '正常').length,
      disabled: users.filter(u => u.status === '已禁用').length,
      todayNew: users.filter(u => new Date(u.createTime) >= today).length,
      activeUsers: users.filter(u => new Date(u.lastActiveTime) >= sevenDaysAgo).length
    };
  }
  
  // ==================== 用户列表查询 ====================
  function getUsers(params = {}) {
    let users = [...generateUsers()];
    
    // 搜索过滤
    if (params.search) {
      const keyword = params.search.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(keyword) ||
        user.id.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.mis && user.mis.toLowerCase().includes(keyword))
      );
    }
    
    // 状态过滤
    if (params.status && params.status !== '全部') {
      users = users.filter(u => u.status === params.status);
    }
    
    // 租户过滤
    if (params.tenants && params.tenants.length > 0) {
      users = users.filter(u => 
        u.tenants.some(t => params.tenants.includes(t.tenantId))
      );
    }
    
    // 时间范围过滤
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      users = users.filter(u => {
        const createTime = new Date(u.createTime);
        return createTime >= start && createTime <= end;
      });
    }
    
    // 排序
    if (params.sortBy) {
      users.sort((a, b) => {
        const aVal = a[params.sortBy];
        const bVal = b[params.sortBy];
        const order = params.sortOrder === 'ascending' ? 1 : -1;
        return aVal > bVal ? order : -order;
      });
    }
    
    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      list: users.slice(start, end),
      total: users.length,
      page: page,
      pageSize: pageSize
    };
  }
  
  // ==================== 获取单个用户详情 ====================
  function getUserDetail(userId) {
    const users = generateUsers();
    return users.find(u => u.id === userId) || null;
  }
  
  // ==================== 更新用户余额 ====================
  function updateUserBalance(userId, amount, reason) {
    const users = generateUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.balance = Math.max(0, user.balance + amount);
      return true;
    }
    return false;
  }
  
  // ==================== 切换用户状态 ====================
  function toggleUserStatus(userId) {
    const users = generateUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === '正常' ? '已禁用' : '正常';
      return user.status;
    }
    return null;
  }
  
  // ==================== 资产数据生成 ====================
  function generateAssets(userId) {
    return {
      agents: generateAgents(userId),
      workflows: generateWorkflows(userId),
      tools: generateTools(userId),
      toolLibraries: generateToolLibraries(userId),
      knowledgeBases: generateKnowledgeBases(userId),
      spaces: generateSpaces(userId)
    };
  }
  
  function generateAgents(userId) {
    const count = MockUtils.randomInt(5, 20);
    const agents = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear(), now.getMonth() - 3, 1),
        now
      );
      const lastRunDate = MockUtils.randomDate(createDate, now);
      
      agents.push({
        id: MockUtils.generateId('AG', 6),
        name: MockUtils.randomItem(DataPool.agentNames) + ` ${i + 1}`,
        runCount: MockUtils.randomInt(0, 10000),
        userCount: MockUtils.randomInt(0, 500),
        dialogCount: MockUtils.randomInt(0, 50000),
        tokenConsumption: MockUtils.randomInt(0, 5000000),
        status: MockUtils.randomBool(0.8) ? '已发布' : '已删除',
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        lastUpdateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: lastRunDate
      });
    }
    
    return agents;
  }
  
  function generateWorkflows(userId) {
    const count = MockUtils.randomInt(3, 15);
    const workflows = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear(), now.getMonth() - 3, 1),
        now
      );
      
      workflows.push({
        id: MockUtils.generateId('WF', 6),
        name: MockUtils.randomItem(DataPool.workflowNames) + ` ${i + 1}`,
        runCount: MockUtils.randomInt(0, 5000),
        userCount: MockUtils.randomInt(0, 200),
        tokenConsumption: MockUtils.randomInt(0, 2000000),
        status: MockUtils.randomBool(0.85) ? '已发布' : '已删除',
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        lastUpdateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: MockUtils.randomDate(createDate, now)
      });
    }
    
    return workflows;
  }
  
  function generateTools(userId) {
    const count = MockUtils.randomInt(10, 30);
    const tools = [];
    const toolLibs = generateToolLibraries(userId);
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      tools.push({
        id: MockUtils.generateId('TL', 6),
        name: MockUtils.randomItem(DataPool.toolNames) + ` ${i + 1}`,
        library: MockUtils.randomItem(toolLibs).name,
        agentRefCount: MockUtils.randomInt(0, 50),
        workflowRefCount: MockUtils.randomInt(0, 30),
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear(), now.getMonth() - 6, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return tools;
  }
  
  function generateToolLibraries(userId) {
    const count = MockUtils.randomInt(2, 8);
    const libraries = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      libraries.push({
        id: MockUtils.generateId('LIB', 6),
        name: MockUtils.randomItem(DataPool.toolLibNames) + ` ${i + 1}`,
        status: MockUtils.randomBool(0.9) ? '启用' : '禁用',
        type: MockUtils.randomItem(['公开', '私有', '团队']),
        toolCount: MockUtils.randomInt(1, 20),
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear() - 1, 0, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return libraries;
  }
  
  function generateKnowledgeBases(userId) {
    const count = MockUtils.randomInt(3, 12);
    const bases = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      bases.push({
        id: MockUtils.generateId('KB', 6),
        name: MockUtils.randomItem(DataPool.knowledgeBaseNames) + ` ${i + 1}`,
        status: MockUtils.randomBool(0.85) ? '启用' : '未启用',
        unitCount: MockUtils.randomInt(10, 1000),
        refCount: MockUtils.randomInt(0, 500),
        storageSize: MockUtils.randomInt(1, 1024) * 1024 * 1024, // bytes
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear(), now.getMonth() - 6, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return bases;
  }
  
  function generateSpaces(userId) {
    const count = MockUtils.randomInt(1, 5);
    const spaces = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        now
      );
      const creator = MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames);
      
      spaces.push({
        id: MockUtils.generateId('SP', 6),
        name: MockUtils.randomItem(DataPool.spaceNames) + ` ${i + 1}`,
        type: MockUtils.randomItem(['个人', '团队', '部门']),
        owner: creator,
        creator: creator,
        createTime: createDate,
        lastUpdater: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        lastUpdateTime: MockUtils.randomDate(createDate, now)
      });
    }
    
    return spaces;
  }
  
  // ==================== 消费明细数据生成 ====================
  function generateConsumptionRecords(userId, params = {}) {
    const records = [];
    const now = new Date();
    const startDate = params.startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = params.endDate || now;
    const tenants = generateTenants();
    
    // 生成100-300条记录
    const count = MockUtils.randomInt(100, 300);
    
    for (let i = 0; i < count; i++) {
      const recordDate = MockUtils.randomDate(startDate, endDate);
      const resourceType = MockUtils.randomItem(DataPool.resourceTypes);
      const action = MockUtils.randomItem(DataPool.actions);
      const isConsumption = MockUtils.randomBool(0.95);
      const hasPoints = MockUtils.randomBool(0.8);
      
      let usage = '';
      let points = 0;
      
      if (resourceType === 'Token') {
        const inputTokens = MockUtils.randomInt(100, 10000);
        const outputTokens = MockUtils.randomInt(100, 8000);
        usage = `输入Token: ${inputTokens.toLocaleString()}, 输出Token: ${outputTokens.toLocaleString()}`;
        points = hasPoints ? Math.floor((inputTokens + outputTokens) / 100) : 0;
      } else if (resourceType.includes('设备时长')) {
        const minutes = MockUtils.randomInt(1, 120);
        usage = `${minutes}分钟`;
        points = hasPoints ? minutes * 10 : 0;
      } else {
        usage = `${MockUtils.randomInt(1, 100)} 单位`;
        points = hasPoints ? MockUtils.randomInt(10, 500) : 0;
      }
      
      records.push({
        id: MockUtils.generateId('RC', 8),
        date: recordDate,
        resourceType: resourceType,
        action: action,
        changeType: isConsumption ? '消耗' : '返还',
        usage: usage,
        points: isConsumption ? points : -points,
        tenant: MockUtils.randomItem(tenants).name
      });
    }
    
    // 按时间降序排序
    records.sort((a, b) => b.date - a.date);
    
    return records;
  }
  
  // ==================== 数据总览统计 ====================
  function getOverviewStats(userId, params = {}) {
    const assets = generateAssets(userId);
    
    return {
      // 资产创建总数
      assetCreation: {
        agents: assets.agents.length,
        workflows: assets.workflows.length,
        tools: assets.tools.length,
        toolLibraries: assets.toolLibraries.length,
        knowledgeBases: assets.knowledgeBases.length,
        spaces: assets.spaces.length
      },
      
      // 核心资产活跃度
      assetActivity: {
        agentRunCount: Utils.sum(assets.agents, 'runCount'),
        agentUserCount: Utils.sum(assets.agents, 'userCount'),
        agentDialogCount: Utils.sum(assets.agents, 'dialogCount'),
        agentTokens: Utils.sum(assets.agents, 'tokenConsumption'),
        workflowRunCount: Utils.sum(assets.workflows, 'runCount'),
        workflowSuccessRate: MockUtils.randomFloat(95, 99.5, 1),
        workflowUserCount: Utils.sum(assets.workflows, 'userCount'),
        workflowTokens: Utils.sum(assets.workflows, 'tokenConsumption'),
        toolRefCount: Utils.sum(assets.tools, 'agentRefCount') + Utils.sum(assets.tools, 'workflowRefCount'),
        knowledgeRefCount: Utils.sum(assets.knowledgeBases, 'refCount')
      },
      
      // 积分总览
      pointsOverview: {
        totalPoints: MockUtils.randomInt(30000, 100000),
        tokenPoints: MockUtils.randomInt(20000, 70000),
        devicePoints: MockUtils.randomInt(10000, 30000)
      },
      
      // Token消耗
      tokenConsumption: {
        total: MockUtils.randomInt(1000000, 5000000),
        input: MockUtils.randomInt(600000, 3000000),
        output: MockUtils.randomInt(400000, 2000000)
      },
      
      // 设备使用时长
      deviceUsage: {
        total: MockUtils.randomInt(1000, 5000),
        computer: MockUtils.randomInt(600, 3000),
        phone: MockUtils.randomInt(400, 2000)
      }
    };
  }
  
  // ==================== 清除缓存 ====================
  function clearCache() {
    cachedUsers = null;
    cachedTenants = null;
    try {
      localStorage.removeItem('mockUsers');
      localStorage.removeItem('mockTenants');
      console.log('Mock数据缓存已清除');
      return true;
    } catch (e) {
      console.error('清除缓存失败:', e);
      return false;
    }
  }
  
  // ==================== 用户配额数据生成 ====================
  function getUserQuota(userId, tenantId) {
    // 模拟配额数据
    const quotaTypes = [
      {
        name: '云电脑设备使用时长',
        icon: '💻',
        used: MockUtils.randomInt(0, 200), // 0-200小时
        total: -1, // -1表示无限制
        unit: '小时'
      }
    ];
    
    return quotaTypes.map(quota => {
      const usagePercent = quota.total === -1 ? 0 : Math.min((quota.used / quota.total) * 100, 100);
      return {
        ...quota,
        usagePercent: Math.round(usagePercent),
        tenantId: tenantId
      };
    });
  }
  
  // ==================== 个人付费记录数据生成 ====================
  function generatePersonalPaymentRecords(userId) {
    const records = [];
    const now = new Date();
    const behaviors = ['充值积分', '订阅套餐 - 企业版', '续费套餐 - 团队版', '订阅套餐 - 团队版', '续费套餐 - 企业版'];
    const operators = ['张伟', '李娜', '王强', '刘洋', '陈敏', '杨静', '黄磊', '赵勇', '周杰', '吴涛'];
    const tenants = generateTenants();
    
    // 生成30-80条个人付费记录
    const count = MockUtils.randomInt(30, 80);
    
    for (let i = 0; i < count; i++) {
      const recordDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        now
      );
      const behavior = behaviors[MockUtils.randomInt(0, behaviors.length - 1)];
      const operator = operators[MockUtils.randomInt(0, operators.length - 1)];
      const targetTenant = tenants[MockUtils.randomInt(0, tenants.length - 1)];
      
      let amount = 0;
      if (behavior === '充值积分') {
        amount = MockUtils.randomInt(1000, 50000); // 1000-50000 w币
      } else if (behavior.includes('企业版')) {
        amount = MockUtils.randomInt(50000, 200000); // 50000-200000 w币
      } else if (behavior.includes('团队版')) {
        amount = MockUtils.randomInt(10000, 50000); // 10000-50000 w币
      }
      
      records.push({
        id: `PP${String(i + 1).padStart(8, '0')}`,
        behavior: behavior,
        date: recordDate,
        operator: operator,
        targetTenant: targetTenant.name,
        targetTenantId: targetTenant.id,
        amount: amount
      });
    }
    
    // 按时间降序排序
    records.sort((a, b) => b.date - a.date);
    
    return records;
  }

  // ==================== 导出 MockData ====================
  window.MockData = {
    // 租户相关
    getAllTenants: () => generateTenants().map(t => ({ value: t.id, label: t.name })),
    getTenants: generateTenants,
    
    // 用户相关
    getUsers,
    getUserDetail,
    getUserStats,
    updateUserBalance,
    toggleUserStatus,
    
    // 资产相关
    getAssets: generateAssets,
    getAgents: generateAgents,
    getWorkflows: generateWorkflows,
    getTools: generateTools,
    getToolLibraries: generateToolLibraries,
    getKnowledgeBases: generateKnowledgeBases,
    getSpaces: generateSpaces,
    
    // 消费相关
    getConsumptionRecords: generateConsumptionRecords,
    
    // 数据总览
    getOverviewStats: getOverviewStats,
    
    // 个人付费记录
    getPersonalPaymentRecords: generatePersonalPaymentRecords,
    
    // 用户配额
    getUserQuota: getUserQuota,
    
    // 工具函数
    clearCache,
    
    // 数据池和工具（用于图表等）
    DataPool,
    MockUtils
  };
  
})();

