const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const feedbackSchema = new mongoose.Schema({
    _id: reqString, //ID of Message
    feedback: reqString, //Feedback as string
    user: reqString //ID of User
})

module.exports = mongoose.model('feedback', feedbackSchema)