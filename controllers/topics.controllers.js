const { fetchTopics } = require("../models/topics.models") 

exports.getTopics = (req,res,next) => {
//console.log("in controller")
fetchTopics().then((rows)=>{
    //console.log(rows)
    res.status(200).send({topics: rows})

}).catch(next)
}