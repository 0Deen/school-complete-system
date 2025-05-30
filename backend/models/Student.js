const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Class = require('./class');

const Student = sequelize.define('student', {
    StudentID: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ClassId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Class,
            key: 'ClassId'
        }
    },
    ParentPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Gender:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    timestamps: false,
});

Student.belongsTo(Class, { foreignKey: 'ClassId' });

module.exports = Student;