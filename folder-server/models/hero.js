'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hero.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    role: DataTypes.STRING,
    specially: DataTypes.STRING,
    durability: DataTypes.INTEGER,
    offence: DataTypes.INTEGER,
    ability: DataTypes.INTEGER,
    difficulty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Hero',
  });
  return Hero;
};