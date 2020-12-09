const bcrypt = require('bcrypt')

const User = require('../models/User')
const Cart = require('../models/Cart')
const Admin = require('../models/Admin')

module.exports = {
    /* Signup */
    createUser: async (req, res, next) => {
        // fetch form data
        const { 
            email,
            password,
            firstname,
            lastname,
            facebook,
            location,
            address_one,
            address_two,
            number_one,
            number_two,
            terms
        } = req.body

        if (terms != 'on') {
            req.flash('error_msg', 'Please agree to the Terms and Conditions')
            return res.redirect('http://localhost:3000/signup').end()
        }

        // check if email is valid
        const user = await User.findOne({ email })
        if (user) return res.status(401).json({ message: 'Email already taken' })

        // create hash
        const hash = await bcrypt.hash(password, 10)

        try {
            // create new user
            let new_user = new User({
                email: email,
                password: hash,
                firstname: firstname,
                lastname: lastname,
                facebook: facebook,
                location: location,
                address_one: address_one,
                contact_one: number_one
            })

            if (address_two) new_user.address_two = address_two
            if (number_two) new_user.contact_two = number_two

            // save data
            const saved_user = await new_user.save()

            // prepare a cart as well
            const cart = new Cart({
                ownerId: saved_user._id,
                grandTotal: 0
            })

            // save cart data
            await cart.save()

            // pass information to next middleware
            req.body = { user: new_user }
            next()
        } catch {
            return res.redirect(500, 'http://localhost:3000/login')
        }
    },
    /* Login */
    loginUser: async (req, res, next) => {
        // fetch form data
        const { email, password } = req.body

        // check email
        const user = await User.findOne({ email })
        if (!user) {
            req.flash('error_msg', 'Login Failed')
            return res.redirect('http://localhost:3000/login').end()
        }

        // check password / verify hash
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('error_msg', 'Login Failed')
            return res.redirect('http://localhost:3000/login').end()
        }

        // pass information to next middleware
        req.body = { user: user }
        next()
    },
    adminSignup: async (req, res, next) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (user) {
            req.flash('error_msg', 'Login Failed')
            return res.redirect('http://localhost:3000/admin_signup').end()
        }

        const hash = await bcrypt.hash(password, 10)

        try {
            const new_admin = new Admin({
                email: email,
                password: hash
            })
            
            await new_admin.save()

            req.body = { user: new_admin }
            next()
        } catch (err) {
            return res.redirect(500, 'http://localhost:3000/admin_signup')
        }
    },
    adminLogin: async (req, res, next) => {
        // fetch form data
        const { email, password } = req.body

        // check email
        const admin = await Admin.findOne({ email })
        if (!admin) {
            req.flash('error_msg', 'Login Failed')
            return res.redirect('http://localhost:3000/admin').end()
        }

        // check password / verify hash
        const match = await bcrypt.compare(password, admin.password)
        if (!match) {
            req.flash('error_msg', 'Login Failed')
            return res.redirect('http://localhost:3000/admin').end()
        }

        // pass information to next middleware
        req.body = { user: admin }
        next()
    }
}