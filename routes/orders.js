var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
    Order.find().select('product quantity _id').exec().then(
        docs => {
            res.status(200).json(
                {
                    count: docs.length,
                    orders: docs.map(
                        doc => {
                            return {
                                _id: doc._id,
                                product: doc._product,
                                quantity: doc.quantity,
                                request: {
                                    type: "GET",
                                    url: 'http://localhost:3000/orders/' + doc._id,
                                }
                            }
                        }
                    ),
                }
            );
        }
    ).catch(err => {
        docs => {
            res.status(500).json({
                error: err
            });
        }
    })
});

router.post('/', function (req, res, next) {
    Product.findById(req.body.productId)
        .then(
            product => {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                order.save()
                    .then(
                        result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Order created',
                                createdOrder: {
                                    _id: result._id,
                                    product: result.product,
                                    quantity: result.quantity
                                },
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/orders/' + result._id,

                                }
                            });

                        }
                    )
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                res.status(201).json({
                    message: 'Orders were created',
                    order: order
                })
            }
        )
        .catch(
            err => {
                res.status(500).json({
                    message: 'Product not found',
                    error: err
                })
            }
        );

});

router.get('/:orderId', function (req, res, next) {
    res.status(201).json({
        message: 'Orders details',
        orderId: req.params.orderId
    })
});
router.delete('/:orderId', function (req, res, next) {
    res.status(201).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    })
});

module.exports = router;
