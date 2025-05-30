const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

router.post('/create', positionController.create);
router.post('/delete', positionController.delete);
router.post('/edit', positionController.edit);
router.post('/view', positionController.view);
router.post('/view-specialized', positionController.viewSpecialized);
router.post('/viewAll', positionController.viewAll);
router.post('/view-detailed-position', positionController.viewDetailedPosition);
router.post('/get-count', positionController.getCounts);

module.exports = router;