# 平台运营报表原型

## 项目简介

平台运营报表原型是一个用于展示智能体、工作流、用户和大模型四个维度数据统计的报表系统。该原型采用 Vue 3 + Element Plus + ECharts 技术栈，提供完整的数据可视化和分析功能。

## 功能特性

### 四个报表维度

1. **智能体报表**
   - 智能体总数、活跃智能体数、总调用次数、总对话轮次
   - 总Token消耗、总成本、平均调用成功率、活跃用户数
   - 成本趋势分析、Top 20成本排行
   - 调用次数趋势、成功率排行
   - 智能体明细列表（支持搜索、排序、分页）

2. **工作流报表**
   - 工作流总数、活跃工作流数、总运行次数、总Token消耗
   - 总成本、平均运行成功率、平均运行时长、活跃用户数
   - 成本趋势分析、Top 20成本排行
   - 运行次数趋势、成功率排行
   - 工作流明细列表（支持搜索、排序、分页）

3. **用户报表**
   - 总用户数、活跃用户数、总Token消耗、总成本
   - 人均Token消耗、人均成本、用户活跃度、Top用户成本占比
   - 用户成本分布、Top 50成本排行
   - 用户活跃度分析（散点图）、使用偏好分析
   - 用户明细列表（支持搜索、排序、分页）

4. **大模型报表**
   - 使用模型数、总Token消耗、总成本、平均Token单价
   - 调用次数、平均响应时间、错误率、最热门模型
   - 模型成本趋势、Top 20成本排行
   - 响应时间对比（箱线图）、错误率分析
   - 模型明细列表（支持搜索、排序、分页）

### 核心功能

- **时间范围筛选**：支持最近7天、30天、90天和自定义范围
- **数据刷新**：手动刷新数据
- **数据导出**：支持CSV格式导出当前标签页数据
- **图表可视化**：使用ECharts实现多种专业图表
- **响应式设计**：适配不同屏幕尺寸
- **Mock数据**：内置Mock数据生成器，方便演示和开发

## 技术栈

- **前端框架**：Vue 3 (CDN)
- **UI组件库**：Element Plus 2.4.4 (CDN)
- **图表库**：ECharts 5.4.3 (CDN)
- **设计系统**：飞书设计系统CSS变量
- **图标库**：Element Plus Icons

## 文件结构

```
运营后台/平台运营报表原型/
├── index.html                    # 主页面，包含4个标签页
├── assets/
│   ├── css/
│   │   └── feishu-design.css    # 飞书设计系统样式
│   └── js/
│       ├── mock-data.js          # Mock数据生成
│       ├── charts.js             # ECharts图表配置
│       └── utils.js              # 工具函数
└── README.md                      # 说明文档
```

## 使用方法

1. **直接打开**
   - 使用浏览器直接打开 `index.html` 文件即可查看

2. **本地服务器（推荐）**
   ```bash
   # 使用Python启动本地服务器
   python -m http.server 8000
   
   # 或使用Node.js
   npx http-server -p 8000
   ```
   然后访问 `http://localhost:8000`

## 数据说明

### Mock数据生成

所有数据通过 `mock-data.js` 中的函数生成：

- `generateAgentData(days)`: 生成智能体数据
- `generateWorkflowData(days)`: 生成工作流数据
- `generateUserData(days)`: 生成用户数据
- `generateModelData(days)`: 生成大模型数据
- `generateTimeSeriesData(days)`: 生成时间序列数据
- `generateTokenTimeSeriesData(days)`: 生成Token时间序列数据

### 数据字段说明

**智能体数据**：
- `id`: 智能体ID
- `name`: 智能体名称
- `status`: 状态（已发布/草稿）
- `callCount`: 调用次数
- `userCount`: 使用用户数
- `totalTokens`: Token消耗
- `cost`: 成本（元）
- `successRate`: 成功率（%）
- `avgResponseTime`: 平均响应时间（秒）

**工作流数据**：
- `id`: 工作流ID
- `name`: 工作流名称
- `status`: 状态（已发布/草稿）
- `runCount`: 运行次数
- `userCount`: 使用用户数
- `totalTokens`: Token消耗
- `cost`: 成本（元）
- `successRate`: 成功率（%）
- `avgDuration`: 平均运行时长（秒）
- `nodeCount`: 节点数

**用户数据**：
- `id`: 用户ID
- `name`: 用户名称
- `avatar`: 头像URL
- `tenant`: 所属租户
- `agentCallCount`: 智能体调用次数
- `workflowRunCount`: 工作流运行次数
- `totalTokens`: Token消耗
- `cost`: 成本（元）
- `assetCount`: 使用资产数
- `lastActiveTime`: 最后活跃时间

**大模型数据**：
- `name`: 模型名称
- `callCount`: 调用次数
- `successCount`: 成功次数
- `failCount`: 失败次数
- `errorRate`: 错误率（%）
- `totalTokens`: Token消耗
- `cost`: 成本（元）
- `avgPrice`: 平均单价（元/1K Token）
- `avgResponseTime`: 平均响应时间（毫秒）
- `mainScenario`: 主要使用场景（智能体/工作流）

## 图表类型

1. **成本趋势组合图**：柱状图（Token消耗）+ 折线图（成本）
2. **Top排行条形图**：水平条形图，显示Top 20排行
3. **使用趋势折线图**：折线图，显示使用趋势
4. **成功率条形图**：水平条形图，显示成功率排行
5. **分布直方图**：柱状图，显示数据分布
6. **散点图**：显示两个维度的关系
7. **箱线图**：显示数据分布和异常值
8. **堆叠柱状图**：显示多个数据系列的堆叠关系

## 工具函数

`utils.js` 提供了丰富的工具函数：

- **格式化函数**：`formatNumber`, `formatCurrency`, `formatToken`, `formatDuration`, `formatDate`, `formatDateTime`, `formatPercent`
- **时间范围**：`getTimeRange`
- **数据导出**：`exportToCSV`
- **图表初始化**：`initChart`
- **防抖节流**：`debounce`, `throttle`

## 样式系统

使用飞书设计系统的CSS变量：

- **颜色系统**：主色调、成功色、警告色、危险色、信息色
- **文本颜色**：四级层次（text-1 到 text-4）
- **背景色**：bg-1 到 bg-5
- **间距系统**：基于4px的间距变量
- **圆角系统**：small, medium, large, xlarge, circle, full
- **阴影系统**：shadow-1 到 shadow-4

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

1. 本原型使用Mock数据，实际使用时需要替换为真实API接口
2. 图表需要ECharts库支持，确保网络连接正常
3. 建议使用现代浏览器以获得最佳体验
4. 数据导出功能依赖浏览器支持

## 后续优化建议

1. **性能优化**
   - 大数据量时使用虚拟滚动
   - 图表数据懒加载
   - 数据缓存机制

2. **功能增强**
   - 添加数据筛选功能
   - 支持自定义时间范围
   - 添加数据对比功能
   - 支持多租户筛选

3. **用户体验**
   - 添加加载动画
   - 优化移动端体验
   - 添加数据刷新提示
   - 支持图表全屏查看

4. **数据对接**
   - 替换Mock数据为真实API
   - 添加错误处理
   - 添加数据刷新机制
   - 支持实时数据更新

## 更新日志

### v1.0.0 (2025-01-13)
- 初始版本发布
- 实现四个报表维度的基础功能
- 支持时间范围筛选和数据导出
- 完成Mock数据生成和图表可视化

## 联系方式

如有问题或建议，请联系开发团队。

