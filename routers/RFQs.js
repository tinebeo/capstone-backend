const express = require('express')
const RFQ = require('../models/RFQ')
const Counter = require('../models/counter')
const User = require('../models/user')
const router = express.Router()

// auth
const { authApproveRole } = require('../permission/basicAuth')
const dataAuth = require('../permission/dataAuth');

// get all RFQs
router.get('/', dataAuth, (req, res) => {
    if (typeof req.user !== 'undefined') {
        RFQ.find({ company_id: req.user.companyId })
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        RFQ.find()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }
})

// get specific RFQs by given report number
router.get('/find', (req, res) => {
    let query = RFQ.find()
    if (req.query.rfqNumber != null && req.query.rfqNumber != '') {
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
    RFQ.findOne({ "rfqNumber": rfqNumber }).then((result) => {
        if (!result) {
            return res.status(404).send({ message: "RFQ not found!!" })
        }
        return res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

//get list of approvers for RFQ application
router.get('/findApprovers', dataAuth, (req, res) => {
    const appRole = ['Approver']
    if (typeof req.user !== 'undefined') {
        console.log(req.user)
        User.find({ "role": { $in: appRole }, company_id: req.user.companyId }).select(["userName", "role"]).exec(function (err, users) {
            if (!users) return res.status(404).send({ message: "No approver has been found!" })
            return res.status(200).send(users)
        })

    } else {

        User.find({ "role": { $in: appRole } }).select(["userName", "role"]).exec(function (err, users) {
            if (!users) return res.status(404).send({ message: "No approver has been found!" })
            return res.status(200).send(users)
        })
    }
})

//get list of RFQs for the user
router.get('/findUserRfqs', dataAuth, (req, res) => {
    
    if (typeof req.user !== 'undefined') {

        // get rfqs for that user
        RFQ.find({ authorizedPerson: req.user.userEmail })
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            })

    }
})

// create the new RFQ to MongoDB
router.post('/add', dataAuth, (req, res) => {
    const rfq = new RFQ(req.body)

    if (typeof req.user !== 'undefined') {
        rfq.company_id = req.user.companyId
    }

    console.log(rfq)
    Counter.findOneAndUpdate({ seqName: "RFQ_Sequence" }, { $inc: { seqCounter: 1 } }, function (err, counter) {
        if (!counter) {
            const newCounter = new Counter({
                seqName: "RFQ_Sequence"
            })
            newCounter.save()
        }

        if (err) return res.json({ err: err })

        const seqNumber = "00000" + counter.seqCounter
        //only work from 000001 to 999999
        rfq.rfqNumber = "RFQ-" + seqNumber.slice(-6)
        rfq.save(err => {
            if (err) {
                res.send(err)
            } else {
                res.send({ message: "Sucessfully Submitted" })
            }
        })
    })
})

//Update the RFQ by given rfqNumber
router.put('/update', (req, res) => {
    const rfqNumber = req.query.rfqNumber
    const newRFQ = req.body
    RFQ.findOneAndUpdate({ "rfqNumber": rfqNumber }, newRFQ, { new: true })
        .then((result) => {
            if (!result) return res.status(404).send({ message: rfqNumber + " cannot found the RFQ Number!" })
            res.status(200).send({ message: rfqNumber + " has been updated successfully" })
        })
        .catch((err) => {
            res.status(400).send({ message: err })
        })
})

//delete the RFQ by given rfqNumber
router.delete('/delete', (req, res) => {
    const rfqNumber = req.query.rfqNumber
    RFQ.findOneAndDelete({ "rfqNumber": rfqNumber }, (err) => {
        if (err) return res.status(400).send({ message: err })
        return res.status(201).send({ message: "Successfully removed " + rfqNumber })
    })
})

module.exports = router