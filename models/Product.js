const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    price: {
        type: Number
    },
    stock: {
        type: Number
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model('Product', productSchema)