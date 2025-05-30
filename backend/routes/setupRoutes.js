const express = require('express');
const setupController = require('../controllers/setupController');

const router = express.Router();

router.post('/check', setupController.checkStatus);
router.post('/save', setupController.saveDatabase);
router.post('/test', setupController.testConnection);
router.post('/activate', setupController.activateSystem);
router.post('/initialize', setupController.initialize);

module.exports = router;