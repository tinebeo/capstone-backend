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

// check if the user has correct role to write or update the document
function authRWRole(req, res, next) {
    User.findOne({"userEmail":req.query.userEmail}, {"role":1}).then((result) =>{
        const userRole = result.role
        const allowRole = ['Admin', 'Author']
        if (allowRole.indexOf(userRole) == -1) {
            res.status(401)
            return res.send({message:"require proper permission"})
        }
        next()
    })   
}

// check if the user has correct role to remove the document or user
function authDeleteRole(req, res, next) {
    User.findOne({"userEmail":req.query.userEmail}, {"role":1}).then((result) =>{
        const userRole = result.role
        const allowRole = ['Super_Admin', 'Admin']
        if (allowRole.indexOf(userRole) == -1) {
            res.status(401)
            return res.send({message:"require proper permission"})
        }
        next()
    })   
}

// check if the user has correct role to approve the document
function authApproveRole(req, res, next) {
    User.findOne({"userEmail":req.query.userEmail}, {"role":1}).then((result) =>{
        const userRole = result.role
        const allowRole = ['Admin', 'Approver']
        if (allowRole.indexOf(userRole) == -1) {
            res.status(401)
            return res.send({message:"require proper permission"})
        }
        next()
    })   
}

// check if the user has correct role to view the whole informatio of the app coding and database information
function authSuperAdminRole(req, res, next) {
    User.findOne({"userEmail":req.query.userEmail}, {"role":1}).then((result) =>{
        const userRole = result.role
        const allowRole = ['Super_Admin']
        if (allowRole.indexOf(userRole) == -1) {
            res.status(401)
            return res.send({message:"require proper permission"})
        }
        next()
    })   
}


module.exports = {
    authUser, authRWRole, authDeleteRole, authApproveRole, authSuperAdminRole
}