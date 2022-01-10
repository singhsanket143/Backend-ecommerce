const OrderDetails = require("../models/OrderDetails");
const Product = require("../models/product");
const OrderItem = require("../models/orderItem");
function createOrder(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid params for creating order"
    };
    if(data.userId && data.productId) {
        data.quantity = 1;
        Product.getProductDetails(data, function(err, product) {
            if(err) {
                console.log("error in fetching products",err);
                responseData.msg = "Error in creating the order";
                return res.status(500).send(responseData);
            }
            OrderDetails.findOrderByUser(data, function (err1, order) {
                if(err1) {
                    console.log("error in finding user order",err);
                    responseData.msg = "Error in creating the order";
                    return res.status(500).send(responseData);
                }
                if(order.length > 0) {
                    data.total = parseInt(order[0].total, 10) + parseInt(product[0].price, 10);
                    data.orderId = order[0].ID;
                    OrderDetails.editOrder(data, function (err2, orderDetail) {
                        if(err2) {
                            console.log("error in feditting order",err);
                            responseData.msg = "Error in creating the order";
                            return res.status(500).send(responseData);
                        }
                        OrderItem.addOrderItem(data, function (err3, orderItem) {
                            if(err3) {
                                console.log("error in adding orderitem",err);
                                responseData.msg = "Error in creating the order";
                                return res.status(500).send(responseData);
                            }
                            responseData.msg = "Successfully created an order";
                            responseData.success = true;
                            responseData.orderDetails = {
                                orderId: order[0].Id
                            }
                            return res.status(200).send(responseData);
                        })
                    });
                } else {
                    data.total = parseInt(product[0].price, 10);
                    OrderDetails.addOrder(data, function(err2, orderDetail) {
                        if(err2) {
                            console.log("error in adding new order",err);
                            responseData.msg = "Error in creating the order";
                            return res.status(500).send(responseData);
                        }
                        //console.log()
                        data.orderId = orderDetail.insertId;
                        OrderItem.addOrderItem(data, function (err3, orderItem) {
                            if(err3) {
                                console.log("error in adding orderitem",err);
                                responseData.msg = "Error in creating the order";
                                return res.status(500).send(responseData);
                            }
                            responseData.msg = "Successfully created an order";
                            responseData.success = true;
                            responseData.orderDetails = {
                                orderId: orderDetail.insertId
                            }
                            return res.status(200).send(responseData);
                        })
                    })
                }
            })
        })
    } else {
        return res.status(400).send({message: "Invalid data"});
    }
}

function getOrderDetails(req, res) {
    let data = req.body;
    if(data.user_id) {
        OrderDetails.listOrderDetails(data, function (err, result) {
            if(err) {
                console.log(err);
                return res.status(500).send({message: "Not ok!"});
            }
            return res.status(200).send({
                success: true,
                msg: "Successfully fetched order details",
                orderDetails: result
            })
        })
    }
}

module.exports = {getOrderDetails, createOrder};