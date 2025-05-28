
function isAdmin(req, res, next) {
    try {
        console.log(req.user, "ini di is admin");

        if (req.user.userStatus !== "admin") {
            throw { name: "wrongRole" }
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = isAdmin