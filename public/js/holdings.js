// 加载持仓数据
async function loadHoldings() {
    try {
        const response = await fetch('/wealth');
        const data = await response.json();
        console.log('API response:', data);
        renderHoldings(data.message);
    } catch (error) {
        console.error('Error loading holdings:', error);
        document.getElementById('holdingsTable').innerHTML = 
            '<tr><td colspan="7" class="error">Failed to load holdings data</td></tr>';
    }
}

// 渲染持仓数据
function renderHoldings(holdings) {
    const tableBody = document.getElementById('holdingsTable');
    
    if (!holdings || holdings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No holdings found</td></tr>';
        return;
    }

    const rows = holdings.map(holding => {
        // 确保数值有效
        const currentPrice = parseFloat(holding.current_price) || 0;
        const marketValue = parseFloat(holding.value) || 0;
        const unrealizedPL = parseFloat(holding.banlance) || 0;
        const isGain = unrealizedPL >= 0;
        
        // 添加调试信息
        console.log('Holding:', holding.code, 'banlance:', holding.banlance, 'type:', typeof holding.banlance);
        
        return `
            <tr>
                <td>
                    <img class="logo" src="${holding.url}" onerror="this.src='https://via.placeholder.com/30x30?text=${holding.code}'">
                    ${holding.name || holding.code}
                </td>
                <td>
                    <span class="badge ${getSectorClass(holding.sector || 'Unknown')}">${holding.sector || 'Unknown'}</span>
                </td>
                <td>${holding.share}</td>
                <td>$${parseFloat(holding.avg_cost || 0).toFixed(2)}</td>
                <td>$${currentPrice.toFixed(2)}</td>
                <td>$${marketValue.toLocaleString()}</td>
                <td class="${isGain ? 'gain' : 'loss'}">$${unrealizedPL.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    tableBody.innerHTML = rows;
}

// 获取行业样式类
function getSectorClass(sector) {
    const sectorMap = {
        'Technology': 'tech',
        'Healthcare': 'health',
        'Financial': 'finance',
        'Consumer Goods': 'consumer',
        'Energy': 'energy',
        'Automotive': 'auto',
        'Retail': 'retail'
    };
    return sectorMap[sector] || 'other';
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadHoldings();
}); 