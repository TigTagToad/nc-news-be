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

exports.fetchArticles = (sort_by = "created_at", order = "desc") =>{
    const validSortBy = ["title", "topic", "author", "created_at", "votes", "article_img_url"];

    let sqlQuery = `SELECT author, title, article_id, topic, created_at, votes, article_img_url
                   FROM Articles `;
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

