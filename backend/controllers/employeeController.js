const employeeModel = require('../models/employee');
const positionModel = require('../models/position');
const specializedPositionModel = require('../models/specializedPosition');
const { v4: uuidv4 } = require('uuid');
const category = 'Employee';
const logController = require('./logController');

const employeeController = {
    create: async (req, res) => {
        try {
            const { FirstName, LastName, PositionId, Email, Phone } = req.body;

            if (!FirstName || !LastName || !PositionId || !Phone) {
                return res.status(400).json({ error: 'Please provide all required fields.' });
            }

            const position = await specializedPositionModel.findByPk(PositionId);
            if (!position) {
                return res.status(400).json({ error: "Specialized Position not found." });
            }

            const EmployeeID = uuidv4();

            const employee = await employeeModel.create({
                EmployeeID, FirstName, LastName, 
                PositionId, Email, Phone
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Employee",
                target: employee.exployeeID
            });

            return res.status(200).json({ message: 'Employee created successfully.', employee:{EmployeeID, FirstName, LastName} });
        } catch (error) {
            console.error('Error creating employee:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { EmployeeID, FirstName, LastName, PositionId, Email, Phone } = req.body;

            const employee = await employeeModel.findByPk(EmployeeID);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found.' });
            }

            if (PositionId) {
                const position = await specializedPositionModel.findByPk(PositionId);
                if (!position) {
                    return res.status(400).json({ error: "Specialized Position not found." });
                }
                employee.PositionId = PositionId;
            }

            employee.FirstName = FirstName || employee.FirstName;
            employee.LastName = LastName || employee.LastName;
            employee.Email = Email || employee.Email;
            employee.Phone = Phone || employee.Phone;

            await employee.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Employee",
                target: employee.exployeeID
            });

            return res.status(200).json({ message: 'Employee updated successfully.', employee });
        } catch (error) {
            console.error('Error updating employee:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    delete: async (req, res) => {
        try {
            const { EmployeeID } = req.body;

            const employee = await employeeModel.findByPk(EmployeeID);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found.' });
            }
            await employee.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Employee",
                target: employee.exployeeID
            });

            return res.status(200).json({ message: 'Employee deleted successfully.' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    view: async (req, res) => {
        try {
            const { EmployeeID } = req.body;

            const employee = await employeeModel.findByPk(EmployeeID, {
                include: [{ model: specializedPositionModel, as: 'specializedPosition' }]
            });
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Employee",
                target: employee.exployeeID
            });

            return res.status(200).json(employee);
        } catch (error) {
            console.error('Error retrieving employee:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const employees = await employeeModel.findAll({
                include: [{ model: specializedPositionModel, as: 'specializedPosition' }]
            });
    
            let { token } = req.body;

            
            if (!req.body || !req.body.token) {
                return res.status(400).json({ error: 'Token is missing or invalid.' });
            }
            
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View All Employees",
                target: "all"
            });

            return res.status(200).json(employees);
        } catch (error) {
            console.error('Error retrieving employees:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    findByPosition: async (req, res) => {
        try {
            const { PositionId } = req.body;


            if (!PositionId) {
                return res.status(400).json({ error: 'Please provide a PositionId.' });
            }

            const employees = await employeeModel.findAll({ 
                where: { PositionId },
                include: [{ model: specializedPositionModel, as: 'specializedPosition' }]
            });

            if (employees.length === 0) {
                return res.status(404).json({ error: 'No employees found with the given Specialized Position.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Employees By Position",
                target: "All"
            });

            return res.status(200).json(employees);
        } catch (error) {
            console.error('Error finding employees by Specialized Position:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    findByPositionName: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Please provide a position name.' });
            }

            const position = await specializedPositionModel.findOne({ where: { name } });
            if (!position) {
                return res.status(404).json({ error: 'Specialized Position not found.' });
            }

            const employees = await employeeModel.findAll({ where: { PositionId: position.id } });

            if (employees.length === 0) {
                return res.status(404).json({ error: 'No employees found with the given Specialized Position name.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Searched by Position Name",
                target: "All"
            });

            return res.status(200).json(employees);
        } catch (error) {
            console.error('Error finding employees by Specialized Position name:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    getDetailedEmployees: async (req, res) => {
        try {
            const employees = await employeeModel.findAll({
                include: [{ model: specializedPositionModel, as: 'specializedPosition' }]
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Detailed Employees",
                target: "All"
            });

            return res.status(200).json(employees);
        } catch (error) {
            console.error('Error fetching detailed employees:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    getCounts: async (req, res) => {
        try {
            const totalEmployees = await employeeModel.count();

            return res.status(200).json({
                totalEmployees
            });
        } catch (error) {
            console.error('Error getting employee counts:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
};

module.exports = employeeController;
