var pool = require('../config/db');
var express = require('express');
var buyService = require('../service/transation');
var myWealth = require('../service/myWealth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

router.get('/holdings', function(req, res, next) {
  myWealth()
    .then(holdings => {
      res.json(holdings);
    })
    .catch(err => {
      console.error('Error fetching holdings:', err);
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

router.get('/available-stocks', function(req, res, next) {
  const query = `
    SELECT c.* FROM com_icon c
    LEFT JOIN watchlist w ON c.code = w.code
    WHERE w.code IS NULL
    ORDER BY c.name
  `;
  
  pool.query(query)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(err => {
      console.error('Error fetching available stocks:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/watchlist-stocks', function(req, res, next) {
  const query = `
    SELECT c.* FROM com_icon c
    INNER JOIN watchlist w ON c.code = w.code
    ORDER BY c.name
  `;
  
  pool.query(query)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(err => {
      console.error('Error fetching watchlist stocks:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/watchlist/add', function(req, res, next) {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Stock code is required' });
  }
  
  const query = 'INSERT INTO watchlist (code) VALUES (?)';
  pool.query(query, [code])
    .then(() => {
      res.json({ message: 'Stock added to watchlist successfully' });
    })
    .catch(err => {
      console.error('Error adding stock to watchlist:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/watchlist/delete', function(req, res, next) {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Stock code is required' });
  }
  
  const query = 'DELETE FROM watchlist WHERE code = ?';
  pool.query(query, [code])
    .then(() => {
      res.json({ message: 'Stock removed from watchlist successfully' });
    })
    .catch(err => {
      console.error('Error removing stock from watchlist:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/watchlist/batch-add', function(req, res, next) {
  const { codes } = req.body;
  
  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    return res.status(400).json({ error: 'Stock codes array is required' });
  }
  
  // 构建批量插入的SQL
  const values = codes.map(code => [code]);
  const query = 'INSERT IGNORE INTO watchlist (code) VALUES ?';
  
  pool.query(query, [values])
    .then((result) => {
      res.json({ 
        message: `Successfully added ${result.affectedRows} stock(s) to watchlist`,
        affectedRows: result.affectedRows
      });
    })
    .catch(err => {
      console.error('Error batch adding stocks to watchlist:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/watchlist/batch-delete', function(req, res, next) {
  const { codes } = req.body;
  
  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    return res.status(400).json({ error: 'Stock codes array is required' });
  }
  
  // 构建批量删除的SQL
  const placeholders = codes.map(() => '?').join(',');
  const query = `DELETE FROM watchlist WHERE code IN (${placeholders})`;
  
  pool.query(query, codes)
    .then((result) => {
      res.json({ 
        message: `Successfully removed ${result.affectedRows} stock(s) from watchlist`,
        affectedRows: result.affectedRows
      });
    })
    .catch(err => {
      console.error('Error batch removing stocks from watchlist:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


module.exports = router;
