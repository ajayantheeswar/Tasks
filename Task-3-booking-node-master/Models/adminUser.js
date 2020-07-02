const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const AdminUser = sequelize.define('adminuser', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: {
    type:  Sequelize.STRING,
    allowNull : false,
    unique : true
  },
  password: Sequelize.STRING
});

module.exports = AdminUser;



