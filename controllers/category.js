const {RunSQL} = require("../utils/runSQL");
// 获取分类
const getCategory = (req, res) => {
  const {pageNumber, pageSize} = req.query;
  const params = [(pageNumber -  1) * pageSize, parseInt(pageSize)]
  let getCategorySql = `SELECT name FROM category LIMIT ?, ?`
  let getCategoryTotalSql = `SELECT FOUND_ROWS() as total FROM category WHERE is_deleted != '1'`
  RunSQL(getCategorySql, params).then(getCategoryList => {
    RunSQL(getCategoryTotalSql).then(cateGoryTotal => {
      res.send({
        status: 200,
        data: getCategoryList,
        total: cateGoryTotal[0]?.total ? cateGoryTotal[0]?.total : 0,
        message: "获取分类列表成功"
      })
    })
  }).catch(err => {
    res.send({
      status: 400,
      message: "获取分类列表失败"
    })
  })
}

// 添加分类
const addCategory = (req, res) => {
    const {name: categoryName} = req.body;
    const params = [categoryName]
    const insertCategorySql = `INSERT INTO category (category_name, is_deleted) VALUES (?, 0)`
    RunSQL(insertCategorySql, params).then(() => {
      res.send({
        status: 200,
        message: "添加分类成功"
      })
    }).catch(err => {
      console.error(err)
      res.send({
        status: 400,
        message: "添加分类失败"
      })
    })
}

// 删除分类
const removeCategory = (req, res) => {
  const {id} = req.query;
  const params = [id]
  const delCategorySql = "UPDATE category SET is_deleted = 1 WHERE id = ?"
  RunSQL(delCategorySql, params).then(() => {
    res.send({
      status: 200,
      message: "删除分类成功"
    })
  }).catch(err => {
    console.error(err)
    res.send({
      status: 400,
      message: "删除分类失败"
    })
  })
}

// 更新分类
const updateCategory = (req, res) => {
  const {id, name} = req.body;
  const params = [name, id]
  const updateCategorySql = "UPDATE category SET category_name = ? WHERE id = ?"
  RunSQL(updateCategorySql, params).then(() => {
    res.send({
      status: 200,
      message: "更新分类成功"
    })
  }).catch(err => {
    console.error(err)
    res.send({
      status: 400,
      message: "更新分类失败"
    })
  })
}


module.exports = {
  getCategory,
  addCategory,
  removeCategory,
  updateCategory
}
