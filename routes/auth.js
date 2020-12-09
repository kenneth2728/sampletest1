const express = require('express')
const router = express.Router()

const { loginUser, createUser } = require('../services/auth.service')
const signToken = require('../middleware/sign_token')

router.post('/login', loginUser, signToken, (req, res) => res.redirect('/'))

router.post('/signup', createUser, signToken, (req, res) => res.redirect('/'))

module.exports = router