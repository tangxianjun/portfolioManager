var pool = require('../config/db');

const getCurrentCash = async () => {
    const query = 'SELECT * FROM cash WHERE id = 1';
    try {
        const [rows] = await pool.query(query);
        if (rows.length > 0) {
            return rows[0]['cash'];
        } else {
            throw new Error('Cash record not found');
        }  
    } catch (error) {
        console.error('Error fetching current cash:', error);  
        throw error;
    }  
}

module.exports = getCurrentCash;