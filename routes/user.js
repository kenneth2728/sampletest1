const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { submitInfo, deleteAcct } = require('../services/user.service')

router.post('/submit_info', auth, submitInfo)
router.get('/delete_acct', auth, deleteAcct)

module.exports = router