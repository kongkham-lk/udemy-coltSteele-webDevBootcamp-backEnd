const express = require('express');
const app = express();
const session = require('express-session');

const sessionOption = { secret: 'thisissecret', resave: false, saveUninitialized: false };
app.use(session(sessionOption))

app.get('/viewCount', (req, res) => {
    if (req.session.count) {
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`You have viewed this page -> ${req.session.count} times`)
})

app.get('/register', (req, res) => {
    const { username = 'Anonymous' } = req.query;
    req.session.username = username;
    res.redirect('/greet');
})

app.get('/greet', (req, res) => {
    const { username: user } = req.session;
    res.send(`Welcome back, ${user}`);
})

app.listen(3000, () => {
    console.log('ON PORT 3000!!!')
})