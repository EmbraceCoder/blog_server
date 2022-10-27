const express = require('express');
const Router = express.Router();
const userCtl = require("../controllers/users")
Router.post('/signup', userCtl.signup)
Router.post("/login", userCtl.login)
Router.delete("/", userCtl.deleteUsr)
Router.put('/', userCtl.updateUsr)
Router.get('/', userCtl.getUsr)
Router.post("/upload", userCtl.uploadUserAvatar)

module.exports = Router;
