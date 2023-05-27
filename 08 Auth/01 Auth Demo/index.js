const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/users');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/AuthDemo')
    .then(() => {
        console.log("Databse Connected");
    })
    .catch(err => {
        console.log("Connection error:");
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'thisissecret!',
    resave: false,
    saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        // MUST include return => prevent running next()
        return res.redirect('/login');
    }
    next()
}

app.get('/', (req, res) => {
    res.send('THIS IS HOME PAGE!!!');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    // console.log(req.body);
    const { username, password } = req.body;
    // const password = await bcrypt.hash(password, 12);  //=> got remove as a PRE SAVE METHOD is created to hash the password after creating User object but before save to the database
    const user = new User({ username, password });
    await user.save();
    // add this step so new sign-up user no need to re-sign-in again
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // getting specific user but mathing username, instead of user_id
    // const user = await User.findOne({ username });
    // const validUser = await bcrypt.compare(password, user.password);
    const validUser = await User.findByUsernameAndValidate(username, password);
    if (validUser) {
        // need to place before res.send
        req.session.user_id = validUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('TOP SECRET!!!');
})

app.listen(3000, () => {
    console.log('ON PORT 3000!');
})