const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Position = sequelize.define('position', {
    positionId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Position;