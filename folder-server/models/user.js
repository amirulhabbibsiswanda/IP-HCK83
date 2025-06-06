'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/hashPassword');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Hero,
        {
          through: models.UserFavouriteHero,
          foreignKey: "UserId"
        }
      )
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "username is required"
        },
        notNull: {
          msg: "username is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "email is required"
        },
        notNull: {
          msg: "email is required"
        },
        isEmail: {
          msg: "input must be email formatted"
        }
      },
      unique: {
        msg: "email already used"
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password is required"
        },
        notNull: {
          msg: "password is required"
        }
      }
    },
    userStatus: {
      type: DataTypes.STRING,
      defaultValue: "customer"
    },
    mobileLegendsRank: {
      type: DataTypes.STRING,
      defaultValue: "epic"
    },

    favouriteRole: {
      type: DataTypes.STRING,
      defaultValue: "Tank"
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (instance) => {
        instance.password = await hashPassword(instance.password)
      }
    }
  });
  return User;
};