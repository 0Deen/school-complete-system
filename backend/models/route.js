const sequelize = require('../db/config');
const {DataTypes} = require('sequelize');

const routes = sequelize.define('routes',{
    routeId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    route:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

module.exports = routes;