var fs = require('fs');
var pool = require('../config/db');


try {
    const rawData = fs.readFileSync('./Data/WMT_clean.json', 'utf8');
    const jsonData = JSON.parse(rawData);
    var i = 0;
    // console.log(jsonData.results);
    for (const item of jsonData.results) {
        console.log(`Processing item ${i++}`);
        const { v, vw, o, c, h, l, t, n } = item;
        console.log(v, vw, o, c, h, l, t, n);
        const query = 'INSERT INTO tickers (ticker, v, vw, o, c, h, l, t, n) VALUES (?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?/1000), ?)';
        pool.query(query, ["WMT", c, vw, o, c, h, l, t, n])
            .then(() => {
                console.log(`Inserted data for date: `);
            })
            .catch(err => {
                console.error(`Error inserting data for date: `, err);
            });
    }

} catch (error) {
    console.error("Error reading or parsing data.json:", error);
}