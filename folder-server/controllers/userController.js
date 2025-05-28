const { comparePassword } = require("../helpers/hashPassword")
const { generateToken } = require("../helpers/jwt")
const { User } = require("../models/index")

class UserController {
    static async register(req, res, next) {
        try {

            let { username, email, password, mobileLegendsRank, favouriteRole } = req.body
            let user = await User.create({
                username,
                email,
                password,
                mobileLegendsRank,
                favouriteRole
            })

            res.status(201).json({
                username: user.username,
                email: user.email,
                mobileLegendsRank: user.mobileLegendsRank,
                favouriteRole: user.favouriteRole
            })
        } catch (error) {
            // console.log(error, error.message, "ini error dan message");
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            console.log(req.headers, "ini headers");

            let { email, password } = req.body
            if (!email) {
                throw { name: "emptyInputLogin" }
            }
            if (!password) {
                throw { name: "emptyInputLogin" }
            }

            let user = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )
            if (!user) {
                throw { name: "emailNotFound" }
            }

            let isMatchPassword = await comparePassword(password, user.password)
            if (isMatchPassword === false) {
                throw { name: "incorrectPassword" }
            }

            let payload = {
                id: user.id,
                email: user.email,
                userStatus: user.userStatus
            }
            let jwtToken = generateToken(payload)

            res.status(200).json({ token: jwtToken })

        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController