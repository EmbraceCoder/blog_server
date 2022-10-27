const {db} = require("../common/sql");

async function RunSQL(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      resolve(result)
    })
  })
}

exports.RunSQL = RunSQL;
