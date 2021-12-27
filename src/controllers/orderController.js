const OrderDetail = require("../models/orderDetail");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const {
	httpCodes
} = require("../constants/backendConfig");

module.exports = {
	createOrder: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for creating order"
		};
		if (data.productId && data.userId) {
			data.quantity = 1;
			Product.getProductDetails(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in creating order";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				OrderDetail.findOrderByUser(data, function (err1, result1) {
					if (err1) {
						responseData.msg = "Error in creating order";
						return res.status(httpCodes.internalServerError).send(responseData);
					}
					if (result1.length > 0) {
						data.total = parseInt(result1[0].total, 10) + parseInt(result[0].price, 10);
						data.orderId = result1[0].ID;
						OrderDetail.editOrder(data, function (err2, result2) {
							if (err2) {
								responseData.msg = "Error in creating order";
								return res.status(httpCodes.internalServerError).send(responseData);
							}
							data.orderId = result1[0].ID;
							OrderItem.addOrderItem(data, function (err3) {
								if (err3) {
									responseData.msg = "Error in creating order";
									return res.status(httpCodes.internalServerError).send(responseData);
								}
								responseData.success = true;
								responseData.msg ="Successfully created order";
								responseData.orderDetails = {
									orderId: result1[0].ID
								}
								return res.status(httpCodes.success).send(responseData);
							});
						});
					} else {
						data.total = parseInt(result[0].price, 10);
						OrderDetail.addOrder(data, function (err2, result2) {
							if (err2) {
								responseData.msg = "Error in creating order";
								return res.status(httpCodes.internalServerError).send(responseData);
							}
							data.orderId = result2.insertId;
							OrderItem.addOrderItem(data, function (err3) {
								if (err3) {
									responseData.msg = "Error in creating order";
									return res.status(httpCodes.internalServerError).send(responseData);
								}
								responseData.success = true;
								responseData.msg ="Successfully created order";
								responseData.orderDetails = {
									orderId: result2.insertId
								}
								return res.status(httpCodes.success).send(responseData);
							});
						});
					}
				});
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getOrderDetails: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching order details"
		};
		if (data.userId) {
			OrderDetail.getOrderDetails(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching order details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched order details";
				if(result.length > 0) {
					responseData.orderDetails = {
						orderId: result[0].orderId,
						total: result[0].total,
						products: []
					}
					result.forEach((item) => {
						const productObj = {
							price: item.price,
							name: item.productName,
							quantity: item.quantity,
							productId: item.productId
						};
						responseData.orderDetails.products.push(productObj);
					});
				}
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	editOrder: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for updating order details"
		};
		if(data.payment) {
			responseData.msg = "Invalid params for confirming payment";
		}
		if (data.orderId && data.userId) {
			if(data.payment) {
				OrderDetail.editOrder(data, function(err){
					if (err) {
						responseData.msg = "Error in confirming payment";
						return res.status(httpCodes.internalServerError).send(responseData);
					}
					responseData.success = true;
					responseData.msg = "Successfully updated order payment";
					return res.status(httpCodes.success).send(responseData);
				});
			} else {
				Product.getProductDetails(data, function(err, result){
					if (err) {
						responseData.msg = "Error in updating order details";
						return res.status(httpCodes.internalServerError).send(responseData);
					}
					OrderDetail.getOrderDetails(data, function(err1, result1){
						if (err1) {
							responseData.msg = "Error in updating order details";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						if(data.remove) {
							OrderItem.deleteOrderItem(data, function(err2){
								if (err2) {
									responseData.msg = "Error in updating order details";
									return res.status(httpCodes.internalServerError).send(responseData);
								}
								data.total = result1[0].total - (result[0].price * parseInt(data.quantity, 10));
								OrderDetail.editOrder(data, function(err3){
									if (err3) {
										responseData.msg = "Error in updating order details";
										return res.status(httpCodes.internalServerError).send(responseData);
									}
									responseData.success = true;
									responseData.msg = "Successfully updated order details";
									return res.status(httpCodes.success).send(responseData);
								});
							});
						} else {
							OrderItem.editOrderItem(data, function(err2){
								if (err2) {
									responseData.msg = "Error in updating order details";
									return res.status(httpCodes.internalServerError).send(responseData);
								}
								let productTotal = 0
								result1.forEach((item) => {
									if(item.productId == data.productId) {
										productTotal += (item.price * item.quantity);
									}
								});
								data.total = result1[0].total - productTotal + (parseInt(data.quantity, 10) * result[0].price);
								OrderDetail.editOrder(data, function(err3){
									if (err3) {
										responseData.msg = "Error in updating order details";
										return res.status(httpCodes.internalServerError).send(responseData);
									}
									responseData.success = true;
									responseData.msg = "Successfully updated order details";
									return res.status(httpCodes.success).send(responseData);
								});
							});
						}
					});
				});
			}
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	}
};