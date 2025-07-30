var pool = require('../config/db');
var express = require('express');
var buyService = require('../service/transation');
var myWealth = require('../service/myWealth');
const updateCash = require('../service/updateCash');
const getCurrentCash = require('../service/currCash');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cash', function(req, res, next) {
  getCurrentCash()
    .then(cash => {
      res.json({ cash: cash });
    })
    .catch(err => {
      console.error('Error fetching current cash:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/addCash', function(req, res, next) {
  const cash = req.body.cash;
  updateCash(cash, 0)
    .then(() => {
      res.json({ message: 'Cash updated successfully' });
    })
    .catch(err => {
      console.error('Error updating cash:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


router.get('/wealth', function(req, res, next) {
  myWealth()
    .then(wealth => {
      res.json({message: wealth});
    })
    .catch(err => {
      console.error('Error fetching wealth:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/settings', function(req, res) {
  res.render('settings');
});

router.post('/transaction', function(req, res, next) {
  const { share, code, type } = req.body;
  if (!share || !code) {  
    return res.status(400).json({ error: 'Share and code are required' });
  } else {
    buyService(share, code, type)
      .then(result => {
        res.json({ message: result });
      })
      .catch(err => {
        console.error('Error processing transaction:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
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
});
router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Portfolio Manager' });
});

router.get('/stock', function(req, res, next) {
  res.render('stock', { title: 'Stock management' });

});

router.get('/notifications', function(req, res) {
  res.render('notifications');
});

module.exports = router;
