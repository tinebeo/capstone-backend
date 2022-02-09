const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()

//post data from MongoDB
router.get('/', async (req, res) => {
    res.render('compliances/insert', {compliance: new Compliance() })
})

// create the new complinace
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
    res.send(compliance)
})



//save data into MongoDB
//  const compliance = new Compliance({
//     schema_version: 1,
//     report_number: 'N0142356',
//     record_type: {
//         type: 'Reporitng test',
//         record_detail: 'this is only for testing purpose'
//     },
//     issued_date: '2022/02/01',
//     expiry_date: '2022/02/02'
// })
// compliance.save()
// console.log(compliance)


module.exports = router