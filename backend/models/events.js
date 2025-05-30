const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Event = sequelize.define('Event', {
    EventID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Event;
