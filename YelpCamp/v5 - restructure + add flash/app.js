const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const expressError = require('./utils/expressError');

// restructure app.js => short code file
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

// set up session and cookie for storing temp information on server-side
const session = require('express-session');

// config flash messagees
const flash = require('connect-flash');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Databse Connected");
    })
    .catch(err => {
        console.log("Connection error:");
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'));

// for logging request detail
app.engine('ejs', ejsMate);

// tell express to use public folder as default folder for static file
app.use(express.static(path.join(__dirname, 'public')));

// tell express to use session
const sessionConfig = {
    secret: 'thisShouldBeASecret!',
    resave: false,
    saveUninitialized: true,
    /* store: mongo => specify memory storage option to be mongo store 
    => without specify this option, computer will use memoryStore as default (NOT FOR PRODUCTION ENVIRONMENT) since it will go away when restart server*/
    cookie: {
        // MUST INCLUDE => for security reason
        httpOnly: true,
        /* set expired date after 1 week, preventing stay login forever
        => both "expires" == "maxAge" */
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

// tell express to use flash + set flash middleware
app.use(flash());
app.use((req, res, next) => {
    // res.locals.PROPERTY-NAME -> PROPERTY-NAME will be passed to boilerplate.html file
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// tell express to link the file will the correct path
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);



app.get('/', (req, res) => {
    res.render('home');
})

app.use('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'OH NO, SOMETHING WENT WRONG !!!'
    res.status(status).render('error', { err })
    // res.send('OH NO, SOMETHING WENT WRONG !!!')
});

app.listen(3000, () => {
    console.log('Server on port 3000');
})