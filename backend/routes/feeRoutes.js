const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

router.post('/create', feeController.create);
router.post('/edit', feeController.edit);
router.post('/delete', feeController.delete);
router.post('/view', feeController.view);
router.post('/view-detailed', feeController.viewDetailed);
router.post('/view-all-detailed', feeController.viewAllDetailed);
router.post('/viewAll', feeController.viewAll);
router.post('/get-count', feeController.feeCount);
router.post('/get-chart', feeController.getAggregatedData);

module.exports = router;