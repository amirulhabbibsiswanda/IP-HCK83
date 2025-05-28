const axios = require("axios");
const { generateContent } = require("../helpers/generateAI");


class GenerateController {
    static async generateTopHero(req, res, next) {
        try {
            // const { role } = req.query
            // 1. Fetch semua hero dari API Dazelpro
            const { data } = await axios.get("https://api.dazelpro.com/mobile-legends/hero");
            const heroes = data.hero;

            // 2. Hitung total overview score per hero
            const heroesWithScore = heroes.map(hero => {
                console.log(hero, "INI HERO DI MAP");

                const overview = hero.hero_overview;
                const total =
                    (Number(overview.durability) || 0) +
                    (Number(overview.offence) || 0) +
                    (Number(overview.ability) || 0) +
                    (Number(overview.difficulty) || 0);

                return {
                    name: hero.hero_name,
                    role: hero.hero_role,
                    total,
                };
            });

            // 3. Siapkan prompt
            const prompt = `
User likes hero role: ${req.user.favouriteRole}

Here are some heroes with their roles and total overview score:
${heroesWithScore.map(h => `- ${h.name} (${h.role}) Score: ${h.total}`).join("\n")}

Recommend top 5 heroes that match the user's favorite role (${req.user.favoriteRole}) and have the highest score.

Respond with a JSON array of hero names only.
        `;

            // 4. Dapatkan rekomendasi dari Gemini
            const generation = await generateContent(prompt);
            const heroNames = JSON.parse(generation);

            // 5. Ambil detail hero yang cocok
            const recommendedHeroes = heroes.filter(h => heroNames.includes(h.hero_name));

            res.json({
                user: req.user,
                recommendations: heroNames,
                heroes: recommendedHeroes,
            });

        } catch (error) {
            console.error(error, "ini eror di generate controller");
            res.status(500).json({ message: "Failed to get hero recommendations." });

        }
    }
}

module.exports = GenerateController