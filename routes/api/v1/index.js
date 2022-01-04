var express = require('express');
const categoryController = require("../../../src/controllers/categoryController");
const productController = require("../../../src/controllers/productController");
var router = express.Router();

router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);

module.exports = router;