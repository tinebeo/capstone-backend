const express = require('express')
const RFQ = require('../models/RFQ')
const router = express.Router()
const {authUser, authDeleteRole} = require('../permission/basicAuth')

// get all RFQs
router.get('/', (req, res) => {
    RFQ.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {s
            console.log(err)
        }) 
})


// get specific RFQ given report number
// give the middleware to permission
router.get('/find', authUser, (req, res) => {
    let query = RFQ.find()
    if (req.query.rfqNumber != null && req.query.rfqNumber != ''){
        query = query.regex('rfqNumber', new RegExp(req.query.rfqNumber, 'i'))
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
    const rfq = new RFQ(req.body)
    rfq.save(err => {
        if(err){
            res.send(err)
        } else {
            res.send({message:"Sucessfully Submitted"})
        }
    })
})

// delete complinaces by given report_numbers
router.delete('/delete', authUser, authDeleteRole, (req, res) => {
    try {
        RFQ.find({"rfqNumber":req.query.rfqNumber}).then((result) => {
            if (result.length == 0){
                res.status(404).send({message: "The RFQ does not exist"})
                return
            }
            RFQ.deleteOne({"rfqNumber":req.query.rfqNumber}).then(() => {
                res.status(200).send({message: "The RFQ deleted successfully"})
            })
        })
    } catch (err) {
        res.send(err) 
    }
})

module.exports = router