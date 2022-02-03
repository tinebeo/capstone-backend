const mongoose = require('mongoose')

const ComplianceSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
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

mongoose.model('Compliance', ComplianceSchema)