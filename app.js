const express = require("express");
const app = express();
const {getEndpoints} = require("./controllers/endpointsController")

app.use(express.json());

app.get("/api", getEndpoints)

module.exports = app