localStorage.setItem('requirements_data', JSON.stringify([
  {
    id: '1',
    name: '移动端自适应优化',
    type: '产品需求',
    description: '针对平板和手机浏览器进行样式兼容性处理，确保核心看板可以正常显示。',
    priority: '高',
    status: '设计中',
    owner: '张三',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '后端API性能压测',
    type: '技术需求',
    description: '对核心接口进行1000QPS下的并发压力测试，输出瓶颈分析报告。',
    priority: '中',
    status: '测试中',
    owner: '李四',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'SSO单点登录集成',
    type: '技术需求',
    description: '对接集团内部账户中心，实现OAuth2.0协议的单点登录功能。',
    priority: '高',
    status: '开发中',
    owner: '王五',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: '数据导出模块上线',
    type: '产品需求',
    description: '支持将需求明细导出为Excel或PDF格式，方便离线汇报。',
    priority: '低',
    status: '已上线',
    owner: '赵六',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]))
