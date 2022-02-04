const mongoose = require('mongoose')

const complianceSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    report_number: {
        type: String,
        required: true
    },
    record_type: {
        type: {
            type: String 
        },
        record_detail: {
            type: String
        }
    },
    issued_date: {
        type: Date,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Compliance', complianceSchema)