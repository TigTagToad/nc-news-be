const commentsRouter = require("express").Router()
const {deleteComment, patchComment} = require("../controllers/comment.controllers.js")
const comments = require("../db/data/test-data/comments.js")

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)
    .patch(patchComment)

module.exports = commentsRouter
