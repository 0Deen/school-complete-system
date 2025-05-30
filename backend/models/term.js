const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const academicYear = require('./academicYear');

const Term = sequelize.define('term', {
    termId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model:academicYear,
            key:'id'
        }
    }
});

Term.belongsTo(academicYear, { foreignKey: 'academicYear', targetKey: 'id' });

module.exports = Term;