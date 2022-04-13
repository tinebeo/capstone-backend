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
    const companyId = req.body.companyId
    const plan = req.body.plan
    const today = new Date()
    //const months = req.body.month
    

    try {
        //Charge the plan and update company data 
        Company.findOne({"_id":companyId}, async (company) => {
            if (!company) return res.status(404).send({message: "Company does not exist!?"})

            const payment = await Stripe.paymentIntents.create({
                amount: price,
                currency: 'USD',
                payment_method: stripeId,
                confirm: true
            })

            console.log(payment)
            
            //const end_date = Date.now() + months * 30 * 24 * 60 * 60 * 1000
            await Company.updateOne({"company_plan":plan, "payment":price, 
                "Start_Date_of_Subscribption":today}, (err) => {
                if (err) return res.status(400).send({message:err})

                return res.status(200).send({message: "Successfully charged the fees."})
            })
        })
    } catch (error) {
        return res.status(500).send({message: "charge fail!"}, error)
    }

})

module.exports = router