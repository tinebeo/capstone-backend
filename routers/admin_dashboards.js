const express = require('express')
const company = require('../models/company')
const Company = require('../models/company')
const router = express.Router()

// Grab the data from the company database

// get all companies
// path: admin_dashboards
router.get('/dash', (req, res) => {
    Company.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get geography location for all companies
router.get('/dash/geography', (req, res) => {
    Company.aggregate([
        { $group: {
                _id:"$company_country", //will change to company_country
                count: { $sum: 1}
            }
        }
    ]).then((result) => {
        res.status(200).send(result)
    }) .catch((err) => {
        res.status(400).send({message:err})
    })
})

// get average revenue
router.get('/dash/avg_revenue', (req, res) => {
    Company.aggregate([
        { $group: {
                _id: null,
                totalPayment: {$sum: "payment"},
                count: { $sum: 1}
            }
        }
    ]).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(400).send({message:err})
    })
})

// get monthly recurring revenue
router.get('/dash/month_revenue', (req, res) => {
    const today = new Date()

    Company.find({"End_Date_of_Subscribption":{"$gte": today}}).then((company) => {
        company.aggregate([
            { $group: {
                    _id: null,
                    totalPayment: {$sum: {$divide:["$payment", "$subscribed_month"]}},
                    count: { $sum: 1}
                }
            }
        ]).then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(400).send({message:err})
        })
    }).catch((err) => {
        res.status(404).send({message:"No company is founded", result:0})
    })
})

// get annually recurring revenue
// get customer turnover


module.exports = router