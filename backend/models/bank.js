const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');

const Bank = sequelize.define('bank',{
    BankId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    Name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Branch:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    timestamps:false
});

module.exports = Bank;