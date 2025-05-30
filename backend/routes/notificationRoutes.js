const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationController');

router.post('/create', notificationsController.create);
router.post('/edit', notificationsController.edit);
router.post('/view', notificationsController.view);
router.post('/delete', notificationsController.delete);
router.post('/viewAll', notificationsController.viewAll);
router.post('/viewUpcoming', notificationsController.viewUpcoming);
router.post('/viewTodaysNotifications', notificationsController.viewTodaysNotifications);
router.post('/viewPastNotifications', notificationsController.viewPastNotifications);

module.exports = router;