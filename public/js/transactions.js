// 加载交易历史数据
async function loadTransactions() {
    try {
        const response = await fetch('/transactions');
        if (!response.ok) {
            throw new Error('Failed to load transactions');
        }
        const data = await response.json();
        const transactions = data.message || [];
        renderTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactionsContainer').innerHTML = 
            '<div class="error-message">Failed to load transactions</div>';
    }
}

// 渲染交易数据
function renderTransactions(transactions) {
    const container = document.getElementById('transactionsContainer');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<div class="no-transactions">No transactions found</div>';
        return;
    }

    const transactionsHTML = transactions.map(transaction => {
        const type = transaction.type || 'BUY';
        const share = transaction.share || 0;
        const price = transaction.price || 0;
        const amount = share * price;
        const isBuy = type === 'BUY';
        const isSell = type === 'SELL';
        
        // 调试信息
        console.log('Transaction:', {
            code: transaction.code,
            type: type,
            isBuy: isBuy,
            isSell: isSell,
            share: share,
            price: price
        });
        
        // 格式化时间 - 修复时间戳问题
        let formattedTime = 'Unknown';
        if (transaction.time) {
            try {
                const transactionTime = new Date(transaction.time);
                if (!isNaN(transactionTime.getTime())) {
                    formattedTime = transactionTime.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                }
            } catch (error) {
                console.error('Error formatting time:', error);
            }
        }

        // 格式化金额
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(Math.abs(amount));

        // 确定图标和样式 - 修复买卖逻辑
        let iconClass = '';
        let amountClass = '';
        let amountPrefix = '';
        let iconSvg = '';
        
        if (isBuy) {
            iconClass = 'buy-icon';
            amountClass = 'txn-amount-negative';
            amountPrefix = '-'; // 买入是负值（花钱）
            // 买入图标：向上箭头（表示买入）
            iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 14l5-5 5 5"></path>`;
        } else if (isSell) {
            iconClass = 'sell-icon';
            amountClass = 'txn-amount-positive';
            amountPrefix = '+'; // 卖出是正值（赚钱）
            // 卖出图标：向下箭头（表示卖出）
            iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10l5 5 5-5"></path>`;
        }

        return `
            <div class="transaction-card">
                <div class="txn-left">
                    <div class="txn-icon ${iconClass}" title="${type}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            ${iconSvg}
                        </svg>
                    </div>
                    <img class="txn-logo" src="${transaction.url || `https://logo.clearbit.com/${transaction.code?.toLowerCase()}.com`}" 
                         alt="${transaction.code} Logo" 
                         onerror="this.src='https://via.placeholder.com/40x40?text=${transaction.code}'">
                    <div class="txn-info">
                        <div class="ticker">${transaction.code}</div>
                        <div class="company">${transaction.name || transaction.code}</div>
                        <div class="details">
                            ${share} shares @ $${price.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div class="txn-right">
                    <div class="txn-type">${type}</div>
                    <div class="txn-amount ${amountClass}">${amountPrefix}${formattedAmount}</div>
                    <div class="txn-time">${formattedTime}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = transactionsHTML;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
});

// 清除所有交易记录
async function clearAllTransactions() {
    if (!confirm('Are you sure you want to clear all transaction history? This action cannot be undone.')) {
        return;
    }
    
    const clearBtn = document.querySelector('.clear-transactions-btn');
    if (clearBtn) {
        clearBtn.disabled = true;
        clearBtn.textContent = 'Clearing...';
    }
    
    try {
        const response = await fetch('/transactions', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to clear transactions');
        }
        
        const data = await response.json();
        console.log('Transactions cleared:', data.message);
        
        // 显示成功消息
        showClearMessage('All transactions cleared successfully!', 'success');
        
        // 重新加载交易列表（现在应该是空的）
        await loadTransactions();
        
        // 通知主页面刷新其他相关数据
        if (window.parent && window.parent !== window) {
            if (window.parent.loadHoldings) window.parent.loadHoldings();
            if (window.parent.loadPieChartData) window.parent.loadPieChartData();
            if (window.parent.updateStats) window.parent.updateStats();
        }
        
    } catch (error) {
        console.error('Error clearing transactions:', error);
        showClearMessage('Failed to clear transactions. Please try again.', 'error');
    } finally {
        // 恢复按钮状态
        if (clearBtn) {
            clearBtn.disabled = false;
            clearBtn.textContent = 'Clear All';
        }
    }
}

// 显示清除操作的消息
function showClearMessage(message, type) {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `clear-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#10b981';
    } else {
        messageDiv.style.background = '#ef4444';
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除消息
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// 导出函数供其他脚本使用
window.loadTransactions = loadTransactions;
window.clearAllTransactions = clearAllTransactions; 