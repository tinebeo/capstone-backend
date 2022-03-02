const express = require('express')
const Product = require('../models/product')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// get all products
router.get('/', (req, res) => {
    Product.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        }) 
})

// get specific standard given a product_id
router.get('/product', (req, res) => {
    Product.find({"product_id": req.query.id.toLowerCase()})
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

// get products given a category and standard
// path: products/category?id=<standard_category>&standard=<standard_body>
// e.g., http://localhost:5000/products/category?id=MEAS&standard=IEC%2061010-031%3A2002
router.get('/category', (req, res) => {
    console.log(req.query.id.toLowerCase())
    Product.find({
        "product_details.product_category": req.query.id.toUpperCase(),
        "product_details.applicable_standard": req.query.standard.toUpperCase()
    })
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
        
})

// update a product given a product_id
router.put('/update', (req, res) => {
    Product.findOneAndUpdate({"product_id": req.query.id}, req.body, {new: true})
        .then((result) => {
            res.status(200).send({message: "Product updated successfully"})
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({message: "Error updating product"})
        })
})

// delete a product given a product_id
router.delete('/delete', (req, res) => {
    Product.deleteOne({"product_id": req.query.id})
        .then((result) => {
            res.status(200).send({message: "Product deleted successfully"})
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({message: "Error deleting product"})
        })

})

// add a product
router.post('/add', (req, res) => {
    
    const product = new Product(req.body)
    product.product_id = uuidv4()
    product.save(product)
        .then((result) => {
            res.status(200).send({message: "Product added successfully"})
        })
        .catch((err) => {
            res.status(400).send({message: "Error adding product"})
        })
    
})

module.exports = router