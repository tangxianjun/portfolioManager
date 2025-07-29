var pool = require('../config/db');

const myWealth = async (userId) => {
    const query = 'SELECT * FROM wealth LEFT JOIN com_icon ON wealth.code = com_icon.code WHERE share > 0';

    try {
        const [rows] = await pool.query(query, [userId]);
        if (rows.length > 0) {
            return rows;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error fetching wealth:', error);
        throw error;
    }
}

module.exports = myWealth;