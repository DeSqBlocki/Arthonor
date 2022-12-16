const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqInteger = {
    type: Number,
    required: true
}

const wgeBlacklistSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    tickets: reqInteger
})

module.exports = mongoose.model('wge-blacklist', wgeBlacklistSchema)