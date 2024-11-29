const articlesRouter = require("express").Router()
const {
    getArticles,
    getArticle,
    getCommentsByArticleId,
    postComment,
    patchArticle,
    postArticle
    } = require("../controllers/article.controllers")


articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articlesRouter