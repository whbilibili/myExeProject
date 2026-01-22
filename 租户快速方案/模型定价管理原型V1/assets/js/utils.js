// 通用工具方法

const Utils = (() => {
  function formatPriceYuanPerK(n) {
    if (n === null || n === undefined || isNaN(Number(n))) return '-';
    return `${Number(n).toFixed(2)} 点/1k`;
  }

  function clampToTwoDecimals(value) {
    if (value === '' || value === null || value === undefined) return '';
    const num = Number(value);
    if (isNaN(num) || num < 0) return null;
    return Math.round(num * 100) / 100;
  }

  function paginate(list, page, size) {
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const current = Math.min(Math.max(1, page), pages);
    const start = (current - 1) * size;
    const items = list.slice(start, start + size);
    return { items, total, pages, current, size };
  }

  function uniq(arr) { return Array.from(new Set(arr)); }

  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function openModal(el) { el.setAttribute('aria-hidden', 'false'); }
  function closeModal(el) { el.setAttribute('aria-hidden', 'true'); }

  return {
    formatPriceYuanPerK,
    clampToTwoDecimals,
    paginate,
    uniq,
    qs,
    qsa,
    openModal,
    closeModal,
  };
})();


