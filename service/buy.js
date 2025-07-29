var pool = require('../config/db');

const buy = async (share, code,) => {
    const select = 'SELECT * FROM tickers WHERE ticker = ? Order BY t DESC LIMIT 1';
    var rows;
    try {
            [rows] = await pool.query(select, [code]);
        if (rows.length === 0) {
            throw new Error('Ticker not found');
        }
    } catch (error) {
        console.error('Error fetching ticker:', error);
        throw error;
    }
    console.log(rows[0]['vw']);
    const query = 'INSERT INTO transaction (share, code, status, time, price) VALUES (?, ?, 0, CURRENT_TIMESTAMP, ?)';
    try {
        const [result] = await pool.query(query, [share, code, rows[0]['vw']]);
        return "success";
    } catch (error) {
        console.error('Error inserting transaction:', error);
        throw error;
    }
}
module.exports = buy;
// buy(10, 'AAPL');