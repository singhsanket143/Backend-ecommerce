const Category = require("../models/category");
const {
	httpCodes
} = require("../constants/backendConfig");

module.exports = {
	listCategories: function (req, res) {
		var responseData = {
			success: false,
			msg: "Error in fetching categories"
		};
		Category.listCategories(function (err, result) {
			if (err) {
				return res.status(httpCodes.internalServerError).send(responseData);
			}
			responseData.success = true;
			responseData.msg ="Successfully fetched categories";
			responseData.categories = result;
			return res.status(httpCodes.success).send(responseData);
		});
	}
};