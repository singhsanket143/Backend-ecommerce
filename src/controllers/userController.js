const User = require("../models/user");

function signup(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid details for signup"
    };
    if(data.username && data.password) {
        User.getUsersSignupDetails(data, function(err, result) {
            if(err) {
                console.log(err);
                responseData.msg = "Error in signup";
                return res.status(500).send(responseData);
            }
            if(result.length > 0) {
                responseData.msg = "User already exists";
                return res.status(500).send(responseData);
            } else {
                User.signup(data, function(err1, result1) {
                    if(err1) {
                        return res.status(500).send(responseData);
                    }
                    responseData.success = true;
                    responseData.msg = "Successfully signed up";
                    responseData.data = {
                        username: data.username,
                    };
                    return res.status(200).send(responseData);
                })
            }
        })
    } else {
        return res.status(400).send(responseData);
    }
}

module.exports = {signup};