const voteheadModel = require('../models/votehead');
const { v4: uuidv4 } = require('uuid');
const termModel = require('../models/term');
const yearModel = require('../models/academicYear');
const { Op } = require('sequelize');
const category = 'Voteheads';
const logController = require('./logController');

const voteheadController = {
    create: async (req, res) => {
        try {
            const { Name, Amount, termId, Priority } = req.body;

            if (!Name || !Amount || !Priority || !termId) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            const term = await termModel.findByPk(termId);
            if (!term) {
                return res.status(400).json({ error: 'Term not found' });
            }

            const year = await yearModel.findByPk(term.academicYear);

            let uniqueId;
            let idExists = true;
            while (idExists) {
                uniqueId = uuidv4();
                const existingId = await voteheadModel.findOne({ where: { id: uniqueId } });
                idExists = !!existingId;
            }

            const newVotehead = await voteheadModel.create({
                id: uniqueId,
                Name,
                Amount,
                termId,
                Priority,
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Create Votehead Record",
                target:newVotehead.id
            });

            return res.status(201).json({ message: 'Votehead created successfully.', votehead: newVotehead });
        } catch (error) {
            console.error('Error creating Votehead:', error);
            return res.status(500).json({ error: 'Failed to create Votehead.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { id, Name, Amount, termId, Priority } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'Votehead ID is required.' });
            }

            const votehead = await voteheadModel.findByPk(id);
            if (!votehead) {
                return res.status(404).json({ error: 'Votehead not found.' });
            }

            votehead.Name = Name || votehead.Name;
            votehead.Amount = Amount || votehead.Amount;
            votehead.termId = termId || votehead.termId;
            votehead.Priority = Priority || votehead.Priority;

            await votehead.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Edit Votehead Record",
                target:votehead.id
            });

            return res.status(200).json({ message: 'Votehead updated successfully.', votehead });
        } catch (error) {
            console.error('Error updating Votehead:', error);
            return res.status(500).json({ error: 'Failed to update Votehead.' });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'Votehead ID is required.' });
            }

            const votehead = await voteheadModel.findByPk(id);
            if (!votehead) {
                return res.status(404).json({ error: 'Votehead not found.' });
            }

            await votehead.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "Delete Votehead Record",
                target:votehead.id
            });

            return res.status(200).json({ message: 'Votehead deleted successfully.' });
        } catch (error) {
            console.error('Error deleting Votehead:', error);
            return res.status(500).json({ error: 'Failed to delete Votehead.' });
        }
    },
    view: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'Votehead ID is required.' });
            }

            const voteheadElement = await voteheadModel.findByPk(id);
            if (!voteheadElement) {
                return res.status(404).json({ error: 'Votehead not found.' });
            }

            const termElement = await termModel.findByPk(voteheadElement.termId);
            if (!termElement) {
                return res.status(404).json({ error: 'Associated term not found.' });
            }

            const yearElement = await yearModel.findByPk(termElement.academicYear);
            if (!yearElement) {
                return res.status(404).json({ error: 'Associated academic year not found.' });
            }

            const result = {
                votehead: voteheadElement,
                term: termElement,
                year: yearElement,
            };

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View Votehead Record",
                target:id
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching Votehead:', error);
            return res.status(500).json({ error: 'Failed to fetch Votehead.' });
        }
    },
    viewTerm: async (req, res) => {
        try {
            const { termId } = req.body;
            if (!termId) {
                return res.status(400).json({ error: 'Term ID is required.' });
            }

            const termElement = await termModel.findByPk(termId);
            if (!termElement) {
                return res.status(404).json({ error: 'Term not found.' });
            }

            const yearElement = await yearModel.findByPk(termElement.academicYear);
            if (!yearElement) {
                return res.status(404).json({ error: 'Associated academic year not found.' });
            }

            const voteheads = await voteheadModel.findAll({ where: { termId } });
            const result = {
                term: termElement,
                year: yearElement,
                voteheads,
            };

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View By Term",
                target:"All"
            });

            return res.status(200).json(result);
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewYear: async (req, res) => {
        try {
            const { yearId } = req.body;
            if (!yearId) {
                return res.status(400).json({ error: 'Year ID is required.' });
            }

            const yearElement = await yearModel.findByPk(yearId);
            if (!yearElement) {
                return res.status(404).json({ error: 'Academic year not found.' });
            }

            const terms = await termModel.findAll({ where: { academicYear: yearId } });
            const termIds = terms.map(term => term.termId);

            const voteheads = await voteheadModel.findAll({ where: { termId: termIds } });

            const result = {
                year: yearElement,
                terms,
                voteheads,
            };

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View By Year",
                target:"All"
            });

            return res.status(200).json(result);
        } catch (error) {
            console.log('An error occurred', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const voteheads = await voteheadModel.findAll({
                include: [
                    {
                        model: termModel,
                        as: 'term',
                        include: [
                            {
                                model: yearModel,
                                as: 'academic_year',
                            },
                        ],
                    },
                ],
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,category,
                action: "View All Records",
                target:"All"
            });

            return res.status(200).json(voteheads);
        } catch (error) {
            console.error('Error fetching Voteheads:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewDetailed: async (req, res) => {
        try {
            const { term, year } = req.body;
    
            let whereClause = {};
    
            if (year) {
                const yearRecord = await yearModel.findOne({ where: { id: year } });
                
                if (yearRecord) {
                    const terms = await termModel.findAll({ where: { academicYear: yearRecord.id } });
            
                    if (terms.length === 0) {
                        return res.status(200).json([]);
                    }
            
                    const termIds = terms.map(term => term.termId);
            
                    if (term) {
                        const termRecord = await termModel.findOne({
                            where: { value: term, academicYear: yearRecord.id }
                        });
            
                        if (termRecord && termIds.includes(termRecord.termId)) {
                            whereClause.termId = termRecord.termId;
                        } else {
                            return res.status(200).json([]);
                        }
                    } else {
                        whereClause.termId = { [Op.in]: termIds };
                    }
                } else {
                    return res.status(404).json({ message: `Year ${year} not found.` });
                }
            } else if (term) {
                const termRecord = await termModel.findOne({ where: { value: term } });
            
                if (termRecord) {
                    whereClause.termId = termRecord.termId;
                } else {
                    return res.status(200).json([]);
                }
            }
            
            const voteheads = await voteheadModel.findAll({
                where: whereClause,
                include: [
                    {
                        model: termModel,
                        as: 'term',
                        include: [
                            {
                                model: yearModel,
                                as: 'academic_year',
                            },
                        ],
                    },
                ],
            });
    
            const voteheadsArray = Array.isArray(voteheads) ? voteheads : [];
    
            return res.status(200).json(voteheadsArray);
    
        } catch (error) {
            console.error('Error fetching filtered Voteheads:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
};

module.exports = voteheadController;
