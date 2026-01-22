document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const editUsersBtn = document.getElementById('edit-users-btn');
    const editDepartmentsBtn = document.getElementById('edit-departments-btn');
    const modal = document.getElementById('edit-modal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const userFormSection = document.getElementById('user-form-section');
    const departmentFormSection = document.getElementById('department-form-section');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const saveModalBtn = document.getElementById('save-modal-btn');
    
    // --- State Management ---
    let mainSelections = {
        user: new Set(['葛宇/geyu06']),
        department: new Set(['质效技术部'])
    };
    let modalSelections = { user: new Set(), department: new Set() };
    let currentEditingType = null;

    // --- Main Page UI Functions ---
    function createDisplayTag(type, value) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        let avatar = '';
        let text = value;

        if (type === 'department') {
            tag.classList.add('department-tag');
            avatar = `<i class="ri-building-line"></i>`;
        } else {
            const parts = value.split('/');
            if (parts.length > 1) text = `${parts[0]} / ${parts[1]}`;
            const imgSrc = value.includes('15830348') ? 'https://i.pravatar.cc/40?u=15830348' : 'https://i.pravatar.cc/40?u=geyu06';
            avatar = `<img src="${imgSrc}" class="tag-avatar" alt="">`;
        }
        
        tag.innerHTML = `${avatar}<span>${text}</span>`;
        return tag;
    }

    function renderMainDisplay() {
        const userField = document.getElementById('user-display-field');
        const deptField = document.getElementById('department-display-field');
        userField.innerHTML = '';
        deptField.innerHTML = '';
        mainSelections.user.forEach(val => userField.appendChild(createDisplayTag('user', val)));
        mainSelections.department.forEach(val => deptField.appendChild(createDisplayTag('department', val)));
    }

    // --- Modal UI and Logic ---
    function openModal(type) {
        currentEditingType = type;
        modalSelections[type] = new Set(mainSelections[type]);
        
        if (type === 'user') {
            modalTitle.textContent = '编辑个人';
            userFormSection.style.display = 'block';
            departmentFormSection.style.display = 'none';
        } else {
            modalTitle.textContent = '编辑部门';
            userFormSection.style.display = 'none';
            departmentFormSection.style.display = 'block';
        }

        renderModalTags(type);
        updateModalDropdowns(type);
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        currentEditingType = null;
    }

    function saveChanges() {
        if (!currentEditingType) return;
        mainSelections[currentEditingType] = new Set(modalSelections[currentEditingType]);
        renderMainDisplay();
        closeModal();
    }

    function handleModalSelection(type, value) {
        const set = modalSelections[type];
        if (set.has(value)) {
            set.delete(value);
        } else {
            set.add(value);
        }
        renderModalTags(type);
        updateModalDropdowns(type);
    }
    
    function renderModalTags(type) {
        const container = document.getElementById(`modal-${type}-tags`);
        container.innerHTML = '';
        modalSelections[type].forEach(val => {
            const tag = createModalTag(type, val);
            container.appendChild(tag);
        });
    }

    function createModalTag(type, value) {
        const tag = createDisplayTag(type, value);
        const removeBtn = document.createElement('i');
        removeBtn.className = 'ri-close-line tag-remove';
        removeBtn.onclick = () => handleModalSelection(type, value);
        tag.appendChild(removeBtn);
        return tag;
    }

    function updateModalDropdowns(type) {
        const menu = document.getElementById(`modal-${type}-menu`);
        menu.querySelectorAll('.dropdown-item').forEach(item => {
            if (modalSelections[type]?.has(item.dataset.value)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    function initSearchDropdown(type) {
        const dropdown = document.getElementById(`modal-${type}-dropdown`);
        const searchInput = document.getElementById(`modal-${type}-search`);
        const menu = document.getElementById(`modal-${type}-menu`);
        
        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', () => dropdown.classList.remove('active'));
        dropdown.addEventListener('click', (e) => e.stopPropagation());

        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                handleModalSelection(item.dataset.type, item.dataset.value);
            });
        });
    }

    // --- Initialization ---
    function init() {
        editUsersBtn.addEventListener('click', () => openModal('user'));
        editDepartmentsBtn.addEventListener('click', () => openModal('department'));
        closeModalBtn.addEventListener('click', closeModal);
        cancelModalBtn.addEventListener('click', closeModal);
        saveModalBtn.addEventListener('click', saveChanges);
        
        initSearchDropdown('user');
        initSearchDropdown('department');

        renderMainDisplay();
        initApprovalTable();
    }

    // --- Approval Table Logic ---
    function initApprovalTable() {
        const table = document.querySelector('.approval-table');
        const showProcessedCheckbox = document.getElementById('show-processed');
        const pendingCountElement = document.getElementById('pending-count');
        
        if (!table) return;

        // 过滤功能
        function updateTableDisplay() {
            const rows = table.querySelectorAll('tbody tr');
            const showProcessed = showProcessedCheckbox.checked;
            let pendingCount = 0;
            
            rows.forEach(row => {
                const status = row.dataset.status;
                if (status === 'pending') {
                    row.style.display = '';
                    pendingCount++;
                } else if (showProcessed) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // 更新待审批数量
            pendingCountElement.textContent = `${pendingCount} 个待审批`;
            
            // 如果没有待审批的，更新样式
            if (pendingCount === 0) {
                pendingCountElement.style.background = 'linear-gradient(135deg, var(--success-color), #059669)';
                pendingCountElement.textContent = '无待审批';
            }
        }

        // 监听过滤器变化
        showProcessedCheckbox.addEventListener('change', updateTableDisplay);

        // 审批操作
        table.addEventListener('click', (e) => {
            if (!e.target.matches('.approval-actions a')) return;
            
            e.preventDefault();
            
            const row = e.target.closest('tr');
            const statusCell = row.querySelector('.approval-status');
            const actionsCell = row.querySelector('.approval-actions');

            if (actionsCell.classList.contains('processed')) return;

            const approverName = '李昕彤';
            const userName = row.dataset.user;
            const userMis = row.dataset.mis;
            const isApproved = e.target.classList.contains('action-approve');

            // 更新审批状态
            if (isApproved) {
                statusCell.innerHTML = '<span class="status-approved">已通过</span>';
                row.dataset.status = 'approved';
                
                // 审批联动：将用户添加到空间创建者
                addUserToCreators(userName, userMis);
                
                // 显示成功提示
                showApprovalSuccess(userName, '通过');
            } else {
                statusCell.innerHTML = '<span class="status-rejected">已拒绝</span>';
                row.dataset.status = 'rejected';
                
                // 显示拒绝提示
                showApprovalSuccess(userName, '拒绝');
            }

            actionsCell.innerHTML = `由 ${approverName} 审批`;
            actionsCell.classList.add('processed');
            
            // 延迟隐藏已处理的记录（如果过滤器未开启）
            setTimeout(() => {
                updateTableDisplay();
                
                // 如果不显示已处理记录，添加淡出动画
                if (!showProcessedCheckbox.checked) {
                    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        row.style.display = 'none';
                        row.style.opacity = '';
                        row.style.transform = '';
                    }, 300);
                }
            }, 1000);
        });

        // 初始化显示
        updateTableDisplay();
    }

    // 将用户添加到空间创建者
    function addUserToCreators(userName, userMis) {
        const userValue = `${userName}/${userMis}`;
        
        // 检查是否已存在
        if (!mainSelections.user.has(userValue)) {
            mainSelections.user.add(userValue);
            renderMainDisplay();
            
            // 高亮显示新添加的用户
            setTimeout(() => {
                const userField = document.getElementById('user-display-field');
                const tags = userField.querySelectorAll('.tag');
                tags.forEach(tag => {
                    if (tag.textContent.includes(userName)) {
                        tag.style.animation = 'highlightNew 2s ease';
                    }
                });
            }, 100);
        }
    }

    // 显示审批成功提示
    function showApprovalSuccess(userName, action) {
        const toast = document.createElement('div');
        toast.className = 'approval-toast';
        toast.innerHTML = `
            <div class="toast-icon">${action === '通过' ? '✓' : '✗'}</div>
            <div class="toast-content">
                <div class="toast-title">${action}申请</div>
                <div class="toast-message">${userName} 的空间创建申请已${action}</div>
            </div>
        `;
        
        if (action === '通过') {
            toast.classList.add('success');
        } else {
            toast.classList.add('danger');
        }
        
        document.body.appendChild(toast);
        
        // 动画显示
        setTimeout(() => toast.classList.add('show'), 10);
        
        // 3秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // --- Copy Function ---
    function initCopyFunction() {
        const tenantIdElement = document.querySelector('.tenant-id');
        if (tenantIdElement) {
            tenantIdElement.addEventListener('click', async () => {
                const idText = 'ttDiYHI5EaUxzbq5U';
                try {
                    await navigator.clipboard.writeText(idText);
                    // 创建临时提示
                    showCopySuccess();
                } catch (err) {
                    console.error('复制失败:', err);
                    // 降级处理：选择文本
                    selectText(tenantIdElement);
                }
            });
        }
    }

    function showCopySuccess() {
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '企业ID已复制到剪贴板';
        document.body.appendChild(toast);
        
        // 动画显示
        setTimeout(() => toast.classList.add('show'), 10);
        
        // 2秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }

    function selectText(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // --- Page Loading Animation ---
    function initLoadingAnimation() {
        // 隐藏loading screen
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        // 先隐藏主内容
        mainContent.style.opacity = '0';
        
        setTimeout(() => {
            // 隐藏loading screen
            loadingScreen.classList.add('hide');
            
            // 显示主内容
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.5s ease';
                mainContent.style.opacity = '1';
                
                // 为卡片添加淡入动画
                const cards = document.querySelectorAll('.card, .data-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100 + 200);
                });
            }, 300);
        }, 1500); // 显示loading screen 1.5秒
    }

    // 页面加载完成后执行动画
    window.addEventListener('load', initLoadingAnimation);
    
    init();
    initCopyFunction();
}); 