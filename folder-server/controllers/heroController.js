const { Hero } = require("../models/index")

const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class HeroController {
    static async heroes(req, res, next) {
        try {
            let heroes = await Hero.findAll(
                {
                    attributes: ["id", "name", "imageUrl", "role", "specially"]
                }
            )
            res.status(200).json(heroes)
        } catch (error) {
            next(error)
        }
    }

    static async heroDetail(req, res, next) {
        try {
            // console.log(req.user.dataValues.userStatus, "ini req user di controller");

            let heroId = req.params.id
            let hero = await Hero.findByPk(heroId)
            if (!hero) {
                throw { name: "heroNotFound" }
            }

            res.status(200).json(hero)
        } catch (error) {
            next(error)
        }
    }

    static async putHeroById(req, res, next) { // harus admin
        try {
            let heroId = req.params.id
            let { name, imageUrl, role, specially, durability, offence, ability, difficulty } = req.body

            let hero = await Hero.findByPk(heroId);
            if (name !== hero.name) {
                throw { name: "cannotChangeHeroName" }
            }

            await hero.update({
                name,
                imageUrl,
                role,
                specially,
                durability,
                offence,
                ability,
                difficulty
            })

            res.status(201).json({ information: "success update hero detail", hero })
        } catch (error) {
            next(error)
        }
    }

    static async updateImageById(req, res, next) {
        try {
            let heroId = req.params.id
            let newImageUrl;

            if (req.file) {
                const base64File = req.file.buffer.toString("base64")
                const dataURI = `data:${req.file.mimetype};base64,${base64File}`

                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: "ip-p2-hck83",
                    public_id: req.file.originalname
                })
                newImageUrl = uploadResult.secure_url
            } else if (req.body.imageUrl) {
                newImageUrl = req.body.imageUrl
            } else {
                throw { name: "cannotFindImageSource" }
            }

            let hero = await Hero.findByPk(heroId)
            if (!hero) {
                throw { name: "heroNotFound" }
            }

            await hero.update({ imageUrl: newImageUrl })
            res.status(201).json({ message: "image URL has been updated" })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = HeroController