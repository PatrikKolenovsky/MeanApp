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
    ).catch(err => sendError(err))
});


router.get('/:orderId', function (req, res, next) {
    Order.findById(req.params.orderId).exec()
        .then(
           order => {
               if (!order) {
                   return res.status(404).json({
                       message: "Order not found"
                   })
               }
               res.status(200).json({
                   order: order,
                   request: {
                       type: 'GET',
                       url: 'http://localhost:3000/orders/'
                   }
               })
           }
        ).catch(err => sendError(err, res));
});

router.post('/', function (req, res, next) {
    Product.findById(req.body.productId)
        .then(
            product => {
                if (!product) {
                    return res.status(404).json({
                        message: 'product no found'
                    })
                }
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return order.save()
            }
        ).then(
        result => getCreateProductResult(res, 'created', result, 'POST')
    )
        .catch(err => sendError(err, res));
});


router.delete('/:orderId', function (req, res, next) {
    Order.remove({_id: req.params.orderId}).exec()
        .then(
            result => {
                res.status(200).json({
                    message: 'Order deleted',
                    request: {
                        type: "DELETE",
                        url: 'http://localhost:3000/orders/',
                        body: { productId: 'ID', quantity: 'Number'}
                    }
                })
            }
        )
        .catch(err => sendError(err, res));
});

function getCreateProductResult(res, msg, result, type) {
    console.log(result);
    return res.status(201).json({
        message: 'Order ' + msg,
        createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
        },
        request: {
            type: type,
            url: 'http://localhost:3000/orders/' + result._id,
        }
    });
}

function sendError(err, res) {
    console.log(err);
    return res.status(500).json({
        error: err
    });
}

module.exports = router;
