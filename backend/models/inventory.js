const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');
const categoryModel = require('./inventoryCategory');
const inventoryCategory = require('./inventoryCategory');

const inventory = sequelize.define('inventory',{
    inventoryId:{
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
    },
    amount:{
        type:DataTypes.STRING,
        allowNull:false
    },
    unit:{
        type:DataTypes.STRING,
        allowNull:false
    },
    categoryId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:categoryModel,
            key:'categoryId'
        }
    }
},{
    timestamps:false
});

inventory.belongsTo(inventoryCategory,{foreignKey:'categoryId'});

module.exports = inventory;