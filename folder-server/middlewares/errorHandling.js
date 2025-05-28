
function errorHandling(error, req, res, next) {
    // console.log(error, "ini error");
    // console.log(error.name, "ini error name");
    // console.log(error.message, "ini message");
    if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ message: error.message })
    } else if (error.name === "emptyInputLogin") {
        res.status(400).json({ message: "email and password is required" })
    } else if (error.name === "cannotChangeHeroName") {
        res.status(400).json({ message: "cannot change hero name" })
    }


    else {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = errorHandling