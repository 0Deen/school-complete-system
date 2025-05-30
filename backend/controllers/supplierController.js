const supplierModel = require('../models/supplier');
const { v4: uuidv4 } = require('uuid');
const category = 'Suppliers';
const logController = require('./logController');

const supplierController = {
    create: async (req, res) => {
        try {
            const { Name, phone, email, products } = req.body;

            if (!Name || !phone || !email || !products) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const supplier = await supplierModel.create({
                supplierId: uuidv4(),Name,
                phone,email,products
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Supplier Record",
                target:supplier.supplierId
            });

            return res.status(200).json({ message: 'Operation Success' });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { supplierId } = req.body;

            if (!supplierId) {
                return res.status(400).json({ error: 'Supplier ID is required' });
            }

            const supplier = await supplierModel.findByPk(supplierId);

            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }

            await supplier.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Delete Supplier Record",
                target:supplier.supplierId
            });

            return res.status(200).json({ message: 'Operation Successful' });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { supplierId, Name, phone, email, products } = req.body;

            if (!supplierId) {
                return res.status(400).json({ error: 'Supplier ID is required' });
            }

            const supplier = await supplierModel.findByPk(supplierId);

            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }

            supplier.Name = Name || supplier.Name;
            supplier.phone = phone || supplier.phone;
            supplier.email = email || supplier.email;
            supplier.products = products || supplier.products;

            await supplier.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Edit Supplier Record",
                target:supplier.supplierId
            });

            return res.status(200).json({ message: 'Supplier updated successfully' });
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { supplierId } = req.body;

            if (!supplierId) {
                return res.status(400).json({ error: 'Supplier ID is required' });
            }

            const supplier = await supplierModel.findByPk(supplierId);

            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Supplier Record",
                target:supplier.supplierId
            });

            return res.status(200).json(supplier);
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const suppliers = await supplierModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View All Suppliers Records",
                target:"All"
            });

            return res.status(200).json(suppliers);
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewProduct: async (req, res) => {
        try {
            const { product } = req.body;

            if (!product) {
                return res.status(400).json({ error: 'Product name is required' });
            }

            const suppliers = await supplierModel.findAll({
                where: {
                    products: sequelize.where(sequelize.fn('LOWER', sequelize.col('products')), 'LIKE', `%${product.toLowerCase()}%`)
                }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Supplier product Record",
                target:"All"
            });

            return res.status(200).json(suppliers);
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCount: async(req, res) => {
        try {
            const allSuppliers = await supplierModel.count();

            return res.status(200).json({
                totalSuppliers : allSuppliers,
            }); 
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = supplierController;