/**
 * 工具函数库 V5 - Utility Functions
 * 从零构建的完整工具函数集，涵盖所有常用功能
 */

const Utils = {
  /**
   * ==================== 日期时间处理 ====================
   */
  
  /**
   * 格式化日期
   * @param {Date|string|number} date - 日期对象、ISO字符串或时间戳
   * @param {string} format - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '-';
    
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const pad = (num) => String(num).padStart(2, '0');
    
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },
  
  /**
   * 相对时间格式化
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
   * 获取时间范围
   */
  getTimeRange(type) {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let start;
    
    switch(type) {
      case '7days':
        start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(end.getTime() - 89 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
    }
    
    start.setHours(0, 0, 0, 0);
    return { start, end };
  },
  
  /**
   * ==================== 数字格式化 ====================
   */
  
  /**
   * 格式化数字（千分位）
   */
  formatNumber(num, decimals = 0) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  },
  
  /**
   * 大数字简化（K, M, B）
   */
  formatLargeNumber(num, decimals = 1) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    
    const absNum = Math.abs(num);
    
    if (absNum >= 1e9) {
      return (num / 1e9).toFixed(decimals) + 'B';
    }
    if (absNum >= 1e6) {
      return (num / 1e6).toFixed(decimals) + 'M';
    }
    if (absNum >= 1e3) {
      return (num / 1e3).toFixed(decimals) + 'K';
    }
    
    return num.toString();
  },
  
  /**
   * 百分比格式化
   */
  formatPercent(num, decimals = 1) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toFixed(decimals) + '%';
  },
  
  /**
   * 文件大小格式化
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (!bytes || isNaN(bytes)) return '-';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + units[i];
  },
  
  /**
   * Token数量格式化
   */
  formatTokens(tokens) {
    if (!tokens || isNaN(tokens)) return '-';
    
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(2) + 'M tokens';
    }
    if (tokens >= 1000) {
      return (tokens / 1000).toFixed(2) + 'K tokens';
    }
    
    return this.formatNumber(tokens) + ' tokens';
  },
  
  /**
   * ==================== 文本处理 ====================
   */
  
  /**
   * 复制到剪贴板
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          return successful;
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
   * 高亮关键词
   */
  highlightKeyword(text, keyword) {
    if (!keyword || !text) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(keyword)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
  
  /**
   * 转义正则表达式特殊字符
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  /**
   * 截断文本
   */
  truncate(text, length = 50, suffix = '...') {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },
  
  /**
   * ==================== URL 处理 ====================
   */
  
  /**
   * 解析 URL 参数
   */
  parseUrlParams(url = window.location.href) {
    const params = {};
    try {
      const urlObj = new URL(url);
      for (const [key, value] of urlObj.searchParams) {
        params[key] = value;
      }
    } catch (err) {
      console.error('URL解析失败:', err);
    }
    return params;
  },
  
  /**
   * 获取单个 URL 参数
   */
  getUrlParam(key, defaultValue = null) {
    const params = this.parseUrlParams();
    return params[key] || defaultValue;
  },
  
  /**
   * 构建 URL 查询字符串
   */
  buildQueryString(params) {
    const pairs = [];
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    return pairs.join('&');
  },
  
  /**
   * ==================== 本地存储 ====================
   */
  
  storage: {
    /**
     * 设置本地存储
     */
    set(key, value) {
      try {
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);
        return true;
      } catch (err) {
        console.error('存储失败:', err);
        return false;
      }
    },
    
    /**
     * 获取本地存储
     */
    get(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (err) {
        console.error('读取失败:', err);
        return defaultValue;
      }
    },
    
    /**
     * 删除本地存储
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.error('删除失败:', err);
        return false;
      }
    },
    
    /**
     * 清空本地存储
     */
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (err) {
        console.error('清空失败:', err);
        return false;
      }
    }
  },
  
  /**
   * ==================== 防抖节流 ====================
   */
  
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
   * ==================== 数组操作 ====================
   */
  
  /**
   * 数组去重
   */
  unique(arr, key = null) {
    if (!Array.isArray(arr)) return [];
    
    if (!key) {
      return [...new Set(arr)];
    }
    
    const seen = new Set();
    return arr.filter(item => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  },
  
  /**
   * 数组分组
   */
  groupBy(arr, key) {
    if (!Array.isArray(arr)) return {};
    
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
   * 数组求和
   */
  sum(arr, key = null) {
    if (!Array.isArray(arr)) return 0;
    
    if (!key) {
      return arr.reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    return arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  },
  
  /**
   * 数组平均值
   */
  average(arr, key = null) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return this.sum(arr, key) / arr.length;
  },
  
  /**
   * 数组排序
   */
  sortBy(arr, key, order = 'asc') {
    if (!Array.isArray(arr)) return [];
    
    return [...arr].sort((a, b) => {
      const aVal = key ? a[key] : a;
      const bVal = key ? b[key] : b;
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },
  
  /**
   * ==================== 对象操作 ====================
   */
  
  /**
   * 深拷贝
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    if (obj instanceof Object) {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
  },
  
  /**
   * 对象合并
   */
  merge(target, ...sources) {
    if (!target) return {};
    
    sources.forEach(source => {
      if (source) {
        Object.keys(source).forEach(key => {
          target[key] = source[key];
        });
      }
    });
    
    return target;
  },
  
  /**
   * ==================== 数据导出 ====================
   */
  
  /**
   * 导出 CSV
   */
  exportCSV(data, filename = 'export.csv', columns = null) {
    if (!data || data.length === 0) {
      console.warn('没有数据可导出');
      return;
    }
    
    // 自动获取列
    const headers = columns || Object.keys(data[0]);
    
    // 构建 CSV 内容
    let csvContent = '\ufeff'; // UTF-8 BOM
    
    // 添加表头
    csvContent += headers.map(h => this.escapeCsvValue(h)).join(',') + '\n';
    
    // 添加数据行
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return this.escapeCsvValue(value);
      });
      csvContent += values.join(',') + '\n';
    });
    
    // 下载文件
    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  },
  
  /**
   * 转义 CSV 值
   */
  escapeCsvValue(value) {
    if (value === null || value === undefined) return '';
    
    const str = String(value);
    
    // 如果包含逗号、引号或换行符，需要用引号包裹
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    
    return str;
  },
  
  /**
   * 下载文件
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  },
  
  /**
   * ==================== 验证 ====================
   */
  
  /**
   * 验证邮箱
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  /**
   * 验证手机号（中国大陆）
   */
  isValidPhone(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  },
  
  /**
   * 验证身份证号
   */
  isValidIdCard(idCard) {
    const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return regex.test(idCard);
  },
  
  /**
   * ==================== 其他工具 ====================
   */
  
  /**
   * 生成随机 ID
   */
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /**
   * 生成随机颜色
   */
  randomColor() {
    const colors = [
      '#3370FF', '#00B42A', '#FF7D00', '#F53F3F', 
      '#7816FF', '#00B8D9', '#36CFC9', '#F7BA1E',
      '#FF77A9', '#9FDB1D', '#722ED1', '#EB2F96'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  /**
   * 休眠函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * 获取随机整数
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * 获取随机浮点数
   */
  randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  },
  
  /**
   * 从数组中随机选择一个元素
   */
  randomItem(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  },
  
  /**
   * 从数组中随机选择多个元素
   */
  randomItems(arr, count) {
    if (!Array.isArray(arr)) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
  },
  
  /**
   * 生成时间序列数据（用于图表）
   */
  generateTimeSeriesData(days = 30, min = 0, max = 1000) {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const value = this.randomInt(min, max);
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

