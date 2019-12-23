const express = require('express')
const app = express()
const path = require('path');
const port = 3000
const mongoose = require('mongoose')
const config = require('./config/database')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')
const flash = require('connect-flash');
const messages = require('express-messages')
const fileUpload = require('express-fileupload')

// Connect to db
mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connect to mongodeb!');
});
//view engin setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


app.use(express.static('public'))

// set global error variable
app.locals.errors = null

//Express fileUpload middleware
app.use(fileUpload())


//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //     secure: true
    // }
}))


// //Express Validator middleware
// app.use(expressValidator())
// Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();

            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }

    }
}));

// express flash
app.use(flash());
//Express Message middleware
// app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// app.get('/', (req, res) => {
//     res.send('Hello World')
// })


// Set routes
const pages = require('./routes/pages.js')
const adminPages = require('./routes/admin_pages.js')
const adminCategories = require('./routes/admin_categories.js')
const adminProducts = require('./routes/admin_products.js')

//use routes
app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategories)
app.use('/admin/products', adminProducts)
app.use('/', pages)

//Start the server
app.listen(port, () => {
    console.log(`Listening Server on port ${port}`);
})