const { mockRequest, mockResponse } = require('../mocker');
const jestMock = require('jest-mock');
const orderDetail = require('../../src/models/OrderDetails');
const orderItem = require('../../src/models/orderItem');
const productModel = require('../../src/models/product');
const orderController = require('../../src/controllers/orderController');

const productPayload = [{
    name: "Sony bravia",
    price: 100000,
    description: "good"
}]

const orderPayload = [{ID: 1, total: 100000}];

test('order controller should return bad request', async () => {
    const req = mockRequest();
    req.body = {
        userId: 1
    };
    const res = mockResponse();

    await orderController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        message: "Invalid data"
    });
});


test('order controller should return error on create order', async () => {
    const req = mockRequest();
    req.body = {
        userId: 1,
        productId: 1
    };
    const res = mockResponse();
    const consoleSpy = jestMock.spyOn(console, 'log').mockImplementation();
    const spy = jestMock.spyOn(productModel, 'getProductDetails').mockImplementation((data, cb) => {
        cb(new Error("this is an error"), null);
    })

    await orderController.createOrder(req, res);
    expect(spy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
        msg: "Error in creating the order",
        success: false,
    });
});

test('Order controller should create order', async () => {
    const productSpy = jestMock.spyOn(productModel, 'getProductDetails').mockImplementation((data, cb) => {
        cb(null, productPayload);
    });
    const findOrderSpy = jestMock.spyOn(orderDetail, 'findOrderByUser').mockImplementation((data, cb) => {
        cb(null, orderPayload);
    });
    const editOrderSpy = jestMock.spyOn(orderDetail, 'editOrder').mockImplementation((data, cb) => {
        cb(null, null);
    });
    const addOrderSpy = jestMock.spyOn(orderItem, 'addOrderItem').mockImplementation((data, cb) => {
        cb(null, null);
    });
    const req = mockRequest();
    req.body = {
        userId: 1,
        productId: 1
    };
    const res = mockResponse();
    await orderController.createOrder(req, res);
    expect(productSpy).toHaveBeenCalled();
    expect(findOrderSpy).toHaveBeenCalled();
    expect(editOrderSpy).toHaveBeenCalled();
    expect(addOrderSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
        success: true,
        msg: "Successfully created an order",
        orderDetails: {
            orderId: orderPayload[0].ID
        }
    });
});



