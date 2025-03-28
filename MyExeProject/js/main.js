// 小象超市App交互逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化底部导航栏交互
  initTabBar();
  
  // 初始化商品数量选择器
  initQuantitySelectors();
  
  // 初始化轮播图
  initCarousel();
});

// 底部导航栏交互
function initTabBar() {
  const tabItems = document.querySelectorAll('.tab-item');
  
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有active类
      tabItems.forEach(tab => tab.classList.remove('active'));
      
      // 添加active类到当前点击的项
      this.classList.add('active');
      
      // 这里可以添加页面切换逻辑
      // 例如: window.location.href = this.getAttribute('data-page');
    });
  });
}

// 商品数量选择器
function initQuantitySelectors() {
  const decreaseBtns = document.querySelectorAll('.decrease-btn');
  const increaseBtns = document.querySelectorAll('.increase-btn');
  
  decreaseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.nextElementSibling;
      let value = parseInt(input.value);
      if (value > 1) {
        input.value = value - 1;
        updateCartItem(input.getAttribute('data-id'), input.value);
      }
    });
  });
  
  increaseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.previousElementSibling;
      let value = parseInt(input.value);
      input.value = value + 1;
      updateCartItem(input.getAttribute('data-id'), input.value);
    });
  });
}

// 更新购物车商品数量
function updateCartItem(id, quantity) {
  console.log(`更新商品ID: ${id}, 数量: ${quantity}`);
  // 这里可以添加AJAX请求来更新购物车
}

// 添加商品到购物车
function addToCart(id, name, price, quantity = 1) {
  console.log(`添加商品到购物车: ${name}, ID: ${id}, 价格: ${price}, 数量: ${quantity}`);
  // 这里可以添加AJAX请求来添加商品到购物车
  
  // 显示添加成功提示
  showToast('商品已添加到购物车');
}

// 显示提示信息
function showToast(message, duration = 2000) {
  // 创建toast元素
  const toast = document.createElement('div');
  toast.className = 'toast fade-in';
  toast.textContent = message;
  
  // 添加样式
  toast.style.position = 'fixed';
  toast.style.bottom = '100px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '20px';
  toast.style.zIndex = '1000';
  
  // 添加到页面
  document.body.appendChild(toast);
  
  // 定时移除
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

// 初始化轮播图
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const carouselItems = carousel.querySelectorAll('.carousel-item');
  const totalItems = carouselItems.length;
  let currentIndex = 0;
  
  // 设置初始状态
  carouselItems[0].classList.add('active');
  
  // 自动轮播
  setInterval(() => {
    carouselItems[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % totalItems;
    carouselItems[currentIndex].classList.add('active');
  }, 3000);
}