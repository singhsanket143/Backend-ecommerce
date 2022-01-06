const sqlConnection = require("../services/sqlConnection");

function listOrderDetails(data, cb) { // cb is representing the functionality of caller
    var sql = "select * from ecommercedb.Users U INNER JOIN ecommercedb.OrderDetails O ON U.ID = O.UserID INNER JOIN ecommercedb.OrderItems OI ON O.ID = OI.OrderID INNER JOIN ecommercedb.Products P ON P.ID = OI.ProductID where U.ID = ?";
    var values = []; // because the above sql doesn't need any data
    values.push(data.user_id);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

module.exports = {listOrderDetails};

/*
select * from ecommercedb.Users U INNER JOIN ecommercedb.OrderDetails O ON U.ID = O.UserID INNER JOIN ecommercedb.OrderItems OI ON O.ID = OI.OrderID INNER JOIN ecommercedb.Products P ON P.ID = OI.ProductID;
*/