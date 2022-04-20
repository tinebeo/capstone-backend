const express = require('express')
const User = require('../models/user')
const Company = require('../models/company')
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//get data from MongoDB
router.get('/', (req, res) => {
    User.find({}, (err, posts) => {
        if (!err) {
            res.json(posts)
        } else {
            console.log(err)
        }
    })
})

// register new user
router.post('/register', (req, res) => {
    const { userName, userEmail, password } = req.body

    // check the whether the user-email exists in database
    User.findOne({ "userEmail": userEmail }, (err, email) => {
        if (email) {
            res.send({ message: "Email already exist!!" })
        } else {
            const user = new User({ userName, userEmail, password })
            // encrypt the password 
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err
                    user.password = hash
                    user.save(err => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send({ message: "Sucessfully Create" })
                        }
                    })
                })
            })
        }
    })
})

// log in user
router.post('/login', (req, res) => {
    const userEmail = req.body.userEmail
    const password = req.body.password

    // find if the user email exsit in the database
    User.findOne({ "userEmail": userEmail }, (err, user) => {
        if (!user) {
            return res.status(404).send({ message: "Email not found!!" })
        }
        // compare the typed password and encrypted password is matched or not 
        bcrypt.compare(password, user.password, (err, data) => {
            if (data) {
                const payload = {
                    userEmail: user.userEmail,
                    role: user.role,
                    companyId: user.company_id,
                    docusignClientId: user.docusignClientId,
                    userId: user._id
                }

                //give the access token and refresh token to the user
                const accessToken = generateAccessToken(payload)
                const refreshToken = generateRefreshToken(payload)

                user.refreshToken = refreshToken;
                user.save()
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })

                // find the end_subscribed_date if expired or alive
                const company_id = user.company_id
                var sub_status = ""

                Company.findOne({"_id":company_id}, (err, company) => {

                    const end_subscribed_date = company.End_Date_of_Subscribption
                    const today = new Date()

                    if (!company){
                        sub_status += "not belong to any company"
                    } else if (!end_subscribed_date) {
                        sub_status += "no plan for this company"
                    } else if (today > end_subscribed_date) {
                        sub_status += "expired"
                    } else {
                        sub_status += "alive"
                    }
                })

                res.json({
                    "message": "success",
                    "role": payload.role,
                    "companyId": payload.companyId,
                    "userId": payload.userId,
                    "subscriptionStatus":sub_status,
                    "docusignClientId": payload.docusignClientId,
                    "accessToken": accessToken
                })

            } else {
                return res.status(400).send({ message: "password incorrect" })
            }
        })
    })
})

// refresh the user
router.get('/refresh', (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    // find if the refresh token exsit in the database
    User.findOne({ "refreshToken": refreshToken }, (err, user) => {
        if (!user) {
            return res.sendStatus(403)
        }
        jwt.verify(refreshToken, process.env.secretOrKey_refresh, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const payload = {
                userEmail: decoded.userEmail,
                role: decoded.role,
                companyId: decoded.companyId,
                docusignClientId: decoded.docusignClientId,
                userId: decoded._id
            }
            const accessToken = generateAccessToken(payload)

            const company_id = user.company_id
            var sub_status = ""

            Company.findOne({"_id":company_id}, (err, company) => {

                const end_subscribed_date = company.End_Date_of_Subscribption
                const today = new Date()
                
                if (!company){
                    sub_status += "not belong to any company"
                } else if (!end_subscribed_date) {
                    sub_status += "no plan for this company"
                } else if (today > end_subscribed_date) {
                    sub_status += "expired"
                } else {
                    sub_status += "alive"
                }
            })
            
            res.json({
                "message": "success",
                "role": payload.role,
                "companyId": payload.companyId,
                "userId": payload.userId,
                "subscriptionStatus":sub_status,
                "docusignClientId": payload.docusignClientId,
                "accessToken": accessToken
            })

        })
    })
})

// logout
router.get('/logout', (req, res) => {
    // On client, clean the accessToken
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    // find if the refresh token exsit in the database
    User.findOne({ "refreshToken": refreshToken }, (err, user) => {
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            return res.sendStatus(403)
        }

        //Delete refresh token
        user.updateOne({ "refreshToken": '' }, (err) => {
            if (err) {
                return res.status(400).json({ message: err })
            } else {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
                return res.sendStatus(204)
            }
        })
    })
})

// forget password
router.put('/forgetPassword', (req, res) => {
    const userEmail = req.body.userEmail
    User.findOne({ "userEmail": userEmail }, (err, user) => {
        if (!user) {
            return res.status(404).send({ message: "Email not found!!" })
        }
        const token = jwt.sign({ "_id": user._id }, process.env.secretOrKey_resetPassword, { expiresIn: '5m' })
        return user.updateOne({ "resetLink": token }, (err, success) => {
            if (err) {
                return res.status(400).json({ message: err })
            } else {
                return res.status(201).json({ message: 'update the user successfully, please redirect to the reset router' })
            }
        })
    })
})

// reset password
router.put('/resetPassword', (req, res) => {
    const newPass = req.body.newPass
    const userEmail = req.body.userEmail
    User.findOne({ "userEmail": userEmail }, (err, user) => {
        if (!user) {
            return res.status(404).send({ message: "Email not found!!" })
        }
        const resetLink = user.resetLink
        if (resetLink) {
            jwt.verify(resetLink, process.env.secretOrKey_resetPassword, function (err) {
                if (err) {
                    return res.json({
                        error: err
                    })
                }
                User.findOne({ resetLink }, (err, user) => {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newPass, salt, (err, hash) => {
                            if (err) throw err
                            user.updateOne({ "password": hash, "resetLink": '' }, (err) => {
                                if (err) {
                                    return res.status(400).json({ message: err })
                                } else {
                                    return res.status(201).json({ message: 'Your password has been changed!' })
                                }
                            })
                        })
                    })
                })
            })
        } else {
            return res.status(401).json({ error: "Authentication error!!" })
        }
    })
})

// Change the role of user
router.put('/changeRole', (req, res) => {
    const newRole = req.body.role
    const changedUser = req.body.userEmail
    User.findOne({"userEmail": changedUser}, (err, user) => {
        if (!user) return res.status(404).json({message: "User is not found!?"})
        if (err) return res.status(400).json({message: err})
        user.updateOne({"role":newRole}, (err) => {
            if (err) {
                return res.status(400).json({message:err})
            } else {
                return res.status(200).json({message: 'Role has been changed!'})
            }
        })
    })
})


function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.secretOrKey_access, { expiresIn: '10m' })
}
function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.secretOrKey_refresh, { expiresIn: '1d' })
}

module.exports = router
