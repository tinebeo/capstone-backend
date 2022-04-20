const express = require('express')
const Product = require('../models/product')

// requires for joins
const Compliance = require('../models/compliance')

const router = express.Router()
const { v4: uuidv4 } = require('uuid');

// auth
const dataAuth = require('../permission/dataAuth');

// get all products
router.get('/', dataAuth, async (req, res) => {

    if (typeof req.user !== 'undefined') {

        const products = await Product.find({ company_id: req.user.companyId })
            .then((result) => {
                return result
            })
            .catch((err) => {
                console.log(err)
            })
        res.send(await getIsCompliant(products, res))

    } else {

        const products = await Product.find()
            .then((result) => {
                return result
            })
            .catch((err) => {
                console.log(err)
            })
        res.send(await getIsCompliant(products, res))
    }


})

// get specific standard given a product_id
router.get('/product', async (req, res) => {

    const products = await Product.find({ "product_id": req.query.product_id.toLowerCase() })
        .then((result) => {
            return result
        })
        .catch((err) => {
            console.log(err)
        })

    res.send(await getIsCompliant(products, res))
})

// get products given a category and standard
// path: products/category?id=<standard_category>&standard=<standard_body>
// e.g., http://localhost:5000/products/category?id=MEAS&standard=IEC%2061010-031%3A2002
router.get('/category', dataAuth, (req, res) => {
    if (typeof req.user !== 'undefined') {
        Product.find({
            "product_details.product_category": req.query.id.toUpperCase(),
            "product_details.applicable_standard": req.query.standard.toUpperCase(),
            company_id: req.user.companyId
        })
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
                res.status(400).send({ message: "Error getting product by standard" })
            })

    } else {
        Product.find({
            "product_details.product_category": req.query.id.toUpperCase(),
            "product_details.applicable_standard": req.query.standard.toUpperCase()
        })
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
                res.status(400).send({ message: "Error getting product by standard" })
            })
    }

})

// update a product given a product_id
router.put('/update', (req, res) => {
    Product.findOneAndUpdate({ "product_id": req.query.product_id }, req.body, { new: true })
        .then((result) => {
            res.status(200).send({ message: "Product updated successfully" })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ message: "Error updating product" })
        })
})

// delete a product given a product_id
router.delete('/delete', (req, res) => {
    Product.deleteOne({ "product_id": req.query.product_id })
        .then((result) => {
            if (result.deletedCount == 0)
                return res.status(404).send({ message: req.query.product_id + " cannot found the product!" })

            res.status(200).send({ message: "Product deleted successfully" })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send({ message: "Error deleting product" })
        })

})

// add a product
router.post('/add', dataAuth, (req, res) => {

    const product = new Product(req.body)
    product.product_id = uuidv4()

    if (typeof req.user !== 'undefined') {
        product.company_id = req.user.companyId
    }

    product.save(product)
        .then((result) => {
            res.status(200).send({ message: "Product added successfully" })
        })
        .catch((err) => {
            res.status(400).send({ message: "Error adding product" })
        })

})


// updates the is_compliant attribute in product
async function getIsCompliant(products, res) {
    const validCompliances = await Compliance.find({
        start_date: { $gt: new Date() },
        end_date: { $lt: new Date() },

    }).then((result) => {
        return result.map((c) => c.report_number)
    }).catch((err) => {
        console.log(err)
        res.status(400).send({ message: "Error getting is_compliant" })
    })

    products.map((p) => {
        if (p.compliance_report_number !== undefined && p.compliance_report_number.length > 0) {
            const nonCompliantReportNumbers = p.compliance_report_number.filter(v => !validCompliances.includes(v))

            p.is_compliant = nonCompliantReportNumbers.length == 0 ? true : false
        } else {
            p.is_compliant = false
        }
    })

    return products
}

module.exports = router