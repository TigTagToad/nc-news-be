const db = require("../db/connection")

exports.fetchUsers = () => {
    return db.query(`
        SELECT * FROM users
        ;
        `).then(({ rows }) => {
        return rows;
      });
}

exports.fetchUser = (username) =>{
  const sqlQuery = `
    SELECT * FROM users
    WHERE username = $1;
    `
  const queryValues = [username]
  return db.query(sqlQuery, queryValues).then(({rows})=>{
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "not found"})
    }
    return rows[0];
  })
}