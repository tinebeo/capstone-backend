const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()
const {authUser} = require('../permission/basicAuth')

// get all compliances
router.get('/', (req, res) => {
    Compliance.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        }) 
})


// get specific compliance given report number
// path: compliances/report?report_number=<report_number>
router.get('/find', authUser, (req, res) => {
    let query = Compliance.find()
    if (req.query.report_number != null && req.query.report_number != ''){
        query = query.regex('report_number', new RegExp(req.query.report_number, 'i'))
    }
    query.exec().then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

// create the new complinace to MongoDB
router.post('/add', (req, res) => {
    const compliance = new Compliance({
        "report_number": req.query.report_number,
        "record_type": {
            "type": req.query.type,
            "record_detail":req.query.record_detail
        },
        "issued_date": req.query.issued_date,
        "expiry_date": req.query.expiry_date
    })
    compliance.save(err => {
        if(err){
            res.send(err)
        } else {
            res.send({message:"Sucessfully Create"})
        }
    })
})

// delete complinaces by given report_numbers
router.delete('/delete', (req, res) => {
    try {
        Compliance.find({"report_number":req.query.report_number}).then((result) => {
            if (result.length == 0){
                res.status(404).send({message: "Compliance does not exist"})
                return
            }
            Compliance.deleteOne({"report_number":req.query.report_number}).then(() => {
                res.status(200).send({message: "Compliance deleted successfully"})
            })
        })
    } catch (err) {
        res.send(err) 
    }
})

module.exports = router