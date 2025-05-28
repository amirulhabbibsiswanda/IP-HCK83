const { Hero } = require("../models/index")

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
}

module.exports = HeroController