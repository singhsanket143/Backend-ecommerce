const Product = require("../models/product");

function listProducts(req, res) {
    // console.log(req);
    let data = req.body;
    //console.log(typeof req.body.categoryId);
    Product.listProducts(data, function(err, result) {
        if(err) {
            console.log(err);
            return res.status(500).send({message: "Not ok!"});
        }
        return res.status(200).send({
            success: true,
            msg: "Successfully fetched products",
            products: result
        })
    })
}

function addProduct(req, res) {
    let data = req.body;
    if(data.name && data.price && data.description && data.categoryId && data.vendorId) {
        Product.addProduct(data, function(err, result) {
            if(err) {
                console.log(err);
                return res.status(500).send({message: "Not ok!"});
            }
            return res.status(200).send({
                success: true,
                msg: "Successfully added products",
                products: result
            })
        })
    }
}

module.exports = {listProducts, addProduct};