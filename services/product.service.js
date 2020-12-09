const Product = require('../models/Product')

module.exports = {
    /* Add new Product */
    addProduct: async (req, res) => {
        // fetch form data
        const { name, type, price, stock, image } = req.body

        // create data entry
        const product = new Product({
            name: name,
            type: type,
            price: Number(price),
            stock: Number(stock),
            image: image
        })

        // save data
        product.save()
        return res.redirect(200, 'http://localhost:3000/')
    },
    /* Fetch glove-type items from DB */
    getGloves: async (req, res, next) => {
        const gloves = await Product.find({ type: 'gloves' })

        res.data = gloves
        next()
    },
    /* Fetch PPE-type items from DB */
    getPPEs: async (req, res, next) => {
        const ppes = await Product.find({ type: 'ppe' })

        res.data = ppes
        next()
    },
    /* Fetch mask-type items from DB */
    getMasks: async (req, res, next) => {
        const masks = await Product.find({ type: 'mask' })

        res.data = masks
        next()
    }
}