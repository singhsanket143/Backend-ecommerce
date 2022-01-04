const Product = require("../models/product");

function listProducts(req, res) {
    let data = req.body;
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

module.exports = {listProducts};