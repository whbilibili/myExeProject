/**
 * Mock数据生成器 - Mock Data Generator
 * 生成真实感的用户、租户、资产、消费记录等数据
 */

(function() {
  'use strict';

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
    
    generateId(prefix = '') {
      return prefix + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },
    
    randomBool(probability = 0.5) {
      return Math.random() < probability;
    },
    
    randomItems(arr, count) {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, arr.length));
    }
  };

  // ==================== 数据池 ====================
  const DataPool = {
    firstNames: ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', 
               '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
               '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧'],
    
    lastNames: ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', 
                 '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞', '平', '刚',
                '华', '建国', '飞', '鹏', '婷', '雷', '宇', '波', '斌', '凯'],
    
    tenantNames: ['创新科技', '云端智能', '数字未来', '星辰科技', '飞跃互联', 
                  '智慧方舟', '量子实验室', '蓝海科技', '极光工作室', '未来实验室', 
                  '创想空间', '智能工坊', '数据魔方', '创客联盟', '科技前沿',
                  '天马科技', '睿智网络', '鼎盛互联', '精英团队', '卓越科技'],
    
    agentNames: ['智能客服助手', 'AI写作助理', '数据分析师', '代码审查机器人', '翻译专家', 
               '文案生成器', '市场分析师', '法律顾问', '医疗助手', '教育导师', 
                 '财务分析员', '设计师助手', '产品经理', 'HR助手', '销售顾问',
                 '内容审核员', '知识问答', '编程助手', '邮件助手', '会议记录员'],
    
    workflowNames: ['订单处理流程', '客户服务流程', '数据清洗流程', '内容审核流程', '报告生成流程', 
                    '自动化测试流程', '发票处理流程', '合同审批流程', '招聘流程', '培训流程',
                    '数据同步流程', '邮件营销流程', '用户注册流程', '产品发布流程', '质量检测流程'],
    
    toolNames: ['数据可视化工具', 'PDF解析器', '图片处理工具', '文本分析器', '邮件发送器', 
                'API调用器', '数据库连接器', '文件转换器', '加密工具', 'OCR识别器',
                'JSON解析器', 'Excel处理器', '网页爬虫', '语音识别', '图像识别'],
    
    toolLibNames: ['常用工具集', 'API工具库', '数据处理库', '文件操作库', '通信工具库', 
                   '安全工具库', '分析工具库', '转换工具库'],
    
    knowledgeBaseNames: ['产品知识库', '技术文档库', '客户案例库', '行业报告库', '培训资料库', 
                         '法律法规库', '内部规章库', '最佳实践库'],
    
    spaceNames: ['默认空间', '项目A空间', '营销团队空间', '研发中心', '客户服务空间', 
                 '数据分析空间', '运营团队空间', '产品设计空间'],
    
    models: ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet', 'Claude 3 Haiku', 
             'Gemini Pro', 'Llama 3 70B', '通义千问', '文心一言', 'Kimi'],
    
    resourceTypes: ['Token', '云电脑设备时长', '云手机设备时长', '存储空间', '带宽流量'],
    
    actions: ['运行智能体', '运行工作流', '调用API', '数据分析', '文本生成', '图片生成', '使用云电脑', '使用云手机']
  };

  // ==================== 租户数据生成 ====================
  function generateTenants() {
    const tenants = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 2, 0, 1),
        new Date(now.getFullYear(), now.getMonth() - 1, 1)
      );
      
      tenants.push({
        id: `T${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.tenantNames[i] || `租户${i + 1}`,
        version: MockUtils.randomItem(['个人版', '团队版', '企业版']),
        owner: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        memberCount: MockUtils.randomInt(3, 100),
        status: MockUtils.randomBool(0.95) ? '正常' : '已禁用'
      });
    }
    
    return tenants;
  }

  // ==================== 用户数据生成 ====================
  function generateUsers(tenants) {
    const users = [];
    const now = new Date();
    
    for (let i = 0; i < 120; i++) {
      const firstName = MockUtils.randomItem(DataPool.firstNames);
      const lastName = MockUtils.randomItem(DataPool.lastNames);
      const name = firstName + lastName;
      
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 3, 0, 1),
        new Date()
      );
      
      const lastLoginDate = MockUtils.randomDate(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        new Date()
      );
      
      // 随机分配1-5个租户
      const userTenantCount = MockUtils.randomInt(1, 5);
      const userTenants = MockUtils.randomItems(tenants, userTenantCount);
      
      const phone = `13${MockUtils.randomInt(0, 9)}${String(MockUtils.randomInt(10000000, 99999999))}`;
      const email = `${name.toLowerCase()}${MockUtils.randomInt(100, 999)}@example.com`;
      const mis = MockUtils.randomBool(0.3) ? `MIS${String(MockUtils.randomInt(10000, 99999))}` : null;
      
      users.push({
        id: `U${String(100000 + i).padStart(8, '0')}`,
        name: name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        phone: phone,
        email: email,
        mis: mis,
        createTime: createDate,
        lastLoginTime: lastLoginDate,
        status: MockUtils.randomBool(0.9) ? '正常' : '已禁用',
        balance: MockUtils.randomInt(0, 100000),
        tenants: userTenants.map(t => ({
          tenantId: t.id,
          tenantName: t.name,
          joinTime: MockUtils.randomDate(createDate, now),
          isOwner: false
        }))
      });
    }
    
    // 为每个租户设置一个owner
    tenants.forEach(tenant => {
      const ownerUser = MockUtils.randomItem(users);
      const tenantInfo = ownerUser.tenants.find(t => t.tenantId === tenant.id);
      if (tenantInfo) {
        tenantInfo.isOwner = true;
      } else {
        ownerUser.tenants.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          joinTime: tenant.createTime,
          isOwner: true
        });
      }
    });
    
    return users;
  }

  // ==================== 资产数据生成 ====================
  function generateAssets(users, tenants) {
    const assets = {
      agents: [],
      workflows: [],
      tools: [],
      toolLibs: [],
      knowledgeBases: [],
      spaces: []
    };
    
    const now = new Date();
    
    // 智能体
    for (let i = 0; i < 80; i++) {
      const creator = MockUtils.randomItem(users);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        new Date()
      );
      
      assets.agents.push({
        id: `AGT${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.agentNames[i % DataPool.agentNames.length] + (i >= DataPool.agentNames.length ? ` ${Math.floor(i / DataPool.agentNames.length) + 1}` : ''),
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        updateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: MockUtils.randomDate(createDate, now),
        runCount: MockUtils.randomInt(100, 50000),
        userCount: MockUtils.randomInt(5, 500),
        successRate: MockUtils.randomFloat(85, 99.9, 1),
        status: MockUtils.randomBool(0.85) ? '已发布' : '已删除'
      });
    }
    
    // 工作流
    for (let i = 0; i < 60; i++) {
      const creator = MockUtils.randomItem(users);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        new Date()
      );
      
      assets.workflows.push({
        id: `WF${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.workflowNames[i % DataPool.workflowNames.length] + (i >= DataPool.workflowNames.length ? ` ${Math.floor(i / DataPool.workflowNames.length) + 1}` : ''),
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        updateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: MockUtils.randomDate(createDate, now),
        runCount: MockUtils.randomInt(50, 10000),
        userCount: MockUtils.randomInt(3, 200),
        successRate: MockUtils.randomFloat(80, 99.5, 1),
        status: MockUtils.randomBool(0.8) ? '已发布' : '已删除'
      });
    }
    
    // 工具库
    for (let i = 0; i < 8; i++) {
      const creator = MockUtils.randomItem(users);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 2, 0, 1),
        new Date()
      );
      
      assets.toolLibs.push({
        id: `TL${String(1000 + i).padStart(5, '0')}`,
        name: DataPool.toolLibNames[i],
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        type: MockUtils.randomItem(['官方', '第三方', '自建']),
        status: MockUtils.randomBool(0.9) ? '启用' : '未启用',
        toolCount: 0 // 后续填充
      });
    }
    
    // 工具
    for (let i = 0; i < 100; i++) {
      const creator = MockUtils.randomItem(users);
      const toolLib = MockUtils.randomItem(assets.toolLibs);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 2, 0, 1),
        new Date()
      );
      
      toolLib.toolCount++;
      
      assets.tools.push({
        id: `TL${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.toolNames[i % DataPool.toolNames.length] + (i >= DataPool.toolNames.length ? ` ${Math.floor(i / DataPool.toolNames.length) + 1}` : ''),
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        toolLibId: toolLib.id,
        toolLibName: toolLib.name,
        agentRefCount: MockUtils.randomInt(0, 500),
        workflowRefCount: MockUtils.randomInt(0, 300)
      });
    }
    
    // 知识库
    for (let i = 0; i < 50; i++) {
      const creator = MockUtils.randomItem(users);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 1, 0, 1),
        new Date()
      );
      
      assets.knowledgeBases.push({
        id: `KB${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.knowledgeBaseNames[i % DataPool.knowledgeBaseNames.length] + (i >= DataPool.knowledgeBaseNames.length ? ` ${Math.floor(i / DataPool.knowledgeBaseNames.length) + 1}` : ''),
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        status: MockUtils.randomBool(0.85) ? '启用' : '未启用',
        unitCount: MockUtils.randomInt(10, 1000),
        refCount: MockUtils.randomInt(0, 2000),
        size: MockUtils.randomInt(1024 * 1024, 1024 * 1024 * 1024) // 1MB - 1GB
      });
    }
    
    // 空间
    for (let i = 0; i < 40; i++) {
      const creator = MockUtils.randomItem(users);
      const tenant = MockUtils.randomItem(tenants);
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear() - 2, 0, 1),
        new Date()
      );
      const updateDate = MockUtils.randomDate(createDate, now);
      
      assets.spaces.push({
        id: `SP${String(10000 + i).padStart(6, '0')}`,
        name: DataPool.spaceNames[i % DataPool.spaceNames.length] + (i >= DataPool.spaceNames.length ? ` ${Math.floor(i / DataPool.spaceNames.length) + 1}` : ''),
        creator: creator.name,
        creatorId: creator.id,
        createTime: createDate,
        owner: tenant.owner,
        type: MockUtils.randomItem(['个人空间', '团队空间', '项目空间']),
        lastUpdater: MockUtils.randomItem(users).name,
        lastUpdateTime: updateDate
      });
    }
    
    return assets;
  }

  // ==================== 消费记录生成 ====================
  function generateConsumptionRecords(users, models) {
    const records = [];
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1); // 最近3个月
    
    for (let i = 0; i < 1000; i++) {
      const user = MockUtils.randomItem(users);
      const tenant = MockUtils.randomItem(user.tenants);
      const resourceType = MockUtils.randomItem(DataPool.resourceTypes);
      const date = MockUtils.randomDate(startDate, now);
      
      let usage = '';
      let points = 0;
      let action = '';
      
      if (resourceType === 'Token') {
        const inputTokens = MockUtils.randomInt(100, 10000);
        const outputTokens = MockUtils.randomInt(100, 5000);
        usage = `输入Token: ${inputTokens}, 输出Token: ${outputTokens}`;
        points = Math.floor((inputTokens * 0.01 + outputTokens * 0.02));
        action = `调用${MockUtils.randomItem(models)}`;
      } else if (resourceType.includes('设备时长')) {
        const duration = MockUtils.randomInt(5, 120);
        usage = `${duration}分钟`;
        points = duration * MockUtils.randomInt(5, 15);
        action = resourceType.includes('云电脑') ? '使用云电脑' : '使用云手机';
      } else {
        usage = `${MockUtils.randomFloat(0.1, 10, 2)} GB`;
        points = MockUtils.randomInt(10, 100);
        action = MockUtils.randomItem(DataPool.actions);
      }
      
      records.push({
        id: `CR${String(100000 + i).padStart(8, '0')}`,
        userId: user.id,
        date: date,
        resourceType: resourceType,
        action: action,
        changeType: MockUtils.randomBool(0.95) ? '消耗' : '返还',
        usage: usage,
        points: points,
        tenant: tenant.tenantName,
        hasPointsConsumed: MockUtils.randomBool(0.8)
      });
    }
    
    // 按日期降序排序
    records.sort((a, b) => b.date - a.date);
    
    return records;
  }

  // ==================== 图表数据生成 ====================
  function generateChartData() {
    const now = new Date();
    
    // 积分消耗趋势（最近30天）- 总量
    const pointsTrend = [];
    // 积分消耗趋势（最近30天）- 分解：Token积分 vs 设备积分
    const pointsTrendBreakdown = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const tokenPts = MockUtils.randomInt(800, 4000);
      const devicePts = MockUtils.randomInt(200, 1200);
      pointsTrend.push({
        date: Utils.formatDate(date, 'MM-DD'),
        value: tokenPts + devicePts
      });
      pointsTrendBreakdown.push({
        date: Utils.formatDate(date, 'MM-DD'),
        tokenPoints: tokenPts,
        devicePoints: devicePts
      });
    }

    // 积分消耗构成
    const pointsComposition = [
      { name: 'Token消耗', value: 35000 },
      { name: '云电脑抵扣', value: 12000 },
      { name: '云手机抵扣', value: 3000 }
    ];

    // 按模型积分消耗排行（Top 20）
    const modelRanking = DataPool.models.map(model => ({
      name: model,
      value: MockUtils.randomInt(1000, 10000)
    })).sort((a, b) => b.value - a.value);

    // 按设备积分消耗分布
    const deviceDistribution = [
      { name: '云电脑', value: 12000 },
      { name: '云手机', value: 3000 }
    ];

    // Token消耗趋势（总量）
    const tokenTrend = [];
    // Token消耗趋势（输入/输出）
    const tokenIOTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const inputTok = MockUtils.randomInt(250000, 1200000);
      const outputTok = MockUtils.randomInt(120000, 800000);
      tokenTrend.push({
        date: Utils.formatDate(date, 'MM-DD'),
        value: inputTok + outputTok
      });
      tokenIOTrend.push({
        date: Utils.formatDate(date, 'MM-DD'),
        inputTokens: inputTok,
        outputTokens: outputTok
      });
    }

    // 输入/输出Token构成
    const tokenComposition = [
      { name: '输入Token', value: 1500100 },
      { name: '输出Token', value: 845578 }
    ];

    // 模型Token消耗分析
    const modelTokenAnalysis = DataPool.models.map(model => ({
      name: model,
      value: MockUtils.randomInt(100000, 1000000)
    })).sort((a, b) => b.value - a.value);

    // 设备使用时长趋势
    const deviceTimeTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      deviceTimeTrend.push({
        date: Utils.formatDate(date, 'MM-DD'),
        cloudPC: MockUtils.randomInt(50, 200),
        cloudPhone: MockUtils.randomInt(20, 100)
      });
    }

    // 使用与抵扣趋势
    const usageDeductionTrend = [];
      for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const totalTime = MockUtils.randomInt(100, 300);
      usageDeductionTrend.push({
        date: Utils.formatDate(date, 'MM-DD'),
        totalTime: totalTime,
        deductionTime: Math.floor(totalTime * MockUtils.randomFloat(0.6, 0.9))
      });
    }

    return {
      pointsTrend,
      pointsTrendBreakdown,
      pointsComposition,
      modelRanking,
      deviceDistribution,
      tokenTrend,
      tokenIOTrend,
      tokenComposition,
      modelTokenAnalysis,
      deviceTimeTrend,
      usageDeductionTrend
    };
  }

  // ==================== 初始化数据 ====================
  const tenants = generateTenants();
  const users = generateUsers(tenants);
  const assets = generateAssets(users, tenants);
  const consumptionRecords = generateConsumptionRecords(users, DataPool.models);
  const chartData = generateChartData();

  // ==================== 数据操作API ====================
  window.MockData = {
    // 原始数据
    tenants: tenants,
    users: users,
    assets: assets,
    consumptionRecords: consumptionRecords,
    chartData: chartData,

    // 获取用户列表（带搜索、筛选、分页）
    getUsers(params = {}) {
      let filtered = [...this.users];

      // 模糊搜索
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(search) ||
          user.id.toLowerCase().includes(search) ||
          user.phone.includes(search) ||
          user.email.toLowerCase().includes(search) ||
          (user.mis && user.mis.toLowerCase().includes(search))
        );
      }

      // 状态筛选（支持“禁用/已禁用”同义）
      if (params.status && params.status !== '全部') {
        filtered = filtered.filter(user => user.status === params.status);
      }

      // 租户筛选
      if (params.tenants && params.tenants.length > 0) {
        filtered = filtered.filter(user => 
          user.tenants.some(t => params.tenants.includes(t.tenantId))
        );
      }

      // 创建时间筛选
      if (params.startDate && params.endDate) {
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        filtered = filtered.filter(user => {
          const createTime = new Date(user.createTime);
          return createTime >= start && createTime <= end;
        });
      }

      // 排序
      if (params.sortBy) {
        filtered.sort((a, b) => {
          let valA = a[params.sortBy];
          let valB = b[params.sortBy];
          
          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();
          
          if (params.sortOrder === 'asc') {
            return valA > valB ? 1 : -1;
          } else {
            return valA < valB ? 1 : -1;
          }
        });
      }

      // 分页
      const total = filtered.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filtered.slice(start, end);

      return {
        list: list,
        total: total,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    },

    // 获取用户统计
    getUserStats() {
      return {
        total: this.users.length,
        normal: this.users.filter(u => u.status === '正常').length,
        disabled: this.users.filter(u => u.status === '已禁用').length
      };
    },

    // 获取单个用户
    getUserById(userId) {
      return this.users.find(u => u.id === userId);
    },

    // 更新用户
    updateUser(userId, updates) {
      const user = this.getUserById(userId);
      if (user) {
        Object.assign(user, updates);
        return true;
      }
      return false;
    },

    // 禁用/启用用户
    toggleUserStatus(userId) {
      const user = this.getUserById(userId);
      if (user) {
        user.status = user.status === '正常' ? '已禁用' : '正常';
        return user.status;
      }
      return null;
    },

    // 修改账号金额
    updateUserBalance(userId, amount, reason) {
      const user = this.getUserById(userId);
      if (user) {
        user.balance += amount;
        // 这里可以记录操作日志
        return user.balance;
      }
      return null;
    },

    // 获取用户的资产数据
    getUserAssets(userId, params = {}) {
      const assets = {};
      
      // 根据时间和租户筛选（简化处理，实际应该根据资产的关联关系）
      for (const [key, items] of Object.entries(this.assets)) {
        assets[key] = items.filter(item => item.creatorId === userId);
      }
      
      return assets;
    },

    // 获取用户的消费记录
    getUserConsumptionRecords(userId, params = {}) {
      let filtered = this.consumptionRecords.filter(r => r.userId === userId);

      // 时间筛选
      if (params.startDate && params.endDate) {
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        filtered = filtered.filter(r => {
          const date = new Date(r.date);
          return date >= start && date <= end;
        });
      }

      // 资源类型筛选
      if (params.resourceTypes && params.resourceTypes.length > 0) {
        filtered = filtered.filter(r => params.resourceTypes.includes(r.resourceType));
      }

      // 变动类型筛选
      if (params.changeType && params.changeType !== '全部') {
        filtered = filtered.filter(r => r.changeType === params.changeType);
      }

      // 行为搜索
      if (params.actionSearch) {
        filtered = filtered.filter(r => r.action.includes(params.actionSearch));
      }

      // 是否消耗积分
      if (params.hasPointsConsumed !== undefined) {
        filtered = filtered.filter(r => r.hasPointsConsumed === params.hasPointsConsumed);
      }

      // 租户筛选
      if (params.tenant) {
        filtered = filtered.filter(r => r.tenant === params.tenant);
      }

      // 分页
      const total = filtered.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filtered.slice(start, end);

      return {
        list: list,
        total: total,
        page: page,
        pageSize: pageSize
      };
    },

    // 获取用户的租户列表
    getUserTenants(userId) {
      const user = this.getUserById(userId);
      return user ? user.tenants : [];
    },

    // 添加用户到租户
    addUserToTenant(userId, tenantIds) {
      const user = this.getUserById(userId);
      if (!user) return false;

      tenantIds.forEach(tenantId => {
        if (!user.tenants.find(t => t.tenantId === tenantId)) {
          const tenant = this.tenants.find(t => t.id === tenantId);
          if (tenant) {
            user.tenants.push({
              tenantId: tenant.id,
              tenantName: tenant.name,
              joinTime: new Date(),
              isOwner: false
            });
          }
        }
      });

      return true;
    },

    // 从租户移除用户
    removeUserFromTenant(userId, tenantIds) {
      const user = this.getUserById(userId);
      if (!user) return false;

      user.tenants = user.tenants.filter(t => 
        !tenantIds.includes(t.tenantId) || t.isOwner
      );

      return true;
    },

    // 获取所有租户（用于筛选器）
    getAllTenants() {
      return this.tenants.map(t => ({
        value: t.id,
        label: t.name
      }));
    }
  };

  console.log('Mock数据已加载:', {
    用户数: users.length,
    租户数: tenants.length,
    消费记录数: consumptionRecords.length,
    智能体数: assets.agents.length,
    工作流数: assets.workflows.length,
    工具数: assets.tools.length
  });

})();

