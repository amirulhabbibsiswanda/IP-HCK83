'use strict';

const { hashPassword } = require('../helpers/hashPassword');

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
    let data = [
      {
        username: "ilham",
        email: "ilham@gmail.com",
        password: "ilham123",
        userStatus: "admin",
        mobileLegendsRank: "EPIC",
        favouriteRole: "Tank"
      }
    ]

    for (const el of data) {
      el.password = await hashPassword(el.password)
      el.createdAt = el.updatedAt = new Date()
    }

    await queryInterface.bulkInsert("Users", data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
