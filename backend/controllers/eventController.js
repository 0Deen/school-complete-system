const { v4: uuidv4 } = require('uuid');
const eventModel = require('../models/events');
const logController = require('./logController');
const category = 'Events';

const eventController = {
    create: async (req, res) => {
        try {
            const { Title, Description, eventDate, Location, Time } = req.body;

            if (!Title || !Description || !Date || !Location || !Time) {
                return res.status(400).json({ error: 'Please fill all required fields' });
            }

            let formattedDate = eventDate;

            if (isNaN(new Date(formattedDate))) {
                return res.status(400).json({ error: 'Invalid Date format' });
            }

            const formattedTime = Time; 

            const EventID = uuidv4();

            const event = await eventModel.create({
                EventID,
                Title,
                Description,
                Date: formattedDate, 
                Location,
                Time: formattedTime 
            });

            let { token } = req.body;
            token = JSON.parse(token).token;

            const logResult = await logController.create({
                user_id: token,
                category,
                action: "Add Event",
                target: event.EventID
            });

            if (!logResult) {
                await event.destroy();
                return res.status(400).json({ error: 'An error occurred while creating the log' });
            }

            return res.status(200).json({ message: 'Event created successfully', event });
        } catch (error) {
            console.error('An error occurred when creating an event', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { EventID } = req.body;

            const event = await eventModel.findByPk(EventID);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            await event.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,
                category,
                action: "Delete Event",
                target: EventID
            });

            return res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error('An error occurred when deleting an event', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { EventID, Title, Description, Date, Location, Time } = req.body;
            
            const event = await eventModel.findByPk(EventID);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            event.Title = Title || event.Title;
            event.Description = Description || event.Description;
            event.Date = Date || event.Date;
            event.Location = Location || event.Location;
            event.Time = Time || event.Time;

            await event.save();

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,
                category,
                action: "Edit Event",
                target: EventID
            });

            return res.status(200).json({ message: 'Event updated successfully', event });
        } catch (error) {
            console.error('An error occurred when updating an event', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { EventID } = req.body;

            const event = await eventModel.findByPk(EventID);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;

            await logController.create({
                user_id: token,
                category,
                action: "View Event",
                target: EventID
            });

            return res.status(200).json(event);
        } catch (error) {
            console.error('An error occurred when viewing an event', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const events = await eventModel.findAll();

            return res.status(200).json(events);
        } catch (error) {
            console.error('An error occurred when viewing all events', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCount : async(req, res) => {
        try {
            const allEvents = await eventModel.count();

            return res.status(200).json({
                allEvents,
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = eventController;
