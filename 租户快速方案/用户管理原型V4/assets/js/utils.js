/**
 * 工具函数库 - Utility Functions
 * 提供日期、数字格式化、复制、URL解析等通用功能
 */

const Utils = {
  /**
   * 日期格式化
   * @param {Date|string|number} date - 日期对象、时间戳或字符串
   * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '-';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  },

  /**
   * 相对时间格式化（如：3小时前、2天前）
   */
  formatRelativeTime(date) {
    if (!date) return '-';
    
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    if (months < 12) return `${months}个月前`;
    return `${years}年前`;
  },

  /**
   * 数字格式化（千分位）
   * @param {number} num - 数字
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的数字字符串
   */
  formatNumber(num, decimals = 0) {
    if (num === null || num === undefined) return '-';
    
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  },

  /**
   * 大数字简化（1000 -> 1K, 1000000 -> 1M）
   */
  formatLargeNumber(num) {
    if (num === null || num === undefined) return '-';
    
    const absNum = Math.abs(num);
    
    if (absNum >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (absNum >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (absNum >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
  },

  /**
   * 百分比格式化
   */
  formatPercent(num, decimals = 1) {
    if (num === null || num === undefined) return '-';
    return `${Number(num).toFixed(decimals)}%`;
  },

  /**
   * 文件大小格式化
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (!bytes) return '-';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * 复制到剪贴板
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 兼容旧浏览器
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
          return true;
        } catch (err) {
          console.error('复制失败:', err);
          textArea.remove();
          return false;
        }
      }
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  },

  /**
   * URL参数解析
   */
  parseUrlParams(url = window.location.href) {
    const params = {};
    const urlObj = new URL(url);
    
    for (const [key, value] of urlObj.searchParams) {
      params[key] = value;
    }
    
    return params;
  },

  /**
   * 获取URL参数
   */
  getUrlParam(key, url = window.location.href) {
    const params = this.parseUrlParams(url);
    return params[key] || null;
  },

  /**
   * 本地存储操作
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('localStorage set error:', e);
        return false;
      }
    },
    
    get(key, defaultValue = null) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (e) {
        console.error('localStorage get error:', e);
        return defaultValue;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('localStorage remove error:', e);
        return false;
      }
    },
    
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error('localStorage clear error:', e);
        return false;
      }
    }
  },

  /**
   * 防抖函数
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
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 生成随机ID
   */
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * 深拷贝
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (obj instanceof Object) {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  /**
   * 数组去重
   */
  unique(arr, key = null) {
    if (!key) {
      return [...new Set(arr)];
    }
    
    const seen = new Set();
    return arr.filter(item => {
      const val = item[key];
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
      return true;
    });
  },

  /**
   * 数组分组
   */
  groupBy(arr, key) {
    return arr.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  },

  /**
   * 导出CSV
   */
  exportCSV(data, filename = 'export.csv', headers = null) {
    if (!data || data.length === 0) {
      console.warn('没有数据可导出');
      return;
    }

    // 如果没有提供headers，使用第一个对象的keys
    const csvHeaders = headers || Object.keys(data[0]);
    
    // 构建CSV内容
    let csvContent = '\ufeff'; // UTF-8 BOM
    
    // 添加表头
    csvContent += csvHeaders.join(',') + '\n';
    
    // 添加数据行
    data.forEach(row => {
      const values = csvHeaders.map(header => {
        let value = row[header] || '';
        // 如果值包含逗号、引号或换行符，需要用引号包裹
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = '"' + value.replace(/"/g, '""') + '"';
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
  },

  /**
   * 随机颜色生成
   */
  randomColor() {
    const colors = [
      '#3370FF', '#00B42A', '#FF7D00', '#F53F3F', 
      '#7816FF', '#00B8D9', '#36CFC9', '#F7BA1E',
      '#FF77A9', '#9FDB1D'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  /**
   * 计算数组总和
   */
  sum(arr, key = null) {
    if (!key) {
      return arr.reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    return arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  },

  /**
   * 计算数组平均值
   */
  average(arr, key = null) {
    if (arr.length === 0) return 0;
    return this.sum(arr, key) / arr.length;
  },

  /**
   * 休眠函数（用于演示）
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 高亮搜索关键词
   */
  highlightKeyword(text, keyword) {
    if (!keyword || !text) return text;
    
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  /**
   * 验证邮箱
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * 验证手机号（中国）
   */
  isValidPhone(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  },

  /**
   * 时间范围计算
   */
  getTimeRange(type) {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start;

    switch(type) {
      case '7days':
        start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        break;
      case '30days':
        start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        break;
      case '90days':
        start = new Date(end.getTime() - 89 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
    }

    return { start, end };
  },

  /**
   * 生成时间序列数据（用于图表）
   */
  generateTimeSeriesData(days = 30, min = 0, max = 1000) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      data.push({
        date: this.formatDate(date, 'YYYY-MM-DD'),
        value: value
      });
    }
    
    return data;
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}


