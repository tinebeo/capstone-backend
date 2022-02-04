const express = require('express')
const Users = require('../models/user')
const router = express.Router()

//post data from MongoDB
router.get('/', (req, res) => {
    const posts = Users.find({}, (err, posts) => {
        if(!err){
            res.json(posts)
        } else {
            console.log(err)
        }
    })
})



//save data into MongoDB
//  const user = new Users({
//     schema_version: 1,
//     user_email: 'test@humber.ca',
//     password: '1234567'
// })
// user.save()
// console.log(user)


module.exports = router