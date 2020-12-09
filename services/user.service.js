const User = require('../models/User')

module.exports = {
    getInfo: async (req, res, next) => {
        const user = await User.findOne({ id: req.body.user._id })

        res.data = user
        next()
    },
    /* Submit Personal Information */
    submitInfo: async (req, res, next) => {
        // fetch form data
        const {
            firstname,
            lastname,
            number_one,
            number_two,
            facebook,
            email,
            address_one,
            address_two
        } = req.body

        // find user
        const user = await User.findOne({ id: req.body.user._id })

        // modify fields
        user.firstname = firstname
        user.lastname = lastname
        user.contact_one = number_one
        user.address_one = address_one
        user.email = email

        if (facebook) user.facebook = facebook
        if (number_two) user.number_two = number_two
        if (address_two) user.address_two = address_two

        await user.save()

        return res.redirect('http://localhost:3000/')
    },
    deleteAcct: async (req, res) => {
        await User.deleteOne({ id: req.body.user._id }, (err) => {
            if (err) return res.status(500).json({ message: 'Internal Server Error' })
        })

        return res.redirect('http://localhost:3000/logout')
    }
}