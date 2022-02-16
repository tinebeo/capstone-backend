const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()

//find data into MongoDB
router.get('/', async (req, res) => {
    let query = Compliance.find()
    if (req.query.reportNumber != null && req.query.reportNumber != ''){
        query = query.regex('report_number', new RegExp(req.query.reportNumber.trim(), 'i'))
    }
    if (req.query.issuedDate != null && req.query.issuedDate != ''){
        query = query.lte('issued_date', req.query.issuedDate)
    }
    if (req.query.expiryDate != null && req.query.expiryDate!= ''){
        query = query.lte('expiry_date', req.query.expiryDate)
    }
    try {
        const compliances = await query.exec()
        res.render('compliances/search', {
            compliances: compliances,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/compliances')
    }
})

// get specific compliance given report number
// path: compliances/report?id=<report_number>
router.get('/report', (req, res) => {
    Compliance.find({"report_number": req.query.id})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get to the front-end page
router.get('/new', async (req, res) => {
    res.render('compliances/insert', {compliance: new Compliance() })
})

// create the new complinace to MongoDB
router.post('/new', async (req, res) => {
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


module.exports = router