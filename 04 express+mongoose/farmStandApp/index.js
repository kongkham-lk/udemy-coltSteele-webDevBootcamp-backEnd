// EXPRESS
const express = require('express');
const app = express();
const path = require('path');

//MONGOOSE
const mongoose = require('mongoose');

// METHOD OVERRIDE
const methodOverride = require('method-override');

// LINKED PRODUCT.EJS -> the require link need to have ./ in front
const Product = require('./models/product');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.use(express.urlencoded({ extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/farmStandApp')
    .then(() => {
        console.log("MONGO CONNNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO, CONNECTION ERROR!!!");
        console.log(err);
    })

app.use(methodOverride('_method'));


const categories = ['fruit', 'vegetable', 'dairy'];

// ROUTE to display all products
app.get('/products', async (req, res) => {
    let { category } = req.query;
    let products;
    if (category) {
        products = await Product.find({category: category});
        category = category.substring(0,1).toUpperCase() + category.substring(1);
    } else {
        products = await Product.find({});
        category = 'All';
    }
    // await help print the proper object data
    // console.log(products);
    res.render('products/index', { products, categories, category});
})

// ROUTE to crete new product list
app.get('/products/create', (req, res) => {
    res.render('products/new', { categories });
})
// ***REMARKS -> every method that deal with database will be AWAIT
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect('/products')
})

// ROUTE to update data
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories }) 
})
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidator: true});
    // no need to re-save since the date is already save and we just update the dataset
    res.redirect(`/products/${product._id}`) 
})

// ROUTE FOR DELETE
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

// ROUTE FOR FILTER CATEGORY

// THIS ROUTE HAS TO COME AT LAST
// ROUTE to display each product's detail
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;   //=> { id } NEED CURRLY BRACKET
    // findById() return the whole object within the array
    const product = await Product.findById(id);
    // .send() & .render() -> works the same purpose -> display sth on browser screen
    res.render('products/show', { product })
})

app.listen(3000, () => {
    console.log('LISTEN ON PORT 3000!!!');
})