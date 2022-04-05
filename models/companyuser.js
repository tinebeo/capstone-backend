const mongoose = require('mongoose')

const companyUserSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },

    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

module.exports = mongoose.model('CompanyUser', companyUserSchema)