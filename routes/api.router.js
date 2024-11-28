const apiRouter = require("express").Router();
const articlesRouter = require("./articles.router");
const usersRouter = require("./users.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const {getEndpoints} = require("../controllers/endpoints.controllers")

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.get("/", getEndpoints);


module.exports = apiRouter