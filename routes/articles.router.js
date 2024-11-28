const articlesRouter = require("express").Router()
const {
    getArticles,
    getArticle,
    getCommentsByArticleId,
    postComment,
    patchArticle
    } = require("../controllers/article.controllers")


articlesRouter
  .route("/")
  .get(getArticles)

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articlesRouter