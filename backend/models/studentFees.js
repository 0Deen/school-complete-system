const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Student = require('./Student');
const Term = require('./term');

const StudentFees = sequelize.define('student_fees', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    StudentId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Student,
            key: 'StudentID'
        }
    },
    termId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Term,
            key: 'termId'
        }
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total:{
        type:DataTypes.STRING,
        allowNull:false
    },
    overPay:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    timestamps: false,
});

StudentFees.belongsTo(Student, { foreignKey: 'StudentId' });
StudentFees.belongsTo(Term, { foreignKey: 'termId' });

module.exports = StudentFees;