// HealthGuardian App JavaScript

// Update time in status bar
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  const timeElements = document.querySelectorAll('.status-bar .time');
  timeElements.forEach(el => {
    el.textContent = timeString;
  });
}

// Initialize time and update every minute
function initTime() {
  updateTime();
  setInterval(updateTime, 60000);
}

// Tab navigation
function initTabNavigation() {
  const tabItems = document.querySelectorAll('.tab-item');
  
  tabItems.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      tabItems.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Here you would normally navigate to the corresponding page
      // For the prototype, we'll just log the action
      console.log(`Navigated to ${this.getAttribute('data-page')}`);
    });
  });
}

// Sample chart initialization (for data visualization)
function initCharts() {
  // Check if Chart.js is loaded and if there are chart containers
  if (typeof Chart !== 'undefined' && document.querySelector('.chart-container')) {
    const ctx = document.querySelector('.chart-container canvas').getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Heart Rate',
          data: [72, 75, 70, 78, 82, 76, 74],
          borderColor: '#4a7aff',
          backgroundColor: 'rgba(74, 122, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              display: true,
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

// Initialize device connection simulation
function initDeviceConnection() {
  const connectButtons = document.querySelectorAll('.connect-device-btn');
  
  connectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const deviceId = this.getAttribute('data-device-id');
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 连接中...';
      
      // Simulate connection process
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-check"></i> 已连接';
        this.classList.remove('btn-outline');
        this.classList.add('btn-success');
        this.disabled = true;
        
        console.log(`Connected to device ${deviceId}`);
      }, 2000);
    });
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTime();
  initTabNavigation();
  initCharts();
  initDeviceConnection();
  
  // Additional initialization can be added here
  console.log('HealthGuardian App initialized');
});