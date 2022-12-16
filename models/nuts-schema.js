const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqInteger = {
    type: Number,
    required: true,
}

const nutsSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    nuts: reqInteger
})

module.exports = mongoose.model('nuts', nutsSchema)