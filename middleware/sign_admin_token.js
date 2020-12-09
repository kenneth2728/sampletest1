/*
    Middleware for creating JSON Web Tokens
*/

const jwt = require('jsonwebtoken')
const { jwtKey } = require('../config/index')

module.exports = async (req, res, next) => {
    // fetch user information
    const { user } = req.body

    // define payload
    const payload = {
        id: user._id
    }

    // sign payload
    let token = jwt.sign(payload, jwtKey)

    if (!token) return res.status(500).json({ message: 'Internal Server Error' })

    // return token
    res.cookie('jwt_admin', token)
    next()
}