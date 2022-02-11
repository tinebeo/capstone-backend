const express = require('express')
const User = require('../models/user')
const router = express.Router()

//get data from MongoDB
router.get('/', (req, res) => {
    const posts = User.find({}, (err, posts) => {
        if(!err){
            res.json(posts)
        } else {
            console.log(err)
        }
    })
})

// register new user
router.post('/register', async (req, res)=>{
    const {userName, userEmail, password, role} = req.body
    User.findOne({userEmail: userEmail} ,(err , name) => {
        if(name){
            res.send({message: "username already exist!!"})
        } else {
            const user = await new User({userName, userEmail, password, role})
            user.save(err => {
                if(err){
                    res.send(err)
                } else {
                    res.send({message:"Sucessfully Create"})
                }
            })
        }
    })
})

// log in user
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