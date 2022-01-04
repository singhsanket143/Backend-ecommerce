const sqlConnection = require("../services/sqlConnection");

function listProducts(data, cb) {
    var sql = "Select ID as productId, Name as name, Price as price FROM Products";
    var values = [];
    if(data.categoryId) {
        // if we want to filter based on the category
        sql += " WHERE CategoryID = ?";
        values.push(data.categoryId);
    }
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    })
}

module.exports = {listProducts};