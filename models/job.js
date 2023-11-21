'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsToMany(models.User, {
        through: {
          model: 'UserJob',
          unique: false,
        },
        foreignKey: 'jobId',
        otherKey: 'userId',
        onDelete: 'CASCADE',

      });
    }
  }

  Job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Job',
    }
  );

  return Job;
};
