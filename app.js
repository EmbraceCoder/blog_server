let createError = require('http-errors');
let express = require('express');
let path = require('path');
let fs = require("fs");
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let usersRouter = require('./routes/users');
let categoryRouter = require('./routes/category');
const { jwtAuth } = require("./utils/token");
let accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'), { flags: 'a', encoding: 'utf8' });


app.use(cors({
  "origin": "*",
  "credentials": true,
  "methods": "GET,POST,PUT,PATCH,DELETE"
}))

// 暴露静态资源
app.use("/public", express.static("public"))

app.use(jwtAuth);
app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', usersRouter);
app.use('/api/category', categoryRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
