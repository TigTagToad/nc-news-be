const usersRouter = require("express").Router()
const {
    getUsers,
    getUserByUserName

} = require("../controllers/users.controllers")

usersRouter
    .route("/")
    .get(getUsers)

usersRouter
    .route("/:username")
    .get(getUserByUserName)

module.exports = usersRouter