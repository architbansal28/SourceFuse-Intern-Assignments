'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    name: DataTypes.STRING,
    website: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
    timestamps: false,
  });
  return customers;
};