const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const SmsLog = sequelize.define('smsLog', {
    SMSID: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    RecipientPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MessageContent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    SentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Status: {
        type: DataTypes.STRING,
        allowNull:false
    },
}, {
    timestamps: false,
});

module.exports = SmsLog;