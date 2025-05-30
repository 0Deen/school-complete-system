const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const academicYear = sequelize.define('academic_year', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    yearName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    terms: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false
});

module.exports = academicYear;
