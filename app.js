const express = require("express");
const apiRouter = require("./routes/api.router.js");
const app = express();
const {postgresErrorHandler, customErrorHandler, serverErrorHandler} = require("./error-handling/errors")

app.use(express.json());
app.use("/api", apiRouter);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);




module.exports = app