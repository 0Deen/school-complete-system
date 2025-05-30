const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Supplier = require('./supplier');

const Procurement = sequelize.define('procurement', {
    ProcurementID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    SupplierID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: Supplier,
            key: 'SupplierID',
        }
    },
    Item: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Quantity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Amount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    OrderDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    DeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
});

Procurement.belongsTo(Supplier, { foreignKey: 'SupplierID' });

module.exports = Procurement;