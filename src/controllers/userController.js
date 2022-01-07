const User = require("../models/user");
const auth = require("../util/auth");

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
                User.strongSignup(data, function(err1, result1) {
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

function login(req, res) {
    let data = req.body;
    let responseData = {
        success: false,
        msg: "Invalid details for signup"
    };
    if(data.username && data.password) {
        User.strongLogin(data, function(err, result) {
            if(err) {
                console.log(err);
                responseData.msg = "Error in signin";
                return res.status(500).send(responseData);
            }
            if(result.length == 0) {
                responseData.msg = "Invalid Email Or Password";
                return res.status(500).send(responseData);
            }
            responseData.success = true;
            responseData.msg = "Successfully logged in ";
            console.log(result);
            responseData.data = {
                username: result[0].Username,
                userId: result[0].UserId,
                authToken: result[0].authToken
            };
            return res.status(200).send(responseData);
        })
    } else {
        return res.status(400).send(responseData);
    }
}

function isAuthenticated(req, res, next) {
    const token = req.headers.auth;
    let response;
    try {
        response = auth.verifyToken(token);
    } catch(err) {
        console.log(err);
        return res.status(401).send({message: "Invalid Token"});
    }
    User.getUserById(response.id, function(err, result) {
        if(err) {
            return res.status(401).send({message: "Invalid user"});
        }
        req.user = result;
        next();
    });
}

module.exports = {signup, login, isAuthenticated};