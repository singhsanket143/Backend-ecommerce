const Product = require("../models/product");
const {
	httpCodes
} = require("../constants/backendConfig");

module.exports = {
	listProducts: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching products"
		};
		Product.listProducts(data, function (err, result) {
			if (err) {
				responseData.msg = "Error in fetching products";
				return res.status(httpCodes.internalServerError).send(responseData);
			}
			responseData.success = true;
			responseData.msg ="Successfully fetched products";
			responseData.products = result;
			return res.status(httpCodes.success).send(responseData);
		});
	},

	addProduct: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for adding product"
		};
		if (data.name && data.price && data.description && data.categoryId && data.vendorId) {
			Product.addProduct(data, function (err) {
				if (err) {
					responseData.msg = "Error in adding product";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully added product";
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

    getProductDetails: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching product details"
		};
		if (data.productId && data.userId) {
			Product.getProductDetails(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching product details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched product details";
				responseData.productDetails = result[0];
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	}
};