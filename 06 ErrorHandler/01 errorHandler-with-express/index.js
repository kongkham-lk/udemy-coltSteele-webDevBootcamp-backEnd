const express = require('express')
const app = express();
const morgan = require('morgan');

const AppError = require('./appError');

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'correctPassword') {
        next();
    }
    res.status(401);
    res.send('SORRY YOU NEED A PASSWORD!!!')
}

app.use(morgan('tiny'));
app.use((req, res, next) => {
    console.log('THIS IS MY FIRST MIDDLEWARE!!!');
    return next();
})

app.get('/', (req, res) => {
    res.send('THIS IS HOME!!!')
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: I eat cereal at night!');
})

app.get('/admin', (req, res) => {
    throw new AppError(403, 'YOU ARE NOT ADMIN!!!') // this will also print error stack
})

// ROUTE FOR SENDING NOT FOUND IF NONE OF ABOVE ROUTE ARE MATCH
app.use((req, res) => {
    res.status(404).send('NOT FOUND!');
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Somgthing Went Wrong '} = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('ON PORT 3000!!!');
})