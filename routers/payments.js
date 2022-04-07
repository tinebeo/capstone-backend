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
    const companyID = req.body.companyid
    const plan = req.body.plan

    try {
        const payment = await Stripe.paymentIntents.create({
            amount: price,
            currency: 'USD',
            payment_method: stripeId,
            confirm: true
        })
        console.log(payment)

        //To-do the update company plan
        //Company.findOne()

        return res.status(200).send({message: "Successfully charged the fees."})



    } catch (error) {
        
        return res.status(500).send({message: "charge fail!"}, err)
    }

})

module.exports = router