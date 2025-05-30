const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Position = require('./position');

const SpecializedPosition = sequelize.define('specialized_position', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positionId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Position,
            key: 'positionId'
        }
    }
});

SpecializedPosition.belongsTo(Position, {
    foreignKey: 'positionId',
    targetKey: 'positionId',
    as: 'position'
});

module.exports = SpecializedPosition;