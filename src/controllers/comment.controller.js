'use strict'

const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'createComment success',
            metaData: await CommentService.createComment({
                ...req.body,
            })
        }).send(res)

    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'getCommentsByParentId success',
            metaData: await CommentService.getCommentsByParentId({
                ...req.query,
            })
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleteComment success',
            metaData: await CommentService.deleteComment({
                ...req.body,
            })
        }).send(res)
    }

}

module.exports = new CommentController()