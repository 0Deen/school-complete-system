const express = require('express');
const router = express.Router();
const specializedPositionController = require('../controllers/specializedPositionController');

router.post('/create', specializedPositionController.create);
router.post('/edit', specializedPositionController.edit);
router.post('/delete', specializedPositionController.delete);
router.post('/view', specializedPositionController.view);
router.post('/viewAll', specializedPositionController.viewAll);
router.post('/view-position', specializedPositionController.viewPosition);

module.exports = router;