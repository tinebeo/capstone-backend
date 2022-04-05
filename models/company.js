const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    company_name: {
        type: String  
    },
    company_address: {
        type: String,
    },
    company_phone: {
        type: String,
    },
    company_email: {
        type: String,
    },
    engineering_phone: {
        type: String,
    },
    engineering_email: {
        type: String,
    },
    business_phone: {
        type: String,
    },
    business_email: {
        type: String,
    },
    compliance_phone: {
        type: String,
    },
    compliance_email: {
        type: String,
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Company', companySchema)