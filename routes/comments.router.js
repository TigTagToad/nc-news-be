const commentsRouter = require("express").Router()
const {deleteComment} = require("../controllers/comment.controllers.js")

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)


module.exports = commentsRouter
