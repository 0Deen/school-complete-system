const { Op } = require('sequelize');
const Student = require('../models/student'); 
const accountModel = require('../models/Account')
const Suppliers = require('../models/supplier');
const Transaction = require('../models/transaction');
const payrollModel = require('../models/payroll');
const employeeModel = require('../models/employee');  
const SpecializedPositionModel = require('../models/specializedPosition');
const bankModel = require('../models/bank');
const logController = require('./logController');

const category = 'Reports';

const reportController = {
    generate: async (req, res) => {
        try {
            const { reportType, token } = req.body;

            let reportData = [];
            switch (reportType) {
                case 'transaction':
                    reportData = await Transaction.findAll( {
                        include: [
                            {
                                model: accountModel,
                                as: 'account',
                                include: [
                                    {model: bankModel, as:'bank'},
                                ]
                            }
                        ]
                    });
                    break;

                case 'payroll':
                    reportData = await payrollModel.findAll({
                        include: [
                            {
                                model: employeeModel,
                                as: 'employee',
                                include: [
                                    {
                                        model: SpecializedPositionModel,
                                        as: 'specializedPosition',
                                    },
                                ],
                            },
                        ],
                    });                                  
                    break;

                case 'students':
                    reportData = await Student.findAll();
                    break;

               case 'suppliers':
                    reportData = await Suppliers.findAll();
                    break;

                default:
                    return res.status(400).json({ error: 'Invalid report type' });
            }

            const parsedToken = JSON.parse(token).token;
            await logController.create({
                user_id: parsedToken,
                category,
                action: `Generate ${reportType} Report`,
                target: reportType,
            });

            return res.status(200).json({ reportType, reportData });
        } catch (error) {
            console.error('Error generating report:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = reportController;
