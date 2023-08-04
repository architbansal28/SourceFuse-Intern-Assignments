'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.roles, { foreignKey: 'role_id', as: 'role' });
      users.belongsTo(models.customers, { foreignKey: 'customer_id', as: 'customer' });
    }
  }
  users.init({
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    created_on: {
      type: DataTypes.DATE,
      field: 'created_on',
    },
    modified_on: {
      type: DataTypes.DATE,
      field: 'modified_on',
    },
  }, {
    sequelize,
    modelName: 'users',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
  });
  return users;
};