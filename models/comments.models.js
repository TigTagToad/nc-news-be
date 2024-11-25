const db = require("../db/connection")

exports.fetchComments = (article_id) =>{
    let sqlQuery = `SELECT * FROM comments 
                    WHERE article_id = $1`
    const queryValues = [article_id]
    return db.query(sqlQuery, queryValues).then(({rows})=>{
        return rows
    })
}