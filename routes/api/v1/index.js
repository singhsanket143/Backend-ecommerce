var express = require('express');
const categoryController = require("../../../src/controllers/categoryController");
const orderDetailsController = require('../../../src/controllers/orderController');
const productController = require("../../../src/controllers/productController");
const userController = require("../../../src/controllers/userController");
var router = express.Router();

router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);

router.post("/product/add", 
userController.isAuthenticated, 
productController.addProduct);

router.post("/order/details", orderDetailsController.getOrderDetails);
router.post("/order/add", orderDetailsController.createOrder);
router.post("/order/edit", orderDetailsController.editOrder);

router.post("/user/signup", userController.signup);
router.post("/user/login", userController.login);

module.exports = router;