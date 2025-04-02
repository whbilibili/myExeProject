// 当弹出窗口加载完成时执行
document.addEventListener('DOMContentLoaded', () => {
  // 获取当前URL
  getCurrentUrl();
  
  // 加载笔记
  loadNotes();
  
  // 添加保存笔记按钮的事件监听器
  document.getElementById('save-note').addEventListener('click', saveNote);
});

// 获取当前URL并显示
function getCurrentUrl() {
  chrome.runtime.sendMessage({ action: 'getCurrentUrl' }, (response) => {
    if (response && response.url) {
      const url = new URL(response.url);
      const hostname = url.hostname;
      document.getElementById('site-url').textContent = hostname;
    } else {
      document.getElementById('site-url').textContent = '未知网站';
    }
  });
}

// 保存笔记
function saveNote() {
  const noteContent = document.getElementById('note-content').value.trim();
  
  if (!noteContent) {
    alert('请输入笔记内容！');
    return;
  }
  
  chrome.runtime.sendMessage({ action: 'getCurrentUrl' }, (response) => {
    if (response && response.url) {
      const url = response.url;
      const hostname = new URL(url).hostname;
      
      const newNote = {
        id: Date.now(), // 使用时间戳作为唯一ID
        content: noteContent,
        url: url,
        hostname: hostname,
        createdAt: new Date().toISOString()
      };
      
      // 获取现有笔记并添加新笔记
      chrome.storage.local.get(['notes'], (result) => {
        const notes = result.notes || [];
        notes.unshift(newNote); // 将新笔记添加到数组开头
        
        // 保存更新后的笔记
        chrome.storage.local.set({ notes: notes }, () => {
          // 清空输入框
          document.getElementById('note-content').value = '';
          
          // 重新加载笔记列表
          loadNotes();
        });
      });
    } else {
      alert('无法获取当前网页信息，请重试！');
    }
  });
}

// 加载笔记列表
function loadNotes() {
  chrome.storage.local.get(['notes'], (result) => {
    const notes = result.notes || [];
    const siteNotesContainer = document.getElementById('site-notes');
    const allNotesContainer = document.getElementById('all-notes');
    
    // 清空现有笔记列表
    siteNotesContainer.innerHTML = '';
    allNotesContainer.innerHTML = '';
    
    // 获取当前网站
    chrome.runtime.sendMessage({ action: 'getCurrentUrl' }, (response) => {
      if (response && response.url) {
        const currentHostname = new URL(response.url).hostname;
        
        // 过滤当前网站的笔记
        const siteNotes = notes.filter(note => note.hostname === currentHostname);
        
        // 显示当前网站的笔记
        if (siteNotes.length > 0) {
          siteNotes.forEach(note => {
            siteNotesContainer.appendChild(createNoteElement(note));
          });
        } else {
          siteNotesContainer.innerHTML = '<div class="empty-notes"><i class="fas fa-info-circle"></i> 当前网站没有笔记</div>';
        }
        
        // 显示所有笔记
        if (notes.length > 0) {
          notes.forEach(note => {
            allNotesContainer.appendChild(createNoteElement(note));
          });
        } else {
          allNotesContainer.innerHTML = '<div class="empty-notes"><i class="fas fa-info-circle"></i> 没有保存的笔记</div>';
        }
      }
    });
  });
}

// 创建笔记元素
function createNoteElement(note) {
  const noteElement = document.createElement('div');
  noteElement.className = 'note-item';
  noteElement.dataset.id = note.id;
  
  const contentElement = document.createElement('div');
  contentElement.className = 'note-content';
  contentElement.innerHTML = `<i class="fas fa-quote-left fa-xs"></i> ${note.content}`;
  
  const urlElement = document.createElement('div');
  urlElement.className = 'note-url';
  urlElement.innerHTML = `<i class="fas fa-link fa-xs"></i> ${note.hostname}`;
  
  const dateElement = document.createElement('div');
  dateElement.className = 'note-date';
  dateElement.innerHTML = `<i class="fas fa-clock fa-xs"></i> ${new Date(note.createdAt).toLocaleString()}`;
  
  const actionsElement = document.createElement('div');
  actionsElement.className = 'note-actions';
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-note';
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.title = '删除笔记';
  deleteButton.addEventListener('click', () => deleteNote(note.id));
  
  actionsElement.appendChild(deleteButton);
  
  noteElement.appendChild(contentElement);
  noteElement.appendChild(urlElement);
  noteElement.appendChild(dateElement);
  noteElement.appendChild(actionsElement);
  
  return noteElement;
}

// 删除笔记
function deleteNote(noteId) {
  if (confirm('确定要删除这条笔记吗？')) {
    chrome.storage.local.get(['notes'], (result) => {
      const notes = result.notes || [];
      const updatedNotes = notes.filter(note => note.id !== noteId);
      
      chrome.storage.local.set({ notes: updatedNotes }, () => {
        loadNotes(); // 重新加载笔记列表
      });
    });
  }
}