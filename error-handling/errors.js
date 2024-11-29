
exports.catchInvalidEndpoints = (req, res) =>{

    res.status(404).send({msg: "not found"})
}



exports.postgresErrorHandler = (err, req, res, next) => {
    //console.log(err)
    if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
        res.status(400).send({msg: "bad request"})
    } else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {

    if (err.status && err.msg) {
        //console.log(err, "in custom error handler")
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err, "in server error handler")
    res.status(500).send({msg: "Internal server error"})
}