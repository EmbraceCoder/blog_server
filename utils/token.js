const jwt = require("jsonwebtoken")
const config = require("../common/config");
const { expressjwt: expressJwt} = require("express-jwt")
const blackList = [
  "/api/users/login",
  "/api/users/signup"
]



function generateToken(uid, userName) {
  const token = jwt.sign({
    uid,
    userName
  }, config.secretKey, {
    expiresIn: config.expiresIn
  })
  return token
}

const jwtAuth = expressJwt({
  secret: config.secretKey,
  algorithms: ['HS256']
}).unless({
  path: blackList
})


module.exports = {
  generateToken,
  jwtAuth
}
