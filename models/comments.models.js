const db = require("../db/connection")

exports.fetchComments = (article_id, sort_by = "created_at", order = "DESC") =>{
    const validSortBy = ["created_at", "votes", "body", "author", "article_id", "comment_id"];
    let sqlQuery = `SELECT * FROM comments 
                    WHERE article_id = $1 `
    const queryValues = [article_id]

    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "bad request"})
    }
    if(sort_by){
        sqlQuery += `ORDER BY ${sort_by} ${order}`
    }
    
    return db.query(sqlQuery, queryValues).then(({rows})=>{
        return rows
    })
}