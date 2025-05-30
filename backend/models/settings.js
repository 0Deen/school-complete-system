const sequelize = require('../db/config');
const DataTypes = require('sequelize');

const Settings = sequelize.define('settings', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    motto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vision: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    schoolType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});


module.exports = Settings;
