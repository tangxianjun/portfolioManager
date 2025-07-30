var pool = require('../config/db');

const myWealth = async () => {
    var query = 'SELECT * FROM wealth LEFT JOIN com_icon ON wealth.code = com_icon.code WHERE wealth.share > 0';
    try {
        var [rows] = await pool.query(query);
        for (var i = 0; i < rows.length; i++) {
            query = 'SELECT * FROM tickers WHERE ticker = ? ORDER BY t DESC LIMIT 1';
            const [tickerRows] = await pool.query(query, [rows[i]['code']]);
            rows[i]["current_price"] = tickerRows.length > 0 ? tickerRows[0]['vw'] : null;
            rows[i]["value"] = rows[i]['share'] * rows[i]['avg_cost'];
            
            rows[i]['balance'] = rows[i]['share'] * rows[i]['current_price']-rows[i]['share'] * rows[i]['avg_cost'];
        }
        console.log(rows);
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
// myWealth();
module.exports = myWealth;