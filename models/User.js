const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    contact_one: String,
    contact_two: String,
    facebook: String,
    address_one: String,
    address_two: String
})

module.exports = mongoose.model('User', userSchema)