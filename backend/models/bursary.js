const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Account = require('./Account');

const Bursary = sequelize.define('bursary', {
    bursaryId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    source:{
        type:DataTypes.STRING,
        allowNull:false
    },
    accountId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Account,
            key:'accountId'
        }
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Bursary.belongsTo(Account,{foreignKey:'accountId'});

module.exports = Bursary;