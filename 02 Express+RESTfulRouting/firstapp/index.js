const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.use(express.static(path.join('public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// inform if there is a new request from any request/link
app.get('/', (req, res) => {
    console.log("THIS IS HOMEPAGE!!");
    res.render('home.ejs', { name:'Home'})
})

app.get('/rand', (req, res) => {
    console.log("THIS IS RANDOME PAGE!!");
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('rand.ejs', { num, name:'Random' });
})

app.get('/r/:subreddit', (req, res) => {
    console.log("THIS IS subreddit PAGE!!");
    const  { subreddit } = req.params;
    // return array element base on key's name
    const data = redditData[subreddit];
    // check if data's value is one of the array object or not
    if (data) {
        //=> pass in '...data' (spread out the object's key-value) -> allow to access each object's property individually by specify the key on ejs file
        res.render('subreddit', { ...data });
    } else {
        res.render('notfound', {subreddit});
    }
})

app.get('/dog', (req, res) => {
    console.log("YAY, GOT NEW REQUEST!!");
    res.send("<h1>REQUEST RECEIVED.</h1>");
})

app.get("/search", (req, res) => {
    const { q } = req.query;
    console.log("YAY, GOT NEW REQUEST!!");
    if (!q) {
        res.send("NOTHING FOUND IF NOTHING SEARCHED!!");
    }
    res.send(`<h1>search result for: ${q}!!!</h1>`);
})

// wait for request for port number 8080
app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080");
})