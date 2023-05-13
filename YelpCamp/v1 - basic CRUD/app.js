const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// the link REQUIRE ./
const Campground = require('./models/campground');

const methodOverride = require('method-override');

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

app.get('/', (req, res) => {
    res.render('home');
})

// ROUTE to display all dataset
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// ROUTE FOR CREATE
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    // req.body.campgrund -> since it return as an key-value object with "campground" as the key
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})

// ROUTE FOR UPDATE
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const updateCampground = await Campground.findByIdAndUpdate(id, req.body)
    res.redirect(`/campgrounds/${id}`);
})

//ROUTE for delete
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const removeCampground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

// ROUTE FOR SHOW - detail of each campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', { campground })
})

app.listen(3000, () => {
    console.log('Server on port 3000');
})