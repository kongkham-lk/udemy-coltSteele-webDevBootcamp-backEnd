const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/tacos', (req, res) => {
    res.send("GET /request from tacos");
})

app.post('/tacos', (req, res) => {
    console.log(req.body);
    res.send("POST /tacos response")
})

app.listen(3000, (req, res) => {
    console.log("ON PORT 3000!");
})