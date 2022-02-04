const mongoose = require('mongoose')

const StandardSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    standard_name: {
        type: String,
        required: true
    },
    standard_category: {
        type: String
    },
    standard_body:[{
        type: String
    }]
})

module.exports = mongoose.model('Standard', StandardSchema)