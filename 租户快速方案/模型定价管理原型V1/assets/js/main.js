// 主交互逻辑：筛选、分页、编辑、批量编辑

(function () {
  const { qs, qsa, uniq, paginate, formatPriceYuanPerK, clampToTwoDecimals, openModal, closeModal } = Utils;

  // 状态
  const state = {
    keyword: '',
    vendors: [],
    levels: [],
    page: 1,
    size: 10,
    selectedIds: new Set(),
    options: { vendors: [], levels: [] },
  };

  // DOM refs
  const el = {
    searchName: qs('#searchName'),
    btnSearch: qs('#btnSearch'),
    btnReset: qs('#btnReset'),
    vendorSelect: qs('#vendorSelect'),
    levelSelect: qs('#levelSelect'),
    vendorMsd: qs('#vendorMsd'),
    levelMsd: qs('#levelMsd'),
    tableBody: qs('#tableBody'),
    checkAll: qs('#checkAll'),
    selectedCount: qs('#selectedCount'),
    btnBulkEdit: qs('#btnBulkEdit'),
    totalInfo: qs('#totalInfo'),
    prevPage: qs('#prevPage'),
    nextPage: qs('#nextPage'),
    pageNumbers: qs('#pageNumbers'),
    pageSize: qs('#pageSize'),
    // modals
    editModal: qs('#editModal'),
    editLevel: qs('#editLevel'),
    editPriceInput: qs('#editPriceInput'),
    editPriceOutput: qs('#editPriceOutput'),
    editId: qs('#editId'),
    editSubtitle: qs('#editSubtitle'),
    editError: qs('#editError'),
    saveEdit: qs('#saveEdit'),
    bulkModal: qs('#bulkModal'),
    bulkLevel: qs('#bulkLevel'),
    bulkPriceInput: qs('#bulkPriceInput'),
    bulkPriceOutput: qs('#bulkPriceOutput'),
    bulkSubtitle: qs('#bulkSubtitle'),
    bulkError: qs('#bulkError'),
    saveBulk: qs('#saveBulk'),
  };

  // 初始化选项
  function buildOptions() {
    const vendors = uniq(MockModelsPricing.map(i => i.vendor)).sort();
    const levels = uniq(MockModelsPricing.map(i => i.level)).sort();
    state.options.vendors = vendors;
    state.options.levels = levels;

    el.vendorSelect.innerHTML = vendors.map(v => `
      <label class="option"><input type="checkbox" value="${v}"><span>${v}</span></label>
    `).join('');
    el.levelSelect.innerHTML = levels.map(v => `
      <label class="option"><input type="checkbox" value="${v}"><span>${v}</span></label>
    `).join('');

    // 编辑弹窗定级下拉
    el.editLevel.innerHTML = levels.map(v => `<option value="${v}">${v}</option>`).join('');
    // 批量弹窗定级（可空）
    el.bulkLevel.innerHTML = [`<option value="">（不更改）</option>`, ...levels.map(v => `<option value="${v}">${v}</option>`)].join('');

    // 初始化下拉标签占位
    updateMsdLabel(el.vendorMsd);
    updateMsdLabel(el.levelMsd);
  }

  // 读取筛选值
  function readFilters() {
    state.keyword = String(el.searchName.value || '').trim();
    state.vendors = qsa('#vendorSelect input:checked').map(i => i.value);
    state.levels = qsa('#levelSelect input:checked').map(i => i.value);
  }

  // 过滤
  function applyFilters(list) {
    const kw = state.keyword.toLowerCase();
    let out = list.filter(i => !kw || i.modelName.toLowerCase().includes(kw));
    if (state.vendors.length) out = out.filter(i => state.vendors.includes(i.vendor));
    if (state.levels.length) out = out.filter(i => state.levels.includes(i.level));
    // 默认排序：厂商 + 模型名
    out.sort((a, b) => (a.vendor.localeCompare(b.vendor) || a.modelName.localeCompare(b.modelName)));
    return out;
  }

  // 多选下拉：根据勾选项更新触发器 label 文案
  function updateMsdLabel(msdEl) {
    if (!msdEl) return;
    const labelEl = msdEl.querySelector('.msd__label');
    const placeholder = labelEl ? labelEl.getAttribute('data-placeholder') : '';
    const checked = msdEl.querySelectorAll('input[type="checkbox"]:checked').length;
    if (labelEl) labelEl.textContent = checked ? `已选 ${checked} 项` : placeholder;
  }

  // 渲染表格
  function renderTable() {
    const filtered = applyFilters(MockModelsPricing);
    const { items, total, pages, current, size } = paginate(filtered, state.page, state.size);
    el.totalInfo.textContent = `共 ${total} 条，每页 ${size} 条`;

    el.tableBody.innerHTML = items.map(row => {
      const checked = state.selectedIds.has(row.id) ? 'checked' : '';
      return `
        <tr data-id="${row.id}">
          <td><input type="checkbox" class="row-check" data-id="${row.id}" ${checked}></td>
          <td>${row.vendor}</td>
          <td>${row.modelName}</td>
          <td class="price">${formatPriceYuanPerK(row.priceInputPerK)}</td>
          <td class="price">${formatPriceYuanPerK(row.priceOutputPerK)}</td>
          <td><span class="tag">${row.level}</span></td>
          <td><span class="desc">${row.description || '-'}</span></td>
          <td><button class="btn primary btn-edit" data-id="${row.id}">编辑</button></td>
        </tr>
      `;
    }).join('');

    // 选择框事件
    qsa('.row-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-id');
        if (chk.checked) state.selectedIds.add(id); else state.selectedIds.delete(id);
        syncSelectionUI();
      });
    });

    // 编辑按钮
    qsa('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });

    // 更新分页
    renderPagination(pages, current);
    // 全选状态
    const currentIds = items.map(i => i.id);
    el.checkAll.checked = currentIds.length > 0 && currentIds.every(id => state.selectedIds.has(id));
    syncSelectionUI();
  }

  function renderPagination(pages, current) {
    el.pageNumbers.innerHTML = '';
    el.prevPage.disabled = current <= 1;
    el.nextPage.disabled = current >= pages;

    const maxButtons = 7;
    let start = Math.max(1, current - 3);
    let end = Math.min(pages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let p = start; p <= end; p++) {
      const b = document.createElement('button');
      b.className = 'page-numbers__item page';
      b.textContent = String(p);
      if (p === current) b.classList.add('active');
      b.addEventListener('click', () => { state.page = p; renderTable(); });
      el.pageNumbers.appendChild(b);
    }
  }

  function syncSelectionUI() {
    const count = state.selectedIds.size;
    el.selectedCount.textContent = `已选择 ${count} 项`;
    el.btnBulkEdit.disabled = count === 0;
  }

  // 打开编辑弹窗
  function openEditModal(id) {
    const row = MockModelsPricing.find(i => i.id === id);
    if (!row) return;
    el.editId.value = row.id;
    el.editLevel.value = row.level;
    el.editPriceInput.value = row.priceInputPerK.toFixed(2);
    el.editPriceOutput.value = row.priceOutputPerK.toFixed(2);
    if (el.editSubtitle) el.editSubtitle.textContent = `${row.vendor} · ${row.modelName}`;
    if (el.editError) el.editError.hidden = true, el.editError.textContent = '';
    openModal(el.editModal);
    // 自动聚焦第一个输入
    setTimeout(() => { el.editLevel.focus(); }, 0);
  }

  // 保存单条
  function saveEditHandler() {
    const id = el.editId.value;
    const level = el.editLevel.value;
    const priceIn = clampToTwoDecimals(el.editPriceInput.value);
    const priceOut = clampToTwoDecimals(el.editPriceOutput.value);
    if (el.editError) { el.editError.hidden = true; el.editError.textContent = ''; }
    el.editPriceInput.classList.remove('is-invalid');
    el.editPriceOutput.classList.remove('is-invalid');
    if (priceIn === null || priceOut === null) {
      if (el.editError) { el.editError.hidden = false; el.editError.textContent = '请填写合法的价格：非负数字，最多两位小数。'; }
      if (priceIn === null) el.editPriceInput.classList.add('is-invalid');
      if (priceOut === null) el.editPriceOutput.classList.add('is-invalid');
      return;
    }
    const row = MockModelsPricing.find(i => i.id === id);
    if (!row) return;
    row.level = level;
    row.priceInputPerK = priceIn;
    row.priceOutputPerK = priceOut;
    closeModal(el.editModal);
    renderTable();
  }

  // 打开批量弹窗
  function openBulkModal() { openModal(el.bulkModal); }

  // 保存批量
  function saveBulkHandler() {
    const level = el.bulkLevel.value;
    const priceInRaw = el.bulkPriceInput.value;
    const priceOutRaw = el.bulkPriceOutput.value;
    const priceIn = priceInRaw === '' ? '' : clampToTwoDecimals(priceInRaw);
    const priceOut = priceOutRaw === '' ? '' : clampToTwoDecimals(priceOutRaw);

    if (el.bulkError) { el.bulkError.hidden = true; el.bulkError.textContent = ''; }
    el.bulkPriceInput.classList.remove('is-invalid');
    el.bulkPriceOutput.classList.remove('is-invalid');
    if (priceIn === null || priceOut === null) {
      if (el.bulkError) { el.bulkError.hidden = false; el.bulkError.textContent = '请填写合法的价格：非负数字，最多两位小数。'; }
      if (priceIn === null) el.bulkPriceInput.classList.add('is-invalid');
      if (priceOut === null) el.bulkPriceOutput.classList.add('is-invalid');
      return;
    }

    MockModelsPricing.forEach(row => {
      if (!state.selectedIds.has(row.id)) return;
      if (level) row.level = level;
      if (priceIn !== '') row.priceInputPerK = priceIn;
      if (priceOut !== '') row.priceOutputPerK = priceOut;
    });

    closeModal(el.bulkModal);
    renderTable();
  }

  // 事件绑定
  function bindEvents() {
    // 实时筛选：输入名称即过滤
    let nameInputTimer;
    el.searchName.addEventListener('input', () => {
      clearTimeout(nameInputTimer);
      nameInputTimer = setTimeout(() => { state.page = 1; readFilters(); renderTable(); }, 150);
    });

    // 多选下拉开合与勾选反馈
    [el.vendorMsd, el.levelMsd].forEach(msd => {
      if (!msd) return;
      const trigger = msd.querySelector('.msd__trigger');
      trigger && trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        msd.classList.toggle('open');
      });
      msd.addEventListener('click', (e) => { e.stopPropagation(); });
      msd.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => { updateMsdLabel(msd); state.page = 1; readFilters(); renderTable(); });
      });
    });
    document.addEventListener('click', () => {
      el.vendorMsd && el.vendorMsd.classList.remove('open');
      el.levelMsd && el.levelMsd.classList.remove('open');
    });

    // 全选
    el.checkAll.addEventListener('change', () => {
      const filtered = applyFilters(MockModelsPricing);
      const { items } = paginate(filtered, state.page, state.size);
      items.forEach(i => { if (el.checkAll.checked) state.selectedIds.add(i.id); else state.selectedIds.delete(i.id); });
      renderTable();
    });

    // 分页按钮
    el.prevPage.addEventListener('click', () => { state.page = Math.max(1, state.page - 1); renderTable(); });
    el.nextPage.addEventListener('click', () => {
      const filtered = applyFilters(MockModelsPricing);
      const pages = Math.ceil(filtered.length / state.size) || 1;
      state.page = Math.min(pages, state.page + 1);
      renderTable();
    });
    el.pageSize.addEventListener('change', () => { state.size = Number(el.pageSize.value); state.page = 1; renderTable(); });

    // 批量
    el.btnBulkEdit.addEventListener('click', openBulkModal);
    el.saveBulk.addEventListener('click', saveBulkHandler);
    // 打开批量时设置副标题
    el.btnBulkEdit.addEventListener('click', () => {
      if (el.bulkSubtitle) el.bulkSubtitle.textContent = `已选择 ${state.selectedIds.size} 项`;
      if (el.bulkError) { el.bulkError.hidden = true; el.bulkError.textContent = ''; }
    });

    // 编辑
    el.saveEdit.addEventListener('click', saveEditHandler);
    // Enter 提交 / Esc 关闭
    document.addEventListener('keydown', (e) => {
      if (el.editModal.getAttribute('aria-hidden') === 'false' || el.bulkModal.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Enter') {
          if (el.editModal.getAttribute('aria-hidden') === 'false') saveEditHandler();
          if (el.bulkModal.getAttribute('aria-hidden') === 'false') saveBulkHandler();
        } else if (e.key === 'Escape') {
          if (el.editModal.getAttribute('aria-hidden') === 'false') closeModal(el.editModal);
          if (el.bulkModal.getAttribute('aria-hidden') === 'false') closeModal(el.bulkModal);
        }
      }
    });

    // 关闭模态（遮罩或×）
    qsa('.modal [data-close="true"]').forEach(node => node.addEventListener('click', (e) => {
      const modal = node.closest('.modal');
      if (modal) closeModal(modal);
    }));
  }

  function init() {
    buildOptions();
    readFilters();
    bindEvents();
    renderTable();
  }

  document.addEventListener('DOMContentLoaded', init);
})();


