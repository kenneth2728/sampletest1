const Cart = require('../models/Cart')
const Product = require('../models/Product')
const User = require('../models/User')
const Order = require('../models/Order')

module.exports = {
    /* Get cart items */
    getCart: async (req, res, next) => {
        // get the cart ticket
        const cart = await Cart.findOne({ ownerId: req.body.user.id })

        // get list of products from cart
        const products = cart.products

        // iterate
        try {
            // create array of objects to represent each item
            let prodArray = []

            const iterator = async () => {

                const prodPromise = await products.map(async (item) => {
                    let origProd = await Product.findOne({ _id: item.productId })
    
                    if (origProd) {
                        let prod = {
                            id: item._id,
                            productId: item.productId,
                            name: origProd.name,
                            quantity: item.quantity,
                            image: origProd.image,
                            price: origProd.price
                        }

                        prodArray.push(prod)
                    }

                    return true
                })

                await Promise.all(prodPromise)

                res.data = prodArray
                next()
            }

            iterator()
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    },
    /* Add item to Cart */
    addToCart: async (req, res, next) => {
        if (req.cookies.jwt === undefined) {
            return res.redirect('http://localhost:3000/login').end()
        }

        // get quantity and item ID
        const { qty, itemId } = req.body

        // get cart
        const cart = await Cart.findOne({ ownerId: req.body.user.id })

        // get the item's price
        const targetItem = await Product.findOne({ _id: itemId })

        // check if input quantity does not exceed stock number
        if (qty > targetItem.stock) {
            req.flash('error_msg', 'Quantity should not exceed number of stock')
            return res.redirect('http://localhost:3000/cart').end()
        }

        let itemPrice = (targetItem.price * qty)

        // update grand total
        cart.grandTotal += itemPrice

        // create new item
        const new_cartItem = {
            productId: itemId,
            quantity: qty
        }

        cart.products.push(new_cartItem)

        // save data
        await cart.save()

        next()
    },
    /* Remove item from cart */
    removeFromCart: async (req, res) => {
        // get item ID
        const itemId = req.params.id

        // get cart
        const cart = await Cart.findOne({ ownerId: req.body.user.id })

        // find item on the list
        let targetItem = cart.products.find(x => x._id == itemId)

        // get the item's price
        let originalItem = await Product.findOne({ _id: req.params.pid })
        let itemPrice = (originalItem.price * targetItem.quantity)

        // update grand total
        cart.grandTotal -= itemPrice
        
        // update list of products on cart
        cart.products.splice(cart.products.indexOf(targetItem), 1)
        await cart.save()

        return res.redirect('http://localhost:3000/cart')
    },
    /* Return data necessary for submitting payment form (to use with payment.ejs) */
    preparePayment: async (req, res, next) => {
        // get the cart ticket
        const cart = await Cart.findOne({ ownerId: req.body.user.id })
        // get user information
        const user = await User.findOne({ id: req.body.user._id })
        
        // refactor: destructure the document
        let { contact_one, contact_two, address_one, address_two } = user

        // create a one-liner array for address and contact numbers
        let addressArray = [address_one, address_two != undefined && address_two].filter(Boolean)
        let contactArray = [contact_one, contact_two != undefined && contact_two].filter(Boolean)

        // create object containing the data
        const dataObject = {
            total: cart.grandTotal,
            address: addressArray,
            contact: contactArray
        }

        res.data = dataObject
        next()
    },
    /* Submit Order */
    submitOrder: async (req, res) => {
        // get form data
        const { address, contact } = req.body

        // get user information
        const user = await User.findOne({ id: req.body.user._id })

        // get cart ticket
        let cart = await Cart.findOne({ ownerId: req.body.user.id })

        // get list of products from cart
        const products = cart.products

        // create new order
        let order = new Order({
            firstname: user.firstname,
            lastname: user.lastname,
            grandTotal: cart.grandTotal,
            address: address,
            contact: contact,
            orders: []
        })

        // get cart items
        try {
            const iterator = async () => {
                const prodPromise = await products.map(async (item) => {
                    let origProd = await Product.findOne({ _id: item.productId })

                    if (origProd) {
                        let prod = {
                            productId: origProd._id,
                            productName: origProd.name,
                            price: origProd.price,
                            quantity: item.quantity
                        }

                        order.orders.push(prod)
                    }

                    origProd.stock -= item.quantity
                    await origProd.save()

                    return true
                })

                await Promise.all(prodPromise)

                // save order data
                await order.save()

                // reset cart
                cart.grandTotal = 0
                cart.products = []
                await cart.save()

                return res.redirect('http://localhost:3000/success')
            }

            iterator()
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}