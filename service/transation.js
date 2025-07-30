var pool = require('../config/db');
const getCurrentPrice = require('./currPrice');
const updateCash = require('./updateCash');

const buy = async (share, code, type) => {
    const select = 'SELECT * FROM tickers WHERE ticker = ? Order BY t DESC LIMIT 20';
    random_ = Math.floor(Math.random() * 20) + 1;
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
    console.log(rows[random_]['vw']);
    var query = 'SELECT * FROM wealth WHERE code = ?';
    if (type == 0) {
        const [wealthRows] = await pool.query(query, [code]);
        curr_share = wealthRows[0]['share'] + share;

        var cost = wealthRows[0]['avg_cost'] * wealthRows[0]['share'] + share * rows[random_]['vw'];
        updateCash(share * rows[random_]['vw'], 1)
        .catch(err => {
            console.error('Error updating cash:', err);
            throw new Error('Internal server error');
        });
        var avg_cost = cost / curr_share;
        query = 'UPDATE wealth SET share = ?, avg_cost = ? WHERE code = ?';
        try {
            await pool.query(query, [curr_share, avg_cost, code]);
        } catch (error) {
            console.error('Error updating wealth:', error);
            throw error;
        }
    } else if (type == 1) {
        const [wealthRows] = await pool.query(query, [code]);
        if (wealthRows.length === 0 || wealthRows[0]['share'] < share) {
            throw new Error('Not enough shares to sell');
        }
        curr_share = wealthRows[0]['share'] - share;
        if (curr_share === 0) {
            query = 'UPDATE wealth SET share = ?, avg_cost =? WHERE code = ?';
            try {
                await pool.query(query, [curr_share, 0, code]);
            } catch (error) {
                console.error('Error updating wealth:', error);
                throw error;
            }
        } else {
            query = 'UPDATE wealth SET share = ? WHERE code = ?';
            try {
                await pool.query(query, [curr_share, code]);
            } catch (error) {
                console.error('Error updating wealth:', error);
                throw error;
            }
        }
        getCurrentPrice(code)
        .then(price => {
            updateCash(share * price, 0)
            .catch(err => {
                console.error('Error updating cash:', err);
                throw new Error('Internal server error');
            });
        })
        
    }


    query = 'INSERT INTO transaction (share, code, status, time, price) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)';
    try {
        const [result] = await pool.query(query, [share, code, type, rows[random_]['vw']]);
        return "success";
    } catch (error) {
        console.error('Error inserting transaction:', error);
        throw error;
    }
}
module.exports = buy;
// buy(10, 'AAPL');