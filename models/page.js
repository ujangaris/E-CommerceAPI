const monggose = require('mongoose')

//Page Schema
var PageSchema = monggose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: String
    }
})


var Page = module.exports = monggose.model('Page', PageSchema)