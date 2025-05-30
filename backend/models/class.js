const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');
const Stream = require('./Stream');
const Block = require('./block');
const Employee = require('./employee');

const Class = sequelize.define('class',{
    ClassId:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    BlockId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Block,
            key:'BlockId'
        }
    },
    BlockRange:{
        type:DataTypes.STRING,
        allowNull:false
    },
    StreamId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Stream,
            key:'StreamId'
        }
    },
    teacher: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Employee,
            key: 'EmployeeID'
        }
    }
},{
    timestamps:false
});

Class.belongsTo(Employee, { foreignKey: 'teacher' });
Class.belongsTo(Stream, { foreignKey: 'StreamId' });
Class.belongsTo(Block,{foreignKey:'BlockId'});

module.exports = Class;