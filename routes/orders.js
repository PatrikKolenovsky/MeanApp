var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'Orders were fetched'
  })
});
router.post('/', function(req, res, next) {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,

  };
  res.status(201).json({
    message: 'Orders were created',
    order: order
  })
});

router.get('/:orderId', function(req, res, next) {
  res.status(201).json({
    message: 'Orders details',
    orderId: req.params.orderId
  })
});
router.delete('/:orderId', function(req, res, next) {
  res.status(201).json({
    message: 'Order deleted',
    orderId: req.params.orderId
  })
});

module.exports = router;
