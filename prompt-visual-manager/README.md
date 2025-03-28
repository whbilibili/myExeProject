# Prompt 可视化管理工具

一个用于创建、编辑、组织和使用提示词（Prompt）的高效可视化工具。

## 功能特点

- **Prompt创建与编辑**：提供可视化的编辑界面，支持格式化文本、添加变量等
- **模板功能**：内置多种常见的 Prompt 模板，快速开始创建
- **标签与分类管理**：通过标签组织和筛选 Prompt
- **版本控制**：记录 Prompt 的修改历史，比较差异
- **搜索功能**：快速查找所需的 Prompt
- **共享与协作**：与团队成员共享 Prompt，支持协作编辑
- **可视化展示**：直观展示 Prompt 的结构和组成部分
- **变量管理**：定义和管理 Prompt 中的变量
- **效果评估与反馈**：记录使用效果和反馈信息
- **数据统计与分析**：提供使用数据的统计和分析

## 项目结构

\`\`\`
prompt-visual-manager/
├── css/                # 样式文件
│   └── styles.css      # 自定义样式
├── js/                 # JavaScript 文件
│   └── main.js         # 主要脚本
├── img/                # 图片资源
├── pages/              # 页面文件
│   ├── dashboard.html  # 仪表盘
│   ├── prompt-library.html  # Prompt 库
│   ├── editor.html     # 编辑器
│   ├── templates.html  # 模板中心
│   └── collaboration.html  # 协作页面
└── index.html          # 主页
\`\`\`

## 技术栈

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- Font Awesome (图标)
- Chart.js (图表)

## 使用指南

1. **仪表盘**：查看 Prompt 使用统计和快速访问常用 Prompt
2. **Prompt 库**：浏览、搜索和管理所有 Prompt
3. **编辑器**：创建和编辑 Prompt，管理变量和设置
4. **模板中心**：浏览和使用预设的 Prompt 模板
5. **协作**：管理共享和团队协作

## 开发指南

### 本地开发

1. 克隆仓库：
   \`\`\`
   git clone https://github.com/yourusername/prompt-visual-manager.git
   \`\`\`

2. 打开项目目录：
   \`\`\`
   cd prompt-visual-manager
   \`\`\`

3. 使用本地服务器运行项目，例如使用 Python 的 HTTP 服务器：
   \`\`\`
   python -m http.server
   \`\`\`

4. 在浏览器中访问 `http://localhost:8000`

### 自定义开发

- 修改 `css/styles.css` 自定义样式
- 在 `js/main.js` 中添加新功能
- 在 `pages/` 目录下添加新页面

## 未来计划

- 添加更多模板类型
- 实现 AI 辅助的 Prompt 优化建议
- 提供更详细的使用效果分析
- 支持更多格式的导入/导出
- 集成更多第三方工具

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License