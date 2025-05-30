const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const User = require('./users');

const Logs = sequelize.define(
    'logs',
    {
        logId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        target: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

Logs.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Logs;
