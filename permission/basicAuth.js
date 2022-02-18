const User = require('../models/user')

function authUser(req, res, next) {
    const userEmail = req.query.userEmail
    User.findOne({"userEmail": userEmail}).then((result) => {
        if (result == null){
            res.status(403)
            return res.send({message:"Requrie to Sign in"})
        }
        next()
    })
}

module.exports = {
    authUser
}