const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    company_id: {
        type: String,
    },
    company_name: {
        type: String 
        
    }
})

module.exports = mongoose.model('Company', companySchema)