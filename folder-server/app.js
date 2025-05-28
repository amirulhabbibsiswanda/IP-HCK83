const express = require('express')
const UserController = require('./controllers/userController')
const errorHandling = require('./middlewares/errorHandling')
const HeroController = require('./controllers/heroController')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post("/register", UserController.register)
app.post("/login", UserController.login)

app.get("/heroes", HeroController.heroes)
app.get("/heroes/:id", HeroController.heroDetail)
app.put("/heroes/:id", HeroController.putHeroById)

app.use(errorHandling)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
