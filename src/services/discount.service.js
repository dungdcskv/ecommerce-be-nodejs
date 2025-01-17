'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountCodeUnSelect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { convertToObjectIdMongodb } = require("../utils")
const { findAllProducts } = require("./product.service.xxx")



/*
Dicount Service:
1 -Generator Discount Code [Shop| Admin]
2 - Get discount amount (User)
3 - Get all discount codes (User| Shop)
4 - Verify discount code [user]
5 - Delete discount code [Admin | Shop]
6 - Cancel discount code [user]
*/


class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_uses, max_value, uses_count, max_uses_per_user, uses_used
        } = payload

        // kiem tra
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expried')
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }

        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exist')
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_type: type,
            discount_value: value,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_max_value: max_value,
            discount_uses_count: uses_count,
            discount_uses_used: uses_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })

        return newDiscount
    }

    static async updateDiscountCode() {

    }

    /**
     * get all discount codes available with products
     */
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit = 50, page = 1
    }) {
        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount not exist')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })
        }

        if (discount_applies_to === 'specific') {
            // get all product ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })
        }

        return products
    }

    // get all discount code in shop

    static async getAllDiscountCodeByShop({
        limit, page, shopId,
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel,
        })

        return discounts
    }

    /**
     * Apply discount code
     */
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_start_date,
            discount_end_date,
            discount_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
        } = foundDiscount
        if (!discount_is_active) throw new BadRequestError('Discount expried')
        if (!discount_max_uses) throw new BadRequestError('Discount expried')

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code has expried')
        }

        // check xem cos et gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minium value order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used?.find(user => user.userId === userId)
            if (userUserDiscount) {
                //
            }
        }

        // check xem discount nay la fixed_amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const foundDiscount = ''
        if (foundDiscount) {
            // deleted
        }

        const deleted = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId),
        })

        return deleted
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount is not exist')

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_user: 1,
                discount_users_count: -1,
            }
        })

        return result
    }
}


module.exports = DiscountService