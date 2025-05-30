const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');

const Block = sequelize.define('block',{
    BlockId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    Name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    startRange:{
        type:DataTypes.STRING,
        allowNull:false
    },
    endRange:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false
});

module.exports = Block;