// Mock Data Generator for User Management System
// 生成真实感的模拟数据

// 工具函数
const utils = {
  // 随机日期生成
  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  
  // 随机选择数组元素
  randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  
  // 随机整数
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // 随机浮点数
  randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  },
  
  // 生成UUID
  generateId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
};

// 基础数据池
const dataPool = {
  firstNames: ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗'],
  lastNames: ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞', '平', '刚', '桂英'],
  avatarColors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#53C8FF', '#FF7875', '#FFA940', '#73D13D', '#B37FEB'],
  
  tenantNames: ['创新科技', '云端智能', '数字未来', '星辰科技', '飞跃互联', '智慧方舟', '量子实验室', '蓝海科技', '极光工作室', '未来实验室', '创想空间', '智能工坊', '数据魔方', '创客联盟', '科技前沿'],
  
  botNames: ['智能客服助手', 'AI写作助理', '数据分析师', '代码审查机器人', '翻译专家', '文案生成器', '市场分析师', '法律顾问', '医疗助手', '教育导师', '财务分析员', '设计师助手', '产品经理', 'HR助理', '销售顾问'],
  
  workflowNames: ['订单处理流程', '客户服务流程', '数据清洗流程', '内容审核流程', '报告生成流程', '自动化测试流程', '发票处理流程', '合同审批流程', '招聘流程', '培训流程'],
  
  toolNames: ['数据可视化工具', 'PDF解析器', '图片处理工具', '文本分析器', '邮件发送器', 'API调用器', '数据库连接器', '文件转换器', '加密工具', 'OCR识别器'],
  
  toolLibNames: ['常用工具集', 'API工具库', '数据处理库', '文件操作库', '通信工具库', '安全工具库'],
  
  knowledgeBaseNames: ['产品知识库', '技术文档库', '客户案例库', '行业报告库', '培训资料库', '法律法规库'],
  
  spaceNames: ['默认空间', '项目A空间', '营销团队空间', '研发中心', '客户服务空间', '数据分析空间'],
  
  models: ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet', 'Claude 3 Haiku', 'Gemini Pro', 'Qwen-Max', 'GLM-4'],
  
  resourceTypes: ['智能体', '工作流', '工具', '工具库', '知识库', '空间', 'Token', '云电脑设备时长', '云手机设备时长'],
  
  behaviors: ['创建', '编辑', '删除', '调用', '运行', '查询', '上传文件', '导出数据']
};

// 生成租户数据
function generateTenants(count = 15) {
  const tenants = [];
  for (let i = 0; i < count; i++) {
    const createdAt = utils.randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
    tenants.push({
      id: `tenant_${i + 1}`,
      name: dataPool.tenantNames[i] || `租户${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${i}`,
      version: utils.randomItem(['个人版', '团队版', '企业版']),
      owner: null, // 后续关联
      ownerId: null,
      createdAt: createdAt,
      createdBy: null,
      memberCount: utils.randomInt(1, 50)
    });
  }
  return tenants;
}

// 生成用户数据
function generateUsers(count = 60, tenants) {
  const users = [];
  const statuses = ['正常', '已禁用'];
  
  for (let i = 0; i < count; i++) {
    const firstName = utils.randomItem(dataPool.firstNames);
    const lastName = utils.randomItem(dataPool.lastNames);
    const name = firstName + lastName;
    const createdAt = utils.randomDate(new Date(2023, 0, 1), new Date());
    const lastLoginAt = utils.randomDate(createdAt, new Date());
    
    // 随机分配1-3个租户
    const userTenantCount = utils.randomInt(1, 3);
    const userTenants = [];
    for (let j = 0; j < userTenantCount; j++) {
      const tenant = utils.randomItem(tenants);
      if (!userTenants.find(t => t.tenantId === tenant.id)) {
        userTenants.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          joinedAt: utils.randomDate(createdAt, new Date()),
          isOwner: j === 0 && i < 15 // 前15个用户是其第一个租户的所有者
        });
      }
    }
    
    const user = {
      id: `user_${1000 + i}`,
      name: name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      avatarColor: utils.randomItem(dataPool.avatarColors),
      phone: `138${utils.randomInt(10000000, 99999999)}`,
      email: `${name.toLowerCase()}${i}@example.com`,
      mis: i < 10 ? `MIS${100000 + i}` : null,
      createdAt: createdAt,
      lastLoginAt: lastLoginAt,
      status: i % 10 === 0 ? '已禁用' : '正常',
      balance: utils.randomFloat(0, 10000, 2),
      tenants: userTenants
    };
    
    users.push(user);
  }
  
  // 关联租户所有者
  users.forEach((user, index) => {
    if (index < 15) {
      tenants[index].owner = user.name;
      tenants[index].ownerId = user.id;
      tenants[index].createdBy = user.name;
    }
  });
  
  return users;
}

// 生成资产数据
function generateAssets(users, tenants) {
  const assets = {
    bots: [],
    workflows: [],
    tools: [],
    toolLibs: [],
    knowledgeBases: [],
    spaces: []
  };
  
  users.forEach(user => {
    // 为每个用户生成随机数量的资产
    const botCount = utils.randomInt(0, 5);
    const workflowCount = utils.randomInt(0, 4);
    const toolCount = utils.randomInt(0, 8);
    const toolLibCount = utils.randomInt(0, 3);
    const kbCount = utils.randomInt(0, 3);
    const spaceCount = utils.randomInt(1, 3);
    
    // 生成智能体
    for (let i = 0; i < botCount; i++) {
      const createdAt = utils.randomDate(user.createdAt, new Date());
      const lastRunAt = utils.randomDate(createdAt, new Date());
      assets.bots.push({
        id: utils.generateId('bot_'),
        name: `${utils.randomItem(dataPool.botNames)}_${i + 1}`,
        userId: user.id,
        userName: user.name,
        tenantId: utils.randomItem(user.tenants).tenantId,
        status: utils.randomItem(['已发布', '草稿', '已删除']),
        createdAt: createdAt,
        lastUpdatedAt: utils.randomDate(createdAt, new Date()),
        lastRunAt: lastRunAt,
        runCount: utils.randomInt(0, 1000),
        userCount: utils.randomInt(0, 50),
        tokenUsed: utils.randomInt(0, 1000000)
      });
    }
    
    // 生成工作流
    for (let i = 0; i < workflowCount; i++) {
      const createdAt = utils.randomDate(user.createdAt, new Date());
      assets.workflows.push({
        id: utils.generateId('wf_'),
        name: `${utils.randomItem(dataPool.workflowNames)}_${i + 1}`,
        userId: user.id,
        userName: user.name,
        tenantId: utils.randomItem(user.tenants).tenantId,
        status: utils.randomItem(['已发布', '未发布', '已删除']),
        createdAt: createdAt,
        lastUpdatedAt: utils.randomDate(createdAt, new Date()),
        lastRunAt: utils.randomDate(createdAt, new Date()),
        runCount: utils.randomInt(0, 500),
        userCount: utils.randomInt(0, 30),
        pointsUsed: utils.randomFloat(0, 5000, 2)
      });
    }
    
    // 生成工具库
    for (let i = 0; i < toolLibCount; i++) {
      assets.toolLibs.push({
        id: utils.generateId('lib_'),
        name: `${utils.randomItem(dataPool.toolLibNames)}_${i + 1}`,
        userId: user.id,
        userName: user.name,
        tenantId: utils.randomItem(user.tenants).tenantId,
        type: utils.randomItem(['API', '上下文', '混合']),
        status: utils.randomItem(['已发布', '未发布']),
        createdAt: utils.randomDate(user.createdAt, new Date()),
        toolCount: utils.randomInt(1, 20)
      });
    }
    
    // 生成工具
    for (let i = 0; i < toolCount; i++) {
      const libId = assets.toolLibs.length > 0 ? utils.randomItem(assets.toolLibs).id : null;
      assets.tools.push({
        id: utils.generateId('tool_'),
        name: `${utils.randomItem(dataPool.toolNames)}_${i + 1}`,
        userId: user.id,
        userName: user.name,
        toolLibId: libId,
        toolLibName: libId ? assets.toolLibs.find(l => l.id === libId)?.name : '未分类',
        createdAt: utils.randomDate(user.createdAt, new Date()),
        botRefCount: utils.randomInt(0, 10),
        workflowRefCount: utils.randomInt(0, 10),
        callCount: utils.randomInt(0, 500)
      });
    }
    
    // 生成知识库
    for (let i = 0; i < kbCount; i++) {
      assets.knowledgeBases.push({
        id: utils.generateId('kb_'),
        name: `${utils.randomItem(dataPool.knowledgeBaseNames)}_${i + 1}`,
        userId: user.id,
        userName: user.name,
        tenantId: utils.randomItem(user.tenants).tenantId,
        status: utils.randomItem(['启用', '未启用']),
        createdAt: utils.randomDate(user.createdAt, new Date()),
        itemCount: utils.randomInt(10, 500),
        refCount: utils.randomInt(0, 50),
        storageSize: utils.randomFloat(0.1, 500, 2) // MB
      });
    }
    
    // 生成空间
    for (let i = 0; i < spaceCount; i++) {
      assets.spaces.push({
        id: utils.generateId('space_'),
        name: i === 0 ? '个人空间' : `${utils.randomItem(dataPool.spaceNames)}_${i}`,
        userId: user.id,
        userName: user.name,
        tenantId: utils.randomItem(user.tenants).tenantId,
        type: i === 0 ? '个人空间' : '团队空间',
        owner: user.name,
        createdAt: utils.randomDate(user.createdAt, new Date()),
        lastUpdatedAt: utils.randomDate(user.createdAt, new Date()),
        lastUpdatedBy: user.name,
        memberCount: i === 0 ? 1 : utils.randomInt(2, 20),
        assetCount: utils.randomInt(0, 50)
      });
    }
  });
  
  return assets;
}

// 生成消费明细数据
function generateConsumptions(users, assets, tenants) {
  const consumptions = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1); // 最近6个月
  
  users.forEach(user => {
    // 每个用户生成20-50条消费记录
    const recordCount = utils.randomInt(20, 50);
    
    for (let i = 0; i < recordCount; i++) {
      const date = utils.randomDate(startDate, now);
      const resourceType = utils.randomItem(dataPool.resourceTypes);
      const tenant = utils.randomItem(user.tenants);
      
      let record = {
        id: utils.generateId('cons_'),
        userId: user.id,
        userName: user.name,
        date: date,
        resourceType: resourceType,
        behavior: '',
        changeType: utils.randomItem(['消耗', '消耗', '消耗', '返还']), // 消耗概率更高
        usage: '',
        pointsUsed: 0,
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName
      };
      
      // 根据资源类型设置具体数据
      if (resourceType === 'Token') {
        const model = utils.randomItem(dataPool.models);
        const inputTokens = utils.randomInt(100, 50000);
        const outputTokens = utils.randomInt(50, 20000);
        record.behavior = `调用${model}`;
        record.usage = `输入: ${inputTokens.toLocaleString()} / 输出: ${outputTokens.toLocaleString()}`;
        record.pointsUsed = utils.randomFloat(0.5, 500, 2);
        record.inputTokens = inputTokens;
        record.outputTokens = outputTokens;
        record.model = model;
      } else if (resourceType === '云电脑设备时长') {
        const minutes = utils.randomInt(10, 480);
        record.behavior = '使用云电脑';
        record.usage = `${minutes} 分钟`;
        record.pointsUsed = minutes > 60 ? utils.randomFloat(10, 200, 2) : 0;
        record.minutes = minutes;
      } else if (resourceType === '云手机设备时长') {
        const minutes = utils.randomInt(5, 240);
        record.behavior = '使用云手机';
        record.usage = `${minutes} 分钟`;
        record.pointsUsed = minutes > 30 ? utils.randomFloat(5, 100, 2) : 0;
        record.minutes = minutes;
      } else {
        // 其他资源类型
        record.behavior = utils.randomItem(['创建', '调用', '运行']);
        record.usage = '1 次';
        record.pointsUsed = utils.randomFloat(0, 10, 2);
      }
      
      // 返还类型的积分为负
      if (record.changeType === '返还') {
        record.pointsUsed = -Math.abs(record.pointsUsed);
      }
      
      consumptions.push(record);
    }
  });
  
  // 按日期降序排序
  consumptions.sort((a, b) => b.date - a.date);
  
  return consumptions;
}

// 生成聚合数据（用于图表展示）
function generateAggregatedData(consumptions, users) {
  const aggregated = {};
  
  users.forEach(user => {
    const userConsumptions = consumptions.filter(c => c.userId === user.id);
    
    // 按日聚合
    const dailyData = {};
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    
    userConsumptions.forEach(record => {
      if (record.date >= last90Days) {
        const dateKey = record.date.toISOString().split('T')[0];
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = {
            date: dateKey,
            totalPoints: 0,
            tokenPoints: 0,
            cloudPCPoints: 0,
            cloudPhonePoints: 0,
            inputTokens: 0,
            outputTokens: 0,
            cloudPCMinutes: 0,
            cloudPhoneMinutes: 0,
            models: {}
          };
        }
        
        dailyData[dateKey].totalPoints += record.pointsUsed;
        
        if (record.resourceType === 'Token') {
          dailyData[dateKey].tokenPoints += record.pointsUsed;
          dailyData[dateKey].inputTokens += record.inputTokens || 0;
          dailyData[dateKey].outputTokens += record.outputTokens || 0;
          
          if (record.model) {
            if (!dailyData[dateKey].models[record.model]) {
              dailyData[dateKey].models[record.model] = 0;
            }
            dailyData[dateKey].models[record.model] += (record.inputTokens || 0) + (record.outputTokens || 0);
          }
        } else if (record.resourceType === '云电脑设备时长') {
          dailyData[dateKey].cloudPCPoints += record.pointsUsed;
          dailyData[dateKey].cloudPCMinutes += record.minutes || 0;
        } else if (record.resourceType === '云手机设备时长') {
          dailyData[dateKey].cloudPhonePoints += record.pointsUsed;
          dailyData[dateKey].cloudPhoneMinutes += record.minutes || 0;
        }
      }
    });
    
    aggregated[user.id] = {
      daily: Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
    };
  });
  
  return aggregated;
}

// 初始化所有数据
function initMockData() {
  console.log('正在生成模拟数据...');
  
  const tenants = generateTenants(15);
  const users = generateUsers(60, tenants);
  const assets = generateAssets(users, tenants);
  const consumptions = generateConsumptions(users, assets, tenants);
  const aggregated = generateAggregatedData(consumptions, users);
  
  console.log('数据生成完成！');
  console.log(`- 用户数: ${users.length}`);
  console.log(`- 租户数: ${tenants.length}`);
  console.log(`- 智能体数: ${assets.bots.length}`);
  console.log(`- 工作流数: ${assets.workflows.length}`);
  console.log(`- 消费记录数: ${consumptions.length}`);
  
  return {
    users,
    tenants,
    assets,
    consumptions,
    aggregated,
    utils
  };
}

// 导出数据
window.mockData = initMockData();


