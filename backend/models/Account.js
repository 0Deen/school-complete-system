const sequelize = require('../db/config');
const DataTypes = require('sequelize');
const Bank = require('./bank');

const Account = sequelize.define('account', {
    accountId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    BankId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Account.belongsTo(Bank, {
    foreignKey: 'BankId',
    as: 'bank'
});

module.exports = Account;