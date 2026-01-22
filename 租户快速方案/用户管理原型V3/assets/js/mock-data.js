/**
 * Mock数据生成器
 * Mock Data Generator
 * 生成真实感的用户、租户、资产、消费记录数据
 */

(function() {
  'use strict';

  // ==================== 工具函数 ====================
  const MockUtils = {
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
    
    // 生成ID
    generateId(prefix = '') {
      return prefix + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    // 随机布尔值
    randomBool(probability = 0.5) {
      return Math.random() < probability;
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
    
    botNames: ['智能客服助手', 'AI写作助理', '数据分析师', '代码审查机器人', '翻译专家', 
               '文案生成器', '市场分析师', '法律顾问', '医疗助手', '教育导师', 
               '财务分析员', '设计师助手', '产品经理', 'HR助理', '销售顾问',
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
             'Gemini Pro', 'Qwen-Max', 'GLM-4', 'Qwen-Plus'],
    
    resourceTypes: ['智能体', '工作流', '工具', '工具库', '知识库', '空间', 
                    'Token', '云电脑设备时长', '云手机设备时长'],
    
    behaviors: ['创建', '编辑', '删除', '调用', '运行', '查询', '上传文件', '导出数据']
  };

  // ==================== 租户数据生成 ====================
  function generateTenants(count = 15) {
    const tenants = [];
    for (let i = 0; i < count; i++) {
      const createdAt = MockUtils.randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
      const versions = ['个人版', '团队版', '企业版'];
      const weights = [0.4, 0.4, 0.2]; // 概率权重
      
      const rand = Math.random();
      let version;
      if (rand < weights[0]) version = versions[0];
      else if (rand < weights[0] + weights[1]) version = versions[1];
      else version = versions[2];
      
      tenants.push({
        id: `tenant_${String(i + 1).padStart(3, '0')}`,
        name: DataPool.tenantNames[i] || `租户${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=tenant${i}`,
        version: version,
        owner: null,
        ownerId: null,
        createdAt: createdAt,
        createdBy: null,
        memberCount: MockUtils.randomInt(1, version === '企业版' ? 100 : version === '团队版' ? 50 : 5)
      });
    }
    return tenants;
  }

  // ==================== 用户数据生成 ====================
  function generateUsers(count = 60, tenants) {
    const users = [];
    const statuses = ['正常', '已禁用'];
    
    for (let i = 0; i < count; i++) {
      const firstName = MockUtils.randomItem(DataPool.firstNames);
      const lastName = MockUtils.randomItem(DataPool.lastNames);
      const name = firstName + lastName;
      const createdAt = MockUtils.randomDate(new Date(2023, 0, 1), new Date());
      const lastLoginAt = MockUtils.randomDate(createdAt, new Date());
      
      // 随机分配1-3个租户
      const userTenantCount = MockUtils.randomInt(1, Math.min(3, tenants.length));
      const userTenants = [];
      const selectedTenants = [];
      
      for (let j = 0; j < userTenantCount; j++) {
        let tenant;
        do {
          tenant = MockUtils.randomItem(tenants);
        } while (selectedTenants.includes(tenant.id));
        
        selectedTenants.push(tenant.id);
        userTenants.push({
          tenantId: tenant.id,
          tenantName: tenant.name,
          tenantVersion: tenant.version,
          joinedAt: MockUtils.randomDate(createdAt, new Date()),
          isOwner: j === 0 && i < tenants.length
        });
      }
      
      // 生成头像URL（使用多种方案确保可用性）
      const avatarOptions = [
        // 方案1：UI Avatars（文字头像，最稳定）
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=random&color=fff&bold=true`,
        // 方案2：DiceBear（卡通头像）
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i}`,
        // 方案3：Pravatar（真实头像）
        `https://i.pravatar.cc/150?img=${(i % 70) + 1}`
      ];
      
      const user = {
        id: `user_${String(1000 + i).padStart(6, '0')}`,
        name: name,
        avatar: avatarOptions[0], // 默认使用最稳定的UI Avatars
        phone: `138${MockUtils.randomInt(10000000, 99999999)}`,
        email: `${name.toLowerCase()}${i}@example.com`,
        mis: i < 15 ? `MIS${100000 + i}` : null,
        createdAt: createdAt,
        lastLoginAt: lastLoginAt,
        status: i % 15 === 0 ? '已禁用' : '正常',
        balance: MockUtils.randomFloat(0, 10000, 2),
        tenants: userTenants
      };
      
      users.push(user);
    }
    
    // 关联租户所有者
    users.forEach((user, index) => {
      if (index < tenants.length) {
        const tenant = tenants[index];
        tenant.owner = user.name;
        tenant.ownerId = user.id;
        tenant.createdBy = user.name;
      }
    });
    
    return users;
  }

  // ==================== 资产数据生成 ====================
  function generateAssets(users, tenants) {
    const assets = {
      bots: [],
      workflows: [],
      tools: [],
      toolLibs: [],
      knowledgeBases: [],
      spaces: []
    };
    
    users.forEach((user, userIndex) => {
      // 为每个用户生成随机数量的资产
      const isActiveUser = user.status === '正常' && MockUtils.randomBool(0.7);
      const activityMultiplier = isActiveUser ? 1 : 0.3;
      
      // 大幅增加资产数量
      const botCount = Math.floor(MockUtils.randomInt(8, 25) * activityMultiplier);
      const workflowCount = Math.floor(MockUtils.randomInt(5, 18) * activityMultiplier);
      const toolCount = Math.floor(MockUtils.randomInt(10, 30) * activityMultiplier);
      const toolLibCount = Math.floor(MockUtils.randomInt(2, 8) * activityMultiplier);
      const kbCount = Math.floor(MockUtils.randomInt(2, 10) * activityMultiplier);
      const spaceCount = MockUtils.randomInt(2, 5);
      
      // 生成智能体
      for (let i = 0; i < botCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        const hasActivity = MockUtils.randomBool(0.8); // 提高活跃概率
        const lastRunAt = hasActivity ? MockUtils.randomDate(createdAt, new Date()) : null;
        
        assets.bots.push({
          id: MockUtils.generateId('bot_'),
          name: `${MockUtils.randomItem(DataPool.botNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          status: MockUtils.randomItem(['已发布', '已发布', '已发布', '已发布', '草稿']),
          createdAt: createdAt,
          lastUpdatedAt: MockUtils.randomDate(createdAt, new Date()),
          lastRunAt: lastRunAt,
          runCount: hasActivity ? MockUtils.randomInt(20, 5000) : 0,
          userCount: hasActivity ? MockUtils.randomInt(5, 200) : 0,
          tokenUsed: hasActivity ? MockUtils.randomInt(5000, 10000000) : 0
        });
      }
      
      // 生成工作流
      for (let i = 0; i < workflowCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        const hasActivity = MockUtils.randomBool(0.75); // 提高活跃概率
        const lastRunAt = hasActivity ? MockUtils.randomDate(createdAt, new Date()) : null;
        
        assets.workflows.push({
          id: MockUtils.generateId('wf_'),
          name: `${MockUtils.randomItem(DataPool.workflowNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          status: MockUtils.randomItem(['已发布', '已发布', '已发布', '未发布']),
          createdAt: createdAt,
          lastUpdatedAt: MockUtils.randomDate(createdAt, new Date()),
          lastRunAt: lastRunAt,
          runCount: hasActivity ? MockUtils.randomInt(15, 3000) : 0,
          userCount: hasActivity ? MockUtils.randomInt(3, 100) : 0,
          pointsUsed: hasActivity ? MockUtils.randomFloat(50, 50000, 2) : 0
        });
      }
      
      // 生成工具库
      for (let i = 0; i < toolLibCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        assets.toolLibs.push({
          id: MockUtils.generateId('lib_'),
          name: `${MockUtils.randomItem(DataPool.toolLibNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          type: MockUtils.randomItem(['API', '上下文', '混合']),
          status: MockUtils.randomItem(['已发布', '已发布', '未发布']),
          createdAt: createdAt,
          toolCount: MockUtils.randomInt(5, 50)
        });
      }
      
      // 生成工具
      for (let i = 0; i < toolCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        const userToolLibs = assets.toolLibs.filter(lib => lib.userId === user.id);
        const toolLib = userToolLibs.length > 0 && MockUtils.randomBool(0.7) 
          ? MockUtils.randomItem(userToolLibs) 
          : null;
        
        const botRefCount = MockUtils.randomInt(2, 35);
        const workflowRefCount = MockUtils.randomInt(1, 25);
        
        assets.tools.push({
          id: MockUtils.generateId('tool_'),
          name: `${MockUtils.randomItem(DataPool.toolNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          toolLibId: toolLib ? toolLib.id : null,
          toolLibName: toolLib ? toolLib.name : '未分类',
          createdAt: createdAt,
          botRefCount: botRefCount,
          workflowRefCount: workflowRefCount,
          referenceCount: botRefCount + workflowRefCount,
          callCount: MockUtils.randomInt(50, 5000)
        });
      }
      
      // 生成知识库
      for (let i = 0; i < kbCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        const storageSize = MockUtils.randomFloat(10, 2000, 2);
        
        assets.knowledgeBases.push({
          id: MockUtils.generateId('kb_'),
          name: `${MockUtils.randomItem(DataPool.knowledgeBaseNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          status: MockUtils.randomItem(['启用', '启用', '启用', '未启用']),
          createdAt: createdAt,
          itemCount: MockUtils.randomInt(50, 5000),
          refCount: MockUtils.randomInt(5, 200),
          storageSize: storageSize,
          size: storageSize  // 添加size作为storageSize的别名，用于图表展示
        });
      }
      
      // 生成空间
      for (let i = 0; i < spaceCount; i++) {
        const createdAt = MockUtils.randomDate(user.createdAt, new Date());
        const isPersonal = i === 0;
        
        assets.spaces.push({
          id: MockUtils.generateId('space_'),
          name: isPersonal ? '个人空间' : `${MockUtils.randomItem(DataPool.spaceNames)}_${MockUtils.randomInt(1, 999)}`,
          userId: user.id,
          userName: user.name,
          tenantId: MockUtils.randomItem(user.tenants).tenantId,
          type: isPersonal ? '个人空间' : '团队空间',
          owner: user.name,
          createdAt: createdAt,
          lastUpdatedAt: MockUtils.randomDate(createdAt, new Date()),
          lastUpdatedBy: user.name,
          memberCount: isPersonal ? 1 : MockUtils.randomInt(5, 50),
          assetCount: MockUtils.randomInt(10, 200)
        });
      }
    });
    
    return assets;
  }

  // ==================== 消费记录生成 ====================
  function generateConsumptions(users, assets, tenants) {
    const consumptions = [];
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    users.forEach(user => {
      if (user.status === '已禁用') return;
      
      const userBots = assets.bots.filter(b => b.userId === user.id && b.status === '已发布');
      const userWorkflows = assets.workflows.filter(w => w.userId === user.id && w.status === '已发布');
      const userTools = assets.tools.filter(t => t.userId === user.id);
      
      // 构建该用户可用的资源类型列表
      const availableResourceTypes = ['Token', '云电脑设备时长', '云手机设备时长'];
      if (userBots.length > 0) availableResourceTypes.push('智能体', '智能体', '智能体'); // 增加权重
      if (userWorkflows.length > 0) availableResourceTypes.push('工作流', '工作流');
      if (userTools.length > 0) availableResourceTypes.push('工具', '工具');
      availableResourceTypes.push(...['工具库', '知识库', '空间']); // 添加其他类型
      
      // 每个用户生成120-200条消费记录（大幅增加数据量）
      const recordCount = MockUtils.randomInt(150, 220);
      
      for (let i = 0; i < recordCount; i++) {
        const date = MockUtils.randomDate(startDate, now);
        const tenant = MockUtils.randomItem(user.tenants);
        const resourceType = MockUtils.randomItem(availableResourceTypes);
        
        let record = {
          id: MockUtils.generateId('cons_'),
          userId: user.id,
          userName: user.name,
          date: date,
          resourceType: resourceType,
          behavior: '',
          changeType: MockUtils.randomItem(['消耗', '消耗', '消耗', '消耗', '返还']),
          usage: '',
          pointsUsed: 0,
          tenantId: tenant.tenantId,
          tenantName: tenant.tenantName,
          assetId: null,
          assetName: null
        };
        
        // 根据资源类型设置具体数据
        switch (resourceType) {
          case 'Token':
            const model = MockUtils.randomItem(DataPool.models);
            const inputTokens = MockUtils.randomInt(100, 80000);
            const outputTokens = MockUtils.randomInt(50, 30000);
            
            // 根据模型设置不同的价格（积分/1000 tokens）
            let inputPrice, outputPrice;
            if (model.includes('GPT-4o') && !model.includes('mini')) {
              inputPrice = 0.5;
              outputPrice = 1.5;
            } else if (model.includes('Claude 3.5')) {
              inputPrice = 0.3;
              outputPrice = 1.5;
            } else if (model.includes('Gemini')) {
              inputPrice = 0.125;
              outputPrice = 0.375;
            } else {
              inputPrice = 0.05;
              outputPrice = 0.15;
            }
            
            record.behavior = `调用${model}`;
            record.usage = `输入: ${inputTokens.toLocaleString()} / 输出: ${outputTokens.toLocaleString()}`;
            record.pointsUsed = (inputTokens / 1000 * inputPrice + outputTokens / 1000 * outputPrice).toFixed(2);
            record.inputTokens = inputTokens;
            record.outputTokens = outputTokens;
            record.model = model;
            
            if (userBots.length > 0 && MockUtils.randomBool(0.6)) {
              const bot = MockUtils.randomItem(userBots);
              record.assetId = bot.id;
              record.assetName = bot.name;
            }
            break;
            
          case '云电脑设备时长':
            const pcMinutes = MockUtils.randomInt(10, 480);
            const freeMinutes = 60;
            const chargeableMinutes = Math.max(0, pcMinutes - freeMinutes);
            
            record.behavior = '使用云电脑';
            record.usage = `${pcMinutes} 分钟`;
            record.pointsUsed = (chargeableMinutes * 0.5).toFixed(2);
            record.minutes = pcMinutes;
            break;
            
          case '云手机设备时长':
            const phoneMinutes = MockUtils.randomInt(5, 360);
            const phoneFreeMinutes = 30;
            const phoneChargeableMinutes = Math.max(0, phoneMinutes - phoneFreeMinutes);
            
            record.behavior = '使用云手机';
            record.usage = `${phoneMinutes} 分钟`;
            record.pointsUsed = (phoneChargeableMinutes * 0.3).toFixed(2);
            record.minutes = phoneMinutes;
            break;
            
          case '智能体':
            const bot = MockUtils.randomItem(userBots);
            record.behavior = '运行智能体';
            record.usage = '1 次';
            record.pointsUsed = MockUtils.randomFloat(0.5, 5, 2);
            record.assetId = bot.id;
            record.assetName = bot.name;
            break;
            
          case '工作流':
            const workflow = MockUtils.randomItem(userWorkflows);
            record.behavior = '运行工作流';
            record.usage = '1 次';
            record.pointsUsed = MockUtils.randomFloat(1, 10, 2);
            record.assetId = workflow.id;
            record.assetName = workflow.name;
            break;
            
          case '工具':
            if (userTools.length > 0) {
              const tool = MockUtils.randomItem(userTools);
              record.behavior = '调用工具';
              record.usage = '1 次';
              record.pointsUsed = MockUtils.randomFloat(0.1, 2, 2);
              record.assetId = tool.id;
              record.assetName = tool.name;
            } else {
              record.behavior = '调用工具';
              record.usage = '1 次';
              record.pointsUsed = MockUtils.randomFloat(0.1, 2, 2);
            }
            break;
            
          case '工具库':
            record.behavior = '使用工具库';
            record.usage = '1 次';
            record.pointsUsed = MockUtils.randomFloat(0, 1, 2);
            break;
            
          case '知识库':
            record.behavior = '查询知识库';
            record.usage = `${MockUtils.randomInt(1, 20)} 次查询`;
            record.pointsUsed = MockUtils.randomFloat(0.5, 3, 2);
            break;
            
          case '空间':
            record.behavior = MockUtils.randomItem(['创建空间', '访问空间', '管理空间']);
            record.usage = '1 次';
            record.pointsUsed = MockUtils.randomFloat(0, 0.5, 2);
            break;
            
          default:
            record.behavior = MockUtils.randomItem(DataPool.behaviors);
            record.usage = '1 次';
            record.pointsUsed = MockUtils.randomFloat(0, 3, 2);
        }
        
        // 返还类型的积分为负
        if (record.changeType === '返还') {
          record.pointsUsed = -Math.abs(parseFloat(record.pointsUsed));
        } else {
          record.pointsUsed = parseFloat(record.pointsUsed);
        }
        
        consumptions.push(record);
      }
    });
    
    // 按日期降序排序
    consumptions.sort((a, b) => b.date - a.date);
    
    return consumptions;
  }

  // ==================== 聚合数据生成 ====================
  function generateAggregatedData(consumptions, users, assets) {
    const aggregated = {};
    
    users.forEach(user => {
      const userConsumptions = consumptions.filter(c => c.userId === user.id);
      const userBots = assets.bots.filter(b => b.userId === user.id);
      const userWorkflows = assets.workflows.filter(w => w.userId === user.id);
      const userTools = assets.tools.filter(t => t.userId === user.id);
      
      // 按日聚合
      const dailyData = {};
      const last90Days = new Date();
      last90Days.setDate(last90Days.getDate() - 90);
      
      // 初始化最近90天的数据
      for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        dailyData[dateKey] = {
          date: dateKey,
          totalPoints: 0,
          tokenPoints: 0,
          cloudPCPoints: 0,
          cloudPhonePoints: 0,
          otherPoints: 0,
          inputTokens: 0,
          outputTokens: 0,
          cloudPCMinutes: 0,
          cloudPhoneMinutes: 0,
          botCalls: 0,
          workflowRuns: 0,
          toolCalls: 0,
          models: {},
          activities: 0
        };
      }
      
      // 填充实际数据
      userConsumptions.forEach(record => {
        if (record.date >= last90Days) {
          const dateKey = record.date.toISOString().split('T')[0];
          
          if (dailyData[dateKey]) {
            dailyData[dateKey].totalPoints += record.pointsUsed;
            dailyData[dateKey].activities++;
            
            if (record.resourceType === 'Token') {
              dailyData[dateKey].tokenPoints += record.pointsUsed;
              dailyData[dateKey].inputTokens += record.inputTokens || 0;
              dailyData[dateKey].outputTokens += record.outputTokens || 0;
              
              if (record.model) {
                if (!dailyData[dateKey].models[record.model]) {
                  dailyData[dateKey].models[record.model] = {
                    tokens: 0,
                    points: 0
                  };
                }
                dailyData[dateKey].models[record.model].tokens += (record.inputTokens || 0) + (record.outputTokens || 0);
                dailyData[dateKey].models[record.model].points += record.pointsUsed;
              }
            } else if (record.resourceType === '云电脑设备时长') {
              dailyData[dateKey].cloudPCPoints += record.pointsUsed;
              dailyData[dateKey].cloudPCMinutes += record.minutes || 0;
            } else if (record.resourceType === '云手机设备时长') {
              dailyData[dateKey].cloudPhonePoints += record.pointsUsed;
              dailyData[dateKey].cloudPhoneMinutes += record.minutes || 0;
            } else if (record.resourceType === '智能体') {
              dailyData[dateKey].botCalls++;
              dailyData[dateKey].otherPoints += record.pointsUsed;
            } else if (record.resourceType === '工作流') {
              dailyData[dateKey].workflowRuns++;
              dailyData[dateKey].otherPoints += record.pointsUsed;
            } else if (record.resourceType === '工具') {
              dailyData[dateKey].toolCalls++;
              dailyData[dateKey].otherPoints += record.pointsUsed;
            } else {
              dailyData[dateKey].otherPoints += record.pointsUsed;
            }
          }
        }
      });
      
      // 计算累计数据
      const totalAssets = userBots.length + userWorkflows.length + userTools.length;
      const usedAssets = new Set();
      
      userConsumptions.forEach(record => {
        if (record.assetId) {
          usedAssets.add(record.assetId);
        }
      });
      
      const assetUsageRate = totalAssets > 0 ? (usedAssets.size / totalAssets) : 0;
      
      // 活跃天数统计
      const activeDays = Object.values(dailyData).filter(d => d.activities > 0).length;
      
      aggregated[user.id] = {
        daily: Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date)),
        summary: {
          activeDays: activeDays,
          totalAssetCalls: userConsumptions.filter(c => ['智能体', '工作流', '工具'].includes(c.resourceType)).length,
          totalPoints: userConsumptions.reduce((sum, c) => sum + c.pointsUsed, 0),
          assetUsageRate: assetUsageRate,
          totalAssets: totalAssets,
          usedAssets: usedAssets.size
        }
      };
    });
    
    return aggregated;
  }

  // ==================== 初始化所有数据 ====================
  function initMockData() {
    console.log('🚀 开始生成模拟数据...');
    
    const tenants = generateTenants(15);
    const users = generateUsers(60, tenants);
    const assets = generateAssets(users, tenants);
    const consumptions = generateConsumptions(users, assets, tenants);
    const aggregated = generateAggregatedData(consumptions, users, assets);
    
    console.log('✅ 数据生成完成！');
    console.log(`  📊 用户数: ${users.length}`);
    console.log(`  🏢 租户数: ${tenants.length}`);
    console.log(`  🤖 智能体数: ${assets.bots.length}`);
    console.log(`  ⚙️ 工作流数: ${assets.workflows.length}`);
    console.log(`  🔧 工具数: ${assets.tools.length}`);
    console.log(`  📚 知识库数: ${assets.knowledgeBases.length}`);
    console.log(`  💰 消费记录数: ${consumptions.length}`);
    
    return {
      users,
      tenants,
      assets,
      consumptions,
      aggregated,
      // 工具函数
      utils: MockUtils,
      dataPool: DataPool
    };
  }

  // 导出到全局
  if (typeof window !== 'undefined') {
    window.MockData = initMockData();
  }

})();

