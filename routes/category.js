const express = require('express');
const Router = express.Router();
const categoryCtl = require("../controllers/category")
Router.get("/", categoryCtl.getCategory);
Router.post("/", categoryCtl.addCategory);
Router.delete("/", categoryCtl.removeCategory);
Router.put("/", categoryCtl.updateCategory);

module.exports = Router;
