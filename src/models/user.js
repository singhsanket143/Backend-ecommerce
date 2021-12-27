const sqlConnection = require("../services/sqlConnection");
const {
	userType
} = require("../constants/backendConfig");

module.exports = {
	login: function(data, callback) {
		var sql = "SELECT ID as UserId, Username, UserType FROM Users WHERE Username = ? AND Password = ?";
		var values = [];
		values.push(data.username);
		values.push(data.password);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	signup: function(data, callback) {
		var sql = "INSERT INTO Users (Username, Password, UserType, CreatedAt, UpdatedAt) VALUES (?, ?, ?, now(), now())";
		var values = [];
		values.push(data.username);
		values.push(data.password);
		values.push(userType[data.userType]);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getUserDetails: function(data, callback) {
		var sql = "SELECT * FROM Users WHERE Username = ?";
		var values = [];
		values.push(data.username);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	addVendorDetails: function(data, callback) {
		var sql = "INSERT INTO VendorDetails (GSTIN, PAN, UserID, CreatedAt, UpdatedAt) VALUES (?, ?, ?, now(), now())";
		var values = [];
		values.push(data.gstin);
		values.push(data.pan);
		values.push(data.vendorId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorDetails: function(data, callback) {
		var sql = "SELECT u.Username AS username, vd.GSTIN AS gstin, vd.PAN as pan FROM Users AS u LEFT JOIN "
			+ "VendorDetails AS vd ON u.ID = vd.userID WHERE u.ID = ? LIMIT 1";
		var values = [];
		values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	},

	getVendorPayments: function(data, callback) {
		var sql = "SELECT od.ID AS orderId, od.Total AS total, p.ID AS productId, p.Name AS productName, p.price AS price, "
			+ "oi.Quantity AS quantity FROM OrderDetails AS od LEFT JOIN OrderItems AS oi ON od.ID = oi.OrderID"
			+ " LEFT JOIN Products AS p ON p.ID = oi.ProductID WHERE p.VendorID = ? AND od.OrderStatus = 2 LIMIT 1";
		var values = [];
        values.push(data.userId);
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	}
};