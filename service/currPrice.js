var pool = require('../config/db');


var getCurrentPrice = async (ticker) => {
    const query = 'SELECT * FROM tickers WHERE ticker = ? ORDER BY t DESC LIMIT 1';
    try {
        const [rows] = await pool.query(query, [ticker]);
        if (rows.length > 0) {
            return rows[0]['vw'];
        } else {
            throw new Error('Ticker not found');
        }
    } catch (error) {
        console.error('Error fetching current price:', error);
        throw error;
    }
}

module.exports = getCurrentPrice;