const jwt = require('jsonwebtoken');
const User = require("../models/user");

function newToken(user) {
    return jwt.sign({id: user.UserId}, 'relevel', {
        expiresIn: '10d'
    });
}

module.exports = {newToken};