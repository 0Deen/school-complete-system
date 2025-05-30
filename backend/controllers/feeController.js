const { v4: uuidv4 } = require('uuid');
const feeModel = require('../models/fees');
const studentModel = require('../models/student');
const termModel = require('../models/term');
const transactionModel = require('../models/transaction');
const accountModel = require('../models/Account');
const studentFeeModel = require('../models/studentFees');
const voteheadModel = require('../models/votehead');
const bursaryModel = require('../models/bursary');
//const bbfModel = require('../models/balanceBroughrFoward');
const academicYear = require('../models/academicYear');
const category = 'Fee';
const logController = require('./logController');
const { Op, fn, col } = require('sequelize');


const feeController = {
    create: async (req, res) => {
        try {
            const { StudentID, Ref, Term, AmountPaid, PaymentMode, accountId} = req.body;
            
            if (!StudentID || !Term || !PaymentMode) {
                return res.status(400).json({ error: 'All required fields must be provided.' });
            }

            const student = await studentModel.findByPk(StudentID);
            if (!student) {
                return res.status(404).json({ error: 'Student not found.' });
            }

            const term = await termModel.findByPk(Term);
            if (!term) {
                return res.status(404).json({ error: 'Term not found.' });
            }

            const account = await accountModel.findByPk(accountId);
            if(!account){
                return res.status(404).json({ error: 'Term not found.' });
            }

            const date = new Date();
            const PaymentDate = date.toISOString().split('T')[0];

            const FeeId = uuidv4();

            await transactionModel.create({
                transactionId:uuidv4(),
                accountId,
                transactionRef:FeeId,
                transactionType :'Fee Payment',
                transactionMode:PaymentMode,
                amount:AmountPaid,
                date:PaymentDate,
                description:'fees',
                operation:'+'
            });

            const accountBal = parseFloat(account.balance) + parseFloat(AmountPaid);
            account.balance = accountBal;
            await account.save();

            const fee = await feeModel.create({
                FeeId, Ref,StudentID, Term,
                AmountPaid, PaymentMode,
                PaymentDate,accountId
            });
            
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Fees",
                target: fee.FeeId
            });

            return res.status(201).json({ message: 'Fee record created successfully.' });
        } catch (error) {
            console.error('Error creating fee record:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { FeeId } = req.body;
            const fee = await feeModel.findByPk(FeeId);

            if (!fee) {
                return res.status(404).json({ error: 'Fee record not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Fee",
                target: fee.FeeId
            });

            return res.status(200).json(fee);
        } catch (error) {
            console.error('Error retrieving fee record:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const fees = await feeModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Fee records",
                target: "All"
            });

            return res.status(200).json(fees);
        } catch (error) {
            console.error('Error retrieving fee records:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { FeeId, Ref, StudentID, Term, AmountPaid, PaymentMode, PaymentDate, accountId } = req.body;
    
            const fee = await feeModel.findByPk(FeeId);
            if (!fee) {
                return res.status(404).json({ error: 'Fee record not found.' });
            }
    
            if (StudentID) {
                const student = await studentModel.findByPk(StudentID);
                if (!student) {
                    return res.status(404).json({ error: 'Student not found.' });
                }
            }
    
            if (Term) {
                const term = await termModel.findByPk(Term);
                if (!term) {
                    return res.status(404).json({ error: 'Term not found.' });
                }
            }

            const account = await accountModel.findByPk(fee.accountId);
            if (!account) {
                return res.status(404).json({ error: 'Account not found.' });
            }
    
            fee.Ref = Ref || fee.Ref;
            fee.StudentID = StudentID || fee.StudentID;
            fee.Term = Term || fee.Term;
            fee.PaymentMode = PaymentMode || fee.PaymentMode;
            fee.PaymentDate = PaymentDate || fee.PaymentDate;
            fee.accountId = accountId || fee.accountId;

            if(AmountPaid){
                const accountBalance = parseFloat(account.balance);
                const oldFeeAmount = parseFloat(fee.AmountPaid);
                const newAccountBalance = (accountBalance - oldFeeAmount) + parseFloat(AmountPaid);
                account.balance = newAccountBalance;
                fee.AmountPaid = AmountPaid;
                await account.save()
            }
    
            await fee.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Fees",
                target: fee.FeeId
            });
    
            return res.status(200).json({ message: 'Fee record updated successfully.' });
        } catch (error) {
            console.error('Error updating fee record:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    delete: async (req, res) => {
        try {
            const { FeeId } = req.body;

            const fee = await feeModel.findByPk(FeeId);
            
            if (!fee) {
                return res.status(404).json({ error: 'Fee record not found.' });
            }

            const transaction = await transactionModel.findOne({
                where:{transactionRef:FeeId}
            });

            const account = await accountModel.findByPk(fee.accountId);

            account.balance = parseFloat(account.balance) - parseFloat(fee.AmountPaid);

            await account.save();

            await transaction.destroy();
            await fee.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Fee record",
                target: fee.FeeId
            });

            return res.status(200).json({ message: 'Fee record deleted successfully.' });
        } catch (error) {
            console.error('Error deleting fee record:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewDetailed: async (req, res) => {
        try {
            const { FeeId } = req.body;
    
            const fee = await feeModel.findByPk(FeeId);
    
            if (!fee) {
                return res.status(404).json({ error: 'Fee record not found.' });
            }
    
            const student = await studentModel.findByPk(fee.StudentID);
            const term = await termModel.findByPk(fee.Term);
    
            if (!term) {
                return res.status(404).json({ error: 'Term record not found.' });
            }
    
            const year = await academicYear.findByPk(term.academicYear);
    
            const detailedFee = {
                Fee: fee,
                Student: student || null,
                Term: term,
                Year: year || null
            };

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Detailed Fee record",
                target: fee.FeeId
            });

            const detailedFees = [detailedFee];
    
            return res.status(200).json(detailedFees);
        } catch (error) {
            console.error('Error retrieving detailed fee record:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    viewAllDetailed: async (req, res) => {
        try {
            const feesItems = await feeModel.findAll();
    
            const fees = [];
            for (const fee of feesItems) {
                const student = await studentModel.findByPk(fee.StudentID);
                const term = await termModel.findByPk(fee.Term);
    
                if (!term) {
                    console.error('Term not found for fee:', fee.FeeId);
                    continue;
                }
    
                const year = await academicYear.findByPk(term.academicYear);
                const account = await accountModel.findByPk(fee.accountId);
    
                const feeItem = {
                    Fee: fee,
                    Student: student || null,
                    Term: term,
                    Year: year || null,
                    Account: account
                };
    
                fees.push(feeItem);
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View all detailed Fee record",
                target: "All"
            });
    
            return res.status(200).json(fees);
        } catch (error) {
            console.error('Error retrieving all detailed fee records:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewTermUnpaid:async()=>{

    },
    viewTermPaid:async()=>{
        
    },
    feeCount : async (req, res) => {
        try {
            const totalFeesPaid = await feeModel.sum('AmountPaid');
    
            return res.status(200).json({
                totalFeesPaid: parseFloat(totalFeesPaid || 0),
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAggregatedData: async (req, res) => {
        const { timeFilter, dataFilter } = req.body;
    
        let labels = [];
        let data = [];
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        try {
            if (timeFilter === 'day') {
                labels = daysOfWeek;
    
                if (dataFilter === 'fees') {
                    const dailyFees = await feeModel.findAll({
                        attributes: [
                            [fn('DAYOFWEEK', col('PaymentDate')), 'dayOfWeek'],
                            [fn('SUM', col('AmountPaid')), 'totalAmountPaid']
                        ],
                        group: [fn('DAYOFWEEK', col('PaymentDate'))],
                        order: [[fn('DAYOFWEEK', col('PaymentDate')), 'ASC']]
                    });
    
                    const feeMap = dailyFees.reduce((acc, item) => {
                        acc[item.dataValues.dayOfWeek - 1] = parseFloat(item.dataValues.totalAmountPaid);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => feeMap[index] || 0);
                }
    
                if (dataFilter === 'earnings') {
                    const dailyEarnings = await transactionModel.findAll({
                        attributes: [
                            [fn('DAYOFWEEK', col('date')), 'dayOfWeek'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        where: { transactionType: 'Fee Payment' },
                        group: [fn('DAYOFWEEK', col('date'))],
                        order: [[fn('DAYOFWEEK', col('date')), 'ASC']]
                    });
    
                    const earningsMap = dailyEarnings.reduce((acc, item) => {
                        acc[item.dataValues.dayOfWeek - 1] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => earningsMap[index] || 0);
                }
    
                if (dataFilter === 'bursaries') {
                    const dailyBursaries = await bursaryModel.findAll({
                        attributes: [
                            [fn('DAYOFWEEK', col('date')), 'dayOfWeek'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        group: [fn('DAYOFWEEK', col('date'))],
                        order: [[fn('DAYOFWEEK', col('date')), 'ASC']]
                    });
    
                    const bursaryMap = dailyBursaries.reduce((acc, item) => {
                        acc[item.dataValues.dayOfWeek - 1] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => bursaryMap[index] || 0);
                }
            }
    
            if (timeFilter === 'month') {
                labels = monthsOfYear;
    
                if (dataFilter === 'fees') {
                    const monthlyFees = await feeModel.findAll({
                        attributes: [
                            [fn('MONTH', col('PaymentDate')), 'month'],
                            [fn('SUM', col('AmountPaid')), 'totalAmountPaid']
                        ],
                        group: [fn('MONTH', col('PaymentDate'))],
                        order: [[fn('MONTH', col('PaymentDate')), 'ASC']]
                    });
    
                    const feeMap = monthlyFees.reduce((acc, item) => {
                        acc[item.dataValues.month - 1] = parseFloat(item.dataValues.totalAmountPaid);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => feeMap[index] || 0);
                }
    
                if (dataFilter === 'earnings') {
                    const monthlyEarnings = await transactionModel.findAll({
                        attributes: [
                            [fn('MONTH', col('date')), 'month'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        where: { transactionType: 'Fee Payment' },
                        group: [fn('MONTH', col('date'))],
                        order: [[fn('MONTH', col('date')), 'ASC']]
                    });
    
                    const earningsMap = monthlyEarnings.reduce((acc, item) => {
                        acc[item.dataValues.month - 1] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => earningsMap[index] || 0);
                }
    
                if (dataFilter === 'bursaries') {
                    const monthlyBursaries = await bursaryModel.findAll({
                        attributes: [
                            [fn('MONTH', col('date')), 'month'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        group: [fn('MONTH', col('date'))],
                        order: [[fn('MONTH', col('date')), 'ASC']]
                    });
    
                    const bursaryMap = monthlyBursaries.reduce((acc, item) => {
                        acc[item.dataValues.month - 1] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map((_, index) => bursaryMap[index] || 0);
                }
            }
    
            if (timeFilter === 'year') {
                const currentYear = new Date().getFullYear();
                const rangeOfYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
                labels = rangeOfYears.reverse().map(String);
    
                if (dataFilter === 'fees') {
                    const yearlyFees = await feeModel.findAll({
                        attributes: [
                            [fn('YEAR', col('PaymentDate')), 'year'],
                            [fn('SUM', col('AmountPaid')), 'totalAmountPaid']
                        ],
                        group: [fn('YEAR', col('PaymentDate'))],
                        order: [[fn('YEAR', col('PaymentDate')), 'ASC']]
                    });
    
                    const feeMap = yearlyFees.reduce((acc, item) => {
                        acc[item.dataValues.year] = parseFloat(item.dataValues.totalAmountPaid);
                        return acc;
                    }, {});
    
                    data = labels.map(year => feeMap[year] || 0);
                }
    
                if (dataFilter === 'earnings') {
                    const yearlyEarnings = await transactionModel.findAll({
                        attributes: [
                            [fn('YEAR', col('date')), 'year'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        where: { transactionType: 'Fee Payment' },
                        group: [fn('YEAR', col('date'))],
                        order: [[fn('YEAR', col('date')), 'ASC']]
                    });
    
                    const earningsMap = yearlyEarnings.reduce((acc, item) => {
                        acc[item.dataValues.year] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map(year => earningsMap[year] || 0);
                }
    
                if (dataFilter === 'bursaries') {
                    const yearlyBursaries = await bursaryModel.findAll({
                        attributes: [
                            [fn('YEAR', col('date')), 'year'],
                            [fn('SUM', col('amount')), 'totalAmount']
                        ],
                        group: [fn('YEAR', col('date'))],
                        order: [[fn('YEAR', col('date')), 'ASC']]
                    });
    
                    const bursaryMap = yearlyBursaries.reduce((acc, item) => {
                        acc[item.dataValues.year] = parseFloat(item.dataValues.totalAmount);
                        return acc;
                    }, {});
    
                    data = labels.map(year => bursaryMap[year] || 0);
                }
            }
    
            return res.status(200).json({ labels, data });
    
        } catch (error) {
            console.error('Error fetching aggregated data:', error);
            res.status(500).json({ error: 'Error fetching aggregated data.' });
        }
    }    
};

module.exports = feeController;