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
}

module.exports = UserController