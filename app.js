const express = require("express");
const app = express();
const {getEndpoints} = require("./controllers/endpointsController")
const {getArticle} = require("./controllers/articleController")
const {getTopics} =  require("./controllers/topicsController")
const {postgresErrorHandler, customErrorHandler, serverErrorHandler} = require("./error-handling/errors")

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);


app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)



app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app