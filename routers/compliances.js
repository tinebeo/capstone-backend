const express = require('express')
const Compliance = require('../models/compliance')
const router = express.Router()
const {authUser, authRWRole, authDeleteRole} = require('../permission/basicAuth')

// auth
const dataAuth = require('../permission/dataAuth');

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
// give the middleware to permission
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
router.post('/add', dataAuth, (req, res) => {
    const compliance = new Compliance(req.body)

    if (typeof req.user !== 'undefined') {
        compliance.company_id = req.user.companyId
    }
    
    compliance.save(err => {
        if(err){
            res.send(err)
        } else {
            res.send({message:"Sucessfully Create"})
        }
    })
})

// delete complinaces by given report_numbers
router.delete('/delete', authDeleteRole, (req, res) => {
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