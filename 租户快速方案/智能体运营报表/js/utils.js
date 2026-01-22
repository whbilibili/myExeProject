/**
 * 工具函数 - 智能体运营报表
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
  // 简单处理 ISO 字符串
  return dateString.slice(0, 19).replace('T', ' ');
}

// ==================== 时间范围相关 ====================

// 获取天数
function getDaysFromRange(range, customRange) {
  switch (range) {
    case 'today': return 1;
    case '7days': return 7;
    case '30days': return 30;
    case '180days': return 180;
    case '365days': return 365;
    case 'custom':
      if (customRange && customRange.length === 2) {
        const diff = Math.ceil((new Date(customRange[1]) - new Date(customRange[0])) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
      }
      return 30;
    default: return 30;
  }
}

// ==================== CSV 导出 ====================

function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) {
    console.warn('没有数据可导出');
    return;
  }
  
  let csvContent = '\uFEFF'; // UTF-8 BOM
  
  // 表头
  const headers = columns.map(col => col.label).join(',');
  csvContent += headers + '\n';
  
  // 数据行
  data.forEach(row => {
    const values = columns.map(col => {
      let value = row[col.prop];
      // 如果有 formatter，虽然通常用于显示，但导出时可能需要原始值或特定格式
      // 这里简化处理，优先使用原始值，如果是对象则尝试转字符串
      if (value === null || value === undefined) {
        value = '';
      }
      value = String(value).replace(/"/g, '""');
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== 图表相关 ====================

// 初始化图表并添加 resize 监听
function initChart(elementId, option) {
  const dom = document.getElementById(elementId);
  if (!dom) return null;
  
  const chart = echarts.init(dom);
  chart.setOption(option);
  
  const resizeHandler = debounce(() => {
    chart.resize();
  }, 200);
  
  window.addEventListener('resize', resizeHandler);
  
  // 返回 chart 实例和 cleanup 函数
  return {
    chart,
    dispose: () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    }
  };
}

// ==================== 防抖函数 ====================

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 导出全局对象
window.Utils = {
  formatNumber,
  formatLargeNumber,
  formatCurrency,
  formatToken,
  formatDate,
  formatDateTime,
  getDaysFromRange,
  exportToCSV,
  initChart,
  debounce
};

