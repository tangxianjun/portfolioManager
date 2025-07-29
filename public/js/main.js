document.addEventListener('DOMContentLoaded', function() {
    // 投资组合价值趋势图
    const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
    const portfolioChart = new Chart(portfolioCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [{
                label: '投资组合价值 ($)',
                data: [152000, 158000, 162500, 168200, 173800, 178500, 185420],
                borderColor: '#2962ff',
                backgroundColor: 'rgba(41, 98, 255, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#2962ff',
                pointRadius: 5,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
    
    // 资产分配图
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    const allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['股票', '债券', 'ETF', '现金', '其他'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#2962ff',
                    '#00c853',
                    '#ffab00',
                    '#78909c',
                    '#ff1744'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '65%'
        }
    });
    
    // 添加资产按钮功能
    const addAssetBtn = document.getElementById('addAssetBtn');
    const assetForm = document.getElementById('assetForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    addAssetBtn.addEventListener('click', function() {
        assetForm.style.display = 'block';
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
    
    cancelBtn.addEventListener('click', function() {
        assetForm.style.display = 'none';
    });
    
    saveBtn.addEventListener('click', function() {
        const assetName = document.getElementById('assetName').value;
        if (assetName) {
            alert(`资产 "${assetName}" 已成功添加！`);
            assetForm.style.display = 'none';
            document.getElementById('assetForm').reset();
        } else {
            alert('请填写资产名称');
        }
    });
    
    // 表格行点击效果
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // 初始化卡片动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
});