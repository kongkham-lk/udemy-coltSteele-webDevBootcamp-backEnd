const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// the link REQUIRE ./
const Campground = require('./models/campground');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/CatchAsync');
const expressError = require('./utils/expressError');

const validateSchema = require('./models/validateSchema');

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

// for logging request detail
app.engine('ejs', ejsMate);

const validateInput = (req, res, next) => {
    const { error } = validateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    } else {
        // must include next() in order to pass to the next parameter within the same route handler
        next();
    }
}

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


app.post('/campgrounds', validateInput, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new expressError('Invalide Campground Data', 400);
    // since req.body return as a key-value pair object -> need to access its key as well -> e.g. req.body.campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// ROUTE FOR SHOW - detail of each campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    try {
        campground = await Campground.findById(id);
    } catch (e) {
        throw new expressError('Product Not Found!!!', 404);
    }
    // campground = await Campground.findById(id);
    // if (!campground) {
    //     return next(new expressError('Product Not Found!!!', 404))
    // }
    res.render('campgrounds/show.ejs', { campground })
}))

// ROUTE FOR UPDATE
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new expressError('Product Not Found!!!', 404))
    }
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateInput, catchAsync(async (req, res) => {
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
    const { status = 500 } = err;
    if (!err.message) err.message = 'OH NO, SOMETHING WENT WRONG !!!'
    res.status(status).render('error', { err })
    // res.send('OH NO, SOMETHING WENT WRONG !!!')
});

app.listen(3000, () => {
    console.log('Server on port 3000');
})