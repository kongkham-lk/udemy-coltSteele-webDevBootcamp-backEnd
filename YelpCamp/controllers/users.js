const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    // console.log(req.user)
    res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    // getting the path for redrect user to after login
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // after redirect, NEED TO DELETE
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back!');
    // console.log(req.user);
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Successfully Logout!');
        res.redirect('/campgrounds');
    });
};