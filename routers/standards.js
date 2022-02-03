const express = require('express')
const Standard = require('../models/standard')
const router = express.Router()

// get all standards
// path: standards/
router.get('/', (req, res) => {
    Standard.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get specific standard given a category
// path: standards/category?id=<standard_category>
router.get('/category', (req, res) => {
    Standard.find({"standard_category": req.query.id.toUpperCase()})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })

})

module.exports = router