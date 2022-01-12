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
                                orderId: order[0].ID
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

function editOrder(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid params for updating order details"
    };
    if(data.orderId && data.userId && data.productId) {
        Product.getProductDetails(data, function(err, product) {
            if(err) {
                console.log(err);
                return res.status(500).send(responseData);
            }
            OrderDetails.getOrderDetails(data, function(err1, orderDetail) {
                if(data.remove) {
                    if(err1) {
                        console.log(err1);
                        return res.status(500).send(responseData);
                    }
                    OrderItem.editOrderItem(data, function(err2, orderItem) {
                        if(err2) {
                            console.log(err2);
                            return res.status(500).send(responseData);
                        }
                        data.total = orderDetail[0].total - (product[0].price * parseInt(data.quantity, 10));
                        OrderDetails.editOrder(data, function(err3, updatedOrder) {
                            if(err3) {
                                console.log(err3);
                                return res.status(500).send(responseData);
                            }
                            responseData.success = true;
                            responseData.msg = "Successfully updated order";
                            return res.status(200).send(responseData);
                        })
                    })
                } else {
                    OrderItem.editOrderItem(data, function(err2, orderItem) {
                        if(err2) {
                            console.log(err2);
                            return res.status(500).send(responseData);
                        }
                        let productTotal = 0;
                        orderDetail.forEach(item => {
                            if(item.productId == data.productId) {
                                productTotal += item.price * item.quantity;
                            }
                        });
                        data.total = orderDetail[0].total - productTotal + (parseInt(data.quantity, 10)*product[0].price);
                        OrderDetails.editOrder(data, function(err3, updatedOrder) {
                            if(err3) {
                                console.log(err3);
                                return res.status(500).send(responseData);
                            }
                            responseData.success = true;
                            responseData.msg = "Successfully updated order";
                            return res.status(200).send(responseData);
                        });
                    })
                }
            })
        })
    } else {
        return res.status(400).send(responseData);
    }
}

module.exports = {getOrderDetails, createOrder, editOrder};