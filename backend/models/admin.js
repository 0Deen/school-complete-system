const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Employee = require('./employee');

const Admin = sequelize.define('user', {
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
});

User.belongsTo(Employee, { foreignKey: 'EmployeeId' });

module.exports = User;