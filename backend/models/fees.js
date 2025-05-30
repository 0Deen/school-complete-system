const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Student = require('./student');
const Term = require('./term');
const Account = require('./Account');

const Fee = sequelize.define('fee', {
    FeeId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    Ref:{
        type:DataTypes.STRING,
        allowNull:true
    },
    StudentID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: Student,
            key: 'StudentID',
        }
    },
    Term: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Term,
            key:'termId'
        }
    },
    AmountPaid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PaymentMode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PaymentDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Account,
            key:'accountId'
        }
    }
}, {
    timestamps: false,
});

Fee.belongsTo(Student, { foreignKey: 'StudentID' });
Fee.belongsTo(Term, { foreignKey: 'Term' });
Fee.belongsTo(Account,{foreignKey:'accountId'});

module.exports = Fee;