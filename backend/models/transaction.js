const sequelize = require('../db/config');
const DataTypes = require('sequelize');
const Account = require('./Account');

const accountTransaction = sequelize.define('account_transaction', {
    transactionId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    accountId: { 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Account,
            key: 'accountId'
        }
    },
    transactionRef: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionMode:{
        type: DataTypes.STRING,
        allowNull:false
    },
    transactionType:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    operation:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    timestamps: false
});

accountTransaction.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = accountTransaction;