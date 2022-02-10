const express = require('express')
const Product = require('../models/product')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

router.post('/add', (req, res) => {
    //console.log(req.body)
    //res.send(req.body)
    const product = new Product(req.body)
    product.product_id = uuidv4()
    product.save(req.body, function (err, docs) {
        if (err){ 
            console.error(err);
            res.status(400).send({message: "Error adding product"})
        } else {
            console.log("Product inserted");
            res.status(200).send({message: "Product added successfully"})
        }
    });
})

//save data into MongoDB
//  const compliance = new Compliance({
//     schema_version: 1,
//     report_number: 'N0142356',
//     record_type: {
//         type: 'Reporitng test',
//         record_detail: 'this is only for testing purpose'
//     },
//     issued_date: '2022/02/01',
//     expiry_date: '2022/02/02'
// })
// compliance.save()
// console.log(compliance)

module.exports = router