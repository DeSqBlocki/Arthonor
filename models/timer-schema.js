const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: false,
}

const timerSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    user: reqString, 
    reminder: reqString
})

module.exports = mongoose.model('timers', timerSchema)