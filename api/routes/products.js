const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
var env = process.env.NODE_ENV || "development";
const config = require('../../config/config.json')[env];

router.post('/', (req, res, next) => {

    const result = req.body;
    
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        price : result.price,
        inventory: result.inventory,
        name: result.name
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message : `Created ${result.name} successfully`,
            createdProduct : {
                inventory : result.inventory,
                name: result.name,
                _id : result._id,
                
                request : {
                    type : 'POST',
                    url : `http://localhost:${config.port}/product/`
                },
                link:{
                    type: "GET",
                    href : `http://localhost:${config.port}/product/${result._id}`
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });

    });
});

router.get('/', (req, res, next) =>{
    let where ={};
    Object.keys(req.query)
        .forEach( p => {
            where[p] = req.query[p]
        })

    Product.find(where)
    .then(docs => {
        const response = {
            count: docs.length,
            products : docs.map( doc =>{
                return{
                    name : doc.name,
                    price : doc.price,
                    inventory: doc.inventory,
                    _id : doc._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        console.log(docs);
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
    
});

router.delete('/:productId', (req, res, next) => {
    Product.deleteOne({_id : req.params.productId})
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Product successfully deleted',
                productId : req.params.productId
            });
        })
        .catch( err => {
            res.status(500).json({
                error : err
            })
        })
});

router.get('/:productId', (req, res, next) => {
    Product.findOne({_id : req.params.productId})
        .exec()
        .then(result => {
            res.status(201).json({
                message : `Retrieved ${result.name} successfully`,
                retrievedProduct : {
                    inventory : result.inventory,
                    name: result.name,
                    price: result.price,
                    _id : result._id,
                    
                    request : {
                        type : 'GET',
                        url : `http://localhost:${config.port}/product/`
                    }
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                error : err
            })
        })
});

router.patch('/:productId', (req, res, next) =>{


    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({_id : id}, {$set : updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product successfully updated",
                request : {
                    type : 'PATCH',
                    url : `http://localhost:${config.port}/product/${id}`
                },
                link:{
                    type: "GET",
                    href : `http://localhost:${config.port}/product/${id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
    
        });
});

module.exports = router;