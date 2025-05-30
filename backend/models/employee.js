const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const SpecializedPosition = require('./specializedPosition');

const Employee = sequelize.define('employee', {
    EmployeeID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PositionId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: SpecializedPosition,
            key: 'id'
        }
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
});

Employee.belongsTo(SpecializedPosition, {
    foreignKey: 'PositionId',
    as: 'specializedPosition'
});

module.exports = Employee;