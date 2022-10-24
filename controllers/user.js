
const {RunSQL} = require("../utils/runSQL");
const {encrypt} = require("../utils/cipherCode");
const uuid = require("uuid")
const {db} = require("../common/sql");
// 用户注册
const signup = (req, res, next) => {
  const {account, password} = req.body;
  encrypt(password, function (encryptPassword) {
    const userNameIsOnlySql = `SELECT account FROM admin WHERE account = "${account}"`;
    const insertUserNameSql = `INSERT INTO admin (id, account, password, create_time, update_time) VALUES ("${uuid.v4()}", "${account}", "${encryptPassword}", ${new Date().getTime()}, ${new Date().getTime()})`;
    RunSQL(userNameIsOnlySql).then((queryRepeatUserList) => {
      if (!queryRepeatUserList.length) {
        db.query(insertUserNameSql, function (err, sqlResult) {
          if (err) {
            console.error('[注册用户失败[error]:', err.message)
            res.status(400).send({
              status: 400,
              message: "注册用户失败"
            });
            return
          }
          res.status(200).send({
            status: 200,
            message: '用户注册成功'
          })
        })
      }else {
        res.status(400).send({
          status: 400,
          message: "用户名重复"
        });
      }
    }).catch(err => {
      res.status(400).send({
        status: 400,
        message: err.message
      });
    })
  })
}

exports.signup = signup;
