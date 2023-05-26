const express = require('express');
// make a new empty router object to contain all the request method with distinct path
const router = express.Router();

router.get('/', (req, res) => {
    res.send('DISPLAY ALL SHELTERS !!!');
})
router.post('/', (req, res) => {
    res.send('CREATE NEW SHELTER !!!');
})
router.get('/:id', (req, res) => {
    res.send('DISPLAY SPECIFIC SHELTER !!!');
})
router.get('/:id/edit', (req, res) => {
    res.send('EDIT SPECIFIC SHELTER !!!');
})

module.exports = router;