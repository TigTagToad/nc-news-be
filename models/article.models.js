const db = require("../db/connection")


exports.fetchArticle = (article_id) => {
    let sqlQuery = `
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id ;
    
    `
   // HAVING articles.article_id = $1 use having after group by;
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

    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "not an id number"})
        }
      });
}

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) =>{
    const validSortBy = ["title", "topic", "author", "created_at", "votes", "article_img_url"];
    const validOrder = ["ASC", "DESC"]
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
    LEFT JOIN comments ON comments.article_id = articles.article_id `;

    const queryValues = [];

    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "bad request"})
    }
    if (!validOrder.includes(order.toUpperCase())) {
        return Promise.reject({status: 400, msg: "bad request"})
    }


    if(topic){
        sqlQuery += `WHERE topic = $1 `
        queryValues.push(topic)
    }
    
    sqlQuery += `
    GROUP BY 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url `

    if(sort_by){
            sqlQuery += `ORDER BY ${sort_by} ${order} `
        }

    return db.query(sqlQuery, queryValues).then(({ rows }) => {

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

exports.doesTopicExist = (topic) =>{
    //ask whether its better to query topics or articles
    let sqlQuery = "SELECT * FROM topics WHERE slug = $1";
    const queryValues = [topic];
 
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        
        if(!rows.length){
            return Promise.reject({status: 404, msg: "not found"})
        }
      });
}