const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Stream = sequelize.define('stream', {
    StreamId: {
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

module.exports = Stream;