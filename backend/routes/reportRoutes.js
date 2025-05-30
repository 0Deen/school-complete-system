const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.post('/generate', reportController.generate);

module.exports = router;