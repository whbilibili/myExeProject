/**
 * 智能体成本与使用分析 - 主应用
 */

const { createApp, ref, computed, onMounted, nextTick } = Vue;
const { ElMessage } = ElementPlus;

// 安全获取图标
let Download, Setting;
try {
  if (typeof ElementPlusIconsVue !== 'undefined') {
    Download = ElementPlusIconsVue.Download;
    Setting = ElementPlusIconsVue.Setting;
  } else if (typeof window.ElementPlusIconsVue !== 'undefined') {
    Download = window.ElementPlusIconsVue.Download;
    Setting = window.ElementPlusIconsVue.Setting;
  }
} catch (e) {
  console.warn('图标加载失败，将使用文本按钮', e);
}

createApp({
  setup() {
    // ==================== 状态管理 ====================
    const loading = ref(false);
    const timeRange = ref('30days');
    const customDateRange = ref(null);
    const selectedTenants = ref([]);
    const tenantList = ref([]);
    
    // Top10 Tab切换
    const top10ActiveTab = ref('tokens');
    
    // 图表相关状态
    const histogramMetric = ref('cost');
    const boxplotMetric = ref('cost');
    const useLogScale = ref(false);
    const quadrantLogScaleX = ref(false);
    const quadrantLogScaleY = ref(false);
    const showChartSettings = ref(false);
    
    // 气泡图配置状态
    const showBubbleSettings = ref(false);
    const bubbleSizeRange = ref([15, 70]); // 气泡大小范围 [最小, 最大]
    const bubbleOpacityRange = ref([0.4, 1.0]); // 颜色透明度范围 [最浅, 最深]
    const bubbleSizeField = ref('userCount'); // 气泡大小映射字段
    const bubbleColorField = ref('cost'); // 颜色深浅映射字段
    
    // 表格相关状态
    const currentPage = ref(1);
    const pageSize = ref(20);
    const showColumnDialog = ref(false);
    const selectedColumns = ref([]);
    const checkAll = ref(false);
    const isIndeterminate = ref(false);
    const highlightedAgentId = ref(null);
    
    // 数据
    const agentData = ref([]);
    const filteredAgentData = ref([]);
    const charts = {};
    
    // ==================== 计算属性 ====================
    
    // 获取天数
    const getDays = () => {
      switch (timeRange.value) {
        case 'today': return 1;
        case '7days': return 7;
        case '30days': return 30;
        case '180days': return 180;
        case '365days': return 365;
        case 'custom':
          if (customDateRange.value && customDateRange.value.length === 2) {
            const diff = Math.ceil((customDateRange.value[1] - customDateRange.value[0]) / (1000 * 60 * 60 * 24));
            return diff;
          }
          return 30;
        default: return 30;
      }
    };
    
    // KPI指标
    const agentKPIs = computed(() => {
      if (filteredAgentData.value.length === 0) return [];
      
      const total = filteredAgentData.value.length;
      const totalCost = filteredAgentData.value.reduce((sum, a) => sum + a.cost, 0);
      const totalTokens = filteredAgentData.value.reduce((sum, a) => sum + a.totalTokens, 0);
      const totalCalls = filteredAgentData.value.reduce((sum, a) => sum + a.callCount, 0);
      const avgCostPerCall = totalCalls > 0 ? totalCost / totalCalls : 0;
      const avgTokensPerCall = totalCalls > 0 ? totalTokens / totalCalls : 0;
      
      // 成本最高的智能体
      const mostExpensive = filteredAgentData.value.reduce((max, a) => a.cost > max.cost ? a : max, filteredAgentData.value[0]);
      
      // 调用最频繁的智能体
      const mostUsed = filteredAgentData.value.reduce((max, a) => a.callCount > max.callCount ? a : max, filteredAgentData.value[0]);
      
      return [
        {
          key: 'total',
          label: '智能体总数',
          value: total,
          tooltip: '在选定时间内，创建的总智能体数量'
        },
        {
          key: 'totalCost',
          label: '智能体总花费',
          value: Utils.formatCurrency(totalCost),
          tooltip: '所有智能体消耗的 Token 总成本'
        },
        {
          key: 'totalTokens',
          label: '智能体总Token消耗',
          value: Utils.formatToken(totalTokens),
          tooltip: '所有智能体的 Token 总消耗'
        },
        {
          key: 'totalCalls',
          label: '智能体总调用次数',
          value: Utils.formatNumber(totalCalls),
          tooltip: '所有智能体被调用的总次数，即智能体的总对话轮次'
        },
        {
          key: 'avgCostPerCall',
          label: '平均每次调用成本',
          value: Utils.formatCurrency(avgCostPerCall),
          tooltip: '智能体总花费 / 智能体总调用次数'
        },
        {
          key: 'avgTokensPerCall',
          label: '平均调用Token消耗',
          value: Utils.formatToken(avgTokensPerCall),
          tooltip: '智能体总Token消耗 / 智能体总调用次数'
        },
        {
          key: 'mostExpensive',
          label: '成本最高的智能体',
          value: mostExpensive?.name || '-',
          tooltip: '花费最多的智能体'
        },
        {
          key: 'mostUsed',
          label: '调用最频繁的智能体',
          value: mostUsed?.name || '-',
          tooltip: '调用次数最多的智能体'
        }
      ];
    });
    
    // Top10表格数据
    const tokenTop10Table = computed(() => {
      return filteredAgentData.value
        .slice()
        .sort((a, b) => b.totalTokens - a.totalTokens)
        .slice(0, 10)
        .map((agent, index) => ({
          name: agent.name,
          totalTokens: agent.totalTokens,
          creator: agent.creator
        }));
    });
    
    const costTop10Table = computed(() => {
      return filteredAgentData.value
        .slice()
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10)
        .map((agent, index) => ({
          name: agent.name,
          totalCost: agent.cost,
          creator: agent.creator
        }));
    });
    
    const callsTop10Table = computed(() => {
      return filteredAgentData.value
        .slice()
        .sort((a, b) => b.callCount - a.callCount)
        .slice(0, 10)
        .map((agent, index) => ({
          name: agent.name,
          totalCalls: agent.callCount,
          creator: agent.creator
        }));
    });
    
    // 表格列定义
    const allColumns = [
      // 标识信息
      { prop: 'name', label: '智能体名称', width: 200, sortable: true },
      { prop: 'id', label: '智能体 ID', width: 150, sortable: false },
      { prop: 'creator', label: '创建者', width: 120, sortable: false },
      { prop: 'ownerTenant', label: '所属租户', width: 180, sortable: false },
      { prop: 'createTime', label: '创建日期', width: 120, sortable: true, formatter: (row) => Utils.formatDate(row.createTime) },
      { prop: 'agentType', label: '智能体类型', width: 120, sortable: true },
      { prop: 'status', label: '智能体状态', width: 100, sortable: true },
      { prop: 'lastUpdated', label: '最后更新时间', width: 160, sortable: true, formatter: (row) => Utils.formatDateTime(row.lastUpdated) },
      { prop: 'lastCallTime', label: '最后运行时间', width: 160, sortable: true, formatter: (row) => Utils.formatDateTime(row.lastCallTime) },
      
      // 成本指标
      { prop: 'cost', label: '总花费(￥)', width: 120, sortable: true, formatter: (row) => Utils.formatCurrency(row.cost) },
      { prop: 'totalTokens', label: '总 Token 消耗', width: 150, sortable: true, formatter: (row) => Utils.formatToken(row.totalTokens) },
      { prop: 'inputTokens', label: '输入 Token', width: 130, sortable: true, formatter: (row) => Utils.formatToken(row.inputTokens) },
      { prop: 'outputTokens', label: '输出 Token', width: 130, sortable: true, formatter: (row) => Utils.formatToken(row.outputTokens) },
      { prop: 'costPercentage', label: '成本占比', width: 100, sortable: false, formatter: (row) => row.costPercentage || getCostPercentage(row.cost) },
      
      // 使用指标
      { prop: 'callCount', label: '总对话轮次', width: 120, sortable: true, formatter: (row) => Utils.formatNumber(row.callCount) },
      { prop: 'userCount', label: '活跃用户数', width: 120, sortable: true, formatter: (row) => Utils.formatNumber(row.userCount) },
      { prop: 'callsPerUser', label: '人均对话轮次', width: 130, sortable: true, formatter: (row) => Utils.formatNumber(row.callsPerUser) },
      { prop: 'sessionCount', label: '总会话数', width: 120, sortable: true, formatter: (row) => Utils.formatNumber(row.sessionCount) },
      { prop: 'callsPerSession', label: '平均每会话对话轮次', width: 180, sortable: true, formatter: (row) => Utils.formatNumber(row.callsPerSession) },
      
      // 效率与性能
      { prop: 'avgCostPerCall', label: '平均每次调用成本(￥)', width: 180, sortable: true, formatter: (row) => Utils.formatCurrency(row.avgCostPerCall) },
      { prop: 'avgTokensPerCall', label: '平均每次调用 Token', width: 170, sortable: true, formatter: (row) => Utils.formatToken(row.avgTokensPerCall) },
      { prop: 'successRate', label: '调用成功率(%)', width: 140, sortable: true, formatter: (row) => row.successRate.toFixed(2) + '%' },
      { prop: 'avgResponseTime', label: '平均响应时间(ms)', width: 150, sortable: true, formatter: (row) => (row.avgResponseTime * 1000).toFixed(0) + 'ms' },
      
      // 关键归因
      { prop: 'primaryModel', label: '花费最多模型', width: 150, sortable: false },
    ];
    
    // 默认显示的列（按PRD要求）
    const defaultColumns = ['name', 'cost', 'callCount', 'avgCostPerCall', 'successRate', 'creator', 'agentType', 'status', 'primaryModel', 'lastCallTime'];
    
    // 可见列
    const visibleColumns = computed(() => {
      const selected = selectedColumns.value.length > 0 ? selectedColumns.value : defaultColumns;
      return allColumns.filter(col => selected.includes(col.prop));
    });
    
    // 计算成本占比
    const getCostPercentage = (cost) => {
      const totalCost = filteredAgentData.value.reduce((sum, a) => sum + a.cost, 0);
      return totalCost > 0 ? ((cost / totalCost) * 100).toFixed(2) + '%' : '0%';
    };
    
    // 表格数据（分页）
    const tableData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredAgentData.value.slice(start, start + pageSize.value);
    });
    
    // ==================== 方法 ====================
    
    // 加载数据
    const loadData = () => {
      loading.value = true;
      setTimeout(() => {
        try {
          const days = getDays();
          agentData.value = MockData.generateAgentData(days);
          tenantList.value = MockData.generateTenantList();
          
      // 应用租户筛选（需要根据租户名称匹配）
      applyTenantFilter();
          
          loading.value = false;
          nextTick(() => {
            renderAllCharts();
          });
        } catch (e) {
          console.error('数据加载失败:', e);
          loading.value = false;
          ElMessage.error('数据加载失败，请刷新页面重试');
        }
      }, 500);
    };
    
    // 应用租户筛选
    const applyTenantFilter = () => {
      if (selectedTenants.value.length === 0) {
        filteredAgentData.value = [...agentData.value];
      } else {
        // 获取选中的租户名称列表
        const selectedTenantNames = tenantList.value
          .filter(t => selectedTenants.value.includes(t.id))
          .map(t => t.name);
        
        filteredAgentData.value = agentData.value.filter(agent => 
          selectedTenantNames.includes(agent.ownerTenant)
        );
      }
      
      // 计算成本占比
      const totalCost = filteredAgentData.value.reduce((sum, a) => sum + a.cost, 0);
      filteredAgentData.value.forEach(agent => {
        agent.costPercentage = getCostPercentage(agent.cost);
      });
    };
    
    // 渲染所有图表
    const renderAllCharts = () => {
      // Top10图表根据当前tab渲染
      renderTop10Charts();
      renderQuadrantChart();
      updateHistogram();
      updateBoxplot();
    };
    
    // 渲染Top10趋势图表（根据当前选中的tab）
    const renderTop10Charts = () => {
      const days = getDays();
      
      // 只渲染当前选中的tab对应的图表
      switch (top10ActiveTab.value) {
        case 'tokens':
          renderTokenTop10Chart(days);
          break;
        case 'cost':
          renderCostTop10Chart(days);
          break;
        case 'calls':
          renderCallsTop10Chart(days);
          break;
      }
    };
    
    // 渲染Token Top10图表
    const renderTokenTop10Chart = (days) => {
      nextTick(() => {
        const tokenData = MockData.generateAgentTop10TimeSeriesData(filteredAgentData.value, days, 'tokens');
        if (charts['token-top10-chart']) charts['token-top10-chart'].dispose();
        charts['token-top10-chart'] = Utils.initChart('token-top10-chart', 
          ChartConfig.createStackedAreaChart(tokenData, 'Token消耗', Utils.formatToken)
        );
      });
    };
    
    // 渲染费用 Top10图表
    const renderCostTop10Chart = (days) => {
      nextTick(() => {
        const costData = MockData.generateAgentTop10TimeSeriesData(filteredAgentData.value, days, 'cost');
        if (charts['cost-top10-chart']) charts['cost-top10-chart'].dispose();
        charts['cost-top10-chart'] = Utils.initChart('cost-top10-chart', 
          ChartConfig.createStackedAreaChart(costData, '费用消耗(￥)', Utils.formatCurrency)
        );
      });
    };
    
    // 渲染调用次数 Top10图表
    const renderCallsTop10Chart = (days) => {
      nextTick(() => {
        const callsData = MockData.generateAgentTop10TimeSeriesData(filteredAgentData.value, days, 'calls');
        if (charts['calls-top10-chart']) charts['calls-top10-chart'].dispose();
        charts['calls-top10-chart'] = Utils.initChart('calls-top10-chart', 
          ChartConfig.createStackedAreaChart(callsData, '调用次数', Utils.formatNumber)
        );
      });
    };
    
    // Top10 Tab切换处理
    const handleTop10TabChange = (tabName) => {
      const days = getDays();
      switch (tabName) {
        case 'tokens':
          renderTokenTop10Chart(days);
          break;
        case 'cost':
          renderCostTop10Chart(days);
          break;
        case 'calls':
          renderCallsTop10Chart(days);
          break;
      }
    };
    
    // 导出Top10数据
    const exportTop10Data = (type) => {
      let data = [];
      let columns = [];
      let filename = '';
      
      switch (type) {
        case 'tokens':
          data = tokenTop10Table.value;
          columns = [
            { label: '排行', prop: 'index' },
            { label: '智能体名称', prop: 'name' },
            { label: '总Token消耗', prop: 'totalTokens' },
            { label: '创建人', prop: 'creator' }
          ];
          filename = `Token消耗Top10_${new Date().toISOString().slice(0, 10)}.csv`;
          break;
        case 'cost':
          data = costTop10Table.value;
          columns = [
            { label: '排行', prop: 'index' },
            { label: '智能体名称', prop: 'name' },
            { label: '总费用消耗(￥)', prop: 'totalCost' },
            { label: '创建人', prop: 'creator' }
          ];
          filename = `费用消耗Top10_${new Date().toISOString().slice(0, 10)}.csv`;
          break;
        case 'calls':
          data = callsTop10Table.value;
          columns = [
            { label: '排行', prop: 'index' },
            { label: '智能体名称', prop: 'name' },
            { label: '总调用次数', prop: 'totalCalls' },
            { label: '创建人', prop: 'creator' }
          ];
          filename = `调用次数Top10_${new Date().toISOString().slice(0, 10)}.csv`;
          break;
      }
      
      // 添加排行序号
      const dataWithIndex = data.map((item, index) => ({
        ...item,
        index: index + 1
      }));
      
      Utils.exportToCSV(dataWithIndex, filename, columns);
    };
    
    // 渲染四象限气泡图
    const renderQuadrantChart = () => {
      const bubbleData = filteredAgentData.value.map(agent => {
        // 根据配置的字段获取气泡大小和颜色深浅的值
        // 处理字段名映射：tokens -> totalTokens
        const fieldMap = {
          'tokens': 'totalTokens',
          'cost': 'cost',
          'userCount': 'userCount',
          'callCount': 'callCount'
        };
        const actualSizeField = fieldMap[bubbleSizeField.value] || bubbleSizeField.value;
        const actualColorField = fieldMap[bubbleColorField.value] || bubbleColorField.value;
        
        const sizeValue = agent[actualSizeField] || 0;
        const colorValue = agent[actualColorField] || 0;
        
        return {
          name: agent.name,
          x: agent.callCount,
          y: agent.avgCostPerCall,
          size: agent.userCount,
          cost: agent.cost,
          userCount: agent.userCount,
          callCount: agent.callCount,
          tokens: agent.totalTokens || 0,
          [bubbleSizeField.value]: sizeValue,
          [bubbleColorField.value]: colorValue,
          id: agent.id
        };
      });
      
      if (charts['quadrant-chart']) charts['quadrant-chart'].dispose();
      charts['quadrant-chart'] = Utils.initChart('quadrant-chart', 
        ChartConfig.createBubbleChart(
          bubbleData, 
          '智能体调用次数', 
          '每次调用的成本(￥)',
          quadrantLogScaleX.value,
          quadrantLogScaleY.value,
          {
            sizeRange: bubbleSizeRange.value,
            opacityRange: bubbleOpacityRange.value,
            sizeField: bubbleSizeField.value,
            colorField: bubbleColorField.value
          }
        )
      );
      
      // 添加点击事件
      charts['quadrant-chart'].on('click', (params) => {
        if (params.data && params.value && params.value[6]) {
          // params.value[6] 是ID
          drillDown({ id: params.value[6] });
        }
      });
    };
    
    // 切换四象限图对数尺度
    const toggleQuadrantLogScale = (axis) => {
      if (axis === 'x') {
        quadrantLogScaleX.value = !quadrantLogScaleX.value;
      } else {
        quadrantLogScaleY.value = !quadrantLogScaleY.value;
      }
      renderQuadrantChart();
    };
    
    // 更新直方图
    const updateHistogram = () => {
      let data = [];
      let label = '';
      
      switch (histogramMetric.value) {
        case 'cost':
          data = filteredAgentData.value.map(a => a.cost);
          label = '智能体费用消耗';
          break;
        case 'tokens':
          data = filteredAgentData.value.map(a => a.totalTokens);
          label = '智能体Token消耗';
          break;
        case 'calls':
          data = filteredAgentData.value.map(a => a.callCount);
          label = '智能体调用次数';
          break;
        case 'users':
          data = filteredAgentData.value.map(a => a.userCount);
          label = '智能体用户数';
          break;
      }
      
      if (charts['histogram-chart']) charts['histogram-chart'].dispose();
      charts['histogram-chart'] = Utils.initChart('histogram-chart', 
        ChartConfig.createDynamicHistogram(data, label)
      );
    };
    
    // 更新箱线图
    const updateBoxplot = () => {
      const officialAgents = filteredAgentData.value.filter(a => a.agentType === '官方创建');
      const userAgents = filteredAgentData.value.filter(a => a.agentType === '用户创建');
      
      let officialValues = [];
      let userValues = [];
      let officialAgentInfo = [];
      let userAgentInfo = [];
      let metricLabel = '';
      
      switch (boxplotMetric.value) {
        case 'cost':
          officialValues = officialAgents.map(a => a.cost);
          userValues = userAgents.map(a => a.cost);
          officialAgentInfo = officialAgents.map(a => ({ name: a.name, value: a.cost }));
          userAgentInfo = userAgents.map(a => ({ name: a.name, value: a.cost }));
          metricLabel = '费用消耗(￥)';
          break;
        case 'avgCostPerCall':
          officialValues = officialAgents.map(a => a.avgCostPerCall);
          userValues = userAgents.map(a => a.avgCostPerCall);
          officialAgentInfo = officialAgents.map(a => ({ name: a.name, value: a.avgCostPerCall }));
          userAgentInfo = userAgents.map(a => ({ name: a.name, value: a.avgCostPerCall }));
          metricLabel = '每次调用的成本(￥)';
          break;
        case 'calls':
          officialValues = officialAgents.map(a => a.callCount);
          userValues = userAgents.map(a => a.callCount);
          officialAgentInfo = officialAgents.map(a => ({ name: a.name, value: a.callCount }));
          userAgentInfo = userAgents.map(a => ({ name: a.name, value: a.callCount }));
          metricLabel = '调用次数';
          break;
        case 'avgTokensPerCall':
          officialValues = officialAgents.map(a => a.avgTokensPerCall);
          userValues = userAgents.map(a => a.avgTokensPerCall);
          officialAgentInfo = officialAgents.map(a => ({ name: a.name, value: a.avgTokensPerCall }));
          userAgentInfo = userAgents.map(a => ({ name: a.name, value: a.avgTokensPerCall }));
          metricLabel = '每次调用的Token数';
          break;
      }
      
      const boxplotData = [
        { group: '官方(汇总)', values: officialValues, agentInfo: officialAgentInfo },
        { group: '用户创建(汇总)', values: userValues, agentInfo: userAgentInfo }
      ];
      
      if (charts['boxplot-chart']) charts['boxplot-chart'].dispose();
      charts['boxplot-chart'] = Utils.initChart('boxplot-chart', 
        ChartConfig.createAgentBoxPlotChart(boxplotData, useLogScale.value, metricLabel)
      );
      
      // 添加异常值点击事件
      charts['boxplot-chart'].on('click', (params) => {
        if (params.seriesType === 'scatter' && params.data && params.data.agentName) {
          const agent = filteredAgentData.value.find(a => a.name === params.data.agentName);
          if (agent) {
            drillDown(agent);
          }
        }
      });
    };
    
    // 切换对数尺度
    const toggleLogScale = () => {
      useLogScale.value = !useLogScale.value;
      updateBoxplot();
    };
    
    // 锚点滚动
    const scrollToAnchor = (anchorId) => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    
    // 时间范围改变
    const handleTimeRangeChange = () => {
      loadData();
    };
    
    // 租户筛选改变
    const handleTenantChange = () => {
      applyTenantFilter();
      nextTick(() => {
        renderAllCharts();
      });
    };
    
    // 刷新
    const handleRefresh = () => {
      loadData();
    };
    
    // 导出
    const handleExport = () => {
      const columns = visibleColumns.value.map(col => ({
        label: col.label,
        prop: col.prop
      }));
      const filename = `智能体成本分析_${new Date().toISOString().slice(0, 10)}.csv`;
      Utils.exportToCSV(filteredAgentData.value, filename, columns);
    };
    
    // 分页改变
    const handlePageChange = () => {
      // 分页逻辑已在computed中处理
    };
    
    // 表格行点击
    const handleRowClick = (row) => {
      highlightedAgentId.value = row.id;
      highlightCharts(row.id);
    };
    
    // 表格行Hover
    const handleRowHover = (row) => {
      highlightedAgentId.value = row.id;
      highlightCharts(row.id);
    };
    
    // 表格行离开
    const handleRowLeave = () => {
      highlightedAgentId.value = null;
      unhighlightCharts();
    };
    
    // 高亮图表
    const highlightCharts = (agentId) => {
      const agent = filteredAgentData.value.find(a => a.id === agentId);
      if (!agent) return;
      
      // 高亮四象限图中的气泡
      if (charts['quadrant-chart']) {
        charts['quadrant-chart'].dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: filteredAgentData.value.findIndex(a => a.id === agentId)
        });
      }
    };
    
    // 取消高亮
    const unhighlightCharts = () => {
      if (charts['quadrant-chart']) {
        charts['quadrant-chart'].dispatchAction({
          type: 'downplay'
        });
      }
    };
    
    // 钻取详情
    const drillDown = (row) => {
      ElMessage.info(`查看智能体详情: ${row.name || row.id}`);
      // 这里可以打开详情页或模态框
      // window.open(`agent-detail.html?id=${row.id}`, '_blank');
    };
    
    // 自定义列相关
    const handleCheckAllChange = (val) => {
      selectedColumns.value = val ? allColumns.map(col => col.prop) : [];
      isIndeterminate.value = false;
    };
    
    const handleColumnChange = (value) => {
      const checkedCount = value.length;
      checkAll.value = checkedCount === allColumns.length;
      isIndeterminate.value = checkedCount > 0 && checkedCount < allColumns.length;
    };
    
    const saveColumnSettings = () => {
      showColumnDialog.value = false;
      // 列设置已通过selectedColumns响应式更新
    };
    
    // ==================== 生命周期 ====================
    
    onMounted(() => {
      // 初始化默认选中的列
      selectedColumns.value = [...defaultColumns];
      checkAll.value = false;
      isIndeterminate.value = false;
      
      // 加载数据
      loadData();
    });
    
    // ==================== 返回 ====================
    
    return {
      Utils,
      loading,
      timeRange,
      customDateRange,
      selectedTenants,
      tenantList,
      histogramMetric,
      boxplotMetric,
      useLogScale,
      currentPage,
      pageSize,
      showColumnDialog,
      selectedColumns,
      checkAll,
      isIndeterminate,
      agentKPIs,
      tokenTop10Table,
      costTop10Table,
      callsTop10Table,
      allColumns,
      visibleColumns,
      tableData,
      filteredAgentData,
      scrollToAnchor,
      handleTimeRangeChange,
      handleTenantChange,
      handleRefresh,
      handleExport,
      handlePageChange,
      handleRowClick,
      handleRowHover,
      handleRowLeave,
      drillDown,
      updateHistogram,
      updateBoxplot,
      toggleLogScale,
      toggleQuadrantLogScale,
      quadrantLogScaleX,
      quadrantLogScaleY,
      showBubbleSettings,
      bubbleSizeRange,
      bubbleOpacityRange,
      bubbleSizeField,
      bubbleColorField,
      handleCheckAllChange,
      handleColumnChange,
      saveColumnSettings,
      top10ActiveTab,
      handleTop10TabChange,
      exportTop10Data,
      showChartSettings,
      Download: Download || null,
      Setting: Setting || null,
    };
  },
}).use(ElementPlus).mount('#app');

