const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Ledger = sequelize.define('ledger', {
    LedgerID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    AccountType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Amount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Ledger;