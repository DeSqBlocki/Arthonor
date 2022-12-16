const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqInteger = {
    type: Number,
    required: true,
}
const reqStringArray = {
    type: Array,
    required: true,
}

const honorsSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    honors: reqInteger,
    reasons: reqStringArray
})

module.exports = mongoose.model('honors', honorsSchema)