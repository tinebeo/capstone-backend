require("dotenv").config({ path: "./config/config.env" })

const { sendEnvelopeForEmbeddedSigning, getEnvelopeDocument } = require('../models/docusign');
const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const open = require('open');

// models
const RFQ = require('../models/RFQ')

router.get('/', async (req, res) => {

    // close the window after signing
    res.status(200).send("<script>window.close();</script>")
    //res.status(200).send("You can safely close this window and retry signing.")

})

router.post('/', async (req, res) => {

    const envelopeArgs = {
        signerEmail: "", // will be filled in later, data used will be from docusign
        signerName: "",
        signerClientId: req.body.client_id, // user id of signed in user
        rfqNumber: req.body.rfq_number, // user id of signed in user
        docFile: path.resolve(".", "contract.pdf")
    };

    console.log(envelopeArgs)

    const args = {
        authorizationCode: req.query.code, // secret key, token
        envelopeArgs: envelopeArgs,
    };

    results = await sendEnvelopeForEmbeddedSigning(args);

    if (results) {
        console.log(results.redirectUrl);
        res.status(200).send(results.redirectUrl);
        //res.redirect(results.redirectUrl);

    } else {
        console.log(results)
        res.status(400).send(results)
    }


})

router.get('/done', async (req, res) => {
    // TODO save envelope ID somehow 

    const rfqNumber = req.query.rfq_number
    const envelopeId = req.query.envelope_id

    RFQ.findOneAndUpdate({ rfqNumber: rfqNumber }, { $set: { RFQstages: "Completed", docusignEnvelopeId: envelopeId } }, { new: true })
        .then((result) => {
            if (!result) return res.status(404).send({ message: rfqNumber + " cannot found the RFQ Number!" })
            // close the window after signing
            res.status(200).send("<script>window.close();</script>")
        })
        .catch((err) => {
            res.status(400).send({ message: err })
        })

})

router.get('/:envelopeId', async (req, res) => {
    // GET envelope document
    console.log(req.query.envelopeId)
    const args = {
        envelopeId: req.params.envelopeId
    };

    result = await getEnvelopeDocument(args)

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': result.length
    });
    res.end(result, 'binary');
})

module.exports = router
