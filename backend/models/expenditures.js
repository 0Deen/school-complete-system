const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Expenditure = sequelize.define('expenditure', {
    ExpenditureID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Type: {
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
        allowNull: true
    },
    PaymentStatus: {
        type: DataTypes.STRING,
        allowNull:true
    },
}, {
    timestamps: false,
});

module.exports = Expenditure;