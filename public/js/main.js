async function updateStats() {
    try {
        // 1. 获取 holdings
        const holdingsRes = await fetch('/wealth');
        const holdingsData = await holdingsRes.json();
        const holdings = holdingsData.message || [];
        
        console.log('Raw holdings data:', holdings);

        // 2. 获取 cash balance
        let cashBalance = 0;
        try {
            const cashRes = await fetch('/cash');
            const cashData = await cashRes.json();
            cashBalance = Number(cashData.cash) || 0;  // 改为 cash
            console.log('Cash balance:', cashBalance);
        } catch (e) {
            console.log('Cash fetch error:', e);
        }

        // 3. 计算 - 修复字段名问题
        let totalReturn = 0;
        let totalStockValue = 0;
        
        for (let i = 0; i < holdings.length; i++) {
            const holding = holdings[i];
            console.log(`Processing ${holding.code}:`, {
                balance: holding.balance,  // 使用 balance 而不是 banlance
                value: holding.value,
                balanceNumber: Number(holding.balance),
                valueNumber: Number(holding.value)
            });
            
            const balanceNum = Number(holding.balance) || 0;  // 使用 balance
            const valueNum = Number(holding.value) || 0;
            
            totalReturn += balanceNum;
            totalStockValue += valueNum;
        }
        
        const totalValue = totalStockValue + cashBalance;
        
        console.log('Final calculations:', {
            totalReturn,
            totalStockValue,
            totalValue,
            cashBalance
        });

        // 4. 美化数字
        function formatMoney(num) {
            if (isNaN(num)) return '$0.00';
            return '$' + Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // 5. 更新页面
        const totalValueEl = document.getElementById('totalValue');
        const totalStockValueEl = document.getElementById('totalStockValue');
        const totalReturnEl = document.getElementById('totalReturn');
        
        if (totalValueEl) {
            totalValueEl.textContent = formatMoney(totalValue);
            console.log('Updated totalValue to:', formatMoney(totalValue));
        }
        if (totalStockValueEl) {
            totalStockValueEl.textContent = formatMoney(totalStockValue);
            console.log('Updated totalStockValue to:', formatMoney(totalStockValue));
        }
        if (totalReturnEl) {
            totalReturnEl.textContent = formatMoney(totalReturn);
            console.log('Updated totalReturn to:', formatMoney(totalReturn));
        }
    } catch (error) {
        console.error('Error in updateStats:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 先执行 updateStats，确保数据能显示
    updateStats();
    setInterval(updateStats, 10000); // 每10秒自动刷新

    // 投资组合价值趋势图
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        const portfolioChart = new Chart(portfolioCtx.getContext('2d'), {
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
    }
    
    // 资产分配图
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        const allocationChart = new Chart(allocationCtx.getContext('2d'), {
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
    }
    
    // 添加资产按钮功能
    const addAssetBtn = document.getElementById('addAssetBtn');
    const assetForm = document.getElementById('assetForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (addAssetBtn) {
    addAssetBtn.addEventListener('click', function() {
            if (assetForm) {
        assetForm.style.display = 'block';
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
            }
    });
    }
    
    if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
            if (assetForm) {
        assetForm.style.display = 'none';
            }
    });
    }
    
    if (saveBtn) {
    saveBtn.addEventListener('click', function() {
            const assetNameEl = document.getElementById('assetName');
            if (assetNameEl && assetNameEl.value) {
                alert(`资产 "${assetNameEl.value}" 已成功添加！`);
                if (assetForm) {
            assetForm.style.display = 'none';
            document.getElementById('assetForm').reset();
                }
        } else {
            alert('请填写资产名称');
        }
    });
    }
    
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