const Sequelize = require('sequelize');

const sequelize = require('../utils/database');
const Bus = sequelize.define('bus',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    busno : {
        type : Sequelize.STRING,
        unique : true
    },
    capacity : Sequelize.INTEGER,
    endpointA: Sequelize.STRING,
    endpointB: Sequelize.STRING,
    timingA: Sequelize.STRING,
    timingB: Sequelize.STRING,
    fare:Sequelize.DOUBLE
});

module.exports = Bus;