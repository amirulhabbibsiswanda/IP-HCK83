
function errorHandling(error, req, res, next) {
    // console.log(error, "ini error");
    // console.log(error.name, "ini error name");
    // console.log(error.message, "ini message");
    if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ message: error.message })
    } else if (error.name === "heroNotFound") {
        res.status(404).json({ message: "hero data/id not found" })
    } else if (error.name === "emptyInputLogin") {
        res.status(400).json({ message: "email and password is required" })
    } else if (error.name === "cannotChangeHeroName") {
        res.status(400).json({ message: "cannot change hero name" })
    } else if (error.name === "JsonWebTokenError") {
        res.status(403).json({ message: "error / invalid token" })
    } else if (error.name === "wrongRole") {
        res.status(403).json({ message: "forbidden access, only admin can change hero data" })
    }



    else {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = errorHandling