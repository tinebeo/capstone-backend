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
        type: String
    },
    to:{
        type: String
    },
    from:{
        type: String
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
    RFQstages: {
        type: String,
        enum: ['Initiated', 'Processing', 'Completed', 'Cancelled'],
        default: "Initiated"
    },
    docusignEnvelopeId:{
        type: String
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    },
})

module.exports = mongoose.model('RFQ', rfqSchema)
