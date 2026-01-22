/**
 * 静态模拟数据
 * 预生成的用户、租户、资产和消费记录数据
 */

(function() {
  'use strict';

  // 生成静态数据
  const StaticData = {
    // 租户数据（15个）
    tenants: [
      { id: "tenant_001", name: "创新科技", avatar: "https://ui-avatars.com/api/?name=创新科技&size=150&background=random", version: "企业版", owner: "张伟", ownerId: "user_001000", createdAt: new Date("2023-03-15"), createdBy: "张伟", memberCount: 45 },
      { id: "tenant_002", name: "云端智能", avatar: "https://ui-avatars.com/api/?name=云端智能&size=150&background=random", version: "团队版", owner: "李娜", ownerId: "user_001001", createdAt: new Date("2023-05-20"), createdBy: "李娜", memberCount: 23 },
      { id: "tenant_003", name: "数字未来", avatar: "https://ui-avatars.com/api/?name=数字未来&size=150&background=random", version: "团队版", owner: "王强", ownerId: "user_001002", createdAt: new Date("2023-07-10"), createdBy: "王强", memberCount: 18 },
      { id: "tenant_004", name: "星辰科技", avatar: "https://ui-avatars.com/api/?name=星辰科技&size=150&background=random", version: "企业版", owner: "刘敏", ownerId: "user_001003", createdAt: new Date("2023-02-28"), createdBy: "刘敏", memberCount: 67 },
      { id: "tenant_005", name: "飞跃互联", avatar: "https://ui-avatars.com/api/?name=飞跃互联&size=150&background=random", version: "个人版", owner: "陈静", ownerId: "user_001004", createdAt: new Date("2024-01-05"), createdBy: "陈静", memberCount: 3 },
      { id: "tenant_006", name: "智慧方舟", avatar: "https://ui-avatars.com/api/?name=智慧方舟&size=150&background=random", version: "团队版", owner: "杨杰", ownerId: "user_001005", createdAt: new Date("2023-08-12"), createdBy: "杨杰", memberCount: 28 },
      { id: "tenant_007", name: "量子实验室", avatar: "https://ui-avatars.com/api/?name=量子实验室&size=150&background=random", version: "企业版", owner: "黄磊", ownerId: "user_001006", createdAt: new Date("2023-04-18"), createdBy: "黄磊", memberCount: 52 },
      { id: "tenant_008", name: "蓝海科技", avatar: "https://ui-avatars.com/api/?name=蓝海科技&size=150&background=random", version: "团队版", owner: "赵艳", ownerId: "user_001007", createdAt: new Date("2023-09-25"), createdBy: "赵艳", memberCount: 16 },
      { id: "tenant_009", name: "极光工作室", avatar: "https://ui-avatars.com/api/?name=极光工作室&size=150&background=random", version: "个人版", owner: "周涛", ownerId: "user_001008", createdAt: new Date("2024-02-14"), createdBy: "周涛", memberCount: 2 },
      { id: "tenant_010", name: "未来实验室", avatar: "https://ui-avatars.com/api/?name=未来实验室&size=150&background=random", version: "团队版", owner: "吴平", ownerId: "user_001009", createdAt: new Date("2023-06-30"), createdBy: "吴平", memberCount: 21 },
      { id: "tenant_011", name: "创想空间", avatar: "https://ui-avatars.com/api/?name=创想空间&size=150&background=random", version: "企业版", owner: "徐华", ownerId: "user_001010", createdAt: new Date("2023-03-08"), createdBy: "徐华", memberCount: 41 },
      { id: "tenant_012", name: "智能工坊", avatar: "https://ui-avatars.com/api/?name=智能工坊&size=150&background=random", version: "团队版", owner: "孙丽", ownerId: "user_001011", createdAt: new Date("2023-10-05"), createdBy: "孙丽", memberCount: 19 },
      { id: "tenant_013", name: "数据魔方", avatar: "https://ui-avatars.com/api/?name=数据魔方&size=150&background=random", version: "个人版", owner: "马明", ownerId: "user_001012", createdAt: new Date("2024-03-20"), createdBy: "马明", memberCount: 1 },
      { id: "tenant_014", name: "创客联盟", avatar: "https://ui-avatars.com/api/?name=创客联盟&size=150&background=random", version: "团队版", owner: "朱超", ownerId: "user_001013", createdAt: new Date("2023-07-22"), createdBy: "朱超", memberCount: 25 },
      { id: "tenant_015", name: "科技前沿", avatar: "https://ui-avatars.com/api/?name=科技前沿&size=150&background=random", version: "企业版", owner: "胡秀英", ownerId: "user_001014", createdAt: new Date("2023-05-15"), createdBy: "胡秀英", memberCount: 58 }
    ],

    // 用户数据（生成10个示例用户，实际使用时可以扩展到60个）
    users: [
      {
        id: "user_001000",
        name: "张伟",
        avatar: "https://ui-avatars.com/api/?name=张伟&size=150&background=FF6B6B&color=fff&bold=true",
        phone: "13812345678",
        email: "zhangwei0@example.com",
        mis: "MIS100000",
        createdAt: new Date("2024-04-17"),
        lastLoginAt: new Date("2025-05-29"),
        status: "正常",
        balance: 7967.23,
        tenants: [
          { tenantId: "tenant_001", tenantName: "创新科技", tenantVersion: "企业版", joinedAt: new Date("2024-04-17"), isOwner: true },
          { tenantId: "tenant_002", tenantName: "云端智能", tenantVersion: "团队版", joinedAt: new Date("2024-08-10"), isOwner: false }
        ]
      },
      {
        id: "user_001001",
        name: "李娜",
        avatar: "https://ui-avatars.com/api/?name=李娜&size=150&background=4ECDC4&color=fff&bold=true",
        phone: "13823456789",
        email: "lina1@example.com",
        mis: "MIS100001",
        createdAt: new Date("2023-01-29"),
        lastLoginAt: new Date("2025-01-29"),
        status: "正常",
        balance: 5234.56,
        tenants: [
          { tenantId: "tenant_002", tenantName: "云端智能", tenantVersion: "团队版", joinedAt: new Date("2023-01-29"), isOwner: true },
          { tenantId: "tenant_003", tenantName: "数字未来", tenantVersion: "团队版", joinedAt: new Date("2023-06-15"), isOwner: false }
        ]
      },
      {
        id: "user_001002",
        name: "王强",
        avatar: "https://ui-avatars.com/api/?name=王强&size=150&background=95E1D3&color=fff&bold=true",
        phone: "13834567890",
        email: "wangqiang2@example.com",
        mis: "MIS100002",
        createdAt: new Date("2023-11-13"),
        lastLoginAt: new Date("2024-12-04"),
        status: "正常",
        balance: 8912.34,
        tenants: [
          { tenantId: "tenant_003", tenantName: "数字未来", tenantVersion: "团队版", joinedAt: new Date("2023-11-13"), isOwner: true }
        ]
      }
    ],

    // 智能体数据（示例）
    bots: [
      { id: "bot_001", name: "智能客服助手_001", userId: "user_001000", userName: "张伟", tenantId: "tenant_001", status: "已发布", createdAt: new Date("2024-05-10"), lastUpdatedAt: new Date("2025-01-15"), lastRunAt: new Date("2025-05-20"), runCount: 1250, userCount: 45, tokenUsed: 2500000 },
      { id: "bot_002", name: "AI写作助理_002", userId: "user_001000", userName: "张伟", tenantId: "tenant_001", status: "已发布", createdAt: new Date("2024-06-20"), lastUpdatedAt: new Date("2025-02-10"), lastRunAt: new Date("2025-05-25"), runCount: 850, userCount: 32, tokenUsed: 1800000 },
      { id: "bot_003", name: "数据分析师_003", userId: "user_001000", userName: "张伟", tenantId: "tenant_002", status: "已发布", createdAt: new Date("2024-07-15"), lastUpdatedAt: new Date("2025-03-05"), lastRunAt: new Date("2025-05-28"), runCount: 620, userCount: 28, tokenUsed: 1200000 }
    ],

    // 工作流数据（示例）
    workflows: [
      { id: "wf_001", name: "订单处理流程_001", userId: "user_001000", userName: "张伟", tenantId: "tenant_001", status: "已发布", createdAt: new Date("2024-05-20"), lastUpdatedAt: new Date("2025-01-20"), lastRunAt: new Date("2025-05-22"), runCount: 450, userCount: 25, pointsUsed: 2500.50 },
      { id: "wf_002", name: "客户服务流程_002", userId: "user_001000", userName: "张伟", tenantId: "tenant_001", status: "已发布", createdAt: new Date("2024-06-10"), lastUpdatedAt: new Date("2025-02-15"), lastRunAt: new Date("2025-05-26"), runCount: 380, userCount: 18, pointsUsed: 1800.75 }
    ],

    // 消费记录数据（user_001000的记录示例，最近30天）
    consumptions: []
  };

  // 生成user_001000最近30天的消费记录（180条）
  const now = new Date();
  const userId = "user_001000";
  const userName = "张伟";
  const tenants = [
    { tenantId: "tenant_001", tenantName: "创新科技" },
    { tenantId: "tenant_002", tenantName: "云端智能" }
  ];

  const models = ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet', 'Claude 3 Haiku', 'Gemini Pro', 'Qwen-Max', 'GLM-4', 'Qwen-Plus'];
  
  // 生成过去30天的日期
  for (let day = 29; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    
    // 每天生成6条记录
    const recordsPerDay = 6;
    
    for (let i = 0; i < recordsPerDay; i++) {
      const tenant = tenants[Math.floor(Math.random() * tenants.length)];
      const recordDate = new Date(date);
      recordDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
      
      // 随机资源类型
      const resourceTypes = ['Token', '智能体', '工作流', '云电脑设备时长', '云手机设备时长', '工具'];
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      
      let record = {
        id: `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        userName: userName,
        date: recordDate,
        resourceType: resourceType,
        behavior: '',
        changeType: Math.random() > 0.9 ? '返还' : '消耗',
        usage: '',
        pointsUsed: 0,
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        assetId: null,
        assetName: null
      };
      
      // 根据资源类型设置详细信息
      switch (resourceType) {
        case 'Token':
          const model = models[Math.floor(Math.random() * models.length)];
          const inputTokens = Math.floor(Math.random() * 50000) + 1000;
          const outputTokens = Math.floor(Math.random() * 20000) + 500;
          let inputPrice = 0.15, outputPrice = 0.5;
          
          if (model.includes('GPT-4o') && !model.includes('mini')) {
            inputPrice = 0.5;
            outputPrice = 1.5;
          } else if (model.includes('Claude 3.5')) {
            inputPrice = 0.3;
            outputPrice = 1.5;
          }
          
          record.behavior = `调用${model}`;
          record.usage = `输入: ${inputTokens.toLocaleString()} / 输出: ${outputTokens.toLocaleString()}`;
          record.pointsUsed = parseFloat((inputTokens / 1000 * inputPrice + outputTokens / 1000 * outputPrice).toFixed(2));
          record.model = model;
          // 关键：补充Token用量字段，供图表统计使用
          record.inputTokens = inputTokens;
          record.outputTokens = outputTokens;
          record.assetId = 'bot_001';
          record.assetName = '智能客服助手_001';
          break;
          
        case '智能体':
          record.behavior = '运行智能体';
          record.usage = '1 次';
          record.pointsUsed = parseFloat((Math.random() * 4 + 0.5).toFixed(2));
          record.assetId = 'bot_001';
          record.assetName = '智能客服助手_001';
          break;
          
        case '工作流':
          record.behavior = '运行工作流';
          record.usage = '1 次';
          record.pointsUsed = parseFloat((Math.random() * 8 + 1).toFixed(2));
          record.assetId = 'wf_001';
          record.assetName = '订单处理流程_001';
          break;
          
        case '云电脑设备时长':
          const pcMinutes = Math.floor(Math.random() * 240) + 30;
          record.behavior = '使用云电脑';
          record.usage = `${pcMinutes} 分钟`;
          record.pointsUsed = parseFloat((Math.max(0, pcMinutes - 60) * 0.5).toFixed(2));
          break;
          
        case '云手机设备时长':
          const phoneMinutes = Math.floor(Math.random() * 180) + 15;
          record.behavior = '使用云手机';
          record.usage = `${phoneMinutes} 分钟`;
          record.pointsUsed = parseFloat((Math.max(0, phoneMinutes - 30) * 0.3).toFixed(2));
          break;
          
        case '工具':
          record.behavior = '调用工具';
          record.usage = '1 次';
          record.pointsUsed = parseFloat((Math.random() * 1.5 + 0.1).toFixed(2));
          break;
      }
      
      // 返还类型积分为负
      if (record.changeType === '返还') {
        record.pointsUsed = -Math.abs(record.pointsUsed);
      }
      
      StaticData.consumptions.push(record);
    }
  }

  // 按日期降序排序
  StaticData.consumptions.sort((a, b) => b.date - a.date);

  console.log('✅ 静态数据加载完成！');
  console.log(`  📊 用户数: ${StaticData.users.length}`);
  console.log(`  🏢 租户数: ${StaticData.tenants.length}`);
  console.log(`  🤖 智能体数: ${StaticData.bots.length}`);
  console.log(`  ⚙️ 工作流数: ${StaticData.workflows.length}`);
  console.log(`  💰 消费记录数: ${StaticData.consumptions.length}`);

  // 导出到全局
  if (typeof window !== 'undefined') {
    window.MockData = {
      users: StaticData.users,
      tenants: StaticData.tenants,
      assets: {
        bots: StaticData.bots,
        workflows: StaticData.workflows,
        tools: [],
        toolLibs: [],
        knowledgeBases: [],
        spaces: []
      },
      consumptions: StaticData.consumptions
    };
  }

})();

