const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Term = require('./term');

const Votehead = sequelize.define('votehead', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    termId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Term,
            key: 'termId'
        }
    },
    Priority: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps:false
});

Votehead.belongsTo(Term, { foreignKey: 'termId', targetKey: 'termId' });

module.exports = Votehead;