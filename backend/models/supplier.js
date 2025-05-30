const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Supplier = sequelize.define('supplier', {
    supplierId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    products:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    timestamps: false,
});

module.exports = Supplier;