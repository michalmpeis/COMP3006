//Load plugins
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
require("dotenv").config();
const mongoose = require("mongoose")

// DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB CONNECTED")
}).catch(() => {
    console.log("UNABLE to connect to DB")
})

//initializing passport for authentication
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

//Declare routes for application
app.use('/styles', express.static('styles'));
app.use('/scss', express.static('scss'));
app.use('/js', express.static('js'));
app.use('/views', express.static('views'));

//Declare view engine
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({ secret: 'mixalmpeis' ,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Declare views
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.get('/income', checkAuthenticated, (req, res) => {
    res.render('income.ejs', { name: req.user.name })
})

app.get('/contact', checkAuthenticated, (req, res) => {
    res.render('contact.ejs', { name: req.user.name })
})

app.get('/expenses', checkAuthenticated, (req, res) => {
    res.render('expenses.ejs', { name: req.user.name })
})

app.get('/settings', checkAuthenticated, (req, res) => {
    res.render('settings.ejs', { name: req.user.name })
})

app.get('/myprofile', checkAuthenticated, (req, res) => {
    res.render('myprofile.ejs', { name: req.user.name, email: req.user.email })
})

//post login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

//post register data
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

//logout
app.delete('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return (err); }
        res.redirect('/login');
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = app;

app.listen(9000)