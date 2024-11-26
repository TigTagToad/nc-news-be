const { fetchArticle, fetchArticles, checkArticleExists, updateVotes, doesTopicExist} = require("../models/article.models.js");
const { fetchComments, addComment} = require("../models/comments.models.js");

exports.getArticle = (req,res,next) =>{
    const {article_id} = req.params
    //console.log(article_id)
    fetchArticle(article_id).then((article)=>{
        res.status(200).send({article})
    }).catch(next)
};

exports.getArticles = (req, res, next) =>{
    const {sort_by, order, topic} = req.query
    let promises = [fetchArticles(sort_by, order, topic)]
    if(topic){
        promises.push(doesTopicExist(topic))
    }
    Promise.all(promises).then((articles)=>{
    //dont use promises alas
    // const commentPromises = articles.map((article)=>{
    //     return fetchComments(article.article_id).then((comments)=>{
    //          return {
    //             ...article,
    //             comment_count:  comments.length}
    //     })
    // })
    // Promise.all(commentPromises).then((articlesWithComments) => {
    //     res.status(200).send({articles: articlesWithComments})
    // })
    //console.log(articles)
    res.status(200).send({articles: articles[0]})
    }).catch(next)
}

exports.getCommentsByArticleId = (req,res,next) =>{
    const {article_id} = req.params
    fetchArticle(article_id).then(()=>{
        
       return fetchComments(article_id).then((comments)=>{
            //console.log(comments)
            res.status(200).send({comments})
        })
    }).catch(next)
   

}

exports.postComment = (req,res,next) =>{
    const {article_id} = req.params
    const postedComment = req.body
    const created_at = new Date ();
    const comment = {article_id, created_at,votes: 0,...postedComment}
    const promises = [checkArticleExists(article_id),addComment(comment)]

    Promise.all(promises).then((comment)=>{
        
        res.status(201).send({comment: comment[1]})
    }).catch(next)

}

exports.patchArticle = (req,res,next) =>{
    const {article_id} = req.params
    const patchReq = req.body

    const promises = [checkArticleExists(article_id),updateVotes(patchReq,article_id)]

    Promise.all(promises).then((updatedArticle)=>{
        res.status(200).send({article: updatedArticle[1]})
    }).catch(next)
}
