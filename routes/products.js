var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, fil, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, callback) => {
    if (file) {
        if (file.mimeType === 'image/jpg') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter()
});


router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    }).catch(err => sendError(err, res));
});

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id,
                        }
                    }
                })
            };
            res.status(200).json(docs);
        })
        .catch(err => sendError(err, res));
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get product',
                        url: 'http://localhost:3000/products/' + doc._id,
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid for this id'
                });
            }
        })
        .catch(err => sendError(err, res));
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({
        _id: id
    }, {
        $set: updateOps
    }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id,
                }
            })
        })
        .catch(err => sendError(err, res));
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // console("Request" + req.params)
    // console.log('ID je ' + id);
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted'
            });
        })
        .catch(err => sendError(err, res));
});

function sendError(err, res) {
    console.log(err);
    return res.status(500).json({
        error: err
    });
}

module.exports = router;
