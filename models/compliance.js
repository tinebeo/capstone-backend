const mongoose = require('mongoose')

const complianceSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    report_number: {
        type: Number,
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
    },
    expiry_date: {
        type: Date,
    }
})

module.exports = mongoose.model('Compliance', complianceSchema)