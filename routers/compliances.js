const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()

//post data
router.get('/', (req, res) => {
    res.send("Inside Home")

    //save data into MongoDB
    const compliance = new Compliance({
        schema_version: 1,
        report_number: 'N0142356',
        record_type: {
            type: 'Reporitng test',
            record_detail: 'this is only for testing purpose'
        },
        issued_date: '2022/02/01',
        expiry_date: '2022/02/02'
    })
    compliance.save()
    console.log(compliance)
})


module.exports = router