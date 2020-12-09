const express = require('express')
const router = express.Router()

const { addToCart, getCart, removeFromCart, submitOrder } = require('../services/cart.service')
const auth = require('../middleware/auth')

router.post('/add', auth, addToCart, (req, res) => {
    return res.redirect('http://localhost:3000/cart')
})
router.get('/get', auth, getCart)
router.get('/remove/:id.:pid', auth, removeFromCart)
router.post('/submit', auth, submitOrder)

module.exports = router