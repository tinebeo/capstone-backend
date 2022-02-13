const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
router.post('/register', (req, res)=>{
    const {userName, userEmail, password, role} = req.body
    User.findOne({userEmail: userEmail} ,(err , email) => {
        if(email){
            res.send({message: "Email already exist!!"})
        } else {
            const user = new User({userName, userEmail, password, role})
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err
                    user.password = hash    
                    user.save(err => {
                        if(err){
                            res.send(err)
                        } else {
                            res.send({message:"Sucessfully Create"})
                        }
                    })
                })
            })
        }
    })
})

// log in user
router.post('/login', async (req, res) => {
    const userEmail = req.body.userEmail
    const password = req.body.password
    User.findOne({userEmail: userEmail}, (err, user) =>{
        if (!user) {
            return res.status(404).send({message:"Email not found!!"})
        } 
        bcrypt.compare(password, user.password, (err, data) => {
            if (data) {
                const payload = {
                    id: user.id,
                    name: user.name
                }

                jwt.sign(
                    payload, 
                    process.env.secretOrKey, 
                    {expiresIn: 31556926},
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer" + token
                        })
                    }
                )
            } else {
                return res.status(400).send({message:"password incorrect"})
            }
        })
    })
})


module.exports = router