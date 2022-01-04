const sqlConnection = require("../services/sqlConnection");

function listProducts(data, cb) {
    var sql = "Select ID as productId, Name as name, Price as price FROM Products";
    var values = [];
    if(data.categoryId) {
        // if we want to filter based on the category
        sql += " WHERE CategoryID = ?";
        values.push(data.categoryId);
        if(data.minPrice) {
            sql += " AND Price >= ?";
            values.push(data.minPrice);
        }
    } else if(data.minPrice) {
        sql += " WHERE Price >= ?";
        values.push(data.minPrice); 
    } else if(data.maxPrice) {
        sql += " WHERE Price <= ?";
        values.push(data.maxPrice); 
    }
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    })
}

function addProduct(data, cb) {
    var sql = `INSERT INTO Products 
                (Name, Price, Description, categoryId, vendorId, createdAt, updatedAt)
                Values (? , ? , ? , ? , ? , now(), now())
        `;
    var values = [];
    values.push(data.name);
    values.push(data.price);
    values.push(data.description);
    values.push(data.categoryId);
    values.push(data.vendorId);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

module.exports = {listProducts, addProduct};