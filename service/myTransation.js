var pool =  require('../config/db');

const getTransactionHistory = async () => { 
    const query = `
        SELECT *
        FROM transaction t
        LEFT JOIN com_icon c ON t.code = c.code
        ORDER BY t.time DESC
    `;

    try {
        const [rows] = await pool.query(query);
        console.log(rows);
        if (rows.length > 0) {
            return rows;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        throw error;
    }
}

getTransactionHistory();
module.exports = getTransactionHistory;