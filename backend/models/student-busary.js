const {DataTypes} = require('sequelize');
const sequelize = require('../db/config');
const Student = require('./student');
const Bursary = require('./bursary');

const studentBusary = sequelize.define('student_busary',{
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    BursaryId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Bursary,
            key:'BursaryId'
        }
    },
    StudentID:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Student,
            key:'StudentID'
        }
    },
    amount:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

studentBusary.belongsTo(Bursary, { foreignKey: 'BursaryId' });
studentBusary.belongsTo(Student, { foreignKey: 'StudentID' });

module.exports = studentBusary;