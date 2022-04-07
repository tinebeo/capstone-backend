const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },

    // user group setting to allow admins to edit user groups
    user_group_setting: {
        type: Boolean,
        default: false
    },

    company_name: {
        type: String  
    },
    company_plan: {
        type: [String],
        enum: ['Standard', 'Professional', 'Enterprise', 'No Plan'],
        default: ['No Plan']
    },
    company_address: {
        type: String
    },
    company_country:{
        type: String
    },
    company_phone: {
        type: String
    },
    company_email: {
        type: String
    },
    engineering_name: {
        type: String
    },
    engineering_phone: {
        type: String
    },
    engineering_email: {
        type: String
    },
    business_name: {
        type: String
    },
    business_phone: {
        type: String
    },
    business_email: {
        type: String
    },
    compliance_name: {
        type: String,
    },
    compliance_phone: {
        type: String
    },
    compliance_email: {
        type: String
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Company', companySchema)