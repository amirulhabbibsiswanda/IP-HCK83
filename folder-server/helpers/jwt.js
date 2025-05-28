const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateToken(payload) {
    var token = jwt.sign(payload, process.env.JWT_SECRET);
    return token
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = { generateToken, verifyToken }