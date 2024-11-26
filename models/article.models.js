const db = require("../db/connection")


exports.fetchArticle = (article_id) => {
    let sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
    const queryValues = [article_id];
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if(rows.length === 0 ){
            return Promise.reject({status: 404, msg: "not an id number"})
        }
        return rows[0];
      });
};

exports.checkArticleExists = (article_id)=>{
    let sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
    const queryValues = [article_id];
    if(!Number(article_id)){
        return Promise.reject({status: 400, msg: "bad request"})
    }
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "not an id number"})
        }
      });
}

exports.fetchArticles = (sort_by = "created_at", order = "desc") =>{
    const validSortBy = ["title", "topic", "author", "created_at", "votes", "article_img_url"];

    let sqlQuery = `
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM Articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url `;
    const queryValues = [];

    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "bad request"})
    }
    if(sort_by){
        sqlQuery += `ORDER BY ${sort_by} ${order}`
    }
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if(rows.length === 0 ){
            return Promise.reject({status: 400, msg: "bad request"})
        }
        return rows;
      });
}

exports.updateVotes = (patchReq, article_id) =>{
    const UpdateValue = patchReq.inc_votes

    
    return db.query(` 
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING * ;
        `,[UpdateValue, article_id]).then(({rows})=>{
            if(!rows.length){
                return Promise.reject({status: 400, msg: "bad request"})
            }
            //console.log(rows)
            return rows[0]
        })
}
