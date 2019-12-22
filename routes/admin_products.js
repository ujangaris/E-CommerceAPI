const express = require('express')
const router = express.Router()
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img')



//Get Product model
var Product = require('../models/product')

//Get Category model
var Category = require('../models/category')

/* 
 *GET products index
 */


router.get('/', (req, res) => {
    var count;
    Product.count(function (err, c) {
        count = c;
    })
    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
            count: count
        })
    })
})





// Exports
module.exports = router