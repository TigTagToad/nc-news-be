const express = require("express");
const app = express();
const {getEndpoints} = require("./controllers/endpoints.controllers")
const {getArticles,getArticle,getCommentsByArticleId,postComment} = require("./controllers/article.controllers")
const {getTopics} =  require("./controllers/topics.controllers.js")
const {postgresErrorHandler, customErrorHandler, serverErrorHandler} = require("./error-handling/errors")

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


app.get("/api/topics", getTopics)

app.post("/api/articles/:article_id/comments", postComment);




app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app