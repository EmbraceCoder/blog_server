const {db} = require("../common/sql");

async function RunSQL(sql) {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result)
    })
  })
}

exports.RunSQL = RunSQL;
