const express = require('express')
const app = express();
const morgan = require('morgan');

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'correctPassword') {
        next();
    }
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

// ROUTE FOR SENDING NOT FOUND IF NONE OF ABOVE ROUTE ARE MATCH
app.use((req, res) => {
    res.status(404).send('NOT FOUND!');
})


app.listen(3000, () => {
    console.log('ON PORT 3000!!!');
})