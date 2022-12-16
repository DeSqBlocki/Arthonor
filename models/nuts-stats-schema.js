const mongoose = require('mongoose')

const reqInteger = {
    type: Number,
    required: true,
}

const nutStatsSchema = new mongoose.Schema({
    //Guild ID
    _id: reqInteger,
    nutCase: reqInteger,
})

module.exports = mongoose.model('nut-stats', nutStatsSchema)