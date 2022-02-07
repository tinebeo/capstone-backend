const express = require('express')
const User = require('../models/user')
const router = express.Router()

//post data from MongoDB
router.get('/', (req, res) => {
    const posts = User.find({}, (err, posts) => {
        if(!err){
            res.json(posts)
        } else {
            console.log(err)
        }
    })
})

//new author route
router.get('/new', (req, res)=>{
    res.send('Create new user')
})

//create new user
// router.post('/new', async (req, res) => {
//     const user = new User({
//         user_email: req.body.user_email,
//         password: req.body.password,
//         role: req.body.role
//     })
//     try {
//         const newUser = await users.save()
//         res.redirect('users')
//     } catch {
//         res.render('users/new', {
//             user: user,
//             errorMessage: 'Error Creating Users'
//         })
//     }
// })


module.exports = router