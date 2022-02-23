const jwt = require("jsonwebtoken")
const User = require('../models/user')
require("dotenv").config({ path: "../config/config.env" })

// 
function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.secretOrKey_access, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.user = decoded.userEmail
        next()
    })
}

module.exports = verifyJWT