// Watchlist管理功能
class WatchlistManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        // 页面加载时动态渲染watchlist
        loadRealWatchlistData();
    }

    bindEvents() {
        // 绑定Add Stock按钮
        const addStockBtn = document.querySelector('.watchlist-btn');
        if (addStockBtn) {
            addStockBtn.addEventListener('click', () => this.showAvailableStocks());
        }

        // 绑定Delete Stock按钮
        const deleteStockBtn = document.querySelectorAll('.watchlist-btn')[1];
        if (deleteStockBtn) {
            deleteStockBtn.addEventListener('click', () => this.showWatchlistStocks());
        }
    }

    async showAvailableStocks() {
        try {
            const response = await fetch('/available-stocks');
            const stocks = await response.json();
            this.showStockModal(stocks, 'add');
        } catch (error) {
            console.error('Error loading available stocks:', error);
            alert('Failed to load available stocks');
        }
    }

    async showWatchlistStocks() {
        try {
            const response = await fetch('/watchlist-stocks');
            const stocks = await response.json();
            this.showStockModal(stocks, 'delete');
        } catch (error) {
            console.error('Error loading watchlist stocks:', error);
            alert('Failed to load watchlist stocks');
        }
    }

    showStockModal(stocks, action) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'stock-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${action === 'add' ? 'Add Stock' : 'Delete Stock'}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="stock-list">
                        ${stocks.map(stock => `
                            <div class="stock-item" data-code="${stock.code}">
                                <img src="${stock.url}" alt="${stock.code}" class="stock-logo">
                                <div class="stock-info">
                                    <div class="stock-name">${stock.name}</div>
                                    <div class="stock-code">${stock.code}</div>
                                </div>
                                <button class="single-action-btn" data-code="${stock.code}" data-action="${action}">${action === 'add' ? 'Add' : 'Delete'}</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        this.addModalStyles();
        document.body.appendChild(modal);
        this.bindModalEvents(modal, action);
    }

    bindModalEvents(modal, action) {
        // 关闭按钮
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        // 单个操作按钮
        const actionBtns = modal.querySelectorAll('.single-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const code = btn.dataset.code;
                await this.handleSingleStockAction(code, action);
                document.body.removeChild(modal);
            });
        });
    }

    updateSelectedCount(modal) {
        const selectedCheckboxes = modal.querySelectorAll('.stock-checkbox:checked');
        const countSpan = modal.querySelector('#selectedCount');
        const confirmBtn = modal.querySelector('#confirmBtn');
        
        countSpan.textContent = selectedCheckboxes.length;
        confirmBtn.disabled = selectedCheckboxes.length === 0;
    }

    updateSelectAllState(modal) {
        const stockCheckboxes = modal.querySelectorAll('.stock-checkbox');
        const selectAllCheckbox = modal.querySelector('#selectAll');
        const checkedCount = modal.querySelectorAll('.stock-checkbox:checked').length;
        
        selectAllCheckbox.checked = checkedCount === stockCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < stockCheckboxes.length;
    }

    getSelectedCodes(modal) {
        const selectedCheckboxes = modal.querySelectorAll('.stock-checkbox:checked');
        return Array.from(selectedCheckboxes).map(checkbox => 
            checkbox.closest('.stock-item').dataset.code
        );
    }

    async handleBatchStockAction(codes, action) {
        try {
            const response = await fetch(`/watchlist/batch-${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codes: codes })
            });

            if (response.ok) {
                alert(`Successfully ${action === 'add' ? 'added' : 'deleted'} ${codes.length} stock(s)!`);
                // 刷新页面或更新watchlist显示
                location.reload();
            } else {
                alert(`Failed to ${action} stocks`);
            }
        } catch (error) {
            console.error(`Error ${action}ing stocks:`, error);
            alert(`Failed to ${action} stocks`);
        }
    }

    async handleSingleStockAction(code, action) {
        try {
            const response = await fetch(`/watchlist/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            if (response.ok) {
                if (action === 'add') {
                    this.showTargetPriceModal(code);
                } else {
                    this.showCustomAlert(`Successfully deleted ${code}`, 'success');
                    location.reload();
                }
            } else {
                this.showCustomAlert(`Failed to ${action} stock`, 'error');
            }
        } catch (error) {
            this.showCustomAlert('Network error', 'error');
        }
    }

    showTargetPriceModal(code) {
        const modal = document.createElement('div');
        modal.className = 'target-price-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Set Target Price</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="target-price-form">
                        <label for="targetPrice">Target Price for ${code}:</label>
                        <div class="input-group">
                            <span class="currency-symbol">$</span>
                            <input type="number" id="targetPrice" placeholder="0.00" step="0.01" min="0">
                        </div>
                        <div class="form-actions">
                            <button class="cancel-btn">Cancel</button>
                            <button class="confirm-btn">Set Target</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addTargetPriceStyles();
        document.body.appendChild(modal);
        this.bindTargetPriceEvents(modal, code);
    }

    bindTargetPriceEvents(modal, code) {
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const input = modal.querySelector('#targetPrice');

        const closeModal = () => document.body.removeChild(modal);

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        confirmBtn.addEventListener('click', () => {
            const targetPrice = input.value;
            if (targetPrice && parseFloat(targetPrice) > 0) {
                this.saveTargetPrice(code, targetPrice);
                closeModal();
            } else {
                this.showCustomAlert('Please enter a valid target price', 'error');
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });

        input.focus();
    }

    async saveTargetPrice(code, targetPrice) {
        try {
            // 这里可以调用API保存target price到数据库
            // 暂时先显示成功消息
            this.showCustomAlert(`Successfully added ${code} with target price $${targetPrice}`, 'success');
            location.reload();
        } catch (error) {
            this.showCustomAlert('Failed to save target price', 'error');
        }
    }

    showCustomAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">${this.getAlertIcon(type)}</div>
                <div class="alert-message">${message}</div>
                <button class="alert-close">&times;</button>
            </div>
        `;

        this.addAlertStyles();
        document.body.appendChild(alert);

        // 自动关闭
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);

        // 手动关闭
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        });
    }

    getAlertIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    }

    addAlertStyles() {
        if (document.getElementById('custom-alert-styles')) return;

        const style = document.createElement('style');
        style.id = 'custom-alert-styles';
        style.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2000;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .alert-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                min-width: 300px;
                max-width: 400px;
            }

            .custom-alert.success .alert-content {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }

            .custom-alert.error .alert-content {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
            }

            .custom-alert.warning .alert-content {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
            }

            .custom-alert.info .alert-content {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }

            .alert-icon {
                font-size: 20px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .alert-message {
                flex: 1;
                font-weight: 500;
            }

            .alert-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
                flex-shrink: 0;
            }

            .alert-close:hover {
                opacity: 1;
            }
        `;

        document.head.appendChild(style);
    }

    addTargetPriceStyles() {
        if (document.getElementById('target-price-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'target-price-modal-styles';
        style.textContent = `
            .target-price-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
            }

            .target-price-modal .modal-content {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 400px;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #e5e7eb;
            }

            .target-price-modal .modal-header {
                padding: 24px 24px 16px 24px;
                border-bottom: 1px solid #f3f4f6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
            }

            .target-price-modal .modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: white;
            }

            .target-price-modal .modal-body {
                padding: 24px;
            }

            .target-price-form label {
                display: block;
                margin-bottom: 12px;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
            }

            .input-group {
                position: relative;
                margin-bottom: 24px;
            }

            .currency-symbol {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #6b7280;
                font-weight: 500;
                z-index: 1;
            }

            .input-group input {
                width: 100%;
                padding: 12px 12px 12px 28px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            .input-group input:focus {
                outline: none;
                border-color: #8b5cf6;
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }

            .form-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            .cancel-btn, .confirm-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .cancel-btn {
                background: #f3f4f6;
                color: #374151;
            }

            .cancel-btn:hover {
                background: #e5e7eb;
            }

            .confirm-btn {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
            }

            .confirm-btn:hover {
                background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
                transform: translateY(-1px);
            }
        `;

        document.head.appendChild(style);
    }

    addModalStyles() {
        if (document.getElementById('watchlist-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'watchlist-modal-styles';
        style.textContent = `
            .stock-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
            }

            .modal-content {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 480px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid #e5e7eb;
            }

            .modal-header {
                padding: 24px 24px 16px 24px;
                border-bottom: 1px solid #f3f4f6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: white;
            }

            .close {
                font-size: 24px;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.8);
                transition: color 0.2s;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
            }

            .close:hover {
                color: white;
                background: rgba(255, 255, 255, 0.2);
            }

            .modal-body {
                padding: 20px 24px 24px 24px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .stock-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .stock-item {
                display: flex;
                align-items: center;
                padding: 16px;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                gap: 16px;
                transition: all 0.2s ease;
                background: #fafafa;
            }

            .stock-item:hover {
                background: #f8fafc;
                border-color: #d1d5db;
                transform: translateY(-1px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }

            .stock-logo {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid #e5e7eb;
            }

            .stock-info {
                flex: 1;
                min-width: 0;
            }

            .stock-name {
                font-weight: 600;
                color: #111827;
                font-size: 14px;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .stock-code {
                font-size: 12px;
                color: #6b7280;
                font-weight: 500;
            }

            .single-action-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s ease;
                min-width: 60px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .single-action-btn[data-action="add"] {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
            }

            .single-action-btn[data-action="add"]:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
            }

            .single-action-btn[data-action="delete"] {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
            }

            .single-action-btn[data-action="delete"]:hover {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
            }

            .single-action-btn:active {
                transform: translateY(0);
            }

            /* 自定义滚动条 */
            .modal-body::-webkit-scrollbar {
                width: 6px;
            }

            .modal-body::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
            }

            .modal-body::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }

            .modal-body::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        `;

        document.head.appendChild(style);
    }
}

// 动态加载并渲染watchlist
async function loadRealWatchlistData() {
    const response = await fetch('/watchlist-stocks');
    const stocks = await response.json();

    const realData = await Promise.all(
        stocks.map(async (stock) => {
            const tickerResponse = await fetch(`/stock/${stock.code}`);
            const tickerData = await tickerResponse.json();
            const latestPrice = tickerData[0]?.c || 0;
            const previousPrice = tickerData[1]?.c || latestPrice;
            const change = latestPrice - previousPrice;
            const changePercent = previousPrice ? (change / previousPrice) * 100 : 0;

            return {
                ...stock,
                currentPrice: latestPrice,
                change: change,
                changePercent: changePercent
            };
        })
    );

    updateWatchlistDisplay(realData);
}

function updateWatchlistDisplay(stocks) {
    const container = document.getElementById('watchlistContainer');
    container.innerHTML = stocks.map(stock => `
        <div class="watchlist-card">
            <div class="watchlist-left">
                <img class="stock-logo" src="${stock.url}" alt="${stock.code} Logo">
                <div class="stock-info">
                    <div class="ticker">${stock.code}</div>
                    <div class="company-name">${stock.name}</div>
                </div>
            </div>
            <div class="watchlist-right">
                <div class="price">$${parseFloat(stock.currentPrice).toFixed(2)}</div>
                <div class="change ${stock.change >= 0 ? 'green' : 'red'}">
                    ${stock.change >= 0 ? '↗' : '↘'} $${Math.abs(stock.change).toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                </div>
            </div>
        </div>
    `).join('');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    new WatchlistManager();
}); 