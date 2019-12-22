const monggose = require('mongoose')

//Category Schema
var CategorySchema = monggose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
})


var Category = module.exports = monggose.model('Category', CategorySchema)