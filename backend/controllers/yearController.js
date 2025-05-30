const yearModel = require('../models/academicYear');
const {v4:uuidv4} = require('uuid');
const category = 'Year';
const logController = require('./logController');

const yearController = {
    create:async(req,res)=>{
        try {
            const { startDate, endDate, terms, yearName } = req.body;

            let termValue = terms || 0;

            let name = yearName 
                || (startDate.split("-")[0] === endDate.split("-")[0]
                    ? startDate.split("-")[0]
                    : `${startDate.split("-")[0]}/${endDate.split("-")[0]}`);

            const year = await yearModel.create({
                id: uuidv4(),
                yearName: name,
                startDate,
                endDate,
                terms: termValue
            });


            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Add Year Record",
                target: year.id
            });

            return res.status(200).json({message:'success'});
        } catch (error) {
            console.log('An error ocurred year', error);
            return res.status(500).json({error:'Internal server error'});
        }
    },
    delete:async(req,res)=>{
        try {
            const {id} = req.body;
            const year = await yearModel.findByPk(id);
            if(!year){
                return res.status(400).json({error:'No such year found'})
            }

            await year.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Delete Year Record",
                target: year.id
            });

            return res.status(200).json({message:'success'});
        } catch (error) {
            console.log('An error ocurred adding year', error);
            return res.status(500).json({error:'Internal server error'});
        }
    },
    edit:async(req,res)=>{
        try {
            const {id, yearName, startDate, endDate,terms} = req.body;

            const yearItem = await yearModel.findByPk(id);
            if(!yearItem){
                return res.status(400).json({error:'No such year found'})
            }

            yearItem.yearName = yearName || yearItem.year;
            yearItem.startDate = startDate || yearItem.startDate;
            yearItem.endDate = endDate || yearItem.endDate;
            yearItem.terms = terms || yearItem.terms;

            await yearItem.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Edit Year Record",
                target: yearItem.id
            });


            return res.status(200).json({message:'success'});
        } catch (error) {
            console.log('An error ocurred year');
            return res.status(500).json({error:'Internal server error'});
        }
    },
    view: async (req, res) => {
        try {
            const { id } = req.body;
            const year = await yearModel.findByPk(id);

            if (!year) {
                return res.status(400).json({ error: 'No such year found' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Year Record",
                target: year.id
            });


            return res.status(200).json({ year });
        } catch (error) {
            console.log('An error occurred while retrieving year:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const years = await yearModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View all Records",
                target: "All"
            });

            return res.status(200).json(years);
        } catch (error) {
            console.log('An error occurred while retrieving years:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = yearController;