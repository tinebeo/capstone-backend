const express = require('express')
const RFQ = require('../models/RFQ')
const Counter = require('../models/counter')
const router = express.Router()
const {authUser, authRWRole} = require('../permission/basicAuth')
const counter = require('../models/counter')

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


// get specific RFQs by given report number
router.get('/find', (req, res) => {
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

// get a specific RFQ by given report number
router.get('/findOne', (req, res) => {
    const rfqNumber = req.query.rfqNumber
    RFQ.findOne({"rfqNumber":rfqNumber}).then((result) => {
        if (!result) {
            return res.status(404).send({message:"RFQ not found!!"})
        }
        return res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

// create the new RFQ to MongoDB
router.post('/add', (req, res) => {
    const rfq = new RFQ(req.body)
    console.log(rfq)
    Counter.findOneAndUpdate({seqName:"RFQ_Sequence"}, {$inc: {seqCounter: 1}}, function(err, counter) {
        if (!counter){
            const newCounter = new Counter({
                seqName:"RFQ_Sequence"
            })
            newCounter.save()
        }
        
        if (err) return res.json({err: err})

        const seqNumber = "00000" + counter.seqCounter
        //only work from 000001 to 999999
        rfq.rfqNumber = "RFQ-" + seqNumber.slice(-6)
        rfq.save(err => {
            if(err){
                res.send(err)
            } else {
                res.send({message:"Sucessfully Submitted"})
            }
        })
    })
})

//Update the RFQ by given rfqNumber
router.put('/update', (req, res) => {
    const rfqNumber = req.query.rfqNumber
    const newRFQ = req.body
    RFQ.findOneAndUpdate({ "rfqNumber": rfqNumber}, newRFQ, { new: true })
        .then((result) => {
            if (!result) return res.status(404).send({ message: rfqNumber + " cannot found the RFQ Number!"})
            res.status(200).send({ message: rfqNumber + " has been updated successfully" })
        })
        .catch((err) => {
            res.status(400).send({ message: err })
        })
})

//delete the RFQ by given rfqNumber
router.delete('/delete', (req, res) => {
    const rfqNumber = req.query.rfqNumber
    RFQ.findOneAndDelete({"rfqNumber":rfqNumber}, (err) => {    
        if(err) return res.status(400).send({message:err})
        return res.status(201).send({message:"Successfully removed " +  rfqNumber})
    })
})

module.exports = router