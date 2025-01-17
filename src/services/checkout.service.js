'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")


class CheckoutService {

    /**
    {
    cartId,
    userId,
    shop_order_ids: [
    {
        shopId,
        shop_discount: [],
        item_products: [
        {
            price,
            quantity,
            productId,
        }
        ]
    }
    ]
    }
     */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId ton tai khong
        const foundCart = await findCartById({ cartId })
        if (!foundCart) {
            throw new BadRequestError('Cart not found!')
        }

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0, // tong thanh toan
        },
            shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong')

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice = + checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            // neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    }

    // order
    static async orderByUser({
        userId,
        user_address = {},
        user_payment = {},
    }) {
        const {
            shop_order_ids_new,
            checkout_order,
        } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids,
        })

        // check lai 1 lan nua xem vuot ton kho hay khong
        // get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]:`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check if co 1 san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so sp da duoc cap nhap, vui long quay lai gio hang')
        }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // truong hop: neu insert thanh cong, thi remove product trong cart
        if (newOrder) {
            // remove product in my cart

        }

        return newOrder
    }

    /**
     query order [users]
     */
    static async getOrdersByUser() {

    }

    /**
     query order using Id [users]
     */
    static async getOneOrderByUser() {

    }

    /**
     cancel order [users]
     */
    static async cancelOrdersByUser() {

    }

    /**
     update order status [shop, admin]
     */
    static async updateOrderStatusByShop() {

    }

}

module.exports = CheckoutService