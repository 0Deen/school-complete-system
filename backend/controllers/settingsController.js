const settingsModel = require('../models/settings');
const { v4: uuidv4 } = require('uuid');
const logController = require('./logController');
const category = 'Settings';

const settingsController = {
    create: async (req, res) => {
        try {
            const { name, phone, email, address, motto, vision, logo, schoolType, gender, token } = req.body;

            console.log(name, phone, email, address, motto, vision, logo, schoolType, gender)
            
            const settings = await settingsModel.create({
                id: uuidv4(), name, phone, email,
                address, motto, vision, logo,
                schoolType, gender
            });

            const parsedToken = JSON.parse(token).token;

            await logController.create({
                user_id: parsedToken,
                category,
                action: 'Add Settings',
                target: settings.id
            });

            return res.status(200).json({ message: 'Operation Success', settings });
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { id, name, phone, email, address, motto, vision, logo, schoolType, gender, token } = req.body;

            const settings = await settingsModel.findByPk(id);
            if (!settings) {
                return res.status(404).json({ error: 'Not Found' });
            }

            Object.assign(settings, { name, phone, email, address, motto, vision, logo, schoolType, gender });
            await settings.save();

            const parsedToken = JSON.parse(token).token;

            await logController.create({
                user_id: parsedToken,
                category,
                action: 'Edit Settings',
                target: settings.id
            });

            return res.status(200).json({ message: 'Operation Success', settings });
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { id, token } = req.body;

            const settings = await settingsModel.findByPk(id);
            if (!settings) {
                return res.status(404).json({ error: 'Not Found' });
            }

            const parsedToken = JSON.parse(token).token;

            await logController.create({
                user_id: parsedToken,
                category,
                action: 'View Settings',
                target: settings.id
            });

            return res.status(200).json(settings);
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { id, token } = req.body;

            const settings = await settingsModel.findByPk(id);
            if (!settings) {
                return res.status(404).json({ error: 'Not Found' });
            }

            await settings.destroy();

            const parsedToken = JSON.parse(token).token;

            await logController.create({
                user_id: parsedToken,
                category,
                action: 'Delete Settings',
                target: settings.id
            });

            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const { token } = req.body;

            const settingsList = await settingsModel.findAll();

            const parsedToken = JSON.parse(token).token;

            await logController.create({
                user_id: parsedToken,
                category,
                action: 'View All Settings',
                target: 'All'
            });

            return res.status(200).json(settingsList);
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewSettings : async (req, res) => {
        try {
            const settings = await settingsModel.findOne();
    
            if (!settings) {
                return res.status(200).json({ exists: false });
            }
    
            let logoBase64 = '';
            if (settings.logo && Buffer.isBuffer(settings.logo)) {
                logoBase64 = settings.logo.toString('base64');
            }
            
            return res.status(200).json({
                exists: true,
                settings: {
                    ...settings.toJSON(),
                    logo: `data:image/jpeg;base64,${logoBase64}` 
                }
            });
        } catch (error) {
            console.error('Error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }    
    }
};

module.exports = settingsController;