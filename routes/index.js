var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stock', function(req, res, next) {
  res.render('stock', { title: 'Stock management' });
});
module.exports = router;
