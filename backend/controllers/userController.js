const bcrypt = require('bcrypt');
const userModel = require('../models/users');
const employeeModel = require('../models/employee');
const { v4: uuidv4 } = require('uuid');
const category = 'User';
const logController = require('./logController');

const userController = {
    create: async (req, res) => {
        try {
            const { firstName, lastName, email, phone, role, status, employeeRef, password } = req.body;
            
            if (!firstName || !lastName || !email || !phone || !password) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            const existingUser = await userModel.findOne({ where: { employeeRef } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists.' });
            }

           const employee = await employeeModel.findByPk(employeeRef);
            if(!employee){
                return res.status(400).json({Error:'Employee not found'});
            }

            let uniqueId;
            let idExists = true;
            while (idExists) {
                uniqueId = uuidv4();
                const existingId = await userModel.findOne({ where: { user_id: uniqueId } });
                idExists = !!existingId;
            }
    
            const hashPass = await bcrypt.hash(password, 10);

            const user = {
                user_id: uniqueId, 
                firstName:employee.FirstName,
                lastName:employee.LastName,
                email:employee.Email,
                phone:employee.Phone,
                employeeRef,
                role, status, password: hashPass,
            }
    
            await userModel.create(user);

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: uniqueId,category,
                action: "Add User Record",
                target:user.user_id
            });
    
            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('An error occurred signing up', error);
            return res.status(500).json({ error: 'An error occurred signing up' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.'});
            }
        
            const user = await userModel.findOne({ where: { Email:email}});
    
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            if(user.status !== 'Activated'){
                return res.status(400).json({Error:"User is not activated"});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password.' });
            }

            await logController.create({
                user_id: user.user_id,category,
                action: "Login",
                target: user.user_id
            });
                
            return res.status(200).json({ message: 'Login successful.' , cookie:user.user_id});
        } catch (error) {
            console.log('An error occurred signing in', error);
            return res.status(500).json({ error: 'An error occurred logging in.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { user_id, role, status, password } = req.body;
            const user = await userModel.findByPk(user_id);
    
            if (!user) return res.status(400).json({ error: 'User not found' });
    
            user.role = role || user.role;
            user.status = status || user.status;

            if (password) user.password = await bcrypt.hash(password, 10);
    
            await user.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Edit user Record",
                target:user.user_id
            });
    
            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('Error editing user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    /* edit: async (req, res) => {
        try {
        const { user_id, firstName, lastName, email, phone, employeeRef, role, status, password, confirmPassword } = req.body;

        if (password && password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await userModel.findByPk(user_id);
    
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.employeeRef = employeeRef || user.employeeRef;
        user.role = role || user.role;
        user.status = status || user.status;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
    
        await user.save();

        let { token } = req.body;
        token = JSON.parse(token).token;

        await logController.create({
            user_id: token,
            category: 'Edit',
            action: "Edit user Record",
            target: user.user_id
        });
    
        return res.status(200).json({ message: 'Operation Success' });
    } catch (error) {
        console.log('Error editing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} */    
    delete: async (req, res) => {
        try {
            const { user_id } = req.body;
            const user = await userModel.findByPk(user_id);
    
            if (!user) return res.status(404).json({ error: 'User not found.' });
    
            await user.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Delete user Record",
                target:user.user_id
            });
    
            return res.status(200).json({ message: 'User deleted successfully.' });
        } catch (error) {
            console.log('Error deleting user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    view: async (req, res) => {
        try {
            const { user_id } = req.body;
            const user = await userModel.findByPk(user_id);
    
            if (!user) return res.status(404).json({ error: 'User not found.' });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View user Record",
                target:user.user_id
            });
    
            return res.status(200).json(user);
        } catch (error) {
            console.log('Error fetching user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const users = await userModel.findAll();
            
            //employees

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View User Records",
                target: token
            });
    
            return res.status(200).json(users);
        } catch (error) {
            console.log('Error fetching users:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;