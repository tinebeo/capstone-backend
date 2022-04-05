const express = require('express')
const User = require('../models/user')
const router = express.Router()

// get users of a specific company
router.get('/:companyId', (req, res) => {
    User.find({company_id: req.params.companyId})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// TODO: get users based on email address

// update a user and tie it to a company
router.put('/update/:companyId/:userId', (req, res) => {

    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { company_id: req.params.companyId } },
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