const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const birthdaySchema = new mongoose.Schema({
    //Guild ID
    _id: reqString,
    birthday: reqString
})

module.exports = mongoose.model('birthdays', birthdaySchema)