const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    room: String,
    time: Date,
    username: String,
    message: String
})

module.exports = mongoose.model('Message', messageSchema)