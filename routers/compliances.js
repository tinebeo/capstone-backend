const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()

// get to the front-end page
router.get('/', async (req, res) => {
    res.render('compliances/insert', {compliance: new Compliance() })
})

// create the new complinace to MongoDB
router.post('/', async (req, res) => {
    const compliance = new Compliance({
        report_number: req.body.reportNumber,
        record_type: {
            type: req.body.reportType,
            record_detail:req.body.reportDetail
        },
        issued_date: req.body.issuedDate,
        expiry_date: req.body.expiryDate
    })
    compliance.save()
    res.redirect('/compliances')
})


//find data into MongoDB
router.get('/search', async (req, res) => {
    let query = Compliance.find()
    if (req.query.reportNumber != null && req.query.reportNumber != ''){
        query = req.query.reportNumber
    }
    // if (req.query.issued_date != null && req.query.issued_date != ''){
    //     query = query.lte('issued_date', req.query.issued_date)
    // }
    // if (req.query.expiry_date != null && req.query.expiry_date!= ''){
    //     query = query.gte('expiry_date', req.query.expiry_date)
    // }
    try {
        const compliances = await query.exec()
        res.render('compliances/search', {
            compliances: compliances,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


module.exports = router