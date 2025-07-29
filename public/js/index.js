document.addEventListener('DOMContentLoaded', function() {
    // 导航按钮点击事件
    document.querySelectorAll('.nav-btn').forEach(button => {
      button.addEventListener('click', function() {
        window.location.href = '/' + this.textContent.toLowerCase();
      });
    });
    
    // CTA按钮点击事件
    document.querySelector('.cta-button').addEventListener('click', function() {
      window.location.href = '/main';
    });
    
    // 背景图片轮换
    const backgroundImages = [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];
    
    let currentImageIndex = 0;
    const bgImage = document.querySelector('.background-image');
    
    // 设置初始过渡效果
    bgImage.style.transition = 'opacity 1s ease-in-out';
    
    setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
      bgImage.style.opacity = 0;
      
      setTimeout(() => {
        bgImage.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
        bgImage.style.opacity = 1;
      }, 1000);
    }, 10000);
  });