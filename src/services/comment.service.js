'use strict'

const { NotFoundError } = require("../core/error.response")
const commentModel = require("../models/comment.model")
const { convertToObjectIdMongodb } = require("../utils")
const { findProduct } = require("./product.service.xxx")

/**
 key features: Comment Service
 + add comment [user, shop]
 + get a list of comment [user, shop]
 + delete a comment [user | shop | admin]
 */

class CommentService {

    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.comment_right
            // update comment
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
            }, 'comment_right', { sort: { comment_right: -1 } })

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()

        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0,
    }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Not found')

            const comment = await commentModel.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right },
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({
                comment_left: 1,
            })

            return comment
        }

        const comment = await commentModel.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: parentCommentId,
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1,
        }).sort({
            comment_left: 1,
        })

        return comment
    }

    static async deleteComment({
        commentId,
        productId
    }) {
        // check product exist in db
        const foundProduct = await findProduct({
            product_id: productId
        })
        if (!foundProduct) throw new NotFoundError('not found')

        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // 2 tinh width
        const width = rightValue - leftValue + 1

        // xoa tat ca commentId con
        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })

        // 4 cap nhap gia tri left va right con lai
        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })

        return true

    }
}


module.exports = CommentService