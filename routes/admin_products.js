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


/* 
 *GET add product
 */

router.get('/add-product', (req, res) => {
    var title = ''
    var desc = ''
    var price = ''
    Category.find(function (err, categories) {

        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        })
    })
})

/*
* POST add product
*/
router.post('/add-product', function (req, res, next) {

    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;


    var errors = req.validationErrors();

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/add_product', {
                errors: errors,
                title: title,
                desc: desc,
                price: price,
                categories: categories
            });
        });
    } else {
        Product.findOne({ slug: slug }, function (err, product) {
            if (product) {
                req.flash('danger', 'Product title exists, choose another');
                res.render('admin/add_product', {
                    title: title,
                    desc: desc,
                    price: price,
                    categories: categories
                });
            } else {
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                });

                product.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    mkdirp('public/product_images/' + product._id, function (err) {
                        return console.log();
                    });
                    mkdirp('public/product_images/' + product._id + '/gallery', function (err) {
                        return console.log();
                    });
                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
                        return console.log();
                    });

                    if (imageFile != '') {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product._id + '/' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Product added');
                    res.redirect('/admin/products');
                });
            }
        });
    }

});




// Exports
module.exports = router