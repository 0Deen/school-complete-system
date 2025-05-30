const fs = require('fs');
const path = require('path');
const sequelize = require('../db/config');
const routesModel = require('../models/route');
const { v4: uuidv4 } = require('uuid');

const populateRoutes = async () => {
    try {
        const routesDir = path.join(__dirname, '../routes');
        const currentRoutes = [];

        const files = fs.readdirSync(routesDir);

        for (const file of files) {
            if (file.endsWith('.js')) {
                const filePath = path.join(routesDir, file);
                const category = path.basename(file, 'Routes.js');
                
                const router = require(filePath);

                if (router.stack && Array.isArray(router.stack)) {
                    const routes = router.stack
                        .filter((layer) => layer.route)
                        .map((layer) => {
                            const routeName = layer.route.path.startsWith('/')
                                ? layer.route.path.slice(1)
                                : layer.route.path;
                            return routeName;
                        });

                    routes.forEach((routeName) => {
                        currentRoutes.push({ category, route: routeName });
                    });
                }
            }
        }

        await sequelize.sync();

        for (const { category, route } of currentRoutes) {
            const existingRoute = await routesModel.findOne({
                where: { category, route }
            });

            if (!existingRoute) {
                await routesModel.create({
                    routeId: uuidv4(),
                    category,
                    route
                });
            }
        }

        const currentRoutesSet = new Set(currentRoutes.map(route => `${route.category}:${route.route}`));

        const allRoutesInDB = await routesModel.findAll();

        for (const routeRecord of allRoutesInDB) {
            const routeKey = `${routeRecord.category}:${routeRecord.route}`;
            if (!currentRoutesSet.has(routeKey)) {
                await routesModel.destroy({ where: { routeId: routeRecord.routeId } });
            }
        }

    } catch (error) {
        console.error('An error occurred while populating routes:', error.message);
    }
};

module.exports = { populateRoutes };