const express = require('express')
const UserController = require('./controllers/userController')
const errorHandling = require('./middlewares/errorHandling')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/register", UserController.register)

app.use(errorHandling)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
