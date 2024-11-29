
const {removeComment, updateCommentVotes, checkCommentExists} = require("../models/comments.models")

exports.deleteComment = (req,res,next) =>{
    const {comment_id} = req.params
    //console.log("im in the controller")
    removeComment(comment_id).then(()=>{
        
        res.status(204).send({})
    }).catch(next)
}

exports.patchComment = (req, res, next) => {
    const {comment_id} = req.params
    const patchReq = req.body
    updateCommentVotes(comment_id, patchReq).then((comment)=>{
        res.status(200).send({comment})
    }).catch(next)

}