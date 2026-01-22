/**
 * 工具函数库
 * Utility Functions Library
 */

const Utils = {
  /**
   * 日期格式化
   * @param {Date|string} date - 日期对象或字符串
   * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '-';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  /**
   * 相对时间（多久之前）
   * @param {Date|string} date - 日期
   * @returns {string} 相对时间描述
   */
  timeAgo(date) {
    if (!date) return '-';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now - d;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (years > 0) return `${years}年前`;
    if (months > 0) return `${months}个月前`;
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  },

  /**
   * 数字格式化（千分位）
   * @param {number} num - 数字
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的数字字符串
   */
  formatNumber(num, decimals = 0) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  },

  /**
   * 大数字简化（K, M, B）
   * @param {number} num - 数字
   * @param {number} decimals - 小数位数
   * @returns {string} 简化后的数字字符串
   */
  abbreviateNumber(num, decimals = 1) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const n = Number(num);
    if (n < 1000) return n.toString();
    if (n < 1000000) return (n / 1000).toFixed(decimals) + 'K';
    if (n < 1000000000) return (n / 1000000).toFixed(decimals) + 'M';
    return (n / 1000000000).toFixed(decimals) + 'B';
  },

  /**
   * 文件大小格式化
   * @param {number} bytes - 字节数
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的文件大小
   */
  formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  },

  /**
   * 百分比格式化
   * @param {number} num - 数字（0-1或0-100）
   * @param {number} decimals - 小数位数
   * @param {boolean} isDecimal - 是否为小数形式(0-1)
   * @returns {string} 百分比字符串
   */
  formatPercent(num, decimals = 2, isDecimal = true) {
    if (num === null || num === undefined || isNaN(num)) return '0%';
    
    const value = isDecimal ? num * 100 : num;
    return value.toFixed(decimals) + '%';
  },

  /**
   * 复制到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} 是否成功
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间(ms)
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 时间限制(ms)
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 生成随机颜色
   * @param {string} seed - 种子字符串
   * @returns {string} 十六进制颜色值
   */
  generateColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  },

  /**
   * 深度克隆对象
   * @param {any} obj - 要克隆的对象
   * @returns {any} 克隆后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }
    return clonedObj;
  },

  /**
   * 导出为CSV
   * @param {Array} data - 数据数组
   * @param {Array} columns - 列配置
   * @param {string} filename - 文件名
   */
  exportToCSV(data, columns, filename = 'export.csv') {
    // 构建CSV内容
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row => {
      return columns.map(col => {
        let value = row[col.prop];
        
        // 格式化处理
        if (col.formatter && typeof col.formatter === 'function') {
          value = col.formatter(row);
        }
        
        // 处理包含逗号和引号的值
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            value = `"${value}"`;
          }
        }
        
        return value || '';
      }).join(',');
    }).join('\n');
    
    const csv = '\uFEFF' + headers + '\n' + rows; // 添加BOM以支持中文
    
    // 创建Blob并下载
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * 数据聚合 - 按日期分组
   * @param {Array} data - 数据数组
   * @param {string} dateField - 日期字段名
   * @param {string} valueField - 值字段名
   * @param {string} granularity - 粒度 'day' | 'week' | 'month'
   * @returns {Object} 聚合后的数据
   */
  aggregateByDate(data, dateField, valueField, granularity = 'day') {
    const result = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      let key;
      
      switch (granularity) {
        case 'day':
          key = this.formatDate(date, 'YYYY-MM-DD');
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = this.formatDate(weekStart, 'YYYY-MM-DD');
          break;
        case 'month':
          key = this.formatDate(date, 'YYYY-MM');
          break;
        default:
          key = this.formatDate(date, 'YYYY-MM-DD');
      }
      
      if (!result[key]) {
        result[key] = 0;
      }
      result[key] += item[valueField] || 0;
    });
    
    return result;
  },

  /**
   * 数据聚合 - 按字段分组求和
   * @param {Array} data - 数据数组
   * @param {string} groupField - 分组字段
   * @param {string} sumField - 求和字段
   * @returns {Object} 聚合后的数据
   */
  aggregateByField(data, groupField, sumField) {
    const result = {};
    
    data.forEach(item => {
      const key = item[groupField];
      if (!result[key]) {
        result[key] = 0;
      }
      result[key] += item[sumField] || 0;
    });
    
    return result;
  },

  /**
   * 获取日期范围
   * @param {number} days - 天数（负数表示过去）
   * @returns {Object} {startDate, endDate}
   */
  getDateRange(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() + days);
    
    return {
      startDate: startDate,
      endDate: endDate
    };
  },

  /**
   * 生成日期数组
   * @param {Date} startDate - 开始日期
   * @param {Date} endDate - 结束日期
   * @returns {Array} 日期数组
   */
  generateDateArray(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  },

  /**
   * 获取数组中的最大值
   * @param {Array} arr - 数组
   * @param {string} field - 字段名（可选）
   * @returns {number} 最大值
   */
  getMax(arr, field) {
    if (!arr || arr.length === 0) return 0;
    
    if (field) {
      return Math.max(...arr.map(item => item[field] || 0));
    }
    return Math.max(...arr);
  },

  /**
   * 获取数组中的最小值
   * @param {Array} arr - 数组
   * @param {string} field - 字段名（可选）
   * @returns {number} 最小值
   */
  getMin(arr, field) {
    if (!arr || arr.length === 0) return 0;
    
    if (field) {
      return Math.min(...arr.map(item => item[field] || 0));
    }
    return Math.min(...arr);
  },

  /**
   * 计算平均值
   * @param {Array} arr - 数组
   * @param {string} field - 字段名（可选）
   * @returns {number} 平均值
   */
  getAverage(arr, field) {
    if (!arr || arr.length === 0) return 0;
    
    const sum = field 
      ? arr.reduce((acc, item) => acc + (item[field] || 0), 0)
      : arr.reduce((acc, val) => acc + val, 0);
    
    return sum / arr.length;
  },

  /**
   * 计算总和
   * @param {Array} arr - 数组
   * @param {string} field - 字段名（可选）
   * @returns {number} 总和
   */
  getSum(arr, field) {
    if (!arr || arr.length === 0) return 0;
    
    return field 
      ? arr.reduce((acc, item) => acc + (item[field] || 0), 0)
      : arr.reduce((acc, val) => acc + val, 0);
  },

  /**
   * 数组排序
   * @param {Array} arr - 数组
   * @param {string} field - 排序字段
   * @param {string} order - 排序方向 'asc' | 'desc'
   * @returns {Array} 排序后的数组
   */
  sortArray(arr, field, order = 'asc') {
    const sorted = [...arr].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  },

  /**
   * 获取Top N
   * @param {Array} arr - 数组
   * @param {string} field - 排序字段
   * @param {number} n - 数量
   * @returns {Array} Top N 数组
   */
  getTopN(arr, field, n = 10) {
    return this.sortArray(arr, field, 'desc').slice(0, n);
  },

  /**
   * 生成UUID
   * @returns {string} UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 获取URL参数
   * @param {string} name - 参数名
   * @returns {string|null} 参数值
   */
  getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  /**
   * 设置URL参数（不刷新页面）
   * @param {string} name - 参数名
   * @param {string} value - 参数值
   */
  setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

