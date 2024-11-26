const {removeComment, checkCommentExists} = require("../models/comments.models")

exports.deleteComment = (req,res,next) =>{
    const {comment_id} = req.params
    //console.log("im in the controller")
    removeComment(comment_id).then(()=>{
        
        res.status(204).send({})
    }).catch(next)
}