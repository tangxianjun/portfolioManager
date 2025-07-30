var pool = require('../config/db');
var express = require('express');
var buyService = require('../service/transation');
var myWealth = require('../service/myWealth');
const updateCash = require('../service/updateCash');
const getCurrentCash = require('../service/currCash');
const getTransactionHistory = require('../service/myTransation');
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

router.post('/withdrawCash', function(req, res, next) {
  const cash = req.body.cash;
  updateCash(cash, 1)
    .then(() => {
      res.json({ message: 'Cash withdrawn successfully' });
    })
    .catch(err => {
      console.error('Error withdrawing cash:', err);
      if (err.message === 'Not enough cash to withdraw') {
        res.status(400).json({ error: 'Not enough cash to withdraw' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
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

router.get('/transactions', function(req, res, next) {
  getTransactionHistory()
    .then(transactions => {
      res.json({message: transactions});
    })
    .catch(err => {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.delete('/transactions', function(req, res, next) {
  const query = 'DELETE FROM transaction';
  pool.query(query)
    .then(() => {
      res.json({ message: 'All transactions cleared successfully' });
    })
    .catch(err => {
      console.error('Error clearing transactions:', err);
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

// Portfolio Performance API - 获取交易历史数据用于性能图表
router.get('/portfolio-performance', function(req, res, next) {
  const query = `
    SELECT 
      t.time,
      t.share,
      t.price,
      t.status,
      c.name,
      c.sector,
      c.url,
      CASE 
        WHEN t.status = 1 THEN 'BUY'
        WHEN t.status = 0 THEN 'SELL'
        ELSE 'UNKNOWN'
      END as type
    FROM transaction t
    LEFT JOIN com_icon c ON t.code = c.code
    ORDER BY t.time ASC
  `;
  
  pool.query(query)
    .then(([rows]) => {
      // 计算每个时间点的总价值
      const performanceData = [];
      let currentTotalValue = 0;
      let currentCash = 100000; // 假设初始现金
      
      rows.forEach((transaction, index) => {
        const transactionTime = new Date(transaction.time);
        const formattedTime = transactionTime.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // 计算交易对总价值的影响
        const transactionValue = transaction.share * transaction.price;
        if (transaction.status === 1) { // BUY
          currentCash -= transactionValue;
        } else if (transaction.status === 0) { // SELL
          currentCash += transactionValue;
        }
        
        // 这里简化计算，实际应该根据持仓计算股票价值
        // 为了演示，我们使用一个简单的增长模型
        const stockValue = currentTotalValue * 1.02; // 假设2%增长
        currentTotalValue = stockValue;
        
        performanceData.push({
          time: formattedTime,
          totalValue: currentCash + currentTotalValue
        });
      });
      
      res.json({ message: performanceData });
    })
    .catch(err => {
      console.error('Error fetching portfolio performance:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


module.exports = router;
