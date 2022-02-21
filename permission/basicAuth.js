const User = require('../models/user')

// check if the user is login or exists into database
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

// check if the user has correct role to do the method
function authDeleteRole() {
    return (req, res, next) => {
        User.findOne({"userEmail":req.query.userEmail}, {"role":1}).then((result) =>{
            const userRole = result.role
            const allowRole = ['Super_Admin', 'Admin', 'Author']
            if (allowRole.indexOf(userRole) == -1) {
                res.status(401)
                return res.send({message:"require proper permission"})
            }
            next()
        })
    }
}


module.exports = {
    authUser, authDeleteRole
}