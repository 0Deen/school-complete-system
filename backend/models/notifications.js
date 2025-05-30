const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');

const notifications = sequelize.define('notifications',{
    notificationId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date:{
        type:DataTypes.STRING,
        allowNull:false
    },
});

module.exports = notifications;