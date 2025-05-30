const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');

const Role = sequelize.define('role',{
    roleId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = Role;