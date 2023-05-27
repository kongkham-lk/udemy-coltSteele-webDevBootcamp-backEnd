const express = require('express');
// make a new empty router object to contain all the request method with distinct path
const router = express.Router();

router.use((req, res, next) => {
    if (req.query.isAdmin) {
        next();
    } else {
        res.send('THIS IS NOT ADMIN');
    }
})

router.get('/', (req, res) => {
    res.send('DISPLAY ALL DOGS !!!');
})
router.post('/', (req, res) => {
    res.send('CREATE NEW DOG !!!');
})
router.get('/:id', (req, res) => {
    res.send('DISPLAY SPECIFIC DOG !!!');
})
router.get('/:id/edit', (req, res) => {
    res.send('EDIT SPECIFIC DOG !!!');
})

module.exports = router;