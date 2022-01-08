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

function getProductDetails(data, cb) {
    var sql = ` SELECT p.Name as name, p.Price as price, p.Description as description, if((SELECT COUNT(*)
                FROM OrderDetails as od LEFT JOIN OrderItems as oi ON oi.OrderID = od.ID
                WHERE oi.productID = p.ID AND od.UserId = ? AND od.OrderStatus = 1) > 0, 1, 0) AS addedToCart
                FROM Products AS p WHERE p.ID = ? LIMIT 1;

    `;
    var values = [];
    values.push(data.userId);
    values.push(data.productId);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

module.exports = {listProducts, addProduct, getProductDetails};