const {RunSQL} = require("../utils/runSQL");
const {encrypt, decrypt} = require("../utils/cipherCode");
const {db} = require("../common/sql");
const { check, validationResult } = require("express-validator")
const {generateToken} = require("../utils/token");
const fs = require("fs")
const formidable = require("formidable");

// 用户注册
const signup = async (req, res, next) => {
  const {email, userName, password} = req.body;
  await check("email").notEmpty().withMessage("邮箱不能为空").run(req);
  await check("userName").notEmpty().withMessage("用户名不能为空").run(req);
  await check("password").notEmpty().withMessage("密码不能为空").run(req);
  const result = await validationResult(req)
  if (!result.isEmpty()) {
    res.send(
      {
        errors: result.array({ onlyFirstError: true }),
      }
    )
  }

  encrypt(password.trim(), function (encryptPassword) {
    const emailIsOnlySql = `SELECT email FROM sys_user WHERE email = "${email}"`;
    const insertAccountSql = `INSERT INTO sys_user (email, user_name, password, create_time, update_time, is_deleted) VALUES ("${email}", "${userName}", "${encryptPassword}", ${new Date().getTime()}, ${new Date().getTime()}, 0)`;
    RunSQL(emailIsOnlySql).then((queryRepeatUserList) => {
      if (!queryRepeatUserList.length) {
        db.query(insertAccountSql, function (err, sqlResult) {
          if (err) {
            console.error('[注册用户失败[error]:', err.message)
            res.send({
              status: 400,
              message: "注册用户失败"
            });
            return
          }
          res.send({
            status: 200,
            message: '用户注册成功'
          })
        })
      }else {
        res.send({
          status: 400,
          message: "账户已存在"
        });
      }
    }).catch(err => {
      res.send({
        status: 400,
        message: err.message
      });
    })
  })
}

// 用户登录
const login = async (req, res, next) => {
  const {email, password} = req.body

  await check("email").notEmpty().withMessage("邮箱不能为空").run(req);
  await check("password").notEmpty().withMessage("密码不能为空").run(req);

  const result = await validationResult(req)

  if (!result.isEmpty()) {
    res.send(
      {
        errors: result.array({ onlyFirstError: true }),
      }
    )
  }

  const userIsRegisteredSql = `SELECT id, email, user_name, password FROM sys_user WHERE email = "${email}" && is_deleted != '1'`
  RunSQL(userIsRegisteredSql).then(queryUserInfo => {
    if (queryUserInfo.length) {
      decrypt(queryUserInfo[0].password, function (decryptPwd) {
        if(password === decryptPwd) {
          res.send({
            status: 200,
            data: {
              id: queryUserInfo[0].id,
              email: queryUserInfo[0].email,
              userName: queryUserInfo[0]["user_name"]
            },
            token: `Bearer ${generateToken(queryUserInfo[0].id, queryUserInfo[0]["user_name"])}`,
            message: "登录成功"
          })
        }else {
          res.send({
            status: 400,
            message: "密码错误"
          })
        }
      })
    }else {
      res.send({
        status: 400,
        message: "用户未注册"
      })
    }
  })

}

// 删除用户
const deleteUsr = (req, res) => {
  const { id } = req.query
  const delUserSql = `UPDATE sys_user SET is_deleted = 1 WHERE id = '${id}'`
  RunSQL(delUserSql).then(() => {
    res.send({
      status: 200,
      message: "删除用户成功"
    })
  }).catch(err => {
    res.send({
      status: 400,
      message: "删除用户失败"
    })
  })
}

// 更新用户信息
const updateUsr = (req, res) => {
  const { id, userName, email} = req.body
  const updateUserSql = `UPDATE sys_user SET user_name = '${userName}', email = '${email}', update_time = ${new Date().getTime()} WHERE id = '${id}'`
  RunSQL(updateUserSql).then(() => {
    res.send({
      status: 200,
      message: "更新用户成功"
    })
  }).catch(err => {
    console.log(err)
    res.send({
      status: 400,
      message: "更新用户失败"
    })
  })
}

const getUsr = (req, res) => {
  const { pageNumber, pageSize } = req.query
  const params = [ ((pageNumber - 1) * pageSize) , parseInt(pageSize)]
  const getUsersSql = `SELECT email, user_name, create_time, update_time FROM sys_user WHERE is_deleted != "1" LIMIT ?,?`
  const getUserTotalSql = `SELECT FOUND_ROWS() as total FROM sys_user WHERE is_deleted != "1"`
  RunSQL(getUsersSql, params).then(getUserList => {
    RunSQL(getUserTotalSql).then(userTotal => {
      console.log(userTotal)
      res.send({
        status: 200,
        data: getUserList,
        total: userTotal[0]?.total ? userTotal[0]?.total : 0,
        message: "查询用户列表成功"
      })
    })


  }).catch(err => {
    console.log(err)
    res.send({
      status: 400,
      message: "查询用户失败"
    })
  })
}

// 用户头像上传
const uploadUserAvatar = (req, res) => {
  const userInfo = req.auth;
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.send({
        status: 400,
        message: "上传头像失败"
      })
    }
    const user_id = parseInt(userInfo.uid);
    const fullFileName = userInfo.userName + user_id + files.file.originalFilename;// 拼接图片名称：用户名+用户ID+图片名称
    fs.writeFileSync(`public/images/${fullFileName}`, fs.readFileSync(files.file.filepath)); // 存储图片到public静态资源文件夹下
    const updateUserAvatar = `UPDATE sys_user SET avatar = ? WHERE id = ?`
    RunSQL(updateUserAvatar, [fullFileName, user_id]).then((result) => {
      res.send({
        status: 200,
        data: {
          avatar: `/public/images/${fullFileName}`
        },
        message: "上传用户头像成功"
      })
    }).then(err => {
      res.send({
        status: 400,
        message: "上传用户头像失败"
      })
    })
  })
}




module.exports = {
  signup,
  login,
  deleteUsr,
  updateUsr,
  getUsr,
  uploadUserAvatar
}
