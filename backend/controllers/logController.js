const logsModel = require('../models/logs');
const {v4:uuidv4} = require('uuid');

const logController = {
    create: async (log) => {
        try {
            const { user_id, category, action, target } = log;
    
            await logsModel.create({
                logId: uuidv4(),
                user_id,
                category,
                action,
                target
            });
    
            return true;
        } catch (error) {
            console.error('Error creating log:', error);
            return false;
        }
    },
    viewAll:async(req,res)=>{

    },
    viewUser:(user)=>{

    },
    delete:()=>{

    }
}

module.exports = logController;