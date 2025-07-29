var pool = require('../config/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.get('/stock/:ticker', function(req, res, next) {
  const ticker = req.params.ticker;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker parameter is required' });
  }
  // Here you would typically fetch data for the ticker from a database or an API
  // For now, we will just send back the ticker as a response
  try {
    const query = 'SELECT * FROM tickers WHERE ticker = ? ORDER BY t DESC';
    pool.query(query, [ticker])
      .then(([rows]) => {
        if (rows.length > 0) {
          res.json(rows);
        } else {
          res.status(404).json({ error: 'Ticker not found' });
        }
      })
      .catch(err => {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Portfolio Manager' });
});

router.get('/stock', function(req, res, next) {
  res.render('stock', { title: 'Stock management' });

});

module.exports = router;
