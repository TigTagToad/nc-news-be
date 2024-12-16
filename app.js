const express = require("express");
const apiRouter = require("./routes/api.router.js");
const app = express();
const {postgresErrorHandler, customErrorHandler, serverErrorHandler, catchInvalidEndpoints} = require("./error-handling/errors")
const cors = require('cors');

app.use(cors());

app.use(express.json());



app.use("/api", apiRouter);

app.all("/*", catchInvalidEndpoints); 

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);




module.exports = app