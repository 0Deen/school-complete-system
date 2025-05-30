const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Donation = sequelize.define('donation', {
    DonationID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    DonorName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Amount: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    DonationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    Purpose: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = Donation;