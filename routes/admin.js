const express = require('express')
const router = express.Router()

const { adminSignup, adminLogin } = require('../services/auth.service')
const { updateProduct } = require('../services/admin.service')
const signToken = require('../middleware/sign_admin_token')
const auth = require('../middleware/auth_admin')

router.post('/signup', adminSignup, signToken, (req, res) => res.redirect('http://localhost:3000/inventorypanel'))

router.post('/login', adminLogin, signToken, (req, res) => res.redirect('http://localhost:3000/inventorypanel'))

router.post('/update_product/:pid', auth, updateProduct)

module.exports = router