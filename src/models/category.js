const sqlConnection = require("../services/sqlConnection");

module.exports = {
	listCategories: function(callback) {
		var sql = "SELECT ID as categoryId, Name as name FROM Categories";
		var values = [];
		sqlConnection.executeQuery(sql, values, function(err, result) {
			callback(err, result);
		});
	}
};