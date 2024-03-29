const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const welcomeSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    channelID: reqString
})

module.exports = mongoose.model('welcome-channel', welcomeSchema)