const express = require('express');
const Router = express.Router();
const userCtl = require("../controllers/users")
Router.post('/signup', userCtl.signup)
Router.post("/login", userCtl.login)
Router.get("/testTokenParser", userCtl.testTokenParser)
Router.delete("/", userCtl.deleteUsr)
Router.put('/', userCtl.updateUsr)
Router.get('/', userCtl.getUsr)

module.exports = Router;
