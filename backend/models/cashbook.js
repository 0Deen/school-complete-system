const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Cashbook = sequelize.define('cashbook', {
    CashbookID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    AmountInflow: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AmountOutflow: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Balance: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Cashbook;