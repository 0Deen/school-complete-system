const inventoryModel = require('../models/inventory');
const inventoryCategoryModel = require('../models/inventoryCategory');
const {v4:uuidv4} = require('uuid');
const category = 'Inventory';
const logController = require('./logController');

const inventoryController = {
    create:async(req,res)=>{
        try {
            const {name, description, amount, unit, categoryId} = req.body;

            const inventory = await inventoryModel.create({
                inventoryId:uuidv4(),name,
                description,amount, unit,categoryId
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Inventory record",
                target: inventory.inventoryId
            });

            return res.status(200).json({message:'Operation Sucessfull'});
        } catch (error) {
            console.log('An error ocurred', error);
            return res.status(500).json({error:'Internal Server Error'});
        }
    },
    edit:async(req,res)=>{
        try {
            const {inventoryId, name, description, amount, unit,categoryId} = req.body;

            const inventory = await inventoryModel.findByPk(inventoryId);
            if(!inventory){
                return res.status(400).json({error:'Not Found'});
            }

            inventory.name = name || inventory.name;
            inventory.description = description || inventory.description;
            inventory.amount = amount || inventory.amount;
            inventory.unit = unit || inventory.unit;
            inventory.categoryId = categoryId || inventory.categoryId;

            await inventory.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Inventory record",
                target: inventory.inventoryId
            });
            
            return res.status(200).json({message:'Operation Sucessfull'});
        } catch (error) {
            console.log('An error ocurred', error);
            return res.status(500).json({error:'Internal Server Error'});
        }
    },
    delete:async(req,res)=>{
        try {
            const {inventoryId} = req.body;

            const inventory = await inventoryModel.findByPk(inventoryId);
            if(!inventory){
                return res.status(400).json({error:'Not Found'});
            }

            await inventory.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Inventory record",
                target: inventory.inventoryId
            });

            return res.status(200).json({message:'Operation Sucessfull'});
        } catch (error) {
            console.log('An error ocurred', error);
            return res.status(500).json({error:'Internal Server Error'});
        }
    },
    view:async(req,res)=>{
        try {
            const {inventoryId} = req.body;

            const inventory = await inventoryModel.findByPk(inventoryId);
            if(!inventory){
                return res.status(400).json({error:'Not Found'});
            }
            
            const inventoryCategory = await inventoryCategoryModel.findByPk(inventory.categoryId);
            if(!inventoryCategory){
                return res.status(400).json({error:'Not Found'});
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Inventory record",
                target: inventory.inventoryId
            });

            return res.status(200).json({Inventory: inventory, Category:inventoryCategory});
        } catch (error) {
            console.log('An error ocurred', error);
            return res.status(500).json({error:'Internal Server Error'});
        }
    },
    viewAll:async(req,res)=>{
        try {
            const inventories = await inventoryModel.findAll({
                include:{
                    model:inventoryCategoryModel,
                    as:'inventory_category'
                }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View all Inventory record",
                target: 'All'
            });

            return res.status(200).json(inventories);
        } catch (error) {
            console.log('An error ocurred', error);
            return res.status(500).json({error:'Internal Server Error'});
        }
    },
    getCount: async(req, res) => {
        try {
            const allProducts = await inventoryModel.count();
            const allCategories = await inventoryCategoryModel.count();

            return res.status(200).json({
                totalProducts: allProducts,
                totalCategories: allCategories,
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = inventoryController;