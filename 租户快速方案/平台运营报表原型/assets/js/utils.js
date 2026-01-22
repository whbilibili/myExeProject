/**
 * 工具函数 - 平台运营报表原型
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

// 格式化货币
function formatCurrency(num) {
  if (num === null || num === undefined) return '-';
  return '¥' + num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 格式化Token数量
function formatToken(num) {
  if (num === null || num === undefined) return '-';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
}

// 格式化时长（秒转分钟/小时）
function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return '-';
  if (seconds < 60) {
    return seconds.toFixed(1) + '秒';
  }
  if (seconds < 3600) {
    return (seconds / 60).toFixed(1) + '分钟';
  }
  return (seconds / 3600).toFixed(2) + '小时';
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
  if (!total || total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

// ==================== 时间范围相关 ====================

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

// ==================== CSV 导出 ====================

// 导出为CSV
function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) {
    if (typeof ElMessage !== 'undefined') {
      ElMessage.warning('没有数据可导出');
    } else {
      console.warn('没有数据可导出');
    }
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
  
  if (typeof ElMessage !== 'undefined') {
    ElMessage.success('导出成功');
  } else {
    console.log('导出成功');
  }
}

// ==================== 图表相关 ====================

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

// 导出工具函数
window.Utils = {
  formatNumber,
  formatLargeNumber,
  formatCurrency,
  formatToken,
  formatDuration,
  formatDate,
  formatDateTime,
  formatPercent,
  getTimeRange,
  exportToCSV,
  initChart,
  debounce,
  throttle,
};

