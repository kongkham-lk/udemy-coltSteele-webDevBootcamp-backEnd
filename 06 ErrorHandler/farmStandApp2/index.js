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

// linked error handler class file
const AppError = require('./AppError');
const { setUncaughtExceptionCaptureCallback } = require('process');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/farmStandApp2')
    .then(() => {
        console.log("MONGO CONNNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO, CONNECTION ERROR!!!");
        console.log(err);
    })

app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

// ROUTE to display all products
app.get('/products', catchAsync(async (req, res, next) => {
    // FOR FILTER CATEGORY
    let { category } = req.query;
    let products;
    if (category) {
        // get all the products base on specify category
        products = await Product.find({ category: category });
        productName = category.substring(0, 1).toUpperCase() + category.substring(1);
    } else {
        products = await Product.find({});
        productName = 'All';
    }
    // await help print the proper object data
    // console.log(products);
    res.render('products/index', { products, categories, productName });
}))

// ROUTE to crete new product list
app.get('/products/create', (req, res) => {
    throw new AppError(401, 'NOT ALLOW!!')
    res.render('products/new', { categories });
})
// ***REMARKS -> every method that deal with database will be AWAIT
app.post('/products', catchAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect('/products')
}))

// ROUTE FOR CHECKING PRODUCT DETAIL
app.put('/products/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidator: true });
    // no need to re-save since the date is already save and we just update the dataset
    res.redirect(`/products/${product._id}`)
}))

// ROUTE FOR DELETE
app.delete('/products/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))


// THIS ROUTE HAS TO COME AT LAST
// ROUTE to display each product's detail
app.get('/products/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let product;
    try {
        product = await Product.findById(id);
    } catch (e) {
        throw new AppError(404, 'Product Not Found!!!')
    }
    // product = await Product.findById(id);
    res.render('products/show', { product })
}))

// ROUTE to update data
app.get('/products/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let product;
    // try {
    //     product = await Product.findById(id);
    // } catch (e) {
    //     // res.status(404).send('Product Not Found!!!');
    //     throw new AppError(404, 'Product Not Found!!!')
    // }
    // res.render('products/edit', { product, categories });
    product = await Product.findById(id);
    if (!product) {
        next(new AppError(404, 'Product Not Found!!!'));
    } else {
        res.render('products/edit', { product, categories });
    }
}))

const handleValidationErr = (err) => {
    console.dir(err)
    return new AppError(400, `Validation Failed... ${err.message}`);
}

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') err = handleValidationErr(err)
    next(err);
})

//CREATE BASIC ERROR HADDLER
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong!!!' } = err
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('LISTEN ON PORT 3000!!!');
})