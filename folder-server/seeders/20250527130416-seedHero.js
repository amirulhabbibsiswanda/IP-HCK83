'use strict';
const axios = require("axios")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const { data } = await axios.get("https://api.dazelpro.com/mobile-legends/hero")
    // console.log(data, "====="); //data.hero adalah array yang isinya adalah daftar hero
    const heroes = data.hero

    let resultData = []
    for (const hero of heroes) {
      const { data } = await axios.get(`https://api.dazelpro.com/mobile-legends/hero/${hero.hero_id}`)
      // console.log(data, ">....>>>");
      // console.log(data, "======");
      resultData.push({
        name: data.hero[0].hero_name,
        imageUrl: data.hero[0].hero_avatar,
        role: data.hero[0].hero_role,
        specially: data.hero[0].hero_specially,
        durability: data.hero[0].hero_overview.hero_durability,
        offence: data.hero[0].hero_overview.hero_offence,
        ability: data.hero[0].hero_overview.hero_ability,
        difficulty: data.hero[0].hero_overview.hero_difficulty,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    // console.log(resultData, ">>><<<<<");
    await queryInterface.bulkInsert("Heros", resultData, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Heros", null, {})
  }
};
