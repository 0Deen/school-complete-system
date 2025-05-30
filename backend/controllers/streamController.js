const streamModel = require('../models/Stream');
const { v4: uuidv4 } = require('uuid');
const category = 'Stream';
const logController = require('./logController');

const streamController = {
    create: async (req, res) => {
        try {
            const { Name } = req.body;

            if (!Name) {
                return res.status(400).json({ error: 'Name is required.' });
            }

            const existingStream = await streamModel.findOne({where:{Name}});
            if(existingStream){
                return res.status(400).json({error:"Stream exists"});
            }

            const StreamId = uuidv4();
            const stream = await streamModel.create({
                StreamId, Name,
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Stream Record",
                target:stream.StreamId
            });

            return res.status(200).json({ message: 'Stream created successfully.' });
        } catch (error) {
            console.log('An error occurred creating a stream:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { StreamId, Name } = req.body;

            const stream = await streamModel.findByPk(StreamId);
            if (!stream) {
                return res.status(400).json({ error: 'Stream not found.' });
            }

            stream.Name = Name || stream.Name;

            await stream.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Stream Record",
                target:stream.StreamId
            });

            return res.status(200).json({ message: 'Stream updated successfully.' });
        } catch (error) {
            console.log('An error occurred editing the stream:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    delete: async (req, res) => {
        try {
            const { StreamId } = req.body;

            const stream = await streamModel.findByPk(StreamId);
            if (!stream) {
                return res.status(400).json({ error: 'Stream not found.' });
            }

            await stream.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Stream Record",
                target:stream.StreamId
            });

            return res.status(200).json({ message: 'Stream deleted successfully.' });
        } catch (error) {
            console.log('An error occurred deleting the stream:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    view: async (req, res) => {
        try {
            const { StreamId } = req.body;

            const stream = await streamModel.findByPk(StreamId);
            if (!stream) {
                return res.status(400).json({ error: 'Stream not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Stream Record",
                target:stream.StreamId
            });

            return res.status(200).json(stream);
        } catch (error) {
            console.log('An error occurred viewing the stream:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const streams = await streamModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Stream Records",
                target:" "
            });

            return res.status(200).json(streams);
        } catch (error) {
            console.log('An error occurred viewing all streams:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
};

module.exports = streamController;