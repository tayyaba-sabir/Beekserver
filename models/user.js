'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Job, {
        through: {
          model: 'UserJob',
          unique: false,
        },
        foreignKey: 'userId',
        otherKey: 'jobId',
        onDelete: 'CASCADE', 

      });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
