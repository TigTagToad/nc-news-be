const { fetchArticle, fetchArticles } = require("../models/article.models.js");
const { fetchComments } = require("../models/comments.models.js");

exports.getArticle = (req,res,next) =>{
    const {article_id} = req.params
    //console.log(article_id)
    fetchArticle(article_id).then((article)=>{
        res.status(200).send({article})
    }).catch(next)
};

exports.getArticles = (req, res, next) =>{
    
    fetchArticles().then((articles)=>{
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

    res.status(200).send({articles})
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