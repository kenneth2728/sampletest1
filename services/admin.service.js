const Admin = require('../models/Admin')
const Product = require('../models/Product')

module.exports = {
    /* Update product's stocks */
    updateProduct: async (req, res) => {
        const pid = req.params.pid

        const { quantity } = req.body

        let product = await Product.findOne({ _id: pid })

        product.stock = quantity

        await product.save()

        return res.redirect(`http://localhost:3000/${product.type}inventory`)
    }
}