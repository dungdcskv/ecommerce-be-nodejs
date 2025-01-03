'use strict'

const { BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountCodeUnSelect } = require("../models/repositories/discount.repo")
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
            type, value, max_uses, max_value, uses_count, max_uses_per_user
        } = payload

        // kiem tra
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code ha expried')
        }

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
            discount_code: type,
            discount_type: code,
            discount_value: value,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_max_value: max_uses,
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
        code, shopId, userId, limit, page
    }) {
        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exist')
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
}


module.exports = {
    findByEmail
}