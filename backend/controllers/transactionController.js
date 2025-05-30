const { v4: uuidv4 } = require('uuid');
const transactionModel = require('../models/transaction');
const accountModel = require('../models/Account');
const category = 'Transactions';
const logController = require('./logController');

const transactionController = {
    create: async (req, res) => {
        try {
            const { accountId, transactionMode, amount, date, description, operation, transactionRef, } = req.body;

            if (!accountId || !transactionMode || !amount || !date || !operation) {
                return res.status(400).json({ error: 'Please fill all of the fields' });
            }

            const account = await accountModel.findByPk(accountId);
            if (!account) {
                return res.status(400).json({ error: 'No matching account found' });
            }

            await transactionModel.create({
                transactionId: uuidv4(),
                accountId,
                transactionRef: transactionRef || null,
                transactionMode,
                amount,
                date,
                description,
                operation
            });

            if (operation === '+') {
                account.balance += parseFloat(amount);
            } else if (operation === '-') {
                account.balance -= parseFloat(amount);
            } else {
                return res.status(400).json({ error: 'Invalid operation' });
            }
            await account.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Term Term Record",
                target:term.termId
            });

            return res.status(200).json({ message: 'Transaction created successfully' });
        } catch (error) {
            console.log('An error occurred:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { transactionId, accountId, transactionRef, transactionMode, amount, date, description, operation } = req.body;

            const transaction = await transactionModel.findByPk(transactionId);
            if (!transaction) {
                return res.status(400).json({ error: 'Transaction not found' });
            }

            const account = await accountModel.findByPk(transaction.accountId);
            if (!account) {
                return res.status(400).json({ error: 'Associated account not found' });
            }

            if (transaction.operation === '+') {
                account.balance -= parseFloat(transaction.amount);
            } else if (transaction.operation === '-') {
                account.balance += parseFloat(transaction.amount);
            }

            transaction.accountId = accountId || transaction.accountId;
            transaction.transactionRef = transactionRef || transaction.transactionRef;
            transaction.transactionMode = transactionMode || transaction.transactionMode;
            transaction.amount = amount || transaction.amount;
            transaction.date = date || transaction.date;
            transaction.description = description || transaction.description;
            transaction.operation = operation || transaction.operation;

            if (transaction.operation === '+') {
                account.balance += parseFloat(transaction.amount);
            } else if (transaction.operation === '-') {
                account.balance -= parseFloat(transaction.amount);
            }

            await transaction.save();
            await account.save();

            return res.status(200).json({ message: 'Transaction edited successfully' });
        } catch (error) {
            console.log('An error occurred:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { transactionId } = req.body;

            const transaction = await transactionModel.findByPk(transactionId);
            if (!transaction) {
                return res.status(400).json({ error: 'Transaction not found' });
            }

            const account = await accountModel.findByPk(transaction.accountId);
            if (!account) {
                return res.status(400).json({ error: 'Associated account not found' });
            }

            if (transaction.operation === '+') {
                account.balance -= parseFloat(transaction.amount);
            } else if (transaction.operation === '-') {
                account.balance += parseFloat(transaction.amount);
            }
            await account.save();

            await transaction.destroy();

            return res.status(200).json({ message: 'Transaction deleted successfully' });
        } catch (error) {
            console.log('An error occurred:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { transactionId } = req.body;

            const transaction = await transactionModel.findByPk(transactionId);
            if (!transaction) {
                return res.status(400).json({ error: 'Transaction not found' });
            }

            return res.status(200).json({ transaction });
        } catch (error) {
            console.log('An error occurred:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const transactions = await transactionModel.findAll();

            const transactionDetails = await Promise.all(transactions.map(async (transactionElement) => {
                const account = await accountModel.findByPk(transactionElement.accountId);
                return {
                    transaction: transactionElement,
                    account
                };
            }));

            return res.status(200).json(transactionDetails);
        } catch (error) {
            console.log('An error occurred:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = transactionController;