const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');
var env = process.env.NODE_ENV || "development";
const config = require('../../config/config.json')[env];

router.post('/', (req, res, next) => {

    const token = jwt.sign({
        cartType: "default"
    },
        "secret",
        {
            expiresIn: "1h"
        }
    );
    
    const cart = new Cart({
        _id : new mongoose.Types.ObjectId(),
        token : token
    });

    cart.save().then(result => {
        console.log(result);
        res.status(201).json({
            message : 'Created Cart successfully',
            createdCart : {
                token : result.token,
                _id : result._id,
                request : {
                    type : 'POST',
                    url : `http://localhost:${config.port}/cart/`
                }
            }
        })
    })
    
});

router.get('/', (req,res,next) =>{
    
    Cart.findOne(
        {token : req.headers.token}
    )
    .then(result =>{
        if(result == null)
            res.status(400).json({
                message: "cart does not exist"
            })
        links = []
        result.products.forEach(x => {
            
            links.push(
                {productId: x._id,
                    link : {
                    type: "GET",
                    href : `http://localhost:${config.port}/product/${x._id}`
                }}
            )        
        })

        res.status(201).json({
           products: links
        })
    })
    .catch(err =>{
        error: err
    })

})
router.post('/item', checkAuth, (req, res, next) => {
//edit object with a list
console.log(req.headers.token)
Cart.findOne(
    {token: req.headers.token}
).then(result =>{
    const list = result.products;
    const prod = req.body.productId.toString();
    if (list.indexOf(prod) > -1){
        res.status(500).json({
            error: "product exists in cart"
        })
    }else{
        Cart.updateOne(
            { token: req.headers.token },
            { $push: { products: req.body.productId  } },
        ).then(result => {
            res.status(201).json({
                message: 'Product successfully added',
                productId: req.body.productId,
                link : {
                    type : 'GET',
                    href : `http://localhost:${config.port}/cart/`
                }
                // message: 'Product successfully added',
                // productId: req.body.productId
            })
        })
    }
}).catch(err => {
    res.status(500).json({
        error : err
    });
});


    
});

router.delete('/:productId', (req, res, next) => {
    Cart.updateOne(
        { token: req.headers.token },
        { $pull: { products: req.params.productId  } },
    ).then(result => {
        res.status(201).json({
            result: result
            // message: 'Product successfully added',
            // productId: req.body.productId
        })
    })
    
});

module.exports = router;