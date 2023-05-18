
/* FILE IO THAT RUN ON ITS OWN (JUS TO GET DATA FROM DATABASE), NO EXPRESS, SEPARATELY FROM WEB-APP, FOR DEVEOPMENT PURPOSE */

// the require link need to have ./ incfront
const Product = require('./models/product');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStandApp2')
    .then(() => {
        console.log("MONGO CONNNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO, CONNECTION ERROR!!!");
        console.log(err);
    })

const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.55,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    }
]
    
Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
