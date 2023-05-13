const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

let comments = [
    {
        id: uuid(),
        user: "Karat",
        comment: "Visiting Villa Santi, one of the most beautiful hotel in LPB during work trip."
    },
    {
        id: uuid(),
        user: "Rockfon",
        comment: "Enjoy a host of concerts illuminated by candlelight in Vancouver."
    },
    {
        id: uuid(),
        user: "Premkamon",
        comment: "The finished design must be beyond your imagination."
    },
    {
        id: uuid(),
        user: "Toii",
        comment: "Sometimes, I wanna try being a cat."
    },
    {
        id: uuid(),
        user: "Rattanawadee",
        comment: "Design the first virtual home as architecture moves into the metaverse."
    }
]

app.get('/', (req, res) => {
    console.log("THIS IS HOMEPAGE!!");
    res.render('home.ejs', { name:'Home'})
})

/* Display all the comments */
app.get('/comments', (req, res) => {
    console.log("GET /comment response!!!");
    res.render('comments/index.ejs', { comments });
})

/* creating new comment and update to the existing set of comments */
// GET - getting a new form for filling comment, then when submit the form, data will be POST to different route (add data to the common array)
app.get('/comments/new', (req, res) => {
    console.log("GET /new comment response!!!");
    res.render('comments/new.ejs');
})

app.post('/comments', (req, res) => {
    const { user, comment } = req.body;
    comments.push({ user, comment, id:uuid() })
    res.redirect('/comments');

})

/* Display specific comment based on ID */
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render("comments/show", { comment });
})

/*  */
app.get('/comments/:id/edit', (req, res) => {
    console.log('GET /new form to update content');
    const { id } = req.params;
    const foundComment = comments.find(c => c.id === id);
    res.render('comments/edit', { foundComment });
})

/* update specific comment */
app.patch("/comments/:id", (req, res) => {
    console.log('PATCH /UPDATE NEW COMMENT');
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = newCommentText;
    res.redirect('/comments');
})

/* DELETE COMMENT */
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    // DELETING ARRAY ELEMENT == COPY A NE ARRAY WITHOUT THAT ELEMENT -> SHUD NOT MUTATE AN ARRAY
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})

app.listen(3000, (req, res) => {
    console.log("ON PORT 3000");
})