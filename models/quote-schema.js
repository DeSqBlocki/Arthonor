const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const quoteSchema = new mongoose.Schema({
    _id: reqString, //Quote ID
    channel: reqString, //Channel ID
    user: reqString, //User ID
})

module.exports = mongoose.model('quotes', quoteSchema)