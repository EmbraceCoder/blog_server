let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');


// 配置全局变量 app.js作用域下所有文件都可以访问common中的db和RunSQL
// require(process.cwd() + '/common/sql.js');
// require(process.cwd() + '/common/utils.js');

// router

let app = express();

let usersRouter = require('./routes/users');

app.use(cors({
  "origin": "*",
  "credentials": true,
  "methods": "GET,POST,PUT,PATCH,DELETE"
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error');
// });

module.exports = app;
