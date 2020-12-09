const express = require('express')
const router = express.Router()

const { addProduct, getGloves, getPPEs, getMasks } = require('../services/product.service')

router.post('/add_product', addProduct)

module.exports = router