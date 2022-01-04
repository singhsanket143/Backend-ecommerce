var express = require('express');
const categoryController = require("../../../src/controllers/categoryController");

var router = express.Router();

router.post("/category/all", categoryController.listCategories);

module.exports = router;