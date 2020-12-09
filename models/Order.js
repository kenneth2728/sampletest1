const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    contact: String,
    grandTotal: Number,
    orders: [
        {
            productId: String,
            productName: String,
            price: Number,
            quantity: Number
        }
    ]
})

module.exports = mongoose.model('Order', orderSchema)