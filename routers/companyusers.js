const express = require('express')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose');

// get users of a specific company
router.get('/company/:companyId', (req, res) => {
    
    User.find({company_id: req.params.companyId})
        .then((result) => {
            console.log(result)
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// TODO: get users based on email address
router.get('/email/:address', (req, res) => {
    User.find({userEmail: {$regex: "@" + req.params.address + "."}})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// update a user and tie it to a company
router.post('/update/:companyId/:userId', (req, res) => {

    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { company_id: mongoose.Types.ObjectId(req.params.companyId) } },
        { new: true }
    )
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })

})

// delete a company user
router.delete('/delete/:companyId/:userId', (req, res) => {

    User.findOneAndUpdate(
        { _id: req.params.userId },
        { "company_id": null },
        { new: true })
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })


})

module.exports = router