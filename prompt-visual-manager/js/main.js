// Main JavaScript for Prompt Visual Manager

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation
  initNavigation();
  
  // Initialize tooltips
  initTooltips();
  
  // Initialize editor if on editor page
  if (document.querySelector('#prompt-editor')) {
    initEditor();
  }
  
  // Initialize search functionality
  if (document.querySelector('#search-input')) {
    initSearch();
  }
  
  // Initialize tag filtering
  if (document.querySelector('.tag-filter')) {
    initTagFilters();
  }
  
  // Initialize group management if on prompt library page
  if (document.querySelector('.group-sidebar')) {
    initGroupManagement();
  }
});

// Navigation handling
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active-nav'));
      
      // Add active class to clicked link
      this.classList.add('active-nav');
      
      // If using iframe navigation, update the iframe source
      const targetPage = this.getAttribute('data-target');
      if (targetPage && document.querySelector('#content-frame')) {
        e.preventDefault();
        document.querySelector('#content-frame').src = `pages/${targetPage}.html`;
      }
    });
  });
}

// Initialize tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', function() {
      const tooltipText = this.getAttribute('data-tooltip');
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 tooltip';
      tooltipEl.textContent = tooltipText;
      tooltipEl.style.bottom = '100%';
      tooltipEl.style.left = '50%';
      tooltipEl.style.transform = 'translateX(-50%)';
      tooltipEl.style.marginBottom = '5px';
      this.style.position = 'relative';
      this.appendChild(tooltipEl);
    });
    
    tooltip.addEventListener('mouseleave', function() {
      const tooltipEl = this.querySelector('.tooltip');
      if (tooltipEl) {
        tooltipEl.remove();
      }
    });
  });
}

// Initialize editor
function initEditor() {
  // This is a placeholder for a rich text editor implementation
  // In a real application, you might use libraries like TinyMCE, CKEditor, or Quill
  console.log('Editor initialized');
  
  // Simulate editor functionality for the prototype
  const formatButtons = document.querySelectorAll('.format-btn');
  const editorContent = document.querySelector('#editor-content');
  
  if (formatButtons && editorContent) {
    formatButtons.forEach(button => {
      button.addEventListener('click', function() {
        const format = this.getAttribute('data-format');
        
        // Simple formatting simulation
        switch(format) {
          case 'bold':
            document.execCommand('bold', false, null);
            break;
          case 'italic':
            document.execCommand('italic', false, null);
            break;
          case 'underline':
            document.execCommand('underline', false, null);
            break;
          case 'code':
            // Wrap selected text in code tags
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
              const range = selection.getRangeAt(0);
              const codeElement = document.createElement('code');
              codeElement.className = 'bg-gray-100 text-red-600 px-1 rounded';
              range.surroundContents(codeElement);
            }
            break;
        }
      });
    });
  }
  
  // Handle save button
  const saveButton = document.querySelector('#save-prompt');
  if (saveButton) {
    saveButton.addEventListener('click', function() {
      // Simulate saving
      const saveIcon = this.querySelector('i');
      const originalClass = saveIcon.className;
      
      saveIcon.className = 'fas fa-check';
      this.classList.add('bg-green-500');
      this.classList.remove('bg-indigo-600');
      
      setTimeout(() => {
        saveIcon.className = originalClass;
        this.classList.remove('bg-green-500');
        this.classList.add('bg-indigo-600');
      }, 1500);
    });
  }
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.querySelector('#search-input');
  const promptCards = document.querySelectorAll('.prompt-card');
  
  if (searchInput && promptCards.length > 0) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      promptCards.forEach(card => {
        const title = card.querySelector('.prompt-title').textContent.toLowerCase();
        const description = card.querySelector('.prompt-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// Initialize tag filters
function initTagFilters() {
  const tagFilters = document.querySelectorAll('.tag-filter');
  const promptCards = document.querySelectorAll('.prompt-card');
  
  if (tagFilters.length > 0 && promptCards.length > 0) {
    tagFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        
        // Toggle active state
        this.classList.toggle('bg-indigo-100');
        this.classList.toggle('bg-indigo-200');
        
        // If no tags are selected (all filters inactive), show all cards
        const activeFilters = document.querySelectorAll('.tag-filter.bg-indigo-200');
        
        if (activeFilters.length === 0) {
          promptCards.forEach(card => {
            card.style.display = 'block';
          });
          return;
        }
        
        // Filter cards based on selected tags
        promptCards.forEach(card => {
          const cardTags = card.getAttribute('data-tags').split(',');
          let shouldShow = false;
          
          activeFilters.forEach(activeFilter => {
            const activeTag = activeFilter.getAttribute('data-tag');
            if (cardTags.includes(activeTag)) {
              shouldShow = true;
            }
          });
          
          card.style.display = shouldShow ? 'block' : 'none';
        });
      });
    });
  }
}

// Initialize group management
function initGroupManagement() {
  // 下拉菜单切换
  const dropdownTriggers = document.querySelectorAll('.fa-ellipsis-v');
  
  dropdownTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.closest('.relative').querySelector('div[class*="hidden"]');
      
      // 关闭所有其他下拉菜单
      document.querySelectorAll('div[class*="hidden"]:not(.group-dropdown)').forEach(menu => {
        if (menu !== dropdown && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
        }
      });
      
      dropdown.classList.toggle('hidden');
    });
  });
  
  // 分组编辑按钮
  const groupEditBtns = document.querySelectorAll('.group-edit-btn');
  
  groupEditBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      
      // 关闭所有其他下拉菜单
      document.querySelectorAll('.group-dropdown').forEach(menu => {
        if (menu !== dropdown && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
        }
      });
      
      dropdown.classList.toggle('hidden');
    });
  });
  
  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', function() {
    document.querySelectorAll('div[class*="hidden"]').forEach(menu => {
      if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
      }
    });
  });
  
  // 分组点击事件
  const groupItems = document.querySelectorAll('.group-item');
  
  groupItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有活跃状态
      groupItems.forEach(i => i.classList.remove('active'));
      
      // 添加活跃状态
      this.classList.add('active');
      
      // 过滤Prompt的逻辑
      const groupId = this.getAttribute('data-group-id');
      filterPromptsByGroup(groupId);
    });
  });
  
  // 创建分组弹窗
  const createGroupBtn = document.getElementById('create-group-btn');
  const createGroupModal = document.getElementById('create-group-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelGroupBtn = document.getElementById('cancel-group-btn');
  const saveGroupBtn = document.getElementById('save-group-btn');
  const iconOptions = document.querySelectorAll('.icon-option');
  
  let selectedIcon = 'fa-pen-fancy';
  
  if (createGroupBtn && createGroupModal) {
    createGroupBtn.addEventListener('click', function() {
      createGroupModal.classList.remove('hidden');
    });
    
    function closeModal() {
      createGroupModal.classList.add('hidden');
      document.getElementById('group-name').value = '';
      iconOptions.forEach(option => option.classList.remove('ring-2', 'ring-indigo-500'));
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelGroupBtn.addEventListener('click', closeModal);
    
    // 选择图标
    iconOptions.forEach(option => {
      option.addEventListener('click', function() {
        iconOptions.forEach(opt => opt.classList.remove('ring-2', 'ring-indigo-500'));
        this.classList.add('ring-2', 'ring-indigo-500');
        selectedIcon = this.getAttribute('data-icon');
      });
    });
    
    // 保存分组
    saveGroupBtn.addEventListener('click', function() {
      const groupName = document.getElementById('group-name').value.trim();
      
      if (groupName) {
        // 创建新分组
        const groupList = document.getElementById('group-list');
        const newGroup = document.createElement('div');
        newGroup.className = 'group-item px-3 py-2 rounded-md flex justify-between items-center cursor-pointer';
        newGroup.setAttribute('data-group-id', groupName.toLowerCase().replace(/\s+/g, '-'));
        
        newGroup.innerHTML = `
          <div class="flex items-center">
            <i class="fas ${selectedIcon} text-indigo-600 mr-3"></i>
            <span>${groupName}</span>
          </div>
          <div class="flex items-center">
            <span class="group-count bg-gray-100 text-gray-800 px-2 mr-2">0</span>
            <div class="relative">
              <button class="text-gray-400 hover:text-gray-600 group-edit-btn">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 group-dropdown">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">重命名</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">删除分组</a>
              </div>
            </div>
          </div>
        `;
        
        // 添加到分组列表
        const divider = document.querySelector('#group-list .border-t');
        groupList.insertBefore(newGroup, divider.nextSibling);
        
        // 添加点击事件
        newGroup.addEventListener('click', function() {
          groupItems.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          const groupId = this.getAttribute('data-group-id');
          filterPromptsByGroup(groupId);
        });
        
        // 添加编辑按钮事件
        const newEditBtn = newGroup.querySelector('.group-edit-btn');
        newEditBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const dropdown = this.nextElementSibling;
          
          document.querySelectorAll('.group-dropdown').forEach(menu => {
            if (menu !== dropdown && !menu.classList.contains('hidden')) {
              menu.classList.add('hidden');
            }
          });
          
          dropdown.classList.toggle('hidden');
        });
        
        // 添加拖放功能
        setupGroupDropTarget(newGroup);
        
        closeModal();
      }
    });
  }
  
  // 拖拽功能
  const promptCards = document.querySelectorAll('.prompt-card');
  
  promptCards.forEach(card => {
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', this.querySelector('.prompt-title').textContent);
      e.dataTransfer.setData('prompt-id', this.getAttribute('id') || 'prompt-' + Math.random().toString(36).substr(2, 9));
      this.classList.add('opacity-50');
    });
    
    card.addEventListener('dragend', function() {
      this.classList.remove('opacity-50');
    });
  });
  
  // 设置分组为拖放目标
  groupItems.forEach(target => {
    setupGroupDropTarget(target);
  });
}

// 根据分组过滤Prompt
function filterPromptsByGroup(groupId) {
  const promptCards = document.querySelectorAll('.prompt-card');
  
  // 如果是"所有Prompt"，显示全部
  if (groupId === 'all') {
    promptCards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // 如果是"收藏"，只显示带星标的
  if (groupId === 'favorites') {
    promptCards.forEach(card => {
      const starButton = card.querySelector('.fa-star');
      if (starButton && starButton.parentElement.classList.contains('text-yellow-500')) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    return;
  }
  
  // 如果是"最近使用"，这里应该有逻辑来确定最近使用的Prompt
  // 在实际应用中，这可能需要从后端获取数据
  if (groupId === 'recent') {
    // 模拟最近使用的逻辑，这里简单地显示前5个
    promptCards.forEach((card, index) => {
      if (index < 5) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    return;
  }
  
  // 对于自定义分组，在实际应用中，应该从后端获取该分组下的Prompt
  // 这里我们模拟一些逻辑
  
  // 写作助手分组
  if (groupId === 'writing') {
    promptCards.forEach(card => {
      const tags = card.getAttribute('data-tags');
      if (tags && (tags.includes('writing') || tags.includes('content'))) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    return;
  }
  
  // 编程工具分组
  if (groupId === 'coding') {
    promptCards.forEach(card => {
      const tags = card.getAttribute('data-tags');
      if (tags && (tags.includes('code') || tags.includes('development') || tags.includes('programming'))) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    return;
  }
  
  // 营销策略分组
  if (groupId === 'marketing') {
    promptCards.forEach(card => {
      const tags = card.getAttribute('data-tags');
      if (tags && (tags.includes('marketing') || tags.includes('seo'))) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    return;
  }
  
  // 对于新创建的分组，默认不显示任何卡片
  // 在实际应用中，应该有一个数据结构来跟踪每个分组中的Prompt
  promptCards.forEach(card => {
    card.style.display = 'none';
  });
}

// 设置分组为拖放目标
function setupGroupDropTarget(target) {
  target.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  });
  
  target.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
  });
  
  target.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const promptTitle = e.dataTransfer.getData('text/plain');
    const promptId = e.dataTransfer.getData('prompt-id');
    const groupId = this.getAttribute('data-group-id');
    const groupName = this.querySelector('span').textContent;
    
    // 不允许拖放到"所有Prompt"、"收藏"或"最近使用"
    if (groupId === 'all' || groupId === 'favorites' || groupId === 'recent') {
      alert(`不能将Prompt添加到"${groupName}"，请选择一个自定义分组`);
      return;
    }
    
    // 更新分组计数
    const countElement = this.querySelector('.group-count');
    let count = parseInt(countElement.textContent);
    countElement.textContent = count + 1;
    
    // 显示成功消息
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i> 已将 "${promptTitle}" 添加到 "${groupName}" 分组`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
    
    // 实际应用中，这里应该发送请求到后端，更新Prompt的分组信息
    console.log(`Added "${promptTitle}" (ID: ${promptId}) to group "${groupId}"`);
  });
}