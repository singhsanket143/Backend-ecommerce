const OrderDetails = require("../models/OrderDetails");


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

module.exports = {getOrderDetails};