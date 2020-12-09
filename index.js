const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

const { database } = require('./config/index')

const isLoggedIn = require('./middleware/auth')

const app = express()

/* Connect to Database */
try {
    mongoose.connect(database.uri, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).catch(err => {
        if (err.name == 'MongoParseError')
            console.error('Invalid MongoDB URI on config/index.js')
        if (err.name == 'MongoTimeoutError')
            console.error('MongoDB - Connection Timeout')
    })
} catch (error) {
    console.error(error)
}

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Database'))

/* Modules */
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(cors({
    domain: 'http://localhost:3000',
    credentials: true
}))

/* Routes */
const auth = require('./routes/auth')
app.use('/api/auth', auth)
const product = require('./routes/product')
app.use('/api/products', product)
const user = require('./routes/user')
app.use('/api/user', user)
const cart = require('./routes/cart')
app.use('/api/cart', cart)
const admin = require('./routes/admin')
app.use('/api/admin', admin)

/* Static */
app.set('views', __dirname + '/static')
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, './assets/styles')))
app.use(express.static(path.join(__dirname, './assets/images')))

// logout
app.get('/logout', async (req, res) => {
    res.clearCookie('jwt', { path: '/' }).render('homepage')
})

// homepage
app.get('/', (req, res) => {
    res.render('homepage');
})

// about
app.get('/about', (req, res) => {
    res.render('about');
})

// contacts
app.get('/contacts', (req, res) => {
    res.render('contacts');
})

// categories
app.get('/categories', (req, res) => {
    res.render('categories');
})

const { getInfo } = require('./services/user.service')

// profile
app.get('/profile', isLoggedIn, (req, res, next) => {
    // req.cookies.jwt === undefined ? res.render('login', { error_msg: req.flash('error_msg'), data: req.body.user }) : res.render('profile')
    req.cookies.jwt == undefined ? res.render('login', { error_msg: req.flash('error_msg') }) : next()
}, getInfo, (req, res) => {
    res.render('profile', { data: res.data })
})

// login
app.get('/login', (req, res) => {
    req.cookies.jwt === undefined ? res.render('login', { error_msg: req.flash('error_msg') }) : res.render('profile')
})

// signup
app.get('/signup', (req, res) => {
    res.render('signup', { error_msg: req.flash('error_msg') });
})

// cart
const { getCart, preparePayment } = require('./services/cart.service')

app.get('/cart', isLoggedIn, getCart, (req, res) => {
    if (req.cookies.jwt == undefined) {
        res.render('login', { error_msg: req.flash('error_msg') })
    } else {
        res.render('cart', { items: res.data, error_msg: req.flash('error_msg') })
    }
})

// payment
app.get('/payment', isLoggedIn, preparePayment, (req, res) => {
    res.render('payment', { items: res.data });
})

// success
app.get('/success', (req, res) => {
    res.render('success');
})

// deleteacct
app.get('/deleteacct', (req, res) => {
    res.render('deleteacct');
})

const { getGloves, getMasks, getPPEs } = require('./services/product.service')

app.get('/gloves', getGloves, (req, res) => {
    res.render('gloves', { items: res.data })
})

// masks
app.get('/masks', getMasks, (req, res) => {
    res.render('masks', { items: res.data });
})

// ppe
app.get('/ppe', getPPEs, (req, res) => {
    res.render('ppe', { items: res.data });
})

// inventorypanel
app.get('/inventorypanel', (req, res) => {
    res.render('inventorypanel');
})

// glovesinventory
app.get('/glovesinventory', getGloves, (req, res) => {
    res.render('glovesinventory', { items: res.data });
})

// masksinventory
app.get('/maskinventory', getMasks, (req, res) => {
    res.render('maskinventory', { items: res.data });
})

// ppeinventory
app.get('/ppeinventory', getPPEs, (req, res) => {
    res.render('ppeinventory', { items: res.data });
})

// admin
const isAdmin = require('./middleware/auth_admin')

app.get('/admin', isAdmin, (req, res) => {
    req.cookies.jwt_admin === undefined ? res.render('admin', { error_msg: req.flash('error_msg') }) : res.render('inventorypanel')
})

app.get('/admin_signup', isAdmin, (req, res) => {
    req.cookies.jwt_admin === undefined ? res.render('adminsignup', { error_msg: req.flash('error_msg') }) : res.render('inventorypanel')
})

app.get('/admin_logout', async (req, res) => {
    res.clearCookie('jwt_admin', { path: '/' }).render('homepage')
})

module.exports = app