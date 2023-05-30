const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/CatchAsync')

router.get('/register', (req, res) => {
    console.log(req.user)
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

//# login route with method "passport.authenticate()"
// passport.authenticate() => will compare the given passport with hash, if they are match, before redirect to /campgrounds
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    // getting the path for redrect user to after login
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // after redirect, NEED TO DELETE
    // delete req.session.returnTo;
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Successfully Logout!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;