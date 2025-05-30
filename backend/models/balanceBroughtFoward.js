// const {DataTypes} = require('sequelize');
// const sequelize = require('../db/config');
// const Student = require('./Student');
// const Term = require('./term');

// const balanceBroughtFoward = sequelize.define('balance_brought_foward',{
//     id:{
//         type:DataTypes.STRING,
//         primaryKey:true
//     },
//     studentId:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         references: {
//             model: Student,
//             key: 'StudentID'
//         }
//     },
//     term:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         references:{
//             model:Term,
//             key:'termId'
//         }
//     }
// },{
//     timestamps:false
// });

// balanceBroughtFoward.belongsTo(Student, {foreignKey:'StudentID'});
// balanceBroughtFoward.belongsTo(Term, {foreignKey:'termId'});

// module.exports = balanceBroughtFoward;