/**
 * Mock 数据生成器 - 租户成员管理
 * 专为租户管理员视角设计
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
    
    departmentNames: ['技术部', '产品部', '运营部', '市场部', '销售部', '客服部', '人力资源部', '财务部', '行政部', '法务部'],
    
    subDepartmentNames: {
      '技术部': ['前端组', '后端组', '测试组', '运维组', '数据组'],
      '产品部': ['产品设计组', '用户研究组', 'UI设计组'],
      '运营部': ['内容运营组', '用户运营组', '活动运营组'],
      '市场部': ['品牌推广组', '市场分析组', 'BD组'],
      '销售部': ['大客户销售组', '中小客户销售组', '渠道销售组'],
      '客服部': ['售前咨询组', '售后支持组', 'VIP服务组'],
      '人力资源部': ['招聘组', '培训组', '薪酬绩效组'],
      '财务部': ['会计组', '出纳组', '审计组'],
      '行政部': ['综合管理组', '采购组'],
      '法务部': ['合规组', '诉讼组']
    },
    
    roles: ['所有者', '管理员', '成员', '空间创建员'],
    
    agentNames: ['智能客服助手', 'AI写作助理', '数据分析师', '代码审查机器人', '翻译专家',
                 '文案生成器', '市场分析师', '法律顾问AI', '医疗健康助手', '教育导师',
                 '财务智能分析', '设计师助手', '产品经理助手', 'HR智能助理', '销售顾问'],
    
    workflowNames: ['订单自动处理', '客户服务流程', '数据清洗与分析', '内容智能审核', '报告自动生成',
                    '自动化测试流程', '发票处理系统', '合同智能审批', '招聘流程自动化', '员工培训流程'],
    
    toolNames: ['数据可视化工具', 'PDF智能解析器', '图片处理工具', '文本分析器', '邮件批量发送',
                'API调用器', '数据库连接器', '文件格式转换', '加密工具箱', 'OCR文字识别'],
    
    toolLibNames: ['常用工具集', 'API工具库', '数据处理工具库', '文件操作库', '通信工具集'],
    
    knowledgeBaseNames: ['产品知识库', '技术文档库', '客户案例集', '行业报告库', '培训资料库'],
    
    spaceNames: ['默认空间', '项目Alpha', '营销团队空间', '研发中心', '客户服务空间'],
    
    models: ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet', 'Claude 3 Haiku', 'Gemini Pro'],
    
    resourceTypes: ['Token', '云电脑设备时长', '云手机设备时长', '存储空间', '带宽流量', 'API调用'],
    
    actions: ['运行智能体', '运行工作流', '调用大模型', '数据分析', '文本生成', '图片生成',
              '使用云电脑', '使用云手机', '文件上传', '文件下载', 'API调用'],
    
    domains: ['gmail.com', '163.com', 'qq.com', 'outlook.com', 'company.com']
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
      const firstChar = name ? name.charAt(0) : '用';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=random&size=128`;
    }
  };
  
  // ==================== 租户数据 ====================
  let cachedTenant = null;
  
  function generateTenant() {
    if (cachedTenant) return cachedTenant;
    
    const storedTenant = localStorage.getItem('mockTenantInfo');
    if (storedTenant) {
      try {
        cachedTenant = JSON.parse(storedTenant);
        return cachedTenant;
      } catch (e) {
        console.warn('Failed to load cached tenant:', e);
      }
    }
    
    const tenant = {
      id: MockUtils.generateId('T', 6),
      name: '创新科技有限公司',
      version: '企业版',
      owner: '张伟',
      createTime: new Date('2023-01-15'),
      memberCount: 0, // 将在生成成员后更新
      status: '正常'
    };
    
    cachedTenant = tenant;
    localStorage.setItem('mockTenantInfo', JSON.stringify(tenant));
    return tenant;
  }
  
  // ==================== 部门数据生成 ====================
  let cachedDepartments = null;
  
  function generateDepartments(tenantId) {
    if (cachedDepartments) return cachedDepartments;
    
    const storedDepartments = localStorage.getItem('mockDepartments');
    if (storedDepartments) {
      try {
        cachedDepartments = JSON.parse(storedDepartments);
        return cachedDepartments;
      } catch (e) {
        console.warn('Failed to load cached departments:', e);
      }
    }
    
    const departments = [];
    let deptIndex = 1;
    
    // 生成一级部门
    DataPool.departmentNames.forEach((deptName, index) => {
      const deptId = MockUtils.generateId('DEPT', 4);
      const dept = {
        id: deptId,
        name: deptName,
        parentId: null,
        parentName: null,
        level: 1,
        leader: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        memberCount: 0,
        createTime: MockUtils.randomDate(new Date('2023-01-15'), new Date('2023-06-01'))
      };
      departments.push(dept);
      
      // 生成二级部门
      const subDepts = DataPool.subDepartmentNames[deptName] || [];
      subDepts.forEach(subDeptName => {
        departments.push({
          id: MockUtils.generateId('DEPT', 4),
          name: subDeptName,
          parentId: deptId,
          parentName: deptName,
          level: 2,
          leader: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
          memberCount: 0,
          createTime: MockUtils.randomDate(dept.createTime, new Date('2023-08-01'))
        });
      });
    });
    
    cachedDepartments = departments;
    localStorage.setItem('mockDepartments', JSON.stringify(departments));
    return departments;
  }
  
  // ==================== 成员数据生成 ====================
  let cachedMembers = null;
  
  function generateTenantMembers(tenantId, count = 50) {
    if (cachedMembers) return cachedMembers;
    
    const storedMembers = localStorage.getItem('mockTenantMembers');
    if (storedMembers) {
      try {
        cachedMembers = JSON.parse(storedMembers);
        return cachedMembers;
      } catch (e) {
        console.warn('Failed to load cached members:', e);
      }
    }
    
    const tenant = generateTenant();
    const departments = generateDepartments(tenantId);
    const members = [];
    const now = new Date();
    
    // 生成所有者
    const ownerName = tenant.owner;
    const ownerDept = departments[0]; // 第一个部门
    members.push({
      id: MockUtils.generateId('U', 8),
      name: ownerName,
      avatar: MockUtils.generateAvatar(ownerName),
      phone: `1${MockUtils.randomInt(3, 9)}${String(MockUtils.randomInt(10000000, 99999999))}`,
      email: `${ownerName.toLowerCase()}@${MockUtils.randomItem(DataPool.domains)}`,
      departmentId: ownerDept.id,
      departmentName: ownerDept.name,
      supervisorId: null,
      supervisorName: null,
      role: '所有者',
      joinTime: tenant.createTime,
      status: '正常'
    });
    
    // 生成管理员 (3-5个)
    const adminCount = MockUtils.randomInt(3, 5);
    for (let i = 0; i < adminCount; i++) {
      const firstName = MockUtils.randomItem(DataPool.firstNames);
      const lastName = MockUtils.randomItem(DataPool.lastNames);
      const name = firstName + lastName;
      const dept = MockUtils.randomItem(departments.filter(d => d.level === 1));
      
      members.push({
        id: MockUtils.generateId('U', 8),
        name: name,
        avatar: MockUtils.generateAvatar(name),
        phone: `1${MockUtils.randomInt(3, 9)}${String(MockUtils.randomInt(10000000, 99999999))}`,
        email: `${name.toLowerCase()}${MockUtils.randomInt(1, 99)}@${MockUtils.randomItem(DataPool.domains)}`,
        departmentId: dept.id,
        departmentName: dept.name,
        supervisorId: members[0].id,
        supervisorName: members[0].name,
        role: '管理员',
        joinTime: MockUtils.randomDate(tenant.createTime, new Date(tenant.createTime.getTime() + 30 * 24 * 60 * 60 * 1000)),
        status: '正常'
      });
    }
    
    // 生成普通成员和空间创建员
    const remainingCount = count - members.length;
    for (let i = 0; i < remainingCount; i++) {
      const firstName = MockUtils.randomItem(DataPool.firstNames);
      const lastName = MockUtils.randomItem(DataPool.lastNames);
      const name = firstName + lastName;
      const dept = MockUtils.randomItem(departments);
      
      // 随机选择上级（从已有成员中选择，优先选择同部门或父部门的人）
      const sameDeptMembers = members.filter(m => m.departmentId === dept.id || m.departmentName === dept.parentName);
      const supervisor = sameDeptMembers.length > 0 
        ? MockUtils.randomItem(sameDeptMembers)
        : MockUtils.randomItem(members);
      
      // 80%普通成员，20%空间创建员
      const role = MockUtils.randomBool(0.8) ? '成员' : '空间创建员';
      
      members.push({
        id: MockUtils.generateId('U', 8),
        name: name,
        avatar: MockUtils.generateAvatar(name),
        phone: `1${MockUtils.randomInt(3, 9)}${String(MockUtils.randomInt(10000000, 99999999))}`,
        email: `${name.toLowerCase()}${MockUtils.randomInt(1, 999)}@${MockUtils.randomItem(DataPool.domains)}`,
        departmentId: dept.id,
        departmentName: dept.name,
        supervisorId: supervisor.id,
        supervisorName: supervisor.name,
        role: role,
        joinTime: MockUtils.randomDate(tenant.createTime, now),
        status: MockUtils.randomBool(0.95) ? '正常' : '已禁用'
      });
    }
    
    cachedMembers = members;
    localStorage.setItem('mockTenantMembers', JSON.stringify(members));
    return members;
  }
  
  // ==================== 成员列表查询 ====================
  function getTenantMembers(tenantId, params = {}) {
    let members = [...generateTenantMembers(tenantId)];
    
    // 搜索过滤
    if (params.search) {
      const keyword = params.search.toLowerCase();
      members = members.filter(member => 
        member.name.toLowerCase().includes(keyword) ||
        member.id.toLowerCase().includes(keyword) ||
        member.phone.includes(keyword) ||
        member.email.toLowerCase().includes(keyword) ||
        member.departmentName.toLowerCase().includes(keyword)
      );
    }
    
    // 部门过滤
    if (params.departments && params.departments.length > 0) {
      members = members.filter(m => params.departments.includes(m.departmentId));
    }
    
    // 权限过滤
    if (params.roles && params.roles.length > 0) {
      members = members.filter(m => params.roles.includes(m.role));
    }
    
    // 状态过滤
    if (params.status && params.status !== '全部') {
      members = members.filter(m => m.status === params.status);
    }
    
    // 时间范围过滤
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      members = members.filter(m => {
        const joinTime = new Date(m.joinTime);
        return joinTime >= start && joinTime <= end;
      });
    }
    
    // 排序
    if (params.sortBy) {
      members.sort((a, b) => {
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
      list: members.slice(start, end),
      total: members.length,
      page: page,
      pageSize: pageSize
    };
  }
  
  // ==================== 获取单个成员详情 ====================
  function getTenantMemberDetail(userId, tenantId) {
    const members = generateTenantMembers(tenantId);
    return members.find(m => m.id === userId) || null;
  }
  
  // ==================== 更新成员信息 ====================
  function updateMemberInfo(userId, tenantId, updates) {
    const members = generateTenantMembers(tenantId);
    const member = members.find(m => m.id === userId);
    if (member) {
      Object.assign(member, updates);
      cachedMembers = members;
      localStorage.setItem('mockTenantMembers', JSON.stringify(members));
      return true;
    }
    return false;
  }
  
  // ==================== 从租户中移除成员 ====================
  function removeMemberFromTenant(userId, tenantId) {
    const members = generateTenantMembers(tenantId);
    const index = members.findIndex(m => m.id === userId);
    if (index !== -1) {
      members.splice(index, 1);
      cachedMembers = members;
      localStorage.setItem('mockTenantMembers', JSON.stringify(members));
      return true;
    }
    return false;
  }
  
  // ==================== 资产数据生成 ====================
  function generateAssets(userId, tenantId) {
    return {
      agents: generateAgents(userId, tenantId),
      workflows: generateWorkflows(userId, tenantId),
      tools: generateTools(userId, tenantId),
      toolLibraries: generateToolLibraries(userId, tenantId),
      knowledgeBases: generateKnowledgeBases(userId, tenantId),
      spaces: generateSpaces(userId, tenantId)
    };
  }
  
  function generateAgents(userId, tenantId) {
    const count = MockUtils.randomInt(3, 10);
    const agents = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const createDate = MockUtils.randomDate(
        new Date(now.getFullYear(), now.getMonth() - 3, 1),
        now
      );
      
      agents.push({
        id: MockUtils.generateId('AG', 6),
        name: MockUtils.randomItem(DataPool.agentNames) + ` ${i + 1}`,
        runCount: MockUtils.randomInt(0, 5000),
        userCount: MockUtils.randomInt(0, 300),
        dialogCount: MockUtils.randomInt(0, 20000),
        tokenConsumption: MockUtils.randomInt(0, 2000000),
        status: MockUtils.randomBool(0.85) ? '已发布' : '已删除',
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        lastUpdateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: MockUtils.randomDate(createDate, now)
      });
    }
    
    return agents;
  }
  
  function generateWorkflows(userId, tenantId) {
    const count = MockUtils.randomInt(2, 8);
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
        runCount: MockUtils.randomInt(0, 2000),
        userCount: MockUtils.randomInt(0, 100),
        tokenConsumption: MockUtils.randomInt(0, 1000000),
        status: MockUtils.randomBool(0.85) ? '已发布' : '已删除',
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames),
        createTime: createDate,
        lastUpdateTime: MockUtils.randomDate(createDate, now),
        lastRunTime: MockUtils.randomDate(createDate, now)
      });
    }
    
    return workflows;
  }
  
  function generateTools(userId, tenantId) {
    const count = MockUtils.randomInt(5, 15);
    const tools = [];
    const toolLibs = generateToolLibraries(userId, tenantId);
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      tools.push({
        id: MockUtils.generateId('TL', 6),
        name: MockUtils.randomItem(DataPool.toolNames) + ` ${i + 1}`,
        library: MockUtils.randomItem(toolLibs).name,
        agentRefCount: MockUtils.randomInt(0, 30),
        workflowRefCount: MockUtils.randomInt(0, 20),
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear(), now.getMonth() - 6, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return tools;
  }
  
  function generateToolLibraries(userId, tenantId) {
    const count = MockUtils.randomInt(2, 5);
    const libraries = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      libraries.push({
        id: MockUtils.generateId('LIB', 6),
        name: MockUtils.randomItem(DataPool.toolLibNames) + ` ${i + 1}`,
        status: MockUtils.randomBool(0.9) ? '启用' : '禁用',
        type: MockUtils.randomItem(['公开', '私有', '团队']),
        toolCount: MockUtils.randomInt(1, 15),
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear() - 1, 0, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return libraries;
  }
  
  function generateKnowledgeBases(userId, tenantId) {
    const count = MockUtils.randomInt(2, 8);
    const bases = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      bases.push({
        id: MockUtils.generateId('KB', 6),
        name: MockUtils.randomItem(DataPool.knowledgeBaseNames) + ` ${i + 1}`,
        status: MockUtils.randomBool(0.85) ? '启用' : '未启用',
        unitCount: MockUtils.randomInt(10, 500),
        refCount: MockUtils.randomInt(0, 300),
        storageSize: MockUtils.randomInt(1, 512) * 1024 * 1024,
        createTime: MockUtils.randomDate(
          new Date(now.getFullYear(), now.getMonth() - 6, 1),
          now
        ),
        creator: MockUtils.randomItem(DataPool.firstNames) + MockUtils.randomItem(DataPool.lastNames)
      });
    }
    
    return bases;
  }
  
  function generateSpaces(userId, tenantId) {
    const count = MockUtils.randomInt(1, 4);
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
  function generateConsumptionRecords(userId, tenantId, params = {}) {
    const records = [];
    const now = new Date();
    const startDate = params.startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = params.endDate || now;
    const tenant = generateTenant();
    
    const count = MockUtils.randomInt(50, 150);
    
    for (let i = 0; i < count; i++) {
      const recordDate = MockUtils.randomDate(startDate, endDate);
      const resourceType = MockUtils.randomItem(DataPool.resourceTypes);
      const action = MockUtils.randomItem(DataPool.actions);
      const isConsumption = MockUtils.randomBool(0.95);
      const hasPoints = MockUtils.randomBool(0.8);
      
      let usage = '';
      let points = 0;
      
      if (resourceType === 'Token') {
        const inputTokens = MockUtils.randomInt(100, 5000);
        const outputTokens = MockUtils.randomInt(100, 4000);
        usage = `输入Token: ${inputTokens.toLocaleString()}, 输出Token: ${outputTokens.toLocaleString()}`;
        points = hasPoints ? Math.floor((inputTokens + outputTokens) / 100) : 0;
      } else if (resourceType.includes('设备时长')) {
        const minutes = MockUtils.randomInt(1, 60);
        usage = `${minutes}分钟`;
        points = hasPoints ? minutes * 10 : 0;
      } else {
        usage = `${MockUtils.randomInt(1, 50)} 单位`;
        points = hasPoints ? MockUtils.randomInt(10, 200) : 0;
      }
      
      records.push({
        id: MockUtils.generateId('RC', 8),
        date: recordDate,
        resourceType: resourceType,
        action: action,
        changeType: isConsumption ? '消耗' : '返还',
        usage: usage,
        points: isConsumption ? points : -points,
        tenant: tenant.name
      });
    }
    
    records.sort((a, b) => b.date - a.date);
    return records;
  }
  
  // ==================== 数据总览统计 ====================
  function getOverviewStats(userId, tenantId, params = {}) {
    const assets = generateAssets(userId, tenantId);
    
    // 计算累加值的辅助函数
    const sum = (arr, key) => arr.reduce((total, item) => total + (Number(item[key]) || 0), 0);
    
    return {
      assetCreation: {
        agents: assets.agents.length,
        workflows: assets.workflows.length,
        tools: assets.tools.length,
        toolLibraries: assets.toolLibraries.length,
        knowledgeBases: assets.knowledgeBases.length,
        spaces: assets.spaces.length
      },
      
      assetActivity: {
        agentRunCount: sum(assets.agents, 'runCount'),
        agentUserCount: sum(assets.agents, 'userCount'),
        agentDialogCount: sum(assets.agents, 'dialogCount'),
        agentTokens: sum(assets.agents, 'tokenConsumption'),
        workflowRunCount: sum(assets.workflows, 'runCount'),
        workflowSuccessRate: MockUtils.randomFloat(95, 99.5, 1),
        workflowUserCount: sum(assets.workflows, 'userCount'),
        workflowTokens: sum(assets.workflows, 'tokenConsumption'),
        toolRefCount: sum(assets.tools, 'agentRefCount') + sum(assets.tools, 'workflowRefCount'),
        knowledgeRefCount: sum(assets.knowledgeBases, 'refCount')
      },
      
      pointsOverview: {
        totalPoints: MockUtils.randomInt(10000, 50000),
        tokenPoints: MockUtils.randomInt(8000, 35000),
        devicePoints: MockUtils.randomInt(2000, 15000)
      },
      
      tokenConsumption: {
        total: MockUtils.randomInt(500000, 2000000),
        input: MockUtils.randomInt(300000, 1200000),
        output: MockUtils.randomInt(200000, 800000)
      },
      
      deviceUsage: {
        total: MockUtils.randomInt(500, 2000),
        computer: MockUtils.randomInt(300, 1200),
        phone: MockUtils.randomInt(200, 800)
      }
    };
  }
  
  // ==================== 清除缓存 ====================
  function clearCache() {
    cachedTenant = null;
    cachedDepartments = null;
    cachedMembers = null;
    try {
      localStorage.removeItem('mockTenantInfo');
      localStorage.removeItem('mockDepartments');
      localStorage.removeItem('mockTenantMembers');
      console.log('租户成员数据缓存已清除');
      return true;
    } catch (e) {
      console.error('清除缓存失败:', e);
      return false;
    }
  }
  
  // ==================== 导出 MockData ====================
  window.MockData = {
    // 租户相关
    getTenant: generateTenant,
    
    // 部门相关
    getDepartments: generateDepartments,
    
    // 成员相关
    getTenantMembers,
    getTenantMemberDetail,
    updateMemberInfo,
    removeMemberFromTenant,
    
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
    
    // 工具函数
    clearCache,
    
    // 数据池和工具
    DataPool,
    MockUtils
  };
  
})();

