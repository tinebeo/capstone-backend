const express = require('express')
const Standard = require('../models/standard')
const router = express.Router()

// get data
router.get('/', (req, res) => {
    Standard.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/test', (req, res) => {
    res.send("This is a test url under standards path")
})

module.exports = router