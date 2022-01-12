const productModel = require("../../src/models/product");
const productController = require("../../src/controllers/productController");
const { mockRequest, mockResponse } = require('../mocker');
const jestMock = require('jest-mock');


const testPayload = [
    {
        "id": 1,
        "name": "Sony Bravia",
        "price": 100000
    },
    {
        "id": 2,
        "name": "Samsung s10",
        "price": 50000
    }
];

test('The product controller should return all products', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(productModel, 'listProducts').mockImplementation((data, cb) => {
        cb(null, testPayload);
    });
    await productController.listProducts(req, res);
    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
        success: true,
        msg: "Successfully fetched products",
        products: testPayload
    })
});

test('The product controller returns error on all product listing', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(productModel, 'listProducts').mockImplementation((data, cb) => {
        cb(new Error("This is an error"), null);
    });

    await productController.listProducts(req, res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({message: "Not ok!"});
});