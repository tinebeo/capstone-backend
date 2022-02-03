const express = require('express')
const router = express.Router()

//post data from MongoDB
router.get('/', (req, res) => {
    res.send("Inside Home")
})


module.exports = router