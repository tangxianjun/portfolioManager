var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Portfolio Manager' });
});

router.get('/stock', function(req, res, next) {
  res.render('stock', { title: 'Stock management' });
});

module.exports = router;
