const { UserFavouriteHero, Hero, User } = require("../models/index")

class UserFavouriteHeroController {
    static async addToFavourite(req, res, next) {
        try {
            const userId = req.user.id
            const { heroId } = req.params

            await UserFavouriteHero.create({
                UserId: userId,
                HeroId: heroId
            })
            let hero = await Hero.findByPk(heroId)

            res.status(201).json({ message: `${hero.name} added to your favourite` })
        } catch (error) {
            next(error)
        }
    }

    static async deleteFavouriteHero(req, res, next) {
        try {
            const userId = req.user.id
            const { heroId } = req.params

            let hero = await Hero.findByPk(heroId)

            await UserFavouriteHero.destroy({
                where: {
                    UserId: userId,
                    HeroId: heroId
                }
            })

            res.status(200).json({ message: `${hero.name} has been removed from your favourite` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserFavouriteHeroController
