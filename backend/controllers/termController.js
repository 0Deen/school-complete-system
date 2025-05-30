const termModel = require('../models/term');
const yearModel = require('../models/academicYear');
const { v4: uuidv4 } = require('uuid');
const category = 'Terms';
const logController = require('./logController');

const termController = {
    create: async (req, res) => {
        try {
            const { value, startDate, endDate, academicYear } = req.body;
            if (!value || !startDate || !endDate || !academicYear) {
                return res.status(400).json({ error: 'All fields (value, startDate, endDate, academicYear) are required.' });
            }

            const year = await yearModel.findByPk(academicYear);
            if (!year) {
                return res.status(404).json({ error: 'Academic year not found.' });
            }

            const termId = uuidv4();
            const term = await termModel.create({
                termId,
                value,
                startDate,
                endDate,
                academicYear
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Create Term Record",
                target:term.termId
            });

            return res.status(200).json({ message: 'Term created successfully.' });
        } catch (error) {
            console.error('Error creating term:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { termId, value, startDate, endDate, academicYear } = req.body;
            const term = await termModel.findByPk(termId);

            if (!term) {
                return res.status(404).json({ error: 'Term not found.' });
            }

            if (academicYear) {
                const year = await yearModel.findByPk(academicYear);
                if (!year) {
                    return res.status(404).json({ error: 'Academic year not found.' });
                }
            }

            term.value = value || term.value;
            term.startDate = startDate || term.startDate;
            term.endDate = endDate || term.endDate;
            term.academicYear = academicYear || term.academicYear;

            await term.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Edit Term Record",
                target:term.termId
            });

            return res.status(200).json({ message: 'Term updated successfully.' });
        } catch (error) {
            console.error('Error updating term:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    delete: async (req, res) => {
        try {
            const { termId } = req.body;
            const term = await termModel.findByPk(termId);
            if (!term) {
                return res.status(404).json({ error: 'Term not found.' });
            }

            await term.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Delete Term Record",
                target:term.termId
            });

            return res.status(200).json({ message: 'Term deleted successfully.' });
        } catch (error) {
            console.error('Error deleting term:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    view: async (req, res) => {
        try {
            const { termId } = req.body;
            const term = await termModel.findByPk(termId, {
                include: yearModel
            });

            if (!term) {
                return res.status(404).json({ error: 'Term not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Term Record",
                target:term.termId
            });

            return res.status(200).json(term);
        } catch (error) {
            console.error('Error retrieving term:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewByYear: async (req, res) => {
        try {
            const { yearId } = req.body;
    
            const year = await yearModel.findByPk(yearId);
    
            if (!year) {
                return res.status(404).json({ error: 'Academic year not found.' });
            }
    
            const terms = await termModel.findAll({
                where: { academicYear: yearId }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Terms By year Record",
                target:"All"
            });
    
            return res.status(200).json({ year, terms });
        } catch (error) {
            console.error('Error retrieving terms by year:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const termItems = await termModel.findAll();
    
            let terms = [];
    
            for (const termItem of termItems) {
                const academicYear = await yearModel.findByPk(termItem.academicYear);
    
                const term = {
                    term: termItem,
                    academicYear
                };
    
                terms.push(term);
            }

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View All Terms Records",
                target:"All"
            });
    
            return res.status(200).json(terms);
        } catch (error) {
            console.error('Error retrieving terms:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }    
};

module.exports = termController;