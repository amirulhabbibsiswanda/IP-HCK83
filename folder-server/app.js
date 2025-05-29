require("dotenv").config()

const express = require('express')
const UserController = require('./controllers/userController')
const errorHandling = require('./middlewares/errorHandling')
const HeroController = require('./controllers/heroController')
const authentication = require('./middlewares/authentication')
const app = express()
// const port = 3000 // Komentar atau hapus ini
const isAdmin = require('./middlewares/isAdmin')
const multer = require('multer')
const UserFavouriteHeroController = require('./controllers/userFavouriteHeroController')
const GenerateController = require('./controllers/generateController')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post("/users/register", UserController.register)
app.post("/users/login", UserController.login)
app.post("/users/login-google", UserController.googleLogin)

app.use(authentication)
app.get("/", HeroController.heroes)
app.get("/heroes/:id", HeroController.heroDetail)
app.put("/heroes/:id", isAdmin, HeroController.putHeroById)
app.patch("/heroes/image-url/:id", isAdmin, upload.single("image"), HeroController.updateImageById)
app.post("/heroes/:heroId", UserFavouriteHeroController.addToFavourite)
app.delete("/heroes/:heroId", UserFavouriteHeroController.deleteFavouriteHero)
app.delete("/heroes/:heroId", UserFavouriteHeroController.deleteFavouriteHero)
app.get("/users/favourites", UserController.getUserFavouriteHero)
app.get("/users/upgrade", UserController.upgradeStatus)
// app.patch("/users/upgrade", UserController.changeStatus)
app.patch("/users/upgrade-success", UserController.changeStatusFromStripeSession);



app.get("/generate-ai", GenerateController.generateTopHero)

app.use(errorHandling)

// Hapus atau komentar bagian ini
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });

// Tambahkan export app
module.exports = app;
