require("dotenv").config({ path: "../config/config.env" })
const express = require('express')
const router = express.Router()
//const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
//const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const Stripe = require('stripe')

// get bundles from subscriber 
router.post('/payment', (req, res) => {
    const price = req.body.price
    const stripeId = req.body.id

    Stripe.charges.create({
        amount: price,
        source: stripeId,
        currency: 'cad'
    }).then(() => {
        return res.status(201).send({message: "Successfully charged the fees."})
    }).catch((err) => {
        return res.status(500).send({message: "charge fail!"}, err)
    })
})