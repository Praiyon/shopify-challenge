const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');
const PurchaseOrder = require('../models/purchase_order')
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
var env = process.env.NODE_ENV || "development";
const config = require('../../config/config.json')[env];

router.post('/', (req, res, next) => {

    const outOfStock = []
    function inStock(element, index, array) {

        if (element.inventory>0) {
            return true
        }
        else {
            outOfStock.push(element)
            return false;
        }
    }

    const productSavePromises = []
    Cart.findOne(
        {token : req.headers.token }
    )
    .exec()
    .then(result => {
        console.log(result.products)
        Product.find({
            '_id': { $in: result.products}
        })
        .exec()
        .then( result => {
            if(result.every(inStock)){
                result.map(x => {
                    x.inventory-=1;
                    productSavePromises.push(new Promise((resolve, reject) => {
                        x.save()
                        resolve(true)
                    }))
                    
                })
                const purchaseOrder = new PurchaseOrder({
                    _id : new mongoose.Types.ObjectId(),
                    products : result
                })
                
                

                Promise.all(productSavePromises)
                    .then(
                        Cart.deleteOne(
                            {token : req.headers.token}
                        )
                        .exec()
                        .then(
                            purchaseOrder.save().then(() =>{
                                res.status(201).json({
                                    purchasedItems : purchaseOrder
                                })
                            })
                        )
                        
                      )
            }else{
                res.status(400).json({
                    error: "Some items are out of stock",
                    items: outOfStock
                })
            }
        })
    
    })
    
});

module.exports = router;