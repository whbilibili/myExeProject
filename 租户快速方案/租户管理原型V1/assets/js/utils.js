/**
 * 工具函数 - 租户管理原型
 */

// ==================== 格式化函数 ====================

// 格式化数字，添加千分位
function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('zh-CN');
}

// 格式化大数字（K, M, B）
function formatLargeNumber(num) {
  if (num === null || num === undefined) return '-';
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化日期时间
function formatDateTime(dateString) {
  if (!dateString) return '-';
  return dateString.slice(0, 19).replace('T', ' ');
}

// 格式化百分比
function formatPercent(value, total) {
  if (!total) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

// ==================== 状态相关 ====================

// 获取状态类型（用于样式）
function getStatusType(status) {
  const statusMap = {
    '正常': 'success',
    '已禁用': 'danger',
    '套餐到期': 'warning',
    '已发布': 'success',
    '已删除': 'danger',
    '启用': 'success',
    '未启用': 'default',
    '禁用': 'danger',
  };
  return statusMap[status] || 'default';
}

// 获取版本标签类型
function getVersionType(version) {
  const versionMap = {
    '试用版': 'default',
    '团队版': 'info',
    '企业版': 'success',
  };
  return versionMap[version] || 'default';
}

// ==================== URL 参数相关 ====================

// 获取URL参数
function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 设置URL参数（不刷新页面）
function setUrlParam(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.pushState({}, '', url);
}

// ==================== 存储相关 ====================

// 保存到 localStorage
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('保存到localStorage失败:', e);
  }
}

// 从 localStorage 读取
function loadFromStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('从localStorage读取失败:', e);
    return defaultValue;
  }
}

// ==================== 确认对话框 ====================

// 二次确认对话框
function confirmAction(message, title = '确认操作') {
  return new Promise((resolve) => {
    ElMessageBox.confirm(message, title, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box',
    })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}

// 强确认对话框（需要输入指定文本）
function confirmWithInput(message, expectedText, title = '危险操作') {
  return new Promise((resolve) => {
    ElMessageBox.prompt(
      `${message}<br><br>请输入 <strong style="color: #F53F3F;">"${expectedText}"</strong> 以确认操作`,
      title,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: new RegExp(`^${expectedText}$`),
        inputErrorMessage: `请输入"${expectedText}"`,
        dangerouslyUseHTMLString: true,
        inputPlaceholder: `请输入"${expectedText}"`,
        customClass: 'custom-message-box',
      }
    )
      .then(({ value }) => {
        if (value === expectedText) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
}

// ==================== 消息提示 ====================

// 成功提示
function showSuccess(message) {
  ElMessage({
    message: message,
    type: 'success',
    duration: 3000,
  });
}

// 错误提示
function showError(message) {
  ElMessage({
    message: message,
    type: 'error',
    duration: 3000,
  });
}

// 警告提示
function showWarning(message) {
  ElMessage({
    message: message,
    type: 'warning',
    duration: 3000,
  });
}

// 信息提示
function showInfo(message) {
  ElMessage({
    message: message,
    type: 'info',
    duration: 3000,
  });
}

// ==================== 表格相关 ====================

// 表格排序
function sortTable(data, prop, order) {
  if (!order) return data;
  
  return [...data].sort((a, b) => {
    let aVal = a[prop];
    let bVal = b[prop];
    
    // 处理数字
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'ascending' ? aVal - bVal : bVal - aVal;
    }
    
    // 处理字符串
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'ascending' 
        ? aVal.localeCompare(bVal, 'zh-CN') 
        : bVal.localeCompare(aVal, 'zh-CN');
    }
    
    return 0;
  });
}

// 表格筛选
function filterTable(data, filters) {
  return data.filter(item => {
    for (let key in filters) {
      const filterValue = filters[key];
      if (!filterValue || filterValue.length === 0) continue;
      
      const itemValue = item[key];
      
      // 数组类型的筛选（多选）
      if (Array.isArray(filterValue)) {
        if (!filterValue.includes(itemValue)) {
          return false;
        }
      }
      // 字符串类型的筛选（模糊搜索）
      else if (typeof filterValue === 'string') {
        if (!itemValue || !itemValue.toString().toLowerCase().includes(filterValue.toLowerCase())) {
          return false;
        }
      }
    }
    return true;
  });
}

// 表格分页
function paginateTable(data, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

// ==================== CSV 导出 ====================

// 导出为CSV
function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) {
    showWarning('没有数据可导出');
    return;
  }
  
  // 构建CSV内容
  let csvContent = '\uFEFF'; // UTF-8 BOM
  
  // 添加表头
  const headers = columns.map(col => col.label).join(',');
  csvContent += headers + '\n';
  
  // 添加数据行
  data.forEach(row => {
    const values = columns.map(col => {
      let value = row[col.prop];
      if (value === null || value === undefined) {
        value = '';
      }
      // 处理包含逗号和换行的值
      value = String(value).replace(/"/g, '""');
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  // 创建Blob并下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSuccess('导出成功');
}

// ==================== 防抖和节流 ====================

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== 图表响应式 ====================

// 初始化图表并添加响应式监听
function initChart(elementId, option) {
  const dom = document.getElementById(elementId);
  if (!dom) {
    console.error(`找不到图表容器: ${elementId}`);
    return null;
  }
  
  const chart = echarts.init(dom);
  chart.setOption(option);
  
  // 添加窗口大小改变监听
  const resizeObserver = new ResizeObserver(
    debounce(() => {
      chart.resize();
    }, 200)
  );
  resizeObserver.observe(dom);
  
  return chart;
}

// ==================== 时间范围选择器 ====================

// 获取时间范围
function getTimeRange(type) {
  const now = new Date();
  const start = new Date();
  
  switch (type) {
    case '最近7天':
      start.setDate(now.getDate() - 7);
      break;
    case '最近30天':
      start.setDate(now.getDate() - 30);
      break;
    case '最近90天':
      start.setDate(now.getDate() - 90);
      break;
    default:
      start.setDate(now.getDate() - 30);
  }
  
  return {
    start: start.toISOString().slice(0, 10),
    end: now.toISOString().slice(0, 10),
  };
}

// ==================== 复制到剪贴板 ====================

// 复制文本到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess('已复制到剪贴板');
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    showError('复制失败');
    return false;
  }
}

// ==================== 高亮搜索关键词 ====================

// 高亮文本中的关键词
function highlightKeyword(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span style="color: #3370FF; background: #EBF2FF; padding: 2px 4px; border-radius: 2px;">$1</span>');
}

// 导出工具函数
window.Utils = {
  formatNumber,
  formatLargeNumber,
  formatDate,
  formatDateTime,
  formatPercent,
  getStatusType,
  getVersionType,
  getUrlParam,
  setUrlParam,
  saveToStorage,
  loadFromStorage,
  confirmAction,
  confirmWithInput,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  sortTable,
  filterTable,
  paginateTable,
  exportToCSV,
  debounce,
  throttle,
  initChart,
  getTimeRange,
  copyToClipboard,
  highlightKeyword,
};

