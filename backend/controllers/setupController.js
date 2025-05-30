const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const userModel = require('../models/users');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const configFilePath = path.join(__dirname, '../db/config.json');

const setupController = {
    checkStatus: async (req, res) => {
        try {
            const configData = fs.readFileSync(configFilePath, 'utf-8');
            const config = JSON.parse(configData);
            
            if (!config.database || !config.system) {
                return res.status(400).json({ Error: 'Configuration is incomplete' });
            }
            
            return res.status(200).json({ message: 'Configuration is correct', config });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ Error: 'Internal Server Error' });
        }
    },
    saveDatabase: async (req, res) => {
        try {
            const { host, port, user, password, database } = req.body;

            const configData = fs.readFileSync(configFilePath, 'utf-8');
            const config = JSON.parse(configData);

            config.database = { host, port, user, password, database };

            fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

            return res.status(200).json({ message: 'Database configuration saved successfully' });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ Error: 'Internal Server Error' });
        }
    },
    testConnection: async (req, res) => {
        try {
            const {host, port, user, password, database} = req.body

            const connection = mysql.createConnection({
                host, port, user, password, database
            });

            connection.connect((err) => {
                if (err) {
                    console.log('Database connection failed:', err);
                    return res.status(500).json({ Error: 'Failed to connect to the database', details: err });
                }
                
                console.log('Database connection successful');
                return res.status(200).json({ message: 'Database connection test passed' });
            });

            connection.end();
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ Error: 'Internal Server Error' });
        }
    },
    activateSystem: async (req, res) => {
        try {
            const { serialNumber, systemTier, port } = req.body;

            const configData = fs.readFileSync(configFilePath, 'utf-8');
            const config = JSON.parse(configData);

            config.system = { serialNumber, systemTier, port };

            fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

            return res.status(200).json({ message: 'System activated successfully', config });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ Error: 'Internal Server Error' });
        }
    },
    initialize:async(req,res)=>{
        try {
            const { firstName, lastName, email, phone, password } = req.body;

            let uniqueId;
            let idExists = true;
            while (idExists) {
                uniqueId = uuidv4();
                const existingId = await userModel.findOne({ where: { user_id: uniqueId } });
                idExists = !!existingId;
            }

            const hashPass = await bcrypt.hash(password, 10);

            await userModel.create({
                user_id: uniqueId, firstName, lastName,email,
                phone,role:null,status:'Activated',
                password: hashPass
            });

            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log("An error ocurred", error);
            return res.status(500).json({error:"An error ocurred initializing"});
        }
    }
};

module.exports = setupController;