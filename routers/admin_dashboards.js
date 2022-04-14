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
                _id:"$company_country",
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
                totalPayment: {$sum: "$payment"},
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
    Company.aggregate([
        { $group: {
                _id: {$dateToString: {format: "%Y-%m", date: "$Start_Date_of_Subscribption" }},
                totalMonthlyRevenue: {$sum: "$payment"},
                member_count: { $sum: 1}
            }
        }
    ]).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(400).send({message:err})
    })
})

// get annually recurring revenue
router.get('/dash/annual_revenue', (req, res) => {
    Company.aggregate([
        { $group: {
                _id: {$dateToString: {format: "%Y", date: "$Start_Date_of_Subscribption" }},
                totalAnnualRevenue: {$sum: "$payment"},
                member_count: { $sum: 1}
            }
        }
    ]).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(400).send({message:err})
    })
})

// get customer turnover yearly
router.get('/dash/cust_turnover', (req, res) => {
    const this_year_first = new Date(new Date().getFullYear(), 0, 1)
    const this_year_last = new Date(new Date().getFullYear()+1, 0, 1)
    Company.aggregate([
        { $facet : {
            "unactive_member_count":[
                { $match: {
                    "Start_Date_of_Subscribption": {$not: {"$gte": this_year_first, "$lte": this_year_last}}
                    }
                },
                { $group: {
                        _id: null,
                        No_Active_member_count: { $sum: 1}
                    }
                }
            ],
            "active_memebr_count_thisYear": [
                { $match: {
                    "Start_Date_of_Subscribption": {"$gte": this_year_first, "$lte": this_year_last}
                    }
                },
                { $group: {
                        _id: null,
                        Active_member_count: { $sum: 1}
                    }
                }
            ]}
        }
    ]).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(400).send({message:err})
    })
})

module.exports = router