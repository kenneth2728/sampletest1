const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    ownerId: {
        type: String
    },
    grandTotal: Number,
    products: [
        {
            productId: String,
            quantity: Number
        }
    ]
})

module.exports = mongoose.model('Cart', cartSchema)