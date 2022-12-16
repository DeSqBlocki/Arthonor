const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqInteger = {
    type: Number,
    required: true,
}
const optString = {
    type: String,
    required: false,
}
const optInteger = {
    type: Number,
    required: false,
}


const wgeSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    tickets: reqInteger,
    time: optInteger,
    theme: optString,
})

module.exports = mongoose.model('worlds-greatest-expert', wgeSchema)