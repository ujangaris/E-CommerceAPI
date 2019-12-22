const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const config = require('./config/database')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')
const flash = require('connect-flash');
const messages = require('express-messages')


// Connect to db
mongoose.connect(config.database)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connect to mongodeb!');
});
//view engin setup
app.set('view engine', 'ejs')
app.use(express.static('public'))

// set global error variable
app.locals.errors = null


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
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))
// express flash
app.use(flash());

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
    }
}));


//Express Message middleware
app.use(require('connect-flash')());
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
app.use('/admin/pages', adminPages)
app.use('/', pages)

//Start the server
app.listen(port, () => {
    console.log(`Listening Server on prot ${port}`);
})