const sqlConnection = require("../services/sqlConnection");

function signup(data, cb) {
    let sql = `INSERT INTO Users 
               (Username, Password, CreatedAt, UpdatedAt)
               Values (? , ? , now(), now())`;
    let values = [];
    values.push(data.username);
    values.push(data.password);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

function getUsersSignupDetails(data, cb) {
    let sql = "SELECT * FROM Users WHERE Username = ?";
    let values = [];
    values.push(data.username);
    sqlConnection.executeQuery(sql, values, function(err, result) {
        cb(err, result);
    });
}

module.exports = {signup, getUsersSignupDetails};