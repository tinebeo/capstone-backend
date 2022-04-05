const express = require('express')
const Company = require('../models/company')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// get all companies
// path: companies/
router.get('/', (req, res) => {
    Company.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get a specific company
router.get('/:id', (req, res) => {
    Company.findById(req.params.id)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// add a company
router.post('/add', (req, res) => {

    const company = new Company(req.body)
    company.save(company)
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })

})

// update a company
router.put('/update/:id', (req, res) => {

    Company.findOneAndUpdate({ "_id": req.params.id }, req.body, { new: true })
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })

})

// delete a company
router.delete('/delete/:id', (req, res) => {

    Company.findOneAndRemove({ "_id": req.params.id })
        .then((result) => {
            res.status(200).send({ message: "Success", result: result })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error", error: err })
        })


})

module.exports = router