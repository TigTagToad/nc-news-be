
exports.catchInvalidEndpoints = (err, req, res, next) =>{
    console.log("helloooo ")
if(err){
    res.status(404).send({msg: "not found"})

}else{
    next(err)
}
}



exports.postgresErrorHandler = (err, req, res, next) => {
    //console.log(err)
    if (err.code === "22P02" || err.code === "23502") {
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