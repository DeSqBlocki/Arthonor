const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const bdChannelSchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    channelID: reqString
})

module.exports = mongoose.model('birthday-channels', bdChannelSchema)