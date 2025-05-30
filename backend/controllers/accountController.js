const { v4: uuidv4 } = require('uuid');
const accountModel = require('../models/Account');
const bankModel = require('../models/bank');
const sequelize = require('sequelize');
const logController = require('./logController');
const category = 'Accounts';

const accountController = {
    create: async (req, res) => {
        try {
            const { BankId, accountNumber, accountName, balance } = req.body;
    
            if (!BankId || !accountNumber || !accountName) {
                return res.status(400).json({ error: 'Please fill all required fields' });
            }
    
            const bank = await bankModel.findByPk(BankId);
            if (!bank) {
                return res.status(404).json({ error: 'Bank not found' });
            }
    
            const accountBalance = balance || 0;
    
            const existingAccount = await accountModel.findOne({
                where: {
                    [sequelize.Op.or]: [{ accountNumber }, { accountName }]
                }
            });
    
            if (existingAccount) {
                if (existingAccount.accountName === accountName) {
                    return res.status(400).json({ error: 'Account name already exists' });
                } else if (existingAccount.accountNumber === accountNumber) {
                    return res.status(400).json({ error: 'Account number already exists' });
                }
            }
    
            const account = await accountModel.create({
                accountId: uuidv4(),
                BankId,
                accountNumber,
                accountName,
                balance: accountBalance
            });
    
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            const logResult = await logController.create({
                user_id: token,category,
                action: "Add Account",
                target:account.accountId
            });
    
            if (!logResult) {
                await account.destroy();
                return res.status(400).json({ error: 'An error occurred while creating the log' });
            }
    
            return res.status(200).json({ message: 'Account created successfully' });
    
        } catch (error) {
            console.error('An error occurred when creating an account', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    delete: async (req, res) => {
        try {
            const { accountId } = req.body;
            console.log(accountId)
            const account = await accountModel.findByPk(accountId);
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }
            await account.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Account",
                target:accountId
            });
            
            return res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.log('An error occurred when deleting an account', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    update: async (req, res) => {
        try {
            const { accountId, BankId, accountNumber, accountName, balance } = req.body;
            const account = await accountModel.findByPk(accountId);
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }

            if (BankId) {
                const bank = await bankModel.findByPk(BankId);
                if (!bank) {
                    return res.status(404).json({ error: 'Bank not found' });
                }
                account.BankId = BankId;
            }

            account.accountNumber = accountNumber || account.accountNumber;
            account.accountName = accountName || account.accountName;
            account.balance = balance || account.balance;

            await account.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Account",
                target:accountId
            });

            return res.status(200).json({ message: 'Account updated successfully' });
        } catch (error) {
            console.log('An error occurred when updating an account', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { accountId } = req.body;
            const account = await accountModel.findByPk(accountId, {
                include: { model: bankModel, as: 'bank' }
            });
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Account",
                target:accountId
            });

            return res.status(200).json(account);
        } catch (error) {
            console.log('An error occurred when viewing an account', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const accounts = await accountModel.findAll({
                include: { model: bankModel, as: 'bank' }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View ALl Accounts",
                target:'All'
            });
            
            return res.status(200).json(accounts);
        } catch (error) {
            console.log('An error occurred when viewing all accounts', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewSpecified: async (req, res) => {
        try {
            const { BankId } = req.body;

            const query = BankId ? { where: { BankId } } : {};
    
            const accounts = await accountModel.findAll({
                ...query,
                include: { model: bankModel, as: 'bank' }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,
                category,
                action: BankId ? `View Accounts for BankId: ${BankId}` : "View All Accounts",
                target: BankId || 'All'
            });
    
            return res.status(200).json(accounts);
        } catch (error) {
            console.log('An error occurred when viewing all accounts', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCount: async(req,res) => {
        try {
            const totalAmount = await accountModel.sum('balance');

            return res.status(200).json({
                totalAmount
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = accountController;