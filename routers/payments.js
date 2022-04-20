require("dotenv").config({ path: "../config/config.env" })
const express = require('express')
const router = express.Router()
//const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecretKey = process.env.stripe_secretKey
const Stripe = require('stripe')(stripeSecretKey)
const Company = require('../models/company')

// get bundles from subscriber 
router.post('/charge', async (req, res) => {
    const price = req.body.amount
    const stripeId = req.body.id

    try {
        const payment = await Stripe.paymentIntents.create({
            amount: price,
            currency: 'USD',
            payment_method: stripeId,
            confirm: true
        })

        console.log(payment)

        return res.status(200).send({message: "Successfully charged the fees."})

    } catch (err) {

        return res.status(400).send({message: err.message})
    
    }
})

// update the latest status for the subscriber 
router.put('/updateCompany', async (req, res) => {
    const price = req.query.amount
    const companyId = req.query.companyId
    const plan = req.query.plan
    const months = req.query.month
    const addedDays = months * 30
    const today = new Date()
    const end_date = new Date().addDays(addedDays) 

    //Charge the plan and update company data 
    Company.findById(companyId).then( (company, error) => {
        if (!company) return res.status(404).send({message: "Company does not exist!?"})

        const exist_payment = company.total_payment
        const total_payment = exist_payment + Number(price)

        const exist_sub_month = company.subscribed_month
        const total_sub_month = exist_sub_month + Number(months)

        //update the target company with new payment status
        company.updateOne({"company_plan":plan, "payment":price, "total_payment":total_payment, "subscribed_month":total_sub_month,
        "End_Date_of_Subscribption": end_date, "Start_Date_of_Subscribption":today}, (err) => {
           
            if (err) return res.status(400).send({message:err})

            return res.status(200).send({message: "Update success!"})

        })
    })
})



Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = router