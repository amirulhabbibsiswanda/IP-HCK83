require("dotenv").config()

const express = require('express')
const UserController = require('./controllers/userController')
const errorHandling = require('./middlewares/errorHandling')
const HeroController = require('./controllers/heroController')
const authentication = require('./middlewares/authentication')
const app = express()
const port = 3000
const isAdmin = require('./middlewares/isAdmin')
const multer = require('multer')
const UserFavouriteHeroController = require('./controllers/userFavouriteHeroController')
const GenerateController = require('./controllers/generateController')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post("/users/register", UserController.register)
app.post("/users/login", UserController.login)
app.post("/users/login-google", UserController.googleLogin)

app.get("/heroes", HeroController.heroes)
app.use(authentication)
app.get("/heroes/:id", HeroController.heroDetail)
app.put("/heroes/:id", isAdmin, HeroController.putHeroById)
app.patch("/heroes/:id/image-url", isAdmin, upload.single("image"), HeroController.updateImageById)
app.post("/heros/:heroId", UserFavouriteHeroController.addToFavourite)
app.delete("/heros/:heroId", UserFavouriteHeroController.deleteFavouriteHero)

app.get("/generate-ai", GenerateController.generateTopHero)


app.use(errorHandling)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
