const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Employee = require('./employee');

const Payroll = sequelize.define('payroll', {
    PayrollID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    EmployeeID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: Employee,
            key: 'EmployeeID',
        }
    },
    BaseSalary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Bonus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Deductions: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NetPay: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PayDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PaymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Payroll.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });

module.exports = Payroll;