const sqlConnection = require("../services/sqlConnection");

module.exports = {
	findOrderByUser: function(data, callback) {
		var sql = "SELECT ID, Total AS total FROM OrderDetails WHERE UserID = ? AND OrderStatus = 1 LIMIT 1";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	addOrder: function(data, callback) {
		var sql = "INSERT INTO OrderDetails (Total, UserID, OrderStatus, CreatedAt, UpdatedAt) VALUES (?, ?, 1, now(), now())";
		var values = [];
		values.push(data.total);
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	editOrder: function(data, callback) {
		var sql = "UPDATE OrderDetails SET Total = ?, OrderStatus = ?, UpdatedAt = now() WHERE ID = ?";
		var values = [];
		if(data.payment) {
			sql = "UPDATE OrderDetails SET OrderStatus = ?, UpdatedAt = now() WHERE ID = ?"
			values.push(2);
		} else {
			values.push(data.total);
			values.push(1);
		}
		values.push(data.orderId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getOrderDetails: function(data, callback) {
		var sql = "SELECT od.ID AS orderId, od.Total AS total, p.ID AS productId, p.Name AS productName, p.price AS price, "
			+ "oi.Quantity AS quantity FROM OrderDetails AS od LEFT JOIN OrderItems AS oi ON od.ID = oi.OrderID"
			+ " LEFT JOIN Products AS p ON p.ID = oi.ProductID WHERE od.UserID = ? AND od.OrderStatus = 1";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	}
};