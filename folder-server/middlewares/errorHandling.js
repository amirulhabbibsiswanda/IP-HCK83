
function errorHandling(error, req, res, next) {
    // console.log(error, "ini error");
    // console.log(error.name, "ini error name");
    // console.log(error.message, "ini message");
    if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ message: error.message })
    }


}

module.exports = errorHandling