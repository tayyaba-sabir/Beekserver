'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserJob.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      UserJob.belongsTo(models.Job, {
        foreignKey: 'jobId',
        onDelete: 'CASCADE',
      });
  }}
  UserJob.init({
    userId: DataTypes.INTEGER,
    jobId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    resume: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserJob',
  });
  return UserJob;
};