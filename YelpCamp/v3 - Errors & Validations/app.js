const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// the link REQUIRE ./
const Campground = require('./models/campground');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/CatchAsync');
const expressError = require('./utils/expressError');
const CatchAsync = require('./utils/CatchAsync');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Databse Connected");
    })
    .catch(err => {
        console.log("Connection error:");
        console.log(err);
    });

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
    res.render('home');
})

// ROUTE to display all dataset
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// ROUTE FOR CREATE
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res) => {
    if (!req.body) throw new expressError('Page Not Found', 400);
    // if req.body return as a key-value pair object -> need to access its key as well -> e.g. req.body.campgrund
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// ROUTE FOR SHOW - detail of each campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new expressError('Product Not Found!!!', 404))
    }
    res.render('campgrounds/show.ejs', { campground })
})

// ROUTE FOR UPDATE
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campround) {
        return next(new expressError('Product Not Found!!!', 404))
    }
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateCampground = await Campground.findByIdAndUpdate(id, req.body)
    res.redirect(`/campgrounds/${id}`);
}))

//ROUTE for delete
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const removeCampground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.use('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'OH NO, SOMETHING WENT WRONG !!!' } = err;
    res.status(status).send(message)
    // res.send('OH NO, SOMETHING WENT WRONG !!!')
});

app.listen(3000, () => {
    console.log('Server on port 3000');
})