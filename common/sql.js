const mysql = require('mysql');   //引入了新的npm第三方包，在此之前先执行npm install mysql or yarn add mysql

const configObj = require('./config')

const db = mysql.createConnection({
  ...configObj
})

db.connect((err) => {
  if (err) {
    console.log('数据库连接失败:' + err.message);
    return;
  };
  console.log('数据库连接成功！')
})

exports.db = db; //使用node全局变量，在appjs中引入后app作用域都可访问，用于操作数据库

