const categoryModel = require('../models/inventoryCategory');
const {v4:uuidv4} = require('uuid');
const category = 'Inventory Category';
const logController = require('./logController');

const inventoryCategoryController = {
    create:async(req,res)=>{
        try {
            const {name, description} = req.body;
            const inventoryCategory = await categoryModel.create({
                categoryId:uuidv4(),
                name, description
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Inventory Category record",
                target: inventoryCategory.categoryId
            });

            return res.status(200).json({message:'Operation sucessfuill'});
        } catch (error) {
            console.log('An error ocurred',error);
            return res.status(500).json({error:'Internal Server Error'})
        }
    },
    edit:async(req,res)=>{
        try {
            const {categoryId, name, description} = req.body;

            const category = await categoryModel.findByPk(categoryId);

            category.name = name || category.name;
            category.description = description || category.description;

            await category.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Inventory Category record",
                target: category.categoryId
            });

            return res.status(200).json({message:'Operation sucessfuill'});
        } catch (error) {
            console.log('An error ocurred',error);
            return res.status(500).json({error:'Internal Server Error'})
        }
    },
    delete:async(req,res)=>{
        try {
            const {categoryId} = req.body;

            const category = await categoryModel.findByPk(categoryId);

            await category.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Inventory Category record",
                target: category.categoryId
            });

            return res.status(200).json({message:'Operation sucessfuill'});
        } catch (error) {
            console.log('An error ocurred',error);
            return res.status(500).json({error:'Internal Server Error'})
        }
    },
    view:async(req,res)=>{
        try {
            const {categoryId} = req.body;

            const category = await categoryModel.findByPk(categoryId);
            if(!category){
                return res.status(400).json({error:'Not found'});
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Inventory Category record",
                target: category.categoryId
            });

            return res.status(200).json(category);
        } catch (error) {
            console.log('An error ocurred',error);
            return res.status(500).json({error:'Internal Server Error'})
        }
    },
    viewAll:async(req,res)=>{
        try {
            const categories = await categoryModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View all Inventory Category record",
                target: 'All'
            });

            return res.status(200).json(categories);
        } catch (error) {
            console.log('An error ocurred',error);
            return res.status(500).json({error:'Internal Server Error'})
        }
    }
}

module.exports = inventoryCategoryController;