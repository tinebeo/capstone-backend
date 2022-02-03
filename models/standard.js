const mongoose = require('mongoose')

const StandardSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        value: 1,
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

mongoose.model('Standard', StandardSchema)