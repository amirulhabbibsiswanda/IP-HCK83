const { verifyToken } = require("../helpers/jwt")
const { User } = require("../models/index")

async function authentication(req, res, next) {
    try {
        let authorization = req.headers.authorization
        if (!authorization) {
            throw { name: "JsonWebTokenError" }
        }

        let arrToken = authorization.split(" ")
        let [type, token] = arrToken

        let dataFromPayload = verifyToken(token)
        let user = await User.findByPk(dataFromPayload.id)
        if (!user) {
            throw { name: "JsonWebTokenError" }
        }

        req.user = user
        // console.log(req.user.userStatus, "ini req user di auth");

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication