const mongoose = require('mongoose')

const complianceSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    report_number: {
        type: String,
    },
    regulatory_authority: {
        type: String,
    },
    applied_standard: {
        type: String,
    },
    sub_sections: {
        type: String,
    },
    record_type: {
        record_type: {
            type: String 
        },
        record_detail: {
            type: String
        }
    },
    status: {
        type: String,
    },
    originator: {
        type: String,
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    /*issued_date: {
        type: Date,
    },
    expiry_date: {
        type: Date,
    }*/
    country: {
        country_name: {
            type: String,
        },
        continent_name: {
            type: String,
        },
        country_code: {
            type: String,
        },
        continent_code: {
            type: String,
        },
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    },
})

module.exports = mongoose.model('Compliance', complianceSchema)