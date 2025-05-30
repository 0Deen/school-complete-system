const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');

const inventoryCategory = sequelize.define('inventory_category',{
    categoryId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false
});

module.exports = inventoryCategory;