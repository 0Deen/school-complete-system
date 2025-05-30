const { v4: uuidv4 } = require('uuid');
const Position = require('../models/position');
const specializedPositionModel = require('../models/specializedPosition');
const category = 'Position';
const logController = require('./logController');

const positionController = {
    create: async (req, res) => {
        try {
            const { Name } = req.body;

            const positionId = uuidv4();

            const newPosition = await Position.create({ positionId, Name });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Position record",
                target: newPosition.positionId
            });

            res.status(201).json({message:'Operation Sucessfull'});
        } catch (error) {
            res.status(500).json({ message: 'Error creating position', error });
        }
    },
    delete: async (req, res) => {
        try {
            const { positionId } = req.body;
            const deleted = await Position.destroy({ where: { positionId } });

            let { token } = req.body;
            token = JSON.parse(token).token;

            if (deleted) {        
                await logController.create({
                    user_id: token,category,
                    action: "Delete position record",
                    target: positionId
                });

                res.status(200).json({ message: 'Position deleted successfully' });
            } else {
                
                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting position', error });
        }
    },
    edit: async (req, res) => {
        try {
            const { positionId, Name } = req.body;
            let { token } = req.body;

            token = JSON.parse(token).token;

            const updated = await Position.update({ Name }, { where: { positionId } });
            if (updated[0] > 0) {
                await logController.create({
                    user_id: token,category,
                    action: "Edit position record",
                    target: positionId
                });

                res.status(200).json({ message: 'Position updated successfully' });
            } else {
                await logController.create({
                    user_id: token,category,
                    action: "Attempted to edit position record",
                    target: positionId
                });

                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating position', error });
        }
    },
    view: async (req, res) => {
        try {
            const { positionId } = req.body;
            const position = await Position.findOne({ where: { positionId } });
            if (position) {
                res.status(200).json(position);
            } else {
                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving position', error });
        }
    },
    viewSpecialized:async(req,res)=>{
        const { positionId } = req.body;
        const position = await Position.findOne({ where: { positionId } });
        if (!position) {
            res.status(404).json({ message: 'Position not found' });
        }
        const positions = await specializedPositionModel.findAll({where:{positionId}})

        let { token } = req.body;
            token = JSON.parse(token).token;
    
        await logController.create({
            user_id: token,category,
            action: "View Specialized Positions",
            target:positionId
        });

        res.status(200).json(positions);
    },
    viewAll: async (req, res) => {
        try {
            const positions = await Position.findAll();
            
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Specialized Positions",
                target:'All'
            });

            res.status(200).json(positions);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving positions', error });
        }
    },
    viewDetailedPosition: async (req, res) => {
        try {
            const positions = await Position.findAll({
                include: [
                    {
                        model: specializedPositionModel,
                        as: 'specializedPositions',
                        required: false,
                        limit: 1,
                    },
                ],
            });
    
            const detailedPositions = positions.map(position => {
                const { specializedPositions, ...rest } = position.toJSON();
                return {
                    ...rest,
                    specializedPosition: specializedPositions?.[0] || null, 
                };
            });
    
            res.status(200).json(detailedPositions);
        } catch (error) {
            console.error('Error retrieving detailed positions:', error);
            res.status(500).json({ message: 'Error retrieving detailed positions', error });
        }
    },
    getCounts: async (req, res) => {
        try {
            const totalPositions = await Position.count();

            return res.status(200).json({
                totalPositions
            });
        } catch (error) {
            console.error('Error getting positions counts:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
};

module.exports = positionController;