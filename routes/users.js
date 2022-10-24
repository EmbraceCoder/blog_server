var express = require('express');
var router = express.Router();
const userCtl = require("../controllers/user")

router.post('/signup', userCtl.signup)

module.exports = router;
