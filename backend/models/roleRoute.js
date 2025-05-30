const sequelize = require('../db/config');
const { DataTypes } = require('sequelize');
const Role = require('./role');
const Route = require('./route');

const roleRoute = sequelize.define('role-route', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Role,
            key: 'roleId',
            onDelete: 'CASCADE'
        }
    },
    routeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Route,
            key: 'routeId',
            onDelete: 'CASCADE'
        }
    }
});

roleRoute.belongsTo(Role, { foreignKey: 'roleId' });
roleRoute.belongsTo(Route, { foreignKey: 'routeId' });

module.exports = roleRoute;