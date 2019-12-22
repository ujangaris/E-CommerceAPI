const monggose = require('mongoose')

//Product Schema
var ProductSchema = monggose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
})


var Product = module.exports = monggose.model('Product', ProductSchema)