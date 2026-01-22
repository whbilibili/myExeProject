// Utility Functions for User Management System

const Utils = {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '-';
    if (typeof date === 'string') date = new Date(date);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  // 格式化数字（千分位）
  formatNumber(num, decimals = 0) {
    if (num === null || num === undefined) return '-';
    return Number(num).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  // 格式化文件大小
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 格式化Token数量
  formatTokens(tokens) {
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(2) + ' M';
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(2) + ' K';
    }
    return tokens.toString();
  },

  // 格式化时长（分钟转小时分钟）
  formatDuration(minutes) {
    if (!minutes) return '0分钟';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  },

  // 日期范围快捷选项
  dateRangeShortcuts: [
    {
      text: '最近7天',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      }
    },
    {
      text: '最近30天',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      }
    },
    {
      text: '最近90天',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      }
    },
    {
      text: '本月',
      value: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return [start, end];
      }
    },
    {
      text: '上月',
      value: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
        const lastDay = new Date(end.getFullYear(), end.getMonth(), 0);
        return [start, lastDay];
      }
    }
  ],

  // 防抖函数
  debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },

  // 节流函数
  throttle(fn, delay = 300) {
    let timer = null;
    return function(...args) {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  },

  // 深拷贝
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // 导出CSV
  exportToCSV(data, filename = 'export.csv') {
    if (!data || !data.length) {
      console.error('No data to export');
      return;
    }

    // 获取表头
    const headers = Object.keys(data[0]);
    
    // 构建CSV内容
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号、引号或换行符的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });

    // 创建Blob并下载
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // 聚合数据按粒度
  aggregateByGranularity(data, granularity = 'daily') {
    const result = {};
    
    data.forEach(item => {
      let key;
      const date = new Date(item.date);
      
      if (granularity === 'daily') {
        key = this.formatDate(date, 'YYYY-MM-DD');
      } else if (granularity === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = this.formatDate(weekStart, 'YYYY-MM-DD');
      } else if (granularity === 'monthly') {
        key = this.formatDate(date, 'YYYY-MM');
      }
      
      if (!result[key]) {
        result[key] = { ...item, count: 0 };
      }
      
      // 累加数值字段
      Object.keys(item).forEach(field => {
        if (typeof item[field] === 'number') {
          if (result[key][field]) {
            result[key][field] += item[field];
          } else {
            result[key][field] = item[field];
          }
        }
      });
      result[key].count++;
    });
    
    return Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // 计算百分比变化
  calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(2);
  },

  // 生成颜色（根据值）
  getColorByValue(value, max, colorScale = ['#67C23A', '#E6A23C', '#F56C6C']) {
    const percentage = value / max;
    if (percentage < 0.33) {
      return colorScale[0];
    } else if (percentage < 0.67) {
      return colorScale[1];
    } else {
      return colorScale[2];
    }
  },

  // 获取状态标签类型
  getStatusType(status) {
    const statusMap = {
      '正常': 'success',
      '已禁用': 'danger',
      '已发布': 'success',
      '未发布': 'info',
      '草稿': 'warning',
      '已删除': 'danger',
      '启用': 'success',
      '未启用': 'info',
      '消耗': 'danger',
      '返还': 'success'
    };
    return statusMap[status] || 'info';
  },

  // 复制到剪贴板
  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => {
        return true;
      }).catch(err => {
        console.error('复制失败:', err);
        return false;
      });
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve(true);
      } catch (err) {
        document.body.removeChild(textarea);
        console.error('复制失败:', err);
        return Promise.resolve(false);
      }
    }
  },

  // 生成随机颜色
  randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  // 获取头像缩写
  getAvatarAbbr(name) {
    if (!name) return '?';
    if (name.length <= 2) return name;
    return name.substr(0, 2);
  },

  // 高亮搜索关键词
  highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  },

  // 表格排序函数
  tableSortMethod(a, b, key, order = 'ascending') {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    let result = 0;
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      result = valueA - valueB;
    } else if (valueA instanceof Date && valueB instanceof Date) {
      result = valueA.getTime() - valueB.getTime();
    } else {
      result = String(valueA).localeCompare(String(valueB));
    }
    
    return order === 'ascending' ? result : -result;
  },

  // 过滤数据
  filterData(data, filters) {
    return data.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];
        
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true;
        }
        
        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        
        if (typeof filterValue === 'string') {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return itemValue === filterValue;
      });
    });
  }
};

// 导出
window.Utils = Utils;


