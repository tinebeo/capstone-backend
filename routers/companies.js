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

// add a company
router.post('/add', (req, res) => {
    
    const company = new Company(req.body)
    company.company_id = uuidv4()
    company.save(company)
        .then((result) => {
            res.status(200).send({message: "Company added successfully"})
        })
        .catch((err) => {
            res.status(400).send({message: "Error adding company"})
        })
    
})

module.exports = router