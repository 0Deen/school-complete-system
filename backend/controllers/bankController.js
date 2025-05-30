const bankModel = require('../models/bank');
const { v4: uuidv4 } = require('uuid');
const category = 'Banks';
const logController = require('./logController');

const bankController = {
    create: async (req, res) => {
        try {
            const { Name, Branch } = req.body;
            
            const bank = await bankModel.create({
                BankId: uuidv4(),
                Name,
                Branch
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Bank",
                target: bank.BankId
            });

            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { BankId, Name, Branch } = req.body;
            const bank = await bankModel.findByPk(BankId);
            if (!bank) {
                return res.status(404).json({ error: 'Not found' });
            }
            bank.Name = Name || bank.Name;
            bank.Branch = Branch || bank.Branch;
            await bank.save();
            
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Bank",
                target: bank.BankId
            });

            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { BankId } = req.body;
            const bank = await bankModel.findByPk(BankId);
            if (!bank) {
                return res.status(404).json({ error: 'Not found' });
            }
           
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Bank",
                target: bank.BankId
            });

            return res.status(200).json(bank);
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { BankId } = req.body;
            const bank = await bankModel.findByPk(BankId);
            if (!bank) {
                return res.status(404).json({ error: 'Not found' });
            }
            await bank.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Bank",
                target: bank.BankId
            });
           
            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const banks = await bankModel.findAll();
            
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Banks",
                target: 'All'
            });

            return res.status(200).json(banks);
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = bankController;