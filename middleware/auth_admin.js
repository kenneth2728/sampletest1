/*
    Middleware for verifying JSON Web Tokens
*/

const jwt = require('jsonwebtoken')
const { jwtKey } = require('../config/index')

module.exports = async(req, res, next) => {
    // check for token
    const cookieToken = req.cookies.jwt_admin

    if (cookieToken === undefined) next()

    // verify token
    const payload = jwt.verify(cookieToken, jwtKey)

    req.body.user = payload
    next()
}