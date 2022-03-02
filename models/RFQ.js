const mongoose = require('mongoose')

const rfqSchema = new mongoose.Schema({
    schema_version: {
        type: Number,
        default: 1,
        required: true
    },
    rfqNumber: {
        type: String,
        unique: true,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    rfqDate:{
        type: Date,
        default: Date.now
    },
    vendorDetail:{
        type: String
    },
    quoteRequiredBy:{
        type: String
    },
    authorizedPerson:{
        type: String
    },
    description:{
        type: String
    },
    instruction:{
        type: String
    },
    statement:{
        type: String
    },
    status: {
        type: String
    },
    stages: {
        type: String
    }

})

module.exports = mongoose.model('RFQ', rfqSchema)