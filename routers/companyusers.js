const express = require('express')
const CompanyUser = require('../models/companyuser')
const router = express.Router()

// get all companies and their users
router.get('/', (req, res) => {
    CompanyUser.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get a specific company and their users
router.get('/:companyId', (req, res) => {
    CompanyUser.find({company_id: req.params.companyId})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// add a company user
router.post('/add', (req, res) => {

    const companyuser = new CompanyUser(req.body)
    companyuser.save(companyuser)
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })

})

// delete a company user
router.delete('/delete/:companyId/:userId', (req, res) => {

    CompanyUser.findOneAndRemove({ "company_id": req.params.companyId, "user_id": req.params.userId })
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })


})

module.exports = router