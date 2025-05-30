// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/config');
// const Votehead = require('./votehead');
// const Term = require('./term');

// const voteheadFees = sequelize.define('votehead_fees', {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     voteheadId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: Votehead,
//             key: 'id'
//         }
//     },
//     amount: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     term: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: Term,
//             key: 'termId'
//         }
//     }
// }, {
//     timestamps: false
// });

// voteheadFees.belongsTo(Votehead, { foreignKey: 'voteheadId' });
// voteheadFees.belongsTo(Term, { foreignKey: 'term' });

// module.exports = voteheadFees;