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

exports.addComment = (comment) =>{
    const {body, author, votes, article_id, created_at} = comment
    return db.query(`
        INSERT INTO comments 
        (body, author, votes, article_id,created_at) 
        VALUES ($1,$2,$3,$4,$5) RETURNING * ;
        `, [body, author, votes, article_id, created_at]).then(({rows})=>{
            //console.log(rows)
            return rows[0];
        })


}

exports.removeComment = (comment_id) =>{

    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING * ;
        `,[comment_id]).then(({rows})=>{
            //console.log("im in the model")
            //console.log(rows)
            if(rows.length===0){
                return Promise.reject({status: 404, msg: "not found"})
            }

        })
}

exports.checkCommentExists = (comment_id) => {
    let sqlQuery = `
    SELECT * FROM comments 
    WHERE comment_id = $1 `;
    const queryValues = [comment_id];
    
    // if(!Number(comment_id)){
    //     //console.log("rejected comment id")
    //     return Promise.reject({status: 400, msg: "bad request"})
    // }
    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        //console.log(rows, "<--in model")
        if(!rows.length){
            return Promise.reject({status: 404, msg: "not an id number"})
        }
      });
}

exports.updateCommentVotes = (comment_id, patchReq) =>{
    const UpdateValue = patchReq.inc_votes

    
    return db.query(` 
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING * ;
        `,[UpdateValue, comment_id]).then(({rows})=>{
            if(rows.length===0){
                return Promise.reject({status: 404, msg: "not found"})
            }
            //console.log(rows)
            return rows[0]
        })
}