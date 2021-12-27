const sqlConnection = require("../services/sqlConnection");

module.exports = {
	listProducts: function(data, callback) {
		var sql = "SELECT ID AS productId, Name AS name, Price AS price FROM Products";
		var values = [];
		if(data.categoryId) {
			sql += " WHERE CategoryId = ?"
			values.push(data.categoryId);
			if(data.query) {
				sql += " AND LOCATE('" + data.query + "', Name)";
			}
			if(data.minPrice) {
				sql += " AND Price >= " + parseInt(data.minPrice, 10);
			}
			if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
				sql += " AND Price <= " + parseInt(data.maxPrice, 10);
			}
		} else if(data.query) {
			sql += " WHERE LOCATE('" + data.query + "', Name)";
			if(data.minPrice) {
				sql += " AND Price >= " + parseInt(data.minPrice, 10);
			}
			if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
				sql += " AND Price <= " + parseInt(data.maxPrice, 10);
			}
		} else if (data.minPrice) {
			sql += " WHERE Price >= " + parseInt(data.minPrice, 10);
			if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
				sql += " AND Price <= " + parseInt(data.maxPrice, 10);
			}
		} else if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
			sql += " WHERE Price <= " + parseInt(data.maxPrice, 10);
		}
		
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	addProduct: function(data, callback) {
		var sql = "INSERT INTO Products (Name, Price, Description, CategoryID, VendorID, CreatedAt, UpdatedAt) "
			+ "VALUES (?, ?, ?, ?, ?, now(), now())";
		var values = [];
		values.push(data.name);
		values.push(data.price);
		values.push(data.description);
		values.push(data.categoryId);
		values.push(data.vendorId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getProductDetails: function(data, callback) {
		var sql = "SELECT p.Name AS name, p.Price AS price, p.Description AS description, if((SELECT COUNT(*) "
			+ "FROM OrderDetails AS od LEFT JOIN OrderItems AS oi ON oi.OrderID = od.ID WHERE oi.ProductID = p.ID"
			+ "  AND od.UserID = ? AND od.OrderStatus = 1) > 0, 1, 0) AS addedToCart FROM Products AS p WHERE p.ID = ? LIMIT 1";
		var values = [];
		values.push(data.userId);
        values.push(data.productId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},
};