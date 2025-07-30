var pool = require('../config/db');


const updateCash = async (cash, code) => {
    var query = 'SELECT * FROM cash WHERE id = 1';
    var newCash = 0;
    try {
        const [rows] = await pool.query(query);
        if (code == 0) {   
            newCash = rows[0]['cash'] + cash;
        } else if (code == 1) {
            if (rows[0]['cash'] < cash) {
                throw new Error('Not enough cash to withdraw');
            }
            newCash = rows[0]['cash'] - cash;
        } else {
            throw new Error('Invalid code');
        }
        query = 'UPDATE cash SET cash = ? WHERE id = 1';
        await pool.query(query, [newCash]);
    } catch (error) {
        console.error('Error updating cash:', error);
        throw error;
    }
}

module.exports = updateCash;